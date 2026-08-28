import { useMemo, forwardRef } from "react";

const CX = 500;
const CY = 500;
const MEEM_R = 148;
const RINGS_CONFIG = [182, 213, 244, 275, 306, 337, 368, 399, 430, 461];
const FONT_SIZE = 16;
const FONT = "'Scheherazade New', serif";

function topArc(r: number) {
  return `M ${CX - r},${CY} A ${r},${r} 0 0,1 ${CX + r},${CY}`;
}

function botArc(r: number) {
  return `M ${CX + r},${CY} A ${r},${r} 0 0,1 ${CX - r},${CY}`;
}

// Count only base (non-diacritic) Arabic characters — harakat are zero-width.
function baseLen(s: string): number {
  return Array.from(s).filter((ch) => {
    const cp = ch.codePointAt(0)!;
    return !(
      (cp >= 0x064b && cp <= 0x065f) ||
      (cp >= 0x0610 && cp <= 0x061a) ||
      cp === 0x0670
    );
  }).length;
}

function splitHalf(words: string[]): [string[], string[]] {
  const total = words.reduce((s, w) => s + baseLen(w), 0);
  let acc = 0;
  for (let i = 0; i < words.length; i++) {
    acc += baseLen(words[i]);
    if (acc >= total / 2) return [words.slice(0, i + 1), words.slice(i + 1)];
  }
  return [words, []];
}

function buildRings(
  text: string,
  charW: number
): Array<{ top: string; bot: string; r: number }> {
  const allWords = text.split(" ");
  const result: Array<{ top: string; bot: string; r: number }> = [];
  let wi = 0;

  for (const r of RINGS_CONFIG) {
    if (wi >= allWords.length) break;
    const cap = Math.floor((2 * Math.PI * r) / charW);
    const chunk: string[] = [];
    let len = 0;
    while (
      wi < allWords.length &&
      len + baseLen(allWords[wi]) + (chunk.length ? 1 : 0) <= cap
    ) {
      len += baseLen(allWords[wi]) + (chunk.length ? 1 : 0);
      chunk.push(allWords[wi++]);
    }

    // If this would be the last ring of text AND it fills <80% of the arc,
    // merge it into the previous ring to eliminate a visible gap.
    if (
      wi >= allWords.length &&
      len / cap < 0.80 &&
      result.length > 0
    ) {
      const prev = result[result.length - 1];
      const all = (prev.top + " " + prev.bot + " " + chunk.join(" "))
        .trim()
        .split(" ");
      const [t, b] = splitHalf(all);
      prev.top = t.join(" ");
      prev.bot = b.join(" ");
      break;
    }

    const [topW, botW] = splitHalf(chunk);
    result.push({ r, top: topW.join(" "), bot: botW.join(" ") });
  }

  // Overflow any remaining words into the last ring
  if (wi < allWords.length) {
    const last = result[result.length - 1];
    const extra = allWords.slice(wi).join(" ");
    const all = (last.top + " " + last.bot + " " + extra).trim().split(" ");
    const [t, b] = splitHalf(all);
    last.top = t.join(" ");
    last.bot = b.join(" ");
  }

  return result;
}

export interface CalligraphyProps {
  surahText: string;
  charW?: number;
  inkColor?: string;
  bgColor?: string;
  showParchment?: boolean;
}

const CircularCalligraphy = forwardRef<SVGSVGElement, CalligraphyProps>(
  (
    {
      surahText,
      charW = 7,
      inkColor = "#152060",
      bgColor = "#f4e9cc",
      showParchment = true,
    },
    ref
  ) => {
    const meems = useMemo(
      () =>
        Array.from({ length: 40 }, (_, i) => {
          const angle = (i / 40) * 2 * Math.PI - Math.PI / 2;
          return {
            x: CX + MEEM_R * Math.cos(angle),
            y: CY + MEEM_R * Math.sin(angle),
            rot: (i / 40) * 360,
          };
        }),
      []
    );

    const ringData = useMemo(
      () => buildRings(surahText, charW),
      [surahText, charW]
    );

    return (
      <svg
        ref={ref}
        width="1000"
        height="1000"
        viewBox="0 0 1000 1000"
        style={{ maxWidth: "70vmin", maxHeight: "70vmin", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {showParchment && (
            <filter
              id="grain"
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.68"
                numOctaves={4}
                seed={11}
                result="noise"
              />
              <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
              <feBlend in="SourceGraphic" in2="gray" mode="multiply" result="blended" />
              <feComposite in="blended" in2="SourceGraphic" operator="in" />
            </filter>
          )}
          <filter id="inkBig" x="-8%" y="-8%" width="116%" height="116%">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.016"
              numOctaves={2}
              seed={3}
              result="t"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="t"
              scale={2.0}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          <filter id="ink" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.02"
              numOctaves={2}
              seed={9}
              result="t"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="t"
              scale={1.0}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          {ringData.map(({ r }, i) => (
            <g key={i}>
              <path id={`top${i}`} d={topArc(r)} fill="none" />
              <path id={`bot${i}`} d={botArc(r)} fill="none" />
            </g>
          ))}
        </defs>

        {/* Background */}
        <rect width="1000" height="1000" fill={bgColor} />
        {showParchment && (
          <rect
            width="1000"
            height="1000"
            fill="#ecddb5"
            filter="url(#grain)"
            opacity="0.6"
          />
        )}
        {/* Circle line close above the 40 Meems ring */}
        <circle cx={CX} cy={CY} r={MEEM_R + 14} fill="none" stroke={inkColor} strokeWidth="0.8" opacity="0.45" />

        {/* Central large م */}
        <text
          x={CX}
          y={CY - 22}
          textAnchor="middle"
          fontFamily={FONT}
          fontSize="105"
          fontWeight="700"
          fill={inkColor}
          filter="url(#inkBig)"
        >
          م
        </text>

        {/* 40 Meems ring */}
        {meems.map((m, i) => (
          <text
            key={i}
            x={m.x}
            y={m.y}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily={FONT}
            fontSize="20"
            fill={inkColor}
            filter="url(#ink)"
            transform={`rotate(${m.rot},${m.x},${m.y})`}
          >
            م
          </text>
        ))}

        {/* Surah text — every ring is guaranteed ≥80% full so textLength safely compresses */}
        {ringData.map(({ r, top, bot }, i) => {
          const halfC = Math.PI * r;
          return (
            <g key={i}>
              <text fontFamily={FONT} fontSize={FONT_SIZE} fill={inkColor}>
                <textPath
                  href={`#top${i}`}
                  startOffset="0%"
                  textLength={halfC}
                  lengthAdjust="spacingAndGlyphs"
                >
                  {top}
                </textPath>
              </text>
              <text fontFamily={FONT} fontSize={FONT_SIZE} fill={inkColor}>
                <textPath
                  href={`#bot${i}`}
                  startOffset="0%"
                  textLength={halfC}
                  lengthAdjust="spacingAndGlyphs"
                >
                  {bot}
                </textPath>
              </text>
            </g>
          );
        })}
      </svg>
    );
  }
);

CircularCalligraphy.displayName = "CircularCalligraphy";

export default CircularCalligraphy;
