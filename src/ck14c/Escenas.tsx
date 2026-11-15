// Escenas ck14c · 10 Church Supper Soups — seis escenas hechas con las fotos reales (ver D:/rtmp/ck14c/ideas.md)
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const S = (n: string) => staticFile(`ck14c/g/${n}.png`);
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const EASE = Easing.bezier(0.45, 0, 0.2, 1);
const BOX: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "hidden" };

// 1 · Ollas: cada mitad es una olla que se vuelca hacia la cámara y aterriza mostrando su fondo (e_pots → e_potsbot)
export const Pots: React.FC<{ dur: number; fBlack: number; fCooked: number }> = ({ dur, fBlack, fCooked }) => {
  const f = useCurrentFrame();
  const cam = interpolate(f, [0, dur], [1.0, 1.05], CL);
  const half = (start: number, left: boolean) => {
    const out = interpolate(f, [start - 8, start + 9], [0, 1], { ...CL, easing: Easing.in(Easing.quad) });
    const up = interpolate(f, [start + 6, start + 26], [0, 1], { ...CL, easing: Easing.out(Easing.back(1.15)) });
    const clip = left ? "inset(0px 960px 0px 0px)" : "inset(0px 0px 0px 960px)";
    const cx = left ? 480 : 1440;
    return (
      <>
        {up > 0 && (
          <div style={{ ...BOX, clipPath: clip }}>
            <div style={{ ...BOX, overflow: "visible", transformOrigin: `${cx}px 960px`, transform: `perspective(1900px) rotateX(${(1 - up) * 82}deg)` }}>
              <Img src={S("e_potsbot")} style={FULL} />
            </div>
          </div>
        )}
        {out < 1 && (
          <div style={{ ...BOX, clipPath: clip }}>
            <div style={{ ...BOX, overflow: "visible", transformOrigin: `${cx}px 815px`, transform: `perspective(1900px) rotateX(${-out * 84}deg)`, opacity: 1 - out * 0.35 }}>
              <Img src={S("e_pots")} style={FULL} />
            </div>
          </div>
        )}
      </>
    );
  };
  return (
    <AbsoluteFill style={{ backgroundColor: "#15120f", overflow: "hidden" }}>
      <div style={{ ...BOX, transform: `scale(${cam})`, transformOrigin: "960px 560px" }}>
        <Img src={S("e_potsbot")} style={{ ...FULL, filter: "blur(22px) brightness(0.45)" }} />
        {half(fBlack, true)}
        {half(fCooked, false)}
      </div>
    </AbsoluteFill>
  );
};

// 2 · Fideos: la franja lejana de la mesa (y 230–460) se estira en alto y empuja la pared; la mesa parece no terminar
export const Noodles: React.FC<{ dur: number; fAll: number; fSee: number }> = ({ dur, fAll, fSee }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [fAll - 10, fAll + 34, fSee - 2, fSee + 30], [0, 1, 1, 0.55], { ...CL, easing: EASE });
  const st = 1 + 0.62 * k; // alto de la franja
  const lift = 230 * (st - 1); // cuánto sube la pared
  const cam = interpolate(f, [0, dur], [1.0, 1.045], CL);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <div style={{ ...BOX, transform: `scale(${cam})`, transformOrigin: "960px 520px" }}>
        <div style={{ ...BOX, clipPath: "inset(0px 0px 850px 0px)", transform: `translateY(${-lift}px)` }}>
          <Img src={S("e_noodles")} style={FULL} />
        </div>
        <div style={{ ...BOX, clipPath: "inset(229px 0px 619px 0px)", transform: `scaleY(${st})`, transformOrigin: "960px 461px" }}>
          <Img src={S("e_noodles")} style={FULL} />
        </div>
        <div style={{ ...BOX, clipPath: "inset(460px 0px 0px 0px)" }}>
          <Img src={S("e_noodles")} style={FULL} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 3 · Cuchara: la corona real del rincón (elipse 955,528 rx475 ry418, 0,88–1,08) gira como un plato bajo la punta quieta
export const Spoon: React.FC<{ dur: number; fScrape: number; fCorners: number; fStarts: number }> = ({ dur, fScrape, fCorners, fStarts }) => {
  const f = useCurrentFrame();
  const scrape = interpolate(f, [fScrape - 3, fScrape + 10, fScrape + 24], [0, -38, 0], { ...CL, easing: EASE });
  const turn = interpolate(f, [fCorners - 4, fStarts + 4], [0, 360], { ...CL, easing: EASE });
  const a = scrape + turn;
  const RX = 475, RY = 418;
  const mask = `radial-gradient(ellipse ${RX * 1.08}px ${RY * 1.08}px at 955px 528px, transparent 79%, #000 82%, #000 97%, transparent 100%)`;
  const cam = interpolate(f, [0, dur], [1.0, 1.06], CL);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <div style={{ ...BOX, transform: `scale(${cam})`, transformOrigin: "760px 700px" }}>
        <Img src={S("e_spoon")} style={FULL} />
        <div style={{ ...BOX, WebkitMaskImage: mask, maskImage: mask }}>
          <div style={{ ...BOX, overflow: "visible", transformOrigin: "955px 528px", transform: `scaleY(${RY / RX}) rotate(${a}deg) scaleY(${RX / RY})` }}>
            <Img src={S("e_spoon_ring")} style={FULL} />
          </div>
        </div>
        <Img src={S("e_spoon_cut")} style={{ ...FULL, filter: "drop-shadow(0px 6px 10px rgba(0,0,0,0.35))" }} />
      </div>
    </AbsoluteFill>
  );
};

// 4 · Maíz: la foto sale de la oscuridad por planos, en el orden en que los nombra (portón, gente, galpón, piso)
export const Corn: React.FC<{ dur: number; fDrive: number; fBuckets: number; fShed: number; fHusk: number; fAched: number }> = ({ dur, fDrive, fBuckets, fShed, fHusk, fAched }) => {
  const f = useCurrentFrame();
  const o = (s: number) => interpolate(f, [s - 6, s + 14], [0, 1], { ...CL, easing: EASE });
  const plane = (m: string, op: number) => (
    <div style={{ ...BOX, WebkitMaskImage: m, maskImage: m, opacity: op }}>
      <Img src={S("e_corn")} style={FULL} />
    </div>
  );
  const cam = interpolate(f, [0, dur], [1.06, 1.0], { ...CL, easing: EASE });
  const all = o(fAched);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0907", overflow: "hidden" }}>
      <div style={{ ...BOX, transform: `scale(${cam})`, transformOrigin: "1210px 400px" }}>
        {/* la foto entera ya está, en penumbra, desde el cuadro 0: nunca hay negro */}
        <Img src={S("e_corn")} style={{ ...FULL, opacity: 0.3, filter: "brightness(0.55) saturate(0.6)" }} />
        {plane("radial-gradient(ellipse 230px 190px at 1210px 205px, #000 60%, transparent 100%)", o(fDrive))}
        {plane("linear-gradient(to bottom, transparent 270px, #000 340px, #000 720px, transparent 800px)", o(fBuckets))}
        {plane("linear-gradient(to bottom, #000 0px, #000 430px, transparent 560px)", o(fShed))}
        {plane("linear-gradient(to bottom, transparent 600px, #000 700px, #000 1080px)", o(fHusk))}
        <div style={{ ...BOX, opacity: all }}>
          <Img src={S("e_corn")} style={{ ...FULL, filter: `saturate(${1 + 0.08 * all})` }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 5 · Leche cortada: los grumos reales aparecen desde la estela de leche hacia afuera, en cinco anillos de distancia
export const Curdle: React.FC<{ dur: number; fBreaks: number; fSeparate: number }> = ({ dur, fBreaks, fSeparate }) => {
  const f = useCurrentFrame();
  const cam = interpolate(f, [0, fSeparate, dur], [1.0, 1.05, 1.1], CL);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <div style={{ ...BOX, transform: `scale(${cam})`, transformOrigin: "990px 560px" }}>
        <Img src={S("e_curdle_clean")} style={FULL} />
        {[1, 2, 3, 4, 5].map((i) => (
          <Img key={i} src={S(`e_fleck${i}`)} style={{ ...FULL, opacity: interpolate(f, [fBreaks - 6 + (i - 1) * 9, fBreaks + 6 + (i - 1) * 9], [0, 1], CL) }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// 6 · Tormenta: la luz del farol (1190,150) se vuelve niebla blanca dentro de los vidrios y se traga los autos por distancia
const PANES = ["inset(0px 1365px 612px 248px)", "inset(497px 1365px 128px 248px)", "inset(0px 622px 128px 642px)", "inset(0px 225px 612px 1380px)", "inset(497px 225px 128px 1380px)"];
export const Blizzard: React.FC<{ dur: number; fWind: number; fCars: number }> = ({ dur, fWind, fCars }) => {
  const f = useCurrentFrame();
  const R = interpolate(f, [0, fWind - 12, fCars + 6], [70, 260, 1250], { ...CL, easing: Easing.in(Easing.quad) });
  // niebla de borde muy suave (sin disco duro) y tope 0,88: los marcos y un fantasma de los autos siguen viéndose
  const fog = `radial-gradient(circle at 1190px 150px, rgba(238,234,226,0.88) 0px, rgba(238,234,226,0.8) ${R * 0.3}px, rgba(238,234,226,0.45) ${R * 0.65}px, rgba(238,234,226,0) ${R}px)`;
  const cam = interpolate(f, [0, dur], [1.0, 1.04], CL);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <div style={{ ...BOX, transform: `scale(${cam})`, transformOrigin: "960px 600px" }}>
        <Img src={S("e_lot")} style={FULL} />
        {PANES.map((c, i) => (
          <div key={i} style={{ ...BOX, clipPath: c, backgroundImage: fog }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const ESC_CK14C = { pots: Pots, noodles: Noodles, spoon: Spoon, corn: Corn, curdle: Curdle, blizzard: Blizzard } as Record<string, React.FC<any>>;
