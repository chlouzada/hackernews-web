import { createNextApiHandler } from '@trpc/server/adapters/next';
import { appRouter, createContext } from '@chlou/hn-trpc';
import type { NextApiRequest, NextApiResponse } from 'next';

// eslint-disable-next-line import/no-anonymous-default-export
export default (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  return createNextApiHandler({
    router: appRouter,
    createContext,
    responseMeta({ ctx, paths, type, errors }) {
      // assuming you have all your public routes with the keyword `public` in them
      const allPublic = paths && paths.every((path) => path.includes('hn'));
      // checking that no procedures errored
      const allOk = errors.length === 0;
      // checking we're doing a query request
      const isQuery = type === 'query';
      if (ctx?.res && allPublic && allOk && isQuery) {
        // cache request for 1 day + revalidate once every second
        return {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'cache-control': `s-maxage=5, stale-while-revalidate=${60}`,
          },
        };
      }
      return {};
    },
  })(req, res);
};
