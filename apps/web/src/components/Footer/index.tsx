import Link from 'next/link';
import React from 'react';

export default function Footer() {
  return (
    <footer className="footer items-center px-4 py-1 bg-neutral text-neutral-content">
      <div className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
        <Link href={'https://github.com/chlouzada/custom-hackernews'}>
          <a className="font-bold text-lg p-1">GitHub</a>
        </Link>
      </div>
    </footer>
  );
}
