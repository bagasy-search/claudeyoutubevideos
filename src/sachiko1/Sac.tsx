// sachiko1 · componentes del video 1 de Sachiko's Kitchen (Claude, 12-oct-2026).
// Regla del cerebro: UNA idea por plano, máx. 2 textos a la vez, el ojo va a un solo lugar (la cámara lleva al centro lo que nombra la voz).
// Capas: foto real (gpt) con cámara → marcas/pines que viven DENTRO de la foto → rótulos en pantalla → grade + grano.
// Tiempos de las props = segundos ABSOLUTOS de la voz (words.json); a = segundo de entrada; d = cuadros.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { SERIF, LABEL, HAND, fr, cl, ez, eo, lin, img, C, Grade, Grain, Mark, Print, Chip, Bed, Stage, sp } from "./Base";

type P<T> = React.FC<T & { a: number; d: number }>;
const useT = (a: number) => { const f = useCurrentFrame(); return { f, at: (t: number) => fr(t) - fr(a) }; };
const shadowTxt = "0 6px 26px rgba(0,0,0,0.65)";
const rnd = (i: number, n: number) => { const x = Math.sin(i * 91.7 + n * 13.3) * 43758.5; return x - Math.floor(x); };

// ── cámara: lleva el punto (x,y) del lienzo 1920x1080 al centro con escala s; keys en segundos absolutos ──
export type Cam = { t: number; s: number; x: number; y: number };
const camAt = (f: number, at: (t: number) => number, K: Cam[], dur = 1.1) => {
  let c = K[0];
  for (let i = 1; i < K.length; i++) {
    const p = c, q = K[i], u = ez((f - at(q.t)) / (dur * 30));
    if (f >= at(q.t)) c = { t: q.t, s: p.s + (q.s - p.s) * u, x: p.x + (q.x - p.x) * u, y: p.y + (q.y - p.y) * u };
  }
  return c;
};
const camStyle = (c: Cam, jx = 0, jy = 0): React.CSSProperties => {
  // nunca mostrar borde vacío: la escala mínima 1 y el centro acotado
  const s = Math.max(1, c.s), hw = 960 / s, hh = 540 / s;
  const x = Math.min(1920 - hw, Math.max(hw, c.x)), y = Math.min(1080 - hh, Math.max(hh, c.y));
  return { transformOrigin: "0 0", transform: `translate(${960 - x * s + jx}px, ${540 - y * s + jy}px) scale(${s})` };
};
const shakeAt = (f: number, at: (t: number) => number, ts: number[] = []) => {
  let jx = 0, jy = 0;
  for (const t of ts) { const k = f - at(t); if (k >= 0 && k < 16) { const e = Math.exp(-k / 5); jx += Math.sin(k * 2.3) * 9 * e; jy += Math.cos(k * 1.9) * 7 * e; } }
  return [jx, jy];
};
// polvo en el aire (motas cálidas)
const Motes: React.FC<{ f: number; n?: number; op?: number }> = ({ f, n = 26, op = 1 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", opacity: op }}>
    {Array.from({ length: n }, (_, i) => {
      const x = rnd(i, 1) * 1920 + Math.sin(f / (50 + 40 * rnd(i, 2)) + rnd(i, 3) * 6) * 30;
      const y = 1080 - ((f * (0.35 + rnd(i, 4) * 0.8) + rnd(i, 5) * 1080) % 1140);
      const r = 2 + 5 * rnd(i, 6);
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: r, height: r, borderRadius: 9, background: "rgba(255,240,210,0.75)", opacity: 0.12 + 0.25 * rnd(i, 7), filter: r > 5 ? "blur(1px)" : undefined }} />;
    })}
  </AbsoluteFill>
);
// rótulo en pantalla (entra en su palabra; opcional sale en `out`)
export type ChipB = { t: number; txt: string; x: number; y: number; red?: boolean; ink?: boolean; hand?: boolean; size?: number; out?: number; rot?: number; big?: boolean };
const Chips: React.FC<{ f: number; at: (t: number) => number; chips?: ChipB[] }> = ({ f, at, chips }) => (
  <>
    {(chips || []).map((c, i) => {
      const u = sp(f, at(c.t), 13, 190), o = c.out ? cl((f - at(c.out)) / 8) : 0;
      if (f < at(c.t) - 1 || o >= 1) return null;
      if (c.big) return (
        <div key={i} style={{ position: "absolute", left: c.x, top: c.y, translate: "-50% -50%", opacity: cl(u * 2) * (1 - o), transform: `scale(${1.25 - 0.25 * u})`, whiteSpace: "nowrap",
          fontFamily: c.hand ? HAND : SERIF, fontWeight: 900, fontSize: c.size || 120, color: C.porc, textShadow: "0 10px 40px rgba(0,0,0,0.75)" }}>{c.txt}</div>
      );
      return (
        <div key={i} style={{ position: "absolute", left: c.x, top: c.y, opacity: cl(u * 2) * (1 - o), transform: `translateY(${(1 - u) * 30 - o * 20}px) scale(${0.85 + 0.15 * u})`, transformOrigin: "0 50%" }}>
          <Chip txt={c.txt} size={c.size || (c.hand ? 64 : 50)} font={c.hand ? HAND : LABEL} ls={c.hand ? 0 : 3} rot={c.rot ?? -2}
            bg={c.red ? C.red : c.ink ? C.lilacDeep : "#FFFDF4"} color={c.red || c.ink ? "#fff" : C.ink} />
        </div>
      );
    })}
  </>
);
export type MarkB = { t: number; kind: "circle" | "strike" | "under"; x: number; y: number; w: number; h: number; sw?: number };

// ═════════ FOTO CON GOLPES (el caballo de batalla): cámara por palabras, marcas dentro de la foto, rótulos, luz que se prende, temblor ═════════
export const PhotoBeats: P<{ k: string; cam?: Cam[]; marks?: MarkB[]; chips?: ChipB[]; dark?: { on: number; lvl?: number }; shake?: number[]; old?: boolean; dim?: number; motes?: boolean; rings?: { t: number; x: number; y: number }[] }> =
  ({ a, d, k, cam, marks, chips, dark, shake, old, dim = 0, motes, rings }) => {
    const { f, at } = useT(a);
    const K = cam && cam.length ? cam : [{ t: a, s: 1.04, x: 960, y: 540 }];
    let c = camAt(f, at, K, 1.2);
    // deriva lenta siempre (nada quieto)
    c = { ...c, s: c.s * (1 + 0.035 * f / Math.max(1, d)) };
    const [jx, jy] = shakeAt(f, at, shake);
    // luz: a oscuras hasta `on`, 3 parpadeos suaves, después cálida
    let night = 0;
    if (dark) {
      const k0 = f - at(dark.on), L = dark.lvl ?? 0.8;
      night = k0 < 0 ? L : k0 < 2 ? 0.15 : k0 < 4 ? L * 0.7 : k0 < 6 ? 0.08 : 0;
    }
    return (
      <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0b0a10" }}>
        <AbsoluteFill style={camStyle(c, jx, jy)}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
            <Img src={img(k)} style={{ width: 1920, height: 1080, objectFit: "cover", filter: old ? "sepia(0.45) contrast(1.05) brightness(0.95)" : dim ? `brightness(${1 - dim})` : undefined }} />
            {(marks || []).map((m, i) => <Mark key={i} kind={m.kind} x={m.x} y={m.y} w={m.w} h={m.h} f={f} at={at(m.t)} dur={11} sw={m.sw ?? 10} />)}
            {(rings || []).map((r, i) => {
              const q0 = (f - at(r.t)) / 34;
              if (q0 < 0 || q0 > 3) return null;
              return [0, 0.33, 0.66].map((o, j) => { const q = (q0 + o) % 1; return <div key={i + "_" + j} style={{ position: "absolute", left: r.x, top: r.y, width: 40 + 360 * eo(q), height: 40 + 360 * eo(q), translate: "-50% -50%", borderRadius: "50%", border: `${6 * (1 - q) + 1}px solid rgba(255,226,150,${0.75 * (1 - q)})` }} />; });
            })}
          </div>
        </AbsoluteFill>
        {night > 0 ? <AbsoluteFill style={{ background: `rgba(6,10,30,${night})` }} /> : null}
        {night > 0 ? <AbsoluteFill style={{ background: `rgba(40,70,140,${night * 0.35})`, mixBlendMode: "color" }} /> : null}
        {motes ? <Motes f={f} op={1 - night} /> : null}
        <Chips f={f} at={at} chips={chips} />
        <Grade warm={old ? 1.4 : 1.05} vig={old ? 0.5 : 0.34} />
        <Grain />
      </AbsoluteFill>
    );
  };

// ═════════ APERTURA: la miniatura exacta 0,6 s → cobra vida (cámara, luz que respira, motas, aros en las bolitas, círculo en la cucaracha) ═════════
export const OpenThumb: P<{ k: string; ring: number; roach: number }> = ({ a, d, k, ring, roach }) => {
  const { f, at } = useT(a);
  const still = f < 18;
  const K: Cam[] = [{ t: a, s: 1, x: 960, y: 540 }, { t: a + 0.6, s: 1, x: 960, y: 540 }, { t: a + 1.4, s: 1.16, x: 930, y: 640 }];
  const c = still ? { t: 0, s: 1, x: 960, y: 540 } : camAt(f, at, K, 2.4);
  const breathe = still ? 0 : 0.05 * Math.sin((f - 18) / 11);
  const rq = (f - at(ring)) / 30;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <AbsoluteFill style={camStyle({ ...c, s: c.s * (still ? 1 : 1 + 0.03 * (f - 18) / Math.max(1, d - 18)) })}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
          <Img src={img(k)} style={{ width: 1920, height: 1080 }} />
          {!still && rq > 0 ? [0, 0.5].map((o, j) => { const q = (rq + o) % 1; return <div key={j} style={{ position: "absolute", left: 925, top: 945, width: 300 + 260 * eo(q), height: (300 + 260 * eo(q)) * 0.62, translate: "-50% -50%", borderRadius: "50%", border: `${7 * (1 - q) + 1}px solid rgba(255,232,150,${0.8 * (1 - q)})` }} />; }) : null}
          {!still ? <Mark kind="circle" x={250} y={900} w={330} h={160} f={f} at={at(roach)} dur={9} sw={11} /> : null}
        </div>
      </AbsoluteFill>
      {!still ? <AbsoluteFill style={{ background: `radial-gradient(ellipse at 58% 30%, rgba(255,214,140,${0.14 + breathe}), rgba(255,214,140,0) 60%)`, mixBlendMode: "screen" }} /> : null}
      {!still ? <Motes f={f} n={30} op={cl((f - 18) / 12)} /> : null}
    </AbsoluteFill>
  );
};

// ═════════ 60 AÑOS: odómetro 1965 → 2025, fotos de sus cocinas que caen en cada década, sello "0 COCKROACHES" ═════════
const Odo: React.FC<{ v: number; size: number }> = ({ v, size }) => {
  const H = size * 1.05, digits = 4;
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {Array.from({ length: digits }, (_, i) => {
        const p = digits - 1 - i, q = v / Math.pow(10, p), dgt = Math.floor(q) % 10;
        const low = Math.floor(v) % Math.pow(10, p), roll = p === 0 ? v % 1 : low === Math.pow(10, p) - 1 ? v % 1 : 0;
        return (
          <div key={i} style={{ position: "relative", width: size * 0.66, height: H, overflow: "hidden", background: "linear-gradient(180deg,#1b1a22,#2c2a36 50%,#1b1a22)", borderRadius: 10, boxShadow: "inset 0 10px 18px rgba(0,0,0,0.7), 0 20px 40px rgba(0,0,0,0.5)" }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, transform: `translateY(${-roll * H}px)` }}>
              {[dgt, (dgt + 1) % 10].map((x, j) => <div key={j} style={{ height: H, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: size, color: C.porc }}>{x}</div>)}
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 2, background: "rgba(0,0,0,0.5)" }} />
          </div>
        );
      })}
    </div>
  );
};
export const SixtyYears: P<{ bed: string; photos: { k: string; t: number; year: string }[]; t0: number; t1: number; stamp: number }> = ({ a, d, bed, photos, t0, t1, stamp }) => {
  const { f, at } = useT(a);
  const v = 1965 + 60 * ez(cl((f - at(t0)) / Math.max(1, at(t1) - at(t0))));
  const s = sp(f, at(stamp), 11, 240);
  const [jx, jy] = shakeAt(f, at, [stamp + 0.12]);
  const o = sp(f, 0, 13, 140);
  return (
    <Stage f={f} T={d} drift={0.5}>
      <AbsoluteFill style={{ transform: `translate(${jx}px, ${jy}px)` }}>
        <Bed k={bed} f={f} T={d} dim={0.62} />
        {photos.map((p, i) => {
          const u = sp(f, at(p.t), 14, 150), n = photos.filter((q) => f >= at(q.t)).length - 1, back = Math.max(0, n - i);
          if (f < at(p.t) - 2) return null;
          const rot = [-5, 3.5, -2, 4.5, -1][i % 5];
          return (
            <div key={i} style={{ position: "absolute", left: 600 + (i % 2 ? 26 : -22) - back * 6, top: 545 + back * 10, translate: "-50% -50%", zIndex: i,
              opacity: cl(u * 2) * (back > 2 ? 0 : 1 - back * 0.12), transform: `translateY(${(1 - u) * -520}px) rotate(${rot}deg) scale(${1 - back * 0.04})` }}>
              <Print k={p.k} w={760} h={428} f={f} mat={18} />
              <div style={{ position: "absolute", right: 30, bottom: 6, fontFamily: HAND, fontSize: 56, color: "#5A4632" }}>{p.year}</div>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 1150, top: 250, opacity: o, transform: `translateX(${(1 - o) * 120}px)` }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 10, color: C.lilac, marginBottom: 16 }}>IN MY KITCHEN</div>
          <Odo v={v} size={190} />
          <div style={{ marginTop: 26, fontFamily: HAND, fontSize: 64, color: C.porc, textShadow: shadowTxt }}>sixty years…</div>
        </div>
        {f >= at(stamp) - 1 ? (
          <div style={{ position: "absolute", left: 1460, top: 800, translate: "-50% -50%", opacity: cl(s * 3), transform: `rotate(-7deg) scale(${2.4 - 1.4 * s})`, zIndex: 20 }}>
            <div style={{ border: `10px solid ${C.red}`, borderRadius: 14, padding: "8px 34px", fontFamily: LABEL, fontWeight: 700, fontSize: 86, color: C.red, letterSpacing: 5, background: "rgba(255,248,240,0.92)", boxShadow: "0 24px 60px rgba(0,0,0,0.5)", whiteSpace: "nowrap" }}>0 COCKROACHES</div>
          </div>
        ) : null}
        <Grade vig={0.42} />
        <Grain />
      </AbsoluteFill>
    </Stage>
  );
};

// ═════════ HOY TE MUESTRO: 6 fotos que caen en su frase (grilla 3x2); una tapada "coming up"; al final la cámara entra en la última ═════════
export const TodayBoard: P<{ bed: string; head: { t: number; txt: string }; cards: { k: string; t: number; lab: string; cover?: string }[]; push?: number }> = ({ a, d, bed, head, cards, push }) => {
  const { f, at } = useT(a);
  const h = sp(f, at(head.t), 14, 160);
  const W = 480, H = 270;
  const pos = (i: number) => ({ x: 960 + ((i % 3) - 1) * 590, y: 395 + Math.floor(i / 3) * 400 });
  const last = cards.length - 1, lp = pos(last);
  const pu = push ? ez((f - at(push)) / 40) : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#15110c" }}>
      <AbsoluteFill style={{ transformOrigin: `${(lp.x / 1920) * 100}% ${(lp.y / 1080) * 100}%`, transform: `scale(${1 + 0.02 * f / d + 1.25 * pu})` }}>
        <Bed k={bed} f={f} T={d} dim={0.62} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center", opacity: cl(h * 1.5) * (1 - pu), transform: `translateY(${(1 - h) * -30}px)` }}>
          <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: C.porc, textShadow: shadowTxt }}>{head.txt}</span>
        </div>
        {cards.map((c, i) => {
          const u = sp(f, at(c.t), 13, 150), p = pos(i), rot = [-2.5, 1.8, -1.2, 2.4, -2, 1.5][i % 6];
          if (f < at(c.t) - 2) return null;
          const active = cards.reduce((m, q, j) => (f >= at(q.t) ? j : m), 0) === i;
          return (
            <div key={i} style={{ position: "absolute", left: p.x, top: p.y, translate: "-50% -50%", zIndex: active ? 9 : i, opacity: cl(u * 2),
              transform: `translateY(${(1 - u) * -260}px) rotate(${rot}deg) scale(${(0.9 + 0.1 * u) * (active ? 1.06 : 0.97)})`, filter: active || pu > 0 ? undefined : "brightness(0.78)" }}>
              <Print k={c.k} w={W} h={H} f={f} mat={13}>
                {c.cover ? <div style={{ position: "absolute", inset: "22% 8%", background: "linear-gradient(170deg,#E9D3A6,#D9BD86)", boxShadow: "0 10px 22px rgba(0,0,0,0.4)", transform: "rotate(-3deg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: C.ink }}>{c.cover}</div>
                  <div style={{ fontFamily: HAND, fontSize: 40, color: C.red }}>coming up…</div>
                </div> : null}
              </Print>
              <div style={{ position: "absolute", left: 0, right: 0, bottom: -40, textAlign: "center" }}><Chip txt={c.lab} size={36} rot={-rot / 2} bg={active ? C.lilacDeep : "#FFFDF4"} color={active ? "#fff" : C.ink} /></div>
              <div style={{ position: "absolute", left: -22, top: -26, width: 62, height: 62, borderRadius: 99, background: C.red, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 36, boxShadow: "0 10px 20px rgba(0,0,0,0.4)" }}>{i + 1}</div>
            </div>
          );
        })}
        <Grade vig={0.4} />
      </AbsoluteFill>
      <Grain />
    </AbsoluteFill>
  );
};

// ═════════ EL NOMBRE: cientos de bolitas de fondo → cartel ホウ酸団子 (PNG) + HO-SAN DANGO + traducción + sello NEVER EAT ═════════
export const DangoName: P<{ k: string; name: number; gloss: number; never: number }> = ({ a, d, k, name, gloss, never }) => {
  const { f, at } = useT(a);
  const n = sp(f, at(name), 13, 120), g = sp(f, at(gloss), 14, 160), s = sp(f, at(never), 11, 240);
  const [jx, jy] = shakeAt(f, at, [never + 0.1]);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#100c08" }}>
      <AbsoluteFill style={{ transform: `translate(${jx}px,${jy}px) scale(${1.05 + 0.1 * f / d})`, transformOrigin: "50% 60%" }}>
        <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${1 - 0.45 * n})` }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 960, top: 470, translate: "-50% -50%", opacity: cl(n * 2), transform: `perspective(1600px) rotateX(${(1 - n) * 50}deg) translateY(${(1 - n) * 200}px) rotate(-1.5deg)` }}>
        <div style={{ background: "#F7F0DE", padding: "40px 80px 46px", borderRadius: 6, boxShadow: "0 60px 110px rgba(0,0,0,0.6)", textAlign: "center", borderTop: `16px solid ${C.lilacDeep}` }}>
          <Img src={img("img/sachiko1/_st/kanji_dango.png")} style={{ height: 190, display: "block", margin: "0 auto" }} />
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 70, letterSpacing: 14, color: C.ink, marginTop: 14 }}>HO-SAN DANGO</div>
          <div style={{ fontFamily: HAND, fontSize: 64, color: C.lilacDeep, marginTop: 6, opacity: g, transform: `translateY(${(1 - g) * 20}px)` }}>"little dumplings"</div>
        </div>
      </div>
      {f >= at(never) - 1 ? (
        <div style={{ position: "absolute", left: 1420, top: 820, translate: "-50% -50%", opacity: cl(s * 3), transform: `rotate(-8deg) scale(${2.3 - 1.3 * s})` }}>
          <div style={{ border: `10px solid ${C.red}`, borderRadius: 14, padding: "6px 30px", fontFamily: LABEL, fontWeight: 700, fontSize: 84, color: C.red, letterSpacing: 5, background: "rgba(255,248,240,0.92)", boxShadow: "0 24px 60px rgba(0,0,0,0.5)", whiteSpace: "nowrap" }}>NEVER EAT</div>
        </div>
      ) : null}
      <Grade warm={1.2} vig={0.45} />
      <Grain />
    </AbsoluteFill>
  );
};

// ═════════ LA INVITACIÓN: la cebolla con aros de olor → se parte la pantalla: cebolla = THE INVITATION / polvo = THE SURPRISE ═════════
export const Invite: P<{ onion: string; powder: string; smell: number; dark: number; inv: number; sur: number; sx?: number; sy?: number }> = ({ a, d, onion, powder, smell, dark, inv, sur, sx = 960, sy = 560 }) => {
  const { f, at } = useT(a);
  const sv = sp(f, at(sur), 15, 110);
  const iv = sp(f, at(inv), 14, 160);
  const rq = (f - at(smell)) / 36;
  const dk = sp(f, at(dark), 14, 150);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${100 - 50 * sv}%`, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: -480 * sv, top: 0, width: 1920, height: 1080, transform: `scale(${1.05 + 0.08 * f / d})`, transformOrigin: `${(sx / 1920) * 100}% ${(sy / 1080) * 100}%` }}>
          <Img src={img(onion)} style={{ width: 1920, height: 1080, objectFit: "cover" }} />
          {rq > 0 ? [0, 0.33, 0.66].map((o, j) => { const q = (rq + o) % 1; return <div key={j} style={{ position: "absolute", left: sx, top: sy, width: 80 + 900 * eo(q), height: 80 + 900 * eo(q), translate: "-50% -50%", borderRadius: "50%", border: `${8 * (1 - q) + 1}px solid rgba(255,236,170,${0.7 * (1 - q)})` }} />; }) : null}
        </div>
        <div style={{ position: "absolute", left: 90, top: 110, opacity: dk * (1 - iv) }}><Chip txt="IT CALLS THEM OUT OF THE DARK" size={48} /></div>
        <div style={{ position: "absolute", left: 90, bottom: 120, opacity: iv, transform: `translateY(${(1 - iv) * 30}px)` }}><Chip txt="THE INVITATION" size={70} bg={C.lilacDeep} color="#fff" rot={-3} /></div>
      </div>
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "50%", overflow: "hidden", transform: `translateX(${(1 - sv) * 100}%)`, borderLeft: "10px solid #FBF5E6" }}>
        <Img src={img(powder)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.12 + 0.06 * f / d})` }} />
        <div style={{ position: "absolute", left: 70, bottom: 120, opacity: sv, transform: `translateY(${(1 - sv) * 30}px)` }}><Chip txt="THE SURPRISE" size={70} red rot={2} /></div>
      </div>
      <Grade vig={0.38} />
      <Grain />
    </AbsoluteFill>
  );
};

// ═════════ EL MAPA DE LA COCINA: foto cenital; la cámara va a cada lugar en su número, pin que late, la foto del lugar sale al costado y después se guarda abajo ═════════
export const PlacesMap: P<{ k: string; head: string; places: { t: number; txt: string; k: string; x: number; y: number }[]; back?: number }> = ({ a, d, k, head, places, back }) => {
  const { f, at } = useT(a);
  const act = places.reduce((m, p, i) => (f >= at(p.t) ? i : m), -1);
  const K: Cam[] = [{ t: a, s: 1.02, x: 960, y: 540 }, ...places.map((p) => ({ t: p.t, s: 1.45, x: p.x, y: p.y })), ...(back ? [{ t: back, s: 1.0, x: 960, y: 540 }] : [])];
  const c = camAt(f, at, K, 1.0);
  const h = sp(f, 0, 13, 150);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0b0a10" }}>
      <AbsoluteFill style={camStyle({ ...c, s: c.s * (1 + 0.01 * Math.sin(f / 40)) })}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
          <Img src={img(k)} style={{ width: 1920, height: 1080, objectFit: "cover", filter: "brightness(0.82)" }} />
          {places.map((p, i) => {
            const u = sp(f, at(p.t), 10, 220), pulse = i === act ? 1 + 0.15 * Math.max(0, Math.sin((f - at(p.t)) / 6)) : 1;
            if (f < at(p.t) - 1) return null;
            return (
              <div key={i} style={{ position: "absolute", left: p.x, top: p.y, transform: `translate(-50%,-100%) scale(${u / Math.max(1, c.s * 0.8)})`, transformOrigin: "50% 100%" }}>
                <div style={{ width: 84, height: 84, borderRadius: "50% 50% 50% 0", rotate: "-45deg", background: i === act ? C.red : C.lilacDeep, boxShadow: `0 0 0 ${10 * pulse}px rgba(255,255,255,${i === act ? 0.35 : 0.15}), 0 14px 26px rgba(0,0,0,0.5)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ rotate: "45deg", fontFamily: SERIF, fontWeight: 900, fontSize: 46, color: "#fff" }}>{i + 1}</div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,8,14,0.45) 0%, rgba(10,8,14,0) 22%, rgba(10,8,14,0) 70%, rgba(10,8,14,0.6) 100%)" }} />
      <div style={{ position: "absolute", left: 90, top: 60, opacity: h }}><Chip txt={head} size={46} bg={C.lilacDeep} color="#fff" rot={-1.5} /></div>
      {/* la foto del lugar activo, grande a la derecha */}
      {places.map((p, i) => {
        const on = sp(f, at(p.t) + 4, 14, 150), off = i < places.length - 1 ? sp(f, at(places[i + 1].t), 14, 160) : back ? sp(f, at(back), 14, 160) : 0;
        if (f < at(p.t) + 2 || off > 0.995) return null;
        const left = p.x < 960;
        return (
          <div key={i} style={{ position: "absolute", left: left ? 1390 : 530, top: 470, translate: "-50% -50%", opacity: cl(on * 2) * (1 - off), zIndex: 5,
            transform: `translateX(${(1 - on) * (left ? 500 : -500)}px) translateY(${off * 420}px) scale(${1 - 0.6 * off}) rotate(${left ? 2 : -2}deg)` }}>
            <Print k={p.k} w={760} h={428} f={f} mat={16} />
            <div style={{ position: "absolute", left: -26, top: -30, width: 76, height: 76, borderRadius: 99, background: C.red, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 46, boxShadow: "0 10px 24px rgba(0,0,0,0.45)" }}>{i + 1}</div>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: -44, textAlign: "center" }}><Chip txt={p.txt} size={46} rot={left ? -2 : 2} /></div>
          </div>
        );
      })}
      {/* la tira de lugares ya vistos */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, display: "flex", justifyContent: "center", gap: 14 }}>
        {places.map((p, i) => {
          const u = sp(f, at(i < places.length - 1 ? places[i + 1].t : back || 1e9) + 6, 14, 170);
          return <div key={i} style={{ width: 150, height: 84, borderRadius: 6, overflow: "hidden", border: "4px solid #FFFDF8", boxShadow: "0 10px 20px rgba(0,0,0,0.5)", opacity: u, transform: `translateY(${(1 - u) * 40}px)` }}><Img src={img(p.k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>;
        })}
      </div>
      <Grade vig={0.32} />
      <Grain />
    </AbsoluteFill>
  );
};

// ═════════ POR QUÉ FUNCIONA: sale de la grieta → camino punteado a la tapita → aros de olor → "EATS A LITTLE" → vuelve a casa → la cámara entra en la grieta → oscuridad + frase ═════════
const pathD = (p: [number, number], q: [number, number], bend: number) => {
  const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, dx = q[0] - p[0], dy = q[1] - p[1];
  return `M ${p[0]} ${p[1]} Q ${mx - dy * bend} ${my + dx * bend} ${q[0]} ${q[1]}`;
};
export const TrailHome: P<{ k: string; crack: [number, number]; cap: [number, number]; out: number; smell: number; eat: number; back: number; never: number }> = ({ a, d, k, crack, cap, out, smell, eat, back, never }) => {
  const { f, at } = useT(a);
  const go = eo(cl((f - at(out)) / 50)), ret = eo(cl((f - at(back)) / 40));
  const K: Cam[] = [{ t: a, s: 1.1, x: (crack[0] + cap[0]) / 2, y: (crack[1] + cap[1]) / 2 }, { t: eat, s: 1.35, x: cap[0], y: cap[1] }, { t: back + 0.9, s: 1.3, x: crack[0], y: crack[1] }, { t: Math.max(back + 2.1, never), s: 5.5, x: crack[0], y: crack[1] }];
  const c = camAt(f, at, K, 1.3);
  const night = cl((f - Math.max(at(back) + 45, at(never) - 16)) / 16);
  const nv = sp(f, at(never), 14, 120);
  const e = sp(f, at(eat), 13, 190);
  const rq = (f - at(smell)) / 30;
  const L1 = pathD(crack, cap, 0.25), L2 = pathD(cap, crack, 0.25);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <AbsoluteFill style={camStyle(c)}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
          <Img src={img(k)} style={{ width: 1920, height: 1080, objectFit: "cover" }} />
          {/* el camino se dibuja: máscara por longitud */}
          <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.6))" }}>
            <defs>
              <mask id="m1"><path d={L1} fill="none" stroke="#fff" strokeWidth={20} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - go} /></mask>
              <mask id="m2"><path d={L2} fill="none" stroke="#fff" strokeWidth={20} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ret} /></mask>
            </defs>
            <path d={L1} fill="none" stroke="#FFF4DA" strokeWidth={9} strokeLinecap="round" strokeDasharray="3 24" mask="url(#m1)" />
            <path d={L2} fill="none" stroke={C.red} strokeWidth={10} strokeLinecap="round" strokeDasharray="3 24" mask="url(#m2)" transform="translate(0,26)" />
          </svg>
          {rq > 0 && rq < 4 ? [0, 0.33, 0.66].map((o, j) => { const q = (rq + o) % 1; return <div key={j} style={{ position: "absolute", left: cap[0], top: cap[1], width: 30 + 300 * eo(q), height: (30 + 300 * eo(q)) * 0.55, translate: "-50% -50%", borderRadius: "50%", border: `${6 * (1 - q) + 1}px solid rgba(255,226,150,${0.8 * (1 - q)})` }} />; }) : null}
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 110, top: 100, opacity: e * (1 - cl((f - at(back)) / 10)), transform: `translateY(${(1 - e) * 26}px)` }}><Chip txt="IT EATS A LITTLE" size={58} /></div>
      <div style={{ position: "absolute", left: 110, top: 100, opacity: sp(f, at(back), 13, 190) * (1 - night) }}><Chip txt="…AND GOES BACK HOME" size={58} red /></div>
      <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${night})` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", opacity: nv * night, transform: `translateY(${(1 - nv) * 20}px)`, fontFamily: SERIF, fontWeight: 800, fontSize: 92, color: C.porc }}>…and it does not come out again.</div>
      <Grade vig={0.38} />
      <Grain />
    </AbsoluteFill>
  );
};

// ═════════ LAS SEMANAS: tres tarjetas de calendario que caen en su frase sobre la cocina a oscuras ═════════
export const WeekStrip: P<{ bed: string; head: { t: number; txt: string }; weeks: { t: number; lab: string; txt: string; tone: "warn" | "good" }[] }> = ({ a, d, bed, head, weeks }) => {
  const { f, at } = useT(a);
  const h = sp(f, at(head.t), 14, 160);
  return (
    <Stage f={f} T={d} drift={0.6}>
      <Bed k={bed} f={f} T={d} dim={0.4} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", opacity: h, transform: `translateY(${(1 - h) * -30}px)` }}>
        <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 80, color: C.porc, textShadow: shadowTxt }}>{head.txt}</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center", gap: 60 }}>
        {weeks.map((w, i) => {
          const u = sp(f, at(w.t), 13, 150);
          return (
            <div key={i} style={{ width: 470, opacity: cl(u * 2), transform: `translateY(${(1 - u) * -300}px) rotate(${[-2, 1.5, -1][i % 3]}deg)` }}>
              <div style={{ background: "#FBF5E6", borderRadius: 10, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.55)" }}>
                <div style={{ background: w.tone === "good" ? C.lilacDeep : C.red, padding: "18px 0", textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 46, letterSpacing: 8, color: "#fff" }}>{w.lab}</div>
                <div style={{ padding: "34px 30px 40px", textAlign: "center", fontFamily: HAND, fontSize: 58, lineHeight: 1.1, color: C.ink, minHeight: 150 }}>{w.txt}</div>
              </div>
            </div>
          );
        })}
      </div>
      <Grade vig={0.42} />
      <Grain />
    </Stage>
  );
};

// ═════════ PAR: dos fotos que caen en su palabra, con su rótulo (niños / mascotas · primavera / otoño) ═════════
export const Pair: P<{ bed: string; items: { k: string; t: number; txt: string }[]; head?: { t: number; txt: string } }> = ({ a, d, bed, items, head }) => {
  const { f, at } = useT(a);
  const h = head ? sp(f, at(head.t), 14, 160) : 0;
  return (
    <Stage f={f} T={d} drift={0.6}>
      <Bed k={bed} f={f} T={d} dim={0.55} />
      {head ? <div style={{ position: "absolute", left: 0, right: 0, top: 80, textAlign: "center", opacity: h }}><span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 80, color: C.porc, textShadow: shadowTxt }}>{head.txt}</span></div> : null}
      {items.map((x, i) => {
        const u = sp(f, at(x.t), 13, 150), R = i ? 2.2 : -2.5;
        if (f < at(x.t) - 2) return null;
        return (
          <div key={i} style={{ position: "absolute", left: i ? 1400 : 520, top: 540, translate: "-50% -50%", opacity: cl(u * 2), transform: `translateY(${(1 - u) * 320}px) rotate(${R}deg)` }}>
            <Print k={x.k} w={740} h={470} f={f} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: -60, textAlign: "center" }}><Chip txt={x.txt} size={52} rot={-R} bg={i ? C.lilacDeep : C.red} color="#fff" /></div>
          </div>
        );
      })}
      <Grade vig={0.42} />
      <Grain />
    </Stage>
  );
};

export const SAC: Record<string, React.FC<any>> = { PhotoBeats, OpenThumb, SixtyYears, TodayBoard, DangoName, Invite, PlacesMap, TrailHome, WeekStrip, Pair };
