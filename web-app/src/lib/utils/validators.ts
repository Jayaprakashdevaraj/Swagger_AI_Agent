import { z } from 'zod'

const headerRowSchema = z.object({
  key: z.string().trim(),
  value: z.string().trim(),
})

const authTypeSchema = z.enum(['none', 'basic', 'bearer', 'apiKey', 'oauth2'])

export const environmentSchema = z
  .object({
    specId: z.string().min(1, 'Specification is required'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().optional(),
    baseUrl: z
      .string()
      .url('Must be a valid URL')
      .refine((value) => value.startsWith('https://'), 'Must use HTTPS'),
    authType: authTypeSchema,
    username: z.string().optional(),
    password: z.string().optional(),
    token: z.string().optional(),
    apiKeyName: z.string().optional(),
    apiKeyValue: z.string().optional(),
    apiKeyIn: z.enum(['header', 'query']).optional(),
    defaultHeaders: z.array(headerRowSchema),
  })
  .superRefine((values, context) => {
    if (values.authType === 'basic') {
      if (!values.username?.trim()) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Username is required for Basic auth',
          path: ['username'],
        })
      }

      if (!values.password?.trim()) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password is required for Basic auth',
          path: ['password'],
        })
      }
    }

    if (values.authType === 'bearer' && !values.token?.trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Token is required for Bearer auth',
        path: ['token'],
      })
    }

    if (values.authType === 'apiKey') {
      if (!values.apiKeyName?.trim()) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'API key name is required',
          path: ['apiKeyName'],
        })
      }

      if (!values.apiKeyValue?.trim()) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'API key value is required',
          path: ['apiKeyValue'],
        })
      }
    }

    const seenHeaders = new Set<string>()
    for (let index = 0; index < values.defaultHeaders.length; index += 1) {
      const row = values.defaultHeaders[index]
      const normalizedKey = row.key.trim().toLowerCase()
      const hasKey = normalizedKey !== ''
      const hasValue = row.value.trim() !== ''

      if (hasKey !== hasValue) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Header key and value must both be provided',
          path: ['defaultHeaders', index],
        })
      }

      if (hasKey) {
        if (seenHeaders.has(normalizedKey)) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Duplicate header keys are not allowed',
            path: ['defaultHeaders', index, 'key'],
          })
        }
        seenHeaders.add(normalizedKey)
      }
    }
  })

export type EnvironmentSchemaInput = z.input<typeof environmentSchema>
export type EnvironmentSchemaValues = z.output<typeof environmentSchema>