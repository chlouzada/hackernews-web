import Head from "next/head";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import { Comment } from "../../server/router/hn";
import { date } from "../../utils/date";
import { trpc } from "../../utils/trpc";

const CommentItem = ({
  created_at,
  author,
  text,
  children,
  _level = 0,
}: Comment & { _level?: number }) => {
  const borderColor = () => {
    const n = _level % 4;
    if (n === 0) return "border-blue-200";
    if (n === 1) return "border-green-200";
    if (n === 2) return "border-yellow-200";
    if (n === 3) return "border-red-200";
  };
  const sortedChildren = children.sort((a, b) => {
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });
  return (
    <section
      className={`flex flex-col justify-center pl-3 border-l-2 ${borderColor()}`}
    >
      <div>
        <p>{author}</p>
        <p>{date(created_at)}</p>
      </div>
      {text && <div dangerouslySetInnerHTML={{ __html: text }} />}
      {sortedChildren.map((child) => (
        <CommentItem key={child.id} {...child} _level={_level + 1} />
      ))}
    </section>
  );
};

const StoryView = () => {
  const { id } = useRouter().query;
  const story = trpc.useQuery(["hn.story", { id: Number(id) }]);

  if (!story.data) return <div>Loading...</div>;

  return (
    <>
      <Head>
        <title>{story.data.title}</title>
      </Head>

      <Header hiddenSearch />

      <main className="container mx-auto pt-4 md:pt-12">
        <h1 className="text-3xl leading-normal font-extrabold text-gray-700">
          {id}
        </h1>

        <div>
          <h2 className="text-xl leading-normal font-extrabold text-gray-700">
            Reports
          </h2>
          <div></div>
        </div>
      </main>
    </>
  );
};

export default StoryView;
