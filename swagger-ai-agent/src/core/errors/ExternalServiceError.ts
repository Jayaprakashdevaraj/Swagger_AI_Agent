import { AppError } from './AppError';

export class ExternalServiceError extends AppError {
  public readonly service: string;

  constructor(service: string, message: string, cause?: Error) {
    super(`External service error [${service}]: ${message}`, 502, 'EXTERNAL_SERVICE_ERROR');
    this.service = service;
    if (cause) {
      this.stack = `${this.stack}\nCaused by: ${cause.stack}`;
    }
  }
}
