// gb01 v2 · el video entero en UN plano: hub (monje en el centro + órbitas) → zambullida en un objeto → escena viva →
// la escena se achica hasta volverse una burbuja que orbita al monje en el hub siguiente → … (55 ventanas pagadas).
// Sin cortes: cada pase es un portal circular que crece o se achica. Sin subtítulos (pedido del creador 20-oct).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS, N, ease, lerp } from "../../kits/neon/base";
import { SfxTrack } from "../../kits/neon/Layout";
import { FIN, WINS, tiempo } from "./datos";
import { ANILLOS, Hub, HubSpec, Orb, posOrb, rampa } from "./Hub";
import { pistaGb } from "../sonidos";
import { SEGS_M01 } from "./m01";
import { SEGS_M02 } from "./m02";
import { SEGS_M03 } from "./m03";
import { SEGS_M04 } from "./m04";
import { SEGS_M05 } from "./m05";
import { SEGS_M06 } from "./m06";
import { SEGS_M07 } from "./m07";
import { SEGS_M08 } from "./m08";
import { SEGS_M09 } from "./m09";
import { SEGS_M10 } from "./m10";
import { SEGS_M11 } from "./m11";
import { SEGS_M12 } from "./m12";
import { SEGS_M13 } from "./m13";
import { SEGS_M14 } from "./m14";
import { EVENTOS_MIN1 } from "../Min1";

export type Seg = { hub: HubSpec; Escena: React.FC; sonidos?: (s: ReturnType<typeof pistaGb>) => void };
export const SEGS: Seg[] = [...SEGS_M01, ...SEGS_M02, ...SEGS_M03, ...SEGS_M04, ...SEGS_M05, ...SEGS_M06, ...SEGS_M07, ...SEGS_M08, ...SEGS_M09, ...SEGS_M10, ...SEGS_M11, ...SEGS_M12, ...SEGS_M13, ...SEGS_M14];

const DIAG = Math.hypot(960, 540) + 20;
const C: [number, number] = [960, 540];
const ECO = { anillo: 1 as const, ang: -12 }; // dónde queda orbitando la escena que se achica
const dive = (i: number) => ({ a: WINS[i].t1 - 0.42, b: WINS[i].t1 + 0.5 });
const emerge = (i: number) => ({ a: WINS[i].t0 - 0.8, b: WINS[i].t0 + 0.05 });

const portalOrb = (i: number): Orb | undefined => SEGS[i]?.hub.orbs.find((o) => o.id === SEGS[i].hub.portal);

// escena dentro de un círculo (cx, cy, R): un pedazo de la escena entera, achicada para que el centro caiga en el círculo
const Ventanita: React.FC<{ cx: number; cy: number; R: number; children: React.ReactNode; borde?: number }> = ({ cx, cy, R, children, borde = 0 }) => {
  if (R >= DIAG - 1 && Math.abs(cx - 960) < 1 && Math.abs(cy - 540) < 1) return <AbsoluteFill>{children}</AbsoluteFill>;
  const m = Math.min(1, R / 540); // el círculo queda inscripto en el cuadro de la escena (nunca se ven sus bordes)
  return (
    <>
      <AbsoluteFill style={{ clipPath: `circle(${R.toFixed(1)}px at ${cx.toFixed(1)}px ${cy.toFixed(1)}px)` }}>
        <AbsoluteFill style={{ transformOrigin: "50% 50%", transform: `translate(${cx - 960}px,${cy - 540}px) scale(${m})` }}>{children}</AbsoluteFill>
      </AbsoluteFill>
      {borde > 0.01 && (
        <div style={{ position: "absolute", left: cx - R, top: cy - R, width: R * 2, height: R * 2, borderRadius: "50%", border: `${2 + 2 * borde}px solid rgba(203,251,255,${0.8 * borde})`,
          boxShadow: `0 0 ${30 * borde}px rgba(39,227,255,${0.6 * borde}), inset 0 0 ${50 * borde}px rgba(39,227,255,${0.35 * borde})` }} />
      )}
    </>
  );
};

const capaHub = (i: number, t: number) => {
  const v = WINS[i], seg = SEGS[i];
  if (!seg) return null;
  const d = dive(i), e = emerge(i);
  const po = portalOrb(i);
  const congela = d.a;
  const P = po ? posOrb(po, t, congela) : { x: 960, y: 540, r: 100 };
  const ud = rampa(t, d.a, d.b);
  const brillo = rampa(t, v.t1 - 1.0, v.t1 - 0.5);
  // salida: zambullida hacia el portal
  const Z = 1 + 7 * Math.pow(ud, 2.2);
  const opD = 1 - rampa(t, d.a + 0.45, d.b);
  // entrada: la cámara se aleja desde la burbuja eco
  const ue = rampa(t, e.a, e.b + 0.3);
  const Q = posEco(i, t);
  const Ze = i === 0 ? 1 : lerp(1.7, 1, ue);
  const opE = i === 0 ? 1 : rampa(t, e.a + 0.1, e.b);
  const ox = ud > 0 ? P.x : Q.x, oy = ud > 0 ? P.y : Q.y;
  return (
    <AbsoluteFill key={"h" + i} style={{ opacity: opD * opE, transformOrigin: `${ox}px ${oy}px`, transform: `scale(${Z * Ze})`, filter: ud > 0.3 ? `blur(${(ud - 0.3) * 14}px)` : undefined }}>
      <Hub v={v} spec={seg.hub} t={t} i={i} congela={congela} brilloPortal={brillo * (1 - ud)} />
    </AbsoluteFill>
  );
};

// la burbuja eco: arranca a pantalla completa (la escena que termina) y se achica hasta su lugar en la órbita
const posEco = (i: number, t: number) => {
  const o: Orb = { id: "eco", t: WINS[i].t0 - 0.8, ang: ECO.ang, anillo: ECO.anillo, tam: 190, D: () => null };
  return posOrb(o, t);
};

export const Video: React.FC<{ farm?: boolean; desde?: number }> = ({ farm, desde = 0 }) => {
  const t = useCurrentFrame() / FPS + desde;
  const capas: React.ReactNode[] = [];
  const escenas: React.ReactNode[] = [];
  for (let i = 0; i < SEGS.length; i++) {
    const v = WINS[i];
    const next = WINS[i + 1];
    const d = dive(i);
    const enHub = t >= v.t0 - 0.85 && t <= d.b + 0.05;
    // escena i: desde la zambullida hasta que termina de achicarse en el hub siguiente (+ eco orbitando)
    const finEsc = next && SEGS[i + 1] ? next.t0 + 1.9 : FIN + 1;
    const enEsc = t >= d.a && t <= finEsc;
    if (enHub) capas.push(capaHub(i, t));
    if (enEsc) {
      const Esc = SEGS[i].Escena;
      const po = portalOrb(i);
      const P = po ? posOrb(po, t, d.a) : { x: 960, y: 540, r: 100 };
      let cx = 960, cy = 540, R = DIAG, borde = 0, op = 1;
      if (t < d.b) {
        const u = rampa(t, d.a, d.b);
        const u2 = ease(u);
        cx = lerp(P.x, 960, u2); cy = lerp(P.y, 540, u2);
        R = lerp(P.r * 0.78, DIAG, Math.pow(u, 1.6));
        borde = 1 - u;
      } else if (next && SEGS[i + 1] && t > next.t0 - 0.8) {
        const e = emerge(i + 1);
        const u = 1 - rampa(t, e.a, e.b);
        const Q = posEco(i + 1, t);
        const rEco = 120 * Q.esc * (1 - 0.6 * rampa(t, next.t0 + 0.9, next.t0 + 1.8));
        cx = lerp(Q.x, 960, ease(u)); cy = lerp(Q.y, 540, ease(u));
        R = lerp(rEco, DIAG, Math.pow(u, 1.6));
        borde = 1 - u;
        op = 1 - rampa(t, next.t0 + 1.3, next.t0 + 1.85);
      }
      escenas.push(<AbsoluteFill key={"e" + i} style={{ opacity: op }}><Ventanita cx={cx} cy={cy} R={R} borde={borde}><Esc /></Ventanita></AbsoluteFill>);
    }
  }
  return (
    <AbsoluteFill style={{ background: N.bg, overflow: "hidden" }}>
      {capas}
      {escenas}
      {!farm && <SfxTrack eventos={EVENTOS_V2} hablando={tiempo.speaking} />}
    </AbsoluteFill>
  );
};

// ───────── sonido: lo automático de cada hub + lo propio de cada escena ─────────
const s = pistaGb();
SEGS.forEach((seg, i) => {
  const v = WINS[i];
  if (i > 0) { s.add("vuelo", v.t0 - 0.8, 0.8); s.add("vidrio", v.t0 + 1.6, 0.5); }
  seg.hub.orbs.forEach((o) => { s.add("aparece", o.t - 0.05, 0.8); s.add("neonOn", o.t + 0.05, 0.4); });
  s.add("sinapsis", v.t1 - 1.0, 0.6);
  s.add("vueloLargo", v.t1 - 0.42);
  seg.sonidos?.(s);
});
s.eventos.push(...EVENTOS_MIN1);
export const EVENTOS_V2 = s.eventos.sort((a, b) => a[0] - b[0]);
export { ANILLOS };
