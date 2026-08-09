const RESUME_PDF = "/Carter-Tull-Resume.pdf";

export function ResumeContent() {
  return (
    <div className="flex h-full min-h-80 flex-col gap-2">
      <p className="flex gap-4 font-pixel text-sm">
        <a
          href={RESUME_PDF}
          target="_blank"
          rel="noreferrer"
          className="text-scarlet underline underline-offset-2"
        >
          Open in new tab ↗
        </a>
        <a
          href={RESUME_PDF}
          download="Carter-Tull-Resume.pdf"
          className="text-scarlet underline underline-offset-2"
        >
          Download
        </a>
      </p>
      <object
        data={RESUME_PDF}
        type="application/pdf"
        className="min-h-0 w-full flex-1"
        aria-label="Carter Tull resume PDF"
      >
        <p className="text-sm">
          This browser can&apos;t display PDFs inline. Use the links above.
        </p>
      </object>
    </div>
  );
}
