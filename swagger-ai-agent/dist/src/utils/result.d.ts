export interface SuccessResult<T> {
    ok: true;
    value: T;
}
export interface FailureResult<E> {
    ok: false;
    error: E;
}
export type Result<T, E> = SuccessResult<T> | FailureResult<E>;
export declare function ok<T>(value: T): SuccessResult<T>;
export declare function err<E>(error: E): FailureResult<E>;
export declare function isOk<T, E>(result: Result<T, E>): result is SuccessResult<T>;
export declare function isErr<T, E>(result: Result<T, E>): result is FailureResult<E>;
//# sourceMappingURL=result.d.ts.map