import { EnvironmentConfig } from '../../domain/models/EnvironmentConfig';
import { EnvironmentRepository } from '../../domain/repositories/EnvironmentRepository';
import { SpecRepository } from '../../domain/repositories/SpecRepository';
export declare class ListEnvironmentsUseCase {
    private readonly environmentRepository;
    private readonly specRepository;
    constructor(environmentRepository: EnvironmentRepository, specRepository: SpecRepository);
    execute(specId: string): Promise<EnvironmentConfig[]>;
}
//# sourceMappingURL=listEnvironments.usecase.d.ts.map