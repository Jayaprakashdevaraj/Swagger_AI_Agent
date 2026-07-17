import { EnvironmentConfig, AuthConfig } from '../../domain/models/EnvironmentConfig';
import { EnvironmentRepository } from '../../domain/repositories/EnvironmentRepository';
export interface UpdateEnvironmentInput {
    envId: string;
    baseUrl?: string;
    defaultHeaders?: Record<string, string>;
    authConfig?: AuthConfig;
}
export declare class UpdateEnvironmentUseCase {
    private readonly environmentRepository;
    constructor(environmentRepository: EnvironmentRepository);
    execute(input: UpdateEnvironmentInput): Promise<EnvironmentConfig>;
}
//# sourceMappingURL=updateEnvironment.usecase.d.ts.map