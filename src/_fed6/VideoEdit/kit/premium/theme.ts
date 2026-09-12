import React from "react";
import { loadFont as loadGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";

// ═══════════════════════════════════════════════════════════════════════════
// PREMIUM KIT — SISTEMA DE THEMES
// Un solo set de componentes de estudio, N identidades de canal. El MISMO
// componente (VsDuel, BigStatReveal, TimelinePlayhead…) se ve terroso-vintage,
// BBC-cinematográfico, rústico Amish o alarma-finanzas según el Theme que
// reciba por prop o por <ThemeProvider>.
// RENDER-SAFE: todo estático/determinista. Nada depende del reloj.
// ═══════════════════════════════════════════════════════════════════════════

const garamond = loadGaramond().fontFamily;
const playfair = loadPlayfair().fontFamily;
const inter = loadInter().fontFamily;
const oswald = loadOswald().fontFamily;

export const F_GARAMOND = `${garamond}, 'Iowan Old Style', 'Palatino Linotype', Georgia, serif`;
export const F_PLAYFAIR = `${playfair}, 'Iowan Old Style', Georgia, serif`;
export const F_INTER = `${inter}, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`;
export const F_OSWALD = `${oswald}, 'Arial Narrow', 'Segoe UI', sans-serif`;

export type ThemeColors = {
  /** fondo más profundo → más claro (gradientes de panel) */
  bg0: string;
  bg1: string;
  bg2: string;
  /** cara de tarjeta translúcida (glass del theme) */
  surface: string;
  /** cara de tarjeta opaca (para chips sobre foto) */
  surfaceStrong: string;
  text: string;
  textSoft: string;
  textDim: string;
  /** acento primario del canal */
  accent: string;
  accentSoft: string;
  /** acento secundario (comparaciones, "el otro lado") */
  accent2: string;
  /** highlight cálido (oro/ámbar) para cifras y sellos */
  gold: string;
  danger: string;
  good: string;
  /** color de trazo "marcador/pluma" para flechas y marcos */
  ink: string;
  /** hairline / bordes finos */
  line: string;
  /** color del rim-light / glow */
  glow: string;
  /** color base de sombras (rgba) */
  shadow: string;
  /** texto sobre chips de acento */
  onAccent: string;
};

export type Theme = {
  name: string;
  mode: "light" | "dark";
  fontDisplay: string;
  fontBody: string;
  fontLabel: string;
  color: ThemeColors;
  radius: number;
  texture: "paper" | "grain" | "none";
  rays: boolean;
  raysColor: string;
  /** labels/eyebrows en mayúsculas (broadcast/alarma) o no (editorial) */
  upperLabels: boolean;
  labelSpacing: number;
  /** grosor base del trazo marcador */
  strokeW: number;
  /** peso de display: serif editorial usa 700, sans alarma 900 */
  displayWeight: number;
};

// ── 1) EARTH — El Constructor Libre / huerta / remedios (terroso vintage) ────
export const THEME_EARTH: Theme = {
  name: "earth",
  mode: "light",
  fontDisplay: F_GARAMOND,
  fontBody: F_GARAMOND,
  fontLabel: F_GARAMOND,
  color: {
    bg0: "#EFE7D3",
    bg1: "#E6DCC4",
    bg2: "#D8CBAD",
    surface: "rgba(245,238,220,0.92)",
    surfaceStrong: "#F2EBD8",
    text: "#2A2620",
    textSoft: "rgba(42,38,32,0.68)",
    textDim: "rgba(42,38,32,0.42)",
    accent: "#7C8A5A",
    accentSoft: "#AEBA8C",
    accent2: "#6F8478",
    gold: "#A9794A",
    danger: "#B0503C",
    good: "#6E8B47",
    ink: "#2A2620",
    line: "rgba(42,38,32,0.16)",
    glow: "rgba(169,121,74,0.5)",
    shadow: "rgba(42,38,32,0.2)",
    onAccent: "#F7F1DF",
  },
  radius: 26,
  texture: "paper",
  rays: true,
  raysColor: "rgba(169,121,74,0.16)",
  upperLabels: true,
  labelSpacing: 4,
  strokeW: 6,
  displayWeight: 800,
};

// ── 2) NATURE — documental fauna cinematográfico (BBC nocturno) ──────────────
export const THEME_NATURE: Theme = {
  name: "nature",
  mode: "dark",
  fontDisplay: F_PLAYFAIR,
  fontBody: F_INTER,
  fontLabel: F_INTER,
  color: {
    bg0: "#0A1411",
    bg1: "#10201A",
    bg2: "#1A3129",
    surface: "rgba(14,28,23,0.82)",
    surfaceStrong: "#122720",
    text: "#F2EFE4",
    textSoft: "rgba(242,239,228,0.72)",
    textDim: "rgba(242,239,228,0.44)",
    accent: "#D9A441",
    accentSoft: "#8A7440",
    accent2: "#5C9C87",
    gold: "#E4BE6A",
    danger: "#C4563F",
    good: "#7FA95B",
    ink: "#E9E2CE",
    line: "rgba(242,239,228,0.16)",
    glow: "rgba(217,164,65,0.55)",
    shadow: "rgba(0,0,0,0.5)",
    onAccent: "#141B12",
  },
  radius: 20,
  texture: "grain",
  rays: true,
  raysColor: "rgba(217,164,65,0.10)",
  upperLabels: true,
  labelSpacing: 6,
  strokeW: 5,
  displayWeight: 700,
};

// ── 3) AMISH — rústico serif claro (homesteading calmo) ──────────────────────
export const THEME_AMISH: Theme = {
  name: "amish",
  mode: "light",
  fontDisplay: F_GARAMOND,
  fontBody: F_GARAMOND,
  fontLabel: F_GARAMOND,
  color: {
    bg0: "#F1E9D6",
    bg1: "#E9DFC7",
    bg2: "#D9CCAC",
    surface: "rgba(247,241,226,0.94)",
    surfaceStrong: "#F5EFDE",
    text: "#33291D",
    textSoft: "rgba(51,41,29,0.68)",
    textDim: "rgba(51,41,29,0.42)",
    accent: "#8A5A33",
    accentSoft: "#C0996E",
    accent2: "#5F6E4E",
    gold: "#B98A4E",
    danger: "#933F2C",
    good: "#647B44",
    ink: "#33291D",
    line: "rgba(51,41,29,0.18)",
    glow: "rgba(185,138,78,0.45)",
    shadow: "rgba(51,41,29,0.22)",
    onAccent: "#F7F1E0",
  },
  radius: 14,
  texture: "paper",
  rays: true,
  raysColor: "rgba(185,138,78,0.15)",
  upperLabels: false,
  labelSpacing: 3,
  strokeW: 5,
  displayWeight: 700,
};

// ── 4) ALARM — finanzas jubilados (negro / rojo / oro, urgencia) ─────────────
export const THEME_ALARM: Theme = {
  name: "alarm",
  mode: "dark",
  fontDisplay: F_OSWALD,
  fontBody: F_INTER,
  fontLabel: F_OSWALD,
  color: {
    bg0: "#08080A",
    bg1: "#121216",
    bg2: "#1E1E24",
    surface: "rgba(16,16,20,0.86)",
    surfaceStrong: "#16161B",
    text: "#FFFFFF",
    textSoft: "rgba(255,255,255,0.74)",
    textDim: "rgba(255,255,255,0.44)",
    accent: "#E5352B",
    accentSoft: "#8E2A24",
    accent2: "#E07B39",
    gold: "#F2C14E",
    danger: "#FF4136",
    good: "#3DBE6B",
    ink: "#F5F2E8",
    line: "rgba(255,255,255,0.14)",
    glow: "rgba(229,53,43,0.6)",
    shadow: "rgba(0,0,0,0.6)",
    onAccent: "#FFFFFF",
  },
  radius: 12,
  texture: "grain",
  rays: false,
  raysColor: "rgba(242,193,78,0.08)",
  upperLabels: true,
  labelSpacing: 5,
  strokeW: 7,
  displayWeight: 700,
};

// ── 5) MEDICO — canal "Dr. Federer" (clínico moderno, autoridad limpia) ──────
// Blanco/gris frío + teal clínico + sans Inter. Consultorio, bata, confianza.
// Light mode, esquinas redondeadas, sombras suaves, cero textura de papel.
export const THEME_MEDICO: Theme = {
  name: "medico",
  mode: "light",
  fontDisplay: F_INTER,
  fontBody: F_INTER,
  fontLabel: F_INTER,
  color: {
    bg0: "#F4F7F9",
    bg1: "#EAF1F4",
    bg2: "#DCE8ED",
    surface: "rgba(255,255,255,0.94)",
    surfaceStrong: "#FFFFFF",
    text: "#14232B",
    textSoft: "rgba(20,35,43,0.66)",
    textDim: "rgba(20,35,43,0.40)",
    accent: "#109C99",
    accentSoft: "#7FC9C6",
    accent2: "#2E7DB0",
    gold: "#E6A23C",
    danger: "#E0523E",
    good: "#2FA36B",
    ink: "#14232B",
    line: "rgba(20,35,43,0.12)",
    glow: "rgba(16,156,153,0.45)",
    shadow: "rgba(20,35,43,0.14)",
    onAccent: "#FFFFFF",
  },
  radius: 24,
  texture: "none",
  rays: false,
  raysColor: "rgba(16,156,153,0.10)",
  upperLabels: true,
  labelSpacing: 4,
  strokeW: 5,
  displayWeight: 800,
};

export const THEMES: Record<string, Theme> = {
  earth: THEME_EARTH,
  nature: THEME_NATURE,
  amish: THEME_AMISH,
  alarm: THEME_ALARM,
  medico: THEME_MEDICO,
};

// ── Context + hook ────────────────────────────────────────────────────────────
export const ThemeContext = React.createContext<Theme>(THEME_EARTH);

/** Devuelve el theme: prop explícita > context > earth. */
export const useTheme = (override?: Theme): Theme => {
  const ctx = React.useContext(ThemeContext);
  return override ?? ctx;
};

export const ThemeProvider: React.FC<{
  theme: Theme;
  children: React.ReactNode;
}> = ({ theme, children }) =>
  React.createElement(ThemeContext.Provider, { value: theme }, children);

// Presets de spring compartidos por todo el kit premium.
export const SPR = {
  soft: { damping: 200, mass: 1, stiffness: 60 },
  settle: { damping: 18, mass: 0.9, stiffness: 120 },
  snappy: { damping: 15, mass: 0.7, stiffness: 170 },
  pop: { damping: 11, mass: 0.6, stiffness: 220 },
  slam: { damping: 9, mass: 0.8, stiffness: 260 },
} as const;
