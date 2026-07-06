import { InMemorySpecRepository } from '../../infrastructure/persistence/InMemorySpecRepository';
import { InMemoryEnvironmentRepository } from '../../infrastructure/persistence/InMemoryEnvironmentRepository';
import { CreateEnvironmentUseCase } from '../../application/environment/createEnvironment.usecase';
import { ListEnvironmentsUseCase } from '../../application/environment/listEnvironments.usecase';
import { UpdateEnvironmentUseCase } from '../../application/environment/updateEnvironment.usecase';
import { DeleteEnvironmentUseCase } from '../../application/environment/deleteEnvironment.usecase';
import { NormalizedSpec } from '../../domain/models/NormalizedSpec';

describe('Phase 5 environment configuration', () => {
  it('should create, list, update and delete environments', async () => {
    const specRepository = new InMemorySpecRepository();
    const environmentRepository = new InMemoryEnvironmentRepository();

    const spec: NormalizedSpec = {
      id: 'spec-phase5',
      title: 'Phase 5 API',
      version: '1.0.0',
      specVersion: '3.0.3',
      servers: [],
      tags: [],
      operations: [],
      ingestedAt: new Date().toISOString(),
      sourceRef: 'unit-test',
    };
    await specRepository.save(spec);

    const createUseCase = new CreateEnvironmentUseCase(environmentRepository, specRepository);
    const listUseCase = new ListEnvironmentsUseCase(environmentRepository, specRepository);
    const updateUseCase = new UpdateEnvironmentUseCase(environmentRepository);
    const deleteUseCase = new DeleteEnvironmentUseCase(environmentRepository);

    const created = await createUseCase.execute({
      specId: 'spec-phase5',
      name: 'qa',
      baseUrl: 'https://qa.example.com',
      defaultHeaders: { 'x-app': 'swagger-ai-agent' },
      authConfig: { type: 'none' },
    });

    expect(created.id.startsWith('env-')).toBe(true);
    expect(created.name).toBe('qa');

    const list1 = await listUseCase.execute('spec-phase5');
    expect(list1).toHaveLength(1);

    const updated = await updateUseCase.execute({
      envId: created.id,
      baseUrl: 'https://stage.example.com',
      authConfig: { type: 'bearer', token: 'abc' },
    });

    expect(updated.baseUrl).toBe('https://stage.example.com');
    expect(updated.authConfig.type).toBe('bearer');

    await deleteUseCase.execute(created.id);

    const list2 = await listUseCase.execute('spec-phase5');
    expect(list2).toHaveLength(0);
  });
});
