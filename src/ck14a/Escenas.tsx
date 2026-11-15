// Escenas sobre fotos reales · ck14a (ideas en D:/rtmp/ck14a/ideas.md). Sin componentes hechos ni dibujos: sólo la foto y su geometría.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.inOut(Easing.cubic);
const S = (n: string) => staticFile(`ck14a/g/${n}.png`);
const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };

// ---------- 1 · lupa sin aro que viaja: arena seca a la izquierda, esquina crocante y centro húmedo a la derecha
export const Pans: React.FC<{ dur: number; fSand: number; fGolden: number; fCorners: number; fUnder: number }> = ({ dur, fSand, fGolden, fCorners, fUnder }) => {
  const f = useCurrentFrame();
  const kf = [0, Math.max(10, fSand - 10), fSand + 6, fGolden - 4, fGolden + 18, fCorners - 6, fCorners + 8, fUnder - 6, fUnder + 14];
  const xs = [470, 470, 240, 240, 1400, 1400, 1735, 1735, 1380];
  const ys = [430, 430, 680, 680, 420, 420, 930, 930, 580];
  const mono = kf.map((v, i) => Math.max(v, i)).reduce<number[]>((a, v) => [...a, Math.max(v, (a[a.length - 1] ?? -1) + 1)], []);
  const cx = interpolate(f, mono, xs, { ...CL, easing: io });
  const cy = interpolate(f, mono, ys, { ...CL, easing: io });
  // zoom: plano general → 2,1x sobre cada zona nombrada → vuelve a 1,25x al final; el centro sigue a la palabra
  const z = interpolate(f, [0, Math.max(12, fSand - 10), fSand + 10, Math.max(fSand + 11, fUnder + 4), Math.max(fSand + 12, dur)], [1.0, 1.0, 2.0, 2.5, 1.3], { ...CL, easing: io });
  // traslación que mantiene (cx, cy) en el centro del cuadro sin dejar bordes vacíos
  const tx = Math.max(Math.min(960 - cx * z, 0), 1920 - 1920 * z), ty = Math.max(Math.min(540 - cy * z, 0), 1080 - 1080 * z);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#fff" }}>
      <div style={{ ...full, transform: `translate(${tx}px, ${ty}px) scale(${z})`, transformOrigin: "0px 0px" }}>
        <Img src={S("e_pans")} style={full} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2 · el puñado se comprime dentro del puño real y el hilo de caldo se descubre hacia el bol
const HANDFUL = "polygon(690px 435px, 780px 323px, 900px 285px, 960px 225px, 1050px 240px, 1155px 255px, 1245px 330px, 1320px 390px, 1350px 465px, 1410px 510px, 1425px 585px, 1395px 660px, 1320px 705px, 1275px 750px, 1200px 750px, 1110px 720px, 1020px 735px, 960px 810px, 885px 840px, 825px 780px, 795px 705px, 750px 600px, 720px 510px)";
export const Squeeze: React.FC<{ dur: number; fSqueeze: number; fFist: number }> = ({ dur, fSqueeze, fFist }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [fSqueeze - 2, fSqueeze + 12], [0, 1], { ...CL, easing: io }); // aparece el puño
  const hx = interpolate(f, [fSqueeze - 2, fSqueeze + 14], [0, 975 - 1050], { ...CL, easing: io });
  const hy = interpolate(f, [fSqueeze - 2, fSqueeze + 14], [0, 420 - 540], { ...CL, easing: io });
  const hk = interpolate(f, [fSqueeze - 2, fSqueeze + 14], [1, 0.6], { ...CL, easing: io });
  const ho = interpolate(f, [fSqueeze + 6, fSqueeze + 16], [1, 0], CL);
  const d0 = Math.min(fFist, fSqueeze + 16);
  const drip = interpolate(f, [d0, d0 + 18], [742, 990], { ...CL, easing: Easing.in(Easing.quad) });
  const cam = interpolate(f, [0, fSqueeze, dur], [1.0, 1.04, 1.22], { ...CL, easing: io });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <div style={{ ...full, transform: `scale(${cam})`, transformOrigin: "1000px 520px" }}>
        <Img src={S("e_fist0")} style={full} />
        <div style={{ ...full, opacity: a }}>
          <Img src={S("e_fist1")} style={full} />
          {/* tramo del hilo tapado con crumbs vecinos de la misma foto (90 px a la derecha) */}
          <div style={{ ...full, overflow: "hidden", clipPath: "inset(742px 875px 90px 965px)" }}>
            <Img src={S("e_fist1")} style={{ ...full, transform: "translateX(-90px)" }} />
          </div>
          {/* el hilo real se descubre de arriba abajo */}
          <div style={{ ...full, overflow: "hidden", clipPath: `inset(742px 875px ${1080 - drip}px 965px)` }}>
            <Img src={S("e_fist1")} style={full} />
          </div>
        </div>
        {ho > 0 && (
          <div style={{ ...full, opacity: ho, transform: `translate(${hx}px, ${hy}px) scale(${hk})`, transformOrigin: "1050px 540px" }}>
            <div style={{ ...full, clipPath: HANDFUL }}><Img src={S("e_fist0")} style={full} /></div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3 · la porción real se acerca a la cámara sobre su propio centro y tapa su lugar
const PIECE = "polygon(420px 405px, 520px 300px, 630px 203px, 750px 280px, 863px 353px, 870px 435px, 780px 540px, 668px 660px, 548px 585px, 428px 503px)";
export const Corner: React.FC<{ dur: number; fCut: number }> = ({ dur, fCut }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [fCut - 6, fCut + 20], [1, 1.6], { ...CL, easing: io });
  const rot = interpolate(f, [fCut - 6, fCut + 16], [0, -3], { ...CL, easing: io });
  const sh = interpolate(f, [fCut - 6, fCut + 16], [4, 34], { ...CL, easing: io });
  const cam = interpolate(f, [0, dur], [1.0, 1.18], { ...CL, easing: io });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <div style={{ ...full, transform: `scale(${cam})`, transformOrigin: "645px 430px" }}>
        <Img src={S("e_corner")} style={full} />
        <div style={{ ...full, filter: `drop-shadow(${sh * 0.4}px ${sh}px ${sh}px rgba(0,0,0,0.5))` }}>
          <div style={{ ...full, transform: `scale(${k}) rotate(${rot}deg)`, transformOrigin: "645px 430px" }}>
            <div style={{ ...full, clipPath: PIECE }}><Img src={S("e_corner")} style={full} /></div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4 · el fondo negro de la sartén hace de espejo: adentro, dado vuelta, la Hattie de 1971 con la misma sartén
export const Skillet: React.FC<{ dur: number; fHattie: number; fSkillet: number }> = ({ dur, fHattie, fSkillet }) => {
  const f = useCurrentFrame();
  const E = { x: 1020, y: 742, rx: 315, ry: 135 };
  const o = interpolate(f, [fHattie - 4, fHattie + 14, fSkillet + 10, fSkillet + 30], [0, 0.9, 0.9, 0], { ...CL, easing: io });
  const drift = interpolate(f, [0, dur], [0, 18], CL);
  const cam = interpolate(f, [0, dur], [1.0, 1.32], { ...CL, easing: io });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <div style={{ ...full, transform: `scale(${cam})`, transformOrigin: `${E.x}px ${E.y}px` }}>
        <Img src={S("e_skillet")} style={full} />
        {false && o > 0 && (
          <div style={{ ...full, overflow: "hidden", opacity: o, clipPath: `ellipse(${E.rx}px ${E.ry}px at ${E.x}px ${E.y}px)`, filter: "sepia(0.35) contrast(1.05)", WebkitMaskImage: `radial-gradient(ellipse ${E.rx}px ${E.ry}px at ${E.x}px ${E.y}px, #000 55%, transparent 100%)` }}>
            <Img src={S("g0530")} style={{ ...full, transform: `translate(${E.x - 1065}px, ${E.y - 520 + drift}px) scale(0.62, -0.62)`, transformOrigin: "1065px 520px" }} />
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

export const ESC_CK14A = { pans: Pans, squeeze: Squeeze, corner: Corner, skillet: Skillet } as Record<string, React.FC<any>>;
