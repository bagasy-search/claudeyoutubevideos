// MovJets.tsx — MOVIMIENTO 3 · "LOS ASPERSORES TAPADOS" · 919 frames (30,6 s)
// Canal Mike Dalton (EN) · video `mdtoilet`.
//
// LA IDEA: la descarga floja no es un problema de plomería, es un problema de riego. Los
// agujeros del borde se cerraron con MINERAL, y ni la lejía ni el peróxido disuelven piedra.
// Vinagre y un alambre. El objeto protagonista es UN AGUJERO: lo vemos de lejos, entramos, lo
// vemos cerrarse, lo vemos resistir dos químicos, y lo vemos abrirse.
//
// MATERIA QUE CRUZA LAS FRONTERAS: **el anillo del agujero** — el óvalo oscuro del acto 1 es el
// mismo óvalo que se estrangula en el 2, el mismo sobre el que rebotan las gotas en el 3 y el
// mismo que se vuelve a abrir en el 4.
//
// ACTO 1 · f0–210   · "LA DESCARGA FLOJA"   cam {z -180 → -30, panY +40}
//   ── FRONTERA A @198 · ZOOM-THROUGH por el agujero central ──
// ACTO 2 · f210–450 · "ADENTRO DEL AGUJERO"  cam {z -30 → +260}
//   ── FRONTERA B @436 · OCLUSIÓN por una lámina de sarro ──
// ACTO 3 · f450–700 · "LA PIEDRA NO SE MATA" cam {z +260 → +180, ry -6}
//   ── FRONTERA C @686 · WIPE POR MATERIA: el vinagre entra desde abajo ──
// ACTO 4 · f700–919 · "SE VUELVE A ABRIR"    cam {z +180 → +60, hold vivo}
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { MD, rgba, clamp01, lerp, rnd, light, Atmos, Occluder, Sheen, glassStyle, F_SANS } from "../mdmold/Stage";
import { Blocks, PT } from "./Porcelain";

const J1 = 0, J2 = 210, J3 = 450, J4 = 700, END = 919;

const CAMERA = (f: number) => {
  const z =
    f < J2 ? lerp(-180, -30, clamp01(f / J2)) :
    f < J3 ? lerp(-30, 260, Math.pow(clamp01((f - J2) / (J3 - J2)), 1.7)) :
    f < J4 ? lerp(260, 180, clamp01((f - J3) / (J4 - J3))) :
             lerp(180, 60, clamp01((f - J4) / (END - J4)));
  const panY = f < J2 ? lerp(40, 6, clamp01(f / J2)) : lerp(6, -30, clamp01((f - J2) / (END - J2)));
  const ry = f < J3 ? 0 : lerp(0, -6, clamp01((f - J3) / 300));
  const bx = Math.sin(f / 49) * 2.2;
  const by = Math.cos(f / 63) * 1.7;
  return `perspective(1300px) translateZ(${z.toFixed(2)}px) translate3d(${bx.toFixed(2)}px, ${(panY + by).toFixed(2)}px, 0) rotateY(${ry.toFixed(3)}deg) rotateX(${lerp(6, -2, clamp01(f / 800)).toFixed(3)}deg)`;
};

// el agujero: un óvalo con labio de porcelana y una apertura que se puede estrangular
const Jet: React.FC<{ f: number; open: number; size: number; glow?: number }> = ({ f, open, size, glow = 0 }) => {
  const o = clamp01(open);
  const breathe = 1 + Math.sin(f / 40) * 0.012;
  return (
    <div style={{ position: "relative", width: size, height: size * 0.56, transform: `scale(${breathe.toFixed(4)})` }}>
      {/* labio de porcelana */}
      <div
        style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: `radial-gradient(circle at 42% 30%, ${rgba(PT.china, 0.5)} 0%, ${rgba(PT.chinaDim, 0.28)} 52%, rgba(0,0,0,0) 74%)`,
          boxShadow: `inset 0 4px 12px ${rgba(MD.white, 0.2)}, 0 18px 44px rgba(0,0,0,0.6)`,
        }}
      />
      {/* sarro: un anillo tiza que crece hacia adentro */}
      <div
        style={{
          position: "absolute", inset: `${(1 - o) * 6}%`, borderRadius: "50%",
          border: `${Math.max(2, (1 - o) * size * 0.19)}px solid ${rgba(PT.scale, 0.82)}`,
          boxShadow: `inset 0 0 ${18}px ${rgba("#8C846F", 0.6)}`,
        }}
      />
      {/* la boca */}
      <div
        style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-50%,-50%)",
          width: `${18 + o * 58}%`, height: `${18 + o * 58}%`,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${rgba("#07080A", 0.96)} 40%, ${rgba(PT.chinaDark, 0.7)} 100%)`,
          boxShadow: glow > 0 ? `0 0 ${50 * glow}px ${16 * glow}px ${rgba(PT.water, 0.5 * glow)}` : undefined,
        }}
      />
      {glow > 0 && (
        <div
          style={{
            position: "absolute", left: "50%", top: "60%",
            transform: "translateX(-50%)",
            width: 8, height: size * 0.9 * glow,
            background: `linear-gradient(180deg, ${rgba(PT.water, 0.8 * glow)} 0%, rgba(0,0,0,0) 100%)`,
            filter: "blur(1.4px)",
          }}
        />
      )}
    </div>
  );
};

const Act1: React.FC<{ f: number }> = ({ f }) => {
  const p = clamp01(f / J2);
  return (
    <>
      {/* la pestaña del borde vista de frente, con nueve agujeros: la mayoría casi cerrados */}
      <div style={{ position: "absolute", left: "6%", right: "6%", top: "30%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {Array.from({ length: 9 }, (_, i) => {
          const closed = [0.7, 0.25, 0.18, 0.34, 0.12, 0.3, 0.2, 0.62, 0.4][i];
          return <Jet key={i} f={f + i * 13} open={closed} size={130} glow={clamp01(p * 1.4 - i * 0.05) * closed} />;
        })}
      </div>
      {/* el agua que DEBERÍA girar y en cambio chorrea */}
      <svg style={{ position: "absolute", left: "6%", right: "6%", top: "44%", width: "88%", height: "40%" }} viewBox="0 0 1000 300" preserveAspectRatio="none">
        {Array.from({ length: 9 }, (_, i) => {
          const x = 52 + i * 112;
          const wob = Math.sin(f / 12 + i) * 5;
          return (
            <path
              key={i}
              d={`M${x},0 C${x + wob},110 ${x - wob},190 ${x + wob * 0.4},290`}
              stroke={rgba(PT.water, 0.34)}
              strokeWidth={5}
              fill="none"
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: "8%", bottom: "10%", width: "56%" }}>
        <Blocks
          at={18}
          stepEvery={40}
          items={[
            { t: "IT DRIBBLES DOWN THE SIDES", size: 50 },
            { t: "instead of swirling", em: true, size: 74, gap: 6 },
          ]}
        />
      </div>
    </>
  );
};

const Act2: React.FC<{ f: number }> = ({ f }) => {
  const p = clamp01((f - J2) / (J3 - J2));
  const open = interpolate(p, [0.1, 0.86], [0.72, 0.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.3, 0, 0.3, 1) });
  const pct = Math.round(open * 100);
  return (
    <>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Jet f={f} open={open} size={620} glow={0.1} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: "6%", top: "16%", width: "34%" }}>
        <Blocks
          at={J2 + 20}
          stepEvery={36}
          items={[
            { t: "MINERAL.", size: 62 },
            { t: "IT CLOSES THE HOLE", size: 40, gap: 10 },
            { t: "one winter at a time", em: true, size: 56, gap: 8 },
          ]}
        />
      </div>
      {/* contador de apertura: objetivo, no decorativo */}
      <div style={{ position: "absolute", right: "7%", top: "24%", ...glassStyle({ radius: 16 }), padding: "18px 24px", opacity: clamp01((f - J2 - 60) / 20) }}>
        <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 20, letterSpacing: 2.6, color: MD.red }}>OPENING LEFT</div>
        <div style={{ fontFamily: F_SANS, fontWeight: 900, fontSize: 112, color: MD.white, lineHeight: 1 }}>
          {pct}
          <span style={{ fontSize: 46 }}>%</span>
        </div>
      </div>
    </>
  );
};

const Act3: React.FC<{ f: number }> = ({ f }) => {
  const p = clamp01((f - J3) / (J4 - J3));
  // dos gotas caen sobre el sarro y NO PASA NADA. El anti-clímax es el punto.
  const dropA = clamp01((p - 0.06) / 0.26);
  const dropB = clamp01((p - 0.40) / 0.26);
  const Bead = ({ k, x, label, color }: { k: number; x: string; label: string; color: string }) => (
    <>
      <div
        style={{
          position: "absolute", left: x, top: `${lerp(6, 52, k)}%`,
          transform: `translateX(-50%) scaleY(${1 - Math.max(0, (k - 0.8) * 3) * 0.5}) scaleX(${1 + Math.max(0, (k - 0.8) * 3) * 0.8})`,
          width: 60, height: 74, borderRadius: "50% 50% 50% 50% / 62% 62% 38% 38%",
          background: `radial-gradient(circle at 40% 30%, ${rgba(MD.white, 0.85)} 0%, ${rgba(color, 0.55)} 62%, rgba(255,255,255,0) 78%)`,
          opacity: k > 0 ? 1 : 0,
        }}
      />
      {k > 0.86 && (
        <div style={{ position: "absolute", left: x, top: "58%", transform: "translateX(-50%)", fontFamily: F_SANS, fontWeight: 800, fontSize: 30, color: rgba(MD.white, 0.8), letterSpacing: 1.6 }}>
          {label}
        </div>
      )}
    </>
  );
  return (
    <>
      {/* la piedra: una repisa tiza, mate, sin brillo — no reacciona */}
      <div
        style={{
          position: "absolute", left: "10%", right: "10%", top: "56%", height: 150,
          borderRadius: "18px 26px 14px 22px / 20px 16px 18px 14px",
          background: `linear-gradient(180deg, ${rgba(PT.scale, 0.9)} 0%, ${rgba("#9A927E", 0.86)} 58%, ${rgba("#4A4638", 0.9)} 100%)`,
          boxShadow: "inset 0 3px 0 rgba(255,255,255,0.3), 0 26px 60px rgba(0,0,0,0.6)",
        }}
      />
      <Bead k={dropA} x="34%" label="BLEACH" color="#CFE6F2" />
      <Bead k={dropB} x="64%" label="PEROXIDE" color={PT.water} />
      <div style={{ position: "absolute", left: "8%", top: "12%", width: "58%" }}>
        <Blocks
          at={J3 + 16}
          stepEvery={44}
          items={[
            { t: "NEITHER ONE TOUCHES LIMESCALE.", size: 48 },
            { t: "that isn't what they do", em: true, size: 66, gap: 8 },
          ]}
        />
      </div>
      {/* dos cruces rojas, tarde, chicas: el remate visual */}
      {[dropA, dropB].map((k, i) =>
        k > 0.95 ? (
          <div
            key={i}
            style={{
              position: "absolute", left: i === 0 ? "34%" : "64%", top: "50%",
              transform: "translateX(-50%)", fontFamily: F_SANS, fontWeight: 900, fontSize: 84, color: MD.red,
              opacity: clamp01((k - 0.95) * 20), textShadow: `0 0 30px ${rgba(MD.red, 0.6)}`,
            }}
          >
            ✕
          </div>
        ) : null,
      )}
    </>
  );
};

const Act4: React.FC<{ f: number }> = ({ f }) => {
  const p = clamp01((f - J4) / (END - J4));
  const open = interpolate(p, [0.16, 0.74], [0.12, 0.86], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.25, 0.9, 0.3, 1) });
  return (
    <>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Jet f={f} open={open} size={520} glow={clamp01((p - 0.4) * 2)} />
      </AbsoluteFill>
      {/* el alambre entrando: una línea que atraviesa y saca grit */}
      {p < 0.6 && (
        <div
          style={{
            position: "absolute", left: "50%", top: `${lerp(-14, 44, clamp01(p / 0.4))}%`,
            transform: "translateX(-50%) rotate(4deg)", width: 7, height: 340,
            background: `linear-gradient(180deg, ${rgba("#B9BEC6", 0.9)} 0%, ${rgba("#7A808A", 0.9)} 100%)`,
            boxShadow: "0 0 18px rgba(255,255,255,0.25)",
            borderRadius: 4,
          }}
        />
      )}
      {/* el grit que cae DESPUÉS de que el alambre pasó */}
      {p > 0.34 &&
        Array.from({ length: 16 }, (_, i) => {
          const s = rnd(i * 3.1);
          const k = clamp01(((p - 0.34) * 2.4 + s) % 1);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${46 + s * 9}%`,
                top: `${52 + k * 34}%`,
                width: 3 + s * 5, height: 3 + s * 4, borderRadius: 2,
                background: rgba(PT.scale, (1 - k) * 0.85),
              }}
            />
          );
        })}
      <div style={{ position: "absolute", left: "7%", bottom: "14%", width: "44%" }}>
        <Blocks
          at={J4 + 24}
          stepEvery={40}
          items={[
            { t: "VINEGAR AND A PIECE OF WIRE.", size: 44 },
            { t: "you unclogged the sprinklers", em: true, size: 60, gap: 8 },
          ]}
        />
      </div>
    </>
  );
};

export const MovJets: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const f = Math.min(frame, END - 1);
  const t = clamp01(f / END);
  const tint = f < J4 ? light(clamp01(f / J4) * 0.85, "cold", "red") : light(clamp01((f - J4) / (END - J4)), "red", "cold");
  const out = clamp01((frame - (durationInFrames - 12)) / 12);
  return (
    <AbsoluteFill style={{ backgroundColor: MD.ink0, overflow: "hidden" }}>
      <Atmos tint={tint} keyFrom={lerp(0.26, 0.58, t)} intensity={lerp(1.0, 0.9, t)} />
      <AbsoluteFill style={{ transform: CAMERA(f), transformStyle: "preserve-3d" }}>
        {f < J2 + 8 && <Act1 f={f} />}
        {f >= J2 && f < J3 + 8 && <Act2 f={f} />}
        {f >= J3 && f < J4 + 8 && <Act3 f={f} />}
        {f >= J4 && <Act4 f={f} />}
      </AbsoluteFill>
      <Occluder at={J2 - 12} dur={14} color={PT.chinaDark} angle={-5} />
      <Occluder at={J3 - 14} dur={16} color={PT.scale} angle={7} />
      <Occluder at={J4 - 14} dur={16} color={PT.waterDim} angle={-8} />
      <Sheen at={J4 + 120} dur={28} />
      {out > 0 && <AbsoluteFill style={{ background: rgba(MD.ink0, out * 0.45) }} />}
    </AbsoluteFill>
  );
};
