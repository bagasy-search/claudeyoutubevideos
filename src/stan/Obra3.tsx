// Obra3 (fb14a, vuelta 3 del EVALUADOR): lo que no llegó a 8 se reemplaza por dos piezas simples e impecables
// (precedente fb14e): PLACA grande sobre la foto viva del paso, y PIZARRA con todas las filas visibles
// desde el cuadro 0 que marca la que se está diciendo. Mismos nombres y props que Obra.tsx → cues sin cambios.
import React from "react";
import { AbsoluteFill, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import { Photo, FONTS, CL, useOut } from "./Kit";
import * as Ob from "./Obra";
export * from "./Obra";

const { SERIF, SANS } = FONTS;
const C = { tape: "#F2C230", chalk: "#F7F3EA", red: "#FF7A5C", green: "#9BE07A", plate: "rgba(14,12,10,0.86)" };
const tsh = "0 3px 12px rgba(0,0,0,0.6)";
const sp = (f: number, d = 0) => spring({ frame: f - d, fps: 30, config: { damping: 16, mass: 0.7 } });

// ---------- PLACA: foto viva a pantalla completa + placa oscura opaca con texto grande
type PlacaP = { src: string; kicker?: string; title: string; sub?: string; num?: string | number; big?: number; pos?: "left" | "right" | "bottom" | "center"; kcolor?: string; dur: number; seed?: number };
export const Placa: React.FC<PlacaP> = ({ src, kicker, title, sub, num, big, pos = "left", kcolor = C.tape, dur, seed = 7 }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = sp(f, 0); const p2 = sp(f, 5);
  const box: React.CSSProperties = pos === "bottom" ? { left: 110, right: 110, bottom: 80 } : pos === "center" ? { left: 260, right: 260, top: "50%", transform: `translateY(-50%) scale(${0.96 + 0.04 * p})` } : { [pos]: 100, top: 150, width: 900 } as React.CSSProperties;
  const slide = pos === "bottom" ? `translateY(${(1 - p) * 60}px)` : pos === "center" ? "" : `translateX(${(1 - p) * (pos === "left" ? -80 : 80)}px)`;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Photo src={src} seed={seed} dur={dur} />
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.35), rgba(0,0,0,0.1))" }} />
      <div style={{ position: "absolute", ...box, background: C.plate, borderRadius: 22, padding: "40px 52px 46px", boxShadow: "0 30px 60px rgba(0,0,0,0.55)", opacity: p, transform: `${box.transform || ""} ${slide}`, display: "flex", gap: 40, alignItems: "center" }}>
        {num !== undefined ? <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 230, lineHeight: 0.9, color: C.tape }}>{num}</div> : null}
        <div style={{ flex: 1 }}>
          {kicker ? <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 46, letterSpacing: 4, color: kcolor, marginBottom: 14 }}>{kicker}</div> : null}
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: big || 92, lineHeight: 1.04, color: C.chalk, textShadow: tsh }}>{title}</div>
          {sub ? <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 54, lineHeight: 1.15, color: C.tape, marginTop: 20, opacity: p2, whiteSpace: "pre-line" }}>{sub}</div> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- PIZARRA: todas las filas visibles desde el inicio; la que se dice se enciende
type Row = { a: string; b?: string; f: number; mark?: "no" | "si" };
export const Pizarra: React.FC<{ src: string; kicker: string; rows: Row[]; foot?: string; fFoot?: number; dur: number; seed?: number }> = ({ src, kicker, rows, foot, fFoot = 0, dur, seed = 9 }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = sp(f, 0);
  const cur = rows.reduce((k, r, i) => (r.f <= f ? i : k), -1);
  const size = rows.length > 5 ? 50 : 60;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Photo src={src} seed={seed} dur={dur} />
      <div style={{ position: "absolute", left: 120, right: 120, top: 90, bottom: 90, background: C.plate, borderRadius: 24, padding: "44px 64px", boxShadow: "0 30px 60px rgba(0,0,0,0.55)", opacity: p, transform: `translateY(${(1 - p) * 40}px)`, display: "flex", flexDirection: "column" }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 48, letterSpacing: 4, color: C.tape, marginBottom: 26 }}>{kicker}</div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: rows.length > 5 ? 14 : 22 }}>
          {rows.map((r, i) => {
            const on = i === cur; const done = i < cur; const k = interpolate(f, [r.f, r.f + 8], [0, 1], CL);
            const dot = r.mark === "no" ? "✕" : r.mark === "si" ? "✓" : String(i + 1);
            const dc = r.mark === "no" ? C.red : r.mark === "si" ? C.green : C.tape;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 30, opacity: on ? 1 : done ? 0.85 : 0.45, transform: `translateX(${on ? 14 * k : 0}px)` }}>
                <div style={{ width: size * 1.25, height: size * 1.25, borderRadius: "50%", flex: "none", border: `4px solid ${dc}`, background: on ? dc : "transparent", color: on ? "#14110D" : dc, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 700, fontSize: size * 0.7 }}>{dot}</div>
                <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: size, lineHeight: 1.1, color: C.chalk, flex: 1 }}>{r.a}</div>
                {r.b ? <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: size * 0.85, color: on ? C.tape : "#D9CFB8", textAlign: "right" }}>{r.b}</div> : null}
              </div>
            );
          })}
        </div>
        {foot ? <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 70, color: C.tape, marginTop: 20, opacity: interpolate(f, [fFoot, fFoot + 10], [0, 1], CL) }}>{foot}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

// ---------- reemplazos con los mismos nombres
export const ChapO: React.FC<any> = ({ n, N, title, src, dur }) => <Placa src={src} kicker={`PASO ${n} DE ${N}`} num={n} title={title} pos={n % 2 ? "left" : "right"} dur={dur} seed={n * 11 + 5} />;
export const CarruselO: React.FC<any> = ({ head, cards, bg, recap, dur }) => {
  const f = useCurrentFrame();
  if (!recap) return <Placa src={bg} kicker="LAJAS QUE PARECEN PIEDRA" title="12 pasos" big={150} sub={"te los voy contando
uno por uno"} pos="left" dur={dur} />;
  const first = cards[0].f ?? 0;
  if (f < first) return <Placa src={bg} kicker="REPASO" title="Los 12 pasos" big={130} pos="left" dur={first + 8} />;
  const cur = Math.max(0, cards.filter((c: any) => (c.f ?? 0) <= f).length - 1); const c = cards[cur];
  const start = c.f ?? 0; const end = cur + 1 < cards.length ? cards[cur + 1].f : dur;
  return <Sequence from={start} durationInFrames={Math.max(1, end - start)}><Placa src={c.src} kicker={`REPASO · PASO ${c.n} DE 12`} title={c.title} big={80} sub={c.txt} pos="bottom" dur={cur + 1 < cards.length ? end - start + 999 : end - start} seed={c.n * 5} /></Sequence>;
};
export const DedoO: React.FC<any> = ({ big, sub, bg, dur }) => <Placa src={bg} kicker="CADA LAJA" title={big} big={230} sub={sub} pos="left" dur={dur} />;
export const SobreO: React.FC<any> = ({ src, caption, dur }) => <Placa src={src} kicker="UN RECUERDO" title={caption} big={76} pos="bottom" dur={dur} />;
export const TendederoO: React.FC<any> = ({ src, caption, dur }) => <Placa src={src} kicker="UN RECUERDO" title={caption} big={76} pos="bottom" dur={dur} />;
export const EstudioO: React.FC<any> = ({ title, lines, bg, dur }) => <Pizarra src={bg} kicker={"ESTUDIO REAL · " + title.split(":")[0]} rows={lines.map((l: any) => ({ a: l.txt, f: l.f, mark: "si" }))} dur={dur} />;
const PROB: any = { dosis: ["LA DOSIS", "30 ml cada 5 kg", "2 cucharadas · ni una más"], max: ["EL TOPE", "50 ml cada 5 kg", "más aceite: suda y pierde fuerza"], pedido: ["LO QUE NECESITAS", "Un bidón de 2 litros", "alcanza para todo un verano de lajas"] };
export const ProbetaO: React.FC<any> = ({ mode, bg, dur }) => <Placa src={bg} kicker={PROB[mode][0]} kcolor={mode === "max" ? C.red : C.tape} title={PROB[mode][1]} big={108} sub={PROB[mode][2]} pos="right" dur={dur} />;
export const TablasNoO: React.FC<any> = ({ items, si, bg, dur }) => <Pizarra src={bg} kicker="DÓNDE NO VA" rows={[...items.map((i: any) => ({ a: i.txt, f: i.f, mark: "no" })), { a: si.txt, f: si.f, mark: "si" }]} dur={dur} />;
export const VuelveO: React.FC<any> = ({ bg, dur }) => <Pizarra src={bg} kicker="EL ACEITE QUE SOBRA" rows={[{ a: "Nunca a la tierra", f: 8, mark: "no" }, { a: "Nunca al desagüe", f: 22, mark: "no" }, { a: "Vuelve al taller, en el mismo bidón", f: 60, mark: "si" }]} dur={dur} />;
export const CintaO: React.FC<any> = ({ marks, bg, dur }) => <Placa src={bg} kicker="EL MOLDE" title="40 × 40 cm" big={150} sub={"4 cm de espesor\nla levantas sola · no se parte"} pos="left" dur={dur} />;
export const BaldesO: React.FC<any> = ({ bg, dur }) => <Placa src={bg} kicker="LA MEZCLA BASE" title="1 : 2½" big={190} sub={"1 de cemento · 2½ de arena fina\nla de revocar, no la gruesa"} pos="left" dur={dur} />;
export const CorteO: React.FC<any> = ({ stage, bg, dur }) => stage === 1
  ? <Placa src={bg} kicker="DOSIS CHICA" kcolor={C.green} title="Gotitas sueltas, rodeadas de cemento" sub="la resistencia casi no cambia" pos="right" dur={dur} />
  : <Placa src={bg} kicker="EL DOBLE" kcolor={C.red} title="Las gotas se tocan y hacen canales" sub="suda al sol · pierde fuerza" pos="right" dur={dur} />;
export const VueltasO: React.FC<any> = ({ mal, bg, dur }) => mal
  ? <Placa src={bg} kicker="MEZCLAR DE MÁS" kcolor={C.red} title="Con 10 vueltas, las vetas desaparecen" pos="left" dur={dur} />
  : <Placa src={bg} kicker="LAS VETAS" title="3 vueltas, y paras" big={120} sub="con más, el aceite se pierde en la mezcla" pos="left" dur={dur} />;
export const CuraO: React.FC<any> = ({ bg, dur }) => <Pizarra src={bg} kicker="EL CEMENTO NO SE SECA: SE CURA" rows={[{ a: "Al sol, destapada", b: "se raja", f: 4, mark: "no" }, { a: "Tapada, a la sombra", b: "entera", f: 30, mark: "si" }]} dur={dur} />;
export const SieteO: React.FC<any> = ({ bg, dur }) => <Placa src={bg} kicker="EL CURADO" title="7 días tapada" big={130} sub="agua una vez por día" pos="left" dur={dur} />;
export const RodilloO: React.FC<any> = ({ a, lines, dur }) => <Pizarra src={a} kicker="EL SELLADOR" rows={lines.map((l: any) => ({ a: l.txt, f: l.f }))} dur={dur} />;
export const BarrioO: React.FC<any> = ({ dur }) => <Pizarra src="fb14a/g/albsendero.png" kicker="DONDE PASÓ TODO" rows={[{ a: "El taller del tío Rubén", b: "1989", f: 6 }, { a: "Mi casa", b: "el taller del patio", f: 26 }, { a: "La casa de Marta", b: "9 m · 18 lajas", f: 44 }]} dur={dur} />;
export const CapasO: React.FC<any> = ({ bg, dur }) => <Pizarra src={bg} kicker="CÓMO SE ASIENTA" rows={[{ a: "Tierra firme", f: 4 }, { a: "4 cm de arena gruesa, apisonada", f: 22 }, { a: "La laja: 4 cm", f: 40 }, { a: "1 cm por encima del pasto", f: 56, mark: "si" }]} dur={dur} />;
export const RajaO: React.FC<any> = ({ k, title, sub, bg, dur }) => <Placa src={bg} kicker={k ? `ERROR ${k} DE 5` : "LOS 5 ERRORES"} kcolor={C.red} num={k || undefined} title={title} big={k ? 96 : 120} sub={sub ? sub.replace(" · ", "\n") : undefined} pos="left" dur={dur} seed={k * 7 + 3} />;
export const CintasO: React.FC<any> = ({ qs, dur }) => <Pizarra src="fb14a/g/kit.png" kicker="ME PREGUNTARON" rows={qs.map((q: any) => ({ a: q.txt, f: q.f }))} dur={dur} />;
export const MetroO: React.FC<any> = ({ rows, foot, bg, dur }) => <Pizarra src={bg} kicker="LOS TIEMPOS" rows={rows.map((r: any) => ({ a: r.b.charAt(0).toUpperCase() + r.b.slice(1), b: r.a, f: r.f }))} foot={foot} fFoot={rows[rows.length - 1].f + 24} dur={dur} />;
export const CuentaO: React.FC<any> = ({ rows, total, fT, bg, dur }) => <Pizarra src={bg} kicker="LA CUENTA · 6 LAJAS DE 40 × 40" rows={rows.map((r: any) => ({ a: r.t, b: r.v, f: r.f }))} foot={total || undefined} fFoot={Math.max(fT, rows[rows.length - 1].f + 10)} dur={dur} />;
export const PremioO: React.FC<any> = ({ src, title, sub, dur }) => <Placa src={src} kicker={sub} title={title} big={150} pos="left" dur={dur} />;
export const UnaO: React.FC<any> = ({ fA, fB, bg, dur }) => <Pizarra src={bg} kicker="LA PRUEBA DE LA UÑA · ENTRE 18 Y 24 H" rows={[{ a: "La uña marca un surco", b: "espera", f: Math.min(fA, 2), mark: "no" }, { a: "No marca y suelta arena", b: "es el momento", f: fB, mark: "si" }]} dur={dur} />;
export const EligeO: React.FC<any> = ({ opts, bg, dur }) => <Pizarra src={bg} kicker="¿QUÉ HARÍAS CON LA PRIMERA LAJA?" rows={opts.map((t: string, i: number) => ({ a: t, f: 2 + i * 8 }))} foot="Cuéntamelo en los comentarios" fFoot={40} dur={dur} />;

// ---------- la lámina entera, sin zoom (no corta texto); un marco amarillo va a la zona que él nombra
export const LaminaO: React.FC<any> = ({ src, focus, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = sp(f, 0);
  const seq = focus.filter((q: any) => q.z > 1.05);
  let i = -1; seq.forEach((q: any, k: number) => { if (q.f <= f) i = k; });
  const endF = (focus.find((q: any) => q.z <= 1.05) || { f: 1e9 }).f;
  const a = seq[Math.max(0, i - 1)], b = seq[Math.max(0, i)];
  const t = i < 0 ? 0 : interpolate(f, [b.f, b.f + 16], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const x = i <= 0 ? (b ? b.x : 50) : a.x + (b.x - a.x) * t, y = i <= 0 ? (b ? b.y : 50) : a.y + (b.y - a.y) * t;
  const ring = i < 0 ? 0 : (i === 0 ? t : 1) * interpolate(f, [endF, endF + 10], [1, 0], CL);
  return (
    <AbsoluteFill style={{ opacity: o, background: "linear-gradient(180deg,#4A3420,#2E1F10)" }}>
      <div style={{ position: "absolute", left: 120, top: 30, width: 1680, height: 1020, background: "#FBF8F0", padding: 10, boxShadow: "0 40px 80px rgba(0,0,0,0.6)", opacity: p, transform: `translateY(${(1 - p) * 60}px)` }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
      <AbsoluteFill style={{ background: "rgba(10,8,6,0.45)", opacity: ring, clipPath: `polygon(evenodd, 0 0,100% 0,100% 100%,0 100%,0 0, ${x - 15}% ${y - 17}%, ${x - 15}% ${y + 17}%, ${x + 15}% ${y + 17}%, ${x + 15}% ${y - 17}%, ${x - 15}% ${y - 17}%)` }} />
      <div style={{ position: "absolute", left: `${x - 15}%`, top: `${y - 17}%`, width: "30%", height: "34%", border: `8px solid ${C.tape}`, borderRadius: 16, boxShadow: "0 0 30px rgba(242,194,48,0.5)", opacity: ring }} />
    </AbsoluteFill>
  );
};
