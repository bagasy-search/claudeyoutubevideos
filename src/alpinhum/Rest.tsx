// alpinhum · el RESTO (104 s → final) y la composición completa. Un solo mundo: la misma pared, el corte, el patio y la mesa
// del minuto 1 siguen vivos; entre las ventanas del avatar, cada tramo es el mundo (cámara por tomas con nombre, CP) o una
// toma real (LTX o foto con empuje). Los rótulos nacen con SU frase (rest_plan.json lo arma plan_rest.py con la voz).
// Audio fuera de Remotion. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import PLAN from "./rest_plan.json";
import { KEYS, CP, BOOK_MK, screenOf } from "./muro3d";
import { Avatar, ChipsAt, LinkCard, Min1, Shot, Stamp, WIN, World } from "./Min1";
import { BigNum, COL, Flash, FONT, Tag, e, ei, extrude, s, spr } from "./lib";

type V3 = [number, number, number];
type Seg = { a: number; b: number; w?: string[]; k?: string; z?: [number, number] | null };
type Ov = { t: string; at: number; out: number; [k: string]: unknown };
const P = PLAN as unknown as { seg: Seg[]; ov: Ov[]; book: { at: number; out: number; box: [number, number, number, number]; col?: string }[]; end: number };
export const END = P.end;
export const FULL_FRAMES = s(END + 0.4);
const SWITCH = 104.0; // hasta acá manda Min1 (los dos muestran el avatar en este segundo)

// ---- cámara: cada tramo de mundo = recorrido por las tomas con nombre (arco al volar por arriba) ----
for (const sg of P.seg) if (sg.w) {
  const c = sg.w, n = c.length - 1;
  KEYS.push({ t: sg.a - 0.05, ...CP[c[0]] });
  c.forEach((nm, i) => KEYS.push({ t: n ? sg.a + ((sg.b - sg.a) * i) / n : sg.a, ...CP[nm], arc: nm === "top" || nm === "bookW" ? 0.1 : undefined }));
  if (!n) KEYS.push({ t: sg.b, ...CP[c[0]], p: [CP[c[0]].p[0] - 0.08, CP[c[0]].p[1] + 0.03, CP[c[0]].p[2] - 0.1] as V3 });
  KEYS.push({ ...KEYS[KEYS.length - 1], t: sg.b + 0.05, arc: undefined });
}
KEYS.sort((x, y) => x.t - y.t);
BOOK_MK.push(...P.book);

// ---- la línea de tiempo: ventanas del avatar + tramos del plan ----
type Blk = { a: number; b: number; kind: "av" | "w" | "s"; seg?: Seg };
const BL: Blk[] = [
  ...WIN.filter((w) => w.me > SWITCH - 3).map((w) => ({ a: w.ms, b: w.me, kind: "av" as const })),
  ...P.seg.map((sg) => ({ a: sg.a, b: sg.b, kind: (sg.w ? "w" : "s") as "w" | "s", seg: sg })),
].sort((x, y) => x.a - y.a);
const TR = 0.34; // barrido entre tomas

const Body: React.FC<{ b: Blk; t: number }> = ({ b, t }) => {
  if (b.kind === "av") return <Avatar t={t} />;
  if (b.kind === "w") return <World t={Math.min(Math.max(t, b.a), b.b + 0.04)} />;
  const sg = b.seg!;
  return <Shot k={sg.k!} t={t} a={sg.a} z={sg.z ?? [1.03, 1.11]} dur={sg.b - sg.a + TR} />;
};

// ---- rótulos propios del resto ----
const Check: React.FC<{ t: number; at: number; out: number; items: { at: number; tx: string }[] }> = ({ t, at, out, items }) => {
  const k = spr(t, at, 0.8), o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.35));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 70, top: 120, perspective: 1400, opacity: o }}>
      <div style={{ transform: `rotateY(${12 + (1 - Math.min(1, k)) * 50}deg) translateZ(${(1 - Math.min(1, k)) * -400}px)`, transformOrigin: "0 50%", width: 640, padding: "26px 34px 30px", borderRadius: 24,
        background: "linear-gradient(180deg, rgba(44,28,16,.94), rgba(22,14,8,.94))", boxShadow: `0 50px 90px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.15), 0 0 0 2px ${COL.amber}55`, fontFamily: FONT }}>
        <div style={{ fontWeight: 900, fontSize: 34, letterSpacing: 6, color: COL.amber, marginBottom: 10 }}>LO IMPORTANTE</div>
        {items.map((it, i) => {
          const a = e(t, it.at, it.at + 0.25), c = e(t, it.at + 0.15, it.at + 0.45);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, margin: "12px 0", opacity: 0.25 + 0.75 * a, transform: `translateX(${(1 - a) * -30}px)` }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, border: `3px solid ${a > 0.5 ? "#7dffb8" : "rgba(255,255,255,.4)"}`, display: "grid", placeItems: "center", color: "#7dffb8", fontWeight: 900, fontSize: 32 }}>{c > 0.05 ? "✓" : ""}</div>
              <div style={{ fontWeight: 800, fontSize: 36, color: COL.ink, letterSpacing: 1 }}>{it.tx}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
const Ask: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const k = spr(t, at, 0.8), o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.35));
  if (o <= 0.01) return null;
  const opt = (tx: string, d: number, col: string) => {
    const a = e(t, at + d, at + d + 0.3);
    return <div style={{ flex: 1, padding: "22px 0", borderRadius: 18, textAlign: "center", background: "rgba(255,255,255,.06)", boxShadow: `0 0 0 3px ${col}`, opacity: a, transform: `translateY(${(1 - a) * 30}px)`, fontWeight: 900, fontSize: 44, color: col }}>{tx}</div>;
  };
  return (
    <div style={{ position: "absolute", left: 960, top: 560, perspective: 1500, opacity: o }}>
      <div style={{ transform: `translate(-50%,-50%) translateZ(${(1 - Math.min(1, k)) * -500}px) rotateX(${10 - 6 * Math.min(1, k)}deg)`, width: 1180, padding: "34px 44px 40px", borderRadius: 26,
        background: "linear-gradient(180deg, rgba(28,30,34,.96), rgba(16,17,20,.96))", boxShadow: "0 70px 120px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.12)", fontFamily: FONT }}>
        <div style={{ color: "rgba(255,255,255,.6)", fontWeight: 800, fontSize: 26, letterSpacing: 4 }}>💬 CONTÉSTEME EN LOS COMENTARIOS</div>
        <div style={{ color: "#fff", fontWeight: 900, fontSize: 52, margin: "16px 0 26px", textShadow: extrude(4, "#000") }}>En su casa, la mancha empieza…</div>
        <div style={{ display: "flex", gap: 30 }}>{opt("ABAJO · EN EL ZÓCALO", 0.6, "#ffb257")}{opt("ARRIBA · EN LAS ESQUINAS", 1.4, "#8fd6ff")}</div>
      </div>
    </div>
  );
};

const Overlay: React.FC<{ o: Ov; t: number }> = ({ o, t }) => {
  const g = (k: string) => o[k] as never;
  if (o.t === "tag") {
    const pt = o.pt as V3 | null;
    const q = pt ? screenOf(t, pt) : { x: g("x") as number, y: g("y") as number };
    // el rótulo nunca se corta: si no entra del lado pedido, va del otro (se decide UNA vez, con la cámara de su arranque)
    // (la cámara se mueve mientras está: se mira toda su vida y se elige el lado que menos se sale, prefiriendo el pedido)
    const sz = (g("size") as number) ?? 46, w = String(g("text")).length * (sz * 0.72 + 2) + 40;
    const qs = pt ? [0.3, 0.5, 0.75, 1].map((f) => screenOf(o.at + 0.3 + (o.out - o.at - 0.3) * f, pt)) : [q];
    let dx = (g("dx") as number) ?? 120, dy = (g("dy") as number) ?? -90;
    // del lado derecho el rótulo arranca en x+dx; del izquierdo termina en x+dx → se acorta la línea hasta que entre
    const R = Math.min(...qs.map((p) => 1890 - w - p.x)), Lf = Math.max(...qs.map((p) => 30 + w - p.x));
    const right = dx >= 0 ? Math.min(dx, R) : Math.min(Math.abs(dx), R), left = dx < 0 ? Math.max(dx, Lf) : Math.max(-Math.abs(dx), Lf);
    const okR = right >= 20, okL = left <= -20;
    if (dx >= 0) dx = okR ? right : okL ? left : (R > -Lf ? 20 : -20);
    else dx = okL ? left : okR ? right : (R > -Lf ? 20 : -20);
    const y0 = qs[0].y;
    if (y0 + dy < 70) dy = 70 - y0; else if (y0 + dy > 1010) dy = 1010 - y0;
    return <Tag t={t} at={o.at} out={o.out} x={q.x} y={q.y} dx={dx} dy={dy} text={g("text")} sub={g("sub") ?? undefined} col={g("col") ?? COL.ink} size={sz} />;
  }
  if (o.t === "big") return <BigNum t={t} at={o.at} out={o.out} text={g("text")} x={g("x")} y={g("y")} size={g("size")} col={g("col") ?? "#fff1cf"} edge={g("edge") ?? "#4a3a20"} sub={g("sub") ?? undefined} />;
  if (o.t === "stamp") return <Stamp t={t} at={o.at} out={o.out} text={g("text")} x={g("x")} y={g("y")} size={g("size")} col={g("col") ?? undefined} />;
  if (o.t === "chips") return <ChipsAt t={t} out={o.out} items={g("items")} y={g("y")} />;
  if (o.t === "check") return <Check t={t} at={o.at} out={o.out} items={g("items")} />;
  if (o.t === "link") return <LinkCard t={t} at={o.at} out={o.out} />;
  if (o.t === "ask") return <Ask t={t} at={o.at} out={o.out} />;
  return null;
};
const ovStart = (o: Ov) => (o.t === "chips" || o.t === "check" ? Math.min(o.at ?? 1e9, ...((o.items as { at: number }[]) ?? []).map((x) => x.at)) : o.at);

export const Rest: React.FC<{ t: number }> = ({ t }) => {
  let i = BL.findIndex((b, j) => t >= b.a && (j + 1 >= BL.length || t < BL[j + 1].a));
  if (i < 0) i = 0;
  const cur = BL[i], prev = BL[i - 1];
  const L: React.ReactNode[] = [];
  const k = prev ? ei(t, cur.a, cur.a + TR) : 1;
  if (prev && k < 1 && !(prev.kind === "w" && cur.kind === "w")) {
    if (cur.kind === "w") {
      // al mundo: se abre un círculo desde el centro
      L.push(<AbsoluteFill key="pv"><Body b={prev} t={t} /></AbsoluteFill>);
      L.push(<AbsoluteFill key="cu" style={{ clipPath: `circle(${k * 1150}px at 960px 540px)` }}><Body b={cur} t={t} /></AbsoluteFill>);
    } else {
      const dir = i % 2 ? 1 : -1;
      L.push(<AbsoluteFill key="pv" style={{ transform: `translateX(${-dir * k * 1920}px)` }}><Body b={prev} t={t} /></AbsoluteFill>);
      L.push(<AbsoluteFill key="cu" style={{ transform: `translateX(${dir * (1 - k) * 1920}px)` }}><Body b={cur} t={t} /></AbsoluteFill>);
    }
  } else L.push(<AbsoluteFill key="cu"><Body b={cur} t={t} /></AbsoluteFill>);
  if (prev && prev.kind === "w" && cur.kind === "w") L.push(<Flash key="fl" t={t} at={cur.a + 0.02} col="#fff6e6" peak={0.45} w={0.25} />);
  for (const [j, o] of P.ov.entries()) if (t >= ovStart(o) - 0.05 && t <= o.out + 0.5) L.push(<Overlay key={"o" + j} o={o} t={t} />);
  return <AbsoluteFill style={{ background: "#0b0e13" }}>{L}</AbsoluteFill>;
};

export const Full: React.FC = () => {
  const t = useCurrentFrame() / 30;
  return t < SWITCH ? <Min1 /> : <Rest t={t} />;
};
