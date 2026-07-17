import { SpecRepository } from '../../domain/repositories/SpecRepository';

export interface SpecSummary {
  id: string;
  title: string;
  version: string;
  specVersion: string;
  operationCount: number;
  tagNames: string[];
  ingestedAt: string;
  sourceRef: string;
}

export class ListSpecsUseCase {
  constructor(private readonly specRepository: SpecRepository) {}

  async execute(): Promise<SpecSummary[]> {
    const specs = await this.specRepository.findAll();

    return specs
      .map((spec) => ({
        id: spec.id,
        title: spec.title,
        version: spec.version,
        specVersion: spec.specVersion,
        operationCount: spec.operations.length,
        tagNames: this.collectTagNames(spec),
        ingestedAt: spec.ingestedAt,
        sourceRef: spec.sourceRef,
      }))
      .sort((left, right) => right.ingestedAt.localeCompare(left.ingestedAt));
  }

  private collectTagNames(spec: Awaited<ReturnType<SpecRepository['findAll']>>[number]): string[] {
    const names = new Set<string>();

    for (const tag of spec.tags) {
      if (tag.name.trim() !== '') {
        names.add(tag.name);
      }
    }

    for (const operation of spec.operations) {
      for (const tag of operation.tags) {
        if (tag.trim() !== '') {
          names.add(tag);
        }
      }
    }

    return Array.from(names).sort((left, right) => left.localeCompare(right));
  }
}