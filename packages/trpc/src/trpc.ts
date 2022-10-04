import { initTRPC, TRPCError } from '@trpc/server';
import type { Context } from './context';

export const t = initTRPC.context<Context>().create({
  errorFormatter({ shape }) {
    return shape;
  },
});

// export const authedProcedure = t.procedure.use(({ ctx, next }) => {
//   if (!ctx.session || !ctx.session.id) {
//     throw new TRPCError({ code: "UNAUTHORIZED" });
//   }
//   return next({
//     ctx: {
//       ...ctx,
//       // infers that `session` is non-nullable to downstream resolvers
//       session: { ...ctx.session },
//     },
//   });
// });
