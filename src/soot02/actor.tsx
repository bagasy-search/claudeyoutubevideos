import React from "react";
import { interpolate } from "remotion";
import { Persona, APION, type Ropa } from "./persona";
import { Emote, cabeza } from "./kit";

// Apion ACTUANDO: entra caminando desde el borde y encadena acciones según el guion.
// acts = [[t, acción], ...]; cada acción dura hasta la siguiente.
export type Act = "habla" | "senala" | "rema" | "miedo" | "piensa" | "festeja" | "asombro" | "enojado" | "triste" | "cansado" | "orgullo";
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export const Apion: React.FC<{ t: number; t0: number; x: number; y?: number; h?: number; acts: [number, Act][]; flip?: boolean; desde?: "izq" | "der" | "nada"; seed?: number; ropa?: Ropa; casco?: "no" | "legion" | "centurion"; t1?: number; borda?: number }> = ({ t, t0, x, y = 1040, h = 400, acts, flip, desde, seed = 2, ropa = APION, casco = "no", t1 = 1e9, borda }) => {
  if (t < t0 || t > t1) return null;
  const lado = desde ?? (x < 960 ? "izq" : "der");
  const k = lado === "nada" ? 1 : interpolate(t, [t0, t0 + 0.55], [0, 1], cl);
  const xx = lado === "nada" ? x : interpolate(k, [0, 1], [lado === "izq" ? -h * 0.5 : 1920 + h * 0.5, x]);
  let i = -1;
  for (let j = 0; j < acts.length; j++) if (t >= acts[j][0]) i = j;
  const a: Act = i < 0 ? "habla" : acts[i][1];
  const ta = i < 0 ? t0 : acts[i][0];
  const lt = t - ta;
  const w = Math.sin(t * 6);
  // pose por acción
  let expr: React.ComponentProps<typeof Persona>["expr"] = "neutro";
  let bD = 10, cD = 20, bI = 10, cI = 20, habla = false, inclina = 0, salta: number | undefined;
  let emo: React.ComponentProps<typeof Emote>["tipo"] | null = null;
  const sube = Math.min(1, lt / 0.25);
  if (a === "habla") { habla = true; expr = "feliz"; bD = 40 + w * 22 * sube; cD = 60 + Math.sin(t * 4) * 20; bI = 25 + Math.sin(t * 3.3) * 10; }
  if (a === "senala") { expr = "sorpresa"; bD = 20 + 120 * sube; cD = 8; bI = 20; habla = lt < 1.5; }
  if (a === "rema") { const f = Math.sin(t * 5.2); expr = "cansado" as never; bD = bI = 75 + f * 35; cD = cI = 50 - f * 25; inclina = f * 9; emo = "sudor"; }
  if (a === "miedo") { expr = "miedo"; bD = bI = 20 + 130 * sube; cD = cI = 120; inclina = -4 + Math.sin(t * 30) * 1.5; emo = "sudor"; }
  if (a === "piensa") { expr = "neutro"; bD = 30 + 110 * sube; cD = 150; bI = 40; cI = 90; emo = "preg"; }
  if (a === "festeja") { expr = "feliz"; bD = bI = 20 + 145 * sube; cD = cI = 10 + Math.abs(w) * 20; salta = ta; emo = "brillos"; }
  if (a === "asombro") { expr = "sorpresa"; bD = bI = 20 + 50 * sube; cD = cI = 40; emo = "excl"; }
  if (a === "enojado") { expr = "enojado"; bD = 120 + Math.sin(t * 14) * 15; cD = 90; bI = 30; emo = "enojo"; habla = true; }
  if (a === "triste") { expr = "triste"; bD = bI = 15; cD = cI = 15; inclina = 6; emo = "lagrimas"; }
  if (a === "cansado") { expr = "triste"; bD = bI = 8; cD = cI = 10; inclina = 10 + Math.sin(t * 2) * 3; emo = "sudor"; }
  if (a === "orgullo") { expr = "orgullo"; bD = bI = 45; cD = cI = 150; habla = true; }
  if (expr === ("cansado" as never)) expr = "triste";
  const c = cabeza(xx, y, h);
  return (
    <>
      <Persona x={xx} y={y} h={h} t={t} seed={seed} ropa={ropa} casco={casco} expr={expr} habla={habla} camina={k < 1 ? 1.8 : 0} bD={bD} cD={cD} bI={bI} cI={cI} inclina={inclina} salta={salta} flip={flip ?? lado === "der"} />
      {borda !== undefined && <Borda y={borda} />}
      {emo && k >= 1 && <Emote t={t} t0={ta + 0.1} tipo={emo} x={c.x} y={c.y} s={c.s} />}
    </>
  );
};

// borda del barco en primer plano: el personaje está a bordo, detrás de la baranda
export const Borda: React.FC<{ y: number }> = ({ y: borda }) => (
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
          {Array.from({ length: 17 }, (_, i) => <rect key={i} x={i * 120 + 20} y={borda - 120} width={14} height={124} fill="#6b3f1e" />)}
          <rect x={-20} y={borda - 132} width={1960} height={18} rx={9} fill="#c48a4c" stroke="#5a3418" strokeWidth={4} />
          <rect x={-20} y={borda} width={1960} height={1100 - borda} fill="#7a4a24" />
          <rect x={-20} y={borda} width={1960} height={16} fill="#a8723e" />
          {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={160 + i * 330} cy={borda + 40} r={9} fill="#3e2414" />)}
        </svg>
);

// escenario interior para los planos que eran fondo violeta liso: oficina de reclutamiento / bodega del barco
export const Sala: React.FC<{ t: number; tipo?: "oficina" | "bodega" }> = ({ t, tipo = "oficina" }) => {
  const of = tipo === "oficina";
  const pared = of ? "#c9a77a" : "#6b4428", pared2 = of ? "#b08c60" : "#55331c", piso = of ? "#8a5a34" : "#3e2414";
  const llama = 1 + Math.sin(t * 13) * 0.08 + Math.sin(t * 7.3) * 0.06;
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      <rect width={1920} height={1080} fill={pared} />
      {of
        ? Array.from({ length: 9 }, (_, f) => Array.from({ length: 13 }, (_, c) => <rect key={`${f}-${c}`} x={c * 160 - (f % 2) * 80} y={f * 90} width={156} height={86} fill={pared2} opacity={0.35} rx={6} />))
        : Array.from({ length: 12 }, (_, i) => <rect key={i} x={i * 170} y={0} width={20} height={1080} fill={pared2} />)}
      {of ? (
        <>
          {/* estante con rollos */}
          <rect x={60} y={260} width={360} height={20} fill="#6b4320" /><rect x={60} y={400} width={360} height={20} fill="#6b4320" />
          {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={90 + (i % 5) * 70} cy={i < 5 ? 236 : 376} r={24} fill="#efe0b8" stroke="#8a6a3a" strokeWidth={5} />)}
          {/* ventana al puerto */}
          <rect x={1460} y={170} width={300} height={240} rx={120} fill="#7fc4f0" stroke="#6b4320" strokeWidth={14} />
          <rect x={1466} y={330} width={288} height={74} fill="#2a74b8" />
          <path d={`M ${1520 + Math.sin(t) * 20} 330 l 40 -50 l 40 50 Z`} fill="#fff6d8" />
        </>
      ) : (
        <>
          {/* bancos y remos guardados, ánforas */}
          {Array.from({ length: 6 }, (_, i) => <line key={i} x1={80 + i * 300} y1={300} x2={260 + i * 300} y2={120} stroke="#a8723e" strokeWidth={16} strokeLinecap="round" />)}
          <rect x={0} y={330} width={1920} height={26} fill="#3e2414" />
        </>
      )}
      <rect x={0} y={820} width={1920} height={260} fill={piso} />
      {Array.from({ length: 10 }, (_, i) => <line key={i} x1={i * 220} y1={820} x2={i * 220 - 120} y2={1080} stroke="#000" strokeOpacity={0.15} strokeWidth={6} />)}
      {/* antorcha */}
      <g transform="translate(1180 330)">
        <rect x={-10} y={0} width={20} height={90} fill="#5a3418" />
        <ellipse cx={0} cy={-20 * llama} rx={26 * llama} ry={44 * llama} fill="#ffb347" />
        <ellipse cx={0} cy={-12} rx={13} ry={24} fill="#fff1b0" />
        <circle cx={0} cy={-10} r={160} fill="#ffb347" opacity={0.1 * llama} />
      </g>
    </svg>
  );
};
