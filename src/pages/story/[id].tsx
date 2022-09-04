import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import Header from "../../components/Header";
import { Comment, StoryWithContent } from "../../server/router/hn/interfaces";
import { date } from "../../utils/date";
import { trpc } from "../../utils/trpc";

const Text = ({ value }: { value?: string }) => {
  if (!value) return null;
  const html = value
    .replace(/<pre><code>/g, "<p>")
    .replace(/<\/code><\/pre>/g, "</p>");
  return (
    <div
      className="break-words text-sm md:leading-relaxed text-gray-700"
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
};

const CommentItem = ({
  created_at,
  author,
  text,
  children,
  _level = -1,
}: Comment & { _level?: number }) => {
  if (!text) return null;
  const subCommentsStyle = () => {
    if (_level === -1) return;
    const n = _level % 4;
    if (n === 0) return "pl-3 border-l-2 border-blue-200";
    if (n === 1) return "pl-3 border-l-2 border-green-200";
    if (n === 2) return "pl-3 border-l-2 border-yellow-200";
    if (n === 3) return "pl-3 border-l-2 border-red-200";
  };
  const sortedChildren = children.sort((a, b) => {
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });
  return (
    <div className={`flex flex-col justify-center ${subCommentsStyle()} pb-3`}>
      <Text value={text} />
      <div className="flex justify-between text-sm text-gray-700 pb-1">
        <p>{author}</p>
        <p>{date(created_at)}</p>
      </div>
      <hr className="pb-4" />
      {sortedChildren.map((child) => (
        <CommentItem key={child.id} {...child} _level={_level + 1} />
      ))}
    </div>
  );
};

const StoryItem = ({
  title,
  url,
  points,
  created_at,
  author,
  text,
}: StoryWithContent) => {
  return (
    <section className="flex flex-col gap-3 bg-slate-50 rounded-md p-4">
      <div className="flex justify-between items-center">
        <h1 className="md:text-3xl font-extrabold text-gray-700">{title}</h1>
        {url && (
          <Link href={url}>
            <div>
              <a className="hidden md:block py-2 pl-2">{url}</a>
              <a className="md:hidden py-2 pl-2">Link</a>
            </div>
          </Link>
        )}
      </div>
      <Text value={text} />
      <div className="text-sm font-bold flex justify-between items-center">
        <p>
          {author} - {points}
        </p>
        <p>{date(created_at)}</p>
      </div>
    </section>
  );
};

const StoryView = ({ id }: { id: number }) => {
  const story = trpc.useQuery(["hn.story", { id }]);

  if (!story.data) return <div>Loading...</div>;

  return (
    <>
      <Head>
        <title>{story.data.title}</title>
      </Head>

      <Header hiddenSearch />

      <main className="container mx-auto pt-4 md:pt-8">
        <StoryItem {...story.data} />

        <div className="">
          <h2 className="text-xl leading-normal font-extrabold text-gray-700 p-2">
            Comments
          </h2>
          <div className="shadow rounded-md p-2">
            {story.data.children.map((child) => (
              <CommentItem key={child.id} {...child} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = Number(context.params?.id);

  if (Number.isNaN(id)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      id,
    },
  };
};

export default StoryView;
