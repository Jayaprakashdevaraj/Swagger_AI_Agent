export interface SuccessResult<T> {
  ok: true;
  value: T;
}

export interface FailureResult<E> {
  ok: false;
  error: E;
}

export type Result<T, E> = SuccessResult<T> | FailureResult<E>;

export function ok<T>(value: T): SuccessResult<T> {
  return { ok: true, value };
}

export function err<E>(error: E): FailureResult<E> {
  return { ok: false, error };
}

export function isOk<T, E>(result: Result<T, E>): result is SuccessResult<T> {
  return result.ok;
}

export function isErr<T, E>(result: Result<T, E>): result is FailureResult<E> {
  return !result.ok;
}