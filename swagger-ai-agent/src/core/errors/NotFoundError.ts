import { AppError } from './AppError';

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    const message = id
      ? `${resource} with id '${id}' was not found`
      : `${resource} was not found`;
    super(message, 404, 'NOT_FOUND');
  }
}
