const BLITZCAST_URL = "https://www.blitzcast.app";

// Cross-origin app embedded via iframe (unlike ResumeContent's same-origin
// <object>), so frame-src on our CSP and frame-ancestors on Blitzcast's
// response headers both have to allow it — see DECISIONS.md.
export function BlitzcastContent() {
  return (
    <div className="flex h-full min-h-80 flex-col gap-2">
      <p className="font-pixel text-sm">
        <a
          href={BLITZCAST_URL}
          target="_blank"
          rel="noreferrer"
          className="text-scarlet underline underline-offset-2"
        >
          Open in new tab ↗
        </a>
      </p>
      <iframe
        src={BLITZCAST_URL}
        title="Blitzcast — AI/ML Football Matchup Predictor"
        className="min-h-0 w-full flex-1 border-0"
      />
    </div>
  );
}
