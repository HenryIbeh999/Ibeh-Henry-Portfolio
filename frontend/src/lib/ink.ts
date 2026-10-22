/**
 * Vendor ink on a near-black ground.
 *
 * A lot of vendor brands are dark by design: Flask and Ollama ship black
 * marks, pandas ships deep violet, Django ships near-black green. Painted
 * straight onto `--background` they disappear. Rather than re-colouring the
 * brands (which would be a lie about what the tool is), we keep the hue and
 * lift the lightness until the mark reads. The result still reads as "this is
 * the Django logo" at a glance.
 */

type Hsl = { h: number; s: number; l: number };

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const value = hex.replace("#", "");
  const full =
    value.length === 3
      ? value
          .split("")
          .map((c) => c + c)
          .join("")
      : value;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function rgbToHsl({ r, g, b }: { r: number; g: number; b: number }): Hsl {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return { h, s, l };
}

function hslToHex({ h, s, l }: Hsl): string {
  if (s === 0) {
    const v = Math.round(l * 255);
    const part = v.toString(16).padStart(2, "0");
    return `#${part}${part}${part}`;
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const channel = (t: number) => {
    let v = t;
    if (v < 0) v += 1;
    if (v > 1) v -= 1;
    if (v < 1 / 6) return p + (q - p) * 6 * v;
    if (v < 1 / 2) return q;
    if (v < 2 / 3) return p + (q - p) * (2 / 3 - v) * 6;
    return p;
  };
  const toHex = (v: number) =>
    Math.round(channel(v) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(h + 1 / 3)}${toHex(h)}${toHex(h - 1 / 3)}`;
}

/** Minimum lightness a vendor mark needs to clear the near-black ground. */
const MIN_LIGHTNESS = 0.62;
/** Achromatic marks (black logos) are inverted rather than tinted. */
const NEUTRAL_INK = "#D4D4D8";

/**
 * Returns a legible version of a vendor brand colour for the dark ground.
 * Hue and saturation are preserved; only lightness moves.
 */
export function readableInk(hex: string): string {
  const { h, s, l } = rgbToHsl(hexToRgb(hex));

  // Black brands have no hue to preserve — invert them to a light neutral.
  if (s < 0.08) return l < 0.5 ? NEUTRAL_INK : hex;

  if (l >= MIN_LIGHTNESS) return hex;

  // Tame the saturation a little as we lift, so lifted hues stay printed
  // rather than turning neon.
  const lifted = Math.min(s, 0.68);
  return hslToHex({ h, s: lifted, l: MIN_LIGHTNESS });
}
