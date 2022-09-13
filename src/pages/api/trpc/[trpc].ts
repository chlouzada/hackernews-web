// src/pages/api/trpc/[trpc].ts
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from "../../../server/router";
import { createContext } from "../../../server/router/context";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext,
  responseMeta({ ctx, paths, type, errors }) {
    // assuming you have all your public routes with the keyword `public` in them
    const allPublic = paths && paths.every((path) => path.includes("hn"));
    // checking that no procedures errored
    const allOk = errors.length === 0;
    // checking we're doing a query request
    const isQuery = type === "query";
    if (ctx?.res && allPublic && allOk && isQuery) {
      // cache request for 1 day + revalidate once every second
      return {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "cache-control": `s-maxage=5, stale-while-revalidate=${60}`,
        },
      };
    }
    return {};
  },
});
