// Escenas sobre fotos · alb14c (ideas.md en D:/rtmp/alb14c). Escritas de cero; foto real a pantalla completa
// (1920x1080, objectFit 'fill', coordenadas de la rejilla), recortes con clip-path y máscaras, sin dibujos.
//
// 1 EscMonedaCanto (p470 → p2000) · la moneda real deja la mano, gira hasta quedar de canto y se apoya sobre el
//   tramo finito de la grieta real (568,245) sin entrar. Pared entra por una máscara que nace en la moneda.
// 2 EscCharcoSeco (p1050 → p1060) · la luz del sol real (940,790) llena el cuadro y deja un charco mojado sobre el
//   barro; el charco se retira desde los bordes hacia 900,500 y deja las grietas reales.
// 3 EscLosaRespira (p1400) · la losa real recortada se agranda (tibia) y se achica (fría) entre los pretiles quietos;
//   al achicarse se ve la rendija oscura en su borde.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing, spring, useVideoConfig } from "remotion";

const EZ = Easing.bezier(0.45, 0, 0.25, 1);
type Cam = { f: number; x: number; y: number; s: number };
// cámara: escala logarítmica + centro, siempre sin bordes vacíos
const camAt = (f: number, ks: Cam[]) => {
  let i = 0;
  while (i < ks.length - 2 && f > ks[i + 1].f) i++;
  const a = ks[i], b = ks[i + 1];
  const t = EZ(Math.min(1, Math.max(0, (f - a.f) / Math.max(1, b.f - a.f))));
  const s = Math.exp(Math.log(a.s) + (Math.log(b.s) - Math.log(a.s)) * t);
  const x = Math.min(1920 - 960 / s, Math.max(960 / s, a.x + (b.x - a.x) * t));
  const y = Math.min(1080 - 540 / s, Math.max(540 / s, a.y + (b.y - a.y) * t));
  return { s, x, y };
};
const mundo = (c: { s: number; x: number; y: number }): React.CSSProperties => ({
  position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0",
  transform: `translate(${960 - c.x * c.s}px, ${540 - c.y * c.s}px) scale(${c.s})`,
});
const Foto: React.FC<{ src: string; style?: React.CSSProperties }> = ({ src, style }) => (
  <Img src={staticFile(src)} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill", ...style }} />
);
const poly = (pts: number[][]) => `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(",")})`;
const lerp = (f: number, a: number[], b: number[], ease = EZ) =>
  interpolate(f, a, b, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

// ───────────── 1 · la moneda de canto ─────────────
export const EscMonedaCanto: React.FC<{ a: string; b: string; dur: number }> = ({ a, b, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const R = 97, C0 = [972, 615], C1 = [568, 180], C2 = [568, 245];
  // giro hasta quedar de canto ("canto" 70)
  const giro = spring({ frame: f - 70, fps, config: { damping: 16, mass: 1.2, stiffness: 70 } });
  const ang = 72 * giro;
  // viaje a la grieta ("fuerces" 115) y apoyo ("apóyala" 145) con peso
  const via = spring({ frame: f - 112, fps, config: { damping: 18, mass: 1.6, stiffness: 55 } });
  const apo = spring({ frame: f - 143, fps, config: { damping: 9, mass: 1, stiffness: 140 } });
  let cx = C0[0] + (C1[0] - C0[0]) * via, cy = C0[1] + (C1[1] - C0[1]) * via;
  cy += (C2[1] - C1[1]) * apo;
  // "no entra": dos empujones que no pasan (189 y 205)
  const emp = (t0: number) => { const t = f - t0; return t < 0 || t > 12 ? 0 : Math.sin((t / 12) * Math.PI); };
  const empuje = emp(189) + emp(205);
  const esc = 1 - 0.018 * empuje; // la moneda se aprieta contra la pared y vuelve
  // pared entra desde la moneda ("grieta" 86)
  const rPared = lerp(f, [84, 122], [0, 2300]);
  const manoOp = lerp(f, [100, 124], [1, 0]);
  // cámara
  const c = camAt(f, [
    { f: 0, x: 972, y: 615, s: 1.0 }, { f: 62, x: 972, y: 615, s: 1.06 },
    { f: 112, x: 760, y: 420, s: 1.3 }, { f: 255, x: 700, y: 380, s: 1.35 },
    { f: 300, x: 590, y: 260, s: 1.9 }, { f: 330, x: 590, y: 260, s: 1.9 },
    { f: 372, x: 960, y: 540, s: 1.0 }, { f: dur, x: 960, y: 540, s: 1.03 },
  ]);
  const sombra = 10 + 8 * (1 - apo) - 5 * empuje; // sombra corta = apoyada
  const txt = lerp(f, [346, 362], [0, 1]);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={mundo(c)}>
        <Foto src={a} style={{ opacity: manoOp }} />
        {rPared > 0 && (
          <Foto src={b} style={{
            WebkitMaskImage: `radial-gradient(circle ${rPared}px at ${C0[0]}px ${C0[1]}px, #000 82%, transparent 100%)`,
            maskImage: `radial-gradient(circle ${rPared}px at ${C0[0]}px ${C0[1]}px, #000 82%, transparent 100%)`,
          }} />
        )}
        <div style={{
          position: "absolute", left: cx - R, top: cy - R, width: 2 * R, height: 2 * R,
          transform: `perspective(1400px) rotateY(${ang}deg) scale(${esc})`,
          filter: `drop-shadow(${sombra}px ${sombra * 0.6}px ${6 + sombra * 0.4}px rgba(0,0,0,${0.25 + 0.3 * via}))`,
        }}>
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: "50%", filter: `brightness(${1 - 0.1 * giro})` }}>
            <Img src={staticFile(a)} style={{ position: "absolute", left: -(C0[0] - R), top: -(C0[1] - R), width: 1920, height: 1080, objectFit: "fill" }} />
          </div>
        </div>
      </div>
      {txt > 0 && (
        <div style={{ position: "absolute", left: 1130, top: 430, opacity: txt, transform: `translateY(${(1 - txt) * 18}px)`, fontFamily: "Inter, Arial, sans-serif", color: "#2b2724" }}>
          <div style={{ fontSize: 132, fontWeight: 900, letterSpacing: 4 }}>FISURA</div>
          <div style={{ fontSize: 54, fontWeight: 600, marginTop: 6, opacity: lerp(f, [362, 378], [0, 1]) }}>menos de 1,5 mm</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ───────────── 2 · el charco que se seca ─────────────
export const EscCharcoSeco: React.FC<{ a: string; b: string; dur: number }> = ({ a, b, dur }) => {
  const f = useCurrentFrame();
  const SOL = [940, 790], CH = [900, 500];
  const cSol = camAt(f, [{ f: 0, x: 960, y: 600, s: 1.0 }, { f: 178, x: 940, y: 700, s: 1.09 }, { f: dur, x: 940, y: 700, s: 1.09 }]);
  const cBar = camAt(f, [{ f: 0, x: 900, y: 500, s: 1.12 }, { f: 386, x: 900, y: 500, s: 1.07 }, { f: dur, x: 920, y: 520, s: 1.02 }]);
  // velo blanco que nace del sol ("calor" 154, "golpe" 178)
  const sx = 960 + (SOL[0] - cSol.x) * cSol.s, sy = 540 + (SOL[1] - cSol.y) * cSol.s;
  const rVelo = lerp(f, [150, 180], [0, 2400], Easing.in(Easing.quad));
  const veloOp = f < 192 ? 1 : lerp(f, [192, 218], [1, 0]);
  const solOp = f < 180 ? 1 : 0;
  // charco: radio que se achica ("encoge" 205, "raja" 277, "sol" 386)
  const r = f < 205 ? 1500 : f < 277 ? lerp(f, [205, 277], [1500, 430], Easing.inOut(Easing.quad))
    : f < 340 ? lerp(f, [277, 340], [430, 130], Easing.linear) : lerp(f, [340, 386], [130, 0], Easing.in(Easing.quad));
  const borde = (rr: number) => {
    const pts: number[][] = [];
    for (let i = 0; i < 28; i++) {
      const th = (i / 28) * Math.PI * 2;
      const k = 1 + 0.16 * Math.sin(3 * th + 1.1) + 0.09 * Math.sin(5 * th + 2.3 + f * 0.004) + 0.05 * Math.sin(9 * th + 0.4);
      pts.push([CH[0] + Math.cos(th) * rr * 1.3 * k, CH[1] + Math.sin(th) * rr * k]);
    }
    return poly(pts);
  };
  const mojado: React.CSSProperties = { filter: "brightness(0.5) contrast(0.7) saturate(1.4) blur(5px)" };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={mundo(cBar)}>
        <Foto src={b} />
        {r > 0 && <div style={{ position: "absolute", inset: 0, clipPath: borde(r + 26) }}><Foto src={b} style={{ ...mojado, opacity: 0.5 }} /></div>}
        {r > 0 && <div style={{ position: "absolute", inset: 0, clipPath: borde(r) }}><Foto src={b} style={mojado} /></div>}
      </div>
      {solOp > 0 && <div style={mundo(cSol)}><Foto src={a} /></div>}
      {rVelo > 0 && veloOp > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: veloOp,
          background: `radial-gradient(circle ${rVelo}px at ${sx}px ${sy}px, rgba(255,250,232,1) 55%, rgba(255,246,220,0) 100%)` }} />
      )}
    </AbsoluteFill>
  );
};

// ───────────── 3 · la losa que respira ─────────────
const LOSA = [[620, 95], [1350, 135], [1920, 650], [1920, 1080], [0, 1080], [0, 600], [235, 625]];
const PRETIL_IZQ = [[585, 55], [640, 85], [262, 655], [212, 630]];
const PRETIL_DER = [[1340, 105], [1395, 120], [1920, 610], [1920, 690]];
export const EscLosaRespira: React.FC<{ src: string; dur: number }> = ({ src, dur }) => {
  const f = useCurrentFrame();
  // escala de la losa: "estira" 82 → "calienta" 134; "encoge" 152 → "enfría" 200; "Poquito" 206 vuelve; respira
  let k = f < 82 ? 1 : f < 140 ? lerp(f, [82, 134], [1, 1.025]) : f < 206 ? lerp(f, [146, 200], [1.025, 0.975]) : lerp(f, [206, 232], [0.975, 1]);
  if (f >= 236) k = 1 + 0.006 * Math.sin(((f - 236) / 26) * Math.PI * 2);
  const tibio = f < 82 ? 0 : f < 152 ? lerp(f, [82, 120], [0, 0.32]) : lerp(f, [152, 175], [0.32, 0]);
  const frio = f < 152 ? 0 : f < 206 ? lerp(f, [152, 185], [0, 0.32]) : lerp(f, [206, 236], [0.32, 0]);
  const c = camAt(f, [{ f: 0, x: 960, y: 560, s: 1.05 }, { f: dur, x: 960, y: 600, s: 1.1 }]);
  const O = [960, 600];
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={mundo(c)}>
        <Foto src={src} />
        {/* el hueco de la losa queda en sombra: se ve sólo cuando la losa se achica */}
        <div style={{ position: "absolute", inset: 0, clipPath: poly(LOSA), background: "rgba(8,6,5,0.78)" }} />
        <div style={{ position: "absolute", inset: 0, transformOrigin: `${O[0]}px ${O[1]}px`, transform: `scale(${k})` }}>
          <div style={{ position: "absolute", inset: 0, clipPath: poly(LOSA), filter: "drop-shadow(0 0 6px rgba(0,0,0,0.6))" }}>
            <Foto src={src} />
            <div style={{ position: "absolute", inset: 0, background: "#ff7a2e", mixBlendMode: "soft-light", opacity: tibio }} />
            <div style={{ position: "absolute", inset: 0, background: "#3d8fff", mixBlendMode: "soft-light", opacity: frio }} />
          </div>
        </div>
        {/* los pretiles no se mueven: la losa pasa por debajo */}
        <div style={{ position: "absolute", inset: 0, clipPath: poly(PRETIL_IZQ) }}><Foto src={src} /></div>
        <div style={{ position: "absolute", inset: 0, clipPath: poly(PRETIL_DER) }}><Foto src={src} /></div>
      </div>
    </AbsoluteFill>
  );
};
