// MapPin.tsx — MAPA REAL + empuje de cámara a un alfiler + lugar + año. Opcional: una LÍNEA que crece
// con los años (la expansión de la plaga / la ruta) con el año corriendo en la punta.
//
// ⛔ El mapa es una IMAGEN REAL de dominio público (USGS/NOAA/NASA/Natural Earth/Wikimedia PD), nunca
//    dibujado en CSS. Conformala a 1920x1080 (`ffmpeg -vf scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080`)
//    y medí las coordenadas de cada lugar en PÍXELES de ese 1920x1080 mirando un still (no a ojo).
// ⛔ Beats en palabras: `pins[i].at`, `route.from/to` = segundos ABSOLUTOS (words.json). `t0` lo pone el build.
// La cámara se arma sola: plano general → empuja a cada alfiler en su `at` → si hay ruta, se abre para
// verla crecer. Los rótulos se contra-escalan (se leen igual con zoom 1x o 2,4x).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { W, F_TYPE, F_NUM, useAbs, prog, camAt, camStyle, CamKey, Credit, KindChip, Grade, clamp01, lerp, rgba, useOut } from "./Stage";

type Pin = { x: number; y: number; label: string; year?: string | number; at?: number; zoom?: number };
type Route = { pts: [number, number][]; years?: number[]; from: number; to: number; label?: string; zoom?: number };

export const MapPin: React.FC<{
  map: string;
  pins?: Pin[];
  route?: Route;
  kicker?: string;
  credit?: string;          // "Map: USGS · public domain"
  t0?: number;
  durationInFrames?: number;
  bed?: string;
}> = ({ map, pins = [], route, kicker = "MAP", credit, t0, durationInFrames }) => {
  const now = useAbs(t0);
  const start = t0 ?? 0;
  const out = useOut(durationInFrames);

  // ── cámara automática ──
  const keys: CamKey[] = [{ t: start, x: 960, y: 540, s: 1.04 }];
  const evs: { t: number; k: CamKey }[] = [];
  for (const p of pins) evs.push({ t: p.at ?? start + 0.6, k: { t: 0, x: p.x, y: p.y, s: p.zoom ?? 2.0 } });
  if (route && route.pts.length > 1) {
    const xs = route.pts.map((q) => q[0]), ys = route.pts.map((q) => q[1]);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    const fit = Math.min(1920 / (Math.max(...xs) - Math.min(...xs) + 520), 1080 / (Math.max(...ys) - Math.min(...ys) + 380));
    evs.push({ t: route.from - 0.4, k: { t: 0, x: cx, y: cy, s: route.zoom ?? Math.max(1.04, Math.min(2.2, fit)) } });
  }
  evs.sort((a, b) => a.t - b.t);
  for (const e of evs) {
    const last = keys[keys.length - 1];
    keys.push({ ...last, t: Math.max(last.t + 0.05, e.t - 0.15) });         // sostiene hasta el beat
    keys.push({ ...e.k, t: Math.max(last.t + 0.2, e.t + 1.3) });             // y viaja 1,45 s
  }
  const c0 = camAt(now, keys);
  // deriva lenta siempre (nunca quieto)
  const c = { ...c0, s: c0.s * (1 + 0.006 * Math.max(0, now - start)) };
  const S = Math.max(1, c.s);

  // ── ruta que crece ──
  let routeEl: React.ReactNode = null;
  let tipLabel: React.ReactNode = null;
  if (route && route.pts.length > 1) {
    const p = clamp01((now - route.from) / Math.max(0.1, route.to - route.from));
    const seg: number[] = [];
    let tot = 0;
    for (let i = 1; i < route.pts.length; i++) { const d = Math.hypot(route.pts[i][0] - route.pts[i - 1][0], route.pts[i][1] - route.pts[i - 1][1]); seg.push(d); tot += d; }
    let rest = p * tot, i = 0;
    const drawn: [number, number][] = [route.pts[0]];
    for (; i < seg.length; i++) {
      if (rest >= seg[i]) { drawn.push(route.pts[i + 1]); rest -= seg[i]; continue; }
      const k = seg[i] ? rest / seg[i] : 0;
      drawn.push([lerp(route.pts[i][0], route.pts[i + 1][0], k), lerp(route.pts[i][1], route.pts[i + 1][1], k)]);
      break;
    }
    const tip = drawn[drawn.length - 1];
    // año en la punta: se interpola por vértice
    let year: number | null = null;
    if (route.years && route.years.length === route.pts.length) {
      const idx = Math.min(seg.length - 1, i);
      const k = seg[idx] ? clamp01(rest / seg[idx]) : 1;
      year = Math.round(i >= seg.length ? route.years[route.years.length - 1] : lerp(route.years[idx], route.years[idx + 1], k));
    }
    routeEl = p > 0 ? (
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <polyline points={drawn.map((q) => q.join(",")).join(" ")} fill="none" stroke={rgba(W.pin, 0.35)} strokeWidth={26 / S} strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={drawn.map((q) => q.join(",")).join(" ")} fill="none" stroke={W.pin} strokeWidth={8 / S} strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 6px rgba(0,0,0,.7))" }} />
        <circle cx={tip[0]} cy={tip[1]} r={13 / S} fill={W.white} stroke={W.pin} strokeWidth={5 / S} />
      </svg>
    ) : null;
    if (p > 0 && year !== null) {
      tipLabel = (
        <div style={{ position: "absolute", left: tip[0], top: tip[1], transform: `translate(${(26 / S).toFixed(1)}px, -50%) scale(${(1 / S).toFixed(4)})`, transformOrigin: "0 50%" }}>
          <div style={{ fontFamily: F_NUM, fontWeight: 700, fontSize: 64, color: W.white, background: rgba(W.ink0, 0.72), padding: "2px 16px", borderLeft: `6px solid ${W.pin}` }}>{year}</div>
          {route.label ? <div style={{ fontFamily: F_TYPE, fontSize: 26, color: W.bone, marginTop: 6, background: rgba(W.ink0, 0.6), padding: "3px 12px", whiteSpace: "nowrap" }}>{route.label}</div> : null}
        </div>
      );
    }
  }

  return (
    <AbsoluteFill style={{ backgroundColor: W.ink0, overflow: "hidden" }}>
      <div style={camStyle(c)}>
        <Img src={staticFile(map)} style={{ width: 1920, height: 1080, objectFit: "cover", filter: "saturate(0.85) contrast(1.04)" }} />
        {routeEl}
        {tipLabel}
        {pins.map((p, i) => {
          const a = prog(now, p.at ?? start + 0.6, 0.5);
          const pulse = 1 + 0.35 * ((now * 1.3 + i * 0.37) % 1);
          // dónde cae el alfiler EN PANTALLA — con el MISMO recorte de bordes que camStyle (sin él daba 960 y no giraba)
          const tx = Math.min(0, Math.max(1920 - 1920 * S, 960 - c.x * S));
          const sx = tx + p.x * S;
          const anchoRot = 34 + 32 + (p.label?.length ?? 0) * 25; // F_TYPE 40 px ≈ 25 px por letra
          const izq = sx + anchoRot > 1880;           // ⛔ si no entra a la derecha, el rótulo va a la izquierda (se cortaba)
          if (a <= 0) return null;
          return (
            <div key={i} style={{ position: "absolute", left: p.x, top: p.y, transform: `scale(${(1 / S).toFixed(4)})`, transformOrigin: "0 0" }}>
              <div style={{ position: "absolute", left: -34 * pulse, top: -34 * pulse, width: 68 * pulse, height: 68 * pulse, borderRadius: "50%", border: `4px solid ${rgba(W.pin, 0.8 * (2 - pulse) * a)}` }} />
              <div style={{ position: "absolute", left: -15, top: -15, width: 30, height: 30, borderRadius: 15, background: W.pin, border: `5px solid ${W.white}`, boxShadow: "0 4px 14px rgba(0,0,0,.7)", transform: `scale(${(0.4 + 0.6 * a).toFixed(3)})` }} />
              <div style={{ position: "absolute", ...(izq ? { right: 34 } : { left: 34 }), top: -58, opacity: a * out, transform: `translateX(${((1 - a) * (izq ? -18 : 18)).toFixed(1)}px)`, whiteSpace: "nowrap", textAlign: izq ? "right" : "left" }}>
                <div style={{ fontFamily: F_TYPE, fontSize: 40, color: W.ink0, background: W.paper, padding: "6px 16px", boxShadow: "0 8px 22px rgba(0,0,0,.55)" }}>{p.label}</div>
                {p.year !== undefined ? <div style={{ fontFamily: F_NUM, fontWeight: 700, fontSize: 58, color: W.white, marginTop: 6, textShadow: "0 3px 14px rgba(0,0,0,.95)" }}>{p.year}</div> : null}
              </div>
            </div>
          );
        })}
      </div>
      <Grade vignette={0.55} />
      <KindChip text={kicker} a={prog(now, start + 0.15, 0.4) * out} color={W.manila} />
      <Credit text={credit} a={prog(now, start + 0.2, 0.4)} />
    </AbsoluteFill>
  );
};
