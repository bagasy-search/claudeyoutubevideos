// componentes únicos 12-22 (minutos 10-20)
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, MARK, Photo, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

// ---- 10:18 · LA CAJA SE ARMA EN 3D: cuatro lados de 50×45 caen uno por uno y se cierran sobre el fondo; tornillos ----
export const HExploded: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop" cam={0.6}>{(tt) => {
  const S = 400, Hh = 360, rot = -28 + 10 * Math.sin(tt * 0.3);
  const wood = "linear-gradient(90deg,#b78a55,#a2763f 40%,#b88c58 70%,#9a6e3a)";
  const side = (i: number) => { const s = phys(tt, 0.6 + i * 0.45, 5, 0.45); const tr = [`translateZ(${S / 2}px)`, `rotateY(90deg) translateZ(${S / 2}px)`, `rotateY(180deg) translateZ(${S / 2}px)`, `rotateY(-90deg) translateZ(${S / 2}px)`][i];
    return <div key={i} style={{ position: "absolute", left: -S / 2, top: -Hh, width: S, height: Hh, background: wood, boxShadow: "inset 0 0 0 4px rgba(60,35,10,.5)", transformOrigin: "50% 100%", transform: `${tr} translateY(${(1 - s) * -520}px) rotateX(${(1 - cl(s)) * -70}deg)`, opacity: cl(s * 3) }}>
      {[0, 1].map((k) => <div key={k} style={{ position: "absolute", top: 24 + k * (Hh - 70), left: 22, width: 22, height: 22, borderRadius: 11, background: "#d8d8dc", boxShadow: "inset -3px -3px 0 #8a8a90", opacity: cl((tt - 3) * 3) }} />)}
    </div>; };
  const lid = phys(tt, 3.6, 4.5, 0.5);
  return <>
    <Head tt={tt} kick="PASO 1 · LA CAJA" title="CUATRO LADOS DE 50 × 45" />
    <div style={{ position: "absolute", left: 900, top: 800, perspective: 1800 }}>
      <div style={{ transformStyle: "preserve-3d", transform: `rotateX(-22deg) rotateY(${rot}deg)` }}>
        <div style={{ position: "absolute", left: -S / 2 - 15, top: -S / 2 - 15, width: S + 30, height: S + 30, background: "#8f6634", transform: "rotateX(90deg)", boxShadow: "0 0 80px rgba(0,0,0,.6)" }} />
        {[0, 1, 2, 3].map(side)}
        <div style={{ position: "absolute", left: -S / 2 - 15, top: -S / 2 - 15, width: S + 30, height: S + 30, background: wood, transformOrigin: "50% 50%", transform: `translateY(${-Hh - (1 - lid) * 380}px) rotateX(90deg) rotateZ(${(1 - lid) * 25}deg)`, opacity: cl(lid * 3), boxShadow: "inset 0 0 0 5px rgba(60,35,10,.5)" }} />
      </div>
    </div>
    <Tag tt={tt} at={1.2} x={1480} y={420} txt="4 × 50 × 45" col={AMB} size={44} />
    <Tag tt={tt} at={2.6} x={1480} y={500} txt="FONDO 53 × 53" size={36} />
    <Tag tt={tt} at={3.9} x={1480} y={570} txt="+ TAPA" size={36} />
  </>;
}}</Stage>;

// ---- 11:07 · LAS CAPAS: vista explotada de afuera hacia adentro (madera, telgopor, tabla, olla, nido, almohadón) que se juntan ----
export const HLayers: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const L = [{ n: "MADERA", c: "#a87a45" }, { n: "TELGOPOR", c: "#ecebe5" }, { n: "TABLA", c: "#c79a62" }, { n: "FRAZADA", c: "#7b4a8c" }, { n: "OLLA", c: "#55555c" }, { n: "ALMOHADÓN", c: "#c8505a" }];
  const join = eio(tt, 6.0, 7.6);
  return <>
    <Head tt={tt} kick="PASO 3 · LOS COSTADOS" title="CAPA POR CAPA" />
    <div style={{ position: "absolute", left: 960, top: 600, perspective: 1600 }}>
      <div style={{ transformStyle: "preserve-3d", transform: `rotateX(58deg) rotateZ(${-30 + 6 * Math.sin(tt * 0.4)}deg)` }}>
        {L.map((l, i) => { const s = phys(tt, 0.5 + i * 0.6, 5.5, 0.45), sz = 520 - i * 60, z = (i * 70) * (1 - join) + i * 6 + (1 - s) * 400;
          return <div key={i} style={{ position: "absolute", left: -sz / 2, top: -sz / 2, width: sz, height: sz, borderRadius: i === 4 ? sz : 14, background: l.c, opacity: cl(s * 2) * (i === 5 ? 1 : 0.94), transform: `translateZ(${z}px)`, boxShadow: "0 0 0 3px rgba(0,0,0,.25), 0 30px 60px rgba(0,0,0,.45)" }} />; })}
      </div>
    </div>
    {L.map((l, i) => <Tag key={i} tt={tt} at={0.7 + i * 0.6} x={1460} y={260 + i * 92} txt={`${i + 1} · ${l.n}`} col={i === 3 || i === 5 ? AMB : TX} size={38} anchor="l" />)}
  </>;
}}</Stage>;

// ---- 12:17 · EL MARCADOR: una tapa de madera en primer plano; el marcador escribe la hora a mano, trazo a trazo ----
export const HMarker: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="linear-gradient(160deg,#c49866,#9f733f 60%,#7d5428)">{(tt) => {
  const w = eio(tt, 0.6, 2.6), w2 = eio(tt, 2.8, 4.0);
  const pen = { x: 560 + 900 * w, y: 560 + 30 * Math.sin(tt * 18) * (w < 1 ? 1 : 0) };
  return <>
    <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(176deg, rgba(0,0,0,.06) 0 3px, transparent 3px 28px)" }} />
    <div style={{ position: "absolute", left: 560, top: 400, fontFamily: MARK, fontSize: 300, color: "#1b1712", clipPath: `inset(0 ${(1 - w) * 100}% 0 0)`, transform: "rotate(-4deg)", lineHeight: 1 }}>8:10</div>
    <div style={{ position: "absolute", left: 600, top: 760, fontFamily: MARK, fontSize: 80, color: "#9b2a1f", clipPath: `inset(0 ${(1 - w2) * 100}% 0 0)`, transform: "rotate(-3deg)" }}>→ abrir 11:10</div>
    <svg width={140} height={520} viewBox="0 0 140 520" style={{ position: "absolute", left: pen.x - 20, top: pen.y - 470, transform: `rotate(28deg)`, transformOrigin: "20px 470px", opacity: cl(phys(tt, 0.2, 6, 0.6)) * (1 - cl((tt - 4.6) * 2)), filter: "drop-shadow(20px 30px 20px rgba(0,0,0,.4))" }}>
      <rect x={30} y={0} width={70} height={380} rx={14} fill="#1e1e22" /><rect x={30} y={60} width={70} height={30} fill={RED} />
      <path d="M38 380 L92 380 L74 470 L56 470 Z" fill="#2c2c30" /><rect x={58} y={462} width={14} height={16} rx={3} fill="#111" />
    </svg>
    <div style={{ position: "absolute", left: 110, top: 90, fontWeight: 900, fontSize: 30, letterSpacing: 5, color: "rgba(20,14,8,.7)" }}>LA HORA, EN LA TAPA</div>
  </>;
}}</Stage>;

// ---- 13:34 · EL RANKING DE OLLAS: tres ollas caen en estantes; la de hierro sube al primer lugar con corona ----
export const HPotRank: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const P = [{ n: "HIERRO", c: "linear-gradient(180deg,#3a3a3e,#151517)", a: 0.4, rank: 1 }, { n: "ACERO", c: "linear-gradient(180deg,#d8d8de,#8a8a92)", a: 0.8, rank: 2 }, { n: "ALUMINIO", c: "linear-gradient(180deg,#eef1f4,#b9c0c6)", a: 3.0, rank: 3 }];
  const sort = eio(tt, 3.8, 5.0);
  return <>
    <Head tt={tt} kick="LA OLLA IMPORTA" title="CUANTO MÁS PESADA, MEJOR" />
    {P.map((p, i) => { const s = phys(tt, p.a, 6, 0.4), x0 = 560 + i * 400, x1 = 960 + (p.rank - 2) * 400, yy = [560, 680, 800][p.rank - 1];
      const x = 960 + ((x0 + (x1 - x0) * sort) - 960) * 1.25, y = 640 + (yy - 700) * sort * 1.2;
      return <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) translateY(${(1 - s) * -600}px)`, opacity: cl(s * 3), textAlign: "center", scale: "1.35" } as React.CSSProperties}>
        {p.rank === 1 && <div style={{ fontSize: 76, height: 80, transform: `translateY(${(1 - phys(tt, 4.6, 7, 0.35)) * -160}px)`, opacity: cl(phys(tt, 4.6, 7, 0.35) * 3) }}>👑</div>}
        <div style={{ width: 280, height: 170, borderRadius: "18px 18px 70px 70px", background: p.c, boxShadow: `0 30px 70px rgba(0,0,0,.6), inset 0 6px 0 rgba(255,255,255,.12)${p.rank === 1 && sort > 0.9 ? `, 0 0 0 4px ${AMB}` : ""}`, position: "relative" }}>
          <div style={{ position: "absolute", left: -40, top: 40, width: 50, height: 22, borderRadius: 11, background: "#222" }} /><div style={{ position: "absolute", right: -40, top: 40, width: 50, height: 22, borderRadius: 11, background: "#222" }} />
        </div>
        <div style={{ marginTop: 14, fontWeight: 900, fontSize: 34, letterSpacing: 2, color: p.rank === 1 ? AMB : p.rank === 3 ? DIM : TX }}>{p.rank}° {p.n}</div>
      </div>; })}
    <Tag tt={tt} at={3.2} x={960} y={980} txt="EL ALUMINIO FINO: EL PEOR" col={RED} size={36} />
  </>;
}}</Stage>;

// ---- 14:37 · LLENA HASTA ¾: el corte de la olla se llena con líquido que ondula; la marca de ¾ se ilumina ----
export const HFill: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const lv = 0.75 * eio(tt, 0.6, 3.4), wave = (x: number) => Math.sin(x * 0.02 + tt * 4) * 10 * (1 - cl((tt - 3.4) * 0.6)) + Math.sin(x * 0.035 - tt * 3) * 5;
  const X0 = 700, X1 = 1220, Y0 = 860, Hh = 520, y = Y0 - Hh * lv;
  const d = `M ${X0} ${y} ` + Array.from({ length: 27 }, (_, i) => { const x = X0 + i * 20; return `L ${x} ${y + wave(x)}`; }).join(" ") + ` L ${X1} ${Y0} L ${X0} ${Y0} Z`;
  const hit = tt > 3.3;
  return <>
    <Head tt={tt} kick="REGLA 1" title="LA OLLA VA LLENA" />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs><clipPath id="fc"><rect x={X0} y={Y0 - Hh} width={X1 - X0} height={Hh} rx={30} /></clipPath><linearGradient id="fg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c87a2c" /><stop offset="100%" stopColor="#6e3a12" /></linearGradient></defs>
      <path d={d} fill="url(#fg)" clipPath="url(#fc)" />
      <rect x={X0} y={Y0 - Hh} width={X1 - X0} height={Hh} rx={30} fill="none" stroke="#9a9aa2" strokeWidth={14} />
      <line x1={X1 + 30} y1={Y0 - Hh * 0.75} x2={X1 + 120} y2={Y0 - Hh * 0.75} stroke={hit ? GRN : DIM} strokeWidth={6} />
      <line x1={X1 + 30} y1={Y0 - Hh * 0.3} x2={X1 + 120} y2={Y0 - Hh * 0.3} stroke={RED} strokeWidth={4} opacity={0.6} />
    </svg>
    <div style={{ position: "absolute", left: X1 + 140, top: Y0 - Hh * 0.75 - 40, fontWeight: 900, fontSize: 64, color: hit ? GRN : DIM, transform: `scale(${hit ? 1 + 0.15 * (1 - cl((tt - 3.3) * 3)) : 1})`, transformOrigin: "0 50%" }}>¾ ✓</div>
    <div style={{ position: "absolute", left: X1 + 140, top: Y0 - Hh * 0.3 - 28, fontWeight: 800, fontSize: 34, color: RED, opacity: 0.8 * cl(tt - 1) }}>media olla = se enfría</div>
    <Tag tt={tt} at={4.0} x={960} y={960} txt="MÁS MASA = MÁS CALOR GUARDADO" size={40} />
  </>;
}}</Stage>;

// ---- 15:15 · EL HERVOR DESDE ARRIBA: vista cenital de la olla; las burbujas nacen en el borde y recién después en el centro ----
export const HBoil: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(circle at 50% 52%, #24201c, #070707 70%)">{(tt) => {
  const R = 330, centre = cl((tt - 3.4) / 1.6);
  const bub = Array.from({ length: 90 }, (_, i) => { const a = i * 2.399, rr = Math.sqrt((i + 0.5) / 90) * R * 0.92; const edge = rr / R; const on = edge > 0.65 ? cl((tt - 0.8) * 1.5) : cl((centre - (0.65 - edge)) * 3);
    const ph = (tt * (1.4 + (i % 5) * 0.2) + i * 0.37) % 1; return { x: Math.cos(a) * rr, y: Math.sin(a) * rr, s: on * (6 + 16 * Math.sin(ph * Math.PI)), o: on * (1 - ph * 0.6) }; });
  return <>
    <Head tt={tt} kick="EL ERROR MÁS COMÚN" title="LOS BORDES HIERVEN PRIMERO" />
    <div style={{ position: "absolute", left: 960, top: 580, width: 0, height: 0 }}>
      <div style={{ position: "absolute", left: -R - 30, top: -R - 30, width: 2 * R + 60, height: 2 * R + 60, borderRadius: "50%", background: "radial-gradient(circle,#4a4a50,#1c1c20)", boxShadow: "0 40px 100px rgba(0,0,0,.7)" }} />
      <div style={{ position: "absolute", left: -R, top: -R, width: 2 * R, height: 2 * R, borderRadius: "50%", background: "radial-gradient(circle,#b9682a,#7a3e16)" }} />
      {bub.map((b, i) => b.s > 0.5 && <div key={i} style={{ position: "absolute", left: b.x - b.s / 2, top: b.y - b.s / 2, width: b.s, height: b.s, borderRadius: "50%", border: "3px solid rgba(255,235,200,.8)", opacity: b.o }} />)}
      <div style={{ position: "absolute", left: -110, top: -110, width: 220, height: 220, borderRadius: "50%", border: `4px dashed ${centre > 0.5 ? GRN : RED}`, opacity: cl(tt - 1.4) }} />
    </div>
    <Tag tt={tt} at={1.6} x={1520} y={430} txt="BORDE: BURBUJEA" col={RED} size={36} />
    <Tag tt={tt} at={2.2} x={1520} y={500} txt="CENTRO: TIBIO" col={ICE} size={36} />
    <Tag tt={tt} at={4.6} x={1520} y={600} txt="ESPERÁ AL CENTRO ✓" col={GRN} size={40} />
  </>;
}}</Stage>;

// ---- 16:17 · LA BATERÍA: la carga del calor baja dentro de la caja y el segundo hervor la recarga a tope ----
export const HBattery: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const drain = eio(tt, 0.4, 2.6), boost = phys(tt, 3.0, 4.5, 0.5), lv = cl(1 - 0.72 * drain + 0.72 * cl(boost)) + (boost > 1 ? (boost - 1) * 0.3 : 0);
  const c = lv > 0.6 ? GRN : lv > 0.35 ? AMB : RED;
  return <>
    <Head tt={tt} kick="LOCROS Y CARNES DURAS" title="EL SEGUNDO HERVOR" />
    <div style={{ position: "absolute", left: 960, top: 580, transform: "translate(-50%,-50%)" }}>
      <div style={{ width: 760, height: 330, borderRadius: 40, border: "14px solid #d8d4cc", padding: 20, position: "relative", boxShadow: "0 40px 100px rgba(0,0,0,.6)" }}>
        <div style={{ position: "absolute", right: -50, top: 100, width: 36, height: 130, borderRadius: "0 14px 14px 0", background: "#d8d4cc" }} />
        <div style={{ height: "100%", width: `${cl(lv) * 100}%`, borderRadius: 22, background: `linear-gradient(180deg, ${c}, ${c}aa)`, boxShadow: `0 0 50px ${c}88`, position: "relative", overflow: "hidden" }}>
          {Array.from({ length: 9 }, (_, k) => <div key={k} style={{ position: "absolute", left: `${(k * 37 + tt * 60) % 100}%`, top: `${20 + (k * 29) % 60}%`, width: 10, height: 10, borderRadius: 5, background: "rgba(255,255,255,.35)" }} />)}
        </div>
        <div style={{ position: "absolute", left: 20, right: 20, top: 20, height: "38%", borderRadius: "22px 22px 60px 60px", background: "linear-gradient(180deg,rgba(255,255,255,.28),transparent)" }} />
        {boost > 0.05 && boost < 1.3 && <svg width={140} height={220} viewBox="0 0 140 220" style={{ position: "absolute", left: 310, top: 40, opacity: cl(1.3 - boost) }}><path d="M84 0 L20 120 L66 120 L48 220 L124 84 L76 84 Z" fill="#fff" /></svg>}
      </div>
      <div style={{ textAlign: "center", fontWeight: 900, fontSize: 92, marginTop: 24, color: c }}>{Math.round(cl(lv) * 100)}%</div>
    </div>
    <Tag tt={tt} at={1.4} x={360} y={580} txt="3 h EN LA CAJA" col={DIM} size={36} />
    <Tag tt={tt} at={3.2} x={1560} y={580} txt="+10 MIN DE FUEGO" col={GRN} size={36} />
  </>;
}}</Stage>;

// ---- 17:24 · SÍ CAJA / NO CAJA: las comidas caen de arriba y cada una se desvía a su canasto ----
export const HSorter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const F = (h.items as { n: string; ok: boolean | "warn"; at: number; img?: string }[] | undefined) ?? [];
  const nY = F.filter((f) => f.ok !== false).length, nN = F.length - nY, cnt = { y: 0, n: 0 };
  return <>
    <Head tt={tt} kick="LO QUE VA Y LO QUE NO" title="¿VA A LA CAJA?" />
    {[{ x: 560, l: "SÍ CAJA", c: GRN }, { x: 1360, l: "NO CAJA", c: RED }].map((b, i) => <div key={i} style={{ position: "absolute", left: b.x - 340, top: 700, width: 680, height: 320, borderRadius: "0 0 40px 40px", border: `6px solid ${b.c}`, borderTop: "none", background: `linear-gradient(180deg, transparent, ${b.c}22)`, opacity: cl(phys(tt, 0.3 + i * 0.2, 6, 0.6)) }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center", fontWeight: 900, fontSize: 48, color: b.c }}>{b.l}</div>
    </div>)}
    {F.map((f, i) => { const k = tt - (f.at - h.at); if (k < 0) return null; const toY = f.ok !== false; const slot = toY ? cnt.y++ : cnt.n++;
      const n = toY ? nY : nN, fall = phys(k, 0, 4.6, 0.55), side = eio(k, 0.15, 0.9), x = 960 + ((toY ? 560 : 1360) + (slot - (n - 1) / 2) * 225 - 960) * side, y = 330 + 470 * cl(fall) + (fall > 1 ? (fall - 1) * 40 : 0);
      return <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${(toY ? -1 : 1) * 8 * side}deg)` }}>
        <Photo id={f.img} w={200} h={150} r={14} style={{ boxShadow: `0 0 0 4px ${f.ok === "warn" ? AMB : toY ? GRN : RED}, 0 20px 40px rgba(0,0,0,.5)` }} />
        <div style={{ textAlign: "center", fontWeight: 900, fontSize: 22, marginTop: 8, width: 200, lineHeight: 1.1, color: f.ok === "warn" ? AMB : TX }}>{f.n}</div>
      </div>; })}
  </>;
}}</Stage>;

// ---- 17:58 · EL PIZARRÓN: tiempos de caja escritos con tiza, renglón por renglón, con el polvo de la tiza ----
export const HChalk: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" bg="radial-gradient(ellipse at 50% 40%, #2f4a3c, #15241c 80%)">{(tt) => {
  const R = (h.rows as { a: string; b: string; at: number }[] | undefined) ?? [];
  return <>
    <div style={{ position: "absolute", inset: 40, border: "26px solid #6b4a2a", borderRadius: 10, boxShadow: "inset 0 0 120px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 160, top: 110, fontFamily: HAND, fontWeight: 700, fontSize: 92, color: "rgba(245,245,235,.92)", clipPath: `inset(0 ${(1 - eio(tt, 0.2, 1.2)) * 100}% 0 0)` }}>Tiempos en la caja</div>
    <div style={{ position: "absolute", left: 160, top: 220, width: 1200 * eio(tt, 0.8, 1.6), height: 4, background: "rgba(245,245,235,.6)", borderRadius: 2 }} />
    {R.map((r, i) => { const k = eio(tt, r.at - h.at, r.at - h.at + 1.1); if (k <= 0) return null;
      return <div key={i} style={{ position: "absolute", left: 180, top: 290 + i * 150, display: "flex", gap: 40, fontFamily: HAND, fontWeight: 700, fontSize: 84, color: "rgba(245,245,235,.9)", clipPath: `inset(0 ${(1 - k) * 100}% 0 0)`, textShadow: "0 0 2px rgba(255,255,255,.4)" }}>
        <span style={{ width: 640 }}>{r.a}</span><span style={{ color: "#ffd98a" }}>{r.b}</span>
      </div>; })}
    {/* la tiza */}
    <div style={{ position: "absolute", left: 1500, top: 820, width: 160, height: 34, borderRadius: 8, background: "#f2f0e6", transform: `rotate(${-20 + 4 * Math.sin(tt * 3)}deg)`, boxShadow: "0 10px 20px rgba(0,0,0,.4)" }} />
  </>;
}}</Stage>;

// ---- 19:54 · LA ZONA DE PELIGRO: termómetro con la franja 10-60 marcada; adentro de la franja las bacterias se dividen ----
export const HDanger: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="radial-gradient(ellipse at 50% 50%, #2a1414, #080606 75%)">{(tt) => {
  const Y = (v: number) => 900 - v * 6.6, band = cl(phys(tt, 0.6, 5, 0.6));
  const gen = Math.min(6, Math.floor(cl((tt - 1.6) / 4) * 7)), n = 2 ** gen;
  return <>
    <Head tt={tt} kick="LA REGLA DE SEGURIDAD" title="ENTRE 10 Y 60 °C, NO" col={RED} />
    <div style={{ position: "absolute", left: 520, top: Y(100) - 30, width: 70, height: Y(0) - Y(100) + 80, borderRadius: 35, background: "#141416", boxShadow: "inset 0 0 0 3px rgba(255,255,255,.15)" }} />
    <div style={{ position: "absolute", left: 470, top: Y(60), width: 170 * band, height: Y(10) - Y(60), background: "repeating-linear-gradient(45deg, rgba(255,90,74,.5) 0 14px, rgba(255,90,74,.2) 14px 28px)", borderRadius: 8 }} />
    {[0, 10, 60, 100].map((v) => <div key={v} style={{ position: "absolute", left: 660, top: Y(v) - 22, fontWeight: 900, fontSize: 38, color: v === 10 || v === 60 ? RED : DIM, opacity: cl(tt - 0.4) }}>{v}°</div>)}
    <div style={{ position: "absolute", left: 900, top: 330, width: 760, height: 520, borderRadius: 30, border: `3px solid ${RED}55`, background: "rgba(255,90,74,.06)", overflow: "hidden" }}>
      {Array.from({ length: n }, (_, i) => { const a = i * 2.399, r = Math.sqrt(i / 64) * 230; const born = i >= n / 2 ? cl(((tt - 1.6) / 4 * 7 - gen) * 3 + 0.2) : 1;
        return <div key={i} style={{ position: "absolute", left: 380 + Math.cos(a) * r * 1.4 + 4 * Math.sin(tt * 3 + i), top: 260 + Math.sin(a) * r + 4 * Math.cos(tt * 2.6 + i), width: 30, height: 18, borderRadius: 9, background: "#9be27a", transform: `translate(-50%,-50%) rotate(${a * 57}deg) scale(${born})`, boxShadow: "0 0 10px rgba(155,226,122,.6)" }} />; })}
      <div style={{ position: "absolute", right: 24, bottom: 16, fontWeight: 900, fontSize: 54, color: TX }}>× {n}</div>
    </div>
  </>;
}}</Stage>;

// ---- 20:28 · LA NOCHE ENTERA: curva de la olla de las 22 h a las 12 h; cruza la línea de 60 de madrugada y queda en rojo ----
export const HNight: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="radial-gradient(ellipse at 50% 30%, #121a2e, #04050a 75%)">{(tt) => {
  const d = eio(tt, 0.5, 4.6), X0 = 300, X1 = 1640, Y = (v: number) => 880 - v * 5.4;
  const N = 80, pts = Array.from({ length: N + 1 }, (_, i) => { const x = i / N; return [X0 + x * (X1 - X0), Y(20 + 78 * Math.exp(-x * 3.2))] as [number, number]; });
  const n = Math.max(1, Math.round(d * N)), cross = pts.findIndex((p) => p[1] > Y(60)), seg = (a: number, b: number) => pts.slice(a, b + 1).map((p, i) => (i ? "L" : "M") + p[0] + " " + p[1]).join(" ");
  const hr = ["22", "0", "2", "4", "6", "8", "10", "12"];
  return <>
    <Head tt={tt} kick="EL ERROR QUE ENFERMA" title="LA OLLA TODA LA NOCHE" col={RED} />
    {Array.from({ length: 40 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i * 397) % 1920, top: 60 + ((i * 211) % 300), width: 3, height: 3, borderRadius: 2, background: "#fff", opacity: 0.3 + 0.3 * Math.sin(tt * 2 + i) }} />)}
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <rect x={X0} y={Y(60)} width={X1 - X0} height={Y(10) - Y(60)} fill="rgba(255,90,74,.12)" />
      <line x1={X0} y1={Y(60)} x2={X1} y2={Y(60)} stroke={RED} strokeWidth={3} strokeDasharray="10 10" />
      <path d={seg(0, Math.min(n, cross))} fill="none" stroke={AMB} strokeWidth={8} strokeLinecap="round" />
      {n > cross && <path d={seg(cross, n)} fill="none" stroke={RED} strokeWidth={8} strokeLinecap="round" />}
      {hr.map((l, i) => <text key={i} x={X0 + i * (X1 - X0) / 7} y={950} fill={DIM} fontSize={30} fontWeight={800} textAnchor="middle" fontFamily="inherit">{l} h</text>)}
    </svg>
    <div style={{ position: "absolute", left: X1 - 40, top: Y(60) - 70, fontWeight: 900, fontSize: 34, color: RED }}>60°</div>
    <Tag tt={tt} at={4.6} x={1100} y={420} txt="16 HORAS = NO" col={RED} size={64} />
    <Tag tt={tt} at={5.4} x={1100} y={500} txt="MÁXIMO 6-8 h, Y SE VUELVE A HERVIR" size={32} />
  </>;
}}</Stage>;
