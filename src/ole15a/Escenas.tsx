// Escenas ole15a · Why Your Ground Beef Boils in Cast Iron — seis escenas hechas con las fotos del video, cada una con su truco
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const S = (n: string) => staticFile(`ole15a/g/${n}.png`);
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "cover" };
const EASE = Easing.bezier(0.45, 0, 0.2, 1);
const tag = (o: number, x: number, y: number, t: string, bg: string): React.ReactNode => (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `scale(${0.85 + 0.15 * o})`, transformOrigin: "left center", background: bg, color: "#fff", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 50, letterSpacing: 2, padding: "12px 28px", borderRadius: 6, boxShadow: "0 6px 20px rgba(0,0,0,.5)" }}>{t}</div>
);

// 1 · 212 contra 300: la costra sube desde el fondo del cuadro como si el agua se fuera (en «browning») y vuelve a hundirse (en «stuck»)
export const Steam: React.FC<{ dur: number; fBrown: number; fStuck: number }> = ({ dur, fBrown, fStuck }) => {
  const f = useCurrentFrame();
  const lvl = interpolate(f, [fBrown - 4, fBrown + 30, fStuck - 4, fStuck + 22], [1080, 0, 0, 1080], { ...CL, easing: EASE });
  const z = interpolate(f, [0, dur], [1.0, 1.07], CL);
  const on = lvl < 1000;
  return (
    <AbsoluteFill style={{ background: "#0e0c0a", overflow: "hidden" }}>
      <div style={{ ...FULL, transform: `scale(${z})` }}><Img src={S("e_steam_gray")} style={FULL} /></div>
      <div style={{ ...FULL, clipPath: `inset(${lvl}px 0px 0px 0px)` }}>
        <div style={{ ...FULL, transform: `scale(${z})` }}><Img src={S("e_steam_crust")} style={FULL} /></div>
      </div>
      <div style={{ position: "absolute", left: 0, top: lvl - 2, width: 1920, height: 4, background: "rgba(255,240,220,.7)", opacity: on && lvl > 4 ? 1 : 0 }} />
      {tag(interpolate(f, [8, 18], [0, 1], CL) * (lvl > 540 ? 1 : 0), 70, 70, "212 °F · BOILING", "#55606B")}
      {tag(interpolate(lvl, [600, 200], [0, 1], CL), 70, 70, "300 °F · BROWNING", "#8E3B12")}
    </AbsoluteFill>
  );
};

// 2 · La gota: cuadro partido en dos, la gota que solo burbujea a la izquierda; en «dancing» la derecha se enciende y la izquierda se apaga
export const Drops: React.FC<{ dur: number; fFizz: number; fDance: number }> = ({ dur, fFizz, fDance }) => {
  const f = useCurrentFrame();
  const split = interpolate(f, [fFizz - 4, fFizz + 16], [1920, 960], { ...CL, easing: EASE });
  const win = interpolate(f, [fDance - 2, fDance + 22], [0, 1], { ...CL, easing: EASE });
  const leftW = interpolate(win, [0, 1], [split, 0]);
  const z = interpolate(f, [0, dur], [1.02, 1.1], CL);
  return (
    <AbsoluteFill style={{ background: "#0c0b0a", overflow: "hidden" }}>
      <div style={{ ...FULL, transform: `scale(${z})` }}><Img src={S("e_drop_dance")} style={FULL} /></div>
      <div style={{ ...FULL, clipPath: `inset(0px ${1920 - leftW}px 0px 0px)`, filter: `brightness(${1 - win * 0.4})` }}>
        <div style={{ ...FULL, transform: `scale(${z})` }}><Img src={S("e_drop_fizz")} style={FULL} /></div>
      </div>
      <div style={{ position: "absolute", left: leftW - 3, top: 0, width: 6, height: 1080, background: "#f3e9dc", opacity: leftW > 4 && leftW < 1916 ? 1 : 0 }} />
      {tag(interpolate(f, [fFizz + 6, fFizz + 16], [0, 1], CL) * (1 - win), 70, 70, "FIZZ = NOT READY", "#55606B")}
      {tag(interpolate(f, [fDance + 10, fDance + 20], [0, 1], CL), 1030, 70, "DANCING = READY", "#2F6B3A")}
    </AbsoluteFill>
  );
};

// 3 · La placa en cuatro: la foto se corta en cuadrantes que se dan vuelta como cartas, uno tras otro, mostrando la costra (en «cut»)
export const Patty: React.FC<{ dur: number; fCut: number }> = ({ dur, fCut }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, dur], [1.0, 1.06], CL);
  const Q = [[0, 0], [960, 0], [960, 540], [0, 540]];
  return (
    <AbsoluteFill style={{ background: "#0d0b09", overflow: "hidden", perspective: 2200 }}>
      {Q.map(([x, y], i) => {
        const p = interpolate(f, [fCut + i * 9, fCut + i * 9 + 18], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
        const ang = p * 180;
        const front = ang < 90;
        const clip = `inset(${y}px ${1920 - x - 960}px ${1080 - y - 540}px ${x}px)`;
        return (
          <div key={i} style={{ ...FULL, clipPath: clip }}>
            <div style={{ ...FULL, transformOrigin: `${x + 480}px ${y + 270}px`, transform: `rotateY(${front ? ang : ang - 180}deg) scale(${z})` }}>
              <Img src={S(front ? "e_patty_whole" : "e_patty_cut")} style={FULL} />
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 957, top: 0, width: 6, height: 1080, background: "#0d0b09", opacity: interpolate(f, [fCut - 6, fCut], [0, 1], CL) }} />
      <div style={{ position: "absolute", left: 0, top: 537, width: 1920, height: 6, background: "#0d0b09", opacity: interpolate(f, [fCut - 6, fCut], [0, 1], CL) }} />
      {tag(interpolate(f, [10, 20], [0, 1], CL) * interpolate(f, [fCut - 10, fCut], [1, 0], CL), 70, 70, "4 MINUTES · HANDS OFF", "#8E3B12")}
    </AbsoluteFill>
  );
};

// 4 · La tapa: el vidrio se empaña desde abajo hacia arriba mientras habla del vapor; el empañado se cuenta en gotas que caen (en «steam» y «water»)
export const Lid: React.FC<{ dur: number; fSteam: number; fWater: number }> = ({ dur, fSteam, fWater }) => {
  const f = useCurrentFrame();
  const fog = interpolate(f, [fSteam - 6, fWater + 20], [0, 1], { ...CL, easing: EASE });
  const z = interpolate(f, [0, dur], [1.0, 1.1], CL);
  const top = 1080 - fog * 1080;
  const drops = [180, 420, 700, 1010, 1290, 1560, 1780];
  return (
    <AbsoluteFill style={{ background: "#0e0d0c", overflow: "hidden" }}>
      <div style={{ ...FULL, transform: `scale(${z})`, transformOrigin: "960px 600px" }}><Img src={S("e_lid_steam")} style={FULL} /></div>
      <div style={{ ...FULL, background: `linear-gradient(to top, rgba(230,232,234,.62) 0px, rgba(230,232,234,.5) ${Math.max(0, 1080 - top - 140)}px, rgba(230,232,234,0) ${1080 - top + 80}px)` }} />
      {drops.map((x, i) => {
        const t0 = fWater + i * 5;
        const y = interpolate(f, [t0, t0 + 40], [80 + (i % 3) * 60, 1000], { ...CL, easing: Easing.in(Easing.quad) });
        const o = interpolate(f, [t0 - 2, t0 + 4, t0 + 34, t0 + 40], [0, 0.9, 0.9, 0], CL);
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 14, height: 34, borderRadius: "50% 50% 50% 50% / 30% 30% 70% 70%", background: "rgba(255,255,255,.75)", boxShadow: "0 0 6px rgba(255,255,255,.6)", opacity: o }} />;
      })}
      {tag(interpolate(f, [fWater + 20, fWater + 30], [0, 1], CL), 70, 70, "A LID = A STEAMER", "#55606B")}
    </AbsoluteFill>
  );
};

// 5 · Las tres bandejas: un foco recorre la mesa y se para en cada carne cuando la nombra (80/20, 85/15, 93/7)
export const Pkg: React.FC<{ dur: number; f1: number; f2: number; f3: number }> = ({ dur, f1, f2, f3 }) => {
  const f = useCurrentFrame();
  const cx = interpolate(f, [f1 - 8, f1 + 6, f2 - 4, f2 + 8, f3 - 4, f3 + 8, f3 + 60], [960, 330, 330, 960, 960, 1590, 960], { ...CL, easing: EASE });
  const r = interpolate(f, [f1 - 8, f1 + 6, f3 + 40, f3 + 60], [1400, 360, 360, 1400], { ...CL, easing: EASE });
  const z = interpolate(f, [0, dur], [1.0, 1.05], CL);
  const lab = (t: string, x: number, fr: number) => (
    <div style={{ position: "absolute", left: x - 140, top: 880, width: 280, textAlign: "center", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 64, color: "#fff", textShadow: "0 3px 14px rgba(0,0,0,.9)", opacity: interpolate(f, [fr, fr + 10], [0, 1], CL) }}>{t}</div>
  );
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ ...FULL, transform: `scale(${z})` }}><Img src={S("e_pkg")} style={FULL} /></div>
      <div style={{ ...FULL, background: `radial-gradient(circle ${r}px at ${cx}px 520px, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 70%, rgba(0,0,0,.72) 100%)` }} />
      {lab("80/20", 330, f1)}
      {lab("85/15", 960, f2)}
      {lab("93/7", 1590, f3)}
    </AbsoluteFill>
  );
};

// 6 · Desglasar: el líquido inunda la sartén desde el punto donde cae (en «pour») y la espátula barre el fondo limpio en diagonal (en «scrape»)
export const Glaze: React.FC<{ dur: number; fPour: number; fScrape: number }> = ({ dur, fPour, fScrape }) => {
  const f = useCurrentFrame();
  const R = interpolate(f, [fPour - 4, fPour + 34], [0, 1500], { ...CL, easing: Easing.out(Easing.cubic) });
  const sw = interpolate(f, [fScrape - 2, fScrape + 40], [-30, 130], { ...CL, easing: EASE });
  const z = interpolate(f, [0, dur], [1.0, 1.06], CL);
  const pour = `radial-gradient(circle ${R}px at 1250px 380px, #000 92%, transparent 100%)`;
  const sweep = `linear-gradient(115deg, #000 ${sw - 12}%, transparent ${sw}%)`;
  return (
    <AbsoluteFill style={{ background: "#0b0a09", overflow: "hidden" }}>
      <div style={{ ...FULL, transform: `scale(${z})` }}>
        <Img src={S("e_glaze_bits")} style={FULL} />
        <div style={{ ...FULL, WebkitMaskImage: pour, maskImage: pour }}><Img src={S("e_glaze_pour")} style={FULL} /></div>
        <div style={{ ...FULL, WebkitMaskImage: sweep, maskImage: sweep }}><Img src={S("e_glaze_clean")} style={FULL} /></div>
      </div>
    </AbsoluteFill>
  );
};

export const ESC_OLE15A: Record<string, React.FC<any>> = { steam: Steam, drops: Drops, patty: Patty, lid: Lid, pkg: Pkg, glaze: Glaze };
