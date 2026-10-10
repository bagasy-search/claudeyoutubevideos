// KIT GENÉRICO DE LA FÁBRICA (rama fab-render). Componentes de calidad "editor" que sirven para CUALQUIER tema:
// el modelo que arma el video NO programa componentes, sólo elige uno de acá y llena sus props en vlog/<slug>/ov.json.
// Reglas de todos (las mismas de mis kits ClCasa5/ClMoscas):
//   · viven DENTRO del mundo: la cama (bed) es un trozo del propio vlog, encima papel/polaroids/cinta con sombra y la luz de la escena;
//   · movimiento continuo (acercamiento, deriva, cosas que entran de a una): nada quieto más de 2,5 s;
//   · lo específico del tema lo ponen las FOTOS del propio video (`img`: id de un plano → public/img/<slug>/<id>.png),
//     así un mismo componente sirve para moscas, sarro o una gotera sin dibujar nada nuevo;
//   · los textos se achican solos para entrar (fit) y el linter de vlog/fab/editor.py limita cuántos caracteres van en cada prop.
// Catálogo con cuándo usar cada uno y ejemplos: vlog/fab/KIT.md
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, clamp01, ease, hexA, rnd } from "../claudio/ClTheme";
import { Bed, Card, Contact, RoomLight, Tape, lin, pop, useOut } from "../claudio/ClParts";
import { Roach } from "../claudio/ClFumigador";
import { Mouse } from "../claudio/ClRaton";
import META from "./data/meta.json";

const SLUG: string = (META as any).slug;
// idioma del canal (meta.json "lang": "es" | "en"): los rótulos fijos del kit salen en ese idioma
const EN = (META as any).lang === "en";
export const tr = (es: string, en: string) => (EN ? en : es);
// "s012" → foto del plano; "img/x.jpg" → archivo de public tal cual
export const imgSrc = (k?: string) => (!k ? undefined : k.includes("/") ? k : `img/${SLUG}/${k}.png`);

// ancho aproximado de un texto (por familia) para achicar la letra hasta que entre en `maxW`
const K: Record<string, number> = { label: 0.5, serif: 0.56, hand: 0.42 };
export const fit = (t: string, maxW: number, base: number, fam: "label" | "serif" | "hand" = "label", min = 22) =>
  Math.max(min, Math.min(base, maxW / Math.max(1, (t || "").length * K[fam])));

// ── piezas ─────────────────────────────────────────────────────────────────────────────────────────────────
// polaroid de una foto del propio video, con cinta y pie escrito a mano; `mark` = ✓ verde / ✗ rojo dibujado encima
export const Polaroid: React.FC<{ img?: string; x: number; y: number; w: number; rot?: number; cap?: string; o?: number; s?: number; mark?: "si" | "no"; markK?: number; seed?: number; dim?: number }> =
  ({ img, x, y, w, rot = 0, cap, o = 1, s = 1, mark, markK = 0, seed = 1, dim = 0 }) => {
    const f = useCurrentFrame();
    const h = w * 0.75, pad = w * 0.045, capH = cap ? w * 0.2 : pad * 2.2;
    const drift = Math.sin(f / 40 + seed) * 0.8;
    const src = imgSrc(img);
    return (
      <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", rotate: `${rot + drift}deg`, scale: String(s), opacity: o }}>
        <div style={{ background: "#FFFFFF", padding: `${pad}px ${pad}px ${capH}px`, borderRadius: 6, boxShadow: `0 30px 55px ${CL.shadow}, 0 4px 10px rgba(0,0,0,0.16)` }}>
          <div style={{ position: "relative", width: w, height: h, overflow: "hidden", borderRadius: 3, background: "#DDD6C8" }}>
            {src ? <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(1.04 + 0.04 * Math.sin(f / 60 + seed)) }} /> : null}
            {dim > 0 ? <div style={{ position: "absolute", inset: 0, background: `rgba(255,255,255,${dim})` }} /> : null}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(255,240,210,0.16), rgba(0,0,0,0) 40%, rgba(19,29,53,0.18))" }} />
          </div>
          {cap ? <div style={{ position: "absolute", left: 0, right: 0, bottom: capH * 0.16, textAlign: "center", fontFamily: HAND, fontWeight: 700, color: CL.ink, fontSize: fit(cap, w * 0.96, w * 0.105, "hand"), lineHeight: 1 }}>{cap}</div> : null}
        </div>
        <Tape x={w / 2 - 60} y={-18} rot={-5 + 8 * rnd(seed)} w={140} />
        {mark ? <Mark kind={mark} k={markK} size={w * 0.5} x={w * 0.84} y={w * 0.12} /> : null}
      </div>
    );
  };
// ✓ / ✗ trazado a mano con fibrón (k = cuánto ya se dibujó)
const Mark: React.FC<{ kind: "si" | "no"; k: number; size: number; x: number; y: number }> = ({ kind, k, size, x, y }) => {
  const c = kind === "si" ? CL.nitrile : CL.red;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", left: x - size / 2, top: y - size / 2, overflow: "visible", filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.25))" }}>
      <circle cx={50} cy={50} r={44} fill="rgba(255,255,255,0.92)" opacity={clamp01(k * 3)} />
      {kind === "si"
        ? <path d="M24 52 L43 70 L78 30" fill="none" stroke={c} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={90} strokeDashoffset={90 * (1 - ease(k))} />
        : <g stroke={c} strokeWidth={13} strokeLinecap="round"><path d="M28 28 L72 72" strokeDasharray={63} strokeDashoffset={63 * (1 - ease(clamp01(k * 2)))} /><path d="M72 28 L28 72" strokeDasharray={63} strokeDashoffset={63 * (1 - ease(clamp01(k * 2 - 1)))} /></g>}
    </svg>
  );
};
// rótulo (franja verde con borde amarillo) y nota de Claudio pegada con cinta
export const Tag: React.FC<{ x: number; y: number; text: string; color?: string; o?: number; size?: number; maxW?: number }> = ({ x, y, text, color = CL.navy, o = 1, size = 40, maxW = 900 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translateY(${(1 - o) * 12}px)`, background: color, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: fit(text, maxW, size, "label"), letterSpacing: 2, padding: "6px 20px", borderRadius: 10, whiteSpace: "nowrap", boxShadow: `0 12px 26px ${CL.shadow}`, borderBottom: `5px solid ${CL.yellow}`, textTransform: "uppercase" }}>{text}</div>
);
export const Note: React.FC<{ x: number; y: number; o: number; big: string; small?: string; rot?: number; color?: string; maxW?: number }> = ({ x, y, o, big, small, rot = -1.4, color = CL.navy, maxW = 760 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translateY(${(1 - o) * 16}px) rotate(${rot}deg)`, maxWidth: maxW + 60 }}>
    <Card style={{ padding: "10px 28px 12px", borderBottom: `6px solid ${color}` }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fit(big, maxW, 52, "serif", 30), color: CL.ink, lineHeight: 1.04, whiteSpace: "nowrap" }}>{big}</div>
      {small ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: fit(small, maxW, 44, "hand", 28), color, lineHeight: 1.05, whiteSpace: "nowrap" }}>{small}</div> : null}
    </Card>
    <Tape x={50} y={-16} rot={-7} w={150} />
  </div>
);
// escena base: cama + acercamiento continuo de todo lo de encima + luz de la escena + salida suave
const Scene: React.FC<{ bed?: string; seed: number; dim?: number; children: React.ReactNode; over?: React.ReactNode }> = ({ bed, seed, dim = 0.3, children, over }) => {
  const f = useCurrentFrame(); const { durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const push = 1 + 0.045 * (f / Math.max(1, T));
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={seed} dim={dim} />
      <AbsoluteFill style={{ scale: String(push), transformOrigin: "50% 55%" }}>{children}</AbsoluteFill>
      <RoomLight k={0.45} />
      {over}
    </AbsoluteFill>
  );
};
// momento en que entra el elemento i de n (repartidos en la primera ~60 % del componente)
const turno = (i: number, n: number, T: number, a = 8, frac = 0.6) => a + (n <= 1 ? 0 : (i * (T * frac - a)) / (n - 1));

// ── 1. FabSiNo: lo que NO y lo que SÍ (dos fotos del video, ✗ rojo y ✓ verde trazados) ──────────────────────
export const FabSiNo: React.FC<{ no: { img: string; txt: string }; si: { img: string; txt: string }; title?: string; bed?: string }> = ({ no, si, title, bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig();
  const pa = pop(f, fps, 3, 13), pb = pop(f, fps, 3 + Math.round(T * 0.22), 13);
  const ka = clamp01((f - 16) / 14), kb = clamp01((f - 16 - Math.round(T * 0.22)) / 14);
  return (
    <Scene bed={bed} seed={11} dim={0.34}>
      <Polaroid img={no.img} x={600} y={560} w={640} rot={-4} cap={no.txt} s={0.7 + 0.3 * pa} o={clamp01(pa * 1.5)} mark="no" markK={ka} seed={2} dim={0.08 * kb} />
      <Polaroid img={si.img} x={1330} y={540} w={640} rot={3} cap={si.txt} s={0.7 + 0.3 * pb} o={clamp01(pb * 1.5)} mark="si" markK={kb} seed={5} />
      {title ? <Tag x={110} y={70} text={title} o={lin(f, 6, 18)} /> : null}
    </Scene>
  );
};

// ── 2. FabPasos: 2-4 pasos en fotos del video, numerados, que entran de a uno con la flecha que los une ─────
export const FabPasos: React.FC<{ title?: string; pasos: { img: string; txt: string }[]; bed?: string }> = ({ title, pasos, bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig();
  const n = Math.min(4, pasos.length), w = n === 2 ? 640 : n === 3 ? 500 : 390, gap = (1920 - 160) / n;
  const xs = pasos.slice(0, n).map((_, i) => 80 + gap * (i + 0.5)), y = 590;
  const act = Math.max(0, pasos.findIndex((_, i) => f < turno(i + 1, n, T, 8, 0.5))); // el que se está explicando
  return (
    <Scene bed={bed} seed={23} dim={0.36}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {xs.slice(0, -1).map((x, i) => {
          const t0 = turno(i + 1, n, T, 8, 0.5) - 8, k = ease(clamp01((f - t0) / 10)), x1 = x + w * 0.42, x2 = xs[i + 1] - w * 0.42;
          return <path key={i} d={`M${x1} ${y - 40} Q ${(x1 + x2) / 2} ${y - 150} ${x2 - 10} ${y - 50}`} stroke={CL.yellow} strokeWidth={9} fill="none" strokeLinecap="round" strokeDasharray="22 16" strokeDashoffset={(1 - k) * 400 - f * 1.5} opacity={k} />;
        })}
      </svg>
      {pasos.slice(0, n).map((p, i) => {
        const t = turno(i, n, T, 6, 0.5), pp = pop(f, fps, t, 13), on = i === (act < 0 ? n - 1 : act) || f > T * 0.7;
        return (
          <React.Fragment key={i}>
            <Polaroid img={p.img} x={xs[i]} y={y} w={w} rot={(i % 2 ? 2.5 : -2.5)} cap={p.txt} s={(0.75 + 0.25 * pp) * (on ? 1.04 : 0.97)} o={clamp01(pp * 1.6)} seed={i + 3} dim={on ? 0 : 0.12} />
            <div style={{ position: "absolute", left: xs[i] - w / 2 - 10, top: y - w * 0.375 - 60, width: 96, height: 96, borderRadius: 48, background: on ? CL.navy : CL.inkSoft, color: "#fff", fontFamily: SERIF, fontWeight: 900, fontSize: 60, display: "flex", alignItems: "center", justifyContent: "center", border: `6px solid ${CL.yellow}`, boxShadow: `0 10px 20px ${CL.shadow}`, opacity: clamp01(pp * 1.6), scale: String(0.6 + 0.4 * pp) }}>{i + 1}</div>
          </React.Fragment>
        );
      })}
      {title ? <Tag x={110} y={60} text={title} o={lin(f, 4, 16)} /> : null}
    </Scene>
  );
};

// ── 3. FabDato: EL número que hay que recordar, en una etiqueta de cartón colgada de un hilo (+ foto opcional) ─
export const FabDato: React.FC<{ num: string; unidad?: string; txt?: string; img?: string; alerta?: boolean; bed?: string }> = ({ num, unidad, txt, img, alerta, bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig();
  const p = pop(f, fps, 3, 10), swing = Math.sin(f / 22) * 3.2 * (0.4 + 0.6 * (1 - p * 0.5));
  const n = parseFloat(num.replace(",", ".")), isN = /^\d+([.,]\d+)?$/.test(num.trim());
  const shown = isN ? (Number.isInteger(n) ? String(Math.round(n * ease(clamp01((f - 6) / 22)))) : (n * ease(clamp01((f - 6) / 22))).toFixed(1).replace(".", ",")) : num;
  const col = alerta ? CL.red : CL.navy, cx = img ? 1240 : 960;
  return (
    <Scene bed={bed} seed={37} dim={0.34}>
      {img ? <Polaroid img={img} x={560} y={560} w={600} rot={-3.5} o={clamp01(pop(f, fps, 10, 13) * 1.6)} s={0.8 + 0.2 * pop(f, fps, 10, 13)} seed={9} /> : null}
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <line x1={cx} y1={-10} x2={cx + Math.sin(swing / 57) * 200} y2={196} stroke="#8A7350" strokeWidth={4} />
      </svg>
      <div style={{ position: "absolute", left: cx, top: 190, transformOrigin: "50% 0", rotate: `${swing}deg`, translate: "-50% 0", scale: String(0.7 + 0.3 * p), opacity: clamp01(p * 1.6) }}>
        <div style={{ position: "relative", width: 640, padding: "86px 40px 44px", background: "linear-gradient(170deg, #F3E5C4, #E3CFA0)", clipPath: "polygon(18% 0, 82% 0, 100% 12%, 100% 100%, 0 100%, 0 12%)", boxShadow: `0 30px 60px ${CL.shadow}`, textAlign: "center" }}>
          <div style={{ position: "absolute", left: "50%", top: 22, width: 34, height: 34, borderRadius: 17, translate: "-50% 0", background: "#7C6A40", boxShadow: "inset 0 3px 4px rgba(0,0,0,0.5)" }} />
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fit(shown, 560, 260, "serif", 110), color: col, lineHeight: 0.95 }}>{shown}</div>
          {unidad ? <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: fit(unidad, 560, 70, "label", 34), color: CL.ink, letterSpacing: 4, textTransform: "uppercase" }}>{unidad}</div> : null}
          {txt ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: fit(txt, 560, 54, "hand", 30), color: CL.inkSoft, marginTop: 10, opacity: lin(f, 20, 32) }}>{txt}</div> : null}
        </div>
      </div>
    </Scene>
  );
};

// ── 4. FabAltura: cinta métrica en la pared con marcas de altura que se van poniendo (dónde va algo, hasta dónde) ─
export const FabAltura: React.FC<{ title?: string; max?: number; marcas: { cm: number; txt: string; alerta?: boolean }[]; bed?: string }> = ({ title, max = 200, marcas, bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig();
  const top = 120, bot = 960, X = 700, yOf = (cm: number) => bot - (cm / max) * (bot - top);
  const pt = pop(f, fps, 2, 14);
  const ms = [...marcas].slice(0, 4).sort((a, b) => a.cm - b.cm);
  return (
    <Scene bed={bed} seed={41} dim={0.4}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <line x1={300} y1={bot} x2={1620} y2={bot} stroke={CL.ink} strokeWidth={6} opacity={0.5} />
        <text x={310} y={bot + 50} fontFamily={LABEL} fontSize={34} fill={CL.ink} letterSpacing={3} opacity={0.75}>{tr("PISO", "FLOOR")}</text>
        <g transform={`translate(${X} 0) scale(1 ${0.2 + 0.8 * pt})`} style={{ transformOrigin: `0px ${bot}px` }}>
          <rect x={-46} y={top - 20} width={92} height={bot - top + 20} fill="#F2C230" stroke="#9A7A10" strokeWidth={4} rx={6} />
          {Array.from({ length: Math.floor(max / 10) + 1 }, (_, i) => {
            const cm = i * 10, yy = yOf(cm), big = cm % 50 === 0;
            return <g key={i}><line x1={-46} y1={yy} x2={big ? 6 : -16} y2={yy} stroke="#3A2E08" strokeWidth={big ? 4 : 2.4} />{big ? <text x={12} y={yy + 12} fontFamily={LABEL} fontWeight={700} fontSize={32} fill="#3A2E08">{cm}</text> : null}</g>;
          })}
        </g>
      </svg>
      {ms.map((m, i) => {
        const t = turno(i, ms.length, T, 14, 0.6), k = ease(clamp01((f - t) / 14)), yy = yOf(m.cm), col = m.alerta ? CL.red : CL.navy;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: X - 70, top: yy - 4, width: (1580 - X + 70) * k, height: 8, background: col, boxShadow: `0 4px 10px ${CL.shadow}`, borderRadius: 4 }} />
            <div style={{ position: "absolute", left: X + 90, top: yy - 82, opacity: k, transform: `translateX(${(1 - k) * 40}px)`, display: "flex", alignItems: "baseline", gap: 18 }}>
              <div style={{ background: col, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 44, padding: "2px 16px", borderRadius: 8 }}>{m.cm} cm</div>
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: fit(m.txt, 640, 56, "hand", 32), color: CL.ink, background: "rgba(255,253,246,0.9)", padding: "0 14px", borderRadius: 8 }}>{m.txt}</div>
            </div>
          </React.Fragment>
        );
      })}
      {title ? <Tag x={110} y={60} text={title} o={lin(f, 4, 16)} /> : null}
    </Scene>
  );
};

// ── 5. FabCalendario: la hoja del calendario de la cocina con los días marcados (cada N días se repite algo) ────
export const FabCalendario: React.FC<{ title?: string; cada: number; dias?: number; empieza?: number; txt?: string; bed?: string }> = ({ title, cada, dias = 28, empieza = 1, txt, bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig();
  const p = pop(f, fps, 2, 14), cw = 150, ch = 104;
  const marcados = Array.from({ length: dias }, (_, i) => i + 1).filter((d) => d >= empieza && (d - empieza) % Math.max(1, cada) === 0);
  return (
    <Scene bed={bed} seed={53} dim={0.36}>
      <div style={{ position: "absolute", left: 960, top: 560, translate: "-50% -50%", rotate: "-1.2deg", scale: String(0.85 + 0.15 * p), opacity: clamp01(p * 1.5) }}>
        <Card style={{ width: cw * 7 + 70, padding: "30px 35px 34px", background: "#FFFDF6" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: -24, display: "flex", justifyContent: "space-around", padding: "0 80px" }}>
            {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ width: 18, height: 50, borderRadius: 9, background: "linear-gradient(90deg,#8D8D8D,#E4E4E4,#8D8D8D)" }} />)}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `5px solid ${CL.navy}`, paddingBottom: 8, marginBottom: 12 }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fit(title || tr("ESTE MES", "THIS MONTH"), 640, 64, "serif"), color: CL.ink }}>{title || tr("Este mes", "This month")}</div>
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, color: CL.red, letterSpacing: 2 }}>{tr(`CADA ${cada} DÍAS`, `EVERY ${cada} DAYS`)}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(7, ${cw}px)` }}>
            {Array.from({ length: dias }, (_, i) => {
              const d = i + 1, mi = marcados.indexOf(d), t = mi < 0 ? 1e9 : turno(mi, marcados.length, T, 12, 0.7), k = ease(clamp01((f - t) / 10));
              return (
                <div key={d} style={{ position: "relative", height: ch, borderRight: `2px solid ${CL.grout}`, borderBottom: `2px solid ${CL.grout}`, fontFamily: LABEL, fontWeight: 600, fontSize: 40, color: CL.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {d}
                  {mi >= 0 ? <svg width={cw} height={ch} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}><ellipse cx={cw / 2} cy={ch / 2} rx={cw * 0.42} ry={ch * 0.4} fill="none" stroke={CL.red} strokeWidth={7} strokeDasharray={360} strokeDashoffset={360 * (1 - k)} transform={`rotate(-8 ${cw / 2} ${ch / 2})`} strokeLinecap="round" /></svg> : null}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
      {txt ? <Note x={1180} y={40} o={lin(f, T * 0.45, T * 0.45 + 12)} big={txt} rot={2} maxW={620} /> : null}
    </Scene>
  );
};

// ── 6. FabPrecio: el ticket de la tienda que se va imprimiendo contra lo que cuesta hacerlo en casa ─────────
export const FabPrecio: React.FC<{ tienda: { txt: string; p: string }; casa: { txt: string; p: string; items?: { t: string; p: string }[] }; nota?: string; bed?: string }> = ({ tienda, casa, nota, bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig();
  const pr = clamp01((f - 6) / 26), pa = pop(f, fps, 6, 14), pb = pop(f, fps, Math.round(T * 0.3), 14);
  const items = (casa.items || []).slice(0, 4);
  return (
    <Scene bed={bed} seed={61} dim={0.36}>
      {/* ticket térmico de la tienda: sale de la impresora (crece hacia abajo) */}
      <div style={{ position: "absolute", left: 560, top: 140, translate: "-50% 0", rotate: "-3deg", opacity: clamp01(pa * 1.6) }}>
        <div style={{ width: 560, clipPath: `inset(0 0 ${100 - 100 * ease(pr)}% 0)` }}>
        <div style={{ width: 560, background: "#FBFBF7", boxShadow: `0 30px 50px ${CL.shadow}`, padding: "30px 40px", fontFamily: "monospace", color: "#2A2A2A", clipPath: "polygon(0 0,100% 0,100% 98%,95% 100%,90% 98%,85% 100%,80% 98%,75% 100%,70% 98%,65% 100%,60% 98%,55% 100%,50% 98%,45% 100%,40% 98%,35% 100%,30% 98%,25% 100%,20% 98%,15% 100%,10% 98%,5% 100%,0 98%)" }}>
          <div style={{ textAlign: "center", fontSize: 42, fontWeight: 700, letterSpacing: 6 }}>{tr("TIENDA", "STORE")}</div>
          <div style={{ textAlign: "center", fontSize: 24, opacity: 0.7, marginBottom: 30 }}>**************************</div>
          <div style={{ fontSize: fit(tienda.txt, 480, 48, "label", 28), fontWeight: 700, lineHeight: 1.2 }}>{tienda.txt}</div>
          <div style={{ fontSize: 24, opacity: 0.6, margin: "20px 0" }}>--------------------------------</div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 52, fontWeight: 800, paddingBottom: 30 }}><span>TOTAL</span><span>{tienda.p}</span></div>
        </div>
        </div>
      </div>
      {/* lo de casa: hoja de cuaderno con la cuenta a mano */}
      <div style={{ position: "absolute", left: 1330, top: 150, translate: "-50% 0", rotate: "2.4deg", opacity: clamp01(pb * 1.6), scale: String(0.8 + 0.2 * pb) }}>
        <div style={{ width: 640, padding: "34px 46px 40px", background: `repeating-linear-gradient(#FFFDF6 0 58px, #BFD3E6 58px 60px)`, boxShadow: `0 30px 50px ${CL.shadow}`, borderLeft: "6px solid #E3A0A0" }}>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: fit(casa.txt, 540, 60, "hand"), color: CL.navy, lineHeight: "60px" }}>{casa.txt}</div>
          {items.map((it, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontFamily: HAND, fontWeight: 700, fontSize: 48, color: CL.ink, lineHeight: "60px", opacity: lin(f, T * 0.3 + 10 + i * 8, T * 0.3 + 18 + i * 8) }}><span>{it.t}</span><span>{it.p}</span></div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: HAND, fontWeight: 700, fontSize: 76, color: CL.nitrile, lineHeight: "80px", borderTop: `4px solid ${CL.ink}`, marginTop: 8, opacity: lin(f, T * 0.55, T * 0.55 + 10) }}><span>total</span><span>{casa.p}</span></div>
        </div>
        <Tape x={240} y={-18} rot={3} w={160} />
      </div>
      {nota ? <Note x={600} y={800} o={lin(f, T * 0.65, T * 0.65 + 12)} big={nota} rot={-1} maxW={700} color={CL.nitrile} /> : null}
    </Scene>
  );
};

// ── 7. FabCiclo: un ciclo que se repite (3-5 etapas en fotos alrededor, la flecha que gira) ───────────────────
export const FabCiclo: React.FC<{ title?: string; etapas: { img?: string; txt: string }[]; centro?: string; bed?: string }> = ({ title, etapas, centro, bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig();
  const n = Math.max(3, Math.min(5, etapas.length)), cx = 960, cy = 575, rx = 610, ry = 300, w = n <= 3 ? 400 : n === 4 ? 340 : 300;
  const ang = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const head = (f / (T * 0.9)) * 2 * Math.PI * 1.15 - Math.PI / 2;
  return (
    <Scene bed={bed} seed={71} dim={0.38}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={hexA(CL.navy, 0.5)} strokeWidth={10} strokeDasharray="26 18" strokeDashoffset={-f * 2} opacity={lin(f, 2, 14)} />
        <g transform={`translate(${cx + Math.cos(head) * rx} ${cy + Math.sin(head) * ry}) rotate(${(Math.atan2(Math.cos(head) * ry, -Math.sin(head) * rx) * 180) / Math.PI})`} opacity={lin(f, 10, 20)}>
          <path d="M-40 -34 L 40 0 L -40 34 Z" fill={CL.yellow} stroke={CL.ink} strokeWidth={5} />
        </g>
      </svg>
      {etapas.slice(0, n).map((e, i) => {
        const t = turno(i, n, T, 6, 0.55), pp = pop(f, fps, t, 13), x = cx + Math.cos(ang(i)) * rx, y = cy + Math.sin(ang(i)) * ry;
        return e.img
          ? <Polaroid key={i} img={e.img} x={x} y={y} w={w} rot={(i % 2 ? 3 : -3)} cap={e.txt} s={0.7 + 0.3 * pp} o={clamp01(pp * 1.6)} seed={i + 11} />
          : <div key={i} style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", scale: String(0.7 + 0.3 * pp), opacity: clamp01(pp * 1.6) }}><Card style={{ padding: "16px 30px", borderBottom: `6px solid ${CL.navy}` }}><div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: fit(e.txt, 380, 50, "label"), color: CL.ink, whiteSpace: "nowrap", textTransform: "uppercase" }}>{e.txt}</div></Card></div>;
      })}
      {centro ? <div style={{ position: "absolute", left: cx, top: cy, translate: "-50% -50%", opacity: lin(f, T * 0.5, T * 0.5 + 12), fontFamily: HAND, fontWeight: 700, fontSize: fit(centro, 520, 70, "hand"), color: CL.red, background: "rgba(255,253,246,0.88)", padding: "4px 26px", borderRadius: 14, rotate: "-3deg", whiteSpace: "nowrap" }}>{centro}</div> : null}
      {title ? <Tag x={110} y={50} text={title} o={lin(f, 4, 16)} /> : null}
    </Scene>
  );
};

// ── 8. FabRuta: por dónde llega la plaga (de una foto a otra, los bichos caminando) y, si `corte`, dónde se la corta ─
type Bicho = "mosca" | "cucaracha" | "raton" | "hormiga" | "mosquito";
const Ant: React.FC<{ x: number; y: number; r: number; s: number; t: number; o?: number }> = ({ x, y, r, s, t, o = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={o}>
    {[-6, 0, 6].map((lx, i) => <g key={i} stroke="#2A1A10" strokeWidth={2} strokeLinecap="round"><path d={`M${lx} 0 l ${-4 + Math.sin(t + i) * 3} -12`} /><path d={`M${lx} 0 l ${-4 - Math.sin(t + i) * 3} 12`} /></g>)}
    <ellipse cx={-14} cy={0} rx={10} ry={7} fill="#3A2212" /><ellipse cx={0} cy={0} rx={6} ry={5} fill="#3A2212" /><circle cx={11} cy={0} r={6} fill="#3A2212" />
    <path d="M15 -3 q 8 -8 14 -6 M15 3 q 8 8 14 6" stroke="#2A1A10" strokeWidth={1.6} fill="none" />
  </g>
);
const FlyS: React.FC<{ x: number; y: number; r: number; s: number; t: number; o?: number; mosq?: boolean }> = ({ x, y, r, s, t, o = 1, mosq }) => {
  const w = 0.3 + 0.7 * Math.abs(Math.sin(t * 2.2));
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={o}>
      <ellipse cx={0} cy={-12} rx={mosq ? 22 : 18} ry={3 + 8 * w} fill="rgba(226,238,255,0.55)" stroke="rgba(120,140,170,0.8)" strokeWidth={1.4} transform="rotate(-18)" />
      {mosq ? <><ellipse cx={4} cy={0} rx={26} ry={4.5} fill="#4A4038" /><path d="M-22 0 l -18 -2" stroke="#2A2420" strokeWidth={2} />{[-10, 0, 10].map((lx, i) => <path key={i} d={`M${lx} 3 l ${-8 + i * 4} 26`} stroke="#2A2420" strokeWidth={1.4} />)}</>
        : <><ellipse cx={4} cy={0} rx={18} ry={10} fill="#3B404B" /><circle cx={-14} cy={-2} r={8} fill="#2C313A" /><circle cx={-18} cy={-5} r={3.5} fill="#8E2222" /></>}
    </g>
  );
};
export const FabRuta: React.FC<{ bicho: Bicho; desde: { img?: string; txt: string }; hasta: { img?: string; txt: string }; corte?: string; n?: number; bed?: string }> = ({ bicho, desde, hasta, corte, n = 6, bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig();
  const A = { x: 420, y: 600 }, B = { x: 1500, y: 600 }, C = { x: 960, y: 380 };
  const pt = (u: number) => ({ x: (1 - u) ** 2 * A.x + 2 * (1 - u) * u * C.x + u * u * B.x, y: (1 - u) ** 2 * A.y + 2 * (1 - u) * u * C.y + u * u * B.y });
  const pa = pop(f, fps, 3, 13), pb = pop(f, fps, 10, 13), draw = ease(clamp01((f - 12) / 20));
  const tc = corte ? T * 0.5 : 1e9, kc = ease(clamp01((f - tc) / 12));
  const vuela = bicho === "mosca" || bicho === "mosquito";
  const bichos = Array.from({ length: Math.min(10, n) }, (_, i) => {
    const sp = 0.0045 * (0.8 + 0.4 * rnd(i + 7));
    let u = ((f - 14) * sp + i / n) % 1; if (u < 0) u += 1;
    const lim = 0.47; // con corte, no pasan del medio: se dan vuelta
    if (f > tc && u > lim) u = lim - (u - lim);
    const p = pt(u), q = pt(Math.min(1, u + 0.01));
    const yy = p.y + (vuela ? Math.sin(f / 6 + i * 2) * 22 : (rnd(i + 3) - 0.5) * 40);
    const r = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI + (f > tc && ((f - 14) * sp + i / n) % 1 > lim ? 180 : 0);
    return { i, x: p.x, y: yy, r, o: clamp01(u * 8) * clamp01((1 - u) * 8) * draw };
  });
  return (
    <Scene bed={bed} seed={83} dim={0.36}>
      <Polaroid img={desde.img} x={A.x} y={A.y + 40} w={520} rot={-4} cap={desde.txt} s={0.75 + 0.25 * pa} o={clamp01(pa * 1.6)} seed={13} />
      <Polaroid img={hasta.img} x={B.x} y={B.y + 40} w={520} rot={3.5} cap={hasta.txt} s={0.75 + 0.25 * pb} o={clamp01(pb * 1.6)} seed={17} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <path d={`M${A.x + 200} ${A.y - 120} Q ${C.x} ${C.y - 150} ${B.x - 200} ${B.y - 120}`} stroke={CL.red} strokeWidth={7} fill="none" strokeDasharray="20 16" strokeDashoffset={-f * 2} opacity={0.75 * draw} />
        {bichos.map((b) => {
          const p = { x: b.x, y: b.y - 140 };
          return bicho === "cucaracha" ? <Roach key={b.i} x={p.x} y={p.y} r={b.r} s={1.4} walk={f * 0.9 + b.i} o={b.o} />
            : bicho === "raton" ? <Mouse key={b.i} x={p.x} y={p.y} r={0} s={0.8} walk={f * 0.8 + b.i} o={b.o} flip={Math.abs(b.r) > 90} />
              : bicho === "hormiga" ? <Ant key={b.i} x={p.x} y={p.y} r={b.r} s={1.5} t={f * 0.9 + b.i} o={b.o} />
                : <FlyS key={b.i} x={p.x} y={p.y} r={Math.abs(b.r) > 90 ? 180 : 0} s={1.6} t={f + b.i} o={b.o} mosq={bicho === "mosquito"} />;
        })}
        {corte ? <g transform={`translate(${C.x + 20} ${C.y - 70})`} opacity={kc}>
          <rect x={-16} y={-120 * kc} width={32} height={240 * kc} rx={10} fill={CL.nitrile} stroke="#fff" strokeWidth={5} />
        </g> : null}
      </svg>
      {corte ? <div style={{ position: "absolute", left: C.x + 20, top: C.y + 90, translate: "-50% 0", opacity: kc, scale: String(0.8 + 0.2 * kc) }}>
        <div style={{ background: CL.nitrile, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: fit(corte, 560, 46, "label"), padding: "6px 22px", borderRadius: 10, whiteSpace: "nowrap", textTransform: "uppercase", borderBottom: `5px solid ${CL.yellow}`, boxShadow: `0 12px 24px ${CL.shadow}` }}>{corte}</div>
      </div> : null}
    </Scene>
  );
};

// ── 9. FabMapa: la casa vista desde arriba en una hoja, el haz de la linterna, pines NUMERADOS en el plano y la lista al costado ─
// `pins[].lugar` = una de las claves de LUGARES; `hechos` = cuántos (en orden) reciben ✓ DURANTE el componente; `foco` late en rojo.
// Los nombres van en la LISTA de la derecha (nunca al lado del pin): así no se pisan aunque todos caigan en la misma habitación.
const LUGARES: Record<string, [number, number]> = {
  puerta: [300, 600], puerta_patio: [40, 180], ventana_cocina: [300, 60], pileta: [150, 110], heladera: [500, 230], mesada: [400, 120],
  cocina: [290, 200], comedor: [720, 180], sala: [250, 450], ventana_sala: [40, 450], bano: [720, 375], inodoro: [840, 340], rejilla: [620, 420],
  dormitorio: [720, 525], ventana_dormitorio: [880, 525], lavadero: [1000, 200], garaje: [1000, 470], patio: [0, 330], desague: [0, 560], techo: [180, 230],
};
export const FabMapa: React.FC<{ title?: string; note?: string; pins: { lugar: string; txt: string }[]; hechos?: number; foco?: number; bed?: string }> = ({ title, note, pins, hechos = 0, foco, bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig();
  const p = pop(f, fps, 2, 14), draw = ease(clamp01((f - 4) / 22));
  const beamX = 120 + 960 * (0.5 + 0.5 * Math.sin(f / 26)), beamY = 330 + 170 * Math.sin(f / 37);
  const W = 1180, H = 660, SC = 0.86;
  const wall = { stroke: CL.ink, strokeWidth: 9, fill: "none", strokeLinejoin: "round" as const, strokeDasharray: 4200, strokeDashoffset: 4200 * (1 - draw) };
  // si dos pines caen casi en el mismo punto, el segundo se corre (siguen leyéndose los dos números)
  const ps = pins.slice(0, 6).map((q, i) => ({ ...q, i, xy: [...(LUGARES[q.lugar] || [560, 330])] as [number, number] }));
  ps.forEach((q, i) => { for (let j = 0; j < i; j++) if (Math.hypot(q.xy[0] - ps[j].xy[0], q.xy[1] - ps[j].xy[1]) < 84) q.xy[0] += 86; });
  const est = ps.map((_, i) => {
    const ap = pop(f, fps, 10 + i * 6, 12), ca = i < hechos ? turno(i, Math.max(1, hechos), T, 24, 0.62) : Infinity, ck = ease(clamp01((f - ca) / 14));
    const isF = foco === i && ck < 0.5, done = ck > 0.02;
    return { ap, ck, isF, done, col: done ? CL.nitrile : isF ? CL.red : CL.navy, beat: isF ? 1 + 0.14 * Math.abs(Math.sin(f / 7)) : 1 };
  });
  return (
    <Scene bed={bed} seed={97} dim={0.34}>
      <div style={{ position: "absolute", left: 960, top: 560, translate: "-50% -50%", scale: String(0.86 + 0.14 * p), rotate: `${-1.2 + 0.9 * p}deg` }}>
        <Card style={{ width: 1580, padding: "28px 50px 34px", background: "#FFFDF6" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 26, marginBottom: 6, whiteSpace: "nowrap" }}>
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: fit(title || tr("LA CASA", "THE HOUSE"), 640, 66, "label"), color: CL.navy, letterSpacing: 3, textTransform: "uppercase" }}>{title || tr("La casa", "The house")}</div>
            {note ? <div style={{ fontFamily: HAND, fontSize: fit(note, 760, 56, "hand"), color: CL.red, rotate: "-2deg", opacity: lin(f, 16, 28) }}>{note}</div> : null}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <svg width={W * SC} height={H * SC} viewBox={`-60 0 ${W} ${H}`} style={{ overflow: "visible", flex: "0 0 auto" }}>
            <defs>
              <radialGradient id="fbeam"><stop offset="0%" stopColor="#FFF3B0" stopOpacity="0.85" /><stop offset="60%" stopColor="#FFE680" stopOpacity="0.25" /><stop offset="100%" stopColor="#FFE680" stopOpacity="0" /></radialGradient>
              <pattern id="fleaf" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#E9E4D3" /><path d="M8 12 q6 -6 12 0 q-6 6 -12 0z M26 30 q6 -6 12 0 q-6 6 -12 0z" fill="#C9A35C" opacity="0.6" /></pattern>
            </defs>
            <rect x={-40} y={60} width={80} height={540} fill="url(#fleaf)" stroke="#B9B19A" strokeWidth={2} strokeDasharray="10 8" />
            <path d="M40 60 H 880 V 600 H 40 Z" {...wall} />
            <path d="M40 300 H 880 M560 60 V 600 M560 450 H 880" {...wall} strokeWidth={6} />
            <path d="M880 60 H 1120 V 600 H 880 M880 330 H 1120" {...wall} />
            <g opacity={draw} fontFamily={LABEL} fontSize={30} fill={CL.inkSoft} letterSpacing={2}>
              <text x={70} y={290}>{tr("COCINA", "KITCHEN")}</text><text x={600} y={290}>{tr("COMEDOR", "DINING")}</text><text x={70} y={585}>{tr("SALA", "LIVING")}</text>
              <text x={600} y={440}>{tr("BAÑO", "BATH")}</text><text x={600} y={590}>{tr("DORMITORIO", "BEDROOM")}</text><text x={900} y={320}>{tr("LAVADERO", "LAUNDRY")}</text><text x={900} y={585}>{tr("GARAJE", "GARAGE")}</text>
              <text x={-30} y={40} fontSize={24}>{tr("PATIO", "YARD")}</text>
            </g>
            <g opacity={draw} stroke={CL.navy} strokeWidth={5} fill="none">
              <path d="M260 600 h 80" stroke="#FFFDF6" strokeWidth={12} /><path d="M260 600 a 80 80 0 0 1 80 -80" />
              <path d="M40 140 v 80" stroke="#FFFDF6" strokeWidth={12} /><path d="M40 140 a 80 80 0 0 1 80 80" />
              <path d="M240 60 h 120 M40 410 v 90 M880 480 v 90" stroke="#2F6FB0" strokeWidth={10} />
              <rect x={100} y={72} width={110} height={56} rx={6} /><rect x={470} y={190} width={70} height={90} rx={4} /><path d="M330 72 H 540" strokeWidth={4} />
              <ellipse cx={840} cy={340} rx={22} ry={28} />
            </g>
            <ellipse cx={beamX} cy={beamY} rx={230} ry={150} fill="url(#fbeam)" style={{ mixBlendMode: "multiply" }} />
            {ps.map((q, i) => {
              const e = est[i];
              return (
                <g key={i} transform={`translate(${q.xy[0]} ${q.xy[1]}) scale(${e.ap * e.beat})`}>
                  <circle r={40} fill={e.col} stroke="#fff" strokeWidth={6} />
                  {e.done ? <path d="M-16 2 L-4 14 L18 -13" stroke="#fff" strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={60} strokeDashoffset={60 * (1 - e.ck)} />
                    : <text textAnchor="middle" y={15} fontFamily={LABEL} fontWeight={700} fontSize={44} fill="#fff">{i + 1}</text>}
                </g>
              );
            })}
          </svg>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
            {ps.map((q, i) => {
              const e = est[i];
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, opacity: clamp01(e.ap * 1.5), transform: `translateX(${(1 - e.ap) * 30}px)` }}>
                  <div style={{ width: 62, height: 62, flex: "0 0 62px", borderRadius: 31, background: e.col, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 36, boxShadow: `0 6px 12px ${CL.shadow}` }}>{e.done ? "✓" : i + 1}</div>
                  <div style={{ position: "relative", fontFamily: LABEL, fontWeight: 700, fontSize: fit(q.txt, 330, 46, "label", 26), color: e.isF ? CL.red : CL.ink, letterSpacing: 1.5, textTransform: "uppercase", whiteSpace: "nowrap" }}>
                    {q.txt}
                    <span style={{ position: "absolute", left: -4, right: -4, top: "52%", height: 5, background: CL.nitrile, transformOrigin: "left", scale: `${e.ck} 1` }} />
                  </div>
                </div>
              );
            })}
          </div>
          </div>
        </Card>
      </div>
    </Scene>
  );
};

// ── 10. FabAntesDespues: la misma cosa antes y después; una cortina que barre de izquierda a derecha ──────────
export const FabAntesDespues: React.FC<{ antes: string; despues: string; a?: string; b?: string; nota?: string; bed?: string }> = ({ antes, despues, a = tr("ANTES", "BEFORE"), b = tr("DESPUÉS", "AFTER"), nota, bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig();
  const p = pop(f, fps, 2, 14), k = ease(clamp01((f - T * 0.25) / (T * 0.4))), W = 1280, H = 720;
  const A = imgSrc(antes), B = imgSrc(despues);
  return (
    <Scene bed={bed} seed={109} dim={0.4}>
      <div style={{ position: "absolute", left: 960, top: 545, translate: "-50% -50%", rotate: "-1deg", scale: String(0.82 + 0.18 * p), opacity: clamp01(p * 1.6) }}>
        <div style={{ background: "#fff", padding: 22, borderRadius: 8, boxShadow: `0 40px 70px ${CL.shadow}` }}>
          <div style={{ position: "relative", width: W, height: H, overflow: "hidden" }}>
            {A ? <Img src={staticFile(A)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} /> : null}
            <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - k * 100}% 0 0)` }}>{B ? <Img src={staticFile(B)} style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(1.02 + 0.03 * (f / T)) }} /> : null}</div>
            <div style={{ position: "absolute", top: 0, bottom: 0, left: `${k * 100}%`, width: 8, translate: "-50% 0", background: "#fff", boxShadow: "0 0 18px rgba(0,0,0,0.4)", opacity: k > 0.01 && k < 0.99 ? 1 : 0 }} />
            <div style={{ position: "absolute", left: 24, top: 24, background: CL.red, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 44, padding: "4px 18px", borderRadius: 8, opacity: 1 - k }}>{a}</div>
            <div style={{ position: "absolute", right: 24, top: 24, background: CL.nitrile, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 44, padding: "4px 18px", borderRadius: 8, opacity: k }}>{b}</div>
          </div>
        </div>
      </div>
      {nota ? <Note x={1180} y={830} o={lin(f, T * 0.7, T * 0.7 + 12)} big={nota} rot={-1.5} maxW={620} color={CL.nitrile} /> : null}
    </Scene>
  );
};

export const FAB = { FabSiNo, FabPasos, FabDato, FabAltura, FabCalendario, FabPrecio, FabCiclo, FabRuta, FabMapa, FabAntesDespues };
