export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function getSchemaExample(schema: Record<string, unknown>): unknown {
  if ('example' in schema) {
    return schema.example;
  }

  if ('default' in schema) {
    return schema.default;
  }

  const enumValues = Array.isArray(schema.enum) ? schema.enum : undefined;
  return enumValues && enumValues.length > 0 ? enumValues[0] : undefined;
}

export function getRequiredPropertyNames(schema: Record<string, unknown>): string[] {
  return Array.isArray(schema.required)
    ? schema.required.filter((field): field is string => typeof field === 'string')
    : [];
}