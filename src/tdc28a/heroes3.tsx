// componentes únicos 23-32 (minutos 21-30)
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, MARK, Photo, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

// ---- 21:18 · EL PINCHO: un termómetro de cocina se clava en el guiso; la aguja de dial sube y pasa la línea de 65 ----
export const HProbe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const stab = phys(tt, 0.4, 5.5, 0.5), v = 20 + 52 * eio(tt, 1.2, 3.4) + (tt > 3.4 ? 1.5 * Math.sin(tt * 3) * Math.exp(-(tt - 3.4)) : 0), ok = v > 65;
  const ang = -120 + (v / 100) * 240;
  return <>
    <Head tt={tt} kick="ANTES DE SERVIR" title="EL TERMÓMETRO MANDA" />
    {/* la olla en corte */}
    <div style={{ position: "absolute", left: 420, top: 640, width: 600, height: 300, borderRadius: "20px 20px 90px 90px", background: "linear-gradient(180deg,#5a5a62,#2a2a2f)", overflow: "hidden", boxShadow: "0 40px 90px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 16, right: 16, top: 30, bottom: 16, borderRadius: "10px 10px 80px 80px", background: "radial-gradient(ellipse at 50% 30%, #c27a34, #6d3712)" }} />
    </div>
    {/* el pincho que baja y se clava */}
    <div style={{ position: "absolute", left: 720, top: -420 + 720 * stab, transform: "translateX(-50%)" }}>
      <div style={{ width: 260, height: 260, borderRadius: "50%", marginLeft: -120, background: "radial-gradient(circle at 40% 35%, #fafaf6, #cfcfc6)", boxShadow: "0 20px 60px rgba(0,0,0,.6), inset 0 0 0 10px #8a8a92", position: "relative" }}>
        <svg width={260} height={260} viewBox="-130 -130 260 260" style={{ position: "absolute", left: 0, top: 0 }}>
          <path d={`M ${Math.cos((-120 + 0.65 * 240 - 90) * Math.PI / 180) * 100} ${Math.sin((-120 + 0.65 * 240 - 90) * Math.PI / 180) * 100} A 100 100 0 0 1 ${Math.cos((120 - 90) * Math.PI / 180) * 100} ${Math.sin((120 - 90) * Math.PI / 180) * 100}`} stroke={GRN} strokeWidth={14} fill="none" />
          {Array.from({ length: 11 }, (_, i) => { const a = (-120 + i * 24 - 90) * Math.PI / 180; return <line key={i} x1={Math.cos(a) * 82} y1={Math.sin(a) * 82} x2={Math.cos(a) * 96} y2={Math.sin(a) * 96} stroke="#333" strokeWidth={4} />; })}
          <g transform={`rotate(${ang})`}><path d="M -5 10 L 0 -92 L 5 10 Z" fill={RED} /></g><circle r={12} fill="#222" />
        </svg>
      </div>
      <div style={{ width: 14, height: 330, background: "linear-gradient(90deg,#aaa,#eee,#999)", marginLeft: 3 }} />
    </div>
    <div style={{ position: "absolute", left: 1220, top: 380, fontWeight: 900, fontSize: 200, color: ok ? GRN : TX, lineHeight: 1 }}>{Math.round(v)}°</div>
    <div style={{ position: "absolute", left: 1230, top: 600, fontWeight: 900, fontSize: 48, color: ok ? GRN : DIM, opacity: cl(tt - 1) }}>{ok ? "MÁS DE 65 → SE SIRVE ✓" : "MENOS DE 65 → HERVOR"}</div>
  </>;
}}</Stage>;

// ---- 22:40 · LA CADENA: estufa → hervor → caja → comida; las piezas se conectan con un tubo de calor, y el gas queda en 0 ----
export const HFlow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const N = ["ESTUFA", "HERVOR", "CAJA", "COMIDA"], E = ["🔥", "♨️", "📦", "🍲"];
  const pulse = (tt * 0.45) % 1;
  return <>
    <Head tt={tt} kick="SI YA TENÉS ESTUFA" title="EL GAS NO SE TOCA" />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <path d="M 330 560 L 1590 560" stroke="rgba(255,255,255,.08)" strokeWidth={22} strokeLinecap="round" />
      <path d="M 330 560 L 1590 560" stroke={AMB} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={`${eio(tt, 0.6, 3.6)} 1`} />
      {tt > 3.6 && <circle cx={330 + 1260 * pulse} cy={560} r={20} fill="#fff" style={{ filter: `drop-shadow(0 0 20px ${AMB})` }} />}
    </svg>
    {N.map((n, i) => { const s = phys(tt, 0.4 + i * 0.9, 6, 0.45); return <div key={i} style={{ position: "absolute", left: 330 + i * 420, top: 560, transform: `translate(-50%,-50%) scale(${cl(s) + (s > 1 ? (s - 1) * 0.4 : 0)})`, textAlign: "center" }}>
      <div style={{ position: "relative" }}><Photo id={h.imgs?.[i]} w={250} h={250} r={36} style={{ boxShadow: `0 0 0 3px ${AMB}88, 0 30px 70px rgba(0,0,0,.6)` }} />
        <div style={{ position: "absolute", right: -18, bottom: -18, width: 76, height: 76, borderRadius: 38, background: "#16130f", boxShadow: `0 0 0 3px ${AMB}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>{E[i]}</div></div>
      <div style={{ marginTop: 18, fontWeight: 900, fontSize: 36, letterSpacing: 3 }}>{n}</div>
    </div>; })}
    <div style={{ position: "absolute", left: 960, top: 860, transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 24, opacity: cl(phys(tt, 4.0, 6, 0.5)) }}>
      <svg width={90} height={130} viewBox="0 0 300 460"><rect x={120} y={20} width={60} height={50} rx={8} fill="#8a8a90" /><path d="M40 120 Q40 70 150 70 Q260 70 260 120 L260 420 Q260 450 230 450 L70 450 Q40 450 40 420 Z" fill="#2c2c30" stroke={GRN} strokeWidth={12} /></svg>
      <div style={{ fontWeight: 900, fontSize: 70, color: GRN }}>GAS: 0 g</div>
    </div>
  </>;
}}</Stage>;

// ---- 23:01 · LOS LADRILLOS: dos ladrillos pasan la noche sobre la chapa y se ponen al rojo (cámara térmica), después van a la caja ----
export const HBricks: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse at 50% 50%, #1a1412, #050404 75%)">{(tt) => {
  const heat = eio(tt, 0.8, 3.4), mv = eio(tt, 4.2, 5.6);
  const hc = (k: number) => `rgb(${Math.round(120 + 135 * k)},${Math.round(60 + 120 * k * (1 - k) * 2)},${Math.round(40 + 20 * (1 - k))})`;
  const clock = 22 + 10 * heat;
  return <>
    <Head tt={tt} kick="UN TRUCO MÁS" title="DOS LADRILLOS EN LA CHAPA" />
    {/* la chapa de la estufa */}
    <div style={{ position: "absolute", left: 360, top: 760, width: 760, height: 40, borderRadius: 8, background: "linear-gradient(180deg,#3c3c42,#1a1a1d)", opacity: 1 - mv }} />
    {/* la caja abierta a la derecha */}
    <div style={{ position: "absolute", left: 1250, top: 560, width: 460, height: 360, borderRadius: 20, background: "repeating-linear-gradient(90deg,#a87a45 0 40px,#9b6e3b 40px 80px)", boxShadow: "inset 0 0 0 12px #6d4a24, 0 30px 70px rgba(0,0,0,.6)", opacity: cl((tt - 3.6) * 2) }}>
      <div style={{ position: "absolute", left: 40, right: 40, top: 40, bottom: 40, borderRadius: 12, background: "#5b3f63" }} />
    </div>
    {[0, 1].map((i) => { const x = 470 + i * 300 + (1290 + i * 200 - 470 - i * 300) * mv, y = 640 - Math.sin(mv * Math.PI) * 260 + (mv > 0.99 ? 160 : 0) * cl((tt - 5.6) * 3);
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: 240 * (1 - 0.3 * mv), height: 110 * (1 - 0.3 * mv), borderRadius: 8, background: `linear-gradient(160deg, ${hc(heat)}, ${hc(heat * 0.7)})`, boxShadow: `0 0 ${80 * heat}px ${hc(heat)}, inset 0 0 0 4px rgba(0,0,0,.25)`, opacity: cl(phys(tt, 0.2 + i * 0.3, 6, 0.5) * 3) }}>
        {[0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: 30 + k * 66, top: 34, width: 40, height: 40, borderRadius: 20, background: "rgba(0,0,0,.25)" }} />)}
      </div>; })}
    {/* ondas de calor */}
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: heat * (1 - mv) }}>{[0, 1, 2, 3].map((i) => <path key={i} d={`M ${500 + i * 160} 610 c -20 -30 20 -60 0 -90 c -20 -30 20 -60 0 -90`} stroke="rgba(255,150,80,.4)" strokeWidth={6} fill="none" pathLength={1} strokeDasharray="0.4 0.6" strokeDashoffset={-((tt * 0.5 + i * 0.25) % 1)} />)}</svg>
    <div style={{ position: "absolute", left: 360, top: 850, fontWeight: 900, fontSize: 64, color: heat > 0.98 ? AMB : DIM, opacity: 1 - mv }}>{String(Math.floor(clock) % 24).padStart(2, "0")}:00 <span style={{ fontSize: 30, color: DIM }}>{heat > 0.98 ? "A LA MAÑANA, CALIENTES" : "TODA LA NOCHE EN LA CHAPA"}</span></div>
    <Tag tt={tt} at={5.2} x={1480} y={980} txt="ENVUELTOS, AL LADO DE LA OLLA" col={AMB} size={34} />
  </>;
}}</Stage>;

// ---- 23:33 · EL DÍA ENTERO: una regla de horas de 7 a 19 que corre; las tareas cuelgan como etiquetas de la línea ----
export const HTimeline: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const X = (hr: number) => 220 + (hr - 7) * 125, mk = (h.marks as { hr: number; l: string; at: number; on?: boolean }[] | undefined) ?? [];
  const now = 7 + 6 * eio(tt, 0.5, h.out - h.at - 1);
  return <>
    <Head tt={tt} kick="UN DÍA DE INVIERNO" title="ASÍ SE ORGANIZA" />
    <div style={{ position: "absolute", left: X(7), top: 560, width: (X(19) - X(7)) * eio(tt, 0.2, 1.2), height: 6, borderRadius: 3, background: "rgba(255,255,255,.25)" }} />
    <div style={{ position: "absolute", left: X(7), top: 557, width: X(now) - X(7), height: 12, borderRadius: 6, background: `linear-gradient(90deg, ${AMB}55, ${AMB})` }} />
    <div style={{ position: "absolute", left: X(now) - 14, top: 549, width: 28, height: 28, borderRadius: 14, background: AMB, boxShadow: `0 0 30px ${AMB}` }} />
    {Array.from({ length: 13 }, (_, i) => <div key={i} style={{ position: "absolute", left: X(7 + i), top: 590, transform: "translateX(-50%)", fontWeight: 800, fontSize: 28, color: DIM, opacity: cl(tt * 2 - i * 0.1) }}>{7 + i}</div>)}
    {mk.map((m, i) => { const s = phys(tt, m.at - h.at, 6, 0.45), up = i % 2 === 0, lit = m.on !== false;
      return <div key={i} style={{ position: "absolute", left: X(m.hr), top: !lit ? 830 : up ? 300 : 650, transform: `translateX(-50%) translateY(${(1 - s) * (up ? -120 : 120)}px)`, opacity: cl(s * 2) * (lit ? 1 : 0.45), textAlign: "center" }}>
        {!up && lit && <div style={{ width: 3, height: 60 * cl(s), background: lit ? AMB : DIM, margin: "-60px auto 0" }} />}
        <div style={{ padding: lit && (m as any).img ? "10px 10px 14px" : "16px 22px", borderRadius: 18, background: lit ? "rgba(30,24,16,.92)" : "rgba(255,255,255,.04)", border: `2px solid ${lit ? AMB : "rgba(255,255,255,.15)"}`, fontWeight: 900, fontSize: 30, whiteSpace: "nowrap", boxShadow: lit ? "0 24px 50px rgba(0,0,0,.5)" : undefined }}>
          {lit && (m as any).img && <Photo id={(m as any).img} w={240} h={140} r={12} style={{ marginBottom: 10 }} />}{m.l}</div>
        {up && lit && <div style={{ width: 3, height: 140 * cl(s), background: lit ? AMB : DIM, margin: "0 auto" }} />}
      </div>; })}
  </>;
}}</Stage>;

// ---- 24:39 · LA LUPA: una lupa pasa sobre la foto de los porotos y lo que se ve agrandado es «tierno» ----
export const HLoupe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const lx = 700 + 520 * eio(tt, 0.8, 3.0), ly = 520 + 80 * Math.sin(eio(tt, 0.8, 3.0) * Math.PI), R = 210, Z = 2.2, W = 1100, Hh = 640, PX = 410, PY = 230;
  return <>
    <div style={{ position: "absolute", left: PX, top: PY, transform: `translateY(${(1 - phys(tt, 0.1, 4.5, 0.55)) * 80}px)` }}><Photo id={h.img} w={W} h={Hh} r={22} z={1} /></div>
    <div style={{ position: "absolute", left: lx - R, top: ly - R, width: 2 * R, height: 2 * R, borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 0 16px #2a2a2e, 0 0 0 20px #55555c, 0 40px 90px rgba(0,0,0,.7)", opacity: cl(phys(tt, 0.5, 6, 0.6) * 2) }}>
      <div style={{ position: "absolute", left: -(lx - PX) * Z + R, top: -(ly - PY) * Z + R, width: W * Z, height: Hh * Z }}><Photo id={h.img} w={W * Z} h={Hh * Z} r={0} z={1} /></div>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,.25), transparent 45%)" }} />
    </div>
    <div style={{ position: "absolute", left: lx + R * 0.62, top: ly + R * 0.62, width: 50, height: 230, borderRadius: 25, background: "linear-gradient(90deg,#3a2a1a,#6a4a2a,#3a2a1a)", transform: "rotate(-45deg)", transformOrigin: "50% 0", opacity: cl(phys(tt, 0.5, 6, 0.6) * 2) }} />
    <div style={{ position: "absolute", left: 1560, top: 300, fontFamily: HAND, fontWeight: 700, fontSize: 110, color: GRN, transform: `rotate(-6deg) scale(${cl(phys(tt, 3.2, 7, 0.4))})` }}>tierno ✓</div>
    <div style={{ position: "absolute", left: 1580, top: 460, fontWeight: 900, fontSize: 64, color: TX, opacity: cl(tt - 3.8) }}>78°</div>
  </>;
}}</Stage>;

// ---- 25:29 · EL CORCHO: tres notas «NUNCA…» se clavan con chinches, cada una con un golpe de peso y su sombra ----
export const HNotes: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" bg="radial-gradient(ellipse at 50% 45%, #b08a5a, #6e4f2c 85%)">{(tt) => {
  const N = (h.notes as { l: string; at: number }[] | undefined) ?? [];
  const C = ["#fff59a", "#ffc7c7", "#c9f0ff"];
  return <>
    <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(0,0,0,.18) 2px, transparent 2.5px)", backgroundSize: "14px 14px" }} />
    <div style={{ position: "absolute", left: 110, top: 80, fontFamily: MARK, fontSize: 70, color: "#2a1c0e" }}>Lo que la abuela NUNCA hacía</div>
    {N.map((n, i) => { const s = phys(tt, n.at - h.at, 6, 0.38), x = 400 + i * 560, r = [-5, 3, -2][i];
      return <div key={i} style={{ position: "absolute", left: x - 230, top: 300, width: 460, height: 420, background: C[i], transform: `rotate(${r + (1 - cl(s)) * 20}deg) translateZ(0) scale(${1 + (1 - cl(s)) * 0.5})`, opacity: cl(s * 4), boxShadow: `${12 * cl(s)}px ${30 * cl(s)}px ${40 - 20 * cl(s)}px rgba(0,0,0,.45)`, padding: "70px 40px", fontFamily: HAND, fontWeight: 700, fontSize: 62, lineHeight: 1.05, color: "#2a2016" }}>
        <div style={{ position: "absolute", left: 205, top: 14, width: 48, height: 48, borderRadius: 24, background: `radial-gradient(circle at 35% 35%, #ff8a7a, ${RED})`, boxShadow: "0 6px 10px rgba(0,0,0,.4)" }} />
        {n.l}
      </div>; })}
  </>;
}}</Stage>;

// ---- 27:06 · LOS COMENTARIOS: un celular con el muro de comentarios; cada aparición suma una tarjeta que empuja a las anteriores ----
export const HComments: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode={(["iris", "wipe", "split", "drop"] as const)[(h.idx as number) % 4]}>{(tt) => {
  const all = (h.stack as { n: string; from: string; txt: string }[] | undefined) ?? [], idx = (h.idx as number) ?? 0, s = phys(tt, 0.6, 5.5, 0.5), heart = phys(tt, 2.4, 7, 0.32);
  const vis = all.slice(0, idx + 1).reverse();
  return <>
    <Head tt={tt} kick="USTEDES ME ESCRIBEN" title="LEO TODO" />
    <div style={{ position: "absolute", left: 960, top: 560, width: 660, height: 980, marginLeft: -330, marginTop: -480, borderRadius: 60, background: "#0b0b0d", boxShadow: "0 0 0 10px #222226, 0 60px 140px rgba(0,0,0,.8)", overflow: "hidden", transform: `rotateY(${-8 + 4 * Math.sin(tt * 0.4)}deg)` }}>
      <div style={{ position: "absolute", left: 210, top: 18, width: 140, height: 34, borderRadius: 17, background: "#000" }} />
      <div style={{ position: "absolute", left: 30, right: 30, top: 80, fontWeight: 900, fontSize: 30, color: DIM }}>{12 + idx * 37} comentarios</div>
      {vis.map((c, j) => { const isNew = j === 0;
        return <div key={c.n} style={{ position: "absolute", left: 24, right: 24, top: isNew ? 140 + (1 - s) * -260 : 140 + 270 * j * cl(s) + 270 * (j - 1) * (1 - cl(s)), opacity: isNew ? cl(s * 3) : 1 - j * 0.22, borderRadius: 26, background: isNew ? "#1d1d22" : "#141418", padding: "22px 24px", boxShadow: isNew ? `0 0 0 2px ${AMB}88` : undefined }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 26, background: ["#e57a44", "#5aa0e6", "#8fcf6a", "#c77ad8"][all.indexOf(c) % 4], display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 26 }}>{c.n[0]}</div>
            <div><div style={{ fontWeight: 900, fontSize: 32 }}>{c.n}</div><div style={{ fontSize: 22, color: DIM }}>{c.from}</div></div>
          </div>
          <div style={{ marginTop: 12, fontSize: 32, lineHeight: 1.25, color: TX }}>{c.txt}</div>
          {isNew && <div style={{ position: "absolute", right: 24, bottom: 16, fontSize: 40, transform: `scale(${cl(heart) + (heart > 1 ? (heart - 1) * 0.6 : 0)})`, color: RED }}>❤</div>}
        </div>; })}
    </div>
  </>;
}}</Stage>;

// ---- 28:13 · EL RELOJ DE ARENA: se da vuelta con peso, la arena cae y el tiempo que queda arriba es «tuyo» ----
export const HHourglass: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const flip = phys(tt, 0.5, 4.2, 0.4), sand = eio(tt, 1.6, 5.4);
  return <>
    <div style={{ position: "absolute", left: 700, top: 540, transform: `translate(-50%,-50%) rotate(${180 - 180 * flip}deg)` }}>
      <svg width={360} height={560} viewBox="0 0 360 560">
        <rect x={20} y={0} width={320} height={34} rx={10} fill="#7a5530" /><rect x={20} y={526} width={320} height={34} rx={10} fill="#7a5530" />
        <defs><clipPath id="hgT"><path d="M 50 34 L 310 34 Q 310 200 190 274 L 170 274 Q 50 200 50 34 Z" /></clipPath><clipPath id="hgB"><path d="M 170 286 L 190 286 Q 310 360 310 526 L 50 526 Q 50 360 170 286 Z" /></clipPath></defs>
        <rect x={40} y={34 + 240 * (flip > 0.9 ? sand : 0)} width={280} height={240} fill="#e0b26a" clipPath="url(#hgT)" />
        <rect x={40} y={526 - 240 * (flip > 0.9 ? sand : 1) * 0.9} width={280} height={240} fill="#e0b26a" clipPath="url(#hgB)" />
        {flip > 0.9 && sand < 0.99 && <rect x={176} y={270} width={8} height={240} fill="#e0b26a" opacity={0.8} />}
        <path d="M 50 34 L 310 34 Q 310 200 190 280 Q 310 360 310 526 L 50 526 Q 50 360 170 280 Q 50 200 50 34 Z" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.35)" strokeWidth={5} />
      </svg>
    </div>
    <div style={{ position: "absolute", left: 1000, top: 360, fontWeight: 900, fontSize: 150, lineHeight: 1, color: AMB, opacity: cl(phys(tt, 2.2, 6, 0.5)) }}>3 HORAS</div>
    <div style={{ position: "absolute", left: 1006, top: 530, fontWeight: 900, fontSize: 60, clipPath: `inset(0 ${(1 - eio(tt, 2.8, 3.8)) * 100}% 0 0)` }}>QUE SON TUYAS</div>
    <div style={{ position: "absolute", left: 1006, top: 630, fontFamily: HAND, fontWeight: 700, fontSize: 54, color: DIM, opacity: cl(tt - 4.2) }}>en vez de cuidar la hornalla</div>
  </>;
}}</Stage>;

// ---- 29:19 · LA BALANZA: en un plato el gas de la hornalla (350 g), en el otro el de la caja (50 g); se inclina y aparece la diferencia ----
export const HScale: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const aL = (h.aL as number) - h.at, aR = (h.aR as number) - h.at, dL = phys(tt, aL, 5, 0.5), dR = phys(tt, aR, 5, 0.5);
  const tilt = 14 * cl(dL) - 10 * cl(dR) + 3 * (dR > 0 ? 0 : 0), ang = phys(tt, aL, 3, 0.25) * 14 - phys(tt, aR, 3, 0.25) * 10;
  const P = (side: -1 | 1, txt: string, sub: string, d: number, col: string) => { const a = ang * Math.PI / 180, x = 960 + side * 420 * Math.cos(a), y = 420 + side * 420 * Math.sin(a);
    return <div style={{ position: "absolute", left: x, top: y }}>
      <div style={{ position: "absolute", left: -2, top: 0, width: 4, height: 200, background: "#8a8a92" }} />
      <div style={{ position: "absolute", left: -180, top: 200, width: 360, height: 40, borderRadius: "0 0 180px 180px", background: "linear-gradient(180deg,#c9c9d0,#7a7a82)" }} />
      <div style={{ position: "absolute", left: -120, top: 200 - 120 * cl(d) - (1 - cl(d)) * 300, width: 240, height: 120, borderRadius: 18, background: col, opacity: cl(d * 3), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>
        <div style={{ fontWeight: 900, fontSize: 52 }}>{txt}</div><div style={{ fontWeight: 800, fontSize: 22, letterSpacing: 2 }}>{sub}</div>
      </div>
    </div>; };
  void tilt;
  return <>
    <Head tt={tt} kick="LA CUENTA DE UNA OLLA" title="HORNALLA VS. CAJA" />
    <div style={{ position: "absolute", left: 940, top: 420, width: 40, height: 520, background: "linear-gradient(90deg,#55555c,#8a8a92,#55555c)", borderRadius: 10 }} />
    <div style={{ position: "absolute", left: 820, top: 920, width: 280, height: 40, borderRadius: 12, background: "#55555c" }} />
    <div style={{ position: "absolute", left: 960 - 440, top: 410, width: 880, height: 20, borderRadius: 10, background: "#b0b0b8", transform: `rotate(${ang}deg)`, transformOrigin: "50% 50%" }} />
    <div style={{ position: "absolute", left: 936, top: 396, width: 48, height: 48, borderRadius: 24, background: AMB }} />
    {P(-1, "50 g", "LA CAJA", dR, "linear-gradient(160deg,#2f7a4a,#1d4a2e)")}
    {P(1, "350 g", "LA HORNALLA", dL, "linear-gradient(160deg,#a23a2c,#5e1e16)")}
    <Tag tt={tt} at={aR + 1.2} x={960} y={1010} txt="−300 g DE GAS EN UNA OLLA" col={GRN} size={52} />
  </>;
}}</Stage>;

// ---- 30:08 · LAS GARRAFAS: 90 días × 250 g se apilan como gas dentro de garrafas de 10 kg: 22,5 kg = dos y media ----
export const HCylinders: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const kg = 22.5 * eio(tt, 0.6, 4.2), fills = [cl(kg / 10), cl((kg - 10) / 10), cl((kg - 20) / 10)];
  return <>
    <Head tt={tt} kick="UN INVIERNO · 90 DÍAS × 250 g" title="LO QUE NO COMPRÁS" />
    {fills.map((f, i) => { const s = phys(tt, 0.3 + i * 0.25, 6, 0.42); return <div key={i} style={{ position: "absolute", left: 520 + i * 360, top: 300, transform: `translateY(${(1 - s) * -500}px)`, opacity: cl(s * 3) }}>
      <svg width={300} height={520} viewBox="0 0 300 460">
        <defs><clipPath id={`cy${i}`}><path d="M40 120 Q40 70 150 70 Q260 70 260 120 L260 420 Q260 450 230 450 L70 450 Q40 450 40 420 Z" /></clipPath><linearGradient id={`cg${i}`} x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#b86f22" /><stop offset="50%" stopColor="#f0b25a" /><stop offset="100%" stopColor="#a8601c" /></linearGradient></defs>
        <rect x={120} y={20} width={60} height={50} rx={8} fill="#8a8a90" />
        <path d="M40 120 Q40 70 150 70 Q260 70 260 120 L260 420 Q260 450 230 450 L70 450 Q40 450 40 420 Z" fill="#202024" stroke="rgba(255,255,255,.2)" strokeWidth={4} />
        <rect x={40} y={450 - 380 * f} width={220} height={380} fill={`url(#cg${i})`} clipPath={`url(#cy${i})`} />
        <rect x={64} y={110} width={24} height={320} rx={12} fill="rgba(255,255,255,.2)" /><rect x={222} y={130} width={10} height={280} rx={5} fill="rgba(255,255,255,.08)" />
        <path d="M40 200 L260 200 M40 380 L260 380" stroke="rgba(0,0,0,.35)" strokeWidth={6} />
      </svg>
      <div style={{ textAlign: "center", fontWeight: 900, fontSize: 34, color: f >= 1 ? AMB : DIM }}>{f >= 1 ? "10 kg ✓" : f > 0 ? `${(f * 10).toFixed(1).replace(".", ",")} kg` : "—"}</div>
    </div>; })}
    <div style={{ position: "absolute", left: 1560, top: 430, fontWeight: 900, fontSize: 120, lineHeight: 1 }}>{kg.toFixed(1).replace(".", ",")}</div>
    <div style={{ position: "absolute", left: 1566, top: 560, fontWeight: 900, fontSize: 46, color: DIM }}>KG DE GAS</div>
    <Tag tt={tt} at={(h.said2 as number ?? h.at + 2.7) - h.at} x={960} y={985} txt="MÁS DE DOS GARRAFAS QUE NO COMPRÁS" col={AMB} size={46} />
  </>;
}}</Stage>;
