import { createRouter } from "./context";
import { z } from "zod";

const base_url = "http://hn.algolia.com/api/v1";

export interface Story {
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
  points?: number;
  parent_id?: number;
  story_id?: number;
  children: Comment[];
  options: unknown[];
}

const getStory = async (id: number): Promise<Story> => {
  const response = await fetch(`${base_url}/items/${id}`);
  return response.json();
};

export const hnRouter = createRouter().query("story", {
  input: z.object({
    id: z.number(),
  }),
  resolve({ input }) {
    return getStory(input.id);
  },
});
