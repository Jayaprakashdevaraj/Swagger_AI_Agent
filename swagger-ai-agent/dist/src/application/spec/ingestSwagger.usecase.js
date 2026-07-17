"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngestSwaggerUseCase = void 0;
const idGenerator_1 = require("../../utils/idGenerator");
const Logger_1 = require("../../infrastructure/logging/Logger");
class IngestSwaggerUseCase {
    constructor(loader, parser, normalizeSpecUseCase, specRepository) {
        this.loader = loader;
        this.parser = parser;
        this.normalizeSpecUseCase = normalizeSpecUseCase;
        this.specRepository = specRepository;
    }
    async execute(input) {
        const startedAt = Date.now();
        Logger_1.logger.info('Spec ingest started', {
            sourceType: input.source.type,
            sourceRef: this.toSourceRef(input.source),
        });
        try {
            const rawContent = await this.loadRawSpec(input.source);
            const parsed = await this.parser.parse(rawContent, true);
            const specId = (0, idGenerator_1.generateId)('spec');
            const sourceRef = this.toSourceRef(input.source);
            const normalized = this.normalizeSpecUseCase.execute({
                specId,
                sourceRef,
                parsedSpec: parsed.raw,
            });
            const saved = await this.specRepository.save(normalized);
            Logger_1.logger.info('Spec ingest completed', {
                specId: saved.id,
                operationCount: saved.operations.length,
                durationMs: Date.now() - startedAt,
            });
            return saved;
        }
        catch (error) {
            Logger_1.logger.error('Spec ingest failed', {
                sourceType: input.source.type,
                message: error instanceof Error ? error.message : 'Unknown ingest error',
                durationMs: Date.now() - startedAt,
            });
            throw error;
        }
    }
    async loadRawSpec(source) {
        if (source.type === 'url') {
            return this.loader.loadFromUrl(source.url);
        }
        if (source.type === 'file') {
            return this.loader.loadFromFile(source.path);
        }
        if (source.type === 'content') {
            return source.content;
        }
        return this.loader.loadFromGit({
            repo: source.repo,
            ref: source.ref,
            filePath: source.filePath,
        });
    }
    toSourceRef(source) {
        if (source.type === 'url') {
            return source.url;
        }
        if (source.type === 'file') {
            return source.path;
        }
        if (source.type === 'content') {
            return source.fileName?.trim() || 'inline-content';
        }
        return `${source.repo}#${source.ref}:${source.filePath}`;
    }
}
exports.IngestSwaggerUseCase = IngestSwaggerUseCase;
//# sourceMappingURL=ingestSwagger.usecase.js.map