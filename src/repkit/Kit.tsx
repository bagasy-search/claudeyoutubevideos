// repkit · kit de componentes de "Claudio el Repositor" (Claude, 12-oct-2026). Ver src/repkit/README.md.
// Cada componente: props con `from` (segundo absoluto donde arranca) y `dur` (segundos que vive).
// Los tiempos internos (tX, tN...) son SEGUNDOS ABSOLUTOS del video; el componente calcula su local.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import {
  Shell, useLocal, im, cl, ez, eo, sp, fr, Grade, Grain, Mark,
  camAt, camStyle, Cam, RK, LABEL_SANS, PRICE, MONO, STAMP, HAND, SERIF, shadowBig, fmtPeso, fmtNum,
} from "./Rk";

// envoltorio: cada export es el componente con su Sequence
const mk = <P extends { from: number; dur: number }>(In: React.FC<P>) => (p: P) => (
  <Shell from={p.from} dur={p.dur}><In {...p} /></Shell>
);
const mix = (u: number, a: number, b: number) => a + (b - a) * u;
const RED = RK.price;
const chipBase: React.CSSProperties = { display: "inline-block", fontFamily: LABEL_SANS, fontWeight: 800, textTransform: "uppercase", letterSpacing: 4, padding: "14px 30px", borderRadius: 6, boxShadow: "0 12px 26px rgba(0,0,0,0.35)", whiteSpace: "nowrap" };
const Chip2: React.FC<{ txt: string; size?: number; bg?: string; color?: string; rot?: number; style?: React.CSSProperties }> = ({ txt, size = 52, bg = "#FFFDF4", color = RK.ink, rot = -2, style }) => (
  <div style={{ ...chipBase, fontSize: size, background: bg, color, transform: `rotate(${rot}deg)`, ...style }}>{txt}</div>
);
const Cover: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" };
// tubo fluorescente / textura de papel: ruido SVG inline (usado en tickets y carteles)
const paperNoise = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='p'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 0 0.3  0 0 0 0.35 0'/></filter><rect width='100%25' height='100%25' filter='url(%23p)'/></svg>\")";

// ═══════════════ 1. SealDoor ═══════════════
export type SealDoorProps = { bg: string; from: number; dur: number; tStamp: number; tPush: number; label?: string; win?: [number, number]; size?: number };
const SealDoorIn: React.FC<SealDoorProps> = ({ bg, from, tStamp, tPush, label = "DETRÁS DE LA\nGÓNDOLA", win = [50, 42], size = 96 }) => {
  const { f, at } = useLocal(from);
  const s0 = 1 + 0.06 * cl(f / Math.max(1, at(tPush)));
  const pu = ez((f - at(tPush)) / 36);
  const s = s0 * (1 + 2.4 * pu);
  const st = f - at(tStamp);
  const u = cl(st / 8);
  const land = 1.4 - 0.4 * eo(u) + (st > 8 ? 0.05 * Math.sin((st - 8) / 2) * Math.exp(-(st - 8) / 6) : 0);
  const rot = -9 + 5 * eo(u);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: `${win[0]}% ${win[1]}%` }}>
        <Img src={im(bg)} style={Cover} />
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.4))" }} />
      </AbsoluteFill>
      {/* sello en coordenadas de pantalla (no escala con la cámara): entra entero, ~45 % del ancho */}
      {st >= 0 ? (
        <div style={{ position: "absolute", left: "50%", top: "52%", transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${land})`, opacity: cl(st / 3), filter: "drop-shadow(0 10px 8px rgba(0,0,0,0.5))", whiteSpace: "nowrap" }}>
          <Stamp label={label} size={size} />
        </div>
      ) : null}
      <Grade vig={0.35} />
      <Grain />
      {/* blanco: sube en 0.2 s, mantiene 6 cuadros y corta (sin fundido largo) */}
      {f >= at(tPush + 0.6) && f < at(tPush + 1.0) ? <AbsoluteFill style={{ background: "#fff", opacity: cl((f - at(tPush + 0.6)) / 6) }} /> : null}
    </AbsoluteFill>
  );
};
export const SealDoor = mk(SealDoorIn);

// sello de goma: texto de tinta con huecos (filtro de ruido), borde doble, levemente desparejo
export const Stamp: React.FC<{ label: string; size?: number; color?: string; w?: number; rot?: number }> = ({ label, size = 84, color = RK.apron, w, rot = 0 }) => (
  <div style={{ position: "relative", display: "inline-block", transform: `rotate(${rot}deg)` }}>
    <svg width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        <filter id="rk-ink" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -6 4.1" result="m" />
          <feComposite in="SourceGraphic" in2="m" operator="in" />
        </filter>
      </defs>
    </svg>
    <div style={{ fontFamily: STAMP, fontSize: size, lineHeight: 1.04, letterSpacing: 4, textTransform: "uppercase", textAlign: "center",
      color, maxWidth: w, whiteSpace: "pre-line", padding: `${size * 0.26}px ${size * 0.42}px`, border: `${Math.round(size * 0.12)}px solid ${color}`,
      boxShadow: `inset 0 0 0 ${Math.max(3, size * 0.05)}px ${color}`, filter: "url(#rk-ink)", opacity: 1, mixBlendMode: "multiply" }}>{label}</div>
  </div>
);

// ═══════════════ 2. ShelfTag ═══════════════
export type ShelfTagProps = {
  bg: string; from: number; dur: number; at: [number, number]; product: string; price: number; unitLine: string;
  tPrint: number; tLupa: number; tCircle: number; ejemplo?: boolean;
};
// `at` = punto DE LA REPISA donde apoya la etiqueta (borde frontal de la repisa). La etiqueta se apoya sobre ese punto.
// `unitLine` debe ser el precio por kilo de `price` (500 g -> x2). Ej.: price 1240 -> unitLine "$ 2.480 el kg".
const TAG_W = 640, TAG_H = 260;
const UNIT_CY = 232; // centro vertical de la línea de kilo dentro de la etiqueta
const UNIT_CX = 131; // centro horizontal de la línea de kilo (texto desde x=36)
const PaperTag: React.FC<{ product: string; price: number; unitLine: string }> = ({ product, price, unitLine }) => (
  <div style={{ position: "relative", width: TAG_W, height: TAG_H, background: `linear-gradient(170deg, #FFFFFF 0%, ${RK.shelf} 70%, #E9E6DA 100%)`,
    borderRadius: 6, overflow: "hidden", transform: "perspective(900px) rotateX(9deg) rotate(-1.4deg)", transformOrigin: "50% 100%", fontFamily: LABEL_SANS, color: RK.ink,
    boxShadow: "0 3px 4px rgba(0,0,0,0.3)" }}>
    <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: 52, background: RK.apron, color: "#fff", fontWeight: 800, fontSize: 26, letterSpacing: 5, textTransform: "uppercase", display: "flex", alignItems: "center", paddingLeft: 30 }}>{product}</div>
    <div style={{ position: "absolute", left: 30, top: 58, fontFamily: PRICE, fontWeight: 700, fontSize: 140, lineHeight: 1, color: RED, letterSpacing: -1 }}>{fmtPeso(price)}</div>
    <div style={{ position: "absolute", left: 36, top: UNIT_CY - 20, fontWeight: 800, fontSize: 30, color: RK.ink, whiteSpace: "nowrap" }}>{unitLine}</div>
    <div style={{ position: "absolute", right: 26, top: 66, width: 150, height: 110, background: "repeating-linear-gradient(90deg, #111 0 2px, #fff 2px 4px, #111 4px 9px, #fff 9px 11px, #111 11px 12px, #fff 12px 16px)" }} />
    <div style={{ position: "absolute", right: 30, top: 180, fontSize: 18, letterSpacing: 2, color: "#555" }}>0 7 7 1 2 3 4 5 6 9</div>
    <AbsoluteFill style={{ background: "linear-gradient(120deg, rgba(255,255,255,0) 60%, rgba(0,0,0,0.08) 100%)" }} />
  </div>
);
// etiquetadora (SVG, ~400 px): cuerpo amarillo con sombreado, rollo de etiquetas blancas arriba, cabezal con ranura oscura al frente, empuñadura negra y gatillo
const LabelerGun: React.FC = () => (
  <svg width="400" height="278" viewBox="0 0 360 250" style={{ overflow: "visible", filter: "drop-shadow(0 12px 10px rgba(0,0,0,0.45))" }}>
    <defs>
      <linearGradient id="rk-gun" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFE865" /><stop offset="0.45" stopColor="#F5B800" /><stop offset="1" stopColor="#9C6F00" />
      </linearGradient>
    </defs>
    {/* rollo de etiquetas (blanco, con las vueltas visibles) */}
    <circle cx="262" cy="52" r="50" fill="#FFFFFF" stroke="#A9A492" strokeWidth="3" />
    <circle cx="262" cy="52" r="40" fill="none" stroke="#C9C4B2" strokeWidth="2" />
    <circle cx="262" cy="52" r="30" fill="none" stroke="#D8D3C2" strokeWidth="2" />
    <circle cx="262" cy="52" r="16" fill="#6E6A5C" />
    {/* cuerpo */}
    <path d="M 30 96 Q 30 66 62 66 L 240 66 Q 292 66 296 106 L 306 156 L 214 176 L 124 166 L 64 186 Q 40 176 32 146 Z" fill="url(#rk-gun)" stroke="#7A5300" strokeWidth="3" />
    <path d="M 52 84 Q 70 76 110 76 L 230 76" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="5" strokeLinecap="round" />
    <path d="M 60 154 L 210 164" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="6" strokeLinecap="round" />
    {/* cabezal y ranura de salida oscura */}
    <rect x="4" y="90" width="42" height="52" rx="6" fill="#2B2B2B" />
    <rect x="10" y="100" width="30" height="32" rx="3" fill="#0A0A0A" />
    {/* empuñadura y gatillo */}
    <path d="M 150 164 L 178 164 L 194 236 Q 196 250 180 250 L 162 250 Q 148 248 146 236 Z" fill="#2F2F2F" stroke="#111" strokeWidth="2" />
    <path d="M 178 164 Q 192 186 172 200" fill="none" stroke="#111" strokeWidth="7" strokeLinecap="round" />
  </svg>
);
const ShelfTagIn: React.FC<ShelfTagProps> = (p) => {
  const { f, at } = useLocal(p.from);
  const [ax, ay] = p.at;
  const LX = ax - TAG_W / 2, LY = ay - TAG_H - 6; // la etiqueta apoya sobre el borde de la repisa
  const AX = LX + UNIT_CX, AY = LY + UNIT_CY;     // centro de la línea de kilo (en el lienzo)
  // pinza: entra desde la derecha, dispara (retroceso + destello en la ranura), la etiqueta sale de la ranura y la pinza se va
  const tp = at(p.tPrint);
  const inU = ez((f - (tp - 24)) / 18), outU = ez((f - (tp + 12)) / 18);
  const gunDx = 460 * (1 - inU) + 460 * outU;
  const gunOn = f >= tp - 24 && f < tp + 30;
  const recoil = f >= tp ? -6 * Math.exp(-(f - tp) / 3) : 0;
  const GUN_L = LX + TAG_W + 30, GUN_T = LY + 4; // ranura de la pinza a la derecha de la etiqueta
  const SLOT_X = GUN_L + 30 + gunDx + recoil, SLOT_Y = GUN_T + 120;
  const pr = ez((f - tp) / 14);
  const labelDx = 60 * (1 - pr); // sale de la ranura
  const tagVisible = f >= tp;
  const flash = f >= tp && f < tp + 6 ? 0.9 * (1 - (f - tp) / 6) : 0;
  // círculo rojo DIBUJADO SOBRE LA ETIQUETA alrededor de la línea de kilo (antes que la lupa)
  const circ = { x: LX + 16, y: LY + UNIT_CY - 30, w: 236, h: 60 };
  // lupa: aparece ENCIMA de la línea de kilo con un pop (nunca viaja desde un cuadro vacío) y queda ahí
  const pop = sp(f, at(p.tLupa), 10, 170);
  const LW = 520, LH = 150; // óvalo: sólo ocupa la línea de kilo (canvas ~236x68 con Z=2.2)
  const Z = 2.2, lensOn = f >= at(p.tLupa);
  const zoomIn = 1 + 0.03 * cl(f / Math.max(1, at(p.tCircle) + 60));
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${zoomIn})`, transformOrigin: `${(ax / 1920) * 100}% ${(ay / 1080) * 100}%` }}>
        <Img src={im(p.bg)} style={Cover} />
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.3))" }} />
        {tagVisible ? (
          <>
            <div style={{ position: "absolute", left: LX + 10, top: LY + TAG_H - 2, width: TAG_W - 20, height: 16, borderRadius: "50%", background: "rgba(0,0,0,0.5)", filter: "blur(6px)" }} />
            <div style={{ position: "absolute", left: LX + labelDx, top: LY }}>
              <PaperTag product={p.product} price={p.price} unitLine={p.unitLine} />
            </div>
          </>
        ) : null}
        {gunOn ? (
          <div style={{ position: "absolute", left: GUN_L + gunDx + recoil, top: GUN_T }}><LabelerGun /></div>
        ) : null}
        {flash > 0 ? <div style={{ position: "absolute", left: SLOT_X - 120, top: SLOT_Y - 120, width: 240, height: 240, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,255,255,${flash}), rgba(255,255,255,0) 65%)` }} /> : null}
        {f >= at(p.tCircle) && tagVisible ? (
          <Mark kind="circle" x={circ.x} y={circ.y} w={circ.w} h={circ.h} f={f} at={at(p.tCircle)} dur={14} color={RED} sw={8} />
        ) : null}
        {lensOn ? (
          <div style={{ position: "absolute", left: AX - LW / 2, top: AY - LH / 2, width: LW, height: LH, transform: `scale(${0.6 + 0.4 * pop})`, transformOrigin: "50% 50%" }}>
            {/* contenido: sólo la línea de kilo, a Z veces, centrada en el óvalo */}
            <div style={{ position: "absolute", left: 0, top: 0, width: LW, height: LH, borderRadius: "50%", overflow: "hidden", background: "#fff" }}>
              <div style={{ position: "absolute", left: LW / 2 - Z * AX, top: LH / 2 - Z * AY, width: 1920, height: 1080, transform: `scale(${Z})`, transformOrigin: "0 0" }}>
                <Img src={im(p.bg)} style={{ width: 1920, height: 1080, objectFit: "cover" }} />
                {tagVisible ? (
                  <div style={{ position: "absolute", left: LX, top: LY }}>
                    <PaperTag product={p.product} price={p.price} unitLine={p.unitLine} />
                  </div>
                ) : null}
              </div>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.25), rgba(255,255,255,0) 45%)" }} />
            </div>
            {/* aro metálico y mango hacia abajo-derecha */}
            <div style={{ position: "absolute", left: -16, top: -16, width: LW + 32, height: LH + 32, borderRadius: "50%", border: "16px solid #D5D7DA", boxSizing: "border-box", boxShadow: "0 18px 30px rgba(0,0,0,0.5), inset 0 0 0 3px rgba(0,0,0,0.25)" }} />
            <div style={{ position: "absolute", left: LW * 0.86, top: LH * 0.8, width: 200, height: 36, borderRadius: 18, background: "linear-gradient(180deg, #3A3A3A, #151515)", transform: "rotate(35deg)", transformOrigin: "0 50%", boxShadow: "0 10px 18px rgba(0,0,0,0.45)" }} />
          </div>
        ) : null}
      </AbsoluteFill>
      {ejemploChip(p.ejemplo)}
      <Grade vig={0.3} />
      <Grain />
    </AbsoluteFill>
  );
};
function ejemploChip(on?: boolean) {
  return on === false ? null : (
    <div style={{ position: "absolute", left: 90, top: 90 }}>
      <Chip2 txt="EJEMPLO" size={40} bg={RED} color="#fff" rot={-3} />
    </div>
  );
}
export const ShelfTag = mk(ShelfTagIn);

// ═══════════════ 3. PerKilo ═══════════════
export type ItemPhoto = { img: string; name: string; price: number; grams: number };
export type PerKiloProps = { left: ItemPhoto; right: ItemPhoto; from: number; dur: number; tA: number; tB: number; tCalc: number; tWin: number; bg?: string };
const PK_W = 736, PK_IMG_W = 700, PK_IMG_H = 520, PK_TOP = 120;
const PrintCard: React.FC<{ it: ItemPhoto; x: number; tag: number; calcAt: number; f: number; at: (t: number) => number; win: boolean; lose: boolean; tWin: number }> = ({ it, x, tag, calcAt, f, at, win, lose, tWin }) => {
  const perR = Math.round((it.price / it.grams) * 1000);
  const drop = sp(f, at(tag), 11, 170);
  // sin conteo intermedio: el resultado aparece de golpe con un pequeño golpe de escala (1.15 -> 1.0)
  const shown = perR;
  const punch = 1 + 0.15 * (1 - sp(f, at(calcAt) + 6, 9, 220));
  const wOn = f >= at(tWin);
  const loseOn = wOn && lose; // el perdedor se apaga a 70 % de brillo sólo DESPUÉS de tWin
  return (
    <div style={{ position: "absolute", left: x - PK_W / 2, top: PK_TOP, width: PK_W }}>
      <div style={{ background: "#FFFDF8", padding: 18, borderRadius: 4, boxShadow: shadowBig }}>
        <div style={{ position: "relative", width: PK_IMG_W, height: PK_IMG_H, overflow: "hidden", background: "#bbb" }}>
          <Img src={im(it.img)} style={{ ...Cover, filter: loseOn ? "brightness(0.7)" : undefined }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,0) 45%, rgba(255,255,255,0.16) 55%, rgba(255,255,255,0) 65%)" }} />
          <div style={{ position: "absolute", right: 24, top: 24, transform: `translateY(${(1 - drop) * -460}px) rotate(${-4 + 2 * drop}deg)`, opacity: cl((f - at(tag)) / 3),
            background: RK.offer, color: RED, fontFamily: PRICE, fontWeight: 700, fontSize: 72, padding: "10px 24px 12px", borderRadius: 6, boxShadow: "0 10px 20px rgba(0,0,0,0.4)" }}>{fmtPeso(it.price)}</div>
          {wOn && win ? (
            <div style={{ position: "absolute", left: 24, top: 24, width: 140, height: 140, borderRadius: "50%", background: RK.green, boxShadow: "0 10px 22px rgba(0,0,0,0.4)",
              transform: `scale(${sp(f, at(tWin) + 4, 9, 200)})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="90" height="90" viewBox="0 0 84 84"><path d="M 14 44 L 34 64 L 72 20" fill="none" stroke="#fff" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          ) : null}
          {wOn && win ? (
            <div style={{ position: "absolute", right: 30, bottom: 26, transform: `rotate(-8deg) scale(${1.4 - 0.4 * sp(f, at(tWin) + 10, 10, 180)})`, opacity: cl((f - at(tWin)) / 4) }}>
              <Stamp label="CONVIENE" size={58} color={RK.green} />
            </div>
          ) : null}
        </div>
        <div style={{ marginTop: 14, fontFamily: LABEL_SANS, fontWeight: 800, fontSize: 44, color: RK.ink, textTransform: "uppercase", letterSpacing: 2 }}>{it.name}</div>
      </div>
      {f >= at(calcAt) - 6 ? (
        <div style={{ marginTop: 26, textAlign: "center", color: "#F4F1E6", fontFamily: LABEL_SANS, fontWeight: 700 }}>
          <div style={{ fontSize: 40, opacity: 0.9 }}>{fmtPeso(it.price)} ÷ {fmtNum(it.grams)} g × 1000</div>
          <div style={{ fontFamily: PRICE, fontWeight: 700, fontSize: 80, lineHeight: 1.1, color: "#fff", textShadow: "0 6px 20px rgba(0,0,0,0.6)", transform: `scale(${punch})`, transformOrigin: "50% 50%" }}>
            {fmtPeso(shown)} <span style={{ fontFamily: LABEL_SANS, fontSize: 36, fontWeight: 800 }}>el kilo</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};
const PerKiloIn: React.FC<PerKiloProps> = (p) => {
  const { f, at } = useLocal(p.from);
  const pl = p.left.price / p.left.grams, pr = p.right.price / p.right.grams;
  const leftWins = pl < pr, rightWins = pr < pl;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${1.05 + 0.03 * cl(f / Math.max(1, fr(p.dur)))})` }}>
        <Img src={im(p.bg ?? "img/repkit/aisle.png")} style={{ ...Cover, filter: "blur(14px) brightness(0.5) saturate(0.9)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 45% at 50% 40%, rgba(230,243,255,0.10), rgba(0,0,0,0) 75%)" }} />
      <PrintCard it={p.left} x={520} tag={p.tA} calcAt={p.tCalc} f={f} at={at} win={leftWins} lose={rightWins} tWin={p.tWin} />
      <PrintCard it={p.right} x={1400} tag={p.tB} calcAt={p.tCalc + 0.35} f={f} at={at} win={rightWins} lose={leftWins} tWin={p.tWin} />
      <Grade vig={0.3} />
      <Grain />
    </AbsoluteFill>
  );
};
export const PerKilo = mk(PerKiloIn);

// ═══════════════ 4. Ticket ═══════════════
export type TicketLine = { txt: string; amt: string; t: number };
export type TicketProps = { bg: string; from: number; dur: number; lines: TicketLine[]; hl?: { idx: number; t: number; note: string }; head?: string; slot?: [number, number] };
// slot = ranura de la impresora en la foto (lienzo 1920x1080). El papel sale de ahí y crece hacia abajo.
// Cámara: zoom ~1.4 que sigue la línea nueva; vuelve a 1.0 al final del bloque.
const LINE_H = 62, HEAD_H = 150, TK_W = 520, TK_DX = -40; // el papel arranca 40 px a la izquierda de la ranura
const zig = (() => { const n = 26; const pts: string[] = ["0% 0%", "100% 0%"]; for (let i = 0; i <= n; i++) { const x = 100 - (i * 100) / n; pts.push(`${x}% ${i % 2 ? "100%" : "calc(100% - 16px)"}`); } return `polygon(${pts.join(",")})`; })();
// resaltador: borde derecho irregular (pincelada), no un rectángulo perfecto
const marker = "polygon(0% 8%, 35% 0%, 70% 6%, 100% 0%, 99% 45%, 100% 100%, 60% 92%, 30% 100%, 0% 94%, 1% 50%)";
const TicketIn: React.FC<TicketProps> = (p) => {
  const { f, at } = useLocal(p.from);
  const slot = p.slot ?? [285, 200];
  const printed = p.lines.filter((l) => f >= at(l.t)).length;
  const followT = Math.max(0, slot[1] + HEAD_H + printed * LINE_H - 540); // la línea nueva queda al centro
  const left = slot[0] + TK_DX;
  const paperH = HEAD_H + p.lines.length * LINE_H + 180;
  const up = ez((f - at(p.lines[0] ? p.lines[0].t : 0)) / 30);
  const down = ez((f - (fr(p.dur) - 40)) / 36);
  const sc = Math.max(0.85, 1 + 0.4 * up * (1 - down));
  const cx = left + TK_W / 2;
  const noteTop = slot[1] + HEAD_H + (p.hl ? p.hl.idx : 0) * LINE_H + LINE_H / 2 - followT;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${1.02 + 0.04 * cl(f / Math.max(1, fr(p.dur)))})` }}>
        <Img src={im(p.bg)} style={Cover} />
        <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.12), rgba(0,0,0,0) 40%, rgba(0,0,0,0.15))" }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, transformOrigin: `${cx}px 540px`, transform: `scale(${sc})` }}>
        {/* zona de salida: sólo se ve el papel que ya salió de la ranura */}
        <div style={{ position: "absolute", left: 0, top: slot[1], width: 1920, height: 1080 - slot[1], overflow: "hidden" }}>
          <div style={{ position: "absolute", left, top: -followT, width: TK_W, height: paperH, transform: "rotate(-1.2deg)", transformOrigin: "50% 0%", filter: "drop-shadow(0 22px 22px rgba(0,0,0,0.45))" }}>
            <div style={{ position: "relative", width: TK_W, height: paperH, background: RK.paper, clipPath: zig, fontFamily: MONO, color: "#22201B", boxSizing: "border-box" }}>
              <AbsoluteFill style={{ backgroundImage: paperNoise, opacity: 0.8, pointerEvents: "none" }} />
              {/* curvatura al salir de la impresora: sombra en el borde superior */}
              <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(60,50,30,0.28), rgba(60,50,30,0) 40px)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", left: 36, right: 36, top: 34, fontSize: 44, fontWeight: 600, letterSpacing: 4, textAlign: "center" }}>{p.head ?? "TICKET"}</div>
              <div style={{ position: "absolute", left: 36, right: 36, top: 92, fontSize: 28, textAlign: "center", opacity: 0.75 }}>CAJA 3 · 19:42</div>
              <div style={{ position: "absolute", left: 36, right: 36, top: HEAD_H - 14, borderTop: "2px dashed #7d7767" }} />
              {p.lines.map((l, i) => {
                const u = cl((f - at(l.t)) / 6);
                return (
                  <div key={i} style={{ position: "absolute", left: 36, right: 36, top: HEAD_H + i * LINE_H, height: LINE_H, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 34, fontWeight: 600,
                    opacity: u, transform: `translateY(${(1 - u) * -8}px)` }}>
                    <span>{l.txt}</span><span>{l.amt}</span>
                  </div>
                );
              })}
              {p.hl && f >= at(p.hl.t) ? (
                <div style={{ position: "absolute", left: 26, right: 26, top: HEAD_H + p.hl.idx * LINE_H + 2, height: LINE_H - 4, background: "rgba(255,226,70,0.6)", clipPath: marker, mixBlendMode: "multiply",
                  transform: `scaleX(${ez((f - at(p.hl.t)) / 10)})`, transformOrigin: "0 50%" }} />
              ) : null}
            </div>
          </div>
        </div>
        {p.hl && f >= at(p.hl.t) + 4 ? (
          <div style={{ position: "absolute", left: left + TK_W + 30, top: noteTop - 40, width: 330, fontFamily: HAND, fontWeight: 700, fontSize: 48, lineHeight: 1.05, color: RED,
            transform: `rotate(-5deg) scale(${sp(f, at(p.hl.t) + 4, 12, 180)})`, transformOrigin: "0 50%", textShadow: "0 3px 10px rgba(0,0,0,0.5)" }}>
            {p.hl.note}
            <svg width="120" height="60" viewBox="0 0 120 60" style={{ position: "absolute", left: -128, top: 4, overflow: "visible" }}>
              <path d="M 116 30 C 80 26, 50 30, 14 30" fill="none" stroke={RED} strokeWidth="5" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - cl((f - at(p.hl.t) - 4) / 10)} />
              <path d="M 26 18 L 12 30 L 26 42" fill="none" stroke={RED} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity={cl((f - at(p.hl.t) - 4) / 10)} />
            </svg>
          </div>
        ) : null}
      </div>
      <Grade vig={0.3} />
      <Grain />
    </AbsoluteFill>
  );
};
export const Ticket = mk(TicketIn);

// ═══════════════ 5. Scanner ═══════════════
export type ScannerProps = { img: string; price: number; from: number; dur: number; tBeep: number; display?: { price: number; t: number }; win?: [number, number] };
const ScannerIn: React.FC<ScannerProps> = (p) => {
  const { f, at } = useLocal(p.from);
  const [wx, wy] = p.win ?? [1000, 730]; // ventana del escáner en la foto (lienzo 1920x1080)
  const sweepEnd = at(p.tBeep) - 4;
  const k = cl(f / Math.max(1, sweepEnd));
  const y = 160 + (760 - 160) * (0.5 - 0.5 * Math.cos(k * Math.PI * 2.5));
  const lineOn = f < sweepEnd + 2;
  const beepU = f - at(p.tBeep);
  const bloom = beepU >= 0 && beepU < 4 ? 0.35 * (1 - beepU / 4) : 0; // destello suave alrededor de la ventana, máx 35 %, 4 cuadros
  const shown = p.display && f >= at(p.display.t) ? p.display.price : p.price;
  const flick = p.display && f >= at(p.display.t) - 4 && f < at(p.display.t) ? (Math.floor(f / 2) % 2 ? 0.2 : 1) : 1;
  const lcdOn = beepU >= 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#050505" }}>
      <Img src={im(p.img)} style={{ ...Cover, transform: `scale(${1.02 + 0.03 * k})` }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.5))" }} />
      {lineOn ? (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: y - 46, height: 92, background: "linear-gradient(180deg, rgba(255,40,40,0), rgba(255,40,40,0.35), rgba(255,40,40,0))" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: y - 3, height: 6, background: "#FF3030", boxShadow: "0 0 18px 6px rgba(255,30,30,0.85), 0 0 60px 14px rgba(255,0,0,0.4)" }} />
          {Array.from({ length: 26 }, (_, i) => {
            const r = (n: number) => { const x = Math.sin(i * 91.3 + n * 17.1) * 43758.5; return x - Math.floor(x); };
            return <div key={i} style={{ position: "absolute", left: r(1) * 1920, top: y + (r(2) - 0.5) * 50, width: 5, height: 5, borderRadius: 3, background: "rgba(255,60,60,0.95)", opacity: 0.4 + 0.5 * r(3) }} />;
          })}
        </>
      ) : null}
      {bloom > 0 ? <div style={{ position: "absolute", left: wx - 320, top: wy - 320, width: 640, height: 640, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,255,255,${bloom}), rgba(255,255,255,0) 70%)` }} /> : null}
      {/* display del cliente: carcasa de plástico sobre poste, con reflejo */}
      <div style={{ position: "absolute", left: 1582, top: 660, width: 26, height: 340, background: "linear-gradient(90deg, #5A5E63, #2A2D31 50%, #5A5E63)" }} />
      <div style={{ position: "absolute", left: 1536, top: 990, width: 118, height: 22, borderRadius: 11, background: "linear-gradient(180deg, #3A3D42, #15171A)", boxShadow: "0 8px 14px rgba(0,0,0,0.5)" }} />
      <div style={{ position: "absolute", left: 1380, top: 450, width: 420, height: 220, borderRadius: 18, background: "linear-gradient(170deg, #2C3035, #0C0D0F)", boxShadow: "0 24px 40px rgba(0,0,0,0.6), inset 0 2px 0 rgba(255,255,255,0.12)", opacity: lcdOn ? 1 : 0.85 }}>
        <div style={{ position: "absolute", left: 22, top: 22, width: 376, height: 176, borderRadius: 8, background: "#06100A", boxShadow: "inset 0 0 26px rgba(0,0,0,0.95)", overflow: "hidden" }}>
          {lcdOn ? (
            <>
              <div style={{ position: "absolute", left: 22, top: 16, fontFamily: MONO, fontSize: 24, letterSpacing: 6, color: RK.lcd, opacity: 0.7 }}>TOTAL</div>
              <div style={{ position: "absolute", right: 22, top: 50, fontFamily: MONO, fontWeight: 600, fontSize: 84, lineHeight: 1.1, color: RK.lcd, whiteSpace: "nowrap", opacity: flick, textShadow: `0 0 12px ${RK.lcd}` }}>{fmtPeso(shown)}</div>
            </>
          ) : null}
          <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(180deg, rgba(0,0,0,0.2) 0 2px, rgba(0,0,0,0) 2px 5px)" }} />
        </div>
        <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: "linear-gradient(160deg, rgba(255,255,255,0.12), rgba(255,255,255,0) 40%)", pointerEvents: "none" }} />
      </div>
      <Grade vig={0.4} />
      <Grain />
    </AbsoluteFill>
  );
};
export const Scanner = mk(ScannerIn);

// ═══════════════ 6. Lupa ═══════════════
// Etiqueta impresa encima de la foto: texto REAL (no generado por IA). Vive en coordenadas del lienzo, así la lupa la muestra ×Z.
export type PrintedLabel = { box: [number, number, number, number]; lines: { txt: string; size?: number; bold?: boolean }[]; keyIdx?: number };
export type LupaProps = { bg: string; from: number; dur: number; path: { x: number; y: number; t: number }[]; zoom?: number; label?: PrintedLabel; underline?: number };
const PrintedLabelView: React.FC<{ label: PrintedLabel; f: number; at: (t: number) => number; underline?: number }> = ({ label, f, at, underline }) => {
  const [x, y, w, h] = label.box;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: "#FBFAF4", boxShadow: "0 2px 4px rgba(0,0,0,0.3)", padding: "22px 28px", boxSizing: "border-box", fontFamily: LABEL_SANS, color: "#1B1B1B" }}>
      {label.lines.map((l, i) => (
        <div key={i} style={{ fontSize: l.size ?? 26, fontWeight: l.bold ? 800 : 500, lineHeight: 1.25, whiteSpace: "nowrap" }}>{l.txt}</div>
      ))}
      {underline !== undefined && label.keyIdx !== undefined && f >= at(underline) ? (
        <Mark kind="under" x={24} y={22 + label.keyIdx * ((label.lines[label.keyIdx].size ?? 26) * 1.25) + (label.lines[label.keyIdx].size ?? 26) * 1.1} w={w - 60} h={30} f={f} at={at(underline)} dur={10} color={RED} sw={6} />
      ) : null}
    </div>
  );
};
const LupaIn: React.FC<LupaProps> = (p) => {
  const { f, at } = useLocal(p.from);
  const sec = p.from + f / 30;
  const P = p.path;
  let x = P[0].x, y = P[0].y;
  for (let i = 0; i < P.length - 1; i++) {
    if (sec >= P[i].t) {
      const a = P[i], b = P[i + 1];
      const u = ez((sec - a.t) / Math.max(0.001, b.t - a.t));
      x = mix(u, a.x, b.x); y = mix(u, a.y, b.y);
    }
  }
  if (sec >= P[P.length - 1].t) { x = P[P.length - 1].x; y = P[P.length - 1].y; }
  const Z = p.zoom ?? 2.4, R = 200;
  const bgS = 1 + 0.03 * cl(f / Math.max(1, fr(p.dur)));
  const pop = sp(f, at(P[0].t), 12, 160);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${bgS})`, transformOrigin: "50% 50%" }}>
        <Img src={im(p.bg)} style={Cover} />
        {p.label ? <PrintedLabelView label={p.label} f={f} at={at} /> : null}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.2))" }} />
      <div style={{ position: "absolute", left: x - R, top: y - R, width: R * 2, height: R * 2, borderRadius: "50%", overflow: "hidden", background: "#111", transform: `scale(${0.7 + 0.3 * pop})` }}>
        <div style={{ position: "absolute", left: R - x * Z, top: R - y * Z, width: 1920, height: 1080, transform: `scale(${Z})`, transformOrigin: "0 0" }}>
          <Img src={im(p.bg)} style={{ width: 1920, height: 1080, objectFit: "cover" }} />
          {p.label ? <PrintedLabelView label={p.label} f={f} at={at} underline={p.underline} /> : null}
        </div>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 32% 26%, rgba(255,255,255,0.28), rgba(255,255,255,0) 42%)" }} />
      </div>
      <div style={{ position: "absolute", left: x - R - 22, top: y - R - 22, width: (R + 22) * 2, height: (R + 22) * 2, borderRadius: "50%", border: "22px solid #D6D9DD", boxSizing: "border-box", transform: `scale(${0.7 + 0.3 * pop})`,
        boxShadow: "0 24px 40px rgba(0,0,0,0.5), inset 0 0 0 3px rgba(0,0,0,0.3)" }} />
      <div style={{ position: "absolute", left: x + R * 0.62, top: y + R * 0.62, width: 260, height: 46, borderRadius: 23, background: "linear-gradient(180deg, #3D3D3D, #121212)", transform: "rotate(45deg)", transformOrigin: "0 50%", boxShadow: "0 14px 22px rgba(0,0,0,0.45)" }} />
      <Grade vig={0.3} />
      <Grain />
    </AbsoluteFill>
  );
};
export const Lupa = mk(LupaIn);

// ═══════════════ 7. ShelfHeights ═══════════════
export type ShelfBand = { label: string; y0: number; y1: number; chip: string; t: number };
export type ShelfHeightsProps = { bg: string; from: number; dur: number; bands: ShelfBand[]; camPath?: Cam[]; scale?: boolean };
// persona en gris claro con contorno blanco (≈70 % del cuadro, pies en y=1040). Ojos a 0,93 de la altura.
const PERSON_H = 756, PERSON_TOP = 1040 - PERSON_H, PERSON_X = 40, EYE_Y = 1040 - 0.93 * PERSON_H;
const Person: React.FC = () => (
  <svg width="200" height={PERSON_H} viewBox="0 0 200 756" style={{ position: "absolute", left: PERSON_X, top: PERSON_TOP, overflow: "visible", filter: "drop-shadow(0 8px 10px rgba(0,0,0,0.4))" }}>
    <g fill="#E4E6E8" stroke="#FFFFFF" strokeWidth="5" strokeLinejoin="round">
      <circle cx="100" cy="62" r="50" />
      <rect x="86" y="104" width="28" height="30" />
      <path d="M 52 136 Q 100 118 148 136 L 160 400 L 40 400 Z" />
      <rect x="20" y="140" width="30" height="250" rx="15" />
      <rect x="150" y="140" width="30" height="250" rx="15" />
      <rect x="52" y="392" width="44" height="346" rx="18" />
      <rect x="104" y="392" width="44" height="346" rx="18" />
    </g>
  </svg>
);
const ShelfHeightsIn: React.FC<ShelfHeightsProps> = (p) => {
  const { f, at } = useLocal(p.from);
  const raw: Cam[] = p.camPath && p.camPath.length ? p.camPath : [{ t: p.from, s: 1.02, x: 960, y: 540 }];
  // la cámara nunca deja ver borde negro: x/y se limitan para que la foto siempre cubra el cuadro
  const K: Cam[] = raw.map((c) => ({ ...c, x: Math.min(Math.max(c.x, 960 / c.s), 1920 - 960 / c.s), y: Math.min(Math.max(c.y, 540 / c.s), 1080 - 540 / c.s) }));
  const c = camAt(f, at, K, 1.1);
  const showPerson = p.scale !== false;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, ...camStyle(c) }}>
        <Img src={im(p.bg)} style={{ width: 1920, height: 1080, objectFit: "cover" }} />
        {showPerson ? <Person /> : null}
        {showPerson ? (
          <div style={{ position: "absolute", left: PERSON_X + 160, top: EYE_Y, width: Math.max(0, 320 - (PERSON_X + 160)), borderTop: `5px dashed ${RED}`, opacity: cl((f - at(p.bands[0]?.t ?? p.from)) / 10) }} />
        ) : null}
        {p.bands.map((b, i) => {
          if (f < at(b.t)) return null;
          const u = ez((f - at(b.t)) / 14);
          const h = b.y1 - b.y0;
          return (
            <div key={i}>
              <div style={{ position: "absolute", left: 0, right: 0, top: b.y0, height: h, background: `rgba(255,70,50,${0.16 * u})`, transform: `scaleY(${0.2 + 0.8 * u})`, transformOrigin: "50% 0%",
                borderTop: `4px solid rgba(255,70,50,${u})`, borderBottom: `4px solid rgba(255,70,50,${u})` }} />
              <div style={{ position: "absolute", left: 320, top: b.y0 + h / 2 - 34, opacity: u }}><Chip2 txt={b.label} size={50} bg={RED} color="#fff" rot={-2} /></div>
              <div style={{ position: "absolute", right: 110, top: b.y0 + h / 2 - 34, opacity: u }}><Chip2 txt={b.chip} size={50} bg="#FFFDF4" color={RK.ink} rot={2} /></div>
            </div>
          );
        })}
      </div>
      <Grade vig={0.3} />
      <Grain />
    </AbsoluteFill>
  );
};
export const ShelfHeights = mk(ShelfHeightsIn);

// ═══════════════ 8. OfferPoster ═══════════════
export type OfferPosterProps = { bg: string; from: number; dur: number; big: string; small: string; tIn: number; tPeel: number; under: { txt: string; t: number; hl?: boolean }[] };
const starPts = (() => { const n = 28, R = 430, r = 372; const out: string[] = []; for (let i = 0; i < n * 2; i++) { const a = (i * Math.PI) / n; const rad = i % 2 ? r : R; out.push(`${(430 + rad * Math.cos(a)).toFixed(1)},${(430 + rad * Math.sin(a)).toFixed(1)}`); } return out.join(" "); })();
const OfferPosterIn: React.FC<OfferPosterProps> = (p) => {
  const { f, at } = useLocal(p.from);
  const sIn = sp(f, at(p.tIn), 9, 170);
  const rotIn = mix(sIn, -14, -5);
  const pe = ez((f - at(p.tPeel)) / 30);
  const peeling = f >= at(p.tPeel);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${1.02 + 0.03 * cl(f / 240)})` }}>
        <Img src={im(p.bg)} style={Cover} />
        <AbsoluteFill style={{ background: "rgba(0,0,0,0.12)" }} />
      </AbsoluteFill>
      {/* hoja blanca de la cuenta: aparece al despegarse el cartel */}
      {peeling ? (
        <div style={{ position: "absolute", left: 960 - 500, top: 540 - 330, width: 1000, height: 660, background: "#FBFAF5", boxShadow: "0 24px 44px rgba(0,0,0,0.45)", borderRadius: 3, padding: "56px 70px", boxSizing: "border-box" }}>
          <div style={{ position: "absolute", left: 440, top: -14, width: 120, height: 36, background: "rgba(240,232,200,0.8)", transform: "rotate(-3deg)" }} />
          {p.under.map((u, i) => {
            const k = cl((f - at(u.t)) / 18);
            return (
              <div key={i} style={{ position: "relative", fontFamily: LABEL_SANS, fontWeight: 800, fontSize: 84, color: RK.ink, marginBottom: 26, lineHeight: 1.1, textAlign: "center", whiteSpace: "nowrap", clipPath: `inset(0 ${(1 - k) * 100}% 0 0)` }}>
                {u.hl ? <span style={{ position: "absolute", left: -20, right: -20, top: 10, bottom: 4, background: "rgba(255,226,70,0.7)", transform: `scaleX(${k})`, transformOrigin: "0 50%", zIndex: 0 }} /> : null}
                <span style={{ position: "relative", zIndex: 1 }}>{u.txt}</span>
              </div>
            );
          })}
        </div>
      ) : null}
      {f >= at(p.tIn) ? (
        <div style={{ position: "absolute", left: 960 - 400, top: 540 - 400, width: 800, height: 800, transform: `translate(${peeling ? pe * 1300 : 0}px, ${peeling ? -pe * 240 : 0}px) rotate(${rotIn + (peeling ? pe * 36 : 0)}deg) scale(${sIn * (peeling ? 1 - 0.08 * pe : 1)})`,
          opacity: peeling ? 1 - 0.1 * pe : Math.min(1, sIn + 0.2), transformOrigin: "50% 50%", filter: "drop-shadow(0 18px 22px rgba(0,0,0,0.45))" }}>
          <div style={{ position: "relative", width: 800, height: 800, overflow: "hidden" }}>
            <svg width="860" height="860" viewBox="0 0 860 860" style={{ position: "absolute", left: -30, top: -30, filter: "url(#rk-wrinkle)" }}>
              <defs><filter id="rk-wrinkle"><feTurbulence baseFrequency="0.02 0.05" numOctaves="2" seed="7" /><feDisplacementMap in="SourceGraphic" scale="9" /></filter></defs>
              <polygon points={starPts} fill={RK.offer} stroke={RED} strokeWidth="6" />
              <circle cx="430" cy="430" r="300" fill="#FFF3A6" />
            </svg>
            <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: STAMP, fontSize: 98, color: "#fff", background: RED, padding: "10px 0 18px", transform: "rotate(-4deg)", width: 620, margin: "0 auto", letterSpacing: 6 }}>{p.small}</div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center", fontFamily: STAMP, fontSize: 340, lineHeight: 1, color: RK.ink, textShadow: `8px 8px 0 ${RED}` }}>{p.big}</div>
          </div>
          {[[-8, -8], [770, -8], [-8, 770], [770, 770]].map(([x, y], i) => (
            <div key={i} style={{ position: "absolute", left: x, top: y, width: 110, height: 40, background: "rgba(240,232,200,0.75)", transform: `rotate(${i % 2 ? 40 : -40}deg)`, boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }} />
          ))}
        </div>
      ) : null}
      <Grade vig={0.3} />
      <Grain />
    </AbsoluteFill>
  );
};
export const OfferPoster = mk(OfferPosterIn);

// ═══════════════ 9. ClockDeal ═══════════════
export type ClockDealProps = { bg: string; from: number; dur: number; hourFrom: number; hourTo: number; tSpin: number; label: string };
const ClockDealIn: React.FC<ClockDealProps> = (p) => {
  const { f, at } = useLocal(p.from);
  const k = cl((f - at(p.tSpin)) / 75);
  const h = mix(ez(k), p.hourFrom, p.hourTo);
  const hourA = ((h % 12) / 12) * 360, minA = (h % 1) * 360;
  const sec = ((f / 30) % 60) * 6;
  const warm = ez((f - at(p.tSpin)) / 90);
  const ticks = Array.from({ length: 60 }, (_, i) => i);
  const C = 270; // radio
  const cx = 1600, cy = 300;
  const labelU = sp(f, at(p.tSpin) + 80, 12, 170);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${1.03 + 0.03 * cl(f / 200)})` }}>
        <Img src={im(p.bg)} style={Cover} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,150,70,0.6), rgba(255,120,40,0.4))", mixBlendMode: "soft-light", opacity: warm * 0.9 }} />
      <AbsoluteFill style={{ background: "rgba(10,8,30,1)", opacity: 0.45 * warm }} />
      <div style={{ position: "absolute", left: cx - C, top: cy - C, width: C * 2, height: C * 2, borderRadius: "50%", background: "#FFFFFF", boxSizing: "border-box", boxShadow: "inset 0 0 0 20px #151515, 0 30px 50px rgba(0,0,0,0.5)" }}>
        {ticks.map((i) => (
          <div key={i} style={{ position: "absolute", left: C - 2, top: 10, width: i % 5 === 0 ? 6 : 2.5, height: i % 5 === 0 ? 30 : 16, background: "#111", transformOrigin: `2px ${C - 10}px`, transform: `rotate(${i * 6}deg)` }} />
        ))}
        {Array.from({ length: 12 }, (_, i) => {
          const a = ((i + 1) * 30 - 90) * Math.PI / 180;
          return <div key={i} style={{ position: "absolute", left: C + Math.cos(a) * (C - 80) - 26, top: C + Math.sin(a) * (C - 80) - 24, width: 52, textAlign: "center", fontFamily: LABEL_SANS, fontWeight: 800, fontSize: 46, color: "#111" }}>{i + 1}</div>;
        })}
        <div style={{ position: "absolute", left: C - 16, top: C - 170, width: 32, height: 180, background: "#111", borderRadius: 14, transformOrigin: "12px 180px", transform: `rotate(${hourA}deg)` }} />
        <div style={{ position: "absolute", left: C - 9, top: C - 245, width: 18, height: 255, background: "#111", borderRadius: 9, transform: `rotate(${minA}deg)`, transformOrigin: "9px 245px" }} />
        <div style={{ position: "absolute", left: C - 3, top: C - 240, width: 6, height: 290, background: RED, transform: `rotate(${sec}deg)`, transformOrigin: "3px 240px" }} />
        <div style={{ position: "absolute", left: C - 16, top: C - 16, width: 32, height: 32, borderRadius: 16, background: "#111" }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 120, textAlign: "center", opacity: labelU, transform: `translateY(${(1 - labelU) * 40}px) rotate(-2deg)` }}>
        <Chip2 txt={p.label} size={70} bg={RED} color="#fff" rot={0} />
      </div>
      <Grade vig={0.35} />
    </AbsoluteFill>
  );
};
export const ClockDeal = mk(ClockDealIn);

// ═══════════════ 10. Clipboard ═══════════════
export type ClipLine = { txt: string; t: number; tick?: number };
export type ClipboardProps = { from: number; dur: number; lines: ClipLine[]; title: string; bg?: string };
const ClipboardIn: React.FC<ClipboardProps> = (p) => {
  const { f, at } = useLocal(p.from);
  const cam = 1.0 + 0.05 * cl(f / Math.max(1, fr(p.dur)));
  const pen = (t: number, n = 26) => cl((f - at(t)) / n);
  const titleK = pen(p.lines[0] ? p.lines[0].t - 0.9 : 0.3, 22);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#111" }}>
      <AbsoluteFill style={{ transform: `scale(${cam})`, filter: "blur(2px) brightness(0.7)" }}>
        <Img src={im(p.bg ?? "img/repkit/corkboard.png")} style={Cover} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 960 - 470, top: 540 - 520, width: 940, height: 1040, borderRadius: 18, background: "linear-gradient(170deg, #C29B63, #9C7442)", boxShadow: "0 40px 70px rgba(0,0,0,0.6)", transform: `scale(${cam})` }}>
        <div style={{ position: "absolute", left: 80, top: 100, width: 780, height: 900, background: "#FFFEF9", boxShadow: "0 6px 18px rgba(0,0,0,0.25)" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(180deg, rgba(60,110,190,0.28) 0 2px, rgba(0,0,0,0) 2px 60px)", backgroundPosition: "0 130px" }} />
          <div style={{ position: "absolute", left: 60, top: 36, fontFamily: HAND, fontWeight: 700, fontSize: 76, color: RK.pen, clipPath: `inset(0 ${(1 - titleK) * 100}% 0 0)`, whiteSpace: "nowrap" }}>{p.title}</div>
          {p.lines.map((l, i) => {
            const k = pen(l.t, 26);
            const y = 150 + i * 92;
            return (
              <React.Fragment key={i}>
                <div style={{ position: "absolute", left: 60, top: y, fontFamily: HAND, fontWeight: 700, fontSize: 70, color: RK.pen, whiteSpace: "nowrap", clipPath: `inset(0 ${(1 - k) * 100}% 0 0)` }}>{l.txt}</div>
                {l.tick !== undefined && f >= at(l.tick) ? (
                  <svg style={{ position: "absolute", left: 700, top: y + 6, overflow: "visible" }} width="90" height="80" viewBox="0 0 90 80">
                    <path d="M 4 40 L 30 68 L 84 6" fill="none" stroke={RED} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - cl((f - at(l.tick)) / 12)} />
                  </svg>
                ) : null}
              </React.Fragment>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 340, top: -60, width: 260, height: 150, borderRadius: 10, background: "linear-gradient(180deg, #D8D8D8, #8E8E8E)", boxShadow: "0 8px 14px rgba(0,0,0,0.4)" }} />
      </div>
      <Grade vig={0.45} />
      <Grain o={0.06} />
    </AbsoluteFill>
  );
};
export const Clipboard = mk(ClipboardIn);

// ═══════════════ 11. CountCard ═══════════════
export type CountCardProps = { from: number; dur: number; n: number; of: number; word?: string; title: string; bg: string; t: number };
const WORD_COLOR: Record<string, { bg: string; color: string }> = {
  ENGAÑO: { bg: RED, color: "#fff" }, TRAMPA: { bg: RED, color: "#fff" }, SECRETO: { bg: RK.apron, color: "#fff" },
  TRUCO: { bg: RK.offer, color: RK.ink }, OFERTA: { bg: RK.offer, color: RK.ink },
};
const CountCardIn: React.FC<CountCardProps> = (p) => {
  const { f, at } = useLocal(p.from);
  const word = p.word ?? "ENGAÑO";
  const wc = WORD_COLOR[word] ?? WORD_COLOR.ENGAÑO;
  const on = sp(f, at(p.t), 10, 170);
  const flashU = cl(1 - (f - at(p.t)) / 8) * (f >= at(p.t) ? 1 : 0);
  const pushS = 1.04 + 0.08 * cl(f / Math.max(1, fr(p.dur)));
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${pushS})`, transformOrigin: "50% 40%" }}><Img src={im(p.bg)} style={Cover} /></AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.8) 100%)" }} />
      <div style={{ position: "absolute", left: 120, top: 120 }}><Chip2 txt={word} size={58} bg={wc.bg} color={wc.color} rot={-3} /></div>
      <div style={{ position: "absolute", right: 110, top: 110, transform: "rotate(5deg)", opacity: sp(f, at(p.t) - 4, 12, 160) }}>
        <Stamp label="DETRÁS DE LA GÓNDOLA" size={34} color="#fff" w={420} />
      </div>
      <div style={{ position: "absolute", left: 120, bottom: 230, display: "flex", alignItems: "flex-end", gap: 20, transform: `scale(${mixS(on)})`, transformOrigin: "0 100%", opacity: cl(on * 2) }}>
        <div style={{ fontFamily: PRICE, fontWeight: 700, fontSize: 500, lineHeight: 0.8, color: "#fff", textShadow: "0 12px 40px rgba(0,0,0,0.6)" }}>{p.n}</div>
        <div style={{ fontFamily: PRICE, fontWeight: 700, fontSize: 150, lineHeight: 0.8, color: RK.offer, paddingBottom: 6 }}>/{p.of}</div>
      </div>
      <div style={{ position: "absolute", left: 124, right: 124, bottom: 110, fontFamily: LABEL_SANS, fontWeight: 800, fontSize: 84, color: "#fff", lineHeight: 1.05, textShadow: "0 6px 22px rgba(0,0,0,0.7)", opacity: cl((f - at(p.t) - 6) / 10) }}>{p.title}</div>
      {flashU > 0 ? <AbsoluteFill style={{ background: `rgba(255,255,255,${0.5 * flashU})` }} /> : null}
      <Grade vig={0.3} />
    </AbsoluteFill>
  );
};
const mixS = (u: number) => 1.6 - 0.6 * u;
export const CountCard = mk(CountCardIn);

// ═══════════════ 12. BeforeAfter ═══════════════
export type BeforeAfterProps = { from: number; dur: number; a: string; b: string; tWipe: number; labels?: [string, string] };
const BeforeAfterIn: React.FC<BeforeAfterProps> = (p) => {
  const { f, at } = useLocal(p.from);
  const labels = p.labels ?? ["ANTES", "DESPUÉS"];
  const u = ez((f - at(p.tWipe)) / 36);
  const x = -40 + 1960 * u;
  const drift = 1.02 + 0.05 * cl(f / Math.max(1, fr(p.dur)));
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${drift})` }}>
        <Img src={im(p.a)} style={Cover} />
        <AbsoluteFill style={{ WebkitMaskImage: `linear-gradient(90deg, #000 ${x - 60}px, rgba(0,0,0,0) ${x}px)`, maskImage: `linear-gradient(90deg, #000 ${x - 60}px, rgba(0,0,0,0) ${x}px)` }}>
          <Img src={im(p.b)} style={Cover} />
        </AbsoluteFill>
        {u > 0 && u < 1 ? <div style={{ position: "absolute", top: 0, bottom: 0, left: x - 4, width: 8, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.8), rgba(255,255,255,0))" }} /> : null}
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 80, top: 80, opacity: cl(f / 10) }}><Chip2 txt={labels[0]} size={60} /></div>
      <div style={{ position: "absolute", right: 80, top: 80, opacity: cl((f - at(p.tWipe) - 20) / 10) }}><Chip2 txt={labels[1]} size={60} bg={RED} color="#fff" rot={2} /></div>
      <Grade vig={0.25} />
    </AbsoluteFill>
  );
};
export const BeforeAfter = mk(BeforeAfterIn);

// ═══════════════ 13. Cta ═══════════════
export type CtaProps = { from: number; dur: number; t: number; title?: string; cover?: string; bg?: string };
const CtaIn: React.FC<CtaProps> = (p) => {
  const { f, at } = useLocal(p.from);
  const inU = sp(f, 4, 14, 120);
  const sway = Math.sin(f / 70) * 0.8;
  const arrowU = cl((f - at(p.t)) / 16);
  const title = p.title ?? "Las 40 trampas del súper";
  const CW = 520, CH = 700; // 65 % del alto del cuadro, completa en pantalla
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ filter: "blur(8px) brightness(0.55)", transform: "scale(1.06)" }}><Img src={im(p.bg ?? "img/repkit/storeroom.png")} style={Cover} /></AbsoluteFill>
      {/* luz cálida de llave sobre la portada */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 45% 50% at 50% 42%, rgba(255,205,140,0.55), rgba(255,205,140,0) 70%)", mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "rgba(10,20,14,0.2)" }} />
      <div style={{ position: "absolute", left: 960 - CW / 2, top: 130, width: CW, height: CH, opacity: cl(inU * 1.5), transform: `rotate(${-3 + sway}deg) scale(${0.92 + 0.08 * inU})`, filter: "drop-shadow(0 34px 40px rgba(0,0,0,0.6))" }}>
        {p.cover ? <Img src={im(p.cover)} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4 }} /> : (
          <div style={{ position: "relative", width: "100%", height: "100%", background: `linear-gradient(160deg, #2C6B4B, ${RK.apron} 60%, #163827)`, borderRadius: 4, overflow: "hidden", color: "#FBF3DF", fontFamily: SERIF, boxSizing: "border-box", padding: "70px 60px" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 24, background: "rgba(0,0,0,0.28)" }} />
            <AbsoluteFill style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='c'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.08 0'/></filter><rect width='100%25' height='100%25' filter='url(%23c)'/></svg>\")" }} />
            <div style={{ position: "relative", fontFamily: STAMP, fontSize: 36, letterSpacing: 3, border: "5px solid #FBF3DF", padding: "12px 18px", display: "inline-block", textTransform: "uppercase", opacity: 0.95 }}>Detrás de la góndola</div>
            <div style={{ position: "relative", marginTop: 90, fontWeight: 900, fontSize: 80, lineHeight: 1.04 }}>{title}</div>
            <div style={{ position: "relative", marginTop: 56, fontFamily: LABEL_SANS, fontWeight: 800, fontSize: 36, letterSpacing: 2, textTransform: "uppercase" }}>por Claudio</div>
            <div style={{ position: "relative", marginTop: 10, fontFamily: LABEL_SANS, fontWeight: 500, fontSize: 32, opacity: 0.9 }}>30 años detrás de la góndola</div>
          </div>
        )}
      </div>
      {f >= at(p.t) ? (
        <div style={{ position: "absolute", left: 960 - 250, top: 880, transform: `scale(${sp(f, at(p.t), 10, 180)})`, transformOrigin: "50% 0%", display: "flex", alignItems: "center", gap: 18 }}>
          <Chip2 txt="LINK EN LA DESCRIPCIÓN" size={46} bg={RK.offer} color={RK.ink} rot={-2} />
          <svg width="120" height="90" viewBox="0 0 120 90" style={{ overflow: "visible" }}>
            <path d="M 10 10 C 40 14, 70 40, 92 70" fill="none" stroke={RK.offer} strokeWidth="9" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - arrowU} />
            <path d="M 70 62 L 94 74 L 98 48" fill="none" stroke={RK.offer} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" opacity={arrowU} />
          </svg>
        </div>
      ) : null}
      <Grade vig={0.25} />
      <Grain />
    </AbsoluteFill>
  );
};
export const Cta = mk(CtaIn);

// ═══════════════ 14. CommentQ ═══════════════
// comentario de un ESPECTADOR (no Claudio): avatar gris con inicial, nombre genérico, "hace 2 días", la pregunta. Sin logos de YouTube.
export type CommentQProps = { from: number; dur: number; q: string; t: number; bg?: string; name?: string; initial?: string; when?: string };
const CommentQIn: React.FC<CommentQProps> = (p) => {
  const { f, at } = useLocal(p.from);
  const u = sp(f, at(p.t), 12, 150);
  const push = 1.02 + 0.05 * cl(f / Math.max(1, fr(p.dur)));
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${push})` }}><Img src={im(p.bg ?? "img/repkit/aisle.png")} style={Cover} /></AbsoluteFill>
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.3)" }} />
      <div style={{ position: "absolute", left: 960 - 450, bottom: 150, width: 900, background: "#FFFFFF", borderRadius: 20, padding: "40px 46px", boxSizing: "border-box",
        boxShadow: "0 30px 60px rgba(0,0,0,0.45)", transform: `translateX(${(1 - u) * 1300}px)`, fontFamily: LABEL_SANS, color: "#0F0F0F" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ width: 92, height: 92, borderRadius: "50%", background: "#8A8F96", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 48, flexShrink: 0 }}>{p.initial ?? "M"}</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 40 }}>{p.name ?? "Marta G."} <span style={{ fontWeight: 500, fontSize: 32, color: "#6B6B6B", marginLeft: 12 }}>{p.when ?? "hace 2 días"}</span></div>
          </div>
        </div>
        <div style={{ marginTop: 26, fontWeight: 600, fontSize: 52, lineHeight: 1.22 }}>{p.q}</div>
      </div>
      <Grade vig={0.3} />
      <Grain />
    </AbsoluteFill>
  );
};
export const CommentQ = mk(CommentQIn);

export { Chip2, fmtPeso as _fmt, HAND };
