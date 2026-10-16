// Claudio el Técnico · componentes PROPIOS (tanda 16-oct). PURO CSS: cero imágenes.
// Identidad: el TALLER de Claudio — tablero perforado (pegboard), lámina galvanizada con remaches, orden de servicio en tabla
// con clip, sello de goma rojo, cinta amarilla de seguridad, el azul rey de su polo. Materiales dibujados con gradientes.
// Fuentes (2): Anton (letrero de taller) + Kalam (la letra de Claudio en la orden). Paleta: azul rey, amarillo seguridad, rojo sello, acero, papel.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadKalam } from "@remotion/google-fonts/Kalam";
import { sp, ez, cl, fr } from "../lkit/core";

const BIG = loadAnton().fontFamily;
const PEN = loadKalam("normal", { weights: ["400", "700"] }).fontFamily;
const ROYAL = "#1E4FC4", NAVY = "#0F2A66", YEL = "#F5C518", RED = "#C8231B", INK = "#1E2430", PAPER = "#F6F3EA", GREEN = "#2E8B4E", STEELC = "#AEB5BA", CREAM = "#FFF8E6";
const SH = "0 2px 3px rgba(0,0,0,.25), 0 14px 26px rgba(0,0,0,.28), 0 44px 80px rgba(0,0,0,.32)";
type B = { a: number; a0?: number; d: number };
const useT0 = (a: number, a0?: number) => { const f0 = useCurrentFrame(); const s = a0 ?? a; return { f: f0 + fr(a) - fr(s), at: (t: number) => fr(t) - fr(s) }; };
const rnd = (i: number) => { const x = Math.sin(i * 91.7 + 17.3) * 43758.5453; return x - Math.floor(x); };
const pos = (p: React.CSSProperties): React.CSSProperties => ({ position: "absolute", ...p });
const fsz = (txt: string, maxW: number, base: number, k = 0.5) => Math.min(base, maxW / Math.max(1, txt.length * k));

// ── materiales ──
const PEG = "radial-gradient(circle at 50% 50%, rgba(40,28,14,.75) 0 5px, rgba(40,28,14,.25) 6px, transparent 7px) 0 0/48px 48px, radial-gradient(ellipse 80% 70% at 30% 15%, #D8B98A, #C29B68 55%, #A57D4C)";
const GALV = "repeating-linear-gradient(90deg, rgba(255,255,255,.08) 0 1px, transparent 1px 4px), radial-gradient(ellipse 60% 40% at 25% 20%, rgba(255,255,255,.55), transparent 70%), linear-gradient(160deg, #D5DADD, #A9B0B5 55%, #8C9499)";
const BLUEPRINT = "linear-gradient(rgba(255,255,255,.10) 0 2px, transparent 2px) 0 0/100% 60px, linear-gradient(90deg, rgba(255,255,255,.10) 0 2px, transparent 2px) 0 0/60px 100%, linear-gradient(rgba(255,255,255,.05) 0 1px, transparent 1px) 0 0/100% 12px, linear-gradient(90deg, rgba(255,255,255,.05) 0 1px, transparent 1px) 0 0/12px 100%, radial-gradient(ellipse at 30% 20%, #2A62D6, #163E9A 70%, #0F2A66)";
const SHEET = "repeating-linear-gradient(180deg, transparent 0 63px, rgba(60,110,190,.28) 63px 65px), radial-gradient(ellipse at 30% 10%, #FFFFFF, #F3EFE4 75%)";
const HAZ = `repeating-linear-gradient(-45deg, ${YEL} 0 34px, #1A1A1A 34px 68px)`;
const CONCRETE = "radial-gradient(circle at 20% 30%, rgba(0,0,0,.08) 0 2px, transparent 3px) 0 0/31px 27px, radial-gradient(circle at 70% 60%, rgba(255,255,255,.12) 0 1.5px, transparent 2.5px) 0 0/23px 29px, linear-gradient(180deg, #B9B6AF, #9C9890)";

const Light: React.FC<{ x?: number; y?: number; o?: number }> = ({ x = 70, y = 0, o = 0.3 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(ellipse 70% 80% at ${x}% ${y}%, rgba(255,248,230,${o}), transparent 60%), linear-gradient(180deg, transparent 60%, rgba(0,0,0,.28))` }} />
);
const Bg: React.FC<{ m: string; f: number; x?: number }> = ({ m, f, x }) => (
  <>
    <AbsoluteFill style={{ transform: `scale(${1.05 + 0.0001 * f}) translateX(${0.02 * f}px)` }}><AbsoluteFill style={{ background: m }} /></AbsoluteFill>
    <Light x={x} />
  </>
);
const Sheen: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const u = (f - at) / 26; if (u < 0 || u > 1) return null;
  return <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen", background: `linear-gradient(110deg, transparent ${u * 140 - 40}%, rgba(255,255,255,.32) ${u * 140 - 30}%, transparent ${u * 140 - 20}%)` }} />;
};
const Big: React.FC<{ txt: string; size: number; color?: string; style?: React.CSSProperties; ls?: number }> = ({ txt, size, color = INK, style, ls = 1 }) => (
  <div style={{ fontFamily: BIG, fontSize: size, color, lineHeight: 1.02, letterSpacing: ls, whiteSpace: "nowrap", textTransform: "uppercase", ...style }}>{txt}</div>
);
const Pen: React.FC<{ txt: string; size: number; color?: string; f?: number; at?: number; dur?: number; style?: React.CSSProperties; w?: number }> = ({ txt, size, color = INK, f = 999, at = -999, dur = 16, style, w = 700 }) => (
  <div style={{ fontFamily: PEN, fontWeight: w, fontSize: size, color, lineHeight: 1.1, whiteSpace: "nowrap", clipPath: `inset(-30% ${100 - 100 * ez((f - at) / dur)}% -30% 0)`, ...style }}>{txt}</div>
);
const pop = (f: number, at: number) => { const u = sp(f, at, 10, 200); return { opacity: cl(u * 3), transform: `scale(${0.5 + 0.5 * u})` }; };
const drop = (f: number, at: number, dy = -500, rot = 8) => { const u = sp(f, at, 12, 150); return { opacity: cl(u * 2), transform: `translateY(${dy * (1 - u)}px) rotate(${rot * (1 - u)}deg)` }; };
const Tick: React.FC<{ f: number; at: number; s?: number; c?: string }> = ({ f, at, s = 54, c = GREEN }) => {
  const u = sp(f, at, 11, 200);
  return <div style={{ width: s * 0.45, height: s * 0.9, borderRight: `${s * 0.18}px solid ${c}`, borderBottom: `${s * 0.18}px solid ${c}`, transform: `rotate(40deg) scale(${u})`, opacity: cl(u * 3), flex: "none", marginRight: s * 0.35, marginLeft: s * 0.1 }} />;
};
const Cross: React.FC<{ f: number; at: number; s?: number; c?: string }> = ({ f, at, s = 54, c = RED }) => {
  const u = ez((f - at) / 8), v = ez((f - at - 6) / 8);
  return (
    <div style={{ position: "relative", width: s, height: s, flex: "none", marginRight: s * 0.35 }}>
      <div style={pos({ left: 0, top: s * 0.42, width: s * 1.15 * u, height: s * 0.17, background: c, borderRadius: 6, transform: "rotate(45deg)", transformOrigin: "0 50%" })} />
      <div style={pos({ left: 0, top: s * 0.42 + s * 0.8, width: s * 1.15 * v, height: s * 0.17, background: c, borderRadius: 6, transform: "rotate(-45deg)", transformOrigin: "0 50%" })} />
    </div>
  );
};
const Rivets: React.FC<{ m?: number; s?: number }> = ({ m = 30, s = 22 }) => (
  <>{[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, y], i) => <div key={i} style={pos({ [x < 0 ? "left" : "right"]: m, [y < 0 ? "top" : "bottom"]: m, width: s, height: s, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #fff, #8d9399 65%, #50565b)", boxShadow: "0 2px 3px rgba(0,0,0,.55)" } as any)} />)}</>
);
const Plate: React.FC<{ w: number; h: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ w, h, children, style }) => (
  <div style={{ position: "relative", width: w, height: h, borderRadius: 18, background: GALV, boxShadow: `${SH}, inset 0 0 0 4px rgba(255,255,255,.45), inset 0 -10px 20px rgba(0,0,0,.18)`, ...style }}>
    <Rivets />{children}
  </div>
);
// tabla con clip + hoja (orden de servicio)
const Clipboard: React.FC<{ w: number; h: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ w, h, children, style }) => (
  <div style={{ position: "relative", width: w, height: h, ...style }}>
    <div style={pos({ inset: 0, borderRadius: 26, background: "repeating-linear-gradient(88deg, rgba(60,30,10,.12) 0 3px, transparent 3px 19px), linear-gradient(170deg, #9C6B3C, #7A4E27)", boxShadow: SH })} />
    <div style={pos({ left: 34, right: 34, top: 70, bottom: 34, background: SHEET, boxShadow: "0 3px 6px rgba(0,0,0,.25)", overflow: "hidden" })}>{children}</div>
    <div style={pos({ left: "50%", top: 10, width: 300, height: 92, marginLeft: -150, borderRadius: "16px 16px 30px 30px", background: "linear-gradient(180deg, #F2F4F5, #9DA4A9 70%, #7B8287)", boxShadow: "0 6px 10px rgba(0,0,0,.45), inset 0 2px 0 rgba(255,255,255,.8)" })}>
      <div style={pos({ left: 110, top: 18, width: 80, height: 28, borderRadius: 14, background: "#3c4247", boxShadow: "inset 0 3px 5px rgba(0,0,0,.7)" })} />
    </div>
  </div>
);
const Stamp: React.FC<{ txt: string; f: number; at: number; c?: string; size?: number; rot?: number }> = ({ txt, f, at, c = RED, size = 92, rot = -8 }) => {
  const u = sp(f, at, 9, 260);
  return (
    <div style={{ opacity: cl(u * 3), transform: `rotate(${rot}deg) scale(${2.2 - 1.2 * u})`, padding: "14px 36px", border: `10px solid ${c}`, borderRadius: 16, color: c, mixBlendMode: "multiply",
      boxShadow: `inset 0 0 0 4px ${c}`, background: "radial-gradient(circle at 30% 40%, rgba(255,255,255,.35) 0 3px, transparent 4px) 0 0/19px 23px" }}>
      <div style={{ fontFamily: BIG, fontSize: size, lineHeight: 1, letterSpacing: 2, whiteSpace: "nowrap", textTransform: "uppercase" }}>{txt}</div>
    </div>
  );
};
const Tag: React.FC<{ txt: string; c?: string; tc?: string; size?: number; style?: React.CSSProperties }> = ({ txt, c = YEL, tc = INK, size = 46, style }) => (
  <div style={{ display: "inline-block", padding: "18px 34px 14px 58px", background: c, borderRadius: "10px 22px 22px 10px", boxShadow: SH, position: "relative", ...style }}>
    <div style={pos({ left: 14, top: "50%", width: 18, height: 18, marginTop: -9, borderRadius: "50%", background: "#3a3a3a", boxShadow: "inset 0 2px 3px rgba(0,0,0,.7)" })} />
    <Big txt={txt} size={size} color={tc} />
  </div>
);

// ═════════════ COMPONENTES ═════════════

// Capítulo: placa galvanizada atornillada al tablero perforado, el número en una etiqueta amarilla de pieza
export const Chapter: React.FC<B & { n: number; title: string; sub: string; tw: number; pre?: string }> = ({ a, a0, n, title, sub, tw, pre = "número" }) => {
  const { f, at } = useT0(a, a0); const u = sp(f, at(tw) - 4, 13, 120);
  const ts = fsz(title, 1000, 120, 0.48);
  return (
    <AbsoluteFill>
      <Bg m={PEG} f={f} x={30} />
      <div style={pos({ left: 0, right: 0, top: 0, height: 60, background: HAZ, opacity: 0.9, boxShadow: "0 6px 14px rgba(0,0,0,.35)" })} />
      <div style={pos({ inset: 0, display: "flex", alignItems: "center", justifyContent: "center", perspective: 1400 })}>
        <div style={{ transform: `rotateX(${(1 - u) * -70}deg) translateY(${(1 - u) * -120}px)`, transformOrigin: "50% 0%", opacity: cl(u * 2) }}>
          <Plate w={1580} h={540}>
            <div style={pos({ left: 70, top: 80, width: 360, height: 380, borderRadius: 26, background: `radial-gradient(ellipse 70% 50% at 30% 20%, rgba(255,255,255,.45), transparent 70%), ${ROYAL}`, boxShadow: `${SH}, inset 0 0 0 8px ${NAVY}`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `rotate(${(1 - sp(f, at(tw) + 4, 12, 150)) * -30}deg)` })}>
              <Big txt={pre} size={50} color={YEL} />
              <Big txt={String(n)} size={250} color="#FFFFFF" style={{ textShadow: `0 6px 0 ${NAVY}, 0 12px 20px rgba(0,0,0,.5)` }} />
            </div>
            <div style={pos({ left: 480, top: 120 })}><Big txt={title} size={ts} color={INK} style={{ textShadow: "0 2px 0 rgba(255,255,255,.6)" }} /></div>
            <div style={pos({ left: 486, top: 140 + ts + 40 })}><Pen txt={sub} size={fsz(sub, 1020, 62, 0.43)} color={ROYAL} f={f} at={at(tw) + 12} dur={22} /></div>
          </Plate>
        </div>
      </div>
      <Sheen f={f} at={at(tw) + 16} />
    </AbsoluteFill>
  );
};

// Sello rojo que golpea una hoja: "NUNCA LO COMPRARÍA" / "SÍ LO COMPRARÍA"
export const Sello: React.FC<B & { t: number; top: string; big: string; sub?: string; tSub?: number; ok?: boolean }> = ({ a, a0, t, top, big, sub, tSub, ok }) => {
  const { f, at } = useT0(a, a0); const c = ok ? GREEN : RED;
  const shake = f >= at(t) + 4 && f < at(t) + 12 ? Math.sin((f - at(t)) * 3) * 6 : 0;
  return (
    <AbsoluteFill>
      <Bg m={CONCRETE} f={f} x={40} />
      <div style={pos({ left: 330, top: 120, transform: `translateX(${shake}px)` })}>
        <Clipboard w={1260} h={860}>
          <div style={pos({ left: 70, top: 50 })}><Big txt="orden de servicio" size={56} color={ROYAL} /></div>
          <div style={pos({ left: 70, top: 140 })}><Pen txt={top} size={fsz(top, 1050, 72, 0.44)} color={INK} f={f} at={at(t) - 18} dur={16} /></div>
          {sub ? <div style={pos({ left: 70, top: 600 })}><Pen txt={sub} size={fsz(sub, 1050, 60, 0.44)} color={NAVY} f={f} at={at(tSub ?? t) + 10} dur={20} /></div> : null}
          <div style={pos({ left: 0, right: 0, top: 290, display: "flex", justifyContent: "center" })}><Stamp txt={big} f={f} at={at(t)} c={c} size={fsz(big, 1000, 130, 0.5)} rot={ok ? -4 : -8} /></div>
        </Clipboard>
      </div>
    </AbsoluteFill>
  );
};

// Orden de servicio que se llena fila por fila (pieza → precio) + total + sello opcional
export const Orden: React.FC<B & { head: string; rows: { t: number; a: string; b: string }[]; total?: { t: number; a: string; b: string }; stamp?: { t: number; txt: string; ok?: boolean } }> = ({ a, a0, head, rows, total, stamp }) => {
  const { f, at } = useT0(a, a0);
  const u = sp(f, at(rows[0]?.t ?? a) - 10, 14, 120);
  const rh = Math.min(118, 520 / Math.max(1, rows.length + (total ? 1 : 0)));
  return (
    <AbsoluteFill>
      <Bg m={PEG} f={f} x={25} />
      <div style={pos({ left: 300, top: 70, transform: `translateY(${(1 - u) * 900}px) rotate(${-1.5 + (1 - u) * 6}deg)` })}>
        <Clipboard w={1320} h={920}>
          <div style={pos({ left: 0, right: 0, top: 0, height: 120, background: ROYAL, display: "flex", alignItems: "center", padding: "0 60px", justifyContent: "space-between" })}>
            <Big txt={head} size={fsz(head, 900, 64, 0.5)} color="#FFFFFF" />
            <Pen txt="Claudio · técnico" size={40} color={YEL} w={400} />
          </div>
          <div style={pos({ left: 60, right: 60, top: 160 })}>
            {rows.map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: rh, borderBottom: "3px dashed rgba(30,36,48,.25)", opacity: f >= at(r.t) - 2 ? 1 : 0 }}>
                <Pen txt={r.a} size={fsz(r.a, 760, rh * 0.5, 0.46)} color={INK} f={f} at={at(r.t)} dur={12} />
                <div style={{ ...pop(f, at(r.t) + 6) }}><Big txt={r.b} size={fsz(r.b, 400, rh * 0.62, 0.5)} color={RED} /></div>
              </div>
            ))}
            {total ? (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: rh * 1.2, borderTop: `6px double ${INK}`, marginTop: 10, opacity: f >= at(total.t) ? 1 : 0 }}>
                <Big txt={total.a} size={fsz(total.a, 600, rh * 0.55, 0.5)} color={ROYAL} />
                <div style={{ ...pop(f, at(total.t) + 4) }}><Big txt={total.b} size={fsz(total.b, 500, rh * 0.8, 0.5)} color={RED} /></div>
              </div>
            ) : null}
          </div>
          {stamp ? <div style={pos({ right: 70, bottom: 60 })}><Stamp txt={stamp.txt} f={f} at={at(stamp.t)} c={stamp.ok ? GREEN : RED} size={fsz(stamp.txt, 640, 84, 0.5)} /></div> : null}
        </Clipboard>
      </div>
    </AbsoluteFill>
  );
};

// Lado a lado: lo que NO compraría vs lo que SÍ (dos placas colgadas del tablero)
export const Versus: React.FC<B & { L: { t: number; head: string; big: string; sub: string }; R: { t: number; head: string; big: string; sub: string }; tWin?: number }> = ({ a, a0, L, R, tWin }) => {
  const { f, at } = useT0(a, a0);
  const side = (s: { t: number; head: string; big: string; sub: string }, i: number) => {
    const sw = Math.sin((f - at(s.t)) / 8) * 4 * Math.exp(-Math.max(0, f - at(s.t)) / 30);
    return (
      <div style={{ width: 760, height: 780, position: "relative", ...drop(f, at(s.t), -700, i ? 6 : -6) }}>
        <div style={pos({ left: "50%", top: -60, width: 6, height: 70, marginLeft: -3, background: "#555" })} />
        <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 0", transform: `rotate(${sw}deg)` }}>
          <div style={pos({ inset: 0, borderRadius: 22, background: i ? `radial-gradient(ellipse 70% 50% at 30% 15%, rgba(255,255,255,.35), transparent 70%), ${ROYAL}` : GALV, boxShadow: SH })} />
          <Rivets m={24} s={18} />
          <div style={pos({ left: 0, right: 0, top: 70, textAlign: "center" })}><Big txt={s.head} size={fsz(s.head, 640, 70, 0.5)} color={i ? YEL : RED} /></div>
          <div style={pos({ left: 0, right: 0, top: 210, textAlign: "center" })}><Big txt={s.big} size={fsz(s.big, 680, 190, 0.5)} color={i ? "#FFFFFF" : INK} style={{ whiteSpace: "normal", lineHeight: 0.98 }} /></div>
          <div style={pos({ left: 0, right: 0, top: 560, display: "flex", justifyContent: "center" })}><Pen txt={s.sub} size={fsz(s.sub, 680, 58, 0.44)} color={i ? CREAM : NAVY} f={f} at={at(s.t) + 10} dur={18} /></div>
          {!i && tWin ? <div style={pos({ left: 70, top: 260 })}><Cross f={f} at={at(tWin)} s={300} /></div> : null}
          {i && tWin ? <div style={pos({ right: -30, top: -40, ...pop(f, at(tWin) + 6) })}><div style={{ width: 170, height: 170, borderRadius: "50%", background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: SH, border: `7px solid ${CREAM}` }}><Tick f={f} at={at(tWin) + 8} s={84} c={CREAM} /></div></div> : null}
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Bg m={PEG} f={f} x={50} />
      <div style={pos({ left: 0, right: 0, top: 170, display: "flex", justifyContent: "center", gap: 130 })}>{side(L, 0)}{side(R, 1)}</div>
      <div style={pos({ left: 900, top: 480, width: 120, height: 120, borderRadius: "50%", background: YEL, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: SH, border: `6px solid ${INK}`, ...pop(f, at(R.t) - 4) })}><Big txt="VS" size={52} color={INK} /></div>
    </AbsoluteFill>
  );
};

// Lista de taller: etiquetas que se cuelgan del tablero, cada una con palomita o tache
export const Lista: React.FC<B & { head: string; items: { t: number; txt: string; no?: boolean }[] }> = ({ a, a0, head, items }) => {
  const { f, at } = useT0(a, a0);
  const cols = items.length > 4 ? 2 : 1; const w = cols === 2 ? 780 : 1150;
  return (
    <AbsoluteFill>
      <Bg m={PEG} f={f} x={30} />
      <div style={pos({ left: 0, right: 0, top: 60, display: "flex", justifyContent: "center", ...drop(f, at(items[0]?.t ?? a) - 12, -300, 0) })}>
        <Plate w={1200} h={150}><div style={pos({ inset: 0, display: "flex", alignItems: "center", justifyContent: "center" })}><Big txt={head} size={fsz(head, 1060, 92, 0.5)} color={NAVY} /></div></Plate>
      </div>
      <div style={pos({ left: 90, right: 90, top: 280, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "34px 60px" })}>
        {items.map((it, i) => (
          <div key={i} style={{ ...drop(f, at(it.t), -320, i % 2 ? 6 : -6) }}>
            <div style={{ position: "relative", width: w, padding: "30px 36px 26px 44px", background: it.no ? "linear-gradient(180deg,#FFE3DE,#F6C9C0)" : PAPER, borderLeft: `18px solid ${it.no ? RED : GREEN}`, borderRadius: 10, boxShadow: SH, transform: `rotate(${(rnd(i) - 0.5) * 3}deg)` }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                {it.no ? <Cross f={f} at={at(it.t) + 8} s={50} /> : <Tick f={f} at={at(it.t) + 8} s={54} />}
                <Pen txt={it.txt} size={fsz(it.txt, w - 170, 74, 0.45)} color={INK} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// Número grande sobre plano azul de técnico, con cuenta (4 de 10, 8 piezas, 100 dólares al año)
export const BigStat: React.FC<B & { t: number; big: string; pre?: string; sub?: string; tSub?: number; n?: number }> = ({ a, a0, t, big, pre, sub, tSub, n }) => {
  const { f, at } = useT0(a, a0);
  const u = ez((f - at(t)) / 24);
  const txt = n !== undefined ? big.replace("#", String(Math.round(n * u))) : big;
  return (
    <AbsoluteFill>
      <Bg m={BLUEPRINT} f={f} x={40} />
      {Array.from({ length: 3 }, (_, i) => <div key={i} style={pos({ left: 1350 + i * 70, top: 200 + i * 150, width: 330 - i * 60, height: 330 - i * 60, borderRadius: "50%", border: "4px dashed rgba(255,255,255,.35)", transform: `rotate(${f * (i % 2 ? -0.4 : 0.4)}deg)` })} />)}
      <div style={pos({ left: 160, top: 170, width: 1300 })}>
        {pre ? <Pen txt={pre} size={fsz(pre, 1250, 80, 0.44)} color={YEL} f={f} at={at(t) - 10} /> : null}
        <div style={{ ...pop(f, at(t)) }}><Big txt={txt} size={fsz(big, 1250, 330, 0.5)} color="#FFFFFF" style={{ textShadow: "0 10px 0 rgba(0,0,0,.25)" }} /></div>
        {sub ? <Pen txt={sub} size={fsz(sub, 1250, 78, 0.44)} color={CREAM} f={f} at={at(tSub ?? t) + 6} dur={22} style={{ marginTop: 10 }} /> : null}
      </div>
    </AbsoluteFill>
  );
};

// Medidor de aguja (como el del multímetro del taller): la aguja va a cada valor en su palabra
export const Medidor: React.FC<B & { label: string; steps: { t: number; v: number; txt: string; c?: string }[]; marks: string[]; foot?: string; tFoot?: number }> = ({ a, a0, label, steps, marks, foot, tFoot }) => {
  const { f, at } = useT0(a, a0);
  let v = 0, cur = steps[0];
  for (let i = 0; i < steps.length; i++) { const s = steps[i]; const prev = i ? steps[i - 1].v : 0; const k = sp(f, at(s.t), 12, 90); if (f >= at(s.t) - 1) { v = prev + (s.v - prev) * k; cur = s; } }
  const ang = -120 + 240 * v;
  return (
    <AbsoluteFill>
      <Bg m={PEG} f={f} x={60} />
      <div style={pos({ left: 210, top: 90, ...drop(f, at(steps[0].t) - 12, -400, 3) })}>
        <div style={{ position: "relative", width: 880, height: 900, borderRadius: 60, background: `radial-gradient(ellipse 60% 40% at 30% 15%, rgba(255,255,255,.35), transparent 70%), ${YEL}`, boxShadow: `${SH}, inset 0 0 0 14px #D8A900` }}>
          <div style={pos({ left: 70, top: 80, width: 740, height: 600, borderRadius: 30, background: "radial-gradient(ellipse at 50% 90%, #FFFDF4, #EDE8D8)", boxShadow: "inset 0 6px 14px rgba(0,0,0,.35)" })}>
            {marks.map((m, i) => { const an = -120 + 240 * (i / Math.max(1, marks.length - 1)); return (
              <div key={i} style={pos({ left: 370, top: 470, width: 0, height: 0, transform: `rotate(${an}deg)` })}>
                <div style={pos({ left: -4, top: -380, width: 8, height: 46, background: INK })} />
                <div style={pos({ left: -150, top: -330, width: 300, textAlign: "center", transform: `rotate(${-an}deg)` })}><Big txt={m} size={fsz(m, 220, 50, 0.5)} color={INK} /></div>
              </div>); })}
            <div style={pos({ left: 370, top: 470, width: 0, height: 0, transform: `rotate(${ang}deg)` })}>
              <div style={pos({ left: -6, top: -400, width: 12, height: 420, borderRadius: 6, background: RED, boxShadow: "4px 6px 8px rgba(0,0,0,.35)" })} />
            </div>
            <div style={pos({ left: 330, top: 430, width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #666, #111)", boxShadow: "0 4px 8px rgba(0,0,0,.5)" })} />
          </div>
          <div style={pos({ left: 0, right: 0, top: 730, textAlign: "center" })}><Big txt={label} size={fsz(label, 760, 74, 0.5)} color={INK} /></div>
        </div>
      </div>
      <div style={pos({ left: 1150, top: 300, width: 680 })}>
        <div style={{ ...pop(f, at(cur.t) + 4) }}><Big txt={cur.txt} size={fsz(cur.txt, 660, 120, 0.5)} color={cur.c ?? NAVY} style={{ whiteSpace: "normal" }} /></div>
        {foot ? <Pen txt={foot} size={fsz(foot, 660, 64, 0.44)} color={INK} f={f} at={at(tFoot ?? 0)} dur={20} style={{ marginTop: 40, whiteSpace: "normal" }} /> : null}
      </div>
    </AbsoluteFill>
  );
};

// Piezas que se cuentan: fichas de refacción que caen al banco una por una, con contador arriba
export const Piezas: React.FC<B & { head: string; items: { t: number; txt: string }[]; tot?: string }> = ({ a, a0, head, items, tot }) => {
  const { f, at } = useT0(a, a0);
  const n = items.filter((it) => f >= at(it.t)).length;
  const cols = items.length <= 4 ? 2 : items.length <= 6 ? 3 : 4; const w = cols === 2 ? 760 : cols === 3 ? 540 : 400; const tb = cols === 2 ? 92 : cols === 3 ? 74 : 58;
  return (
    <AbsoluteFill>
      <Bg m={PEG} f={f} x={40} />
      <div style={pos({ left: 0, right: 0, bottom: -40, height: 330, background: "repeating-linear-gradient(90deg, rgba(60,30,10,.18) 0 3px, transparent 3px 30px), linear-gradient(180deg, #8C5F35, #6E4824)", boxShadow: "inset 0 18px 30px rgba(0,0,0,.35)" })} />
      <div style={pos({ left: 0, right: 0, top: 50, display: "flex", justifyContent: "center", alignItems: "center", gap: 40 })}>
        <Plate w={1100} h={150}><div style={pos({ inset: 0, display: "flex", alignItems: "center", justifyContent: "center" })}><Big txt={head} size={fsz(head, 980, 84, 0.5)} color={NAVY} /></div></Plate>
        <div style={{ width: 190, height: 190, borderRadius: "50%", background: RED, boxShadow: SH, border: `8px solid ${CREAM}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Big txt={String(n)} size={110} color="#FFFFFF" /></div>
      </div>
      <div style={pos({ left: 80, right: 80, top: 300, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "44px 44px" })}>
        {items.map((it, i) => (
          <div key={i} style={{ ...drop(f, at(it.t), -500, (rnd(i) - 0.5) * 20) }}>
            <Tag txt={it.txt} c={i % 3 === 2 ? "#FFFFFF" : YEL} size={fsz(it.txt, w - 110, tb, 0.5)} style={{ width: w, boxSizing: "border-box", transform: `rotate(${(rnd(i * 3) - 0.5) * 5}deg)` }} />
          </div>
        ))}
      </div>
      {tot && n === items.length ? <div style={pos({ left: 0, right: 0, bottom: 70, display: "flex", justifyContent: "center", ...pop(f, at(items[items.length - 1].t) + 14) })}><Pen txt={tot} size={fsz(tot, 1500, 76, 0.44)} color={CREAM} style={{ textShadow: "0 3px 6px rgba(0,0,0,.6)" }} /></div> : null}
    </AbsoluteFill>
  );
};

// Pregunta para los comentarios: hoja de la orden con la letra de Claudio
export const Pregunta: React.FC<B & { q: string; q2?: string; t: number }> = ({ a, a0, q, q2, t }) => {
  const { f, at } = useT0(a, a0); const u = sp(f, at(t) - 6, 14, 110);
  return (
    <AbsoluteFill>
      <Bg m={PEG} f={f} x={30} />
      <div style={pos({ left: 300, top: 110, transform: `rotate(${-2 + (1 - u) * 10}deg) translateY(${(1 - u) * 900}px)` })}>
        <Clipboard w={1320} h={860}>
          <div style={pos({ left: 70, top: 50 })}><Big txt="cuéntame en los comentarios" size={78} color={RED} /></div>
          <div style={pos({ left: 76, top: 230 })}><Pen txt={q} size={fsz(q, 1150, 76, 0.44)} color={INK} f={f} at={at(t) + 6} dur={26} /></div>
          {q2 ? <div style={pos({ left: 76, top: 390 })}><Pen txt={q2} size={fsz(q2, 1150, 76, 0.44)} color={NAVY} f={f} at={at(t) + 34} dur={26} /></div> : null}
          <div style={pos({ right: 90, bottom: 70 })}><Pen txt="— los leo todos. Claudio" size={58} color={ROYAL} f={f} at={at(t) + 60} dur={20} /></div>
        </Clipboard>
      </div>
    </AbsoluteFill>
  );
};
