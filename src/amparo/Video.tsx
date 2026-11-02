// Composición genérica del canal Amparo: hoja + escenas del EDL + Amparo en tarjeta (tercio izquierdo) o a pantalla completa.
// edl.json: { end, esc: Esc[], av: { [i]: "izq" | "full" } , shots: [{a,b,k:"av"}] (para el farm) }
// avwin.json: { win: [{ms, me, off, reel, pieces}] }  ← av_temprano.py
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { C, FPS, cl, eo, sp, lerp, Hoja, Tarjeta, Chip } from "./kit";
import { Esc, EscenaView } from "./Escena";

export type Win = { ms: number; me: number; off: number; reel: number; pieces: number[][] };
export type Cfg = { slug: string; still: string; reel: boolean; chip?: string; chipWin?: number };
const OV = 12; // cuadros de solape para la entrada de la escena siguiente

export const makeVideo = (EDL: { end: number; esc: Esc[]; av: Record<string, string> }, WIN: Win[], cfg: Cfg) => {
  const lay = (i: number) => EDL.av[String(i)] || "izq";
  // dk(t): cuánto está corrida la hoja a la derecha (Amparo en tarjeta) → resorte al entrar y al salir
  const izq = WIN.map((w, i) => ({ ...w, i })).filter((w) => lay(w.i) === "izq");
  const dkAt = (t: number) => {
    let m = 0;
    for (const w of izq) {
      if (t < w.ms - 0.4 || t > w.me + 0.6) continue;
      const a = sp((t - (w.ms - 0.35)) / 0.55), b = 1 - eo((t - w.me) / 0.45);
      m = Math.max(m, cl(Math.min(a, b)));
    }
    return m;
  };
  const Body: React.FC = () => {
    const f = useCurrentFrame(), t = f / FPS;
    const dk = dkAt(t);
    return (
      <AbsoluteFill style={{ backgroundColor: C.hoja }}>
        <Hoja />
        {EDL.esc.map((e, i) => {
          const from = Math.round(e.a * FPS), d = Math.max(1, Math.round((e.b - e.a) * FPS)) + OV;
          return <Sequence key={i} from={from} durationInFrames={d} layout="none"><EscenaView esc={e} idx={i} dk={dk} /></Sequence>;
        })}
        {WIN.map((w, i) => {
          const from = Math.round(w.ms * FPS), d = Math.max(1, Math.round((w.me - w.ms) * FPS));
          const src = cfg.reel ? `av/reel${w.reel}.mp4` : undefined;
          const sf = Math.round(w.off * FPS);
          if (lay(i) === "full") return (
            <Sequence key={`av${i}`} from={from} durationInFrames={d} layout="none">
              <FullAv src={src} still={cfg.still} sf={sf} chip={i === (cfg.chipWin ?? 0) ? cfg.chip : undefined} dur={w.me - w.ms} seed={i} />
            </Sequence>
          );
          return (
            <Sequence key={`av${i}`} from={Math.max(0, from - 12)} durationInFrames={d + 30} layout="none">
              <CardAv src={src} still={cfg.still} sf={sf} lead={from - Math.max(0, from - 12)} dur={d} />
            </Sequence>
          );
        })}
      </AbsoluteFill>
    );
  };
  return Body;
};

// Amparo a pantalla completa: corte seco, empuje lento y curvo
const FullAv: React.FC<{ src?: string; still: string; sf: number; chip?: string; dur: number; seed: number }> = ({ src, still, sf, chip, dur, seed }) => {
  const f = useCurrentFrame(), k = f / (dur * FPS);
  const z = 1.02 + 0.045 * (seed % 2 ? k : 1 - k) + 0.01 * Math.sin(k * Math.PI);
  return (
    <AbsoluteFill style={{ backgroundColor: C.hoja }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "46% 38%" }}>
        <Tarjeta x={0} y={0} w={1920} h={1080} r={0} src={src} still={still} startFrom={sf} objPos="50% 40%" shadow={false} />
      </AbsoluteFill>
      {chip ? <Chip txt={chip} f={f - 8} x={80} y={930} /> : null}
    </AbsoluteFill>
  );
};

// Amparo en tarjeta al tercio izquierdo: entra con resorte desde abajo-izquierda, sale hacia la izquierda
const CardAv: React.FC<{ src?: string; still: string; sf: number; lead: number; dur: number }> = ({ src, still, sf, lead, dur }) => {
  const f = useCurrentFrame(), g = f - lead;
  const uin = sp((f) / 16), uout = g > dur ? eo((g - dur) / 12) : 0;
  const x = lerp(-640, 64, uin) - uout * 720, rot = (1 - uin) * -6 + uout * -4;
  // el video del reel arranca recién en el cuadro "lead" (antes muestra el primer cuadro quieto: boca cerrada)
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: x, top: 150, width: 600, height: 780, transform: `rotate(${rot}deg)` }}>
        <Sequence from={lead} durationInFrames={dur} layout="none">
          <Tarjeta x={0} y={0} w={600} h={780} r={40} src={src} still={still} startFrom={sf} objPos="47% 30%" />
        </Sequence>
        {g < 0 || g >= dur ? <Tarjeta x={0} y={0} w={600} h={780} r={40} still={still} objPos="47% 30%" /> : null}
      </div>
    </AbsoluteFill>
  );
};
