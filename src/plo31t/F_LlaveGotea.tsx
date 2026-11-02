import React from "react";
import { Img, staticFile } from "remotion";
import { Stage } from "./base";
import { FONT, e, ei, spr, extrude } from "./lib";
import { Mesa, Bx, orbit } from "./mesa3d";

const rnd = (i: number) => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); };

type Recibo = { item: string; val: string; rojo?: boolean };

const PERIOD = 0.9;
const CAIDA = 0.55;
const PICO_Y = 0.66;
const PICO_Z = 0.06;
const PISO_Y = 0.06;
const GOTA0 = 0.35;
const CHARCO_MAX = 0.08;

const Gota: React.FC<{ col: string; x?: number; y: number; z?: number; r?: number; sx?: number; sy?: number; op?: number }> =
  ({ col, x = 0, y, z = PICO_Z, r = 0.026, sx = 1, sy = 1, op = 0.92 }) => (
    <mesh position={[x, y, z]} scale={[r * sx, r * sy, r * sx]}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshPhysicalMaterial color={col} transparent opacity={op} roughness={0.03} metalness={0.05}
        transmission={0.92} thickness={0.6} ior={1.33} clearcoat={1} clearcoatRoughness={0.04} />
    </mesh>
  );

export const LlaveGotea: React.FC<{
  t: number; at: number; out: number; clave: number;
  bgImg?: string; gotaCol?: string; litros?: number; recibos?: Recibo[];
}> = ({ t, at, out, clave, bgImg = "plo31t/img/plo31t_t0_08.jpg", gotaCol = "#d9f3ff", litros = 18000,
  recibos = [{ item: "MES NORMAL", val: "$180" }, { item: "MES CON FUGA", val: "$540" }, { item: "DIFERENCIA", val: "$360", rojo: true }] }) => {

  const b = out + 0.55;
  const aleja = e(t, out, out + 0.55);
  const acerca = ei(t, at, at + 1.8);

  const cam = orbit(t, at, {
    p: [-0.62 + acerca * 0.32, 1.02 - acerca * 0.24, 0.92 + aleja * 1.35],
    l: [0.0, 0.42 - acerca * 0.06, 0.06],
    fov: 30 + acerca * 4 - aleja * 8,
  }, 1.9);
  const giro = e(t, out, out + 0.55) * 15 * Math.PI / 180;

  const gotas: { k: number; t0: number }[] = [];
  for (let k = 0; k < 16; k++) {
    const t0 = at + GOTA0 + k * PERIOD;
    if (t0 > b + 0.6) break;
    gotas.push({ k, t0 });
  }
  const impactos = gotas.filter(g => t >= g.t0 + CAIDA).length;
  const charco = Math.min(CHARCO_MAX, impactos * 0.011);

  const cFin = out - 0.15;
  const prog = ei(t, at + 0.1, cFin);
  const litrosNow = Math.round(prog * litros);
  const cIn = ei(t, at + 0.2, at + 0.85);
  const lastImpacto = impactos > 0 ? gotas[impactos - 1].t0 + CAIDA : -9;
  const dtImp = t - lastImpacto;
  const bump = impactos > 0 ? Math.max(0, 1 - dtImp * 6) : 0;
  const cScale = 1 + bump * 0.10;
  const flash = Math.max(0, 1 - dtImp * 5);
  const keyBump = Math.max(0, 1 - Math.abs(t - clave) * 3);
  const keyFlash = Math.max(0, 1 - Math.abs(t - clave) * 2.2);

  const recIn = clave + 1.5;
  const recOut = out + 0.1;
  const slide = e(t, recOut, recOut + 0.55);
  const recBlur = slide * 14;
  const recX = slide * 1100;
  const recOpacity = 1 - slide * 0.95;

  const push = 1.02 + 0.04 * e(t, at, b);
  const par = 1 + 0.02 * e(t, at, b);
  const marcaAgua = Math.min(1, prog);
  const flashLuz = Math.max(flash, keyFlash * 0.9);

  const ondas = gotas.map(({ k, t0 }) => {
    const dt = t - (t0 + CAIDA);
    if (dt < 0 || dt > 1.1) return null;
    const p = dt / 1.1;
    const r = 0.02 + p * 0.22;
    const op = 0.55 * (1 - p) * (1 - p);
    return (
      <mesh key={`on${k}`} position={[0, PISO_Y - 0.003, PICO_Z]} rotation={[-Math.PI / 2, 0, 0]} scale={[r, r, 1]}>
        <ringGeometry args={[0.9, 1, 44]} />
        <meshStandardMaterial color={gotaCol} transparent opacity={op} roughness={0.1} metalness={0.5} />
      </mesh>
    );
  });

  const dtKey = t - clave;
  const upGota = dtKey > 0 && dtKey < 1.2 ? (() => {
    const p = dtKey / 1.2;
    const y = PISO_Y + Math.sin(p * Math.PI) * 0.42;
    const r = 0.05 * (1 - p * 0.4);
    return <Gota col={gotaCol} y={y} r={r} op={0.9 * (1 - p * 0.7)} />;
  })() : null;

  return (
    <Stage t={t} a={at} b={b} tint="#ffc890">
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
        <Img src={staticFile(bgImg)} style={{
          position: "absolute", inset: "-6%", width: "112%", height: "112%",
          objectFit: "cover", transform: `scale(${par}) translate(${(1 - par) * -40}px, ${(1 - par) * -30}px)`,
          filter: "brightness(.62) saturate(.85) blur(2px)",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 42% 30%, rgba(255,200,144,.20), rgba(0,0,0,.62) 74%)" }} />
        <div style={{ position: "absolute", left: "50%", top: "62%", width: 900, height: 900, marginLeft: -450, marginTop: -450,
          borderRadius: "50%", pointerEvents: "none",
          background: `radial-gradient(circle, rgba(143,214,255,${0.35 * flashLuz}), rgba(143,214,255,0) 62%)`,
          filter: "blur(30px)" }} />
      </div>

      <div style={{ position: "absolute", left: 96, top: 110, bottom: 110, width: 10, zIndex: 2, borderRadius: 6,
        background: "rgba(255,255,255,.10)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.14)" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${marcaAgua * 100}%`,
          borderRadius: 6, background: "linear-gradient(180deg,#d9f3ff,#8fd6ff)", boxShadow: "0 0 22px rgba(143,214,255,.7)" }} />
      </div>

      <div style={{ position: "absolute", inset: 0, zIndex: 1, transform: `scale(${push})` }}>
        <Mesa cam={cam} floor="azulejo" warm={0.95}>
          <group position={[0, 0, 0]}>
            <Bx p={[0, 0.02, 0]} s={[0.76, 0.04, 0.56]} c="#cfd3d6" ro={0.6} m={0.1} r={0.01} />
            <Bx p={[0, 0.05, -0.25]} s={[0.76, 0.14, 0.03]} c="#b9bec2" ro={0.6} m={0.15} r={0.008} />
            <Bx p={[-0.35, 0.05, 0]} s={[0.03, 0.14, 0.56]} c="#b9bec2" ro={0.6} m={0.15} r={0.008} />
            <Bx p={[0.35, 0.05, 0]} s={[0.03, 0.14, 0.56]} c="#b9bec2" ro={0.6} m={0.15} r={0.008} />
          </group>

          <mesh position={[0, PISO_Y + 0.001, -0.08]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.18, 0.14, 1]}>
            <circleGeometry args={[1, 32]} />
            <meshBasicMaterial color="#000" transparent opacity={0.25} />
          </mesh>

          <group position={[0, 0.34, 0]} rotation={[0, giro, 0]}>
            <Bx p={[0, 0.02, -0.22]} s={[0.14, 0.07, 0.14]} c="#c9ced2" ro={0.15} m={0.95} r={0.006} />
            <Bx p={[0, 0.18, -0.22]} s={[0.06, 0.34, 0.06]} c="#e6eaed" ro={0.15} m={0.95} r={0.006} />
            <Bx p={[0, 0.34, -0.22]} s={[0.06, 0.06, 0.06]} c="#e6eaed" ro={0.15} m={0.95} r={0.006} />
            <Bx p={[0, 0.34, -0.10]} s={[0.06, 0.06, 0.18]} c="#e6eaed" ro={0.15} m={0.95} r={0.006} />
            <Bx p={[0, 0.31, 0.02]} s={[0.06, 0.06, 0.06]} c="#e6eaed" ro={0.15} m={0.95} r={0.006} />
            <Bx p={[0, 0.28, 0.05]} s={[0.05, 0.08, 0.05]} c="#e6eaed" ro={0.15} m={0.95} r={0.006} />
            <Bx p={[0, 0.24, 0.05]} s={[0.04, 0.02, 0.04]} c="#b9bec2" ro={0.2} m={0.9} r={0.004} />
            <Bx p={[0.10, 0.18, -0.22]} s={[0.18, 0.03, 0.03]} c="#c9ced2" ro={0.15} m={0.95} r={0.004} />
            <Bx p={[0.19, 0.18, -0.22]} s={[0.03, 0.055, 0.03]} c="#b9bec2" ro={0.2} m={0.9} r={0.004} />
          </group>

          {flashLuz > 0.02 && (
            <pointLight position={[0, PISO_Y + 0.06, PICO_Z]} color="#8fd6ff" intensity={flashLuz * 3.2} distance={1.2} decay={2} />
          )}

          {charco > 0.001 && (
            <>
              <mesh position={[0, PISO_Y - 0.008, 0.06]} rotation={[-Math.PI / 2, 0, 0]} scale={[charco * 4.6, charco * 3.6, 1]}>
                <circleGeometry args={[1, 40]} />
                <meshPhysicalMaterial color={gotaCol} transparent opacity={0.55} roughness={0.04} metalness={0.2} transmission={0.5} />
              </mesh>
              <mesh position={[0, PISO_Y - 0.007, 0.06]} rotation={[-Math.PI / 2, 0, 0]} scale={[charco * 4.65, charco * 3.65, 1]}>
                <ringGeometry args={[0.92, 1, 40]} />
                <meshStandardMaterial color="#ffffff" transparent opacity={0.5} roughness={0.1} metalness={0.6} />
              </mesh>
            </>
          )}

          {ondas}

          {gotas.map(({ k, t0 }) => {
            const dt = t - t0;
            if (dt < 0) return null;
            const cae = dt < CAIDA;
            const y = cae ? PICO_Y - (dt / CAIDA) * (PICO_Y - PISO_Y) : PISO_Y;
            const squash = cae ? 1 : Math.max(0.3, 1 - (dt - CAIDA) * 6);
            const fade = cae ? 1 : Math.max(0, 1 - (dt - CAIDA) * 3);
            if (fade <= 0) return null;
            const estela = cae ? [1, 2, 3].map(i => {
              const dti = dt - i * 0.03;
              if (dti < 0) return null;
              const yi = PICO_Y - (dti / CAIDA) * (PICO_Y - PISO_Y);
              return <Gota key={`e${i}`} col={gotaCol} y={yi} r={0.024 * (1 - i * 0.25)} op={0.35 * (1 - i * 0.3)} />;
            }) : null;
            return (
              <group key={k}>
                {estela}
                <Gota col={gotaCol} y={y} sy={squash} sx={cae ? 1 : 1.4} op={0.92 * fade} />
                {!cae && dt - CAIDA < 0.4 && [0, 1, 2].map(i => {
                  const p = (dt - CAIDA) / 0.4;
                  const ang = (i / 3) * Math.PI * 2 + rnd(k * 3 + i) * 1.2;
                  const rr = p * (0.11 + rnd(k + i) * 0.07);
                  const yy = PISO_Y + Math.sin(p * Math.PI) * (0.09 + rnd(i + k) * 0.07);
                  return (
                    <Gota key={i} col={gotaCol}
                      x={Math.cos(ang) * rr} y={yy} z={PICO_Z + Math.sin(ang) * rr}
                      r={0.012 + rnd(k * 5 + i) * 0.011 * (1 - p * 0.6)} op={0.85 * (1 - p)} />
                  );
                })}
              </group>
            );
          })}

          {upGota}
        </Mesa>
      </div>

      {t > at + 0.2 && (
        <div style={{
          position: "absolute", left: 150, top: 96, zIndex: 10, pointerEvents: "none",
          transform: `translateY(${(1 - cIn) * 30}px) scale(${cScale * (1 + keyBump * 0.06)})`, opacity: cIn, transformOrigin: "left top",
        }}>
          <div style={{
            fontFamily: FONT, fontWeight: 900, fontSize: 168, lineHeight: 0.9,
            color: "#fff", letterSpacing: "-0.02em",
            textShadow: extrude(7, "rgba(0,0,0,.6)") + `, 0 0 ${46 + flash * 40 + keyFlash * 60}px rgba(143,214,255,${0.4 + flash * 0.5 + keyFlash * 0.5})`,
          }}>{litrosNow.toLocaleString("es-AR")}</div>
          <div style={{
            fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: "0.18em",
            color: "#ffd9a8", marginTop: 12, textShadow: "0 2px 8px rgba(0,0,0,.7)",
            opacity: ei(t, at + 0.5, at + 1.0),
          }}>LITROS · GOTA A GOTA, POR MES</div>
        </div>
      )}

      {t > recIn && (
        <div style={{
          position: "absolute", right: 120, top: 180, width: 440, zIndex: 10, pointerEvents: "none",
          transform: `translateX(${recX}px) rotate(${(-6 + 8 * spr(t, recIn))}deg)`,
          opacity: recOpacity, filter: `blur(${recBlur}px)`,
        }}>
          <div style={{ position: "absolute", left: "50%", top: -18, width: 130, height: 34, marginLeft: -65,
            background: "rgba(255,240,200,.55)", transform: "rotate(-4deg)", boxShadow: "0 2px 6px rgba(0,0,0,.25)",
            borderLeft: "1px dashed rgba(0,0,0,.15)", borderRight: "1px dashed rgba(0,0,0,.15)" }} />
          <div style={{
            background: "#f4ecd8", padding: "38px 34px", borderRadius: 3,
            boxShadow: "0 20px 44px rgba(0,0,0,.5), 0 2px 0 rgba(0,0,0,.12), inset 0 0 44px rgba(180,150,100,.18)",
            fontFamily: FONT, color: "#2a1f14",
            clipPath: "polygon(0 0, 100% 0, 100% 97%, 96% 100%, 92% 97%, 88% 100%, 84% 97%, 80% 100%, 76% 97%, 72% 100%, 68% 97%, 64% 100%, 60% 97%, 56% 100%, 52% 97%, 48% 100%, 44% 97%, 40% 100%, 36% 97%, 32% 100%, 28% 97%, 24% 100%, 20% 97%, 16% 100%, 12% 97%, 8% 100%, 4% 97%, 0 100%)",
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "0.22em", color: "#8a7a5c", marginBottom: 22 }}>FACTURA · AGUA</div>
            {recibos.map((r, i) => {
              const rAt = recIn + 0.35 + i * 0.4;
              const p = spr(t, rAt);
              const pulse = r.rojo ? 0.82 + 0.18 * Math.sin((t - rAt) * 8) : 1;
              return (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "baseline",
                  marginTop: 16, opacity: Math.min(1, p), transform: `translateY(${(1 - p) * 14}px)`,
                }}>
                  <span style={{ fontSize: 26, fontWeight: 700 }}>{r.item}</span>
                  <span style={{
                    fontSize: r.rojo ? 44 : 32, fontWeight: 900,
                    color: r.rojo ? `rgba(215,38,30,${pulse})` : "#2a1f14",
                    textShadow: r.rojo ? "0 0 18px rgba(215,38,30,.55)" : "none",
                  }}>{r.val}</span>
                </div>
              );
            })}
            <div style={{ marginTop: 24, height: 2, background: "rgba(42,31,20,.25)" }} />
          </div>
        </div>
      )}
    </Stage>
  );
};

export const sfxLlaveGotea = (at: number): [number, string, number?][] => {
  const o: [number, string, number?][] = [[at + 0.0, "whoosh", -2]];
  o.push([at + 0.25, "pop", -4]);
  for (let k = 0; k < 8; k++) {
    const t0 = at + GOTA0 + k * PERIOD;
    o.push([t0, "k_gota", -4]);
    o.push([t0 + CAIDA, "tick", -3]);
  }
  o.push([at + 4.3, "paper", -2]);
  o.push([at + 4.65, "click", -4]);
  o.push([at + 5.05, "click", -4]);
  o.push([at + 5.45, "coin", -2]);
  return o;
};
