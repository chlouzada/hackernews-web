import { t } from '../trpc';
import { z } from 'zod';
import { SearchResult, Story, StoryWithContent } from './interfaces';

const algolia_base_url = 'http://hn.algolia.com/api/v1';
const fb_base_url = 'https://hacker-news.firebaseio.com/v0';

const getStoryWithContent = async (id: number) => {
  const response = await fetch(`${algolia_base_url}/items/${id}`);
  return response.json() as Promise<StoryWithContent>;
};

const search = async ({ query }: { query: string }) => {
  const response = await fetch(`${algolia_base_url}/search?query=${query}`);
  return response.json() as Promise<SearchResult>;
};

const getStory = async (id: number) => {
  const response = await fetch(`${fb_base_url}/item/${id}.json`);

  return response.json() as Promise<Story>;
};

const topStories = async () => {
  const response = await fetch(`${fb_base_url}/topstories.json`);
  const ids = await response.json();
  return (await Promise.all(ids.map(getStory))) as Story[];
};

export const hackernewsRouter = t.router({
  infiniteTopStories: t.procedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(),
      })
    )
    .query(async ({ input }) => {
      const limit = input.limit ?? 10;
      const { cursor } = input;

      const response = await fetch(`${fb_base_url}/topstories.json`);
      const ids = (await response.json()) as number[];
      const spliced = ids.splice(cursor ?? 0, limit);
      const items = (await Promise.all(spliced.map(getStory))) as Story[];

      let nextCursor: typeof cursor | undefined = cursor
        ? cursor + limit
        : limit;
      if (nextCursor > 100) nextCursor = null;

      return {
        items,
        nextCursor,
      };
    }),
  topStories: t.procedure.query(async ({ ctx, input }) => {
    return topStories();
  }),
  storyById: t.procedure.input(z.number()).query(async ({ input }) => {
    return getStoryWithContent(input);
  }),
  search: t.procedure
    .input(
      z.object({
        query: z.string(),
      })
    )
    .query(async ({ input }) => {
      return search(input);
    }),
});
