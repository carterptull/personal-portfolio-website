const AMPLINE_URL = "https://ampline.js.org/";

// Cross-origin embed like BlitzcastContent: frame-src here and frame-ancestors
// on ampline.js.org both have to allow it — see DECISIONS.md. clipboard-write
// is delegated so the site's Copy buttons work inside the frame.
export function AmplineContent() {
  return (
    <div className="flex h-full min-h-80 flex-col gap-2">
      <p className="font-pixel text-sm">
        <a
          href={AMPLINE_URL}
          target="_blank"
          rel="noreferrer"
          className="text-scarlet underline underline-offset-2"
        >
          Open in new tab ↗
        </a>
      </p>
      <iframe
        src={AMPLINE_URL}
        title="Ampline — Color-Graded Statusline for Claude Code"
        allow="clipboard-write"
        className="min-h-0 w-full flex-1 border-0"
      />
    </div>
  );
}
