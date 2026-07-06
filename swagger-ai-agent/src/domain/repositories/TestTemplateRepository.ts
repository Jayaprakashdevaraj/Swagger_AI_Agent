/**
 * Repository interface for PayloadTemplate persistence.
 * Domain layer — implementations live in infrastructure/persistence.
 */

import { PayloadTemplate } from '../models/PayloadTemplate';

export interface TestTemplateRepository {
  /** Persist a payload template. */
  save(template: PayloadTemplate): Promise<PayloadTemplate>;

  /** Find templates for a given operationId. */
  findByOperationId(operationId: string): Promise<PayloadTemplate[]>;

  /** Find a template by its unique id. */
  findById(id: string): Promise<PayloadTemplate | undefined>;

  /** Delete a template by id. */
  delete(id: string): Promise<boolean>;
}
