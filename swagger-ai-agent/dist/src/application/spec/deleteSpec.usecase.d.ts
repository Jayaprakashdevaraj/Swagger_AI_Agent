import { SpecRepository } from '../../domain/repositories/SpecRepository';
export declare class DeleteSpecUseCase {
    private readonly specRepository;
    constructor(specRepository: SpecRepository);
    execute(specId: string): Promise<void>;
}
//# sourceMappingURL=deleteSpec.usecase.d.ts.map