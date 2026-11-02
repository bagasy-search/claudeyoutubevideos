// Motor de escenas del canal Amparo: cada escena es un JSON escrito a mano para SU frase (edl.json → "esc").
// Elementos: picto · prop · grupo · txt · num · iconos · barras · linea · clip · img. Entradas: pop, drop, izq, der, fade, dibuja, crece.
// Movimiento por cuadros clave "mv": [[t, x, y, s?], …] con curva; poses que se funden ("pose2" + "poseAt").
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { C, TIT, TXT, cl, eio, eo, sp, lerp, rnd, Hoja, Picto, Prop, Titular, FPS } from "./kit";

export type El = {
  k: "picto" | "prop" | "grupo" | "txt" | "num" | "iconos" | "barras" | "linea" | "clip" | "img";
  x?: number; y?: number; s?: number; at?: number; out?: number; in?: string; rot?: number; flip?: boolean;
  c?: string; // "r" rojo · "y" amarillo · "g" gris · "k" tinta
  pose?: string; pose2?: string; poseAt?: [number, number];
  n?: string; v?: number | [number, number]; vAt?: [number, number];
  mv?: number[][];
  txt?: string; size?: number; w?: number; align?: "left" | "center";
  to?: number; from?: number; pre?: string; suf?: string; dec?: number; dur?: number;
  cols?: number; on?: number[]; gap?: number; items?: { v: number; l: string; c?: string }[]; max?: number; h?: number;
  marks?: { p: number; l: string; c?: string }[]; src?: string; r?: number; ofs?: number; sep?: number; cnt?: number; vest?: boolean; vests?: number[]; bg?: string;
};
export type Esc = { a: number; b: number; tit?: string; titPos?: "arriba" | "abajo" | "centro"; titSize?: number; titAt?: number; els?: El[]; cam?: "in" | "out" | "quieta"; tin?: "hoja" | "corte" | "barrido"; golpe?: boolean; clip?: string; clipOfs?: number; nota?: string };

const col = (c?: string) => (c === "r" ? C.rojo : c === "y" ? C.amarillo : c === "g" ? C.gris : C.tinta);
const fr = (s: number) => s * FPS;

// valor de un cuadro clave con curva entre puntos
const kf = (mv: number[][] | undefined, t: number, x: number, y: number, s: number) => {
  if (!mv || !mv.length) return [x, y, s];
  let pts = [[0, x, y, s], ...mv.map((p) => [p[0], p[1] ?? x, p[2] ?? y, p[3] ?? s])];
  if (t <= pts[0][0]) return pts[0].slice(1);
  for (let i = 0; i < pts.length - 1; i++) {
    const [t0, ...a] = pts[i], [t1, ...b] = pts[i + 1];
    if (t <= t1) { const u = eio((t - t0) / Math.max(0.01, t1 - t0)); return [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)]; }
  }
  return pts[pts.length - 1].slice(1);
};

// entrada/salida de un elemento → transform extra (dx, dy, escala, opacidad, recorte)
const entra = (e: El, t: number, dur: number) => {
  const at = e.at ?? 0, u = (t - at) / 0.55;
  let dx = 0, dy = 0, sc = 1, op = 1, clip = 1;
  if (t < at) return { dx, dy, sc: 0.001, op: 0, clip: 0 };
  switch (e.in || "pop") {
    case "pop": sc = Math.max(0.001, sp(u)); break;
    case "drop": dy = -700 * (1 - sp(u * 0.8)); break;
    case "izq": dx = -1300 * (1 - eo(u * 0.7)); break;
    case "der": dx = 1300 * (1 - eo(u * 0.7)); break;
    case "fade": op = cl(u * 1.6); break;
    case "dibuja": clip = eio(u * 0.7); break;
    case "crece": sc = Math.max(0.001, eo(u)); break;
    case "nada": break;
  }
  if (e.out !== undefined && t > e.out) { const w = cl((t - e.out) / 0.35); op *= 1 - w; sc *= 1 - 0.3 * w; }
  return { dx, dy, sc, op, clip };
};

const Elemento: React.FC<{ e: El; t: number; f: number; dur: number; id: string }> = ({ e, t, f, dur, id }) => {
  const [x, y, s] = kf(e.mv, t - (e.at ?? 0), e.x ?? 960, e.y ?? 700, e.s ?? 1);
  const E = entra(e, t, dur);
  if (E.op <= 0) return null;
  const vv = Array.isArray(e.v) ? lerp(e.v[0], e.v[1], eio((t - (e.vAt?.[0] ?? 0)) / Math.max(0.01, (e.vAt?.[1] ?? 1) - (e.vAt?.[0] ?? 0)))) : e.v ?? 0;
  const k2 = e.pose2 ? eio((t - (e.poseAt?.[0] ?? 0)) / Math.max(0.01, (e.poseAt?.[1] ?? 0.6) - (e.poseAt?.[0] ?? 0))) : 0;
  const tr = `translate(${x + E.dx},${y + E.dy}) scale(${E.sc}) translate(${-x},${-y})`;
  const wrap = (node: React.ReactNode) => (
    <g transform={tr} opacity={E.op} clipPath={E.clip < 1 ? `url(#${id})` : undefined}>
      {E.clip < 1 && <defs><clipPath id={id}><rect x={x - 700} y={y - 700} width={1400 * E.clip} height={1400} /></clipPath></defs>}
      {node}
    </g>
  );
  switch (e.k) {
    case "picto": return wrap(<Picto x={x} y={y} s={s} pose={e.pose} pose2={e.pose2} k2={k2} f={f + (e.x ?? 0)} color={col(e.c)} flip={e.flip} rot={e.rot} vest={e.vest} />);
    case "prop": return wrap(<Prop n={e.n || "pregunta"} x={x} y={y} s={s} f={f} color={col(e.c)} v={vv} rot={e.rot} flip={e.flip} />);
    case "grupo": {
      const n = e.cnt ?? 5, gap = e.gap ?? 150;
      return wrap(<g>{Array.from({ length: n }).map((_, i) => {
        const sep = e.sep !== undefined && i === n - 1 ? e.sep : 0;
        const r = rnd(i * 31 + (e.x ?? 0));
        const pose = e.on?.includes(i) ? (e.pose2 || "cabizbajo") : (e.pose || "parado");
        return <Picto key={i} x={x + (i - (n - 1) / 2) * gap + sep} y={y + (r - 0.5) * 16} s={s * (0.92 + r * 0.14)} pose={pose} f={f + i * 13} color={e.on?.includes(i) ? col(e.c || "r") : e.c === "g" ? C.gris : C.tinta} flip={e.flip ?? r > 0.5} vest={e.vests?.includes(i)} />;
      })}</g>);
    }
    case "iconos": {
      const n = e.cnt ?? 10, cols = e.cols ?? n, gap = e.gap ?? 110;
      return wrap(<g>{Array.from({ length: n }).map((_, i) => {
        const cx = x + ((i % cols) - (cols - 1) / 2) * gap, cy = y + Math.floor(i / cols) * gap * 1.6;
        const u = sp((t - (e.at ?? 0) - i * 0.06) / 0.45);
        const lit = e.on?.includes(i) && t > (e.vAt?.[0] ?? (e.at ?? 0) + 0.8);
        return <Picto key={i} x={cx} y={cy} s={s * 0.42 * Math.max(0.001, u)} f={f + i * 7} color={lit ? col(e.c || "r") : C.tinta} />;
      })}</g>);
    }
    case "barras": {
      const it = e.items || [], w = e.w ?? 900, h = e.h ?? 420, max = e.max ?? Math.max(...it.map((b) => b.v)), bw = w / it.length * 0.56;
      return wrap(<g>
        <path d={`M${x - w / 2 - 20},${y} L${x + w / 2 + 20},${y}`} stroke={C.tinta} strokeWidth={8} strokeLinecap="round" />
        {it.map((b, i) => {
          const u = eo((t - (e.at ?? 0) - 0.3 - i * 0.35) / 0.9), bh = (b.v / max) * h * u, bx = x - w / 2 + (i + 0.5) * (w / it.length);
          return <g key={i}><rect x={bx - bw / 2} y={y - bh} width={bw} height={bh} rx={8} fill={col(b.c)} />
            <text x={bx} y={y + 56} textAnchor="middle" fontFamily={TXT} fontWeight={800} fontSize={36} fill={C.tinta}>{b.l}</text>
            <text x={bx} y={y - bh - 22} textAnchor="middle" fontFamily={TIT} fontSize={48} fill={C.tinta} opacity={cl(u * 3 - 2)}>{Math.round(b.v * u)}{e.suf || ""}</text></g>;
        })}
      </g>);
    }
    case "linea": {
      const w = e.w ?? 1300, u = eio((t - (e.at ?? 0)) / (e.dur ?? 1.6));
      return wrap(<g>
        <path d={`M${x - w / 2},${y} L${x - w / 2 + w * u},${y}`} stroke={C.tinta} strokeWidth={10} strokeLinecap="round" />
        {(e.marks || []).map((m, i) => { const vis = u >= m.p; const q = sp((t - (e.at ?? 0) - m.p * (e.dur ?? 1.6)) / 0.4);
          return vis ? <g key={i} transform={`translate(${x - w / 2 + w * m.p},${y}) scale(${Math.max(0.001, q)})`}><circle r={18} fill={col(m.c)} /><text y={-40} textAnchor="middle" fontFamily={TIT} fontSize={58} fill={C.tinta}>{m.l}</text></g> : null; })}
      </g>);
    }
    default: return null;
  }
};

// texto y números van en HTML (mejor tipografía), en la misma caja transformada
const ElementoHtml: React.FC<{ e: El; t: number }> = ({ e, t }) => {
  const [x, y, s] = kf(e.mv, t - (e.at ?? 0), e.x ?? 960, e.y ?? 540, e.s ?? 1);
  const E = entra(e, t, 0);
  if (E.op <= 0) return null;
  const base: React.CSSProperties = { position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) translate(${E.dx}px,${E.dy}px) scale(${E.sc * s})`, opacity: E.op, whiteSpace: "nowrap" };
  if (e.k === "txt") return <div style={{ ...base, fontFamily: e.size && e.size < 60 ? TXT : TIT, fontWeight: 800, fontSize: e.size ?? 64, color: e.bg === "r" ? "#fff" : col(e.c), whiteSpace: e.w ? "normal" : "nowrap", width: e.w, textAlign: e.align || "center", lineHeight: 1.1,
    ...(e.bg ? { background: e.bg === "r" ? C.rojo : e.bg === "k" ? C.tinta : C.amarillo, padding: "10px 26px", borderRadius: 14, boxShadow: `0 10px 24px ${C.sombra}` } : {}), ...(e.bg === "k" ? { color: "#fff" } : {}) }}>{e.txt}</div>;
  if (e.k === "num") {
    const u = eo((t - (e.at ?? 0)) / (e.dur ?? 1.4)), v = lerp(e.from ?? 0, e.to ?? 0, u);
    const yr = (e.to ?? 0) >= 1900 && (e.to ?? 0) <= 2100 && !e.suf && !e.pre;
    const str = (e.dec ? v.toFixed(e.dec) : yr ? String(Math.round(v)) : Math.round(v).toLocaleString("es-MX"));
    return <div style={{ ...base, fontFamily: TIT, fontSize: e.size ?? 200, color: col(e.c), letterSpacing: -4 }}>{e.pre || ""}{str}{e.suf || ""}</div>;
  }
  if (e.k === "clip" || e.k === "img") {
    const w = e.w ?? 760, h = e.h ?? 428;
    return <div style={{ ...base, width: w, height: h, borderRadius: e.r ?? 28, overflow: "hidden", boxShadow: `0 24px 50px ${C.sombra}`, background: "#ccc" }}>
      {e.k === "clip" ? <OffthreadVideo src={staticFile(e.src!)} startFrom={Math.round((e.ofs ?? 0) * FPS)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : <Img src={staticFile(e.src!)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
    </div>;
  }
  return null;
};

// una escena: hoja + cámara curva + elementos + titular. dk = 0 pantalla entera · 1 = corrida a la derecha (Amparo en tarjeta a la izquierda)
export const EscenaView: React.FC<{ esc: Esc; idx: number; dk: number }> = ({ esc, idx, dk }) => {
  const f = useCurrentFrame(), t = f / FPS, dur = esc.b - esc.a;
  // cámara: sentido y foco sorteados por escena; curva, nunca lineal
  const r1 = rnd(idx * 977 + 13), r2 = rnd(idx * 541 + 7), r3 = rnd(idx * 131 + 3);
  const modo = esc.cam || (r1 < 0.5 ? "in" : "out");
  const k = eio(t / Math.max(1, dur));
  const amp = 0.035 + r2 * 0.035;
  const z = modo === "quieta" ? 1 : modo === "in" ? 1 + amp * k : 1 + amp * (1 - k);
  const ox = 35 + r2 * 30, oy = 35 + r3 * 30;
  const dx = Math.sin(k * Math.PI) * (r3 - 0.5) * 30, dy = Math.sin(k * Math.PI) * (r1 - 0.5) * 18;
  // entrada de la escena (encima de la anterior)
  let tx = 0, sh = 0, mask = 100;
  const u = f / 12;
  if (esc.tin === "hoja" && u < 1) { tx = 1920 * (1 - eo(u)); sh = 1; }
  if (esc.tin === "barrido" && u < 1) mask = eio(u) * 100;
  // golpe: sacudida corta en la revelación
  const g = esc.golpe && t < 0.35 ? Math.sin(t * 90) * 10 * (1 - t / 0.35) : 0;
  const titSize = (esc.titSize ?? 112) * (1 + 0.1 * dk);
  const box = `translate(${lerp(0, 330, dk)}px, ${lerp(0, 20, dk)}px) scale(${lerp(1, 0.66, dk)})`;
  return (
    <AbsoluteFill style={{ transform: `translateX(${tx}px)`, boxShadow: sh ? "-30px 0 60px rgba(0,0,0,0.18)" : undefined, clipPath: mask < 100 ? `inset(0 ${100 - mask}% 0 0)` : undefined }}>
      <Hoja>
        {esc.clip ? (
          <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${ox}% ${oy}%` }}>
            <OffthreadVideo src={staticFile(esc.clip)} startFrom={Math.round((esc.clipOfs ?? 0) * FPS)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </AbsoluteFill>
        ) : null}
        <AbsoluteFill style={{ transform: box, transformOrigin: "50% 50%" }}>
          <AbsoluteFill style={{ transform: `translate(${dx + g}px, ${dy}px) scale(${z})`, transformOrigin: `${ox}% ${oy}%` }}>
            <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
              {(esc.els || []).filter((e) => !["txt", "num", "clip", "img"].includes(e.k)).map((e, i) => <Elemento key={i} e={e} t={t} f={f} dur={dur} id={`c${idx}_${i}`} />)}
            </svg>
            {(esc.els || []).filter((e) => ["txt", "num", "clip", "img"].includes(e.k)).map((e, i) => <ElementoHtml key={i} e={e} t={t} />)}
          </AbsoluteFill>
          {esc.tit ? (
            <div style={{ position: "absolute", left: 0, right: 0, display: "flex", justifyContent: "center",
              top: esc.titPos === "abajo" ? undefined : esc.titPos === "centro" ? "50%" : 70, bottom: esc.titPos === "abajo" ? 70 : undefined,
              transform: esc.titPos === "centro" ? "translateY(-50%)" : undefined }}>
              {esc.clip ? (
                // sobre un clip el titular va en una tira de hoja (negro sobre metraje oscuro no se lee)
                <div style={{ background: C.hoja, borderRadius: 22, padding: "14px 34px 18px", boxShadow: `0 18px 40px ${C.sombra}`, opacity: cl((f - fr(esc.titAt ?? 0.1) + 4) / 6) }}>
                  <Titular txt={esc.tit} f={f} delay={fr(esc.titAt ?? 0.1)} size={Math.round(titSize * 0.82)} w={1150 - 200 * dk} />
                </div>
              ) : <Titular txt={esc.tit} f={f} delay={fr(esc.titAt ?? 0.1)} size={titSize} w={(esc.titPos === "centro" ? 1600 : 1640) - 260 * dk} />}
            </div>
          ) : null}
        </AbsoluteFill>
      </Hoja>
    </AbsoluteFill>
  );
};
