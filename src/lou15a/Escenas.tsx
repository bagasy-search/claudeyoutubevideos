// Escenas lou15a · Never Buy Bouillon Cubes Again — cinco escenas hechas con las fotos del video, cada una con un truco distinto
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const S = (n: string) => staticFile(`lou15a/g/${n}.png`);
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "cover" };
const EASE = Easing.bezier(0.45, 0, 0.2, 1);
const chip = (o: number, x: number, t: string, bg: string): React.ReactNode => (
  <div style={{ position: "absolute", left: x, top: 70, opacity: o, transform: `translateY(${(1 - o) * -20}px)`, background: bg, color: "#fff", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 46, letterSpacing: 2, padding: "12px 26px", borderRadius: 6, boxShadow: "0 6px 20px rgba(0,0,0,.45)" }}>{t}</div>
);

// 1 · Hervor vs fuego lento: la costura vertical barre la olla turbia y deja la clara (en «simmer»)
export const Boil: React.FC<{ dur: number; fSim: number }> = ({ dur, fSim }) => {
  const f = useCurrentFrame();
  const x = interpolate(f, [fSim - 4, fSim + 26], [1920, 960], { ...CL, easing: EASE });
  const z = interpolate(f, [0, dur], [1.0, 1.08], CL);
  return (
    <AbsoluteFill style={{ background: "#111", overflow: "hidden" }}>
      <div style={{ ...FULL, transform: `scale(${z})` }}><Img src={S("e_boil_hard")} style={FULL} /></div>
      <div style={{ ...FULL, clipPath: `inset(0px 0px 0px ${x}px)` }}>
        <div style={{ ...FULL, transform: `scale(${z})` }}><Img src={S("e_boil_lazy")} style={FULL} /></div>
      </div>
      <div style={{ position: "absolute", left: x - 3, top: 0, width: 6, height: 1080, background: "rgba(255,255,255,.85)", opacity: x < 1915 ? 1 : 0 }} />
      {chip(interpolate(f, [6, 16], [0, 1], CL), 70, "HARD BOIL", "#9B2C1F")}
      {chip(interpolate(f, [fSim + 12, fSim + 22], [0, 1], CL), 1030, "LAZY SIMMER", "#2F6B3A")}
    </AbsoluteFill>
  );
};

// 2 · Reducir: la cámara se acerca despacio a la olla y un iris desde el centro deja ver la base oscura (en «quarter»)
export const Reduce: React.FC<{ dur: number; fQ: number }> = ({ dur, fQ }) => {
  const f = useCurrentFrame();
  const rot = interpolate(f, [0, dur], [1.0, 1.12], CL);
  const r = interpolate(f, [fQ - 6, fQ + 40], [0, 1150], { ...CL, easing: EASE });
  const pot = (n: string) => <div style={{ ...FULL, transform: `scale(${rot})`, transformOrigin: "960px 640px" }}><Img src={S(n)} style={FULL} /></div>;
  return (
    <AbsoluteFill style={{ background: "#141210", overflow: "hidden" }}>
      {pot("e_red_full")}
      <div style={{ ...FULL, clipPath: `circle(${r}px at 960px 540px)` }}>{pot("e_red_low")}</div>
      {chip(interpolate(f, [fQ + 30, fQ + 42], [0, 1], CL), 70, "4 QUARTS → 1 QUART", "#7A4A1E")}
    </AbsoluteFill>
  );
};

// 3 · Tapa de grasa: el disco blanco se levanta hacia la cámara (bisagra arriba) y aparece el caldo gelatinoso (en «lift»)
export const FatCap: React.FC<{ dur: number; fLift: number }> = ({ dur, fLift }) => {
  const f = useCurrentFrame();
  const up = interpolate(f, [fLift - 2, fLift + 30], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const z = interpolate(f, [0, dur], [1.02, 1.1], CL);
  return (
    <AbsoluteFill style={{ background: "#0f0d0b", overflow: "hidden" }}>
      <div style={{ ...FULL, transform: `scale(${z})` }}><Img src={S("e_fat_off")} style={FULL} /></div>
      {up < 0.98 && (
        <div style={{ ...FULL, transformOrigin: "960px 0px", transform: `perspective(1600px) rotateX(${up * 80}deg) translateY(${-up * 140}px) scale(${z})`, opacity: 1 - up * 0.5, boxShadow: `0 ${40 * up}px ${80 * up}px rgba(0,0,0,.6)` }}>
          <Img src={S("e_fat_on")} style={FULL} />
        </div>
      )}
    </AbsoluteFill>
  );
};

// 4 · La prueba del quiebre: la rodaja que dobla, corte a la que se parte y las dos mitades del cuadro se separan (en «snaps»)
export const Snap: React.FC<{ dur: number; fSnap: number }> = ({ dur, fSnap }) => {
  const f = useCurrentFrame();
  const after = f >= fSnap;
  const z = after ? interpolate(f, [fSnap, fSnap + 6, dur], [1.16, 1.06, 1.12], CL) : interpolate(f, [0, fSnap], [1.0, 1.08], CL);
  const gap = after ? interpolate(f, [fSnap, fSnap + 8, fSnap + 40], [0, 26, 10], CL) : 0;
  const half = (left: boolean) => (
    <div style={{ ...FULL, clipPath: left ? "inset(0px 960px 0px 0px)" : "inset(0px 0px 0px 960px)", transform: `translateX(${left ? -gap : gap}px) rotate(${left ? -gap / 30 : gap / 30}deg)` }}>
      <div style={{ ...FULL, transform: `scale(${z})` }}><Img src={S("e_snap_crack")} style={FULL} /></div>
    </div>
  );
  return (
    <AbsoluteFill style={{ background: "#0d0b09", overflow: "hidden" }}>
      {!after && <div style={{ ...FULL, transform: `scale(${z})` }}><Img src={S("e_snap_bend")} style={FULL} /></div>}
      {after && half(true)}
      {after && half(false)}
      {chip(interpolate(f, [8, 18], [0, 1], CL) * (after ? 0 : 1), 70, "BENDS = NOT DONE", "#9B2C1F")}
      {chip(after ? interpolate(f, [fSnap + 6, fSnap + 16], [0, 1], CL) : 0, 70, "SNAPS = DONE", "#2F6B3A")}
    </AbsoluteFill>
  );
};

// 5 · Gus's gold en frascos: una tira de tres fotos (mezclar, apretar, heladera) que la cámara recorre sin cortar
export const Jar: React.FC<{ dur: number; fPack: number; fFridge: number }> = ({ dur, fPack, fFridge }) => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, fPack - 10, fPack + 14, fFridge - 10, fFridge + 14, dur], [0, -120, -2040, -2160, -4080, -4200], { ...CL, easing: EASE });
  const tilt = interpolate(f, [0, dur], [-1.5, 1.5], CL);
  return (
    <AbsoluteFill style={{ background: "#1a1714", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, height: 1080, width: 1920 * 3 + 240, transform: `translateX(${x}px) rotate(${tilt * 0.2}deg)` }}>
        {["e_jar_mix", "e_jar_pack", "e_jar_fridge"].map((n, i) => (
          <div key={n} style={{ position: "absolute", left: i * 2040 + 60, top: 40, width: 1800, height: 1000, borderRadius: 10, overflow: "hidden", boxShadow: "0 18px 50px rgba(0,0,0,.6)" }}>
            <Img src={S(n)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const ESC_LOU15A: Record<string, React.FC<any>> = { boil: Boil, reduce: Reduce, fatcap: FatCap, snap: Snap, jar: Jar };
