// Muro3 (fb14b, vuelta 3 del EVALUADOR): las escenas que no llegaron a 8 en dos vueltas se cambian por dos
// piezas simples e impecables: TABLILLA (foto viva del paso + placa oscura opaca con canto azul y texto grande)
// y LISTÓN (todas las filas visibles desde el cuadro 0; la que se está diciendo se enciende).
// Mismos nombres y props que Muro.tsx → cues sin cambios. Se quedan las de Muro: GelM, CajaM, AmpollaM.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import { Photo, FONTS, CL, useOut } from "./Kit";
export * from "./Muro";

const { SERIF, SANS } = FONTS;
const C = { edge: "#3C7DD9", kick: "#E8D9A8", chalk: "#F7F3EA", red: "#FF7A5C", green: "#8FD47A", plate: "rgba(16,15,14,0.88)" };
const tsh = "0 3px 12px rgba(0,0,0,0.6)";
const sp = (f: number, d = 0) => spring({ frame: f - d, fps: 30, config: { damping: 16, mass: 0.7 } });

// ---------- TABLILLA
type TP = { src?: string; kicker?: string; title: string; sub?: string; num?: string | number; big?: number; pos?: "left" | "right" | "bottom"; kcolor?: string; dur: number; seed?: number };
export const Tablilla: React.FC<TP> = ({ src, kicker, title, sub, num, big, pos = "left", kcolor = C.kick, dur, seed = 7 }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = sp(f, 0); const p2 = sp(f, 6);
  const box: React.CSSProperties = pos === "bottom" ? { left: 110, right: 110, bottom: 80 } : { [pos]: 100, top: 160, width: 960 } as React.CSSProperties;
  const slide = pos === "bottom" ? `translateY(${(1 - p) * 60}px)` : `translateX(${(1 - p) * (pos === "left" ? -80 : 80)}px)`;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      {src ? <Photo src={src} seed={seed} dur={dur} /> : <AbsoluteFill style={{ background: "#2A2622" }} />}
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.35), rgba(0,0,0,0.08))" }} />
      <div style={{ position: "absolute", ...box, background: C.plate, borderLeft: `16px solid ${C.edge}`, borderRadius: 14, padding: "40px 54px 46px", boxShadow: "0 30px 60px rgba(0,0,0,0.55)", opacity: p, transform: slide, display: "flex", gap: 40, alignItems: "center" }}>
        {num !== undefined ? <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 220, lineHeight: 0.9, color: C.kick }}>{num}</div> : null}
        <div style={{ flex: 1 }}>
          {kicker ? <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 44, letterSpacing: 4, color: kcolor, marginBottom: 14 }}>{kicker}</div> : null}
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: big || 88, lineHeight: 1.05, color: C.chalk, textShadow: tsh }}>{title}</div>
          {sub ? <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 52, lineHeight: 1.18, color: C.kick, marginTop: 20, opacity: p2, whiteSpace: "pre-line" }}>{sub}</div> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- LISTÓN
type Row = { a: string; b?: string; f: number; mark?: "no" | "si" };
export const Liston: React.FC<{ src?: string; kicker: string; rows: Row[]; foot?: string; fFoot?: number; dur: number; seed?: number; cols?: 1 | 2 }> = ({ src, kicker, rows, foot, fFoot = 0, dur, seed = 9, cols = 1 }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = sp(f, 0);
  const cur = rows.reduce((k, r, i) => (r.f <= f ? i : k), -1);
  const size = cols === 2 ? 44 : rows.length > 5 ? 50 : 58;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      {src ? <Photo src={src} seed={seed} dur={dur} /> : <AbsoluteFill style={{ background: "#2A2622" }} />}
      <div style={{ position: "absolute", left: 110, right: 110, top: 80, bottom: 80, background: C.plate, borderTop: `14px solid ${C.edge}`, borderRadius: 18, padding: "40px 60px", boxShadow: "0 30px 60px rgba(0,0,0,0.55)", opacity: p, transform: `translateY(${(1 - p) * 40}px)`, display: "flex", flexDirection: "column" }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 46, letterSpacing: 4, color: C.kick, marginBottom: 24 }}>{kicker}</div>
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: cols === 2 ? "1fr 1fr" : "1fr", gridAutoFlow: cols === 2 ? "column" : "row", gridTemplateRows: cols === 2 ? `repeat(${Math.ceil(rows.length / 2)}, 1fr)` : undefined, alignContent: "center", columnGap: 60, rowGap: cols === 2 ? 10 : rows.length > 5 ? 14 : 22 }}>
          {rows.map((r, i) => {
            const on = i === cur; const done = i < cur; const k = interpolate(f, [r.f, r.f + 8], [0, 1], CL);
            const dot = r.mark === "no" ? "✕" : r.mark === "si" ? "✓" : String(i + 1);
            const dc = r.mark === "no" ? C.red : r.mark === "si" ? C.green : C.edge;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, opacity: cur < 0 || on ? 1 : done ? 0.8 : 0.5, transform: `translateX(${on ? 12 * k : 0}px)` }}>
                <div style={{ width: size * 1.25, height: size * 1.25, borderRadius: 10, flex: "none", border: `4px solid ${dc}`, background: on ? dc : "transparent", color: on ? "#101010" : dc, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 700, fontSize: size * 0.68 }}>{dot}</div>
                <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: size, lineHeight: 1.1, color: C.chalk, flex: 1 }}>{r.a}</div>
                {r.b ? <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: size * 0.85, color: on ? C.kick : "#D9CFB8", textAlign: "right", whiteSpace: "nowrap" }}>{r.b}</div> : null}
              </div>
            );
          })}
        </div>
        {foot ? <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 66, color: C.kick, marginTop: 18, opacity: interpolate(f, [fFoot, fFoot + 10], [0, 1], CL) }}>{foot}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

// ---------- reemplazos (mismos nombres y props que Muro.tsx)
export const LitroM: React.FC<any> = ({ big, sub, bg, dur }) => <Tablilla src={bg} kicker="LO QUE CUESTA" title={big} big={200} sub={sub} dur={dur} />;
export const BotellaM: React.FC<any> = ({ teaser, bg, dur }) => teaser
  ? <Tablilla src={bg} kicker="AL FINAL DEL VIDEO" title="Una botella y plastilina" sub="la prueba que no cuesta nada" dur={dur} />
  : <Tablilla src={bg} kicker="LA PRUEBA DE LA BOTELLA" title="Botella pegada a la pared" big={80} sub={"plastilina alrededor del pico\nagua por el agujerito"} dur={dur} />;
export const MuroIdx: React.FC<any> = ({ head, cards, dur }) => <Liston src={cards[0]?.src} kicker={head} cols={2} rows={cards.map((c: any) => ({ a: c.title, f: c.f ?? 0 }))} dur={dur} />;
export const ComentM: React.FC<any> = ({ items, bg, dur }) => <Liston src={bg} kicker="LO QUE ME ESCRIBIERON" rows={items.map((i: any) => ({ a: i.txt, b: `${i.likes} ♥`, f: i.f }))} dur={dur} />;
export const ChapM: React.FC<any> = ({ n, N, title, src, dur }) => <Tablilla src={src} kicker={`PASO ${n} DE ${N}`} num={n} title={title} pos={n % 2 ? "left" : "right"} dur={dur} seed={n * 11 + 5} />;
export const TachuelaM: React.FC<any> = ({ src, caption, dur }) => <Tablilla src={src} kicker="UN RECUERDO" title={caption} big={76} pos="bottom" dur={dur} />;
export const LupaM: React.FC<any> = ({ bg, dur }) => <Tablilla src={bg} kicker="POR DENTRO" title="Canales más finos que un pelo" big={80} sub={"el agua sube por ellos\ncomo el café en un terrón de azúcar"} dur={dur} />;
const TRES: Record<string, [string, string]> = { 1: ["Condensación", "el agua sale del aire de la habitación"], 2: ["Filtración", "el agua de afuera atraviesa la pared"], 3: ["Sube del piso", "el agua sube desde los cimientos"] };
export const TresM: React.FC<any> = ({ k, bg, dur }) => k === "si"
  ? <Liston src={bg} kicker="¿DÓNDE SIRVE EL VIDRIO LÍQUIDO?" rows={[{ a: "Condensación", b: "no: ventila", f: 0, mark: "no" }, { a: "Filtración", b: "sí", f: 10, mark: "si" }, { a: "Sube del piso", b: "sí", f: 20, mark: "si" }]} dur={dur} />
  : <Tablilla src={bg} kicker={`FORMA ${k} DE 3`} num={k} title={TRES[k][0]} sub={TRES[k][1]} pos={k % 2 ? "left" : "right"} dur={dur} seed={k * 7} />;
export const RelojM: React.FC<any> = ({ h, label, sub, bg, dur }) => <Tablilla src={bg} kicker={sub} num={h} title={`${h} horas`} sub={label.toLowerCase()} dur={dur} />;
export const PlasticoM: React.FC<any> = ({ lado, bg, dur }) => lado === "fuera"
  ? <Tablilla src={bg} kicker="GOTAS DEL LADO DE LA HABITACIÓN" kcolor={C.red} title="Es condensación" sub={"el agua venía del aire\naquí el silicato no sirve"} dur={dur} />
  : <Tablilla src={bg} kicker="GOTAS DEL LADO DE LA PARED" kcolor={C.green} title="Viene de adentro de la pared" big={80} sub={"filtración o subida\naquí sí sirve"} pos="right" dur={dur} />;
export const FichaM: React.FC<any> = ({ title, lines, bg, dur }) => <Liston src={bg} kicker={title.toUpperCase()} rows={lines.map((l: any) => ({ a: l.txt, f: l.f }))} dur={dur} />;
export const EtiqM: React.FC<any> = ({ items, foot, bg, dur }) => <Liston src={bg} kicker="PÍDELO CON CUALQUIERA DE ESTOS NOMBRES" rows={items.map((i: any) => ({ a: i.txt, f: i.f }))} foot={foot} fFoot={(items[items.length - 1]?.f || 0) + 30} dur={dur} />;
export const EstarcidoM: React.FC<any> = ({ head, items, bg, dur }) => <Liston src={bg} kicker={head} rows={items.map((i: any) => ({ a: i.txt.charAt(0) + i.txt.slice(1).toLowerCase(), f: i.f, mark: "si" }))} dur={dur} />;
export const VentanaM: React.FC<any> = ({ bg, dur }) => <Tablilla src={bg} kicker="CUIDADO CON EL VIDRIO" kcolor={C.red} title="Si se seca sobre el vidrio, lo mancha para siempre" big={72} sub="tapa la ventana antes de empezar" dur={dur} />;
export const GolpeM: React.FC<any> = ({ modo, bg, dur }) => modo === "hueco"
  ? <Tablilla src={bg} kicker="SUENA HUECO" kcolor={C.red} title="El revoque está despegado" big={80} sub="hay agua y salitre detrás" pos="right" dur={dur} />
  : <Tablilla src={bg} kicker="SUENA FIRME" kcolor={C.green} title="El revoque está sano" dur={dur} />;
export const SalitreM: React.FC<any> = ({ bg, dur }) => <Tablilla src={bg} kicker="EL POLVO BLANCO ES SALITRE" title="Se saca antes del silicato" big={80} sub={"tapa los poros\ny el líquido no entra"} dur={dur} />;
export const PalmaM: React.FC<any> = ({ bg, dur }) => <Tablilla src={bg} kicker="LA PRUEBA DE LA PALMA" title="Ni fría ni mojada" sub="y el color del revoque parejo" dur={dur} />;
export const VasosM: React.FC<any> = ({ modo, bg, dur }) => modo === "1"
  ? <Tablilla src={bg} kicker="PRIMERA MANO" title="1 : 4" big={200} sub="1 de silicato · 4 de agua" dur={dur} />
  : modo === "2"
  ? <Tablilla src={bg} kicker="SEGUNDA MANO" title="1 : 2" big={200} sub="1 de silicato · 2 de agua" pos="right" dur={dur} />
  : <Liston src={bg} kicker="POR QUÉ DOS MANOS" rows={[{ a: "La primera, aguada", b: "entra profundo", f: 0 }, { a: "La segunda, más espesa", b: "cierra los poros", f: 60 }]} dur={dur} />;
export const CotasM: React.FC<any> = ({ bg, dur }) => <Tablilla src={bg} kicker="PARED DE 4 × 2,5 m" title="10 m²" big={200} sub={"≈ 3 litros de mezcla\nen la primera mano"} dur={dur} />;
export const SubeM: React.FC<any> = ({ bg, dur }) => <Tablilla src={bg} kicker="ESTO ES IMPORTANTE" title="De abajo hacia arriba" dur={dur} />;
export const ChupaM: React.FC<any> = ({ bg, dur }) => <Tablilla src={bg} kicker="LA SEÑAL" title="Hasta que la pared deja de chupar" big={80} sub="la misma zona, una y otra vez" dur={dur} />;
export const RasanteM: React.FC<any> = ({ bg, dur }) => <Tablilla src={bg} kicker="LO QUE SOBRA AFUERA" title="Se seca como costra blanca" big={80} sub={"no deja pegar la pintura\nesponja húmeda a los 20 minutos"} dur={dur} />;
export const BidonesM: React.FC<any> = ({ bg, dur }) => <Liston src={bg} kicker="CUÁNTO SE LLEVA CADA MANO" rows={[{ a: "Primera mano", b: "1 litro", f: 0 }, { a: "Segunda mano", b: "medio litro", f: 40 }]} dur={dur} />;
export const TizaM: React.FC<any> = ({ bg, dur }) => <Tablilla src={bg} kicker="DESPUÉS DE LA ÚLTIMA MANO" title="Una semana" big={130} sub={"el gel tarda días\nen volverse cristal"} dur={dur} />;
export const RespiraM: React.FC<any> = ({ bg, dur }) => <Liston src={bg} kicker="LA PINTURA TIENE QUE DEJAR RESPIRAR" rows={[{ a: "Pintura a la cal", b: "sí", f: 0, mark: "si" }, { a: "Pintura al agua, lavable o látex", b: "sí", f: 20, mark: "si" }, { a: "Esmalte o pintura plástica", b: "no", f: 40, mark: "no" }]} dur={dur} />;
export const AñosM: React.FC<any> = ({ bg, dur }) => <Tablilla src={bg} kicker="CUÁNTO DURA" title="5 a 10 años" big={150} sub="si primero sacas la causa del agua" dur={dur} />;
export const MensajeM: React.FC<any> = ({ bg, dur }) => <Tablilla src={bg} kicker="DON ERNESTO, CADA VEZ QUE LLUEVE" title="«Seca.»" big={190} dur={dur} />;
export const CruzM: React.FC<any> = ({ k, title, sub, bg, dur }) => <Tablilla src={bg} kicker={k ? `ERROR ${k} DE 5` : "LOS 5 ERRORES"} kcolor={C.red} num={k || undefined} title={title} big={k ? 90 : 110} sub={sub} pos={k % 2 ? "right" : "left"} dur={dur} seed={k * 13 + 3} />;
export const GotasQM: React.FC<any> = ({ qs, bg, dur }) => <Liston src={bg} kicker="ME PREGUNTARON" rows={qs.map((q: any) => ({ a: q.txt, f: q.f }))} dur={dur} />;
export const SecadoM: React.FC<any> = ({ rows, foot, bg, dur }) => <Liston src={bg} kicker="LOS TIEMPOS" rows={rows.map((r: any) => ({ a: r.b.charAt(0).toUpperCase() + r.b.slice(1), b: r.a, f: r.f }))} foot={foot} fFoot={(rows[rows.length - 1]?.f || 0) + 40} dur={dur} />;
export const TicketM: React.FC<any> = ({ rows, total, fT, bg, dur }) => <Liston src={bg} kicker="LA CUENTA · PARED DE 10 m²" rows={rows.map((r: any) => ({ a: r.t, b: r.v, f: r.f }))} foot={total ? `Total: ${total}` : undefined} fFoot={fT || 0} dur={dur} />;
export const PromesaM: React.FC<any> = ({ src, title, sub, dur }) => <Tablilla src={src} kicker={sub} title={title} big={110} dur={dur} />;
export const NivelM: React.FC<any> = ({ bg, dur }) => <Tablilla src={bg} kicker="A LOS 10 MINUTOS" title="Marcas dónde quedó el agua" big={80} sub="cuánto bajó = cuánto chupa la pared" dur={dur} />;
export const DosBotM: React.FC<any> = ({ bg, dur }) => <Liston src={bg} kicker="LA PARED DE DON ERNESTO · 10 MINUTOS" rows={[{ a: "Antes del silicato", b: "casi vacía", f: 0, mark: "no" }, { a: "Después", b: "casi llena", f: 60, mark: "si" }]} dur={dur} />;
export const PreciosM: React.FC<any> = ({ bg, dur }) => <Liston src={bg} kicker="LA MISMA PRUEBA" rows={[{ a: "Tubo de Karsten, de ingeniero", b: "$100", f: 0, mark: "no" }, { a: "Botella y plastilina", b: "≈ $0", f: 60, mark: "si" }]} dur={dur} />;
export const VotoM: React.FC<any> = ({ opts, bg, dur }) => <Liston src={bg} kicker="¿DÓNDE LLORA TU PARED?" rows={opts.map((t: string, i: number) => ({ a: t, f: 2 + i * 8 }))} foot="Cuéntamelo en los comentarios" fFoot={40} dur={dur} />;

// ---------- la lámina entera, sin zoom (no corta texto); un marco amarillo recorre las zonas que él nombra
export const LaminaM: React.FC<any> = ({ src, focus, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = sp(f, 0);
  const seq = focus.slice(0, -1); const endF = focus[focus.length - 1]?.f ?? 1e9;
  let i = -1; seq.forEach((q: any, k: number) => { if (q.f <= f) i = k; });
  const a = seq[Math.max(0, i - 1)], b = seq[Math.max(0, i)];
  const t = i < 0 ? 0 : interpolate(f, [b.f, b.f + 16], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const x = i <= 0 ? (b ? b.x : 50) : a.x + (b.x - a.x) * t, y = i <= 0 ? (b ? b.y : 50) : a.y + (b.y - a.y) * t;
  const ring = i < 0 ? 0 : (i === 0 ? t : 1) * interpolate(f, [endF, endF + 10], [1, 0], CL);
  const drift = 1 + 0.03 * (f / Math.max(1, dur));
  return (
    <AbsoluteFill style={{ opacity: o, background: "linear-gradient(180deg,#3A3631,#211E1A)" }}>
      <div style={{ position: "absolute", left: 120, top: 30, width: 1680, height: 1020, background: "#FBF8F0", padding: 10, boxShadow: "0 40px 80px rgba(0,0,0,0.6)", opacity: p, transform: `translateY(${(1 - p) * 60}px) scale(${drift})` }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
      <AbsoluteFill style={{ background: "rgba(10,8,6,0.45)", opacity: ring, clipPath: `polygon(evenodd, 0 0,100% 0,100% 100%,0 100%,0 0, ${x - 15}% ${y - 17}%, ${x - 15}% ${y + 17}%, ${x + 15}% ${y + 17}%, ${x + 15}% ${y - 17}%, ${x - 15}% ${y - 17}%)` }} />
      <div style={{ position: "absolute", left: `${x - 15}%`, top: `${y - 17}%`, width: "30%", height: "34%", border: `8px solid ${C.edge}`, borderRadius: 16, boxShadow: "0 0 30px rgba(60,125,217,0.5)", opacity: ring }} />
    </AbsoluteFill>
  );
};
