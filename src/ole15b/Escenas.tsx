// Escenas ole15b · The Beef Stew That Fed 40 Loggers — cinco escenas hechas con las fotos del video, cada una con un truco que no se usó en ole15a, lou15a ni lou15b
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const S = (n: string) => staticFile(`ole15b/g/${n}.png`);
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "cover" };
const EASE = Easing.bezier(0.45, 0, 0.2, 1);
const tag = (o: number, y: number, t: string, bg: string): React.ReactNode => (
  <div style={{ position: "absolute", right: 70, top: y, opacity: o, transform: `translateY(${(1 - o) * -20}px)`, background: bg, color: "#fff", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 44, letterSpacing: 2, padding: "12px 26px", borderRadius: 6, boxShadow: "0 6px 20px rgba(0,0,0,.45)" }}>{t}</div>
);

// 1 · La lupa: un círculo de aumento recorre la bandeja de «stew meat» mostrando los pedazos dispares; en «chuck» la lupa se abre hasta llenar el cuadro con los cubos parejos
export const Loupe: React.FC<{ dur: number; fChuck: number }> = ({ dur, fChuck }) => {
  const f = useCurrentFrame();
  const t = Math.min(1, f / Math.max(1, fChuck - 4));
  const cx = 740 + 380 * t, cy = 610 + Math.sin(t * Math.PI * 1.6) * 90;   // solo sobre la bandeja de carne (no el trapo)
  const open = interpolate(f, [fChuck - 2, fChuck + 22], [0, 1], { ...CL, easing: EASE });
  const R = 230 + open * 1900;
  const z = interpolate(f, [0, dur], [1.0, 1.06], CL);
  const after = f >= fChuck - 2;
  const lensX = after ? 960 : cx, lensY = after ? 540 : cy;
  const lensSrc = after ? "e_loupe_chuck" : "e_loupe_pkg";
  const k = 1.8 - open * 0.8; // aumento dentro de la lupa
  return (
    <AbsoluteFill style={{ background: "#0f0c09", overflow: "hidden" }}>
      <div style={{ ...FULL, transform: `scale(${z})`, filter: `brightness(${0.72 + open * 0.28})` }}><Img src={S(after && open > 0.98 ? "e_loupe_chuck" : "e_loupe_pkg")} style={FULL} /></div>
      <div style={{ ...FULL, clipPath: `circle(${R}px at ${lensX}px ${lensY}px)` }}>
        <div style={{ ...FULL, transformOrigin: `${lensX}px ${lensY}px`, transform: `scale(${k * z})` }}><Img src={S(lensSrc)} style={FULL} /></div>
      </div>
      {open < 0.6 && <div style={{ position: "absolute", left: lensX - R, top: lensY - R, width: R * 2, height: R * 2, borderRadius: "50%", border: "10px solid #2b2016", boxShadow: "0 0 0 3px rgba(255,255,255,.25) inset, 0 18px 40px rgba(0,0,0,.55)", opacity: 1 - open / 0.6 }} />}
      {tag(interpolate(f, [fChuck + 24, fChuck + 36], [0, 1], CL), 80, "ONE CUT: CHUCK", "#8E3B12")}
    </AbsoluteFill>
  );
};

// 2 · Por tandas: la olla atestada se parte en diagonal y las dos mitades se abren como una persiana de tijera, dejando ver la tanda de una sola capa (en «spot»)
export const Batch: React.FC<{ dur: number; fSpot: number }> = ({ dur, fSpot }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [fSpot - 4, fSpot + 20], [0, 1], { ...CL, easing: EASE });
  const z = interpolate(f, [0, dur], [1.02, 1.1], CL);
  const off = p * 1300;
  return (
    <AbsoluteFill style={{ background: "#0e0b08", overflow: "hidden" }}>
      <div style={{ ...FULL, transform: `scale(${z})` }}><Img src={S("e_batch_brown")} style={FULL} /></div>
      {p < 1 && <>
        <div style={{ ...FULL, clipPath: "polygon(0 0, 100% 0, 0 100%)", transform: `translate(${-off}px, ${-off * 0.56}px)` }}>
          <div style={{ ...FULL, transform: `scale(${z})` }}><Img src={S("e_batch_crowd")} style={FULL} /></div>
        </div>
        <div style={{ ...FULL, clipPath: "polygon(100% 0, 100% 100%, 0 100%)", transform: `translate(${off}px, ${off * 0.56}px)` }}>
          <div style={{ ...FULL, transform: `scale(${z})` }}><Img src={S("e_batch_crowd")} style={FULL} /></div>
        </div>
      </>}
      {tag(interpolate(f, [fSpot + 22, fSpot + 34], [0, 1], CL), 80, "ONE LAYER · ROOM AROUND IT", "#8E3B12")}
    </AbsoluteFill>
  );
};

// 3 · El café: un barrido de reloj desde las 12 destapa la olla desglasada mientras la costra se suelta (en «lets»)
export const Coffee: React.FC<{ dur: number; fLift: number }> = ({ dur, fLift }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [fLift - 8, fLift + 34], [0, 360], { ...CL, easing: Easing.inOut(Easing.quad) });
  const z = interpolate(f, [0, dur], [1.0, 1.08], CL);
  const rot = interpolate(f, [0, dur], [0, 4], CL);
  const m = `conic-gradient(from 0deg at 50% 50%, #000 0deg, #000 ${a}deg, transparent ${a + 0.5}deg)`;
  return (
    <AbsoluteFill style={{ background: "#0d0a07", overflow: "hidden" }}>
      <div style={{ ...FULL, transform: `rotate(${rot}deg) scale(${z * 1.05})` }}><Img src={S("e_coffee_crust")} style={FULL} /></div>
      <div style={{ ...FULL, WebkitMaskImage: m, maskImage: m }}>
        <div style={{ ...FULL, transform: `rotate(${rot}deg) scale(${z * 1.05})` }}><Img src={S("e_coffee_lift")} style={FULL} /></div>
      </div>
      {tag(interpolate(f, [8, 20], [0, 1], CL), 80, "1 CUP STRONG BLACK COFFEE", "#3E2A1A")}
    </AbsoluteFill>
  );
};

// 4 · El hervor lento: la olla vista de costado se inclina hacia la cámara hasta quedar vista desde arriba, con las burbujas perezosas (en «bubble»)
export const Simmer: React.FC<{ dur: number; fTop: number }> = ({ dur, fTop }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [fTop - 10, fTop + 18], [0, 1], { ...CL, easing: EASE });
  const z = interpolate(f, [0, dur], [1.02, 1.08], CL);
  const side = p < 0.5;
  const ang = side ? p * 2 * 70 : (1 - (p - 0.5) * 2) * -70;
  return (
    <AbsoluteFill style={{ background: "#0d0a07", overflow: "hidden", perspective: 1600 }}>
      <div style={{ ...FULL, transformOrigin: "50% 50%", transform: `rotateX(${ang}deg) scale(${z})`, filter: `brightness(${1 - Math.abs(ang) / 160})` }}>
        <Img src={S(side ? "e_simmer_side" : "e_simmer_top")} style={FULL} />
      </div>
      {tag(interpolate(f, [fTop + 22, fTop + 34], [0, 1], CL), 80, "180–190 °F · LAZY BUBBLES", "#8E3B12")}
    </AbsoluteFill>
  );
};

// 5 · Repartir para enfriar: la olla se rebana en tres franjas horizontales que se deslizan a lados alternos y destapan las tres bandejas bajas (en «shallow»)
export const Cool: React.FC<{ dur: number; fSplit: number }> = ({ dur, fSplit }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, dur], [1.02, 1.08], CL);
  const N = 3, h = 1080 / N;
  return (
    <AbsoluteFill style={{ background: "#0f0c09", overflow: "hidden" }}>
      <div style={{ ...FULL, transform: `scale(${z})` }}><Img src={S("e_cool_pans")} style={FULL} /></div>
      {Array.from({ length: N }).map((_, i) => {
        const p = interpolate(f, [fSplit - 4 + i * 5, fSplit + 18 + i * 5], [0, 1], { ...CL, easing: Easing.in(Easing.cubic) });
        if (p >= 1) return null;
        const dx = (i % 2 ? 1 : -1) * p * 2000;
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: i * h, width: 1920, height: h + 1, overflow: "hidden", transform: `translateX(${dx}px)`, boxShadow: p > 0 ? "0 10px 30px rgba(0,0,0,.5)" : "none" }}>
            <div style={{ position: "absolute", left: 0, top: -i * h, width: 1920, height: 1080, transform: `scale(${z})`, transformOrigin: "960px 540px" }}>
              <Img src={S("e_cool_pot")} style={FULL} />
            </div>
          </div>
        );
      })}
      {tag(interpolate(f, [fSplit + 32, fSplit + 44], [0, 1], CL), 80, "2–3 INCHES DEEP · FRIDGE IN 2 HOURS", "#2F5D7A")}
    </AbsoluteFill>
  );
};

export const ESC_OLE15B: Record<string, React.FC<any>> = { loupe: Loupe, batch: Batch, coffee: Coffee, simmer: Simmer, cool: Cool };
