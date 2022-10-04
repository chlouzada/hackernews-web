import { t } from '../trpc';

import { hackernewsRouter } from './hackernews';

export const appRouter = t.router({
  hackernews: hackernewsRouter,
});

export type AppRouter = typeof appRouter;
