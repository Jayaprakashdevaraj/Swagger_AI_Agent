import { Router, Request, Response } from 'express';

const router = Router();

/** Health check — used to verify the server is up. */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
  });
});

export { router as indexRouter };
