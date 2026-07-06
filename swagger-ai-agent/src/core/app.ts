import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './config';
import { requestLogger } from './middlewares/requestLogger';
import { errorHandler } from './middlewares/errorHandler';
import { indexRouter } from '../api/routes/index';
import { specRouter } from '../api/routes/spec.routes';
import { environmentRouter } from '../api/routes/environment.routes';
import { executionRouter } from '../api/routes/execution.routes';

export function createApp(): Application {
  const app = express();

  // ── Security ─────────────────────────────────────────────────────────────
  app.use(helmet());
  app.use(cors());

  // ── Body parsing ──────────────────────────────────────────────────────────
  app.use(express.json({ limit: `${config.http.requestSizeLimitMb}mb` }));
  app.use(express.urlencoded({ extended: true }));

  // ── Request logging ───────────────────────────────────────────────────────
  app.use(requestLogger);

  // ── Routes ────────────────────────────────────────────────────────────────
  app.use('/api', indexRouter);
  app.use('/api/spec', specRouter);
  app.use('/api', environmentRouter);
  app.use('/api', executionRouter);

  // Phase 2+ route mounts will be added here as:
  // app.use('/api/spec', specRouter);
  // app.use('/api/environment', environmentRouter);
  // app.use('/api/execution', executionRouter);
  // app.use('/api/testgen', testgenRouter);
  // app.use('/api/mcp', mcpRouter);
  // app.use('/api/llm', llmRouter);

  // ── Error handler (must be last) ──────────────────────────────────────────
  app.use(errorHandler);

  return app;
}
