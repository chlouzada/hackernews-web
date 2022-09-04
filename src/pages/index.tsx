import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { date } from "../utils/date";
import { trpc } from "../utils/trpc";

const Loading = ({ search }: { search?: true }) => {
  return (
    <div className="flex justify-center flex-col items-center h-96 gap-3">
      {search ? "Searching..." : "Loading..."}
      <progress className="progress" />
    </div>
  );
};

const Error = () => {
  return (
    <div className="flex justify-center items-center h-96">
      <div className="text-xl text-gray-700">Error</div>
    </div>
  );
};

const StoryItem = ({
  id,
  title,
  score,
  author,
  createdAt,
  comments,
}: {
  id: number;
  title: string;
  score: number;
  author: string;
  comments: number;
  createdAt: string;
}) => {
  return (
    <li
      key={id}
      className="shadow hover:scale-[1.01] duration-500 p-4 rounded-md"
    >
      <Link href={`/story/${id}`}>
        <div>
          <h2>{title}</h2>
          <p className="text-xs">
            {author} ({score})
          </p>
          <div className="flex justify-between text-sm font-bold">
            <p className="text-sm">{comments} comments</p>
            <p>{date(createdAt)}</p>
          </div>
        </div>
      </Link>
    </li>
  );
};

const Home: NextPage = () => {
  const [search, setSearch] = useState<string>();
  const debounced = useDebouncedValue(search, 700);

  const topStoriesQuery = trpc.useQuery(["hn.topStories"]);
  const searchQuery = trpc.useQuery(["hn.search", { query: debounced! }], {
    enabled: !!debounced,
  });

  const renderTopStories = () => {
    if (topStoriesQuery.isLoading) return <Loading />;
    if (searchQuery.isError) return <Error />;
    return topStoriesQuery.data?.map((story) => (
      <StoryItem
        key={story.id}
        {...{
          ...story,
          comments: story.descendants,
          createdAt: new Date(story.time * 1000).toISOString(),
          author: story.by,
        }}
      />
    ));
  };

  const renderSearchResults = () => {
    if (searchQuery.isLoading) return <Loading search />;
    if (searchQuery.isError) return <Error />;
    return searchQuery.data?.hits.map((story) => (
      <StoryItem
        key={story.objectID}
        {...{
          ...story,
          createdAt: story.created_at,
          id: Number(story.objectID),
          comments: story.num_comments,
          score: story.points,
        }}
      />
    ));
  };

  return (
    <>
      <Head>
        <title>Hacker News</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header setSearch={setSearch} />

      <main className="container mx-auto flex flex-col items-center justify-center min-h-screen py-4 md:py-8">
        <ul className="text-2xl text-gray-700 flex flex-col gap-3">
          {debounced ? renderSearchResults() : renderTopStories()}
        </ul>
      </main>

      <Footer />
    </>
  );
};

export default Home;
