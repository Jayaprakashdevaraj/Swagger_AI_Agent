export interface PayloadBuildPrompt {
  schema: Record<string, unknown>;
  requiredFields: string[];
  hints?: Record<string, string>;
}

export interface PayloadBuildResult {
  payload: Record<string, unknown>;
  model: string;
}

/**
 * Abstraction for LLM-assisted payload synthesis.
 * Phase 3: placeholder implementation.
 */
export class PayloadBuilderLlmClient {
  async buildPayload(prompt: PayloadBuildPrompt): Promise<PayloadBuildResult> {
    const payload: Record<string, unknown> = {};

    // Phase 9 mock LLM adapter: fills only unresolved required fields.
    for (const fieldPath of prompt.requiredFields) {
      const value = this.pickHintValue(fieldPath, prompt.hints);
      this.assignPath(payload, fieldPath, value);
    }

    return {
      payload,
      model: 'mock-schema-assist-v1',
    };
  }

  private pickHintValue(fieldPath: string, hints?: Record<string, string>): string {
    const leaf = fieldPath.split('.').pop() ?? fieldPath;
    if (hints && typeof hints[fieldPath] === 'string' && hints[fieldPath].trim() !== '') {
      return hints[fieldPath];
    }

    if (hints && typeof hints[leaf] === 'string' && hints[leaf].trim() !== '') {
      return hints[leaf];
    }

    return `sample-${leaf}`;
  }

  private assignPath(target: Record<string, unknown>, path: string, value: unknown): void {
    const parts = path.split('.').filter((part) => part.trim() !== '');
    if (parts.length === 0) {
      return;
    }

    let cursor: Record<string, unknown> = target;
    for (let index = 0; index < parts.length; index += 1) {
      const part = parts[index];
      const isLeaf = index === parts.length - 1;

      if (isLeaf) {
        cursor[part] = value;
        return;
      }

      if (typeof cursor[part] !== 'object' || cursor[part] === null || Array.isArray(cursor[part])) {
        cursor[part] = {};
      }

      cursor = cursor[part] as Record<string, unknown>;
    }
  }
}
