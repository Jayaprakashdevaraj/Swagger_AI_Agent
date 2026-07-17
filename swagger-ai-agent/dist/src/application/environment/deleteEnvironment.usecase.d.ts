import { EnvironmentRepository } from '../../domain/repositories/EnvironmentRepository';
export declare class DeleteEnvironmentUseCase {
    private readonly environmentRepository;
    constructor(environmentRepository: EnvironmentRepository);
    execute(envId: string): Promise<void>;
}
//# sourceMappingURL=deleteEnvironment.usecase.d.ts.map