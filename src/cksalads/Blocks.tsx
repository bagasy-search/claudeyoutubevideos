// cksalads · bloques de ensalada (Claude, 12-oct-2026). Cada bloque usa el mismo set con tratamientos distintos.
// Todos los tiempos son segundos absolutos de words.json (secs.json). Fotos reales (agnes/gpt), página del libro, sin dibujos.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { HAND, LABEL, SERIF, fr, cl, lin, img, C, Grade, Grain, Mark, Print, Chip, Bed, sp } from "./Base";
import { camAt, camStyle, Cam } from "./New";

const useT = (a: number) => { const f = useCurrentFrame(); return { f, at: (t: number) => fr(t) - fr(a) }; };
const full = { width: "100%", height: "100%", objectFit: "cover" as const };
const shadowTxt = "0 6px 26px rgba(0,0,0,0.65)";

// 1) tarjeta de número: foto del bowl con empuje lento, número grande y nombre
export const NumberCard: React.FC<{ a: number; d: number; n: string; name: string; k: string }> = ({ a, d, n, name, k }) => {
  const { f, at } = useT(a);
  const sc = 1.0 + 0.12 * (f / Math.max(1, d));
  const u = sp(f, 0, 14, 160);
  const nu = sp(f, 0, 13, 150);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#15110c" }}>
      <AbsoluteFill style={{ transform: `scale(${sc})`, transformOrigin: "55% 50%" }}>
        <Img src={img(k)} style={full} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0) 60%)" }} />
      <div style={{ position: "absolute", left: 120, top: 250, opacity: cl(nu * 1.3), transform: `translateY(${(1 - nu) * 30}px)` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 300, lineHeight: 0.9, color: C.porc, textShadow: shadowTxt }}>{n}</div>
        <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 96, color: C.porc, textShadow: shadowTxt, marginTop: 16 }}>{name}</div>
      </div>
      <Grade warm={1.1} vig={0.4} />
      <Grain />
    </AbsoluteFill>
  );
};

// 2) página del libro: la cámara entra a la lista de ingredientes; las barras se marcan en "every amount"
export const PageCard: React.FC<{ a: number; d: number; k: string; page: number; rows: number[]; amountsT: number; tab: string; cam: Cam[] }> = ({ a, d, k, page, rows, amountsT, tab, cam }) => {
  const { f, at } = useT(a);
  const PW = 757, PH = 980, PL = 582, PT = 50, sc = PH / 1650;
  const c = camAt(f, at, cam.map((k) => ({ ...k, s: Math.min(k.s, 1.6) })), 2.0);
  const tb = sp(f, at(a + 1), 13, 180);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#15110c" }}>
      <Bed k={k} f={f} T={d} dim={0.55} />
      <AbsoluteFill style={camStyle(c)}>
        <div style={{ position: "absolute", left: PL, top: PT, width: PW, height: PH, background: "#fff", boxShadow: "0 40px 90px rgba(0,0,0,0.55)" }}>
          <Img src={img(k)} style={full} />
          {rows.map((y, i) => {
            const u = lin(f, at(amountsT) + i * 7, at(amountsT) + i * 7 + 10, 0, 1);
            return <div key={i} style={{ position: "absolute", left: 50, top: (y - 19) * sc, height: 30 * sc, width: 300 * u, background: "rgba(255,214,60,0.5)", mixBlendMode: "multiply", borderRadius: 4 }} />;
          })}
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", right: 120, top: 110, opacity: tb, transform: `translateX(${(1 - tb) * -60}px) rotate(5deg)` }}>
        <Chip txt={tab} size={40} bg={C.red} color="#fff" rot={0} />
      </div>
      <Grade warm={1.1} vig={0.4} />
      <Grain />
    </AbsoluteFill>
  );
};

// 3) pasos: fotos de proceso que caen en su verbo, cada una con su texto de paso
export const StepRow: React.FC<{ a: number; d: number; steps: { k: string; t: number; lab: string }[] }> = ({ a, d, steps }) => {
  const { f, at } = useT(a);
  const two = steps.length === 2;
  const W = two ? 560 : 520, H = two ? 420 : 390;
  const SL = two ? [640, 1280] : [480, 960, 1440];
  const K: Cam[] = two
    ? [{ t: a, s: 1.5, x: SL[0], y: 540 }, { t: steps[1].t - 2.5, s: 1.5, x: SL[0], y: 540 }, { t: steps[1].t + 0.5, s: 1.0, x: 960, y: 540 }]
    : [{ t: a, s: 1.6, x: SL[0], y: 540 }, { t: steps[1].t + 2, s: 1.0, x: 960, y: 540 }, { t: (steps[2] || steps[1]).t + 2, s: 1.0, x: 960, y: 540 }];
  const c = camAt(f, at, K, 2.5);
  const drift = two ? 1 : 1 + 0.03 * (f / Math.max(1, d));
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#15110c" }}>
      <Bed k={steps[0].k} f={f} T={d} dim={0.6} />
      <AbsoluteFill style={{ ...camStyle({ ...c, s: c.s * drift }) }}>
        {steps.map((s, i) => {
          const u = i === 0 ? 1 : sp(f, at(s.t), 13, 150);
          if (f < at(s.t) - 2 && i > 0) return null;
          const cx = SL[i], rot = two ? [-2, 2][i] : [-3, 2, -2][i];
          return (
            <div key={s.k} style={{ position: "absolute", left: cx - W / 2, top: 540 - H / 2, opacity: cl(u * 2), transform: `translateY(${i === 0 ? 0 : (1 - u) * -140}px) rotate(${rot}deg)` }}>
              <Print k={s.k} w={W} h={H} f={f} />
              <div style={{ position: "absolute", left: 0, right: 0, bottom: two ? 14 : -58, textAlign: "center", opacity: cl(u * 1.5) }}>
                <Chip txt={s.lab} size={38} bg="#FFFDF4" color={C.ink} rot={-rot / 2} />
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
      <Grade warm={1.1} vig={0.42} />
      <Grain />
    </AbsoluteFill>
  );
};

// chip pequeno dentro del cuadro, abajo a la derecha (para verse sobre una pieza de avatar)
export const MinChip: React.FC<{ txt: string }> = ({ txt }) => {
  const u = sp(useCurrentFrame(), 0, 13, 160);
  return (
    <div style={{ position: "absolute", right: 110, bottom: 110, opacity: cl(u * 2), transform: `scale(${0.9 + 0.1 * u})` }}>
      <Chip txt={txt} size={46} bg={C.red} color="#fff" rot={0} />
    </div>
  );
};

// 4) truco: foto de la acción exacta, marca roja y anillo que cuenta
export const TrickCard: React.FC<{ a: number; d: number; k: string; circ: number; txt: string; timer: number; ring: string; mx?: number; my?: number; mw?: number; mh?: number }> = ({ a, d, k, circ, txt, timer, ring, mx = 520, my = 320, mw = 840, mh = 420 }) => {
  const { f, at } = useT(a);
  const sc = Math.min(1.04, 1.0 + 0.04 * (f / Math.max(1, d)));
  const tu = sp(f, at(timer), 14, 140);
  const R = 120, L = 2 * Math.PI * R;
  const el = Math.max(0, (f - at(timer)) / 30);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#100c08" }}>
      <AbsoluteFill style={{ transform: `scale(${sc})`, transformOrigin: "50% 50%" }}>
        <Img src={img(k)} style={full} />
        <Mark kind="circle" x={mx} y={my} w={mw} h={mh} f={f} at={at(circ)} dur={12} sw={10} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,0) 45%, rgba(16,11,7,0.55) 80%)" }} />
      <div style={{ position: "absolute", left: 120, top: 120, width: 760, opacity: cl(sp(f, at(circ), 12, 160) * 1.3) }}>
        <div style={{ fontFamily: HAND, fontSize: 80, color: C.porc, textShadow: shadowTxt, lineHeight: 1.05 }}>{txt}</div>
      </div>
      <div style={{ position: "absolute", right: 220, top: 540, transform: `translateY(-50%) scale(${0.85 + 0.15 * tu})`, opacity: cl(tu * 1.3), width: 300 * 1.0 }}>
        <div style={{ position: "relative", width: 2 * R + 40, height: 2 * R + 40 }}>
          <svg width={2 * R + 40} height={2 * R + 40} style={{ position: "absolute", left: 0, top: 0, transform: "rotate(-90deg)" }}>
            <circle cx={R + 20} cy={R + 20} r={R} fill="rgba(251,248,242,0.10)" stroke="rgba(251,248,242,0.28)" strokeWidth={14} />
            <circle cx={R + 20} cy={R + 20} r={R} fill="none" stroke="#F2C94C" strokeWidth={14} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * Math.min(1, el / 60)} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: C.porc, textShadow: shadowTxt }}>{ring}</div>
        </div>
      </div>
      <Grade warm={1.1} vig={0.4} />
      <Grain />
    </AbsoluteFill>
  );
};

// 5) mal / bien: dos fotos reales lado a lado, marca X sobre la mala y tilde sobre la buena
export const DoDontCard: React.FC<{ a: number; d: number; bad: string; good: string; badT: number; goodT: number; badTxt: string; goodTxt: string }> = ({ a, d, bad, good, badT, goodT, badTxt, goodTxt }) => {
  const { f, at } = useT(a);
  const bu = 1, gu = sp(f, at(goodT), 13, 150) || 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#15110c" }}>
      <Bed k={bad} f={f} T={d} dim={0.6} />
      <div style={{ position: "absolute", left: 80, top: 150, width: 860, height: 600, opacity: 1, transform: "rotate(-2deg)" }}>
        <Print k={bad} w={860} h={600} f={f}>{[35, -35].map((ang, j) => { const k2 = lin(f, at(badT) + 4 + j * 8, at(badT) + 12 + j * 8, 0, 1); return <div key={j} style={{ position: "absolute", left: -20, top: 280 - 9, width: 800, height: 18, background: C.red, transform: `rotate(${ang}deg) scaleX(${k2})`, transformOrigin: "50% 50%", borderRadius: 9, boxShadow: "0 4px 12px rgba(0,0,0,0.5)" }} />; })}</Print>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: -64, textAlign: "center" }}><Chip txt={badTxt} size={40} bg={C.red} color="#fff" rot={-1} /></div>
      </div>
      <div style={{ position: "absolute", left: 980, top: 150, width: 860, height: 600, opacity: 1, transform: "rotate(2deg)" }}>
        <Print k={good} w={860} h={600} f={f} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: -64, textAlign: "center" }}><Chip txt={goodTxt} size={40} bg="#FFFDF4" color={C.ink} rot={1} /></div>
      </div>
      <Grade warm={1.1} vig={0.42} />
      <Grain />
    </AbsoluteFill>
  );
};

// 6) para uno o dos: foto de la porción pequeña + nota a mano
export const FewCard: React.FC<{ a: number; d: number; k: string; txt: string; t: number }> = ({ a, d, k, txt, t }) => {
  const { f, at } = useT(a);
  const sc = 1.0 + 0.08 * (f / Math.max(1, d));
  const nu = sp(f, at(t), 13, 150);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#15110c" }}>
      <AbsoluteFill style={{ transform: `scale(${sc})`, transformOrigin: "40% 50%" }}><Img src={img(k)} style={full} /></AbsoluteFill>
      <div style={{ position: "absolute", left: 120, bottom: 150, opacity: cl(nu * 1.4), transform: `translateY(${(1 - nu) * 30}px) rotate(-2deg)`,
        background: "#F3E7CC", padding: "18px 36px 22px", boxShadow: "0 24px 50px rgba(0,0,0,0.45)", fontFamily: HAND, fontSize: 70, color: C.ink, lineHeight: 1.05 }}>{txt}</div>
      <Grade warm={1.1} vig={0.4} />
      <Grain />
    </AbsoluteFill>
  );
};

// 7) tarjeta de CTA: portada real del libro + texto "link under this video" (sin QR)
export const CtaCard: React.FC<{ a: number; d: number }> = ({ a, d }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(a), 13, 150);
  const sc = Math.min(1.08, 1.0 + 0.08 * (f / Math.max(1, d)));
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#15110c" }}>
      <Bed k="n_fluff_church_table" f={f} T={d} dim={0.6} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 90, opacity: cl(u * 1.6) }}>
        <div style={{ transform: `scale(${sc}) rotate(-2deg)`, boxShadow: "0 30px 70px rgba(0,0,0,0.6)", width: 420, height: 594, background: "#fff" }}>
          <Img src={img("book_cover")} style={full} />
        </div>
        <div style={{ width: 700, flexShrink: 0 }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 6, color: C.porc, textShadow: shadowTxt }}>MY LITTLE COOKBOOK</div>
          <div style={{ fontFamily: HAND, fontSize: 84, color: C.porc, textShadow: shadowTxt, lineHeight: 1.05, marginTop: 14 }}>link right under this video</div>
        </div>
      </div>
      <Grade warm={1.1} vig={0.4} />
      <Grain />
    </AbsoluteFill>
  );
};

// 8) plano de archivo real (sin audio): video recortado + leyenda de lo que se ve
export const ArchiveCard: React.FC<{ a: number; d: number; src: string; cap: string }> = ({ a, d, src, cap }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(a), 13, 150);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <OffthreadVideo src={staticFile("arch/" + src + ".mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(0.25) contrast(1.02)" }} />
      <div style={{ position: "absolute", left: 90, bottom: 110, opacity: cl(u * 1.5) }}>
        <Chip txt={cap} size={34} bg="#FFFDF4" color={C.ink} rot={-1} />
      </div>
      <Grade warm={1.1} vig={0.35} />
      <Grain />
    </AbsoluteFill>
  );
};
