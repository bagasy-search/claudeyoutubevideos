// OlrIcons — iconos SVG de la despensa (papa, cebolla, zanahoria, manzana, repollo, frasco, barril, bolsa, carne, termómetro…).
// Dibujados a mano en un viewBox 100x100, con relleno plano + un trazo oscuro tipo grabado; se usan en las tarjetas Olr*.
import React from "react";
import { OLE } from "./OleTheme";

const ink = "#2A2118";
type P = { size?: number; style?: React.CSSProperties };
const S: React.FC<P & { children: React.ReactNode }> = ({ size = 100, style, children }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", ...style }}>{children}</svg>
);

export const IcoPotato: React.FC<P & { sprout?: number; green?: number }> = ({ sprout = 0, green = 0, ...p }) => (
  <S {...p}>
    <ellipse cx="50" cy="56" rx="34" ry="25" fill={green > 0 ? "#8FA05A" : "#B98C5A"} stroke={ink} strokeWidth="3" transform="rotate(-12 50 56)" />
    <circle cx="38" cy="52" r="2.4" fill="#7A5A33" /><circle cx="58" cy="62" r="2.2" fill="#7A5A33" /><circle cx="64" cy="48" r="2" fill="#7A5A33" />
    {sprout > 0 ? <path d={`M 40 36 q ${-6 * sprout} ${-14 * sprout} ${4 * sprout} ${-22 * sprout}`} stroke="#E8EDC8" strokeWidth="4" fill="none" strokeLinecap="round" /> : null}
    {sprout > 0 ? <path d={`M 60 34 q ${8 * sprout} ${-12 * sprout} ${-2 * sprout} ${-24 * sprout}`} stroke="#E8EDC8" strokeWidth="4" fill="none" strokeLinecap="round" /> : null}
  </S>
);
export const IcoOnion: React.FC<P> = (p) => (
  <S {...p}>
    <path d="M 50 18 q 4 -10 10 -12 q -2 8 -6 14" fill="#B79B5E" stroke={ink} strokeWidth="2.5" />
    <path d="M 50 20 C 18 32 12 70 50 88 C 88 70 82 32 50 20 Z" fill="#E1B552" stroke={ink} strokeWidth="3" />
    <path d="M 50 22 C 38 42 38 68 50 86 M 50 22 C 62 42 62 68 50 86" fill="none" stroke="#B88A2E" strokeWidth="2" />
  </S>
);
export const IcoCarrot: React.FC<P & { bitter?: number }> = ({ bitter = 0, ...p }) => (
  <S {...p}>
    <path d="M 34 30 L 66 30 L 52 92 Z" fill={bitter > 0.5 ? "#9A6A3A" : "#E4772B"} stroke={ink} strokeWidth="3" strokeLinejoin="round" />
    <path d="M 40 44 h 10 M 44 58 h 8 M 47 72 h 5" stroke="#B5551A" strokeWidth="2" />
    <path d="M 50 30 q -14 -10 -16 -24 M 50 30 q 0 -14 2 -26 M 50 30 q 14 -8 18 -22" stroke="#3F7A3A" strokeWidth="5" fill="none" strokeLinecap="round" />
  </S>
);
export const IcoApple: React.FC<P> = (p) => (
  <S {...p}>
    <path d="M 50 30 C 30 14 8 34 14 58 C 20 84 40 92 50 86 C 60 92 80 84 86 58 C 92 34 70 14 50 30 Z" fill="#C73B30" stroke={ink} strokeWidth="3" />
    <path d="M 50 30 q 0 -14 8 -22" stroke="#4A3320" strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d="M 56 14 q 14 -6 20 4 q -12 6 -20 -4 Z" fill="#4C8A3E" stroke={ink} strokeWidth="2" />
    <path d="M 26 46 q 4 -10 14 -12" stroke="#E87A6E" strokeWidth="4" fill="none" strokeLinecap="round" />
  </S>
);
export const IcoCabbage: React.FC<P> = (p) => (
  <S {...p}>
    <circle cx="50" cy="54" r="38" fill="#7FB05A" stroke={ink} strokeWidth="3" />
    <path d="M 50 20 C 28 36 28 72 50 90 M 50 20 C 72 36 72 72 50 90 M 14 56 C 34 44 66 44 86 56" fill="none" stroke="#D7EBB8" strokeWidth="3" />
    <path d="M 30 30 C 20 44 20 64 30 76" fill="none" stroke="#4E8B3A" strokeWidth="3" />
  </S>
);
export const IcoJar: React.FC<P & { fill?: string; crack?: boolean }> = ({ fill = "#E8C26A", crack, ...p }) => (
  <S {...p}>
    <rect x="22" y="10" width="56" height="12" rx="3" fill="#9AA0A6" stroke={ink} strokeWidth="3" />
    <path d="M 26 22 h 48 v 64 q 0 8 -8 8 h -32 q -8 0 -8 -8 Z" fill="#DCEBF2" fillOpacity="0.55" stroke={ink} strokeWidth="3" />
    <path d="M 29 48 h 42 v 38 q 0 5 -5 5 h -32 q -5 0 -5 -5 Z" fill={fill} stroke="none" opacity="0.95" />
    {crack ? <path d="M 50 22 l -6 18 l 10 12 l -8 16 l 8 20" stroke={ink} strokeWidth="3" fill="none" /> : null}
  </S>
);
export const IcoBarrel: React.FC<P> = (p) => (
  <S {...p}>
    <path d="M 24 12 C 10 36 10 64 24 88 H 76 C 90 64 90 36 76 12 Z" fill="#B5864F" stroke={ink} strokeWidth="3" />
    <path d="M 18 28 C 40 34 60 34 82 28 M 14 50 C 38 58 62 58 86 50 M 18 72 C 40 80 60 80 82 72" fill="none" stroke="#4A4A48" strokeWidth="5" />
    <path d="M 40 14 V 86 M 60 14 V 86" stroke="#8C6234" strokeWidth="2" />
  </S>
);
export const IcoSack: React.FC<P> = (p) => (
  <S {...p}>
    <path d="M 30 22 L 70 22 L 78 40 C 90 60 84 88 66 92 H 34 C 16 88 10 60 22 40 Z" fill="#CDB07A" stroke={ink} strokeWidth="3" />
    <path d="M 32 22 q 18 12 36 0" fill="#B99A60" stroke={ink} strokeWidth="3" />
    <path d="M 28 52 q 22 6 44 0 M 24 70 q 26 8 52 0" fill="none" stroke="#9B7E4A" strokeWidth="2" />
  </S>
);
export const IcoBeef: React.FC<P & { frost?: number }> = ({ frost = 0, ...p }) => (
  <S {...p}>
    <path d="M 14 40 C 14 20 40 14 60 18 C 84 22 92 40 84 64 C 78 84 52 88 32 80 C 14 72 14 56 14 40 Z" fill="#B5453A" stroke={ink} strokeWidth="3" />
    <path d="M 30 36 q 20 -6 40 4 M 28 58 q 24 6 46 -6" stroke="#F1D7C8" strokeWidth="4" fill="none" strokeLinecap="round" />
    <circle cx="66" cy="62" r="9" fill="#EBD9C2" stroke={ink} strokeWidth="2" />
    {frost > 0 ? <path d="M 14 40 C 14 20 40 14 60 18 C 84 22 92 40 84 64 C 78 84 52 88 32 80 C 14 72 14 56 14 40 Z" fill="#E8F4FF" fillOpacity={0.62 * frost} stroke="#FFFFFF" strokeOpacity={frost} strokeWidth="2" strokeDasharray="3 5" /> : null}
  </S>
);
export const IcoFlour: React.FC<P> = (p) => (
  <S {...p}>
    <path d="M 28 20 L 72 20 L 80 40 C 86 62 82 88 68 92 H 32 C 18 88 14 62 20 40 Z" fill="#F1E7D0" stroke={ink} strokeWidth="3" />
    <path d="M 30 20 q 20 12 40 0" fill="#DCCFAE" stroke={ink} strokeWidth="3" />
    <path d="M 36 62 q 14 -14 28 0 q -14 14 -28 0 Z" fill="#CDB07A" opacity="0.55" />
  </S>
);
export const IcoBean: React.FC<P> = (p) => (
  <S {...p}>
    <path d="M 22 30 C 30 8 66 10 74 30 C 80 50 70 76 50 84 C 30 80 16 54 22 30 Z" fill="#EFE3C6" stroke={ink} strokeWidth="3" />
    <path d="M 38 40 q 6 14 2 30" fill="none" stroke="#B59A6A" strokeWidth="3" strokeLinecap="round" />
    <ellipse cx="62" cy="30" rx="6" ry="4" fill="#B59A6A" />
  </S>
);
export const IcoThermo: React.FC<P & { level?: number; color?: string }> = ({ level = 0.5, color = "#D24A3A", ...p }) => (
  <S {...p}>
    <rect x="40" y="8" width="20" height="62" rx="10" fill="#F4EFE3" stroke={ink} strokeWidth="3" />
    <circle cx="50" cy="78" r="15" fill={color} stroke={ink} strokeWidth="3" />
    <rect x="46.5" y={66 - 52 * level} width="7" height={14 + 52 * level} rx="3.5" fill={color} />
    {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M 62 ${16 + i * 10} h ${i % 2 ? 6 : 10}`} stroke={ink} strokeWidth="2" />)}
  </S>
);
export const IcoSnow: React.FC<P> = (p) => (
  <S {...p}>
    <g stroke="#7FB4DA" strokeWidth="5" strokeLinecap="round" fill="none">
      <path d="M 50 8 V 92 M 14 29 L 86 71 M 86 29 L 14 71" />
      <path d="M 40 14 L 50 24 L 60 14 M 40 86 L 50 76 L 60 86 M 18 40 L 32 40 L 26 28 M 82 60 L 68 60 L 74 72" strokeWidth="4" />
    </g>
  </S>
);
export const IcoFlame: React.FC<P> = (p) => (
  <S {...p}>
    <path d="M 50 8 C 58 30 82 38 76 66 C 72 86 56 92 50 92 C 36 92 22 82 24 64 C 26 50 38 46 40 32 C 46 36 48 24 50 8 Z" fill="#E4772B" stroke={ink} strokeWidth="3" />
    <path d="M 50 44 C 56 56 66 60 62 74 C 60 82 54 86 50 86 C 42 86 36 80 38 70 C 40 62 46 58 50 44 Z" fill="#F7C25B" />
  </S>
);
export const IcoDrop: React.FC<P & { color?: string }> = ({ color = "#4B93C9", ...p }) => (
  <S {...p}><path d="M 50 8 C 70 36 82 50 82 64 C 82 82 68 92 50 92 C 32 92 18 82 18 64 C 18 50 30 36 50 8 Z" fill={color} stroke={ink} strokeWidth="3" /><path d="M 36 62 q 2 12 12 14" stroke="#CFE8F7" strokeWidth="4" fill="none" strokeLinecap="round" /></S>
);
export const IcoGerm: React.FC<P & { awake?: number; color?: string }> = ({ awake = 0, color = "#6BA04A", ...p }) => (
  <S {...p}>
    <g stroke={color} strokeWidth="4" strokeLinecap="round">{[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <path key={a} d={`M 50 50 L ${50 + 46 * Math.cos((a * Math.PI) / 180)} ${50 + 46 * Math.sin((a * Math.PI) / 180)}`} />)}</g>
    <circle cx="50" cy="50" r="30" fill={color} stroke={ink} strokeWidth="3" />
    {awake > 0.5 ? (<><circle cx="40" cy="46" r="6" fill="#fff" stroke={ink} strokeWidth="2" /><circle cx="60" cy="46" r="6" fill="#fff" stroke={ink} strokeWidth="2" /><circle cx="41" cy="47" r="2.6" fill={ink} /><circle cx="61" cy="47" r="2.6" fill={ink} /><path d="M 38 62 q 12 10 24 0" stroke={ink} strokeWidth="3" fill="none" strokeLinecap="round" /></>)
      : (<><path d="M 34 48 q 6 5 12 0 M 54 48 q 6 5 12 0" stroke={ink} strokeWidth="3" fill="none" strokeLinecap="round" /><path d="M 42 62 h 16" stroke={ink} strokeWidth="3" strokeLinecap="round" /></>)}
  </S>
);
export const IcoCheck: React.FC<P & { color?: string }> = ({ color = "#2F7A3E", ...p }) => (
  <S {...p}><circle cx="50" cy="50" r="42" fill="#fff" fillOpacity="0.9" stroke={color} strokeWidth="6" /><path d="M 28 52 L 44 68 L 74 34" stroke={color} strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" /></S>
);
export const IcoCross: React.FC<P & { color?: string }> = ({ color = "#8E2B2B", ...p }) => (
  <S {...p}><circle cx="50" cy="50" r="42" fill="#fff" fillOpacity="0.9" stroke={color} strokeWidth="6" /><path d="M 32 32 L 68 68 M 68 32 L 32 68" stroke={color} strokeWidth="10" fill="none" strokeLinecap="round" /></S>
);
export const IcoPine: React.FC<P> = (p) => (
  <S {...p}><path d="M 50 4 L 74 38 H 62 L 84 66 H 66 L 90 94 H 10 L 34 66 H 16 L 38 38 H 26 Z" fill="#2C5A3C" stroke={ink} strokeWidth="2.5" /><rect x="44" y="90" width="12" height="8" fill="#5A3A22" /></S>
);
export const IcoCabin: React.FC<P> = (p) => (
  <S {...p}>
    <path d="M 8 50 L 50 18 L 92 50 Z" fill="#7A4E2D" stroke={ink} strokeWidth="3" />
    <rect x="16" y="50" width="68" height="40" fill="#B5864F" stroke={ink} strokeWidth="3" />
    {[58, 66, 74, 82].map((y) => <path key={y} d={`M 16 ${y} H 84`} stroke="#8C6234" strokeWidth="2" />)}
    <rect x="42" y="64" width="16" height="26" fill="#5A3A22" stroke={ink} strokeWidth="2" /><rect x="68" y="12" width="8" height="22" fill="#6C6C6A" stroke={ink} strokeWidth="2" />
  </S>
);
export const IcoSled: React.FC<P> = (p) => (
  <S {...p}>
    <path d="M 10 80 q 0 10 12 10 H 82 q 8 0 8 -8" stroke={ink} strokeWidth="5" fill="none" strokeLinecap="round" />
    <rect x="20" y="52" width="60" height="22" fill="#9C6B3C" stroke={ink} strokeWidth="3" />
    <rect x="30" y="30" width="22" height="22" fill="#CDB07A" stroke={ink} strokeWidth="3" /><rect x="54" y="34" width="20" height="18" fill="#B5864F" stroke={ink} strokeWidth="3" />
    <path d="M 26 74 V 84 M 74 74 V 84" stroke={ink} strokeWidth="4" />
  </S>
);
export const IcoLantern: React.FC<P> = (p) => (
  <S {...p}>
    <path d="M 38 14 q 12 -12 24 0" stroke={ink} strokeWidth="4" fill="none" /><rect x="34" y="18" width="32" height="8" fill="#4A4A48" stroke={ink} strokeWidth="2" />
    <path d="M 36 26 H 64 V 76 H 36 Z" fill="#FFE8A6" fillOpacity="0.8" stroke={ink} strokeWidth="3" /><path d="M 50 40 q 8 8 0 20 q -8 -12 0 -20 Z" fill="#E4772B" />
    <rect x="32" y="76" width="36" height="10" fill="#4A4A48" stroke={ink} strokeWidth="2" />
  </S>
);
export { OLE };
