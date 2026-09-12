// Design system for the documentary / talking-head video overlays.
//
// ★★★ ONE BRAND — EARTHY VINTAGE SERIF ★★★
// This channel's niche (gardening / construction / home-remedy / homestead /
// retirement) demands a CLASSIC, EARTHY, VINTAGE look — like the competitor:
// a serif typeface with old-style numerals (the "1903" archival look) over a
// muted, natural palette (sage green, cream/parchment, dark warm-brown ink,
// sepia). The OLD dark graphite + gold "cold" palette and the modern Montserrat
// font were WRONG for this niche and have been REMOVED at the root. Do NOT bring
// them back. This same palette must ALSO drive the gpt-image-2 diagram prompts so
// the whole video — footage, cards, diagrams, type — reads as one brand.
//
// COLORS = the single brand palette. FONT_STACK = the serif brand font.
// No neon borders — soft paper cards, big radii, gentle shadows.

import { loadFont } from "@remotion/google-fonts/EBGaramond";

// EB Garamond: classic serif, true old-style (text-figure) numerals → the
// archival "1903" feel of the competitor. Used for everything in this niche.
export const { fontFamily: SERIF } = loadFont();

export const FPS = 30;

export type Palette = {
  mode: "dark" | "light";
  text: string;
  textSoft: string;
  textDim: string;
  accent: string;
  accentSoft: string;
  amber: string;
  cold: string; // garden: repurposed as the secondary (sage/herb green)
  coldSoft: string;
  danger: string;
  good: string;
  bg0: string;
  bg1: string;
  bg2: string;
  ink: string;
};

// ── THE BRAND PALETTE — earthy / vintage / natural ───────────────────────────
// Muted, sun-faded, archival. Cream parchment paper, dark warm-brown ink, sage
// & herb green, sepia/tobacco warmth. This is the ONLY palette. It mirrors the
// competitor and ties the whole channel together (also feed these hex values
// into the gpt-image-2 diagram prompts: "muted sage green, cream parchment,
// dark warm-brown ink, sepia — vintage botanical / archival look").
export const PALETTE_EARTH: Palette = {
  mode: "light",
  text: "#2A2620", // dark warm-brown ink (headlines, body)
  textSoft: "rgba(42,38,32,0.66)",
  textDim: "rgba(42,38,32,0.40)",
  accent: "#7C8A5A", // muted sage / herb green (primary highlight)
  accentSoft: "#AEBA8C",
  amber: "#A9794A", // sepia / tobacco warmth
  cold: "#6F8478", // muted eucalyptus (secondary / "cool" beats, still earthy)
  coldSoft: "#A9BAB0",
  danger: "#B0503C", // faded terracotta red
  good: "#6E8B47", // garden green
  bg0: "#EFE7D3", // cream parchment (lightest)
  bg1: "#E6DCC4",
  bg2: "#D8CBAD", // aged paper / sepia card
  ink: "#2A2620",
};

// COLORS = the single brand palette. (The old dark "cold" palette and the
// pastel "garden" palette were removed — this niche is one consistent brand.)
export const COLORS = PALETTE_EARTH;

// Brand card surface. Aged-paper / parchment card with a soft sepia border —
// NOT frosted neon glass. `dark` = a deep ink card (for captions over bright
// footage); `light` = warm parchment (default, for cards on the cream bg).
export const glass = (
  variant: "light" | "dark" = "light",
): React.CSSProperties => ({
  background:
    variant === "dark" ? "rgba(34,30,26,0.74)" : "rgba(239,231,211,0.92)",
  backdropFilter: "blur(20px) saturate(125%)",
  WebkitBackdropFilter: "blur(20px) saturate(125%)",
  border:
    variant === "dark"
      ? "1px solid rgba(239,231,211,0.16)"
      : "1px solid rgba(42,38,32,0.16)",
  borderRadius: 22,
  boxShadow:
    variant === "dark"
      ? "0 24px 60px rgba(0,0,0,0.42), inset 0 1px 0 rgba(239,231,211,0.12)"
      : "0 18px 44px rgba(42,38,32,0.18), inset 0 1px 0 rgba(255,255,255,0.45)",
});

// Serif brand stack. EB Garamond first (old-style numerals), then platform serifs.
export const FONT_STACK = `${SERIF}, 'Iowan Old Style', 'Palatino Linotype', Georgia, 'Times New Roman', serif`;

// Spring presets for fluid motion.
export const SPRING_SOFT = { damping: 18, mass: 0.9, stiffness: 120 };
export const SPRING_SNAPPY = { damping: 14, mass: 0.7, stiffness: 180 };
export const SPRING_ZOOM = { damping: 16, mass: 0.6, stiffness: 220 };

export const sec = (s: number) => Math.round(s * FPS);
