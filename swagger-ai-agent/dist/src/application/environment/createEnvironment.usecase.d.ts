import { EnvironmentConfig, AuthConfig } from '../../domain/models/EnvironmentConfig';
import { EnvironmentRepository } from '../../domain/repositories/EnvironmentRepository';
import { SpecRepository } from '../../domain/repositories/SpecRepository';
export interface CreateEnvironmentInput {
    specId: string;
    name: string;
    baseUrl: string;
    defaultHeaders?: Record<string, string>;
    authConfig?: AuthConfig;
}
export declare class CreateEnvironmentUseCase {
    private readonly environmentRepository;
    private readonly specRepository;
    constructor(environmentRepository: EnvironmentRepository, specRepository: SpecRepository);
    execute(input: CreateEnvironmentInput): Promise<EnvironmentConfig>;
}
//# sourceMappingURL=createEnvironment.usecase.d.ts.map