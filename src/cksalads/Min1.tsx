// cksalads · minuto 1 (Claude, 11-oct-2026) v2 tras veredicto cp3: PastorLine (10-22 s), SevenBowls (30-46 s), ChapterFan (46.5-62 s) + apertura con la miniatura exacta.
// Tiempos = segundos absolutos de words.json. f = cuadro dentro del componente.
import React from "react";
import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { HAND, LABEL, fr, cl, lin, img, C, Grade, Grain, Mark, Print, Chip, Bed, sp } from "./Base";
import { camAt, camStyle, Cam } from "./New";

const useT = (a: number) => { const f = useCurrentFrame(); return { f, at: (t: number) => fr(t) - fr(a) }; };
const full = { width: "100%", height: "100%", objectFit: "cover" as const };

// 0-3.8 s: la miniatura exacta del tarjeta, con un empuje lento de Remotion (sin agnes)
export const Opening: React.FC<{ a: number; d: number }> = ({ a, d }) => {
  const { f } = useT(a);
  const sc = 1 + 0.035 * (f / Math.max(1, d));
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${sc})`, transformOrigin: "50% 45%" }}>
        <Img src={staticFile("img/cksalads/cksalads_thumb.jpg")} style={full} />
      </AbsoluteFill>
      <Grade warm={1.02} vig={0.2} />
    </AbsoluteFill>
  );
};

// 10-22 s: la cámara recorre la fila de bowls (escala 2.2, fila a ~46 % de la altura), luego se funde al plato vacío (ya no hay mesa vacía)
export const PastorLine: React.FC<{ a: number; d: number }> = ({ a, d }) => {
  const { f, at } = useT(a);
  const K1: Cam[] = [{ t: 9.83, s: 2.2, x: 560, y: 500 }, { t: 12.8, s: 2.2, x: 1420, y: 500 }];
  const c1 = camAt(f, at, K1, 2.8);
  const fadeEmpty = lin(f, at(12.9), at(13.5), 0, 1);
  // plato vacío: empuje lento 1.0 → 1.15 sobre el centro del plato, no se congela
  const K2: Cam[] = [{ t: 13.1, s: 1.0, x: 960, y: 620 }, { t: 21.43, s: 1.15, x: 960, y: 700 }];
  const c2 = camAt(f, at, K2, 8.0);
  const mk = at(13.45);
  const note = sp(f, at(14.3), 13, 150);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#15110c" }}>
      <AbsoluteFill style={{ opacity: 1 - fadeEmpty }}>
        <AbsoluteFill style={camStyle(c1)}>
          <Img src={img("n_table_seven_bowls")} style={full} />
        </AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: fadeEmpty }}>
        <AbsoluteFill style={camStyle(c2)}>
          <Img src={img("n_empty_plate_end")} style={full} />
          <Mark kind="circle" x={720} y={600} w={480} h={260} f={f} at={mk} dur={12} sw={10} />
        </AbsoluteFill>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 120, bottom: 150, opacity: cl(note * 1.4), transform: `translateY(${(1 - note) * 30}px) rotate(-2deg)`,
        background: "#F3E7CC", padding: "18px 36px 22px", boxShadow: "0 24px 50px rgba(0,0,0,0.45)", fontFamily: HAND, fontSize: 80, color: C.ink, lineHeight: 1.05 }}>
        Pastor, always last in line.
      </div>
      <Grade warm={1.12} vig={0.4} />
      <Grain />
    </AbsoluteFill>
  );
};

// 30-46 s: arco centrado de 7 huecos (x 160-1760), tarjetas 300x225; el 7 llega primero a la derecha; la #1 boca abajo con reverso de papel
const SALAD: { k: string; n: string; t: number }[] = [
  { k: "n_salad_copper", n: "7", t: 30.03 }, { k: "n_salad_threebean", n: "6", t: 31.37 }, { k: "n_salad_frogeye", n: "5", t: 34.9 },
  { k: "n_salad_pistachio", n: "4", t: 36.3 }, { k: "n_salad_sevenlayer", n: "3", t: 38.4 }, { k: "n_salad_macaroni", n: "2", t: 40.9 },
];
const W = 345, H = 259;
const slot = (i: number) => {
  const xc = 330 + i * 209; const yc = 560 + Math.abs(i - 3) * 18;
  return { x: xc - W / 2, y: yc - H / 2, rot: (i - 3) * 2.2 };
};
export const SevenBowls: React.FC<{ a: number; d: number }> = ({ a, d }) => {
  const { f, at } = useT(a);
  const headU = sp(f, at(29.43), 13, 150);
  const oneU = sp(f, at(42.57), 13, 160);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#15110c" }}>
      <Bed k="n_table_seven_bowls" f={f} T={d} dim={0.6} />
      <div style={{ position: "absolute", left: 110, top: 96, opacity: cl(headU * 1.4), transform: `translateX(${(1 - headU) * -40}px)` }}>
        <Chip txt="SEVEN SALADS · ONE TRICK EACH" size={50} bg="#FFFDF4" color={C.ink} rot={-1.5} />
      </div>
      {SALAD.map((s, i) => {
        const p = slot(6 - i); // 7 en el hueco de la derecha
        const u = sp(f, at(s.t), 13, 150);
        if (f < at(s.t) - 2) return null;
        return (
          <div key={s.k} style={{ position: "absolute", left: p.x, top: p.y, opacity: cl(u * 2), transform: `translateY(${(1 - u) * -160}px) rotate(${p.rot}deg) scale(${0.9 + 0.1 * u})` }}>
            <Print k={s.k} w={W} h={H} f={f} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: -52, textAlign: "center", opacity: cl(u * 1.5) }}>
              <Chip txt={s.n} size={44} bg="#FFFDF4" color={C.ink} rot={-p.rot / 2} />
            </div>
          </div>
        );
      })}
      {/* #1: reverso de tarjeta de papel crema, "#1" a mano y chip DENTRO del cuadro */}
      {(() => { const p = slot(0); const u = sp(f, at(42.57), 13, 150);
        if (f < at(42.57) - 2) return null;
        return (
          <div style={{ position: "absolute", left: p.x, top: p.y, opacity: cl(u * 2), transform: `translateY(${(1 - u) * -160}px) rotate(${p.rot}deg)` }}>
            <div style={{ width: W, height: H, background: "#F3E7CC", boxShadow: "0 24px 50px rgba(0,0,0,0.5)", border: "6px solid #FFFDF4", boxSizing: "border-box", position: "relative" }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: 40, textAlign: "center", fontFamily: HAND, fontSize: 92, color: C.ink }}>#1</div>
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 14, textAlign: "center", opacity: cl(oneU * 1.5) }}>
                <Chip txt="THE ONE THEY FOUGHT OVER" size={30} bg={C.red} color="#fff" rot={-1} />
              </div>
            </div>
          </div>
        ); })()}
      <Grade warm={1.1} vig={0.42} />
      <Grain />
    </AbsoluteFill>
  );
};

// 46.5-62 s: arranca DENTRO de la página 27 (#7, la primera del conteo), tira hacia atrás; luego abanico de 7 páginas sobre la foto de la mesa; la 21 va última con papelito encima
const PAGES = ["n_salad_copper", "n_salad_threebean", "n_salad_frogeye", "n_salad_pistachio", "n_salad_sevenlayer", "n_salad_macaroni", "n_salad_pretzel"]; // izquierda → derecha (las paginas van una sola vez, en su bloque)
export const ChapterFan: React.FC<{ a: number; d: number }> = ({ a, d }) => {
  const { f, at } = useT(a);
  const PW = 757, PH = 980, PL = 582, PT = 50, sc = PH / 1650;
  const K: Cam[] = [{ t: 45.67, s: 2.5, x: 960, y: PT + 128 }, { t: 48.37, s: 1.0, x: 960, y: 540 }];
  const c = camAt(f, at, K, 2.2);
  const bigOut = lin(f, at(49.03), at(49.83), 1, 0);
  const note = sp(f, at(47.37), 8, 220);
  const chip = sp(f, at(50.03), 13, 180);
  const drift = 1 + 0.0 * f; // mantengo quieto el fondo; el abanico deriva con el desplazamiento de abajo
  const sway = -18 + 36 * Math.min(1, Math.max(0, (f - at(49.53)) / Math.max(1, d * 30 - at(49.53)))); // deriva lenta
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#15110c" }}>
      <Bed k="n_table_seven_bowls" f={f} T={d} dim={0.55} />
      <AbsoluteFill style={{ opacity: bigOut }}>
        <AbsoluteFill style={camStyle(c)}>
          <div style={{ position: "absolute", left: PL, top: PT, width: PW, height: PH, background: "#fff", boxShadow: "0 40px 90px rgba(0,0,0,0.55)" }}>
            <Img src={img("book_cover")} style={full} />
            <div style={{ position: "absolute", left: 48, top: 1108 * sc, width: 660, height: 156 * sc, background: "linear-gradient(170deg,#E9D3A6,#D9BD86)", boxShadow: "0 10px 22px rgba(0,0,0,0.35)",
              transform: `rotate(-1.5deg) scale(${1 + 0.05 * note})`, display: "flex", alignItems: "center", justifyContent: "center", gap: 26 }}>
              <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 30, letterSpacing: 5, color: C.ink }}>THE ONE STEP</div>
              <div style={{ fontFamily: HAND, fontSize: 34, color: C.red }}>coming up…</div>
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateX(${sway}px)` }}>
        {PAGES.map((k, i) => {
          const t0 = 49.33 + i * 0.3;
          const u = sp(f, at(t0), 12, 150);
          if (f < at(t0) - 2) return null;
          const H2 = 414, W2 = 292;
          const x = 200 + i * ((1720 - 200 - W2) / 6);
          const yc = 560 + Math.abs(i - 3) * 16;
          const rot = (i - 3) * 2.6;
          return (
            <div key={k} style={{ position: "absolute", left: x, top: yc - H2 / 2, width: W2, height: H2,
              opacity: cl(u * 2), transform: `translateY(${(1 - u) * 300}px) rotate(${rot * u}deg)`, transformOrigin: "50% 100%", boxShadow: "0 20px 40px rgba(0,0,0,0.45)", background: "#fff" }}>
              <Img src={img(k)} style={full} />
              {k === "n_salad_pretzel" ? (
                <div style={{ position: "absolute", left: 10, right: 10, top: "40%", padding: "14px 10px", background: "#F3E7CC", boxShadow: "0 12px 26px rgba(0,0,0,0.4)", transform: "rotate(-3deg)",
                  textAlign: "center", fontFamily: HAND, fontSize: 40, color: C.ink, lineHeight: 1.05 }}>
                  #1 · coming up…
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", right: 120, top: 110, opacity: chip, transform: `translateX(${(1 - chip) * -60}px) rotate(4deg)` }}>
        <Chip txt="PAGES 21-27" size={44} bg={C.red} color="#fff" rot={0} />
      </div>
      <Grade warm={1.1} vig={0.4} />
      <Grain />
    </AbsoluteFill>
  );
};

// Minuto 1 entero: apertura, PastorLine, SevenBowls, ChapterFan (cronología fija)
export const Min1: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "transparent" }}>
    <Sequence from={0.0} durationInFrames={fr(9.85)}><Opening a={0.0} d={fr(9.85)} /></Sequence>
    <Sequence from={fr(9.83)} durationInFrames={fr(17.32)}><PastorLine a={9.83} d={fr(17.32)} /></Sequence>
    <Sequence from={fr(29.43)} durationInFrames={fr(15.48)}><SevenBowls a={29.43} d={fr(15.48)} /></Sequence>
    <Sequence from={fr(45.67)} durationInFrames={fr(17.33)}><ChapterFan a={45.67} d={fr(17.33)} /></Sequence>
  </AbsoluteFill>
);
