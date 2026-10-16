// ── HÉROES de Abuela Rosa · rosa7 (25 comidas con ARROZ, 16-oct-2026) ──
// El mundo de Rosa: azulejo azul y blanco de su cocina, papel amarillento del recetario, libreta de cuentas a lápiz,
// calendario de pared, frasco de cáscaras, mantel de la mesa para uno. Cada golpe en SU palabra (t = segundo absoluto).
// Familias: Fraunces (SERIF) + Caveat (HAND). Sin grano, sin viñeta, sin temblor.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { Bed, sp, useT, ez, eo, cl, img, SERIF, HAND, P } from "../lkit/core";

const AZUL = "#1F4E8C", AZUL2 = "#2E66A8", CREMA = "#F7EFDD", PAPEL = "#EFE0BC", TINTA = "#2B2118", ROSA = "#C24D68", TERRA = "#A85A32", LAPIZ = "#3A3A44";
const sombra = "0 30px 60px rgba(15,10,5,0.55), 0 6px 14px rgba(0,0,0,0.3)";
const txtSh = "0 4px 18px rgba(0,0,0,0.8)";
type Beat = { t: number; txt: string };
const papel: React.CSSProperties = { background: "radial-gradient(ellipse at 35% 25%, #FBF3DF 0%, #F0E2BF 62%, #E2CD9B 100%)" };
const rayado: React.CSSProperties = { backgroundImage: "repeating-linear-gradient(180deg, transparent 0 61px, rgba(46,102,168,0.28) 61px 63px)", backgroundPosition: "0 40px" };
// azulejo de la cocina de Rosa (SVG repetido): flor azul de 4 pétalos sobre blanco roto
const tile = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' fill='#F4F1E8'/><rect x='1' y='1' width='118' height='118' fill='none' stroke='#C9C3B3' stroke-width='2'/><g fill='#2E5FA0'><ellipse cx='60' cy='36' rx='11' ry='20'/><ellipse cx='60' cy='84' rx='11' ry='20'/><ellipse cx='36' cy='60' rx='20' ry='11'/><ellipse cx='84' cy='60' rx='20' ry='11'/></g><circle cx='60' cy='60' r='8' fill='#F4F1E8'/><circle cx='60' cy='60' r='4' fill='#C24D68'/><g fill='#2E5FA0'><path d='M0 0h14L0 14z'/><path d='M120 0h-14l14 14z'/><path d='M0 120h14L0 106z'/><path d='M120 120h-14l14-14z'/></g></svg>`);
const azulejo = (s = 1): React.CSSProperties => ({ backgroundImage: `url("data:image/svg+xml,${tile}")`, backgroundSize: `${120 * s}px ${120 * s}px` });
const madera: React.CSSProperties = { background: "repeating-linear-gradient(90deg, #6E4A2C 0px, #7B5433 46px, #5F3F24 48px, #74502F 132px, #563820 134px)" };
const Escrito: React.FC<{ f: number; at: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ f, at, dur = 18, children, style }) => {
  const u = cl((f - at) / dur);
  return <div style={{ whiteSpace: "nowrap", ...style, clipPath: `inset(-20% ${100 - u * 112}% -20% -5%)`, paddingRight: 14 }}>{children}</div>;
};
const Foto: React.FC<{ k: string; f: number; d: number; z?: [number, number]; style?: React.CSSProperties }> = ({ k, f, d, z = [1.04, 1.12], style }) => (
  <div style={{ overflow: "hidden", ...style }}><Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z[0] + (z[1] - z[0]) * f / Math.max(1, d)})` }} /></div>
);

// 1 · SEMANA: la bolsa de arroz en la mesa y debajo una tira de 7 platitos (LUN…DOM) que se llenan en su palabra
export const Semana: P<{ bed: string; title: string; days: Beat[] }> = ({ a, d, bed, title, days }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 120);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Foto k={bed} f={f} d={d} style={{ position: "absolute", inset: 0 }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,8,5,0.55) 0%, rgba(10,8,5,0) 30%, rgba(10,8,5,0) 52%, rgba(10,8,5,0.82) 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 52, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: CREMA, textShadow: txtSh,
        opacity: cl(u * 1.6), transform: `translateY(${(1 - u) * -30}px)` }}>{title}</div>
      <div style={{ position: "absolute", left: 120, right: 120, bottom: 70, display: "flex", justifyContent: "space-between" }}>
        {days.map((x, i) => {
          const v = sp(f, at(x.t) + i * 2, 12, 170);
          return (
            <div key={i} style={{ width: 210, textAlign: "center", opacity: cl(v * 1.8), transform: `translateY(${(1 - v) * 90}px)` }}>
              <div style={{ width: 190, height: 190, margin: "0 auto", borderRadius: "50%", background: "radial-gradient(circle, #FFFFFF 55%, #E8E4DA 56%, #FFFFFF 66%, #DCD6C8 100%)",
                boxShadow: sombra, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 120, height: 120, borderRadius: "50%", border: `4px solid ${AZUL2}`, background: `radial-gradient(circle at 45% 40%, #FFFDF6 0 40%, #F2ECDC 70%)` }} />
              </div>
              <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 50, color: CREMA, marginTop: 12, textShadow: txtSh, letterSpacing: 3 }}>{x.txt}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// 2 · CALENDARIO: hoja de calendario de pared sobre el azulejo; el mes se escribe, el "martes" se encierra en un círculo a lápiz
export const Calendario: P<{ bed: string; mes: string; t: number; sub: string; dia: string; td: number }> = ({ a, d, bed, mes, t, sub, dia, td }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(t), 14, 110), c = ez((f - at(td) - 6) / 22);
  const dias = ["L", "M", "M", "J", "V", "S", "D"];
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...azulejo(1.1) }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 40%, rgba(20,15,10,0.35) 100%)" }} />
      <div style={{ position: "absolute", left: 960, top: 560, translate: "-50% -50%", width: 760, height: 900, ...papel, borderRadius: 6, boxShadow: sombra,
        transform: `rotate(${-2 + (1 - u) * -8}deg) translateY(${(1 - u) * -700}px)`, transformOrigin: "50% 0%" }}>
        <div style={{ position: "absolute", left: 360, top: -26, width: 40, height: 40, borderRadius: "50%", background: "#8B8B8B", boxShadow: "0 4px 8px rgba(0,0,0,0.5)" }} />
        <div style={{ height: 180, background: ROSA, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 130, color: CREMA, letterSpacing: 10 }}>{mes}</div>
        <div style={{ textAlign: "center", fontFamily: HAND, fontSize: 64, color: TINTA, marginTop: 10 }}>{sub}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "18px 40px", rowGap: 10 }}>
          {dias.map((x, i) => <div key={i} style={{ textAlign: "center", fontFamily: SERIF, fontWeight: 800, fontSize: 40, color: i === 1 ? ROSA : AZUL }}>{x}</div>)}
          {Array.from({ length: 28 }).map((_, i) => <div key={"n" + i} style={{ textAlign: "center", fontFamily: SERIF, fontSize: 44, color: TINTA, opacity: 0.85, position: "relative" }}>
            {i + 1}
            {i === 15 ? <svg width={120} height={90} style={{ position: "absolute", left: "50%", top: "50%", translate: "-50% -50%" }}><ellipse cx={60} cy={45} rx={50} ry={34} fill="none" stroke={ROSA} strokeWidth={6}
              strokeDasharray={340} strokeDashoffset={340 * (1 - c)} strokeLinecap="round" transform="rotate(-8 60 45)" /></svg> : null}
          </div>)}
        </div>
        <div style={{ position: "absolute", right: 40, bottom: 40, fontFamily: HAND, fontWeight: 700, fontSize: 70, color: ROSA, opacity: cl(c * 2), transform: `rotate(-6deg)` }}>{dia} · Antonio</div>
      </div>
    </AbsoluteFill>
  );
};

// 3 · BUCLES: tres fichas de receta amarillentas, cada una con su número grande, que caen sobre la mesa en su palabra
export const Bucles: P<{ bed: string; items: { t: number; n: string; txt: string }[] }> = ({ a, d, bed, items }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...madera }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.55} blur={10} />
      {items.map((x, i) => {
        if (f < at(x.t)) return null;
        const v = sp(f, at(x.t), 12, 130), rot = [-5, 2, -2][i % 3], X = 360 + i * 600;
        return (
          <div key={i} style={{ position: "absolute", left: X, top: 540, translate: "-50% -50%", width: 520, height: 600, ...papel, borderRadius: 8, boxShadow: sombra,
            opacity: cl(v * 2), transform: `translateY(${(1 - v) * -500}px) rotate(${rot + (1 - v) * 20}deg)` }}>
            <div style={{ position: "absolute", inset: 0, ...rayado, opacity: 0.8 }} />
            <div style={{ position: "absolute", left: 30, top: 20, fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: ROSA }}>Nº</div>
            <div style={{ textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 250, lineHeight: 1.15, color: AZUL, marginTop: 40 }}>{x.n}</div>
            <div style={{ textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 58, lineHeight: 1.05, color: TINTA, padding: "0 30px" }}>{x.txt}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 4 · MESA PARA UNO: la mesa puesta para uno; un mantelito de cuadros se desliza debajo y la frase se escribe a mano
export const MesaUno: P<{ bed: string; t: number; txt: string }> = ({ a, d, bed, t, txt }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(t), 14, 110);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Foto k={bed} f={f} d={d} style={{ position: "absolute", inset: 0 }} z={[1.02, 1.1]} />
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(10,8,5,0.8) 0%, rgba(10,8,5,0) 45%)" }} />
      <div style={{ position: "absolute", left: 960, bottom: 90, translate: "-50% 0", ...papel, width: "max-content", padding: "18px 60px 26px", borderRadius: 6, boxShadow: sombra,
        opacity: cl(u * 2), transform: `rotate(-1.5deg) translateY(${(1 - u) * 80}px)` }}>
        <Escrito f={f} at={at(t) + 4} dur={40} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 82, color: TINTA }}>{txt}</Escrito>
        <div style={{ height: 6, marginTop: 4, background: ROSA, borderRadius: 3, width: `${100 * ez((f - at(t) - 40) / 14)}%` }} />
      </div>
    </AbsoluteFill>
  );
};

// 5 · BANNER del recetario (CTA): el banner con el QR entra como lámina; una cinta "pág. N" asoma en su palabra
export const Banner: P<{ bed: string; t: number; page: string; tp: number; txt: string }> = ({ a, d, t, page, tp, txt }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(t), 15, 100), p = sp(f, at(tp), 12, 170);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#EFE6D6" }}>
      <AbsoluteFill style={{ opacity: cl(u * 1.5), transform: `scale(${1.0 + 0.03 * f / Math.max(1, d)}) translateY(${(1 - u) * 60}px)` }}>
        <Img src={img("banner_qr.png")} style={{ width: 1920, height: 1280, objectFit: "cover", marginTop: -100 }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 60, top: 470, background: ROSA, color: CREMA, padding: "10px 40px 14px", borderRadius: 6, boxShadow: sombra,
        fontFamily: SERIF, fontWeight: 900, fontSize: 64, opacity: cl(p * 2), transform: `translateX(${(1 - p) * -400}px) rotate(-2deg)` }}>{page} · <span style={{ fontFamily: HAND, fontWeight: 700 }}>{txt}</span></div>
    </AbsoluteFill>
  );
};

// 6 · KILO: la bolsa de arroz al centro y 10 cuencos alrededor que se llenan uno a uno → "1 kilo ≈ 10 cenas"
export const Kilo: P<{ bed: string; t: number; n: number; txt: string; sub: string }> = ({ a, d, bed, t, n, txt, sub }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 120);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.62} blur={12} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 120, color: CREMA, textShadow: txtSh, opacity: cl(u * 1.6) }}>{txt}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 70, color: "#F3D9A4", textShadow: txtSh, opacity: cl(u * 1.6) }}>{sub}</div>
      <div style={{ position: "absolute", left: 210, right: 210, top: 420, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", rowGap: 40 }}>
        {Array.from({ length: n }).map((_, i) => {
          const v = sp(f, at(t) + 6 + i * 3, 12, 180);
          return (
            <div key={i} style={{ width: 250, height: 250, margin: "0 auto", borderRadius: "50%", background: `radial-gradient(circle, ${TERRA} 58%, #7E3F1F 60%, #96502A 74%, #6C3518 100%)`,
              boxShadow: sombra, display: "flex", alignItems: "center", justifyContent: "center", opacity: cl(v * 2), transform: `scale(${0.4 + 0.6 * v})` }}>
              <div style={{ width: 170 * v, height: 170 * v, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #FFFFFF 0 30%, #F3EEE2 60%, #E2DACA 100%)",
                boxShadow: "inset 0 -6px 10px rgba(0,0,0,0.12)" }} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// 7 · TIMER: un reloj de cocina grande sobre la foto de la olla tapada; la aguja barre los minutos y el número cuenta
export const Timer: P<{ bed: string; t: number; m: number; txt: string }> = ({ a, d, bed, t, m, txt }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 110), w = ez((f - at(t)) / 45);
  const R = 250, ang = -90 + 360 * (m / 60) * w;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Foto k={bed} f={f} d={d} style={{ position: "absolute", inset: 0 }} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(10,8,5,0.0) 0%, rgba(10,8,5,0.0) 40%, rgba(10,8,5,0.7) 100%)" }} />
      <div style={{ position: "absolute", left: 1380, top: 520, translate: "-50% -50%", opacity: cl(u * 2), transform: `scale(${0.7 + 0.3 * u})` }}>
        <svg width={640} height={640} viewBox="-320 -320 640 640">
          <circle r={300} fill="#F4F1E8" stroke={AZUL} strokeWidth={22} />
          <path d={`M 0 0 L 0 ${-R} A ${R} ${R} 0 ${m / 60 * w > 0.5 ? 1 : 0} 1 ${R * Math.cos(ang * Math.PI / 180)} ${R * Math.sin(ang * Math.PI / 180)} Z`} fill="rgba(194,77,104,0.35)" />
          {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={0} y1={-270} x2={0} y2={-238} stroke={TINTA} strokeWidth={8} transform={`rotate(${i * 30})`} />)}
          <line x1={0} y1={0} x2={0} y2={-236} stroke={ROSA} strokeWidth={14} strokeLinecap="round" transform={`rotate(${ang + 90})`} />
          <circle r={22} fill={TINTA} />
        </svg>
        <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 110, color: AZUL }}>{Math.round(m * w)}<span style={{ fontSize: 60 }}> min</span></div>
      </div>
      <div style={{ position: "absolute", left: 1380, top: 930, translate: "-50% 0", fontFamily: HAND, fontWeight: 700, fontSize: 86, color: CREMA, textShadow: txtSh, opacity: cl((f - at(t) - 20) / 10) }}>{txt}</div>
    </AbsoluteFill>
  );
};

// 8 · FICHA: ficha de receta de cartulina amarillenta (con la página del recetario); cada medida se escribe en su palabra
export const Ficha: P<{ bed: string; title: string; page: string; items: { t: number; q: string; txt: string }[] }> = ({ a, d, bed, title, page, items }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 110);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Foto k={bed} f={f} d={d} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(10,8,5,0.75) 0%, rgba(10,8,5,0.4) 45%, rgba(10,8,5,0) 70%)" }} />
      <div style={{ position: "absolute", left: 110, top: 120, width: 820, height: 840, ...papel, borderRadius: 10, boxShadow: sombra, overflow: "hidden",
        transform: `translateX(${(1 - u) * -900}px) rotate(${-2 + (1 - u) * -6}deg)` }}>
        <div style={{ position: "absolute", inset: 0, ...rayado }} />
        <div style={{ position: "absolute", left: 90, top: 0, bottom: 0, width: 3, background: "rgba(194,77,104,0.55)" }} />
        <div style={{ position: "relative", padding: "34px 40px 0 120px", fontFamily: SERIF, fontWeight: 900, fontSize: 76, color: AZUL, lineHeight: 1.05 }}>{title}</div>
        <div style={{ position: "relative", padding: "30px 40px 0 120px" }}>
          {items.map((x, i) => (
            <Escrito key={i} f={f} at={at(x.t) + i * 8} dur={16} style={{ fontFamily: HAND, fontSize: 70, color: TINTA, height: 126, display: "flex", alignItems: "center" }}>
              <span style={{ fontWeight: 700, color: ROSA, minWidth: 210, display: "inline-block" }}>{x.q}</span>{x.txt}
            </Escrito>
          ))}
        </div>
        <div style={{ position: "absolute", right: 30, bottom: 26, background: AZUL, color: CREMA, fontFamily: SERIF, fontWeight: 800, fontSize: 44, padding: "6px 22px 10px", borderRadius: 6,
          transform: `rotate(-3deg) scale(${sp(f, 18, 12, 180)})` }}>Recetario · {page}</div>
      </div>
    </AbsoluteFill>
  );
};

// 9 · REFRÁN: un paño bordado (punto cruz azul) colgado sobre el azulejo con el dicho que se "borda" letra a letra
export const Refran: P<{ bed: string; txt: string; sign: string; t: number }> = ({ a, d, bed, txt, sign, t }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 15, 100), n = Math.floor(cl((f - at(t) - 8) / 50) * txt.length);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.5} blur={16} />
      <div style={{ position: "absolute", left: 960, top: 520, translate: "-50% -50%", width: 1360, padding: "70px 90px 60px", background: "#FBF8F0",
        backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.035) 0 2px, transparent 2px 6px), repeating-linear-gradient(90deg, rgba(0,0,0,0.035) 0 2px, transparent 2px 6px)",
        border: `14px solid ${AZUL2}`, outline: "4px dashed #FBF8F0", outlineOffset: -30, boxShadow: sombra, transform: `rotate(1deg) translateY(${(1 - u) * -900}px)` }}>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 96, lineHeight: 1.15, color: AZUL, textAlign: "center", minHeight: 230 }}>
          {txt.slice(0, n)}<span style={{ opacity: 0 }}>{txt.slice(n)}</span>
        </div>
        <div style={{ textAlign: "right", fontFamily: HAND, fontSize: 64, color: ROSA, marginTop: 20, opacity: cl((f - at(t) - 60) / 12) }}>— {sign}</div>
      </div>
    </AbsoluteFill>
  );
};

// 10 · CUENTA: libreta de cuentas a lápiz; cada renglón con su precio y el total que se encierra
export const Cuenta: P<{ bed: string; title: string; lines: { t: number; txt: string; p: string }[]; total: Beat }> = ({ a, d, bed, title, lines, total }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 110), c = ez((f - at(total.t) - 6) / 20);
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...madera }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.6} blur={12} />
      <div style={{ position: "absolute", left: 960, top: 545, translate: "-50% -50%", width: 1100, height: 900, ...papel, borderRadius: 6, boxShadow: sombra, overflow: "hidden",
        transform: `rotate(-1.5deg) translateY(${(1 - u) * 900}px)` }}>
        <div style={{ position: "absolute", inset: 0, ...rayado }} />
        <div style={{ position: "absolute", left: 760, top: 0, bottom: 0, width: 3, background: "rgba(194,77,104,0.5)" }} />
        <div style={{ position: "relative", padding: "30px 60px 0", fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: AZUL }}>{title} <span style={{ fontFamily: HAND, fontSize: 56, color: LAPIZ }}>· para uno</span></div>
        <div style={{ position: "relative", padding: "40px 60px 0" }}>
          {lines.map((x, i) => (
            <Escrito key={i} f={f} at={at(x.t) + i * 9} dur={16} style={{ fontFamily: HAND, fontSize: 68, color: LAPIZ, height: 124, display: "flex", alignItems: "center" }}>
              <span style={{ width: 700, display: "inline-block" }}>{x.txt}</span><span style={{ fontWeight: 700 }}>$ {x.p}</span>
            </Escrito>
          ))}
          <div style={{ height: 4, background: LAPIZ, width: `${100 * ez((f - at(total.t)) / 10)}%`, marginTop: 10 }} />
          <div style={{ position: "relative", marginTop: 26, height: 130 }}>
            <Escrito f={f} at={at(total.t)} dur={18} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 92, color: ROSA, position: "absolute", left: 260 }}>{total.txt}</Escrito>
            <svg width={760} height={170} style={{ position: "absolute", left: 200, top: -20 }}><ellipse cx={380} cy={85} rx={360} ry={70} fill="none" stroke={ROSA} strokeWidth={6}
              strokeDasharray={1800} strokeDashoffset={1800 * (1 - c)} strokeLinecap="round" transform="rotate(-2 380 85)" /></svg>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 11 · TRES CENAS: el muslo al centro; de él salen tres flechas a lápiz hacia tres platos (noche 1, 2, 3) que aparecen en su palabra
export const TresCenas: P<{ bed: string; one: Beat; nights: { t: number; k: string; txt: string }[] }> = ({ a, d, bed, one, nights }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(one.t), 14, 120);
  const pos = [{ x: 420, y: 760 }, { x: 960, y: 820 }, { x: 1500, y: 760 }];
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...azulejo(0.9) }}>
      <AbsoluteFill style={{ background: "rgba(20,15,10,0.35)" }} />
      <div style={{ position: "absolute", left: 960, top: 270, translate: "-50% -50%", width: 470, height: 300, borderRadius: 14, overflow: "hidden", border: `10px solid ${CREMA}`, boxShadow: sombra,
        opacity: cl(u * 2), transform: `scale(${0.7 + 0.3 * u}) rotate(-2deg)` }}>
        <Img src={img(bed)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ position: "absolute", left: 960, top: 440, translate: "-50% 0", background: ROSA, color: CREMA, fontFamily: SERIF, fontWeight: 900, fontSize: 56, padding: "4px 30px 8px",
        borderRadius: 6, opacity: cl(u * 2), boxShadow: sombra }}>{one.txt}</div>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        {nights.map((x, i) => {
          const w = ez((f - at(x.t)) / 12); if (w <= 0) return null;
          const x0 = 960, y0 = 530, p = pos[i];
          return <line key={i} x1={x0} y1={y0} x2={x0 + (p.x - x0) * 0.8 * w} y2={y0 + (p.y - 160 - y0) * w} stroke={CREMA} strokeWidth={6} strokeDasharray="14 10" strokeLinecap="round" />;
        })}
      </svg>
      {nights.map((x, i) => {
        if (f < at(x.t)) return null;
        const v = sp(f, at(x.t) + 8, 12, 160), p = pos[i];
        return (
          <div key={i} style={{ position: "absolute", left: p.x, top: p.y, translate: "-50% -50%", opacity: cl(v * 2), transform: `scale(${0.5 + 0.5 * v})` }}>
            <div style={{ width: 330, height: 330, borderRadius: "50%", background: "radial-gradient(circle, #FFFFFF 64%, #E5DFD1 66%, #FFFFFF 76%, #D5CDBA 100%)", boxShadow: sombra,
              display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 236, height: 236, borderRadius: "50%", overflow: "hidden" }}><Img src={img(x.k)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.5)" }} /></div>
            </div>
            <div style={{ textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 66, color: CREMA, textShadow: txtSh, marginTop: 6 }}>{x.txt}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 12 · POSTAL: una postal vieja con estampilla; la pregunta para los comentarios se escribe a mano y un sobre se abre
export const Postal: P<{ bed: string; q: string; t: number }> = ({ a, d, bed, q, t }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 110);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.5} blur={12} />
      <div style={{ position: "absolute", left: 960, top: 540, translate: "-50% -50%", width: 1300, height: 760, ...papel, borderRadius: 8, boxShadow: sombra,
        transform: `rotate(${2 - (1 - u) * 10}deg) translateX(${(1 - u) * 1400}px)` }}>
        <div style={{ position: "absolute", right: 50, top: 46, width: 170, height: 200, background: AZUL2, border: "8px dotted #FBF3DF", ...azulejo(1.3) }} />
        <svg width={260} height={260} style={{ position: "absolute", right: 120, top: 120, opacity: 0.6 }}><circle cx={130} cy={130} r={100} fill="none" stroke={ROSA} strokeWidth={5} /><circle cx={130} cy={130} r={80} fill="none" stroke={ROSA} strokeWidth={3} /></svg>
        <div style={{ position: "absolute", left: 640, top: 300, bottom: 90, width: 3, background: "rgba(43,33,24,0.35)" }} />
        <div style={{ position: "absolute", left: 60, top: 70, width: 540, fontFamily: SERIF, fontWeight: 800, fontSize: 52, color: AZUL, lineHeight: 1.1 }}>Cuéntame en los comentarios</div>
        <div style={{ position: "absolute", left: 60, top: 300, width: 560 }}>
          <Escrito f={f} at={at(t)} dur={34} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 70, color: ROSA, whiteSpace: "normal", lineHeight: 1.15 }}>{q}</Escrito>
        </div>
        {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 690, top: 420 + i * 100, width: 520, height: 3, background: "rgba(43,33,24,0.35)" }} />)}
        <div style={{ position: "absolute", left: 700, top: 335, fontFamily: HAND, fontSize: 66, color: TINTA, opacity: cl((f - at(t) - 30) / 12) }}>para la abuela Rosa ♥</div>
      </div>
    </AbsoluteFill>
  );
};

// 13 · LISTA: hoja de lista arrancada de la libreta pegada a la puerta de la nevera con un imán; cada cosa se escribe y se tilda
export const Lista: P<{ bed: string; title: string; items: Beat[] }> = ({ a, d, bed, title, items }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 110);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Foto k={bed} f={f} d={d} style={{ position: "absolute", inset: 0 }} />
      <AbsoluteFill style={{ background: "linear-gradient(270deg, rgba(10,8,5,0.75) 0%, rgba(10,8,5,0.35) 45%, rgba(10,8,5,0) 70%)" }} />
      <div style={{ position: "absolute", right: 140, top: 110, width: 720, height: 860, ...papel, boxShadow: sombra, overflow: "hidden",
        clipPath: "polygon(0 2%, 6% 0, 12% 2%, 18% 0, 24% 2%, 30% 0, 36% 2%, 42% 0, 48% 2%, 54% 0, 60% 2%, 66% 0, 72% 2%, 78% 0, 84% 2%, 90% 0, 96% 2%, 100% 0, 100% 100%, 0 100%)",
        transform: `rotate(2deg) translateY(${(1 - u) * -1000}px)` }}>
        <div style={{ position: "absolute", inset: 0, ...rayado }} />
        <div style={{ position: "relative", padding: "60px 50px 0", fontFamily: SERIF, fontWeight: 900, fontSize: 62, color: AZUL, lineHeight: 1.05 }}>{title}</div>
        <div style={{ position: "relative", padding: "34px 50px 0" }}>
          {items.map((x, i) => {
            const k = ez((f - at(x.t) - i * 8 - 18) / 8);
            return (
              <div key={i} style={{ height: 124, display: "flex", alignItems: "center" }}>
                <svg width={70} height={70} style={{ marginRight: 16 }}><rect x={6} y={6} width={56} height={56} fill="none" stroke={LAPIZ} strokeWidth={4} rx={4} />
                  <path d="M14 36 L30 52 L58 16" fill="none" stroke={ROSA} strokeWidth={8} strokeLinecap="round" strokeDasharray={70} strokeDashoffset={70 * (1 - k)} /></svg>
                <Escrito f={f} at={at(x.t) + i * 8} dur={16} style={{ fontFamily: HAND, fontSize: 70, color: LAPIZ }}>{x.txt}</Escrito>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ position: "absolute", right: 470, top: 80, width: 70, height: 70, borderRadius: "50%", background: ROSA, boxShadow: "0 8px 14px rgba(0,0,0,0.5)", opacity: cl(u * 2) }} />
    </AbsoluteFill>
  );
};

// 14 · FRASCO: un frasco de vidrio dibujado que se va llenando de cáscaras por capas; cada capa con su etiqueta en su palabra
export const Frasco: P<{ bed: string; items: Beat[]; txt: string }> = ({ a, d, bed, items, txt }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 120);
  const cols = ["#E07B2E", "#C9A15A", "#6E9A3C"];
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...madera }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.6} blur={14} />
      <div style={{ position: "absolute", left: 640, top: 560, translate: "-50% -50%", opacity: cl(u * 2), transform: `scale(${0.8 + 0.2 * u})` }}>
        <svg width={520} height={760} viewBox="0 0 520 760">
          <rect x={120} y={10} width={280} height={70} rx={10} fill="#9A9A9A" stroke="#6F6F6F" strokeWidth={6} />
          <path d="M100 90 Q80 120 80 170 L80 680 Q80 740 140 740 L380 740 Q440 740 440 680 L440 170 Q440 120 420 90 Z" fill="rgba(235,245,250,0.18)" stroke="rgba(255,255,255,0.85)" strokeWidth={8} />
          {items.map((x, i) => {
            const h = 180 * ez((f - at(x.t)) / 14); const y = 735 - 180 * i - h;
            return <g key={i}><rect x={86} y={y} width={348} height={h} fill={cols[i % 3]} opacity={0.9} />
              {Array.from({ length: 9 }).map((_, j) => <path key={j} d={`M${100 + j * 37} ${y + 30 + (j % 3) * 40} q14 -18 30 0`} stroke="rgba(255,255,255,0.55)" strokeWidth={6} fill="none" opacity={h > 60 ? 1 : 0} />)}</g>;
          })}
          <path d="M120 140 L120 650" stroke="rgba(255,255,255,0.6)" strokeWidth={14} strokeLinecap="round" />
        </svg>
      </div>
      {items.map((x, i) => {
        const v = sp(f, at(x.t) + 6, 12, 170);
        return f < at(x.t) ? null : (
          <div key={i} style={{ position: "absolute", left: 980, top: 760 - i * 180, ...papel, padding: "8px 36px 14px", borderRadius: 6, boxShadow: sombra,
            fontFamily: HAND, fontWeight: 700, fontSize: 70, color: TINTA, opacity: cl(v * 2), transform: `translateX(${(1 - v) * 300}px) rotate(${i % 2 ? 1.5 : -1.5}deg)` }}>← {x.txt}</div>
        );
      })}
      <div style={{ position: "absolute", left: 980, top: 120, fontFamily: SERIF, fontWeight: 900, fontSize: 100, color: CREMA, textShadow: txtSh, opacity: cl(u * 1.5) }}>{txt}</div>
    </AbsoluteFill>
  );
};


// 15 · MENÚ de la semana: hoja pegada a la nevera con los 7 días; cada día se escribe y se tilda en su palabra (los ya dichos aparecen escritos)
export const Menu: P<{ bed: string; days: { t: number; d: string; txt: string }[] }> = ({ a, d, bed, days }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 110);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.55} blur={14} />
      <div style={{ position: "absolute", left: 960, top: 540, translate: "-50% -50%", width: 1240, height: 980, background: "#FFFFFF", borderRadius: 10, boxShadow: sombra,
        transform: `rotate(-1deg) translateY(${(1 - u) * 1100}px)`, overflow: "hidden" }}>
        <div style={{ height: 120, ...azulejo(0.5), display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#FFFFFF", padding: "6px 40px 10px", borderRadius: 8, fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: AZUL }}>Mi semana con 1 kilo de arroz</div>
        </div>
        <div style={{ padding: "16px 60px 0", ...rayado, height: 860 }}>
          {days.map((x, i) => {
            const w = at(x.t) <= 0 ? 1 : 0, k = ez((f - at(x.t) - 16) / 8);
            return (
              <div key={i} style={{ height: 104, display: "flex", alignItems: "center" }}>
                <div style={{ width: 150, fontFamily: SERIF, fontWeight: 900, fontSize: 52, color: ROSA }}>{x.d}</div>
                {w ? <div style={{ fontFamily: HAND, fontSize: 64, color: LAPIZ, whiteSpace: "nowrap" }}>{x.txt}</div>
                   : <Escrito f={f} at={at(x.t)} dur={16} style={{ fontFamily: HAND, fontSize: 64, color: LAPIZ }}>{x.txt}</Escrito>}
                <svg width={70} height={60} style={{ marginLeft: "auto" }}><path d="M8 30 L26 48 L62 10" fill="none" stroke={AZUL2} strokeWidth={9} strokeLinecap="round" strokeDasharray={80} strokeDashoffset={80 * (1 - (w ? 1 : k))} /></svg>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 16 · REGLAS de oro: tres azulejos grandes con su número que se dan vuelta (de blanco a azul) en su palabra, con la regla escrita debajo
export const Reglas: P<{ bed: string; items: { t: number; n: string; txt: string }[] }> = ({ a, d, bed, items }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 120);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.62} blur={14} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 100, color: CREMA, textShadow: txtSh, opacity: cl(u * 1.6) }}>3 reglas de oro del arroz</div>
      {items.map((x, i) => {
        const v = at(x.t) <= 0 ? 1 : ez((f - at(x.t)) / 14), X = 380 + i * 580;
        return (
          <div key={i} style={{ position: "absolute", left: X, top: 300, translate: "-50% 0", width: 470, textAlign: "center", opacity: cl(u * 2) }}>
            <div style={{ width: 360, height: 360, margin: "0 auto", borderRadius: 12, boxShadow: sombra, transform: `perspective(1200px) rotateY(${180 - 180 * v}deg)`,
              ...(v > 0.5 ? azulejo(3) : { background: "#F4F1E8" }), display: "flex", alignItems: "center", justifyContent: "center" }}>
              {v > 0.5 ? <div style={{ width: 170, height: 170, borderRadius: "50%", background: "#F4F1E8", border: `8px solid ${AZUL}`, display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: SERIF, fontWeight: 900, fontSize: 120, color: ROSA }}>{x.n}</div> : null}
            </div>
            <div style={{ marginTop: 30, ...papel, padding: "10px 20px 16px", borderRadius: 8, boxShadow: sombra, fontFamily: HAND, fontWeight: 700, fontSize: 58, lineHeight: 1.05, color: TINTA,
              opacity: cl((v - 0.6) * 3), transform: `translateY(${(1 - v) * 40}px)` }}>{x.txt}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ── superposición: PÁGINA del recetario (esquina de libro que asoma abajo a la derecha cuando Rosa cita la página) ──
export const Pagina: React.FC<{ a: number; d: number; n: number; txt: string }> = ({ a, d, n, txt }) => {
  const { f } = useT(a);
  const u = sp(f, 0, 14, 150), o = cl((f - (d - 10)) / 10);
  return (
    <div style={{ position: "absolute", right: 70, bottom: 80, width: 560, ...papel, borderRadius: "8px 8px 2px 8px", boxShadow: sombra, padding: "18px 30px 22px",
      opacity: cl(u * 2) * (1 - o), transform: `translateY(${(1 - u) * 160 + o * 60}px) rotate(-2deg)` }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 14, background: AZUL, borderRadius: "8px 0 0 8px" }} />
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 40, color: ROSA, letterSpacing: 2 }}>RECETARIO · PÁG. {n}</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52, color: TINTA, lineHeight: 1.05 }}>{txt}</div>
    </div>
  );
};
