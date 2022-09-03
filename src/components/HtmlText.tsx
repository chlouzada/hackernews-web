import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@mantine/rte"), { ssr: false });

export default function HtmlText({ value }: { value?: string }) {
  if (!value) return <></>;
  return <RichTextEditor value={value} readOnly onChange={() => null} />;
}
