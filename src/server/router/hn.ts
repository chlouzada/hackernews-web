import { createRouter } from "./context";
import { z } from "zod";

const algolia_base_url = "http://hn.algolia.com/api/v1";
const fb_base_url = "https://hacker-news.firebaseio.com/v0";

export interface StoryWithContent {
  id: number;
  created_at: string;
  created_at_i: number;
  author: string;
  title: string;
  url: string;
  text?: string;
  points?: number;
  children: Comment[];
  options: unknown[];
}

export interface Comment {
  id: number;
  created_at: string;
  created_at_i: number;
  author: string;
  text?: string;
  parent_id: number;
  story_id: number;
  children: Comment[];
  options: unknown[];
}

interface Story {
  by: string;
  descendants: number;
  id: number;
  kids: number[];
  score: number;
  time: number;
  title: string;
  type: string;
  url: string;
}

const getStoryWithContent = async (id: number) => {
  const response = await fetch(`${algolia_base_url}/items/${id}`);
  return response.json() as Promise<StoryWithContent>;
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
  });
