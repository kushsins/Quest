/**
 * Scattered ambient color blobs — fewer spheres with varied size, hue, and placement.
 * Each orb drifts along its own seeded path. Dark: vivid purple / indigo / blue.
 * Light: saturated pastel washes.
 */

import { useLayoutEffect } from "react";

interface BlobConfig {
  top: string;
  left: string;
  size: number;
  inner: string;
  outer: string;
  blur: number;
  animationName: string;
  duration: number;
  delay: number;
}

interface BlobPalette {
  seed: number;
  count: number;
  innerLightness: [number, number];
  innerChroma: [number, number];
  outerLightness: [number, number];
  outerChroma: [number, number];
  hue: [number, number];
  size: [number, number];
  blur: [number, number];
  driftVw: [number, number];
  driftVh: [number, number];
}

interface BlobField {
  blobs: BlobConfig[];
  keyframes: string;
}

function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1_664_525 + 1_013_904_223) >>> 0;
    return state / 0x1_0000_0000;
  };
}

function lerp(min: number, max: number, t: number) {
  return min + (max - min) * t;
}

function pick(range: [number, number], rand: () => number) {
  return lerp(range[0], range[1], rand());
}

function formatDriftTransform(xVw: number, yVh: number) {
  return `translate(calc(-50% + ${xVw.toFixed(1)}vw), calc(-50% + ${yVh.toFixed(1)}vh))`;
}

function createClosedPathKeyframes(
  animationName: string,
  rand: () => number,
  maxVw: number,
  maxVh: number,
): string {
  const pointCount = 4 + Math.floor(rand() * 3);
  const points: { x: number; y: number }[] = [];

  for (let p = 0; p < pointCount; p += 1) {
    points.push({
      x: lerp(-maxVw, maxVw, rand()),
      y: lerp(-maxVh, maxVh, rand()),
    });
  }

  /* Close the loop so 0% and 100% match — no teleport on repeat */
  const loopPoints = [...points, points[0] ?? { x: 0, y: 0 }];
  const frames = loopPoints.map((point, index) => {
    const pct = Math.round((index / (loopPoints.length - 1)) * 100);
    return `${String(pct)}% { transform: ${formatDriftTransform(point.x, point.y)}; }`;
  });

  return `@keyframes ${animationName} { ${frames.join(" ")} }`;
}

function createBlobField(palette: BlobPalette, prefix: string): BlobField {
  const rand = seededRandom(palette.seed);
  const blobs: BlobConfig[] = [];
  const keyframeRules: string[] = [];

  for (let i = 0; i < palette.count; i += 1) {
    const hue = pick(palette.hue, rand);
    const hueOuter = hue + lerp(-18, 18, rand());
    const size = Math.round(pick(palette.size, rand));
    const innerL = pick(palette.innerLightness, rand);
    const innerC = pick(palette.innerChroma, rand);
    const outerL = pick(palette.outerLightness, rand);
    const outerC = pick(palette.outerChroma, rand);
    const blur = Math.round(pick(palette.blur, rand));
    const animationName = `quest-blob-drift-${prefix}-${String(i)}`;
    const maxVw = pick(palette.driftVw, rand);
    const maxVh = pick(palette.driftVh, rand);

    keyframeRules.push(
      createClosedPathKeyframes(animationName, rand, maxVw, maxVh),
    );

    blobs.push({
      top: `${String(Math.round(lerp(3, 91, rand())))}%`,
      left: `${String(Math.round(lerp(4, 93, rand())))}%`,
      size,
      inner: `oklch(${innerL.toFixed(3)} ${innerC.toFixed(3)} ${hue.toFixed(1)})`,
      outer: `oklch(${outerL.toFixed(3)} ${outerC.toFixed(3)} ${hueOuter.toFixed(1)})`,
      blur,
      animationName,
      duration: Math.round(pick([48, 78], rand)),
      delay: Math.round(pick([0, 16], rand)),
    });
  }

  return { blobs, keyframes: keyframeRules.join("\n") };
}

const lightField = createBlobField(
  {
    seed: 0x51a9_f1,
    count: 18,
    innerLightness: [0.58, 0.7],
    innerChroma: [0.18, 0.28],
    outerLightness: [0.72, 0.86],
    outerChroma: [0.1, 0.18],
    hue: [238, 322],
    size: [118, 228],
    blur: [58, 82],
    driftVw: [10, 20],
    driftVh: [7, 15],
  },
  "light",
);

const darkField = createBlobField(
  {
    seed: 0x9c3e_71,
    count: 18,
    innerLightness: [0.34, 0.48],
    innerChroma: [0.2, 0.3],
    outerLightness: [0.24, 0.36],
    outerChroma: [0.14, 0.24],
    hue: [242, 318],
    size: [128, 248],
    blur: [72, 96],
    driftVw: [12, 22],
    driftVh: [8, 16],
  },
  "dark",
);

const blobDriftStyles = `${lightField.keyframes}\n${darkField.keyframes}`;

/* Blob component kept for when blob maps are re-enabled in AmbientBackground.
function Blob({
  top,
  left,
  size,
  inner,
  outer,
  blur,
  animationName,
  duration,
  delay,
}: BlobConfig) {
  return (
    <div
      className="quest-blob-anchor"
      style={{
        top,
        left,
        animation: `${animationName} ${String(duration)}s linear ${String(delay)}s infinite`,
      }}
    >
      <div
        className="quest-blob"
        style={{
          width: `${String(size)}px`,
          height: `${String(size)}px`,
          background: `radial-gradient(circle, ${inner} 0%, ${outer} 40%, transparent 75%)`,
          filter: `blur(${String(blur)}px)`,
        }}
      />
    </div>
  );
}
*/

export function AmbientBackground() {
  useLayoutEffect(() => {
    const styleId = "quest-blob-keyframes";
    let styleEl = document.getElementById(styleId);

    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = blobDriftStyles;
  }, []);

  return (
    <div className="quest-background" aria-hidden="true">
      <div className="quest-blobs quest-blobs--light">
        {/* {lightField.blobs.map((blob, i) => (
          <Blob key={`l-${String(i)}`} {...blob} />
        ))} */}
      </div>

      <div className="quest-blobs quest-blobs--dark">
        {/* {darkField.blobs.map((blob, i) => (
          <Blob key={`d-${String(i)}`} {...blob} />
        ))} */}
      </div>
    </div>
  );
}
