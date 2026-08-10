// Pixel-art icons on a 16x16 grid, rendered as SVG rects (crispEdges).
type Px = [x: number, y: number, w: number, h: number, fill: string];

const C = {
  scarlet: "#BB0000",
  chrome: "#C0C0C0",
  light: "#DFDFDF",
  dark: "#808080",
  ink: "#0A0A0A",
  screen: "#0A1A2E",
  white: "#FFFFFF",
  led: "#22C55E",
  docBlue: "#2B579A",
};

function PixelIcon({ px, size = 32 }: { px: Px[]; size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {px.map(([x, y, w, h, fill], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill={fill} />
      ))}
    </svg>
  );
}

const computerPx: Px[] = [
  [1, 1, 14, 10, C.chrome],
  [1, 1, 14, 1, C.light],
  [1, 1, 1, 10, C.light],
  [14, 2, 1, 9, C.dark],
  [2, 10, 12, 1, C.dark],
  [3, 3, 10, 6, C.screen],
  [6, 4, 4, 1, C.scarlet],
  [6, 4, 1, 4, C.scarlet],
  [6, 7, 4, 1, C.scarlet],
  [6, 11, 4, 2, C.chrome],
  [4, 13, 8, 2, C.chrome],
  [4, 14, 8, 1, C.dark],
];

const folderPx: Px[] = [
  [1, 3, 6, 2, C.scarlet],
  [1, 5, 14, 9, C.chrome],
  [1, 5, 14, 1, C.light],
  [1, 5, 1, 9, C.light],
  [14, 6, 1, 8, C.dark],
  [2, 13, 12, 1, C.dark],
  [3, 8, 10, 1, C.dark],
  [3, 10, 10, 1, C.dark],
];

const documentPx: Px[] = [
  [3, 1, 8, 1, C.dark],
  [3, 1, 1, 14, C.dark],
  [3, 14, 10, 1, C.dark],
  [12, 4, 1, 11, C.dark],
  [4, 2, 7, 12, C.white],
  [11, 5, 1, 9, C.white],
  [10, 1, 1, 3, C.dark],
  [10, 4, 3, 1, C.dark],
  [11, 2, 2, 2, C.chrome],
  [5, 5, 5, 1, C.scarlet],
  [5, 7, 6, 1, C.dark],
  [5, 9, 6, 1, C.dark],
  [5, 11, 4, 1, C.dark],
];

// Word-processor document: white page, folded corner, blue "W".
const wordDocPx: Px[] = [
  [3, 1, 8, 1, C.dark],
  [3, 1, 1, 14, C.dark],
  [3, 14, 10, 1, C.dark],
  [12, 4, 1, 11, C.dark],
  [4, 2, 7, 12, C.white],
  [11, 5, 1, 9, C.white],
  [10, 1, 1, 3, C.dark],
  [10, 4, 3, 1, C.dark],
  [11, 2, 2, 2, C.chrome],
  [4, 5, 1, 4, C.docBlue],
  [10, 5, 1, 4, C.docBlue],
  [7, 6, 1, 3, C.docBlue],
  [5, 9, 2, 1, C.docBlue],
  [8, 9, 2, 1, C.docBlue],
  [5, 11, 6, 1, C.chrome],
];

const mediaPx: Px[] = [
  [1, 2, 14, 10, C.chrome],
  [1, 2, 14, 1, C.light],
  [1, 2, 1, 10, C.light],
  [14, 3, 1, 9, C.dark],
  [2, 11, 12, 1, C.dark],
  [3, 4, 10, 6, C.screen],
  [6, 5, 2, 4, C.scarlet],
  [8, 6, 2, 2, C.scarlet],
  [2, 13, 3, 2, C.chrome],
  [6, 13, 3, 2, C.chrome],
  [10, 13, 3, 2, C.chrome],
  [11, 13, 1, 1, C.led],
];

const skillsPx: Px[] = [
  [1, 1, 14, 14, C.chrome],
  [1, 1, 14, 1, C.light],
  [1, 1, 1, 14, C.light],
  [14, 2, 1, 13, C.dark],
  [2, 14, 12, 1, C.dark],
  [2, 2, 12, 2, C.scarlet],
  [3, 5, 10, 1, C.dark],
  [3, 7, 6, 1, C.dark],
  [10, 6, 3, 3, C.led],
  [3, 9, 8, 1, C.dark],
  [3, 11, 5, 1, C.dark],
];

const contactPx: Px[] = [
  [1, 3, 14, 10, C.chrome],
  [1, 3, 14, 1, C.light],
  [1, 3, 1, 10, C.light],
  [14, 4, 1, 9, C.dark],
  [2, 12, 12, 1, C.dark],
  [2, 4, 2, 2, C.dark],
  [12, 4, 2, 2, C.dark],
  [4, 5, 2, 2, C.dark],
  [10, 5, 2, 2, C.dark],
  [6, 6, 4, 2, C.dark],
  [7, 8, 2, 2, C.scarlet],
];

// Monitor frame identical to computerPx; screen shows a pipe elbow with a
// chrome joint accent, echoing the classic Windows "3D Pipes" icon.
const screensaverPx: Px[] = [
  [1, 1, 14, 10, C.chrome],
  [1, 1, 14, 1, C.light],
  [1, 1, 1, 10, C.light],
  [14, 2, 1, 9, C.dark],
  [2, 10, 12, 1, C.dark],
  [3, 3, 10, 6, C.screen],
  [4, 4, 4, 1, C.scarlet],
  [7, 4, 1, 1, C.scarlet],
  [7, 5, 1, 2, C.scarlet],
  [7, 7, 1, 1, C.scarlet],
  [8, 7, 4, 1, C.scarlet],
  [11, 6, 2, 2, C.chrome],
  [6, 11, 4, 2, C.chrome],
  [4, 13, 8, 2, C.chrome],
  [4, 14, 8, 1, C.dark],
];

export const IconComputer = (p: { size?: number }) => (
  <PixelIcon px={computerPx} {...p} />
);
export const IconFolder = (p: { size?: number }) => (
  <PixelIcon px={folderPx} {...p} />
);
export const IconDocument = (p: { size?: number }) => (
  <PixelIcon px={documentPx} {...p} />
);
export const IconMedia = (p: { size?: number }) => (
  <PixelIcon px={mediaPx} {...p} />
);
export const IconSkills = (p: { size?: number }) => (
  <PixelIcon px={skillsPx} {...p} />
);
export const IconScreensaver = (p: { size?: number }) => (
  <PixelIcon px={screensaverPx} {...p} />
);
export const IconContact = (p: { size?: number }) => (
  <PixelIcon px={contactPx} {...p} />
);
export const IconWordDoc = (p: { size?: number }) => (
  <PixelIcon px={wordDocPx} {...p} />
);
