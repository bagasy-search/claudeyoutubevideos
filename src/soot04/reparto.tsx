import React from "react";
import { Persona, GREEN, MARINO, CAPITAN, Expr } from "./persona";

// el protagonista (el greenhand): camisa azul a rayas, pantalón oscuro; gorro rojo desde que se embarca
export const Chico: React.FC<{ x: number; y: number; h?: number; t: number; expr?: Expr; habla?: boolean; camina?: number; bI?: number; bD?: number; cI?: number; cD?: number; mira?: number; miraY?: number; flip?: boolean; gorro?: boolean | "paja"; salta?: number; aparece?: number; inclina?: number; manoD?: React.ReactNode; manoI?: React.ReactNode; viejo?: boolean }> = ({ gorro = true, h = 230, ...p }) => (
  <Persona {...p} h={h} seed={7} ropa={GREEN} rayas="#eaf2ff" pantalon="#2a3a5a" casco={gorro === "paja" ? "paja" : gorro ? "gorro" : "no"} />
);

// la tripulación del LYDIA, siempre la misma gente en el mismo lugar de la cubierta (x local del barco)
export const XMARINO = (i: number) => -300 + i * 95;
export const X_CAPITAN = -480, X_CHICO = -660;
export const Marino: React.FC<{ i: number; t: number; x?: number; y?: number; h?: number; expr?: Expr; habla?: boolean; camina?: number; bD?: number; cD?: number; bI?: number; cI?: number; flip?: boolean; mira?: number; miraY?: number; inclina?: number; salta?: number; manoD?: React.ReactNode }> = ({ i, x, y = -212, h = 200, flip, ...p }) => (
  <Persona {...p} x={x ?? XMARINO(i)} y={y} h={h} seed={60 + i} ropa={MARINO(i)} casco={i % 3 === 0 ? "gorro" : "no"} gorroCol={["#2b6ad0", "#d8343a", "#3d6e5a"][i % 3]} pantalon={["#3a3a4a", "#2a3a5a", "#5a4a3a"][i % 3]} flip={flip ?? i % 2 === 0} />
);
export const Capitan: React.FC<{ t: number; x?: number; y?: number; h?: number; expr?: Expr; habla?: boolean; camina?: number; bD?: number; cD?: number; bI?: number; cI?: number; flip?: boolean; mira?: number; manoD?: React.ReactNode }> = ({ x = X_CAPITAN, y = -212, h = 230, ...p }) => (
  <Persona {...p} x={x} y={y} h={h} seed={11} ropa={CAPITAN} casco="capitan" barba="#3a2616" pantalon="#141a30" />
);
// cubierta completa (dentro de EnBarco): sin = índices de marinos que no están (en el mástil, en los botes…)
export const Tripulacion: React.FC<{ t: number; sin?: number[]; expr?: (i: number) => Expr; capitan?: boolean }> = ({ t, sin = [], expr, capitan = true }) => (
  <>
    {Array.from({ length: 10 }, (_, i) => (sin.includes(i) ? null : <Marino key={i} i={i} t={t} expr={expr?.(i) ?? "neutro"} />))}
    {capitan && <Capitan t={t} />}
  </>
);
