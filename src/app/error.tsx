"use client";

import Link from "next/link";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-void p-4">
      <div className="bevel-window w-full max-w-md bg-chrome p-0.5">
        <div className="titlebar-active flex items-center px-2 py-1">
          <span className="font-pixel text-sm font-bold">
            CarterOS - Unexpected Error
          </span>
        </div>
        <div className="space-y-4 p-4 text-[15px]">
          <p className="font-pixel font-bold">
            This program has performed an illegal operation and will be shut
            down.
          </p>
          <p>Something went wrong rendering this page. You can try again.</p>
          <div className="flex gap-2">
            <button type="button" onClick={reset} className="btn95 font-bold">
              Try again
            </button>
            <Link href="/" className="btn95 inline-block">
              Return to desktop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
