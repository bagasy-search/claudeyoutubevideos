// ck5na · kit de componentes (uno distinto por minuto, ninguno se repite en la tanda ck5n: registro D:/rtmp/ck5n_COMPONENTES.md).
// Todos son OBJETOS (etiqueta, recibo, fuente, regla, perilla…) en papel crema / vino / dorado, con perspectiva, sombra de contacto,
// entrada con resorte de a uno y salida fundida. Viven a la DERECHA (x 1180-1860) o arriba: abajo-izq es del zócalo y el centro de Loretta.
import React from "react";
import { e, ei, spr } from "../kits/yanqui3d/lib";
import { C, HAND, SANS, SERIF } from "./ui";

export const cl = (x: number) => Math.min(1, Math.max(0, x));
const bl = (px: number) => (px > 0.15 ? `blur(${px.toFixed(2)}px)` : "none");
export const SH = "0 2px 0 rgba(255,255,255,.5) inset, 0 4px 8px rgba(0,0,0,.3), 0 22px 40px rgba(0,0,0,.42), 0 50px 90px rgba(0,0,0,.3)";
export const PAPER = `radial-gradient(120% 100% at 30% 15%, #fffaf0, ${C.cream} 45%, ${C.paper})`;
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const fmt$ = (c: number) => (c < 100 ? `${Math.round(c)}¢` : `$${(c / 100).toFixed(2)}`);

// marco común: entra girando desde la escena (resorte con peso), se va fundido; tilt 3D vivo
type SP = { t: number; a: number; out: number; x?: number; y?: number; w: number; h: number; ry?: number; children: React.ReactNode; bg?: string; pad?: number; noCard?: boolean };
export const Shell: React.FC<SP> = ({ t, a, out, x = 1500, y = 380, w, h, ry = -14, children, bg = PAPER, pad = 0, noCard }) => {
  if (t < a - 0.1 || t > out + 0.7) return null;
  const k = spr(t, a, 0.85), kO = ei(t, out, out + 0.55), u = t - a;
  const Zm = Math.min(1.32, (2 * (1885 - x)) / w, (2 * (x - 1010)) / w, (2 * (y - 40)) / h, (2 * (1010 - y)) / h);   // a 1920: más grande, sin pasar el borde ni acercarse a la cara
  const s = Zm * lerp(0.82, 1, cl(k)) * (1 - 0.06 * kO);
  const rY = ry * (1 - cl(k)) * 2.2 + ry * 0.35 + 2.5 * Math.sin(u * 0.7) - kO * 18;
  const rX = 5 + 1.5 * Math.cos(u * 0.55);
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, perspective: 1400, opacity: cl(k * 2.2) * (1 - kO), filter: bl((1 - cl(k * 1.5)) * 10 + kO * 10) }}>
      <div style={{ position: "absolute", left: "8%", right: "8%", bottom: -26, height: 40, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(0,0,0,.45), rgba(0,0,0,0))", transform: `scaleX(${s})` }} />
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - cl(k)) * 70 + kO * -40}px) scale(${s}) rotateY(${rY}deg) rotateX(${rX}deg)`, transformStyle: "preserve-3d" }}>
        {noCard ? children : <div style={{ position: "absolute", inset: 0, background: bg, borderRadius: 14, boxShadow: SH, padding: pad, overflow: "hidden", border: `1.5px solid ${C.gold}88` }}>{children}</div>}
      </div>
    </div>
  );
};
export const Kicker: React.FC<{ txt: string; col?: string }> = ({ txt, col = C.wine }) => <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 22, letterSpacing: 3, color: col }}>{txt}</div>;
export const pop = (t: number, a: number) => cl(spr(t, a, 1.1));
export const popS = (t: number, a: number): React.CSSProperties => { const k = pop(t, a); return { opacity: cl(k * 2), transform: `translateY(${(1 - k) * 26}px) scale(${0.7 + 0.3 * k})` }; };

// 1 · ETIQUETA DE GÓNDOLA: la bolsa de 12 pancitos con su etiqueta $4.79 que se pega y se divide por 12
export const ShelfTag: React.FC<{ t: number; a: number; out: number; split: number }> = ({ t, a, out, split }) => {
  const kS = ei(t, split, split + 0.8);
  return (
    <Shell t={t} a={a} out={out} w={560} h={360} noCard>
      <div style={{ position: "absolute", left: 30, top: 20, width: 300, height: 230, borderRadius: "30px 30px 18px 18px", background: "linear-gradient(160deg, rgba(255,255,255,.75), rgba(230,225,215,.5))", boxShadow: "inset 0 0 30px rgba(255,255,255,.8), 0 20px 30px rgba(0,0,0,.35)", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, padding: 22 }}>
        {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #f8e6b8, #e2b86a 60%, #b98436)", boxShadow: "0 3px 5px rgba(0,0,0,.25)", ...popS(t, a + 0.15 + i * 0.04) }} />)}
      </div>
      <div style={{ position: "absolute", right: 10, top: 150, width: 260, height: 150, background: "#fff8c4", border: "2px solid #c9b64a", borderRadius: 6, boxShadow: SH, transform: `rotate(${-4 + 4 * kS}deg) translateY(${(1 - pop(t, a + 0.5)) * -120}px)`, padding: "12px 16px" }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 18, color: "#555" }}>DINNER ROLLS · 12 CT</div>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 64, color: "#c0281c", lineHeight: 1 }}>$4.79</div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 24, color: C.ink, opacity: kS }}>= 40¢ A ROLL</div>
      </div>
    </Shell>
  );
};

// 2 · LA TIRA DE INGREDIENTES: una etiqueta que se desenrolla y no termina nunca, con el contador a 31
export const LabelScroll: React.FC<{ t: number; a: number; out: number }> = ({ t, a, out }) => {
  const k = ei(t, a + 0.2, a + 2.4), n = Math.round(31 * k);
  const W = ["ENRICHED FLOUR", "NIACIN", "REDUCED IRON", "THIAMINE MONONITRATE", "RIBOFLAVIN", "FOLIC ACID", "SOYBEAN OIL", "CALCIUM PROPIONATE", "DATEM", "MONO- AND DIGLYCERIDES", "SODIUM STEAROYL LACTYLATE", "AZODICARBONAMIDE", "ASCORBIC ACID", "ENZYMES", "WHEAT GLUTEN", "SOY LECITHIN", "CALCIUM SULFATE", "NATAMYCIN"];
  return (
    <Shell t={t} a={a} out={out} w={520} h={560} y={430}>
      <div style={{ position: "absolute", inset: 0, padding: "26px 30px" }}>
        <Kicker txt="ON THE BACK OF THE BAG" />
        <div style={{ height: 380, overflow: "hidden", marginTop: 12, maskImage: "linear-gradient(180deg,#000 75%,transparent)" }}>
          <div style={{ transform: `translateY(${-k * 260}px)`, fontFamily: SANS, fontWeight: 600, fontSize: 22, color: "#4a3a2c", lineHeight: 1.5 }}>{W.concat(W).map((w, i) => <span key={i}>{w}, </span>)}</div>
        </div>
        <div style={{ position: "absolute", right: 26, bottom: 18, display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontFamily: SERIF, fontSize: 96, color: C.wine, lineHeight: 1 }}>{n}</span><span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 22, color: C.ink }}>INGREDIENTS</span>
        </div>
      </div>
    </Shell>
  );
};

// 3 · EL CALENDARIO DE HOJAS: 1962 que pasa volando hasta hoy (64 años sin comprar un pancito)
export const YearFlip: React.FC<{ t: number; a: number; out: number; from: number; to: number }> = ({ t, a, out, from, to }) => {
  const k = ei(t, a + 0.3, a + 2.3), y = Math.round(lerp(from, to, k)), fl = (t * 18) % 1;
  return (
    <Shell t={t} a={a} out={out} w={420} h={400} y={360}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 74, background: `linear-gradient(180deg, ${C.wine}, ${C.wineD})`, display: "flex", alignItems: "center", justifyContent: "center", gap: 70 }}>
        {[0, 1].map((i) => <div key={i} style={{ width: 22, height: 44, borderRadius: 11, background: "#d9d0c0", boxShadow: "inset 0 -4px 6px rgba(0,0,0,.4)", marginTop: -40 }} />)}
      </div>
      <div style={{ position: "absolute", top: 90, left: 0, right: 0, textAlign: "center", fontFamily: SERIF, fontSize: 150, color: C.ink, lineHeight: 1, transform: k < 1 ? `rotateX(${fl * 50}deg)` : undefined }}>{y}</div>
      <div style={{ position: "absolute", bottom: 30, left: 0, right: 0, textAlign: "center", fontFamily: HAND, fontSize: 44, color: C.wine, opacity: e(t, a + 2.3, a + 2.7) }}>{to - from} years · not one roll bought</div>
    </Shell>
  );
};

// 4 · LUPA SOBRE EL RECIBO: un renglón con un círculo de lápiz y un signo de pregunta (la promesa de la mitad)
export const LoupeTeaser: React.FC<{ t: number; a: number; out: number }> = ({ t, a, out }) => {
  const k = ei(t, a + 0.5, a + 1.6), dash = 640 * (1 - ei(t, a + 1.3, a + 2.2));
  return (
    <Shell t={t} a={a} out={out} w={460} h={460} y={400} noCard>
      <div style={{ position: "absolute", left: 40, top: 30, width: 300, height: 400, background: "linear-gradient(180deg,#f3e3b8,#e7cf94)", boxShadow: SH, clipPath: "polygon(0 0,100% 0,100% 88%,86% 100%,0 100%)", padding: "24px 26px", fontFamily: "Courier New, monospace", fontSize: 20, color: "#5a4630", lineHeight: 1.7 }}>
        <div>MAIN ST. GROCERY</div><div>3·17·62</div><div>FLOUR 5LB ..... .58</div><div>YEAST ......... .08</div><div>YEAST ......... .08</div><div>YEAST ......... .08</div><div>MILK .......... .07</div><div>BUTTER ........ .19</div>
      </div>
      <div style={{ position: "absolute", left: lerp(330, 130, k), top: lerp(320, 150, k), width: 220, height: 220, borderRadius: "50%", border: "14px solid #2b1d12", boxShadow: "0 18px 30px rgba(0,0,0,.45), inset 0 0 40px rgba(255,255,255,.35)", background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,.35), rgba(255,255,255,.05))" }}>
        <div style={{ position: "absolute", right: -70, bottom: -70, width: 110, height: 26, background: "#2b1d12", borderRadius: 10, transform: "rotate(45deg)" }} />
      </div>
      <svg width={460} height={460} style={{ position: "absolute", inset: 0 }}><ellipse cx={190} cy={204} rx={150} ry={34} fill="none" stroke={C.red} strokeWidth={5} strokeDasharray={640} strokeDashoffset={dash} /></svg>
      <div style={{ position: "absolute", right: 10, top: 10, fontFamily: SERIF, fontSize: 120, color: C.red, ...popS(t, a + 2.2) }}>?</div>
    </Shell>
  );
};

// 5 · LA HELADERA DE 4 DÍAS: el bol amarillo en el estante y cuatro tiras de día que se van cortando
export const FourDayStrip: React.FC<{ t: number; a: number; out: number }> = ({ t, a, out }) => (
  <Shell t={t} a={a} out={out} w={560} h={300} y={330}>
    <div style={{ position: "absolute", inset: 0, padding: "22px 26px" }}>
      <Kicker txt="ONE BOWL · IN THE REFRIGERATOR" />
      <div style={{ display: "flex", gap: 14, marginTop: 20 }}>
        {["DAY 1", "DAY 2", "DAY 3", "DAY 4"].map((d, i) => (
          <div key={d} style={{ flex: 1, height: 170, borderRadius: 12, background: "linear-gradient(180deg,#e8f2f4,#c9dce0)", boxShadow: "inset 0 2px 0 #fff, 0 8px 16px rgba(0,0,0,.25)", position: "relative", ...popS(t, a + 0.3 + i * 0.35) }}>
            <div style={{ position: "absolute", left: 18, right: 18, bottom: 34, height: lerp(64, 22, i / 3), borderRadius: "0 0 50px 50px", background: "linear-gradient(180deg,#f6c94b,#d89b1d)", boxShadow: "0 6px 10px rgba(0,0,0,.3)" }}>
              <div style={{ position: "absolute", left: 8, right: 8, top: -10, height: 18, borderRadius: "50%", background: "#f6ead2" }} />
            </div>
            <div style={{ position: "absolute", bottom: 6, width: "100%", textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 20, color: C.wineD }}>{d}</div>
          </div>
        ))}
      </div>
    </div>
  </Shell>
);

// 6 · LA REPISA DE LOS CINCO PANES: cuatro siluetas que se encienden de a una y la quinta tapada con un repasador
const Bread: React.FC<{ kind: number; s?: number }> = ({ kind, s = 1 }) => {
  const g = "radial-gradient(circle at 35% 30%, #f9e2a8, #e0a952 55%, #a8661f)";
  if (kind === 0) return <div style={{ width: 90 * s, height: 70 * s, borderRadius: "48% 48% 40% 40%", background: g }} />;
  if (kind === 1) return <div style={{ width: 80 * s, height: 86 * s, display: "flex", gap: 2 }}>{[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ flex: 1, borderRadius: "40% 40% 10% 10%", background: g, transform: `rotate(${(i - 2) * 8}deg)` }} />)}</div>;
  if (kind === 2) return <svg width={96 * s} height={80 * s} viewBox="0 0 96 80"><path d="M14 52 C 10 18, 60 6, 62 34 C 64 60, 22 66, 40 36 C 52 18, 86 26, 82 52" fill="none" stroke="#d39a45" strokeWidth={20} strokeLinecap="round" /></svg>;
  if (kind === 3) return <svg width={110 * s} height={70 * s} viewBox="0 0 110 70"><path d="M8 50 Q 55 -6 102 50 Q 80 60 55 46 Q 30 60 8 50Z" fill="#dda04d" stroke="#a8661f" strokeWidth={3} />{[30, 45, 60, 75].map((x) => <path key={x} d={`M${x} 22 Q ${x + 4} 38 ${x} 52`} stroke="#a8661f" strokeWidth={2.5} fill="none" />)}</svg>;
  return <div style={{ width: 110 * s, height: 56 * s, borderRadius: "50% 50% 30% 30%", background: g, boxShadow: "inset 0 -6px 0 rgba(0,0,0,.12)" }} />;
};
export const FiveBreadShelf: React.FC<{ t: number; a: number; out: number }> = ({ t, a, out }) => {
  const N = ["PAN ROLLS", "BUTTERFLAKES", "KNOTS", "BUTTERHORNS", "?"];
  return (
    <Shell t={t} a={a} out={out} w={760} h={300} x={1450} y={300}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, height: 20, background: "linear-gradient(180deg,#8a5a34,#5b3a20)", boxShadow: "0 8px 12px rgba(0,0,0,.35)" }} />
      <div style={{ position: "absolute", left: 30, right: 30, bottom: 90, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        {N.map((n, i) => (
          <div key={i} style={{ width: 130, display: "flex", flexDirection: "column", alignItems: "center", ...popS(t, a + 0.3 + i * 0.45) }}>
            {i < 4 ? <Bread kind={i} /> : <div style={{ width: 120, height: 80, borderRadius: "40% 40% 10% 10%", background: "repeating-linear-gradient(90deg,#fff 0 10px,#c9302c 10px 20px)", boxShadow: "0 8px 12px rgba(0,0,0,.3)" }} />}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 30, right: 30, bottom: 22, display: "flex", justifyContent: "space-between" }}>
        {N.map((n, i) => <div key={i} style={{ width: 130, textAlign: "center", fontFamily: i < 4 ? SANS : SERIF, fontWeight: 800, fontSize: i < 4 ? 17 : 40, color: i < 4 ? C.ink : C.wine, opacity: e(t, a + 0.5 + i * 0.45, a + 0.9 + i * 0.45) }}>{n}</div>)}
      </div>
    </Shell>
  );
};

// 7 · LA FOTO DE 1962: polaroid que cae con el sello de fecha y la nota a mano
export const Snapshot62: React.FC<{ t: number; a: number; out: number; img?: string; line1: string; line2: string }> = ({ t, a, out, line1, line2 }) => {
  const k = pop(t, a);
  return (
    <Shell t={t} a={a} out={out} w={420} h={500} y={420} noCard>
      <div style={{ position: "absolute", inset: 0, background: "#fbf8f0", boxShadow: SH, transform: `rotate(${lerp(-18, -5, k)}deg)`, padding: "22px 22px 0" }}>
        <div style={{ height: 330, background: "linear-gradient(160deg,#cfc6b3,#8f8574)", filter: "sepia(.5)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: "34%", top: "22%", width: "32%", height: "55%", borderRadius: "40% 40% 10% 10%", background: "#6c6252" }} />
          <div style={{ position: "absolute", left: "43%", top: "10%", width: "14%", height: "18%", borderRadius: "50%", background: "#7a6f5d" }} />
          <div style={{ position: "absolute", right: 10, bottom: 8, fontFamily: "Courier New, monospace", fontWeight: 700, fontSize: 24, color: "#ffb04a", textShadow: "0 0 6px #ff7a00" }}>MAR '62</div>
        </div>
        <div style={{ fontFamily: HAND, fontSize: 40, color: "#2a3a6e", marginTop: 14, textAlign: "center", opacity: e(t, a + 0.7, a + 1.2) }}>{line1}</div>
        <div style={{ fontFamily: HAND, fontSize: 30, color: "#2a3a6e", textAlign: "center", opacity: e(t, a + 1.1, a + 1.6) }}>{line2}</div>
      </div>
      <div style={{ position: "absolute", left: 160, top: -16, width: 110, height: 34, background: "rgba(240,230,190,.8)", transform: "rotate(-4deg)" }} />
    </Shell>
  );
};

// 8 · LA LIBRETA DE ASISTENCIA DE HAZEL: nombre, edad y el delantal azul como muestra de tela
export const HazelCard: React.FC<{ t: number; a: number; out: number }> = ({ t, a, out }) => (
  <Shell t={t} a={a} out={out} w={520} h={300} y={330}>
    <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(180deg, transparent 0 46px, ${C.rule} 46px 48px)`, padding: "24px 30px" }}>
      <Kicker txt="THE OLDEST ONE DOWN THERE" />
      <div style={{ fontFamily: SERIF, fontSize: 66, color: C.ink, marginTop: 6, ...popS(t, a + 0.3) }}>Hazel Nordquist</div>
      <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 14 }}>
        <div style={{ fontFamily: HAND, fontSize: 46, color: C.wine, ...popS(t, a + 0.8) }}>age 73</div>
        <div style={{ width: 120, height: 86, background: "repeating-linear-gradient(45deg,#3a5f9a 0 6px,#335489 6px 12px)", clipPath: "polygon(6% 0,94% 0,100% 100%,0 100%)", boxShadow: "0 6px 10px rgba(0,0,0,.3)", ...popS(t, a + 1.2) }} />
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 18, color: "#5a4a3a", ...popS(t, a + 1.4) }}>SAME BLUE APRON<br />EVERY WEEK</div>
      </div>
    </div>
  </Shell>
);

// 9 · LA CITA DE HAZEL escrita a mano en una tarjeta de receta, con la tinta que corre
export const InkQuote: React.FC<{ t: number; a: number; out: number; l1: string; l2: string; a2: number }> = ({ t, a, out, l1, l2, a2 }) => {
  const w1 = ei(t, a + 0.1, a + 1.6), w2 = ei(t, a2, a2 + 1.2);
  return (
    <Shell t={t} a={a} out={out} w={640} h={290} y={300} ry={10}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(180deg, transparent 58px, ${C.red}88 58px 60px, transparent 60px), repeating-linear-gradient(180deg, transparent 0 52px, ${C.rule} 52px 54px)`, padding: "18px 34px" }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 20, letterSpacing: 3, color: C.wine }}>HAZEL SAID</div>
        <div style={{ fontFamily: HAND, fontSize: 52, color: "#24306a", marginTop: 18, clipPath: `inset(0 ${100 - w1 * 100}% 0 0)` }}>{l1}</div>
        <div style={{ fontFamily: HAND, fontSize: 64, fontWeight: 700, color: C.wine, clipPath: `inset(0 ${100 - w2 * 100}% 0 0)` }}>{l2}</div>
      </div>
    </Shell>
  );
};

// 10 · LA SEMANA DEL BOL (domingo → miércoles): cuatro clavijas con lo que se horneó cada día, el bol bajando
export const BowlWeek: React.FC<{ t: number; a: number; marks: number[] }> = ({ t, a, marks }) => {
  const out = marks[marks.length - 1] + 3;
  const D = ["SUN", "MON", "TUE", "WED"], W = ["ROLLS", "LADIES' CIRCLE", "MORE ROLLS", "KNOTS · MEN'S SUPPER"];
  const done = marks.filter((m) => t >= m).length;
  return (
    <Shell t={t} a={a} out={out} w={600} h={320} y={320}>
      <div style={{ position: "absolute", inset: 0, padding: "22px 28px" }}>
        <Kicker txt="ONE YELLOW BOWL" />
        <div style={{ display: "flex", gap: 14, marginTop: 18, alignItems: "flex-end" }}>
          <div style={{ width: 120, height: 150, position: "relative" }}>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 90, borderRadius: "0 0 60px 60px", background: "linear-gradient(180deg,#f6c94b,#cf8f15)", boxShadow: "0 8px 14px rgba(0,0,0,.35)" }} />
            <div style={{ position: "absolute", left: 10, right: 10, bottom: lerp(70, 18, done / 4), height: 30, borderRadius: "50%", background: "#f3e6cc", transition: "none" }} />
          </div>
          {D.map((d, i) => (
            <div key={d} style={{ flex: 1, opacity: t >= marks[i] ? 1 : 0.25, transform: `translateY(${t >= marks[i] ? 0 : 12}px)` }}>
              <div style={{ fontFamily: SERIF, fontSize: 40, color: t >= marks[i] ? C.wine : C.ink }}>{d}</div>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 15, color: C.ink, lineHeight: 1.2 }}>{W[i]}</div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
};

// 11 · LA LEVADURA DORMIDA: frasco con burbujas que suben rápido y, al entrar el frío (escarcha), casi se detienen
export const SleepyYeast: React.FC<{ t: number; a: number; out: number }> = ({ t, a, out }) => {
  const cold = ei(t, a + 0.8, a + 2.2), u = t - a;
  return (
    <Shell t={t} a={a} out={out} w={420} h={460} y={400} bg={`linear-gradient(180deg, ${lerp(0, 1, cold) > 0.5 ? "#e9f4f8" : "#fbf3e4"}, #f3e5cb)`}>
      <div style={{ position: "absolute", inset: 0, padding: "22px 26px" }}>
        <Kicker txt={cold > 0.5 ? "IN THE COLD · ASLEEP" : "WARM · AWAKE"} col={cold > 0.5 ? "#2f6f8f" : C.wine} />
        <div style={{ position: "absolute", left: 90, top: 80, width: 240, height: 320, borderRadius: "20px 20px 50px 50px", border: "6px solid rgba(255,255,255,.9)", background: "linear-gradient(180deg, rgba(255,255,255,.2), rgba(240,220,170,.65))", boxShadow: "inset 0 0 30px rgba(255,255,255,.7), 0 18px 30px rgba(0,0,0,.3)", overflow: "hidden" }}>
          {Array.from({ length: 14 }, (_, i) => {
            const sp = lerp(1, 0.08, cold), ph = (i * 0.37) % 1, yy = 1 - (((u * 0.45 * sp + ph) % 1));
            return <div key={i} style={{ position: "absolute", left: 20 + ((i * 53) % 190), top: 30 + yy * 270, width: 10 + (i % 3) * 6, height: 10 + (i % 3) * 6, borderRadius: "50%", border: "2px solid rgba(255,255,255,.9)" }} />;
          })}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 0%, rgba(190,230,255,.0), rgba(170,215,240,.55))", opacity: cold }} />
        </div>
        <div style={{ position: "absolute", right: 30, top: 70, fontSize: 70, color: "#7fc1e6", opacity: cold, transform: `rotate(${u * 20}deg)` }}>❄</div>
      </div>
    </Shell>
  );
};

// 12 · EL TERMÓMETRO DE MUÑECA: la columna sube a 110 °F (verde) y si pasa, se pone roja: «dead yeast»
export const WristThermo: React.FC<{ t: number; a: number; out: number; over?: number }> = ({ t, a, out, over }) => {
  const k = ei(t, a + 0.3, a + 1.8), ov = over ? ei(t, over, over + 0.8) : 0, v = lerp(70, 110, k) + 40 * ov;
  const hh = (v - 60) / 100 * 300;
  return (
    <Shell t={t} a={a} out={out} w={330} h={520} y={420}>
      <div style={{ position: "absolute", left: 120, top: 40, width: 46, height: 380, borderRadius: 23, background: "#fff", boxShadow: "inset 0 0 10px rgba(0,0,0,.25)" }}>
        <div style={{ position: "absolute", left: 13, bottom: 20, width: 20, height: hh, borderRadius: 10, background: ov > 0.5 ? C.red : "#d8392b" }} />
        <div style={{ position: "absolute", left: -6, right: -6, bottom: 20 + (110 - 60) / 100 * 300 - 34, height: 50, border: "3px solid #3f9a5a", borderRadius: 8, background: "rgba(80,190,110,.18)" }} />
      </div>
      <div style={{ position: "absolute", left: 104, top: 400, width: 78, height: 78, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #ff7a6a, #b81d12)", boxShadow: "0 8px 12px rgba(0,0,0,.35)" }} />
      <div style={{ position: "absolute", left: 186, top: 40 + 380 - 20 - (110 - 60) / 100 * 300 - 26, fontFamily: SERIF, fontSize: 54, color: "#2f7a45" }}>110°</div>
      <div style={{ position: "absolute", left: 186, top: 60, fontFamily: SANS, fontWeight: 900, fontSize: 30, color: C.red, opacity: ov, lineHeight: 1.05 }}>DEAD<br />YEAST</div>
      <div style={{ position: "absolute", left: 20, bottom: 24, fontFamily: HAND, fontSize: 32, color: C.wine }}>warm on your wrist</div>
    </Shell>
  );
};

// 13 · EL RELOJ DE COCINA DE 10 MINUTOS: la perilla gira y la espuma sube en el bol
export const EggTimer: React.FC<{ t: number; a: number; out: number; mins: number; label: string }> = ({ t, a, out, mins, label }) => {
  const k = ei(t, a + 0.4, a + 2.6);
  return (
    <Shell t={t} a={a} out={out} w={420} h={430} y={390} noCard>
      <div style={{ position: "absolute", left: 60, top: 20, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #fff, #f1e3c4 60%, #d6bf8f)", boxShadow: SH, border: `8px solid ${C.wine}` }}>
        {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 141, top: 10, width: 4, height: i % 3 ? 14 : 24, background: C.ink, transformOrigin: "2px 132px", transform: `rotate(${i * 30}deg)` }} />)}
        <div style={{ position: "absolute", left: 0, right: 0, top: 104, textAlign: "center", fontFamily: SERIF, fontSize: 70, color: C.ink }}>{Math.max(0, Math.ceil(mins * (1 - k)))}</div>
        <div style={{ position: "absolute", left: 140, top: 30, width: 8, height: 120, background: C.red, borderRadius: 4, transformOrigin: "4px 120px", transform: `rotate(${360 * k}deg)` }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 345, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 26, color: "#fff", textShadow: "0 3px 10px rgba(0,0,0,.8)", ...popS(t, a + 2.6) }}>{label}</div>
    </Shell>
  );
};

// 14 · LA CUCHARA CON HILOS: la cuchara de madera sube y la masa se estira en hilos (los 2 minutos de batido)
export const StringySpoon: React.FC<{ t: number; a: number; out: number }> = ({ t, a, out }) => {
  const lift = ei(t, a + 0.5, a + 2.2), w = lerp(10, 220, lift);
  return (
    <Shell t={t} a={a} out={out} w={430} h={520} y={420}>
      <svg width={430} height={520} style={{ position: "absolute", inset: 0 }}>
        <ellipse cx={215} cy={470} rx={180} ry={40} fill="#e9c98a" />
        <ellipse cx={215} cy={462} rx={170} ry={30} fill="#f3dfb2" />
        {[-40, -18, 0, 20, 42].map((dx, i) => <path key={i} d={`M ${215 + dx * 0.4} ${470 - w - 20} C ${215 + dx} ${470 - w * 0.5}, ${215 + dx * 1.5} ${470 - w * 0.3}, ${215 + dx * 2} 462`} stroke="#f0d9a6" strokeWidth={7 - Math.abs(dx) / 12} fill="none" opacity={0.95} />)}
        <g transform={`translate(215 ${440 - w}) rotate(-8)`}>
          <ellipse cx={0} cy={0} rx={46} ry={30} fill="#b9814a" stroke="#8a5a2e" strokeWidth={3} />
          <rect x={-10} y={-300} width={20} height={280} rx={10} fill="#c89155" stroke="#8a5a2e" strokeWidth={3} />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 22, top: 18 }}><Kicker txt="LIKE MELTED CHEESE" /></div>
    </Shell>
  );
};

// 15 · LAS TAZAS DE HARINA: medidas que caen de a media taza sobre una regla de 5½ a 6¼ — y se para donde la masa dice
export const FlourRange: React.FC<{ t: number; a: number; out: number }> = ({ t, a, out }) => {
  const k = ei(t, a + 0.4, a + 3.0), v = lerp(3, 5.75, k);
  const X = (c: number) => 40 + (c - 3) / 3.5 * 460;
  return (
    <Shell t={t} a={a} out={out} w={560} h={300} y={330}>
      <div style={{ position: "absolute", inset: 0, padding: "22px 28px" }}>
        <Kicker txt="FLOUR · HALF A CUP AT A TIME" />
        <div style={{ position: "absolute", left: X(5.5), width: X(6.25) - X(5.5), top: 110, height: 90, background: "rgba(80,170,100,.22)", border: "3px dashed #3f9a5a", borderRadius: 10 }} />
        <div style={{ position: "absolute", left: 40, right: 60, top: 200, height: 6, background: C.ink, borderRadius: 3 }} />
        {[3, 4, 5, 6].map((c) => <div key={c} style={{ position: "absolute", left: X(c) - 20, top: 214, width: 40, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 22, color: C.ink }}>{c}</div>)}
        <div style={{ position: "absolute", left: X(v) - 34, top: 120, width: 68, height: 70, borderRadius: "6px 6px 18px 18px", background: "linear-gradient(180deg,#e8e8e8,#a9a9a9)", boxShadow: "0 8px 12px rgba(0,0,0,.35)" }}>
          <div style={{ position: "absolute", left: 6, right: 6, top: 8, height: 24, background: "#fff", borderRadius: 4 }} />
        </div>
        <div style={{ position: "absolute", left: X(5.5), width: X(6.25) - X(5.5), top: 254, textAlign: "center", fontFamily: HAND, fontSize: 30, color: "#2f7a45" }}>5½ – 6¼</div>
      </div>
    </Shell>
  );
};

// 16 · LA PIEDRA DEL DÍA 3: la bola de masa blanda que, si está dura el día 1, se vuelve una piedra gris el día 3
export const DoughToRock: React.FC<{ t: number; a: number; out: number; at3: number }> = ({ t, a, out, at3 }) => {
  const k = ei(t, at3, at3 + 1.0);
  return (
    <Shell t={t} a={a} out={out} w={560} h={300} y={330}>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "space-around", padding: "0 30px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 170, height: 120, borderRadius: "50% 50% 45% 45%", background: "radial-gradient(circle at 35% 30%, #fffaf0, #f0dcb5 60%, #d8bd8a)", boxShadow: "0 12px 16px rgba(0,0,0,.3)", ...popS(t, a + 0.2) }} />
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 22, marginTop: 14, color: C.ink }}>STIFF · DAY 1</div>
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 70, color: C.wine, opacity: e(t, at3 - 0.3, at3) }}>→</div>
        <div style={{ textAlign: "center", opacity: e(t, at3 - 0.2, at3 + 0.2) }}>
          <div style={{ width: 170, height: 120, borderRadius: "42% 55% 38% 50%", background: `radial-gradient(circle at 35% 30%, ${k > 0.5 ? "#a9a49b" : "#efdcb5"}, ${k > 0.5 ? "#6d6860" : "#d8bd8a"} 70%)`, boxShadow: "0 12px 16px rgba(0,0,0,.4)", transform: `rotate(${k * -8}deg)` }} />
          <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 22, marginTop: 14, color: C.red }}>A ROCK · DAY 3</div>
        </div>
      </div>
    </Shell>
  );
};

// 17 · EL MAPA DE LA HELADERA: corte de la heladera, la puerta tachada y el estante de abajo, al fondo, con el bol
export const FridgeMap: React.FC<{ t: number; a: number; out: number; door: number; shelf: number }> = ({ t, a, out, door, shelf }) => (
  <Shell t={t} a={a} out={out} w={420} h={560} y={430} bg="linear-gradient(180deg,#f7f7f2,#e3e4de)">
    <div style={{ position: "absolute", left: 40, top: 40, width: 230, height: 470, border: "6px solid #c9cbc5", borderRadius: 18, background: "linear-gradient(180deg,#eef6f8,#d7e6ea)" }}>
      {[110, 220, 330].map((y) => <div key={y} style={{ position: "absolute", left: 0, right: 0, top: y, height: 6, background: "#b8c6ca" }} />)}
      <div style={{ position: "absolute", left: 50, top: 352, width: 130, height: 70, borderRadius: "0 0 50px 50px", background: "linear-gradient(180deg,#f6c94b,#cf8f15)", boxShadow: "0 6px 10px rgba(0,0,0,.3)", ...popS(t, shelf) }}>
        <div style={{ position: "absolute", left: 4, right: 4, top: -10, height: 16, borderRadius: "50%", background: "#fff", border: "2px solid #ddd" }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 282, top: 40, width: 90, height: 470, border: "6px solid #c9cbc5", borderRadius: "6px 18px 18px 6px", background: "#e8eef0", transform: "perspective(500px) rotateY(-30deg)", transformOrigin: "left" }}>
      {[80, 200, 320].map((y) => <div key={y} style={{ position: "absolute", left: 4, right: 4, top: y, height: 40, borderBottom: "5px solid #b8c6ca" }} />)}
    </div>
    <svg width={420} height={560} style={{ position: "absolute", inset: 0, opacity: e(t, door, door + 0.3) }}><path d="M 290 180 L 380 330 M 380 180 L 290 330" stroke={C.red} strokeWidth={12} strokeLinecap="round" /></svg>
    <div style={{ position: "absolute", left: 40, top: 6, fontFamily: SANS, fontWeight: 900, fontSize: 22, color: "#2f7a45", opacity: e(t, shelf, shelf + 0.3) }}>BOTTOM SHELF · IN THE BACK</div>
  </Shell>
);

// 18 · EL PUÑO QUE BAJA LA MASA: la cúpula de masa sube hasta el borde y se desinfla con un «suspiro»
export const PunchDown: React.FC<{ t: number; a: number; out: number; hit: number }> = ({ t, a, out, hit }) => {
  const up = ei(t, a + 0.2, hit - 0.1), dn = ei(t, hit, hit + 0.6), hgt = lerp(40, 150, up) * (1 - 0.7 * dn);
  return (
    <Shell t={t} a={a} out={out} w={460} h={420} y={400}>
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 50, height: 130, borderRadius: "0 0 170px 170px", background: "linear-gradient(180deg,#f6c94b,#c98710)", boxShadow: "0 14px 20px rgba(0,0,0,.35)" }} />
      <div style={{ position: "absolute", left: 76, right: 76, bottom: 170, height: hgt, borderRadius: "50% 50% 10% 10%", background: "radial-gradient(circle at 40% 30%, #fffaf0, #f0dcb5 65%, #d8bd8a)" }} />
      <div style={{ position: "absolute", left: 175, top: lerp(-20, 260 - hgt * 0.6, ei(t, hit - 0.5, hit)), width: 110, height: 100, borderRadius: "40% 40% 30% 30%", background: "radial-gradient(circle at 40% 30%, #f1c8a8, #d79c78)", opacity: e(t, hit - 0.6, hit - 0.4) * (1 - e(t, hit + 0.8, hit + 1.2)), boxShadow: "0 10px 14px rgba(0,0,0,.3)" }} />
      <div style={{ position: "absolute", right: 24, top: 30, fontFamily: HAND, fontSize: 52, color: C.wine, opacity: e(t, hit + 0.2, hit + 0.5) }}>…pfff</div>
    </Shell>
  );
};

// 19 · EL RECIBO DE 1962 que se imprime renglón por renglón, la suma y el sello «4¢ A ROLL»
export const Receipt62: React.FC<{ t: number; rows: { at: number; item: string; c: number }[]; sumAt: number; ovenAt: number; totAt: number; perAt: number; out: number }> = ({ t, rows, sumAt, ovenAt, totAt, perAt, out }) => {
  const a = rows[0].at - 0.4, vis = rows.filter((r) => t >= r.at).length;
  const sum = rows.slice(0, vis).reduce((s, r) => s + r.c, 0);
  const L = (txt: string, val: string, at: number, bold = false) => <div key={txt} style={{ display: "flex", justifyContent: "space-between", opacity: e(t, at, at + 0.25), fontWeight: bold ? 700 : 400 }}><span>{txt}</span><span>{val}</span></div>;
  return (
    <Shell t={t} a={a} out={out} w={440} h={720} y={520} x={1560} noCard>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#f4e5bd,#e8d29c)", boxShadow: SH, clipPath: "polygon(0 0,100% 0,100% 97%,93% 100%,86% 97%,79% 100%,72% 97%,65% 100%,58% 97%,51% 100%,44% 97%,37% 100%,30% 97%,23% 100%,16% 97%,9% 100%,0 97%)", padding: "30px 34px", fontFamily: "Courier New, monospace", fontSize: 23, color: "#4e3b26", lineHeight: 1.55 }}>
        <div style={{ textAlign: "center", fontWeight: 700 }}>MAIN STREET GROCERY</div>
        <div style={{ textAlign: "center", marginBottom: 8 }}>MARCH 1962</div>
        {rows.map((r) => L(r.item, fmt$(r.c), r.at))}
        {L("SUBTOTAL", fmt$(sum), sumAt, true)}
        {L("+ OVEN, 3 AFTERNOONS", "15¢", ovenAt)}
        {L("WHOLE BOWL · 24 ROLLS", "98¢", totAt, true)}
        <div style={{ position: "absolute", left: 60, bottom: 70, fontFamily: HAND, fontSize: 40, color: "#2a3a6e", transform: "rotate(-6deg)", opacity: e(t, perAt - 0.2, perAt + 0.4) }}>4¢ a roll — L.</div>
      </div>
      <div style={{ position: "absolute", right: -10, bottom: 150, width: 170, height: 170, borderRadius: "50%", border: `7px solid ${C.wine}`, color: C.wine, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", fontFamily: SERIF, transform: `rotate(-14deg) scale(${lerp(2.2, 1, pop(t, perAt))})`, opacity: e(t, perAt, perAt + 0.15) * 0.92 }}>
        <div style={{ fontSize: 70, lineHeight: 1 }}>4¢</div><div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 18 }}>A ROLL</div>
      </div>
    </Shell>
  );
};

// 20 · LA PILA DE MONEDAS DE HOY: cada ingrediente suma su monedita hasta $5.16 → 21¢ por pancito
export const CoinStack: React.FC<{ t: number; rows: { at: number; item: string; c: number }[]; totAt: number; perAt: number; out: number }> = ({ t, rows, totAt, perAt, out }) => {
  const a = rows[0].at - 0.4, vis = rows.filter((r) => t >= r.at);
  const sum = vis.reduce((s, r) => s + r.c, 0);
  return (
    <Shell t={t} a={a} out={out} w={560} h={620} y={480}>
      <div style={{ position: "absolute", inset: 0, padding: "24px 28px" }}>
        <Kicker txt="THE SAME BOWL · THIS WEEK" />
        <div style={{ marginTop: 10, fontFamily: SANS, fontWeight: 600, fontSize: 21, color: C.ink, lineHeight: 1.55 }}>
          {rows.map((r) => <div key={r.item} style={{ display: "flex", justifyContent: "space-between", width: 300, opacity: e(t, r.at, r.at + 0.25) }}><span>{r.item}</span><b>{fmt$(r.c)}</b></div>)}
        </div>
        <div style={{ position: "absolute", right: 40, bottom: 120, width: 150, height: 330 }}>
          {vis.map((r, i) => <div key={r.item} style={{ position: "absolute", left: 0, bottom: i * 24, width: 150, height: 30, borderRadius: "50%", background: "linear-gradient(180deg,#f3d58a,#c79a3c)", border: "2px solid #9a6d22", boxShadow: "0 4px 6px rgba(0,0,0,.3)", transform: `translateY(${(1 - pop(t, r.at)) * -200}px)` }} />)}
        </div>
        <div style={{ position: "absolute", left: 28, bottom: 26, fontFamily: SERIF, fontSize: 76, color: C.wine, opacity: e(t, totAt, totAt + 0.3) }}>{t >= totAt ? "$5.16" : fmt$(sum)}</div>
        <div style={{ position: "absolute", right: 30, bottom: 36, fontFamily: SANS, fontWeight: 900, fontSize: 34, color: "#2f7a45", ...popS(t, perAt) }}>21¢ A ROLL</div>
      </div>
    </Shell>
  );
};

// 21 · TRES ETIQUETAS DE PRECIO POR PANCITO: tienda 29¢, la bolsa naranja 40¢, el tuyo 21¢ (la más chica, caliente)
export const PerRollTags: React.FC<{ t: number; a: number; b: number; c: number; out: number }> = ({ t, a, b, c, out }) => {
  const T = [{ at: a, p: "29¢", n: "BAKERY DOZEN", col: "#8a8a8a", h: 0.72 }, { at: b, p: "40¢", n: "ORANGE PACKAGE", col: "#d77a1d", h: 1 }, { at: c, p: "21¢", n: "YOURS · HOT", col: C.wine, h: 0.52 }];
  return (
    <Shell t={t} a={a - 0.3} out={out} w={600} h={380} y={360}>
      <div style={{ position: "absolute", left: 30, right: 30, bottom: 60, height: 260, display: "flex", alignItems: "flex-end", gap: 30 }}>
        {T.map((x) => (
          <div key={x.n} style={{ flex: 1, textAlign: "center", ...popS(t, x.at) }}>
            <div style={{ fontFamily: SERIF, fontSize: 60, color: x.col }}>{x.p}</div>
            <div style={{ height: 180 * x.h * cl(spr(t, x.at + 0.1, 0.9)), background: `linear-gradient(180deg, ${x.col}, ${x.col}aa)`, borderRadius: "10px 10px 0 0", boxShadow: "0 8px 14px rgba(0,0,0,.3)" }} />
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 30, right: 30, bottom: 20, display: "flex", gap: 30 }}>{T.map((x) => <div key={x.n} style={{ flex: 1, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 17, color: C.ink, opacity: e(t, x.at, x.at + 0.3) }}>{x.n}</div>)}</div>
    </Shell>
  );
};

// 22 · EL ERROR DEL RECIBO: el renglón tachado «YEAST ×3» → «×2», las 8 monedas que vuelven y el chicle
export const YeastRefund: React.FC<{ t: number; a: number; strike: number; back: number; gum: number; out: number }> = ({ t, a, strike, back, gum, out }) => {
  const s = ei(t, strike, strike + 0.6);
  return (
    <Shell t={t} a={a} out={out} w={560} h={320} y={340}>
      <div style={{ position: "absolute", inset: 0, padding: "26px 32px", fontFamily: "Courier New, monospace", fontSize: 30, color: "#4e3b26" }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 20, letterSpacing: 3, color: C.red }}>THE MISTAKE ON THE RECEIPT</div>
        <div style={{ marginTop: 22, position: "relative", width: 380 }}>YEAST ×3 ...... 24¢
          <div style={{ position: "absolute", left: 0, top: 18, height: 5, width: `${s * 100}%`, background: C.red }} />
        </div>
        <div style={{ marginTop: 8, color: "#2f7a45", fontWeight: 700, opacity: e(t, strike + 0.5, strike + 0.8) }}>YEAST ×2 ...... 16¢</div>
        <div style={{ display: "flex", gap: 8, marginTop: 22, alignItems: "center" }}>
          {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ width: 34, height: 34, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #f0b27a, #a85d2a)", border: "2px solid #7a3f18", ...popS(t, back + i * 0.08) }} />)}
          <div style={{ marginLeft: 16, width: 110, height: 34, borderRadius: 4, background: "linear-gradient(180deg,#f2f2f2,#cfd8dc)", border: "2px solid #9fb0b6", fontFamily: SANS, fontWeight: 800, fontSize: 15, color: "#2f6f8f", display: "flex", alignItems: "center", justifyContent: "center", ...popS(t, gum) }}>+ A STICK OF GUM</div>
        </div>
      </div>
    </Shell>
  );
};

// 23 · LA LÍNEA DE CADA DÍA: cinco pasos sobre una regla de horno (pellizco → frío → leudado → 375° → manteca)
export const DailyRail: React.FC<{ t: number; marks: number[]; out: number }> = ({ t, marks, out }) => {
  const S = ["PINCH OFF", "SHAPE COLD", "RISE 1½–2 H", "375° · 15–20 MIN", "BUTTER ON TOP"];
  const I = ["✋", "❄", "☁", "♨", "✦"];
  const now = marks.filter((m) => t >= m).length;
  return (
    <Shell t={t} a={marks[0] - 0.3} out={out} w={760} h={250} x={1430} y={270}>
      <div style={{ position: "absolute", left: 60, right: 60, top: 92, height: 8, background: "#d9c7a4", borderRadius: 4 }}>
        <div style={{ width: `${Math.max(0, now - 1) / (S.length - 1) * 100}%`, height: 8, background: C.wine, borderRadius: 4 }} />
      </div>
      <div style={{ position: "absolute", left: 30, right: 30, top: 50, display: "flex", justifyContent: "space-between" }}>
        {S.map((x, i) => (
          <div key={x} style={{ width: 130, display: "flex", flexDirection: "column", alignItems: "center", ...popS(t, marks[i]) }}>
            <div style={{ width: 84, height: 84, borderRadius: "50%", background: i < now ? `radial-gradient(circle at 35% 30%, #b8323f, ${C.wineD})` : "#e6d6b6", color: C.goldL, fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 14px rgba(0,0,0,.3)" }}>{I[i]}</div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 17, marginTop: 10, color: C.ink, textAlign: "center" }}>{x}</div>
          </div>
        ))}
      </div>
    </Shell>
  );
};

// 24 · LA FUENTE DE 9×13: veinticuatro bolitas que caen en 4 filas de 6 y se tocan
export const PanGrid: React.FC<{ t: number; a: number; out: number; rise: number }> = ({ t, a, out, rise }) => {
  const r = ei(t, rise, rise + 1.5);
  return (
    <Shell t={t} a={a} out={out} w={560} h={430} y={400} noCard>
      <div style={{ position: "absolute", left: 40, top: 40, width: 480, height: 330, borderRadius: 18, background: "linear-gradient(160deg,#cfd3d6,#8d9296)", boxShadow: SH, transform: "perspective(900px) rotateX(28deg)", padding: 24 }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 10, background: "#e9e4dc", display: "grid", gridTemplateColumns: "repeat(6,1fr)", gridTemplateRows: "repeat(4,1fr)", gap: lerp(10, 1, r), padding: 10 }}>
          {Array.from({ length: 24 }, (_, i) => <div key={i} style={{ borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #fff6e2, ${r > 0.5 ? "#e3b062" : "#efd9b2"} 70%)`, boxShadow: "0 4px 5px rgba(0,0,0,.25)", transform: `translateY(${(1 - pop(t, a + 0.3 + i * 0.06)) * -140}px) scale(${lerp(0.82, 1.08, r)})`, opacity: e(t, a + 0.3 + i * 0.06, a + 0.4 + i * 0.06) }} />)}
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 8, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 30, color: "#fff", textShadow: "0 3px 10px rgba(0,0,0,.8)" }}>4 ROWS OF 6 · TOUCHING</div>
    </Shell>
  );
};

// 25 · LA TORRE DE TIRAS: seis tiras de masa enmantecada que caen una sobre otra y se abren como un abanico en el horno
export const StripTower: React.FC<{ t: number; a: number; out: number; fan: number }> = ({ t, a, out, fan }) => {
  const f = ei(t, fan, fan + 1.2);
  return (
    <Shell t={t} a={a} out={out} w={460} h={460} y={410}>
      <div style={{ position: "absolute", left: 22, top: 18 }}><Kicker txt="6 STRIPS · BUTTER BETWEEN" /></div>
      {Array.from({ length: 6 }, (_, i) => {
        const k = pop(t, a + 0.3 + i * 0.3);
        return <div key={i} style={{ position: "absolute", left: 110, top: 330 - i * 34 - (1 - k) * 220, width: 240, height: 30, borderRadius: 8, background: "linear-gradient(180deg,#f6e3bb,#e2c48b)", borderTop: "3px solid #f6d36a", boxShadow: "0 4px 6px rgba(0,0,0,.25)", opacity: cl(k * 3), transformOrigin: "50% 100%", transform: `rotate(${(i - 2.5) * 9 * f}deg) translateX(${(i - 2.5) * 10 * f}px)` }} />;
      })}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 20, textAlign: "center", fontFamily: HAND, fontSize: 38, color: C.wine, opacity: f }}>…opens like a fan</div>
    </Shell>
  );
};

// 26 · LA SOGA SOBRE LA REGLA: la masa se estira hasta 8 pulgadas y se anuda con la punta metida abajo
export const RopeRuler: React.FC<{ t: number; a: number; out: number; knot: number }> = ({ t, a, out, knot }) => {
  const len = ei(t, a + 0.3, a + 1.8), kn = ei(t, knot, knot + 1.2);
  return (
    <Shell t={t} a={a} out={out} w={600} h={300} y={330}>
      <div style={{ position: "absolute", left: 30, right: 30, top: 190, height: 56, background: "linear-gradient(180deg,#f2d27a,#d8b04e)", borderRadius: 6, boxShadow: "0 6px 10px rgba(0,0,0,.3)" }}>
        {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: 10 + i * 64, top: 0, width: 3, height: 26, background: C.ink }}><div style={{ position: "absolute", top: 26, left: -6, fontFamily: SANS, fontWeight: 800, fontSize: 16, color: C.ink }}>{i}</div></div>)}
      </div>
      {kn < 0.05 ? <div style={{ position: "absolute", left: 40, top: 140, width: 512 * len, height: 38, borderRadius: 19, background: "linear-gradient(180deg,#f7e4bb,#ddb878)", boxShadow: "0 6px 8px rgba(0,0,0,.25)" }} />
        : <svg width={600} height={200} style={{ position: "absolute", left: 0, top: 0, opacity: kn }}><path d="M 200 150 C 180 60, 330 40, 320 120 C 310 170, 230 160, 270 100 C 300 60, 380 90, 400 150" fill="none" stroke="#ddb46f" strokeWidth={34} strokeLinecap="round" /></svg>}
      <div style={{ position: "absolute", right: 30, top: 24, fontFamily: SERIF, fontSize: 56, color: C.wine }}>8″</div>
      <div style={{ position: "absolute", left: 30, top: 24 }}><Kicker txt={kn > 0.5 ? "TUCK THE TOP END UNDER" : "EVEN ALL THE WAY"} /></div>
    </Shell>
  );
};

// 27 · EL CÍRCULO EN 12 CUÑAS: la masa de 12″ que se corta como pizza y cada cuña se enrolla hacia la punta
export const TwelveWedges: React.FC<{ t: number; a: number; out: number; roll: number }> = ({ t, a, out, roll }) => {
  const cut = ei(t, a + 0.5, a + 2.0), rl = ei(t, roll, roll + 1.2);
  return (
    <Shell t={t} a={a} out={out} w={460} h={460} y={410} noCard>
      <svg width={460} height={460} style={{ position: "absolute", inset: 0 }}>
        <circle cx={230} cy={230} r={190} fill="#efdcb5" stroke="#d6b77d" strokeWidth={6} style={{ filter: "drop-shadow(0 18px 18px rgba(0,0,0,.4))" }} />
        <circle cx={230} cy={230} r={190} fill="url(#bt)" opacity={0.5} />
        <defs><radialGradient id="bt"><stop offset="0" stopColor="#fff6dc" /><stop offset="1" stopColor="#f2c86a" /></radialGradient></defs>
        {Array.from({ length: 12 }, (_, i) => { const an = (i / 12) * 2 * Math.PI; const k = cl(cut * 12 - i); return <line key={i} x1={230} y1={230} x2={230 + 190 * k * Math.cos(an)} y2={230 + 190 * k * Math.sin(an)} stroke="#8a5a2e" strokeWidth={4} />; })}
        {Array.from({ length: 12 }, (_, i) => { const an = ((i + 0.5) / 12) * 2 * Math.PI; return <ellipse key={"r" + i} cx={230 + 150 * Math.cos(an)} cy={230 + 150 * Math.sin(an)} rx={26 * rl} ry={14 * rl} fill="#d9a04f" stroke="#9a6328" strokeWidth={2} transform={`rotate(${(an * 180) / Math.PI + 90} ${230 + 150 * Math.cos(an)} ${230 + 150 * Math.sin(an)})`} />; })}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontFamily: SERIF, fontSize: 72, color: C.wine, opacity: cut * (1 - rl * 0.3) }}>12</div>
    </Shell>
  );
};

// 28 · LOS DOS FRASCOS DE LA MANTECA CON MIEL: 2 cucharadas de manteca + 1 de miel que se funden en la brocha
export const HoneyButter: React.FC<{ t: number; a: number; b: number; out: number }> = ({ t, a, b, out }) => (
  <Shell t={t} a={a} out={out} w={540} h={330} y={350}>
    <div style={{ position: "absolute", left: 22, top: 18 }}><Kicker txt="THE BUTTERHORN GLAZE" /></div>
    <div style={{ position: "absolute", left: 40, right: 40, top: 80, display: "flex", alignItems: "flex-end", justifyContent: "space-around" }}>
      <div style={{ textAlign: "center", ...popS(t, a) }}>
        <div style={{ display: "flex", gap: 8 }}>{[0, 1].map((i) => <div key={i} style={{ width: 80, height: 50, borderRadius: 8, background: "linear-gradient(180deg,#fff6c9,#f2d977)", boxShadow: "0 6px 8px rgba(0,0,0,.25)" }} />)}</div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 22, marginTop: 10 }}>2 TBSP BUTTER</div>
      </div>
      <div style={{ fontFamily: SERIF, fontSize: 70, color: C.wine, opacity: e(t, b - 0.2, b) }}>+</div>
      <div style={{ textAlign: "center", ...popS(t, b) }}>
        <div style={{ width: 100, height: 120, borderRadius: "16px 16px 40px 40px", background: "linear-gradient(180deg,#f7b733,#c9780a)", boxShadow: "inset 0 0 18px rgba(255,255,255,.4), 0 6px 8px rgba(0,0,0,.25)", margin: "0 auto" }} />
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 22, marginTop: 10 }}>1 TBSP HONEY</div>
      </div>
    </div>
  </Shell>
);

// 29 · LA TARJETA DE REMATE: una ficha de receta manuscrita con la etiqueta de «estate sale 25¢» atada con hilo
export const EstateSale: React.FC<{ t: number; a: number; out: number }> = ({ t, a, out }) => (
  <Shell t={t} a={a} out={out} w={520} h={340} y={350} ry={12}>
    <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(180deg, transparent 0 40px, ${C.rule} 40px 42px)`, padding: "20px 28px" }}>
      <div style={{ fontFamily: HAND, fontSize: 40, color: "#24306a" }}>Mrs. Lund's Butterhorns</div>
      <div style={{ fontFamily: HAND, fontSize: 28, color: "#24306a", opacity: 0.8, lineHeight: 1.5 }}>1 c. milk · ½ c. sugar · 1 stick butter<br />2 pkg yeast · 2 eggs · 6 c. flour…</div>
    </div>
    <div style={{ position: "absolute", right: 30, bottom: 30, width: 150, height: 90, background: "#fff", border: "2px solid #c9b8a0", borderRadius: "8px 8px 8px 30px", transform: `rotate(${lerp(30, 8, pop(t, a + 0.8))}deg)`, boxShadow: "0 8px 12px rgba(0,0,0,.3)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, color: C.red, opacity: e(t, a + 0.8, a + 1.0) }}>
      <div style={{ fontSize: 15 }}>ESTATE SALE</div><div style={{ fontSize: 40 }}>25¢</div>
    </div>
  </Shell>
);

// 30 · EL RELOJ DEL BAZAR: de las 9 a las 11 la canasta de pancitos se vacía antes de que abra la mesa de tartas
export const BazaarClock: React.FC<{ t: number; a: number; out: number; gone: number }> = ({ t, a, out, gone }) => {
  const k = ei(t, a + 0.3, gone), n = Math.round(lerp(40, 0, k));
  return (
    <Shell t={t} a={a} out={out} w={600} h={330} y={350}>
      <div style={{ position: "absolute", left: 30, top: 40, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #fff, #efe2c7)", border: "8px solid #3a2a1c", boxShadow: "0 12px 18px rgba(0,0,0,.35)" }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => <div key={i} style={{ position: "absolute", left: 100, top: 6, width: 4, height: 14, background: C.ink, transformOrigin: "2px 96px", transform: `rotate(${i * 30}deg)` }} />)}
        <div style={{ position: "absolute", left: 99, top: 40, width: 6, height: 64, background: C.ink, borderRadius: 3, transformOrigin: "3px 64px", transform: `rotate(${270 + 60 * k}deg)` }} />
        <div style={{ position: "absolute", left: 100, top: 18, width: 4, height: 86, background: C.red, borderRadius: 2, transformOrigin: "2px 86px", transform: `rotate(${720 * k}deg)` }} />
      </div>
      <div style={{ position: "absolute", left: 290, top: 40 }}>
        <Kicker txt={k < 1 ? "SANDWICH STAND" : "BEFORE THE PIE TABLE OPENED"} />
        <div style={{ fontFamily: SERIF, fontSize: 110, color: n ? C.ink : C.red, lineHeight: 1.1 }}>{n ? n : "GONE"}</div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 22, color: C.ink }}>{n ? "BUNS LEFT" : "EVERY YEAR"}</div>
      </div>
    </Shell>
  );
};

// 31 · DE PELOTA DE TENIS A DISCO: la bola de 3½ oz que la palma aplasta hasta 3½″ de ancho
export const PressDisk: React.FC<{ t: number; a: number; out: number; press: number }> = ({ t, a, out, press }) => {
  const p = ei(t, press, press + 0.5);
  return (
    <Shell t={t} a={a} out={out} w={520} h={380} y={370}>
      <div style={{ position: "absolute", left: 22, top: 18 }}><Kicker txt="THE BAZAAR BUN" /></div>
      <div style={{ position: "absolute", left: 260 - lerp(70, 120, p), bottom: 90, width: lerp(140, 240, p), height: lerp(130, 50, p), borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #fffaf0, #efd9b2 65%, #d6b77f)", boxShadow: "0 14px 16px rgba(0,0,0,.3)" }} />
      <div style={{ position: "absolute", left: 170, bottom: lerp(260, 140, ei(t, press - 0.4, press)), width: 180, height: 90, borderRadius: "45% 45% 30% 30%", background: "radial-gradient(circle at 40% 30%, #f1c8a8, #d18f6b)", opacity: e(t, press - 0.6, press - 0.4) * (1 - e(t, press + 0.7, press + 1.0)), boxShadow: "0 10px 14px rgba(0,0,0,.3)" }} />
      <div style={{ position: "absolute", left: 30, bottom: 30, fontFamily: SANS, fontWeight: 800, fontSize: 24, color: C.ink }}>{p < 0.5 ? "3½ OZ · A TENNIS BALL" : "PRESS FLAT · 3½ INCHES"}</div>
      <svg width={520} height={380} style={{ position: "absolute", inset: 0, opacity: p }}><path d="M 140 300 L 380 300 M 140 290 L 140 310 M 380 290 L 380 310" stroke={C.wine} strokeWidth={4} /></svg>
    </Shell>
  );
};

// 32 · EL HORNO DE LEUDAR: corte del horno apagado, la lucecita, la fuente de agua caliente y los pancitos que crecen
export const ProofOven: React.FC<{ t: number; a: number; light: number; water: number; out: number }> = ({ t, a, light, water, out }) => {
  const L = e(t, light, light + 0.4), Wt = e(t, water, water + 0.5), r = ei(t, water + 0.6, water + 3);
  return (
    <Shell t={t} a={a} out={out} w={520} h={460} y={420} bg="linear-gradient(180deg,#f3f1ea,#d9d6cd)">
      <div style={{ position: "absolute", left: 40, top: 40, width: 440, height: 360, borderRadius: 16, background: "#2b2622", border: "10px solid #cfcac0", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 80% 10%, rgba(255,210,120,${0.75 * L}), rgba(255,170,60,${0.15 * L}) 60%, transparent)` }} />
        <div style={{ position: "absolute", right: 24, top: 14, width: 26, height: 26, borderRadius: "50%", background: L > 0.5 ? "#ffe39a" : "#55504a", boxShadow: L > 0.5 ? "0 0 30px #ffd36a" : "none" }} />
        <div style={{ position: "absolute", left: 20, right: 20, top: 160, height: 6, background: "#8c8780" }} />
        <div style={{ position: "absolute", left: 60, top: 160 - 46 * lerp(0.6, 1.1, r), display: "flex", gap: 12 }}>{[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ width: 54, height: 46 * lerp(0.6, 1.1, r), borderRadius: "50% 50% 20% 20%", background: "radial-gradient(circle at 35% 30%, #fff6e2, #e7cc99)" }} />)}</div>
        <div style={{ position: "absolute", left: 20, right: 20, top: 290, height: 6, background: "#8c8780" }} />
        <div style={{ position: "absolute", left: 110, top: 254, width: 200, height: 36, borderRadius: 6, background: "linear-gradient(180deg,#9fc7d8,#5d8ea3)", opacity: Wt }} />
        {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 150 + i * 50, top: 200 - ((t * 30 + i * 20) % 60), width: 14, height: 30, borderRadius: 7, background: "rgba(255,255,255,.35)", filter: "blur(4px)", opacity: Wt }} />)}
      </div>
      <div style={{ position: "absolute", left: 40, bottom: 16, fontFamily: SANS, fontWeight: 800, fontSize: 20, color: C.ink }}>OVEN OFF · LIGHT ON · HOT WATER BELOW</div>
    </Shell>
  );
};

// 33 · LA PRUEBA DEL HOYUELO: un dedo hunde la masa; lento y deja marca = listo, rápido = espera
export const DimpleTest: React.FC<{ t: number; a: number; out: number; ok: number }> = ({ t, a, out, ok }) => {
  const press = ei(t, a + 0.5, a + 1.0), back = ei(t, a + 1.1, a + 2.6);
  const depth = 40 * press * (1 - 0.6 * back);
  return (
    <Shell t={t} a={a} out={out} w={500} h={340} y={360}>
      <div style={{ position: "absolute", left: 90, top: 110, width: 320, height: 160, borderRadius: "50% 50% 40% 40%", background: "radial-gradient(circle at 40% 30%, #fffaf0, #efd9b2 65%, #d6b77f)", boxShadow: "0 14px 18px rgba(0,0,0,.3)" }}>
        <div style={{ position: "absolute", left: 130, top: 30, width: 60, height: depth, borderRadius: "0 0 30px 30px", background: "radial-gradient(circle at 50% 0%, #c9a46a, #e9d2a6)" }} />
      </div>
      <div style={{ position: "absolute", left: 210, top: lerp(-40, 80 + depth * 0.6, press) - back * 70, width: 80, height: 150, borderRadius: "40px 40px 20px 20px", background: "linear-gradient(180deg,#f1c8a8,#d79c78)", opacity: 1 - e(t, a + 2.2, a + 2.6), boxShadow: "0 10px 14px rgba(0,0,0,.25)" }} />
      <div style={{ position: "absolute", left: 24, top: 18 }}><Kicker txt="PRESS ONE GENTLY" /></div>
      <div style={{ position: "absolute", right: 24, bottom: 18, fontFamily: HAND, fontSize: 40, color: "#2f7a45", opacity: e(t, ok, ok + 0.4) }}>slow + a dimple = ready</div>
    </Shell>
  );
};
