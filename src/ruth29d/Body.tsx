// ruth29 · EL VIDEO ENTERO (locución 0 → final). Un solo mundo (la cocina de Ruth, su campo y su galpón) con una cámara que viaja;
// el avatar entra y sale con CORTE SECO en sus ventanas pagadas; Veo / fotos por tramos anclados a su frase (plan_ruth.py);
// un componente único por minuto (heroes.json → comps.tsx). Audio fuera de Remotion (encfin).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import PLAN from "./plan.json";
import HEROES from "./heroes.json";
import { COL, FONT, LowerThird, Vid, e } from "./lib";
import { Avatar, OK, Shot, WIN, World } from "./parts";
import { CamaraMano } from "../kits/camara/CamaraMano";
import { H, phys, cl, eIn, HAND, MARK } from "./hkit";
import { CoverFlow } from "./premium";
import { HC } from "./comps";

type Seg = [number, number, string, string];
type Ov = { k: string; at: number; out: number; [x: string]: any };
type Txt = { file: string; lower2: string; ask: string; next: string; mis: string[] };
const PL = PLAN as unknown as { segs: Seg[]; ov: Ov[]; end: number; lower: [number, number]; txt: Txt; cta: { sub: number; ask: number; next: number; end: number } };
export const END = PL.end;
// cortes sin hueco: un hueco < 0,2 s entre el avatar y la toma vecina dejaba ver 1-2 cuadros del mundo
for (const g of PL.segs) {
  if (g[2] !== "veo" && g[2] !== "shot") continue;
  const prevEnd = Math.max(-1, ...WIN.map((w) => w.me).filter((x) => x <= g[0] + 1e-6), ...PL.segs.filter((h) => h !== g && h[2] !== "world" && h[1] <= g[0] + 1e-6).map((h) => h[1]));
  if (g[0] - prevEnd > 0 && g[0] - prevEnd < 0.2) g[0] = prevEnd;
  const nextAv = Math.min(1e9, ...WIN.map((w) => w.ms).filter((x) => x >= g[1] - 1e-6));
  if (nextAv - g[1] > 0 && nextAv - g[1] < 0.2) g[1] = nextAv;
}

const base = (t: number): React.ReactNode => {
  const i = PL.segs.findIndex(([a, b]) => t >= a && t < b);
  if (i < 0) return <World t={t} />;
  const [a, , k, id] = PL.segs[i];
  if (k === "veo") return OK.has(id) ? <AbsoluteFill style={{ transform: `scale(${1.02 + 0.03 * e(t, a, a + 8)})` }}><Vid id={"veo/" + id} at={a} /></AbsoluteFill> : <World t={t} />;
  if (k === "shot") return <Shot k={id} t={t} a={a} i={i} />;
  return <World t={t} />;
};
const Stage: React.FC<{ t: number }> = ({ t }) => (WIN.some((x) => t >= x.ms && t < x.me) ? <Avatar t={t} /> : <>{base(t)}</>);
const nowAv = (t: number) => WIN.some((w) => t >= w.ms && t < w.me);

// foto más cercana a un segundo (fondo desenfocado de cada componente y material de las piezas)
const imgNear = (t: number, used: Set<string>, max = 40): string | undefined => {
  let best: string | undefined, bd = max;
  for (const [a, b, k, id] of PL.segs) { if (k !== "shot" || used.has(id)) continue; const d = t < a ? a - t : t > b ? t - b : 0; if (d < bd) { bd = d; best = id; } }
  if (best) used.add(best); return best;
};
const HS: H[] = (HEROES as H[]).map((h) => {
  const u = new Set<string>();
  const out: H = { ...h, bg: imgNear(h.at + 1, u) };
  if (h.imgsAt) out.imgs = (h.imgsAt as number[]).map((x) => imgNear(x, u, 400));
  return out;
});
const Heroes: React.FC<{ t: number }> = ({ t }) => <>{HS.map((h, i) => { const C = HC[h.k]; return C && t > h.at - 0.1 && t < h.out + 0.9 ? <C key={i} t={t} h={h} /> : null; })}</>;

// ===== los 5 errores: carrusel 3D de tarjetas 9:16 con foto (sobre el avatar se esconde) =====
const MIS = PL.ov.filter((o) => o.k === "mistake").sort((a, b) => a.n - b.n);
const Mistakes: React.FC<{ t: number }> = ({ t }) => MIS.length ? <CoverFlow t={t} at={MIS[0].at - 0.6} out={MIS[MIS.length - 1].out} hide={nowAv(t)} kicker="" title="" col="red"
  cards={MIS.map((m, i) => ({ img: imgNear(m.at + 2, new Set(MIS.slice(0, i).map((x) => String(x.img ?? ""))), 400) ?? undefined, at: m.at, n: m.n, title: m.txt }))} /> : null;

// ===== CTA (sin guía): una ficha de archivo que se estampa para suscribirse, la pregunta escrita a mano en una tarjeta, y el próximo FILE =====
const CTA: React.FC<{ t: number }> = ({ t }) => {
  const c = PL.cta, left = nowAv(c.sub + 1);
  const sub = phys(t, c.sub, 6, 0.42) * (1 - eIn(t, c.ask - 0.2, c.ask + 0.5));
  const ask = phys(t, c.ask, 6, 0.45) * (1 - eIn(t, c.next - 0.4, c.next + 0.3));
  const nx = phys(t, c.next, 5, 0.5) * (1 - eIn(t, c.end - 0.4, c.end + 0.6));
  const bell = Math.max(0, 1 - Math.abs(t - c.sub - 1.4) * 2.5) * Math.sin(t * 38) * 12;
  return <>
    {sub > 0.01 && <div style={{ position: "absolute", left: left ? 90 : 700, bottom: 96, display: "flex", alignItems: "center", gap: 24, opacity: cl(sub * 2), transform: `translateY(${(1 - sub) * 140}px) rotate(${(1 - sub) * -6}deg)`, fontFamily: FONT }}>
      <div style={{ width: 120, height: 120, position: "relative", transformOrigin: "50% 10%", transform: `rotate(${bell}deg)` }}>
        <div style={{ position: "absolute", left: 14, right: 14, top: 8, bottom: 22, borderRadius: "60px 60px 10px 10px", background: "linear-gradient(90deg,#7a5a1c,#f2d27e 38%,#a9832d)" }} />
        <div style={{ position: "absolute", left: 50, bottom: 4, width: 20, height: 20, borderRadius: "50%", background: "#a9832d" }} />
      </div>
      <div style={{ padding: "20px 36px", borderRadius: 10, background: "linear-gradient(#e9d7a8,#d5bd85)", color: "#3a2a12", fontWeight: 900, fontSize: 50, letterSpacing: 3, boxShadow: "0 24px 50px rgba(0,0,0,.55), inset 0 0 0 3px rgba(80,50,10,.25)" }}>SUBSCRIBE</div>
    </div>}
    {ask > 0.01 && <div style={{ position: "absolute", left: left ? 90 : 1160, top: 150, width: 580, padding: "34px 40px 40px", background: "repeating-linear-gradient(#fbf8ef 0 54px,#9fc0dd 54px 56px)", borderTop: "8px solid #d9534f", borderRadius: 6, boxShadow: "0 30px 60px rgba(0,0,0,.55)", transformOrigin: "50% 0", transform: `translateY(${(1 - ask) * -320}px) rotate(${-2 + 1.5 * Math.sin(t * 1.1)}deg)`, opacity: cl(ask * 2) }}>
      <div style={{ fontFamily: HAND, fontSize: 60, color: "#22314f", lineHeight: 1.05 }}>{PL.txt.ask}</div>
    </div>}
    {nx > 0.01 && <div style={{ position: "absolute", left: left ? 120 : 960, top: left ? 620 : 560, transform: `${left ? "" : "translate(-50%,-50%)"} translateX(${(1 - nx) * 700}px) rotate(${(1 - nx) * 8 - 2}deg) scale(${left ? 0.62 : 1})`, transformOrigin: "0 0", opacity: cl(nx * 2) }}>
      <div style={{ width: 760, height: 420, position: "relative" }}>
        <div style={{ position: "absolute", left: 30, top: 0, width: 240, height: 60, borderRadius: "14px 14px 0 0", background: "#d9be82" }} />
        <div style={{ position: "absolute", left: 0, top: 46, right: 0, bottom: 0, borderRadius: 12, background: "linear-gradient(160deg,#e6cf96,#c9ab6a)", boxShadow: "0 40px 80px rgba(0,0,0,.6)", padding: "56px 54px" }}>
          <div style={{ fontFamily: MARK, fontSize: 44, color: "#7a2a1a" }}>{PL.txt.file}</div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 50, color: "#2a1d0c", lineHeight: 1.1, marginTop: 18 }}>{PL.txt.next}</div>
        </div>
      </div>
    </div>}
  </>;
};

export const Body: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const fade = e(t, END - 1.2, END - 0.1);
  return <AbsoluteFill style={{ background: "#000" }}>
    {/* cámara a mano virtual (balanceo lento, no temblor) sobre todo lo filmado */}
    <CamaraMano intensidad={0.8}><Stage t={t} /></CamaraMano>
    <LowerThird t={t} at={PL.lower[0]} out={PL.lower[1]} name="RUTH DALBY" l2={PL.txt.lower2} l2at={PL.lower[0] + 1} />
    <Mistakes t={t} />
    <Heroes t={t} />
    <CTA t={t} />
    <AbsoluteFill style={{ background: "#000", opacity: fade }} />
  </AbsoluteFill>;
};
