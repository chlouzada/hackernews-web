// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { hnRouter } from "./hn";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("hn.", hnRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
