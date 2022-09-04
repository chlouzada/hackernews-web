import { createRouter } from "../context";
import { z } from "zod";
import { SearchResult, Story, StoryWithContent } from "./interfaces";

const algolia_base_url = "http://hn.algolia.com/api/v1";
const fb_base_url = "https://hacker-news.firebaseio.com/v0";

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

export const hnRouter = createRouter()
  .query("topStories", {
    resolve() {
      return topStories();
    },
  })
  .query("story", {
    input: z.object({
      id: z.number(),
    }),
    resolve({ input }) {
      return getStoryWithContent(input.id);
    },
  })
  .query("search", {
    input: z.object({
      query: z.string(),
    }),
    resolve({ input }) {
      return search(input);
    },
  });
