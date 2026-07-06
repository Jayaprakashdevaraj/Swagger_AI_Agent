import { createApp } from './app';
import { config } from './config';
import { logger } from '../infrastructure/logging/Logger';

const app = createApp();
const { port } = config.http;

const server = app.listen(port, () => {
  logger.info(`Swagger AI Agent started`, {
    env: process.env.NODE_ENV,
    port,
    url: `http://localhost:${port}/api/health`,
  });
});

// Graceful shutdown
function shutdown(signal: string): void {
  logger.info(`Received ${signal} — shutting down gracefully`);
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
  // Force exit after 10 seconds if server hasn't closed
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection', { reason });
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception', { message: err.message, stack: err.stack });
  process.exit(1);
});
