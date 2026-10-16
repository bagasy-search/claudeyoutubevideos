// ── HÉROES de Stan the Butcher · video 2 (stan2, 15-oct): "el ribeye de US$5" (chuck eye, Denver, flat iron) ──
// Juego PROPIO de este video: mostrador de carnicería de verdad en capas (textura real del oficio → sombra → objeto → dato → acento).
// Dos familias: LABEL (Oswald, lo impreso: etiquetas, tickets, balanza) y HAND (Caveat, lo escrito a mano: tiza, lápiz graso, fichas).
// Paleta del local de la foto: azulejo blanco, raya roja del gorro, acero, papel de carnicería, etiqueta amarilla de oferta.
// Cada golpe en SU palabra: todo `t` es el segundo absoluto de words.json y cae dentro del plano.
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { useT, sp, cl, ez, eo, img, LABEL, HAND, Mark, Tick, P, fit, lin, FullPhoto, Bed, Stage, Chip } from "../lkit/core";

const RED = "#B3262B", INK = "#1F1A16", CREAM = "#F4EEE2", YEL = "#F2C230", STEEL = "#8E979C", GREEN = "#2F7D4A", BLUE = "#3A5A8C";
const SH = "0 34px 70px rgba(0,0,0,0.5), 0 8px 16px rgba(0,0,0,0.3)";
const tsh = "0 4px 18px rgba(0,0,0,0.6)";

// ── capas comunes ──
// textura real a pantalla completa con deriva lenta (parallax de fondo)
const Tex: React.FC<{ k: string; f: number; d: number; dim?: number; z?: [number, number]; blur?: number }> = ({ k, f, d, dim = 0, z = [1.04, 1.1], blur = 0 }) => (
  <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#141110" }}>
    <AbsoluteFill style={{ transform: `scale(${z[0] + (z[1] - z[0]) * f / Math.max(1, d)})`, filter: blur ? `blur(${blur}px)` : undefined }}>
      <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
    {dim ? <AbsoluteFill style={{ background: `rgba(12,10,8,${dim})` }} /> : null}
  </AbsoluteFill>
);
// foto real con empuje lento (capa de fondo de los héroes sobre foto)
const Photo: React.FC<{ k: string; f: number; d: number; z?: [number, number]; o?: string; dim?: number }> = ({ k, f, d, z = [1.03, 1.12], o = "50% 50%", dim = 0 }) => (
  <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
    <AbsoluteFill style={{ transform: `scale(${z[0] + (z[1] - z[0]) * f / Math.max(1, d)})`, transformOrigin: o }}>
      <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
    {dim ? <AbsoluteFill style={{ background: `rgba(10,8,6,${dim})` }} /> : null}
  </AbsoluteFill>
);
// foto enmarcada como recorte sobre el mostrador (borde blanco + sombra proyectada)
const Snap: React.FC<{ k: string; w: number; h: number; f: number; rot?: number; filter?: string; children?: React.ReactNode }> = ({ k, w, h, f, rot = 0, filter, children }) => (
  <div style={{ background: "#FBF8F1", padding: 12, boxShadow: SH, transform: `rotate(${rot}deg)` }}>
    <div style={{ position: "relative", width: w, height: h, overflow: "hidden" }}>
      <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", filter, transform: `scale(${1.03 + 0.03 * Math.sin(f / 60)})` }} />
      {children}
    </div>
  </div>
);
// papel de carnicería (textura real) para tarjetas
const paperBg = (k = "t_paper"): React.CSSProperties => ({ backgroundImage: `url(${img(k)})`, backgroundSize: "cover", backgroundPosition: "center" });
// etiqueta colgante de precio (forma de tag con ojal e hilo)
const Tag: React.FC<{ price: string; unit?: string; txt?: string; color?: string; ink?: string; w?: number }> = ({ price, unit, txt, color = CREAM, ink = INK, w = 420 }) => (
  <div style={{ position: "relative", width: w }}>
    <div style={{ background: color, clipPath: "polygon(16% 0, 100% 0, 100% 100%, 16% 100%, 0 50%)", padding: `30px 34px 30px ${w * 0.22}px`, boxShadow: SH,
      filter: "drop-shadow(0 18px 24px rgba(0,0,0,0.45))" }}>
      {txt ? <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 30, letterSpacing: 3, color: ink, opacity: 0.8 }}>{txt}</div> : null}
      <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 118, lineHeight: 1, color: ink }}>{price}</div>
      {unit ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: ink, marginTop: 2 }}>{unit}</div> : null}
    </div>
    <div style={{ position: "absolute", left: w * 0.09, top: "50%", width: 26, height: 26, marginTop: -13, borderRadius: 13, background: "#2a2522", boxShadow: "inset 0 3px 5px rgba(0,0,0,0.7)" }} />
  </div>
);
// número redondo (raya roja del gorro)
const Badge: React.FC<{ n: number | string; size?: number; bg?: string }> = ({ n, size = 96, bg = RED }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: bg, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: size * 0.58,
    display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 26px rgba(0,0,0,0.45)", border: "4px solid #fff" }}>{n}</div>
);
// rótulo escrito a mano en tira de papel
const Strip: React.FC<{ txt: string; u: number; size?: number; rot?: number; bg?: string; color?: string }> = ({ txt, u, size = 54, rot = -2, bg = CREAM, color = INK }) => (
  <div style={{ display: "inline-block", opacity: cl(u * 1.6), transform: `translateY(${(1 - u) * 30}px) rotate(${rot}deg)`, background: bg, color, fontFamily: HAND, fontWeight: 700,
    fontSize: size, padding: `${size * 0.12}px ${size * 0.45}px`, boxShadow: "0 16px 32px rgba(0,0,0,0.4)", whiteSpace: "nowrap" }}>{txt}</div>
);
// texto que se "escribe" de izquierda a derecha (máscara), para tiza y lápiz
const Write: React.FC<{ txt: string; u: number; size: number; color: string; font?: string; weight?: number; ls?: number }> = ({ txt, u, size, color, font = HAND, weight = 700, ls = 0 }) => (
  <div style={{ display: "inline-block", fontFamily: font, fontWeight: weight, fontSize: size, color, letterSpacing: ls, whiteSpace: "nowrap", clipPath: `inset(-20% ${100 - 100 * cl(u)}% -20% -2%)` }}>{txt}</div>
);
const wr = (f: number, at: number, dur = 18) => ez((f - at) / dur);

// 1 · PRECIO QUE SE CAMBIA: etiqueta del ribeye US$18 → se tacha y la foto se apaga; entra la etiqueta amarilla US$5 sobre el chuck eye.
export const PriceSwap: P<{ old: { k: string; price: string; unit: string; txt: string; t: number }; new: { k: string; price: string; unit: string; txt: string; t: number }; strike: number; same: { t: number; txt: string }[] }> =
  ({ a, d, old, new: nw, strike, same }) => {
    const { f, at } = useT(a);
    const uo = sp(f, at(old.t), 14, 120), un = sp(f, at(nw.t), 11, 170), us = eo((f - at(strike)) / 12);
    const drift = f / Math.max(1, d);
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Tex k="t_steel" f={f} d={d} dim={0.18} />
        {/* foto vieja (ribeye) a la izquierda, se apaga al tachar */}
        <div style={{ position: "absolute", left: 120 - drift * 20, top: 170, opacity: cl(uo * 1.5), transform: `translateY(${(1 - uo) * 60}px)` }}>
          <Snap k={old.k} w={760} h={520} f={f} rot={-2.5} filter={`grayscale(${0.75 * us}) brightness(${1 - 0.25 * us})`} />
        </div>
        <div style={{ position: "absolute", left: 470, top: 560, transform: `rotate(${-8 + 3 * Math.sin(f / 22)}deg) scale(${0.9 + 0.1 * uo})`, transformOrigin: "0 50%", opacity: cl(uo * 1.4) }}>
          <Tag price={old.price} unit={old.unit} txt={old.txt} w={400} />
          <Mark kind="strike" x={60} y={60} w={330} h={110} f={f} at={at(strike)} dur={10} sw={16} />
        </div>
        {/* foto nueva (chuck eye) entra por la derecha */}
        {f >= at(nw.t) - 2 ? (
          <div style={{ position: "absolute", right: 110 + drift * 20, top: 130, opacity: cl(un * 1.4), transform: `translateX(${(1 - un) * 260}px) rotate(${2 * un}deg)` }}>
            <Snap k={nw.k} w={760} h={520} f={f} />
          </div>
        ) : null}
        {f >= at(nw.t) ? (
          <div style={{ position: "absolute", right: 560, top: 560, transform: `scale(${1.5 - 0.5 * un}) rotate(${6 - 3 * Math.sin(f / 25)}deg)`, transformOrigin: "100% 50%", opacity: cl(un * 2) }}>
            <Tag price={nw.price} unit={nw.unit} txt={nw.txt} color={YEL} w={460} />
          </div>
        ) : null}
        {same.map((s, i) => f >= at(s.t) ? (
          <div key={i} style={{ position: "absolute", left: 820, top: 880 + i * 0, marginLeft: i * 300 - 150 }}>
            <Strip txt={s.txt} u={sp(f, at(s.t), 13, 150)} size={56} rot={i ? 2 : -2} />
          </div>
        ) : null)}
      </AbsoluteFill>
    );
  };

// 2 · TICKET DE BALANZA: la foto de la balanza a la izquierda; a la derecha, la ranura de acero imprime el ticket renglón por renglón.
export const ScaleTicket: P<{ k: string; rows: { txt: string; price: string; t: number }[]; total: { price: string; t: number } }> = ({ a, d, k, rows, total }) => {
  const { f, at } = useT(a);
  const n = rows.filter((r) => f >= at(r.t)).length + (f >= at(total.t) ? 1 : 0);
  const feed = rows.reduce((h, r, i) => h + 90 * ez((f - at(r.t)) / 10), 150) + 170 * ez((f - at(total.t)) / 12);
  const ut = sp(f, at(total.t) + 8, 10, 190);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Photo k={k} f={f} d={d} dim={0.35} z={[1.08, 1.16]} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(10,8,6,0) 30%, rgba(10,8,6,0.65) 70%)" }} />
      {/* ranura de acero */}
      <div style={{ position: "absolute", left: 1110, top: 120, width: 640, height: 70, borderRadius: 10, ...paperBg("t_steel"), boxShadow: "0 18px 30px rgba(0,0,0,0.55), inset 0 -6px 10px rgba(0,0,0,0.5)" }}>
        <div style={{ position: "absolute", left: 60, right: 60, bottom: 14, height: 10, background: "#111", borderRadius: 5 }} />
      </div>
      {/* ticket que sale */}
      <div style={{ position: "absolute", left: 1180, top: 180, width: 500, height: feed, overflow: "hidden", filter: "drop-shadow(0 22px 26px rgba(0,0,0,0.5))" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 760, background: "#FBFAF6", padding: "26px 34px", boxSizing: "border-box",
          WebkitMaskImage: "linear-gradient(180deg, #000 96%, transparent)" }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 34, letterSpacing: 4, color: INK, textAlign: "center" }}>WOZNIAK MEATS</div>
          <div style={{ fontFamily: LABEL, fontSize: 24, letterSpacing: 3, color: "#6b645c", textAlign: "center", marginBottom: 14 }}>CHICAGO · SINCE 1951</div>
          <div style={{ borderTop: "3px dashed #9a948c", margin: "8px 0 16px" }} />
          {rows.map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontFamily: LABEL, fontWeight: 500, fontSize: 38, color: INK, opacity: f >= at(r.t) ? 1 : 0, marginBottom: 18 }}>
              <span>{r.txt}</span><span>{r.price}</span>
            </div>
          ))}
          <div style={{ borderTop: "3px dashed #9a948c", margin: "10px 0 16px", opacity: n > rows.length ? 1 : 0 }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: LABEL, fontWeight: 700, fontSize: 60, color: INK, opacity: n > rows.length ? 1 : 0 }}>
            <span>TOTAL</span><span>{total.price}</span>
          </div>
        </div>
      </div>
      {f >= at(total.t) + 8 ? (
        <div style={{ position: "absolute", left: 1270, top: 640, transform: `rotate(-9deg) scale(${1.6 - 0.6 * ut})`, opacity: cl(ut * 2), border: `8px solid ${RED}`, color: RED,
          fontFamily: LABEL, fontWeight: 700, fontSize: 70, padding: "6px 26px", letterSpacing: 4, background: "rgba(255,255,255,0.08)" }}>FOR TWO STEAKS</div>
      ) : null}
    </AbsoluteFill>
  );
};

// 3 · ETIQUETA CON NOMBRE: la foto del corte + una tira de papel de carnicería clavada con alfiler rojo; abajo, el apodo escrito a mano.
export const NameTag: P<{ k: string; n: number; name: string; t: number; alias: string; ta: number }> = ({ a, d, k, n, name, t, alias, ta }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(t), 13, 130), ua = wr(f, at(ta), 22);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Photo k={k} f={f} d={d} z={[1.02, 1.14]} o="60% 50%" />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(10,8,6,0.62) 0%, rgba(10,8,6,0.1) 55%)" }} />
      <div style={{ position: "absolute", left: 90, top: 300, transform: `translateX(${(1 - u) * -700}px) rotate(${-2.5 + (1 - u) * -6}deg)` }}>
        <div style={{ ...paperBg(), padding: "36px 70px 40px 150px", boxShadow: SH, position: "relative" }}>
          <div style={{ position: "absolute", left: 30, top: "50%", marginTop: -48 }}><Badge n={n} /></div>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: RED }}>ASK FOR IT BY NAME</div>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 132, lineHeight: 1, color: INK, letterSpacing: 2 }}>{name}</div>
          {/* alfiler */}
          <div style={{ position: "absolute", right: 34, top: -16, width: 34, height: 34, borderRadius: 17, background: `radial-gradient(circle at 35% 35%, #ff7b6b, ${RED} 60%, #6d1215)`, boxShadow: "0 8px 10px rgba(0,0,0,0.5)" }} />
        </div>
      </div>
      {f >= at(ta) ? (
        <div style={{ position: "absolute", left: 210, top: 590, transform: "rotate(-3deg)" }}>
          <Write txt={alias} u={ua} size={86} color="#FFF6DA" />
          <svg width={620} height={30} style={{ display: "block", marginTop: -6 }}><path d="M 4 18 C 160 6, 380 28, 610 12" stroke={YEL} strokeWidth={7} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - cl(ua * 1.2 - 0.2)} /></svg>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// 4 · DIAGRAMA DE CORTES en papel de carnicería: la res de perfil, sus cortes; se ilumina el RIB, la tira del "ojo" sigue hacia el CHUCK, y se marca el chuck eye.
const COW = "M 92 402 L 72 342 L 118 252 L 160 214 L 204 236 L 300 198 L 420 168 L 700 162 L 950 168 L 1100 162 L 1250 184 L 1272 232 L 1272 330 L 1242 452 L 1212 560 L 1218 650 L 1168 650 L 1150 522 L 1050 470 L 800 490 L 560 496 L 442 480 L 432 560 L 434 650 L 382 650 L 372 540 L 330 470 L 250 420 L 170 420 L 112 420 Z";
const PARTS: Record<string, { x: number; y: number; w: number; h: number; lab: string; lx: number; ly: number }> = {
  chuck: { x: 270, y: 120, w: 290, h: 300, lab: "CHUCK", lx: 400, ly: 330 }, rib: { x: 560, y: 120, w: 200, h: 300, lab: "RIB", lx: 660, ly: 330 },
  loin: { x: 760, y: 120, w: 300, h: 310, lab: "LOIN", lx: 905, ly: 330 }, round: { x: 1060, y: 120, w: 260, h: 560, lab: "ROUND", lx: 1170, ly: 330 },
  brisket: { x: 250, y: 420, w: 310, h: 260, lab: "BRISKET", lx: 410, ly: 452 }, plate: { x: 560, y: 420, w: 200, h: 260, lab: "PLATE", lx: 660, ly: 460 },
  flank: { x: 760, y: 430, w: 300, h: 250, lab: "FLANK", lx: 905, ly: 462 },
};
export const CowChart: P<{ beats: { t: number; part: string; txt: string }[] }> = ({ a, d, beats }) => {
  const { f, at } = useT(a);
  const order = ["rib", "eye", "chuck", "same"];
  const first = order.indexOf(beats[0]?.part || "rib");
  const on = (p: string) => { const i = order.indexOf(p); if (i < first) return 1; const b = beats.find((x) => x.part === p); return b ? cl((f - at(b.t)) / 12) : 0; };
  const cur = [...beats].reverse().find((b) => f >= at(b.t));
  const ue = on("eye"), uc = on("chuck"), us = on("same"), ur = on("rib");
  const pulse = us > 0 ? 0.5 + 0.5 * Math.sin(f / 5) : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Tex k="t_paper" f={f} d={d} z={[1.02, 1.06]} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 46, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 44, letterSpacing: 10, color: INK, opacity: 0.75 }}>BEEF · CUTS OF THE SIDE</div>
      <svg width={1920} height={1080} viewBox="-150 -60 1600 800" style={{ position: "absolute", left: 0, top: 30, filter: "drop-shadow(0 10px 8px rgba(60,40,20,0.25))" }}>
        <defs><clipPath id="cow2"><path d={COW} /></clipPath></defs>
        <path d={COW} fill="#EFE3CF" />
        <g clipPath="url(#cow2)">
          {Object.entries(PARTS).map(([p, r]) => {
            const lit = p === "rib" ? ur : p === "chuck" ? uc : 0;
            const col = p === "rib" ? RED : YEL;
            return <rect key={p} x={r.x} y={r.y} width={r.w} height={r.h} fill={col} opacity={lit * (p === "chuck" ? 0.55 + 0.2 * pulse : 0.5 + 0.15 * pulse)} />;
          })}
          {/* líneas de cortes */}
          {[560, 760, 1060].map((x) => <line key={x} x1={x} y1={100} x2={x} y2={700} stroke={INK} strokeWidth={4} strokeDasharray="14 10" opacity={0.7} />)}
          <line x1={270} y1={100} x2={300} y2={700} stroke={INK} strokeWidth={4} strokeDasharray="14 10" opacity={0.7} />
          <line x1={250} y1={424} x2={1060} y2={434} stroke={INK} strokeWidth={4} strokeDasharray="14 10" opacity={0.7} />
        </g>
        <path d={COW} fill="none" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
        {/* el ojo del bife: tira roja que nace en el rib y sigue hacia el chuck */}
        <path d="M 760 232 C 700 226, 620 222, 560 226 C 520 228, 480 232, 440 240" stroke={RED} strokeWidth={34} strokeLinecap="round" fill="none" opacity={0.9}
          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - (first > 1 ? 1 : ue)} />
        {uc > 0 ? <ellipse cx={515} cy={232} rx={80} ry={46} fill="none" stroke={INK} strokeWidth={6} strokeDasharray="10 8" opacity={uc} /> : null}
        {Object.entries(PARTS).map(([p, r]) => (
          <text key={p} x={r.lx} y={r.ly} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={p === "rib" || p === "chuck" ? 46 : 34} letterSpacing={3}
            fill={(p === "rib" && ur > 0.5) || (p === "chuck" && uc > 0.5) ? "#fff" : INK} opacity={0.85}>{r.lab}</text>
        ))}
      </svg>
      {cur ? (
        <div key={cur.t} style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center" }}>
          <div style={{ display: "inline-block", background: cur.part === "rib" ? RED : INK, color: cur.part === "rib" ? "#fff" : YEL, fontFamily: LABEL, fontWeight: 700, fontSize: 64, letterSpacing: 5,
            padding: "10px 40px", boxShadow: SH, transform: `scale(${0.8 + 0.2 * sp(f, at(cur.t), 12, 170)}) rotate(-1.5deg)` }}>{cur.txt}</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// 5 · "SÓLO 2-3 POR LADO": foto de la pieza + tarjeta de precio con el número enorme y 6 bifes dibujados (de un animal entero).
const SteakIcon: React.FC<{ s?: number; c?: string }> = ({ s = 80, c = RED }) => (
  <svg width={s} height={s * 0.72} viewBox="0 0 100 72"><path d="M 12 30 C 8 10, 40 2, 62 6 C 88 10, 98 30, 90 48 C 82 66, 50 70, 30 62 C 16 56, 14 44, 12 30 Z" fill={c} stroke="#F4EEE2" strokeWidth={7} /><ellipse cx={58} cy={34} rx={14} ry={10} fill="#f5d5c8" opacity={0.6} /></svg>
);
export const CountTwo: P<{ k: string; n: number; num: string; txt: string; sub: string; ts: number }> = ({ a, d, k, n, num, txt, sub, ts }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(n), 12, 140);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Photo k={k} f={f} d={d} dim={0.25} />
      <AbsoluteFill style={{ background: "linear-gradient(270deg, rgba(10,8,6,0.7) 0%, rgba(10,8,6,0) 60%)" }} />
      <div style={{ position: "absolute", right: 120, top: 150, width: 640, ...paperBg(), boxShadow: SH, padding: "40px 50px", transform: `translateY(${(1 - u) * 500}px) rotate(${2 - 1 * u}deg)` }}>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: RED }}>CHUCK EYE STEAKS</div>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 230, lineHeight: 1, color: INK }}>{num}</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: INK, marginTop: -10 }}>{txt}</div>
        <div style={{ display: "flex", gap: 10, marginTop: 26, flexWrap: "wrap" }}>
          {[0, 1, 2, 3, 4, 5].map((i) => { const ui = sp(f, at(ts) + i * 4, 12, 180); return <div key={i} style={{ opacity: cl(ui * 2), transform: `scale(${ui})` }}><SteakIcon s={80} /></div>; })}
        </div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 48, color: RED, marginTop: 6, opacity: cl((f - at(ts)) / 10) }}>{sub}</div>
      </div>
    </AbsoluteFill>
  );
};

// 6 · LA FRASE EN EL MOSTRADOR: talonario de pedidos sobre el mostrador; la frase se escribe palabra por palabra y "next to the rib" se resalta.
export const OrderSlip: P<{ k: string; words: [string, number][]; hl: number }> = ({ a, d, k, words, hl }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 120);
  const hi = words.findIndex((w) => Math.abs(w[1] - hl) < 0.02);
  const uh = ez((f - at(hl)) / 14);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Photo k={k} f={f} d={d} dim={0.45} z={[1.1, 1.18]} />
      <div style={{ position: "absolute", left: 300, top: 120, width: 1320, transform: `translateY(${(1 - u) * 700}px) rotate(-1.5deg)`, boxShadow: SH, background: "#FBF7EC" }}>
        <div style={{ background: RED, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 8, padding: "16px 40px", display: "flex", justifyContent: "space-between" }}>
          <span>ORDER · AT THE COUNTER</span><span>№ 52</span></div>
        <div style={{ padding: "26px 60px 46px", backgroundImage: "repeating-linear-gradient(180deg, transparent 0 94px, rgba(58,90,140,0.35) 94px 97px)", minHeight: 520 }}>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 92, lineHeight: "97px", color: BLUE }}>
            {words.map(([w, t], i) => {
              const v = f >= at(t) - 1; const on = hi >= 0 && i >= hi;
              return (
                <span key={i} style={{ opacity: v ? 1 : 0, position: "relative", marginRight: 24, display: "inline-block" }}>
                  {on ? <span style={{ position: "absolute", left: -8, right: -8, top: 18, bottom: 6, background: YEL, opacity: 0.75, transformOrigin: "0 50%", transform: `scaleX(${uh})`, zIndex: 0 }} /> : null}
                  <span style={{ position: "relative" }}>{w}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 7 · A TRAVÉS DEL VIDRIO: dos bifes dentro de la heladera-mostrador (marco de acero + vidrio con reflejo); el bueno con tildes, el malo con cruz.
export const GlassCheck: P<{ good: { k: string; t: number }; bad: { k: string; t: number }; checks: { t: number; txt: string }[]; no: { t: number; txt: string } }> = ({ a, d, good, bad, checks, no }) => {
  const { f, at } = useT(a);
  const ug = sp(f, at(good.t), 13, 130), ub = sp(f, at(bad.t) + 6, 13, 130), un = sp(f, at(no.t), 10, 200);
  const sweep = ((f * 9) % 2600) - 600;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Tex k="t_tile" f={f} d={d} dim={0.2} />
      <div style={{ position: "absolute", left: 110, right: 110, top: 120, bottom: 120, borderRadius: 16, ...paperBg("t_steel"), boxShadow: "0 40px 80px rgba(0,0,0,0.55)", padding: 26 }}>
        <div style={{ position: "relative", width: "100%", height: "100%", background: "#E9EEF0", overflow: "hidden", boxShadow: "inset 0 10px 30px rgba(0,0,0,0.35)" }}>
          <div style={{ position: "absolute", left: 40, top: 40, width: 760, transform: `translateY(${(1 - ug) * 300}px)`, opacity: cl(ug * 1.5) }}>
            <div style={{ height: 470, overflow: "hidden", boxShadow: "0 18px 30px rgba(0,0,0,0.35)" }}><Img src={img(good.k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
          </div>
          <div style={{ position: "absolute", right: 40, top: 40, width: 760, transform: `translateY(${(1 - ub) * 300}px)`, opacity: cl(ub * 1.5) }}>
            <div style={{ height: 470, overflow: "hidden", boxShadow: "0 18px 30px rgba(0,0,0,0.35)" }}><Img src={img(bad.k)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${1 - 0.2 * un})` }} /></div>
          </div>
          {/* reflejo del vidrio */}
          <div style={{ position: "absolute", top: -200, bottom: -200, left: sweep, width: 220, transform: "rotate(18deg)", background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.28), rgba(255,255,255,0))" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 60, background: "linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0))" }} />
          {/* tildes del bueno */}
          <div style={{ position: "absolute", left: 60, top: 540, display: "flex", flexDirection: "column", gap: 4 }}>
            {checks.map((c, i) => f >= at(c.t) ? (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, opacity: cl((f - at(c.t)) / 8) }}>
                <Tick f={f} at={at(c.t)} size={50} color={GREEN} box={false} />
                <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: INK }}>{c.txt}</span>
              </div>
            ) : null)}
          </div>
          {f >= at(no.t) ? (
            <div style={{ position: "absolute", right: 70, top: 560, display: "flex", alignItems: "center", gap: 16, transform: `scale(${1.4 - 0.4 * un})`, transformOrigin: "100% 50%", opacity: cl(un * 2) }}>
              <Tick f={f} at={at(no.t)} size={64} no box={false} />
              <span style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 52, color: RED, letterSpacing: 2 }}>{no.txt.toUpperCase()}</span>
            </div>
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 8 · EL PRIMER CORTE: la pieza con los bifes recién cortados; abajo una regla de acero "lado de la costilla → lado del cuello" de tierno a duro, con marcas que caen en su palabra.
export const FirstCut: P<{ k: string; cuts: { t: number; txt: string }[]; gauge: number }> = ({ a, d, k, cuts, gauge }) => {
  const { f, at } = useT(a);
  const ug = ez((f - at(gauge)) / 30);
  const xs = [0.1, 0.32, 0.72];
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Photo k={k} f={f} d={d} z={[1.02, 1.1]} o="40% 40%" />
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(10,8,6,0.75) 0%, rgba(10,8,6,0) 50%)" }} />
      <div style={{ position: "absolute", left: 140, right: 140, bottom: 110, height: 70, ...paperBg("t_steel"), borderRadius: 8, boxShadow: SH }}>
        {Array.from({ length: 33 }).map((_, i) => <div key={i} style={{ position: "absolute", left: `${3 * i + 2}%`, top: 0, width: 3, height: i % 4 ? 18 : 32, background: INK, opacity: 0.6 }} />)}
        <div style={{ position: "absolute", left: 12, right: 12, bottom: 10, height: 18, borderRadius: 9, background: `linear-gradient(90deg, ${GREEN}, ${YEL} 50%, ${RED})`, clipPath: `inset(0 ${100 - 100 * Math.max(ug, 0.02)}% 0 0)` }} />
      </div>
      <div style={{ position: "absolute", left: 140, bottom: 196, fontFamily: LABEL, fontWeight: 700, fontSize: 32, letterSpacing: 4, color: "#fff", textShadow: tsh }}>RIB END · TENDER</div>
      <div style={{ position: "absolute", right: 140, bottom: 196, fontFamily: LABEL, fontWeight: 700, fontSize: 32, letterSpacing: 4, color: "#fff", textShadow: tsh, opacity: ug }}>NECK END · TOUGH</div>
      {cuts.map((c, i) => {
        if (f < at(c.t)) return null; const u = sp(f, at(c.t), 12, 160);
        return (
          <div key={i} style={{ position: "absolute", left: 140 + xs[i] * 1640, bottom: 300, translate: "-50% 0", textAlign: "center", opacity: cl(u * 1.5), transform: `translateY(${(1 - u) * -80}px)` }}>
            <Badge n={i < 2 ? i + 1 : "…"} size={86} bg={i === 0 ? GREEN : i === 1 ? "#7a8a2e" : RED} />
            <div style={{ marginTop: 10 }}><Strip txt={c.txt} u={u} size={46} rot={i % 2 ? 2 : -2} /></div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 9 · PIZARRÓN DE TIZA: los tres nombres se escriben a mano en tiza, cada uno en su palabra, con subrayado; abajo, la nota en tiza amarilla.
export const ChalkNames: P<{ names: { t: number; txt: string }[]; foot: { t: number; txt: string } }> = ({ a, d, names, foot }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#1d1b18" }}>
      <Tex k="t_tile" f={f} d={d} dim={0.35} blur={3} />
      <div style={{ position: "absolute", left: 210, right: 210, top: 90, bottom: 90, padding: 26, ...paperBg("t_block"), boxShadow: "0 40px 90px rgba(0,0,0,0.6)", transform: `rotate(${-0.6 + 0.2 * Math.sin(f / 70)}deg)` }}>
        <div style={{ position: "relative", width: "100%", height: "100%", ...paperBg("t_chalk"), boxShadow: "inset 0 0 40px rgba(0,0,0,0.6)" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 36, textAlign: "center", fontFamily: LABEL, fontWeight: 500, fontSize: 40, letterSpacing: 12, color: "rgba(240,236,226,0.7)" }}>TODAY · ASK THE BUTCHER</div>
          {names.map((n, i) => {
            const u = wr(f, at(n.t), 16);
            return (
              <div key={i} style={{ position: "absolute", left: 120, top: 150 + i * 190, display: "flex", alignItems: "center", gap: 34 }}>
                <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 96, color: "rgba(240,236,226,0.9)", opacity: f >= at(n.t) ? 1 : 0 }}>{i + 1}.</span>
                <div>
                  <Write txt={n.txt} u={u} size={150} color="#F2EEE4" />
                  <svg width={760} height={24} style={{ display: "block", marginTop: -20 }}><path d="M 4 14 C 200 4, 520 22, 750 10" stroke="rgba(242,238,228,0.75)" strokeWidth={6} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - cl(u * 1.3 - 0.3)} /></svg>
                </div>
              </div>
            );
          })}
          {f >= at(foot.t) ? <div style={{ position: "absolute", right: 90, bottom: 50, transform: "rotate(-4deg)" }}><Write txt={foot.txt} u={wr(f, at(foot.t), 22)} size={74} color={YEL} /></div> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 10 · MOJADO vs SECO: la tabla del carnicero; dos fotos que se deslizan desde los costados, cada una con su sello.
export const WetDry: P<{ wet: { k: string; txt: string; t: number }; dry: { k: string; txt: string; t: number } }> = ({ a, d, wet, dry }) => {
  const { f, at } = useT(a);
  const uw = sp(f, at(wet.t), 13, 130), ud = sp(f, at(dry.t), 13, 130);
  const box = (k: string, txt: string, u: number, left: boolean, ok: boolean, t: number) => (
    <div style={{ position: "absolute", top: 150, [left ? "left" : "right"]: 110, transform: `translateX(${(1 - u) * (left ? -900 : 900)}px) rotate(${left ? -2 : 2}deg)`, opacity: cl(u * 1.5) } as React.CSSProperties}>
      <Snap k={k} w={780} h={560} f={f} />
      <div style={{ position: "absolute", left: 30, bottom: -40, display: "flex", alignItems: "center", gap: 14, background: ok ? GREEN : RED, color: "#fff", padding: "10px 30px", boxShadow: SH }}>
        <Tick f={f} at={at(t) + 6} size={52} color="#fff" no={!ok} box={false} />
        <span style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 52, letterSpacing: 3 }}>{txt}</span>
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Tex k="t_block" f={f} d={d} dim={0.15} />
      {box(wet.k, wet.txt, uw, true, false, wet.t)}
      {f >= at(dry.t) - 2 ? box(dry.k, dry.txt, ud, false, true, dry.t) : null}
    </AbsoluteFill>
  );
};

// 11 · DAR VUELTA CADA MINUTO: la sartén chispeando de fondo; a la derecha un reloj de cocina de esfera blanca cuya aguja da la vuelta, y un sello "FLIP" por cada vuelta.
export const FlipTimer: P<{ k: string; flips: number[] }> = ({ a, d, k, flips }) => {
  const { f, at } = useT(a);
  const nF = flips.filter((t) => f >= at(t)).length;
  const ang = 360 * (f / 30) / 4; // vuelta cada ~4 s (el minuto contado en pantalla)
  const u0 = sp(f, 0, 14, 120);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Photo k={k} f={f} d={d} z={[1.06, 1.16]} />
      <AbsoluteFill style={{ background: "linear-gradient(270deg, rgba(10,8,6,0.6) 0%, rgba(10,8,6,0) 55%)" }} />
      <div style={{ position: "absolute", right: 170, top: 150, width: 560, height: 560, borderRadius: 280, ...paperBg("t_steel"), boxShadow: "0 40px 70px rgba(0,0,0,0.6)", transform: `scale(${0.7 + 0.3 * u0})`, opacity: cl(u0 * 1.5) }}>
        <div style={{ position: "absolute", left: 34, top: 34, right: 34, bottom: 34, borderRadius: 300, background: "#FBF8F1", boxShadow: "inset 0 6px 14px rgba(0,0,0,0.3)" }}>
          <svg width={492} height={492} viewBox="0 0 492 492" style={{ position: "absolute", left: 0, top: 0 }}>
            {Array.from({ length: 60 }).map((_, i) => { const r1 = i % 5 ? 214 : 196, A = (i * 6 - 90) * Math.PI / 180; return <line key={i} x1={246 + 228 * Math.cos(A)} y1={246 + 228 * Math.sin(A)} x2={246 + r1 * Math.cos(A)} y2={246 + r1 * Math.sin(A)} stroke={INK} strokeWidth={i % 5 ? 3 : 7} />; })}
            <path d={`M 246 246 L ${246 + 150 * Math.cos((ang - 90) * Math.PI / 180)} ${246 + 150 * Math.sin((ang - 90) * Math.PI / 180)}`} stroke={RED} strokeWidth={10} strokeLinecap="round" />
            <circle cx={246} cy={246} r={16} fill={INK} />
          </svg>
          <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 4, color: INK }}>EVERY MINUTE</div>
        </div>
      </div>
      {flips.map((t, i) => {
        if (f < at(t)) return null; const u = sp(f, at(t), 10, 200);
        return (
          <div key={i} style={{ position: "absolute", left: 150 + i * 330, top: 760, transform: `rotate(${-8 + i * 5}deg) scale(${1.5 - 0.5 * u})`, opacity: cl(u * 2) * (i === nF - 1 ? 1 : 0.75),
            border: `7px solid ${YEL}`, color: YEL, background: "rgba(20,16,12,0.55)", padding: "6px 24px", fontFamily: LABEL, fontWeight: 700, fontSize: 64, letterSpacing: 4 }}>FLIP ×{i + 1}</div>
        );
      })}
    </AbsoluteFill>
  );
};

// 12 · EL TERMÓMETRO: la foto del bife; un termómetro de vidrio grande sube hasta 130°F y se marca el punto.
export const Thermo: P<{ k: string; target: number; t: number; lab: string; tl: number }> = ({ a, d, k, target, t, lab, tl }) => {
  const { f, at } = useT(a);
  const lo = 90, hi = 170;
  const val = lo + (target - lo) * eo((f - at(t) + 10) / 40);
  const H = 640, y = (v: number) => H - (v - lo) / (hi - lo) * H;
  const ul = sp(f, at(tl), 11, 170);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Photo k={k} f={f} d={d} z={[1.04, 1.12]} o="60% 50%" />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(10,8,6,0.65) 0%, rgba(10,8,6,0) 50%)" }} />
      <div style={{ position: "absolute", left: 170, top: 110, width: 230, height: 860, borderRadius: 30, ...paperBg(), boxShadow: SH }}>
        <div style={{ position: "absolute", left: 92, top: 50, width: 46, height: H + 30, borderRadius: 23, background: "rgba(255,255,255,0.7)", boxShadow: "inset 0 0 8px rgba(0,0,0,0.3)" }} />
        <div style={{ position: "absolute", left: 104, top: 50 + y(val) + 20, width: 22, height: H - y(val) + 20, background: RED, borderRadius: 11 }} />
        <div style={{ position: "absolute", left: 80, top: H + 60, width: 70, height: 70, borderRadius: 35, background: RED, boxShadow: "0 6px 10px rgba(0,0,0,0.3)" }} />
        {[100, 115, 130, 145, 160].map((v) => (
          <div key={v} style={{ position: "absolute", left: 18, top: 50 + y(v) + 14, fontFamily: LABEL, fontWeight: 500, fontSize: 28, color: INK }}>{v}</div>
        ))}
        {[100, 115, 130, 145, 160].map((v) => <div key={"l" + v} style={{ position: "absolute", left: 140, top: 50 + y(v) + 30, width: 40, height: 3, background: INK }} />)}
      </div>
      <div style={{ position: "absolute", left: 430, top: 110 + 50 + y(target) - 20, display: "flex", alignItems: "center", gap: 20, opacity: cl((f - at(t)) / 12) }}>
        <div style={{ width: 90, height: 6, background: YEL }} />
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 150, color: "#fff", textShadow: tsh, lineHeight: 1 }}>{Math.round(val)}°F</div>
      </div>
      {f >= at(tl) ? <div style={{ position: "absolute", left: 540, top: 110 + 50 + y(target) + 140, transform: `scale(${1.3 - 0.3 * ul}) rotate(-2deg)`, opacity: cl(ul * 2) }}>
        <div style={{ background: YEL, color: INK, fontFamily: LABEL, fontWeight: 700, fontSize: 56, letterSpacing: 4, padding: "8px 30px", boxShadow: SH }}>{lab} · OFF THE HEAT</div></div> : null}
    </AbsoluteFill>
  );
};

// 13 · LA VETA QUE GIRA: la foto del bife en la tabla; flechas de veta en dos direcciones y la línea de corte punteada donde la veta cambia.
export const GrainTurn: P<{ k: string; g1: number; g2: number; cut: number }> = ({ a, d, k, g1, g2, cut }) => {
  const { f, at } = useT(a);
  const u1 = ez((f - at(g1)) / 18), u2 = ez((f - at(g2)) / 18), uc = ez((f - at(cut)) / 20);
  const arrows = (cx: number, cy: number, ang: number, u: number, col: string) => (
    <g transform={`rotate(${ang} ${cx} ${cy})`} opacity={u}>
      {[-90, -30, 30, 90].map((dy, i) => (
        <g key={i}>
          <line x1={cx - 160} y1={cy + dy} x2={cx - 160 + 320 * u} y2={cy + dy} stroke={col} strokeWidth={9} strokeLinecap="round" />
          <path d={`M ${cx - 160 + 320 * u - 22} ${cy + dy - 16} L ${cx - 160 + 320 * u + 4} ${cy + dy} L ${cx - 160 + 320 * u - 22} ${cy + dy + 16}`} stroke={col} strokeWidth={9} fill="none" strokeLinecap="round" />
        </g>
      ))}
    </g>
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Photo k={k} f={f} d={d} z={[1.05, 1.12]} dim={0.15} />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.6))" }}>
        {arrows(640, 560, 12, u1, "#FFFFFF")}
        {arrows(1300, 540, -58, u2, YEL)}
        <path d="M 980 140 C 960 400, 1000 700, 970 960" stroke={RED} strokeWidth={12} strokeDasharray="34 22" fill="none" opacity={uc} />
      </svg>
      {f >= at(g1) ? <div style={{ position: "absolute", left: 300, top: 200 }}><Strip txt="the eye goes this way" u={sp(f, at(g1), 13, 150)} size={56} /></div> : null}
      {f >= at(g2) ? <div style={{ position: "absolute", right: 170, top: 820 }}><Strip txt="the cap goes that way" u={sp(f, at(g2), 13, 150)} size={56} rot={2} bg={YEL} /></div> : null}
      {f >= at(cut) ? <div style={{ position: "absolute", left: 1010, top: 110, opacity: uc }}><div style={{ background: RED, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 50, letterSpacing: 4, padding: "6px 24px", boxShadow: SH }}>CUT HERE FIRST</div></div> : null}
    </AbsoluteFill>
  );
};

// 14 · CORTES EN EL BORDE DE GRASA: la foto del bife + un esquema en papel con el bife dibujado; cada tajo cae en su palabra.
export const ScoreEdge: P<{ k: string; cuts: number[]; lab: { t: number; txt: string } }> = ({ a, d, k, cuts, lab }) => {
  const { f, at } = useT(a);
  const u0 = sp(f, 0, 14, 120);
  const pts = [[250, 120], [400, 92], [540, 122]];
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Photo k={k} f={f} d={d} dim={0.3} z={[1.06, 1.14]} />
      <div style={{ position: "absolute", left: 520, top: 170, width: 880, height: 640, ...paperBg(), boxShadow: SH, transform: `translateY(${(1 - u0) * 600}px) rotate(-1.5deg)` }}>
        <svg width={880} height={640} viewBox="0 0 880 640">
          <path d="M 140 300 C 120 160, 300 70, 470 80 C 680 92, 790 220, 760 360 C 730 500, 520 580, 330 540 C 200 512, 150 420, 140 300 Z" fill="#E9B1A4" stroke="#F7F1E4" strokeWidth={46} />
          <path d="M 140 300 C 120 160, 300 70, 470 80 C 680 92, 790 220, 760 360 C 730 500, 520 580, 330 540 C 200 512, 150 420, 140 300 Z" fill="none" stroke={INK} strokeWidth={5} />
          <ellipse cx={470} cy={320} rx={170} ry={130} fill="#C9665A" opacity={0.7} />
          {cuts.map((t, i) => { const u = eo((f - at(t)) / 8); const [x, y] = pts[i] || [400, 90]; return u > 0 ? <line key={i} x1={x} y1={y - 40} x2={x + 6} y2={y - 40 + 80 * u} stroke={RED} strokeWidth={12} strokeLinecap="round" /> : null; })}
        </svg>
        <div style={{ position: "absolute", left: 40, top: 26, fontFamily: LABEL, fontWeight: 700, fontSize: 34, letterSpacing: 5, color: INK }}>THE FAT EDGE</div>
        {f >= at(lab.t) ? <div style={{ position: "absolute", right: 40, bottom: 40 }}><Strip txt={lab.txt} u={sp(f, at(lab.t), 13, 150)} size={60} bg={YEL} /></div> : null}
      </div>
    </AbsoluteFill>
  );
};

// 15 · LA CUENTA CON LÁPIZ GRASO sobre papel de carnicería: renglones escritos a mano, el total encerrado en un círculo rojo.
export const Ledger: P<{ rows: { t: number; txt: string; val: string; red?: boolean }[]; total: { t: number; txt: string; val: string } }> = ({ a, d, rows, total }) => {
  const { f, at } = useT(a);
  const ut = wr(f, at(total.t), 16);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Tex k="t_paper" f={f} d={d} z={[1.03, 1.08]} />
      {/* cinta en las esquinas */}
      {[[60, 40, -20], [1720, 50, 18]].map(([x, y, r], i) => <div key={i} style={{ position: "absolute", left: x, top: y, width: 150, height: 46, background: "rgba(242,194,48,0.55)", transform: `rotate(${r}deg)` }} />)}
      <div style={{ position: "absolute", left: 200, top: 110, fontFamily: LABEL, fontWeight: 700, fontSize: 44, letterSpacing: 10, color: RED }}>STEAK NIGHT · FOR TWO</div>
      {rows.map((r, i) => (
        <div key={i} style={{ position: "absolute", left: 200, right: 220, top: 230 + i * 190, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <Write txt={r.txt} u={wr(f, at(r.t), 20)} size={100} color={r.red ? RED : INK} />
          <Write txt={r.val} u={wr(f, at(r.t) + 12, 10)} size={130} color={r.red ? RED : INK} />
        </div>
      ))}
      <div style={{ position: "absolute", left: 200, right: 200, top: 620, height: 8, background: INK, transformOrigin: "0 50%", transform: `scaleX(${ez((f - at(total.t)) / 10)})`, borderRadius: 4 }} />
      <div style={{ position: "absolute", left: 200, right: 220, top: 660, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <Write txt={total.txt} u={ut} size={110} color={GREEN} />
        <div style={{ position: "relative" }}>
          <Write txt={total.val} u={wr(f, at(total.t) + 10, 10)} size={180} color={GREEN} />
          <Mark kind="circle" x={-50} y={-10} w={340} h={220} f={f} at={at(total.t) + 18} dur={14} sw={10} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 16 · UN AÑO DE DOMINGOS: 52 casilleros que se llenan, el contador sube hasta US$1.248 y caen las fotos de lo que eso compra.
export const YearCount: P<{ k: string; t0: number; to: number; tt: number; lines: { t: number; k: string; txt: string }[] }> = ({ a, d, k, t0, to, tt, lines }) => {
  const { f, at } = useT(a);
  const u = ez((f - at(t0)) / Math.max(10, at(tt) - at(t0)));
  const filled = Math.round(52 * u);
  const val = Math.round(24 * filled);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Photo k={k} f={f} d={d} dim={0.55} />
      <div style={{ position: "absolute", left: 120, top: 110, width: 900, ...paperBg(), boxShadow: SH, padding: "34px 40px", transform: "rotate(-1deg)" }}>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 36, letterSpacing: 6, color: RED }}>52 SUNDAYS · $24 EACH</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(13, 1fr)", gap: 10, marginTop: 22 }}>
          {Array.from({ length: 52 }).map((_, i) => (
            <div key={i} style={{ height: 48, border: `3px solid ${INK}`, background: i < filled ? GREEN : "transparent", opacity: i < filled ? 0.9 : 0.35 }} />
          ))}
        </div>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 170, lineHeight: 1.05, color: INK, marginTop: 16 }}>${val.toLocaleString("en-US")}</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: INK, opacity: f >= at(tt) ? 1 : 0.0 }}>a year, for the same dinner</div>
      </div>
      {lines.map((l, i) => {
        if (f < at(l.t)) return null; const ul = sp(f, at(l.t), 13, 140);
        return (
          <div key={i} style={{ position: "absolute", right: 120 + i * 40, top: 140 + i * 400, transform: `translateX(${(1 - ul) * 700}px) rotate(${i ? 3 : -3}deg)`, opacity: cl(ul * 1.5) }}>
            <Snap k={l.k} w={560} h={320} f={f} />
            <div style={{ position: "absolute", left: 20, bottom: -30 }}><Strip txt={l.txt} u={ul} size={54} bg={YEL} /></div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 17 · DOS CENAS = UN RIBEYE: papel madera; dos fotos con su rótulo y, en su palabra, la igualdad contra un ribeye.
export const TwoDinners: P<{ left: { k: string; txt: string }; right: { k: string; txt: string }; t: number; vs: { t: number; txt: string } }> = ({ a, d, left, right, t, vs }) => {
  const { f, at } = useT(a);
  const ul = sp(f, at(t), 13, 140), ur = sp(f, at(t) + 6, 13, 140), uv = sp(f, at(vs.t), 11, 180);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Tex k="t_kraft" f={f} d={d} />
      <div style={{ position: "absolute", left: 130, top: 170, transform: `translateY(${(1 - ul) * 500}px) rotate(-3deg)`, opacity: cl(ul * 1.5) }}><Snap k={left.k} w={640} h={430} f={f} /><div style={{ marginTop: 20, textAlign: "center" }}><Strip txt={left.txt} u={ul} size={60} /></div></div>
      <div style={{ position: "absolute", left: 860, top: 230, fontFamily: LABEL, fontWeight: 700, fontSize: 160, color: INK, opacity: cl(ur) }}>+</div>
      <div style={{ position: "absolute", right: 130, top: 170, transform: `translateY(${(1 - ur) * 500}px) rotate(3deg)`, opacity: cl(ur * 1.5) }}><Snap k={right.k} w={640} h={430} f={f} /><div style={{ marginTop: 20, textAlign: "center" }}><Strip txt={right.txt} u={ur} size={60} rot={2} /></div></div>
      {f >= at(vs.t) ? <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center", transform: `scale(${1.4 - 0.4 * uv})`, opacity: cl(uv * 2) }}>
        <span style={{ background: RED, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 80, letterSpacing: 6, padding: "8px 40px", boxShadow: SH }}>$18 {vs.txt.toUpperCase()}</span></div> : null}
    </AbsoluteFill>
  );
};

// 18 · FICHA DE RECETA vieja sobre la tabla: los 7 trucos con tilde, cada renglón en su palabra (los ya dichos quedan tildados).
export const RecipeCard: P<{ head: string; items: { t: number; txt: string }[]; pre: string[] }> = ({ a, d, head, items, pre }) => {
  const { f, at } = useT(a);
  const u0 = sp(f, 0, 14, 120);
  const all = [...pre.map((txt) => ({ txt, t: -1 })), ...items];
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Tex k="t_block" f={f} d={d} dim={0.1} />
      <div style={{ position: "absolute", left: 300, right: 300, top: 70, bottom: 60, background: "#FBF6E8", boxShadow: "0 40px 80px rgba(0,0,0,0.55)", transform: `translateY(${(1 - u0) * 900}px) rotate(${-1 + 0.3 * Math.sin(f / 60)}deg)`,
        backgroundImage: "repeating-linear-gradient(180deg, transparent 0 112px, rgba(58,90,140,0.3) 112px 115px)", backgroundPosition: "0 40px" }}>
        <div style={{ height: 120, borderBottom: `5px solid ${RED}`, display: "flex", alignItems: "flex-end", padding: "0 50px 14px" }}>
          <span style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 56, letterSpacing: 4, color: INK }}>{head}</span>
        </div>
        {all.map((it, i) => {
          const done = it.t < 0; const u = done ? 1 : wr(f, at(it.t), 16);
          if (!done && f < at(it.t)) return null;
          return (
            <div key={i} style={{ position: "absolute", left: 50, top: 132 + i * 115, display: "flex", alignItems: "center", gap: 22, opacity: done ? 0.55 : 1 }}>
              <Tick f={f} at={done ? -20 : at(it.t) + 6} size={58} color={GREEN} />
              <span style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 44, color: RED }}>{i + 1}</span>
              <Write txt={it.txt} u={u} size={done ? 64 : 76} color={BLUE} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── versiones propias de 4 piezas del kit (Kinetic, Comment, Pop, PricePill): el kit usa serif/sans; acá sólo LABEL + HAND y la paleta del local ──
export const Kinetic: P<{ k: string; vid?: boolean; words: [string, number][]; size?: number }> = ({ a, d, k, vid, words, size = 104 }) => {
  const { f, at } = useT(a);
  const G: [string, number][][] = [[]];
  words.forEach((w) => { G[G.length - 1].push(w); if (/[.!?]$/.test(w[0])) G.push([]); });
  const gs = G.filter((g) => g.length);
  const gi = gs.reduce((m, g, i) => (f >= at(g[0][1]) - 2 ? i : m), 0);
  const sz = Math.min(size, fit(gs[gi].map((w) => w[0]).join(" ").toUpperCase(), 1680, size, "label", 2, 2));
  return (
    <AbsoluteFill>
      <FullPhoto k={k} vid={vid} f={f} d={d} o="50% 40%" />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,8,6,0) 40%, rgba(10,8,6,0.7) 100%)" }} />
      <div style={{ position: "absolute", left: 120, right: 120, bottom: 120, display: "flex", flexWrap: "wrap", gap: `0 ${sz * 0.24}px` }}>
        {gs[gi].map(([w, t], i) => { const u = sp(f, at(t), 14, 200);
          return <div key={gi + "_" + i} style={{ fontFamily: LABEL, fontWeight: 700, fontSize: sz, lineHeight: 1.05, letterSpacing: 2, textTransform: "uppercase", color: i === gs[gi].length - 1 ? YEL : "#FBF8F1", opacity: u, transform: `translateY(${(1 - u) * 50}px)`, textShadow: "0 8px 30px rgba(0,0,0,0.65)" }}>{w}</div>; })}
      </div>
    </AbsoluteFill>
  );
};
export const Comment: P<{ q: string; opts: { txt: string; t: number }[]; k: string }> = ({ a, d, q, opts, k }) => {
  const { f, at } = useT(a);
  const c = sp(f, 0, 14, 120);
  const n = Math.floor(lin(f, 6, 6 + q.length * 0.9, 0, q.length, (x) => x));
  const qs = fit(q, 1090, 66, "hand", 2);
  const os = Math.min(60, fit(opts.map((o) => o.txt).join("    "), 1700 - opts.length * 60, 60, "label", 1, 3));
  return (
    <Stage f={f} T={d} drift={0.5}>
      <Bed k={k} f={f} T={d} dim={0.5} />
      <div style={{ position: "absolute", left: 960, top: 360, translate: "-50% -50%", width: 1300, opacity: c, transform: `translateY(${(1 - c) * 100}px)` }}>
        <div style={{ background: "#FBF8F1", borderRadius: 22, padding: "36px 44px", boxShadow: "0 50px 100px rgba(0,0,0,0.5)", display: "flex", gap: 30, alignItems: "flex-start" }}>
          <div style={{ width: 90, height: 90, borderRadius: 99, background: RED, flex: "none" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: LABEL, fontSize: 32, letterSpacing: 2, color: "#8B8275" }}>ADD A COMMENT…</div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: qs, lineHeight: 1.15, color: INK, marginTop: 8, minHeight: 70 }}>{q.slice(0, n)}<span style={{ opacity: f % 20 < 10 ? 1 : 0 }}>|</span></div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 660, display: "flex", justifyContent: "center", gap: 40 }}>
        {opts.map((o, i) => { const u = sp(f, at(o.t), 12, 200); return <div key={i} style={{ opacity: u, transform: `translateY(${(1 - u) * 50}px) scale(${0.8 + 0.2 * u})` }}><Chip txt={o.txt} size={os} rot={[-3, 2, -1][i % 3]} bg={i === 0 ? RED : "#FBF8F1"} color={i === 0 ? "#fff" : INK} /></div>; })}
      </div>
    </Stage>
  );
};
export const Pop: React.FC<{ txt: string; d: number }> = ({ txt, d }) => {
  const f = useCurrentFrame();
  const u = sp(f, 0, 8, 260), o = lin(f, d - 5, d, 0, 1);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 690, textAlign: "center", opacity: cl(u * 2) * (1 - o), transform: `scale(${1.35 - 0.35 * u + 0.04 * f / Math.max(1, d)})` }}>
      <span style={{ fontFamily: LABEL, fontWeight: 700, fontSize: fit(txt.toUpperCase(), 1700, 170, "label", 1, 4), whiteSpace: "nowrap", color: "#FBF8F1", letterSpacing: 4, textTransform: "uppercase", textShadow: "0 8px 40px rgba(0,0,0,0.75), 0 2px 6px rgba(0,0,0,0.6)" }}>{txt}</span>
      <div style={{ margin: "0 auto", marginTop: -2, width: 220 * eo(cl((f - 3) / 7)), height: 10, borderRadius: 6, background: YEL }} />
    </div>
  );
};
export const PricePill: React.FC<{ txt: string; d: number }> = ({ txt, d }) => {
  const f = useCurrentFrame();
  const u = sp(f, 0, 10, 220), o = lin(f, d - 5, d, 0, 1);
  const sz = Math.min(64, fit(txt, 900, 64, "label", 1, 2, 30));
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 150 }}>
      <div style={{ opacity: cl(u * 2) * (1 - o), transform: `scale(${1.3 - 0.3 * u}) rotate(-2deg)`, fontFamily: LABEL, fontWeight: 700, fontSize: sz, letterSpacing: 2, color: INK, background: YEL,
        padding: `${sz * 0.12}px ${sz * 0.5}px`, boxShadow: "0 14px 30px rgba(0,0,0,0.45)", whiteSpace: "nowrap" }}>{txt}</div>
    </AbsoluteFill>
  );
};
