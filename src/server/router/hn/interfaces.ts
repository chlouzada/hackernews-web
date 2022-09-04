export interface StoryWithContent {
  id: number;
  created_at: string;
  created_at_i: number;
  author: string;
  title: string;
  url?: string;
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

export interface Story {
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

export interface SearchResult {
  hits: {
    created_at: string;
    title: string;
    url?: string;
    author: string;
    points: number;
    story_text: string;
    comment_text?: any;
    num_comments: number;
    story_id?: any;
    story_title?: any;
    story_url?: any;
    parent_id?: any;
    created_at_i: number;
    _tags: any[];
    objectID: string;
    _highlightResult: any;
  }[]; // TODO: map types
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  exhaustiveNbHits: boolean;
  exhaustiveTypo: boolean;
  exhaustive: {
    nbHits: boolean;
    typo: boolean;
  };
  query: string;
  params: string;
  processingTimeMS: number;
  processingTimingsMS: {
    afterFetch: {
      total: number;
    };
    fetch: {
      scanning: number;
      total: number;
    };
    total: number;
  };
}
