// ctec v3 · componentes del Técnico (tanda tec29). Vuelta 3 del EVALUADOR (2 vueltas estancado con «foto en marco + cartel»):
// se REDISEÑA el mecanismo. La foto real va A PANTALLA COMPLETA (sin marco, sin mesa) y nace de la escena anterior empujando
// a través del desenfoque; la cámara se mete en curva hasta el DETALLE del objeto (cajas.json, agnes visión) con un empujón
// macro de resorte y ahí nace el efecto (gotas con ondas, escarcha en helechos, aire, chispas, vapor, lluvia, aspas).
// La palabra se ESCRIBE con marcador sobre la foto (como el técnico marcando la foto del cliente), nunca un cartel.
//   foto    = plano completo + empujón al detalle + efecto
//   lista   = un plano por ítem, barrido rápido entre ítems, número y texto escritos con marcador, avance en fichas abajo a la derecha
//   versus  = pantalla partida; en el veredicto la mala se apaga y se tacha con una X roja de marcador, la buena se acerca
//   numero  = tablero de PALETAS (como el de un aeropuerto) grande y centrado que voltea hasta el número
//   alerta  = empujón al detalle + círculo rojo de marcador alrededor + la advertencia escrita al lado con flecha
import React from "react";
import { AbsoluteFill, Img, Sequence } from "remotion";
import { s as sF, Vid } from "./lib";
import { cl, eio, H, HAND, img, phys, MZ } from "./ckit";
import CJ from "./cajas.json";

const hash = (s: string) => { let x = 7; for (const c of s) x = (x * 31 + c.charCodeAt(0)) % 9973; return x; };
const rnd = (i: number) => { const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
type Caja = { obj: number[]; det: number[] };
const caja = (id: string): Caja => (CJ as Record<string, Caja>)[id] ?? { obj: [0.2, 0.2, 0.8, 0.8], det: [0.4, 0.4, 0.6, 0.6] };
const W = 1920, HH = 1080;

// ------------------------------------------------------------------ EFECTOS sobre el objeto (coordenadas en px de la foto)
const Efecto: React.FC<{ fx: string; W: number; Hh: number; c: Caja; u: number; seed: number }> = ({ fx, W, Hh, c, u, seed }) => {
  if (u <= 0) return null;
  const [dx0, dy0, dx1, dy1] = c.det, [, , , oy1] = c.obj;
  const cx = (dx0 + dx1) / 2 * W, cy = (dy0 + dy1) / 2 * Hh, dw = Math.max(60, (dx1 - dx0) * W), dh = Math.max(60, (dy1 - dy0) * Hh);
  const on = cl(u * 2.5);
  if (fx === "gota") { // gotas que se forman, caen y abren ondas en el piso del objeto
    const piso = Math.min(Hh - 30, Math.max(cy + 120, oy1 * Hh));
    return <svg width={W} height={Hh} style={{ position: "absolute", inset: 0, opacity: on }}>
      <defs><radialGradient id={"gd" + seed} cx="35%" cy="62%" r="70%"><stop offset="0%" stopColor="rgba(255,255,255,.95)" /><stop offset="25%" stopColor="rgba(190,215,235,.55)" /><stop offset="80%" stopColor="rgba(60,80,100,.55)" /><stop offset="100%" stopColor="rgba(20,30,40,.7)" /></radialGradient></defs>
      {[0, 1, 2, 3].map((i) => {
        const T = 1.15, ph = ((u + i * T / 4) % T) / T, x = cx + (rnd(seed + i) - 0.5) * dw * 0.5;
        const forma = cl(ph / 0.35), cae = cl((ph - 0.35) / 0.4), y = cy + dh * 0.3 + (piso - cy - dh * 0.3) * cae * cae;
        const onda = cl((ph - 0.75) / 0.25);
        return <g key={i}>
          {ph < 0.75 && <path d={`M ${x} ${y - 30 * (0.5 + forma)} Q ${x + 15} ${y + 3} ${x} ${y + 15} Q ${x - 15} ${y + 3} ${x} ${y - 30 * (0.5 + forma)} Z`} fill={`url(#gd${seed})`} stroke="rgba(255,255,255,.55)" strokeWidth={1.2} style={{ filter: "drop-shadow(0 3px 4px rgba(0,0,0,.45))" }} />}
          {onda > 0 && [0, 1].map((r) => <ellipse key={r} cx={x} cy={piso} rx={(24 + 170 * onda) * (1 - r * 0.4)} ry={(7 + 40 * onda) * (1 - r * 0.4)} fill="none" stroke="rgba(230,245,255,.95)" strokeWidth={5 - 3 * onda} opacity={1 - onda} />)}
        </g>;
      })}
    </svg>;
  }
  if (fx === "escarcha") { // helechos de hielo que crecen desde el detalle hacia afuera
    const g = eio(u, 0, 2.6);
    return <svg width={W} height={Hh} style={{ position: "absolute", inset: 0, opacity: on, filter: "drop-shadow(0 0 6px rgba(200,235,255,.9))" }}>
      <defs><radialGradient id={"fr" + seed}><stop offset="0%" stopColor="rgba(225,242,255,.5)" /><stop offset="100%" stopColor="rgba(225,242,255,0)" /></radialGradient></defs>
      <ellipse cx={cx} cy={cy} rx={(dw + 200) * g} ry={(dh + 160) * g} fill={`url(#fr${seed})`} />
      {Array.from({ length: 16 }, (_, i) => {
        const an = (i / 16) * Math.PI * 2 + rnd(seed + i) * 0.4, L = (90 + 150 * rnd(seed + i * 3)) * g;
        const x0 = cx + Math.cos(an) * dw * 0.35, y0 = cy + Math.sin(an) * dh * 0.35, x1 = x0 + Math.cos(an) * L, y1 = y0 + Math.sin(an) * L;
        const ramas = [0.3, 0.55, 0.8].map((f, j) => { const bx = x0 + (x1 - x0) * f, by = y0 + (y1 - y0) * f, l2 = L * 0.32 * (1 - f * 0.5);
          return [1, -1].map((sg) => `M ${bx} ${by} L ${bx + Math.cos(an + sg * 0.75) * l2} ${by + Math.sin(an + sg * 0.75) * l2}`).join(" ") + (j ? "" : ""); }).join(" ");
        return <path key={i} d={`M ${x0} ${y0} L ${x1} ${y1} ${ramas}`} stroke="rgba(240,250,255,.92)" strokeWidth={2.4} strokeLinecap="round" fill="none" />;
      })}
    </svg>;
  }
  if (fx === "aire") { // corriente de aire frío que sale del detalle: trazos curvos que viajan
    return <svg width={W} height={Hh} style={{ position: "absolute", inset: 0, opacity: on }}>
      {Array.from({ length: 9 }, (_, i) => {
        const y = cy + (i - 4) * dh * 0.14, ph = (u * 0.7 + rnd(seed + i)) % 1, L = 260 + 120 * rnd(i + seed * 2);
        const d = `M ${cx} ${y} C ${cx + L * 0.35} ${y - 40 + 20 * Math.sin(u * 2 + i)} ${cx + L * 0.65} ${y + 40} ${cx + L} ${y + 10 * Math.sin(u + i)}`;
        return <path key={i} d={d} stroke="rgba(225,242,255,.32)" strokeWidth={16 - 4 * (i % 3)} fill="none" strokeLinecap="round" strokeDasharray="180 790" strokeDashoffset={-ph * 970 + 180} style={{ filter: "blur(7px)" }} />;
      })}
    </svg>;
  }
  if (fx === "chispa") { // chispazos en el detalle, con gravedad y brillo que se apaga suave (nada de destellos)
    const T = 1.3, k = Math.floor(u / T), ph = (u % T) / T;
    return <svg width={W} height={Hh} style={{ position: "absolute", inset: 0, opacity: on }}>
      <circle cx={cx} cy={cy} r={40 + 30 * (1 - ph)} fill="rgba(255,190,90,.35)" opacity={1 - ph} style={{ filter: "blur(10px)" }} />
      {Array.from({ length: 14 }, (_, i) => {
        const an = rnd(seed + k * 31 + i) * Math.PI * 2, v = 140 + 220 * rnd(seed + k * 17 + i * 7), tq = ph * 0.9;
        const x = cx + Math.cos(an) * v * tq, y = cy + Math.sin(an) * v * tq + 260 * tq * tq, xb = cx + Math.cos(an) * v * Math.max(0, tq - 0.08), yb = cy + Math.sin(an) * v * Math.max(0, tq - 0.08) + 260 * Math.max(0, tq - 0.08) ** 2;
        return <line key={i} x1={xb} y1={yb} x2={x} y2={y} stroke={i % 3 ? "#ffd27a" : "#fff4d8"} strokeWidth={3} strokeLinecap="round" opacity={1 - ph} />;
      })}
    </svg>;
  }
  if (fx === "vapor") { // vapor que sube y se abre
    return <div style={{ position: "absolute", inset: 0, opacity: on }}>{Array.from({ length: 8 }, (_, i) => {
      const ph = (u * 0.35 + i / 8) % 1, x = cx + (rnd(seed + i) - 0.5) * dw + 40 * Math.sin(u * 1.3 + i) * ph, y = cy - ph * 320, s = 60 + 140 * ph;
      return <div key={i} style={{ position: "absolute", left: x - s / 2, top: y - s / 2, width: s, height: s, borderRadius: "50%", background: "rgba(255,255,255,.55)", filter: `blur(${14 + 18 * ph}px)`, opacity: Math.sin(ph * Math.PI) * 0.8 }} />;
    })}</div>;
  }
  if (fx === "lluvia") { // lluvia en capas (cerca grande y rápida, lejos fina) + ondas en los charcos
    return <svg width={W} height={Hh} style={{ position: "absolute", inset: 0, opacity: on }}>
      {Array.from({ length: 110 }, (_, i) => {
        const capa = i % 2, sp = capa ? 1500 : 900, L = capa ? 46 : 24, x = rnd(seed + i) * (W + 200) - 100 + (u * sp * 0.18) % 40;
        const y = ((rnd(seed + i * 5) * Hh + u * sp) % (Hh + 80)) - 40;
        return <line key={i} x1={x} y1={y} x2={x - L * 0.2} y2={y + L} stroke={capa ? "rgba(225,238,255,.8)" : "rgba(205,222,240,.5)"} strokeWidth={capa ? 3.6 : 2} />;
      })}
      {Array.from({ length: 6 }, (_, i) => { const ph = (u * 1.4 + rnd(seed + i * 9)) % 1, x = rnd(seed + i * 13) * W, y = Hh * (0.78 + 0.18 * rnd(seed + i * 11));
        return <ellipse key={"o" + i} cx={x} cy={y} rx={10 + 50 * ph} ry={3 + 12 * ph} fill="none" stroke="rgba(220,235,255,.7)" strokeWidth={2} opacity={1 - ph} />; })}
    </svg>;
  }
  if (fx === "giro") { // aspas que giran (borroso de movimiento) sobre el detalle
    const r = Math.max(dw, dh) * 0.55;
    return <div style={{ position: "absolute", left: cx - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: "50%", opacity: 0.75 * on,
      background: "conic-gradient(from 0deg, rgba(20,20,20,.0), rgba(30,30,30,.55) 30deg, rgba(20,20,20,0) 60deg, rgba(20,20,20,0) 120deg, rgba(30,30,30,.55) 150deg, rgba(20,20,20,0) 180deg, rgba(20,20,20,0) 240deg, rgba(30,30,30,.55) 270deg, rgba(20,20,20,0) 300deg)",
      transform: `rotate(${u * 520}deg)`, filter: "blur(3px)" }} />;
  }
  return null;
};


// escena: entra empujando a través del desenfoque (nace del plano anterior) y sale fundiéndose
const Escena: React.FC<{ t: number; at: number; out: number; children: (tt: number) => React.ReactNode }> = ({ t, at, out, children }) => {
  if (t < at - 0.02 || t > out + 0.5) return null;
  const tt = t - at, e = eio(tt, 0, 0.45), x = cl((t - out) / 0.5);
  return <AbsoluteFill style={{ background: "#0c0b0a", opacity: cl(tt / 0.18) * (1 - x) }}>
    <AbsoluteFill style={{ transform: `scale(${1.22 - 0.22 * e})`, filter: e < 1 ? `blur(${16 * (1 - e)}px)` : undefined }}>{children(tt)}</AbsoluteFill>
  </AbsoluteFill>;
};

// plano completo: deriva lenta en curva + empujón macro de resorte al detalle + efecto sobre el objeto
const Plano: React.FC<{ id: string; tt: number; D: number; fx?: string; fxAt?: number; push?: number; dim?: number; clip?: { at: number; d: number }; w?: number; h?: number; v?: number }> = ({ id, tt, D, fx, fxAt = 0.9, push = 0.55, dim = 0, clip, w = W, h = HH, v = 0 }) => {
  const c = caja(id), vid = /^v\d/.test(id);
  const ox = (c.det[0] + c.det[2]) / 2, oy = (c.det[1] + c.det[3]) / 2;
  const deriva = eio(tt, 0, Math.max(3, D)), golpe = phys(tt, fxAt - 0.35, 4.2, 0.62);
  const sc = 1.06 + 0.12 * deriva + push * cl(golpe) + 0.04 * (golpe - cl(golpe)) + 0.12 * eio(tt, fxAt + 0.6, Math.max(fxAt + 2, D + 0.4)); // la cámara nunca se queda quieta
  const dx = (v % 2 ? -1 : 1) * 46 * Math.sin(deriva * 2.6), dy = 20 * Math.sin(deriva * 1.9 + 1);
  return <div style={{ position: "absolute", width: w, height: h, overflow: "hidden", background: "#111" }}>
    <div style={{ position: "absolute", inset: 0, transformOrigin: `${ox * 100}% ${oy * 100}%`, transform: `translate(${dx}px, ${dy}px) scale(${sc})`, filter: dim ? `grayscale(${dim}) brightness(${1 - 0.5 * dim})` : undefined }}>
      <Img src={img(id)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
      {fx && fx !== "lupa" && !vid && <Efecto fx={fx} W={w} Hh={h} c={c} u={tt - fxAt} seed={hash(id)} />}
    </div>
    {clip && <Sequence from={sF(clip.at)} durationInFrames={Math.max(1, sF(clip.d - 0.1))} layout="none"><AbsoluteFill><Vid id={id} /></AbsoluteFill></Sequence>}
    {/* luz: viñeta suave + un barrido de brillo que cruza una vez en el empujón */}
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 75% 70% at 50% 50%, transparent 60%, rgba(0,0,0,.42))" }} />
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(110deg, transparent ${cl(tt - fxAt + 0.4) * 160 - 40}%, rgba(255,245,225,.13) ${cl(tt - fxAt + 0.4) * 160 - 25}%, transparent ${cl(tt - fxAt + 0.4) * 160 - 10}%)` }} />
  </div>;
};

// marcador: la palabra se escribe a mano sobre la foto (revelado de izquierda a derecha) con un subrayado que se dibuja
const Marca: React.FC<{ tt: number; at: number; x: number; y: number; txt: string; size?: number; col?: string; rot?: number; centro?: boolean }> = ({ tt, at, x, y, txt, size = 92, col = "#fff3d6", rot = -2.5, centro = true }) => {
  const k = eio(tt, at, at + Math.min(0.42, 0.16 + txt.length * 0.012)), u = eio(tt, at + 0.35, at + 0.8);
  if (k <= 0) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(${centro ? "-50%" : "0"}, -50%) rotate(${rot}deg)`, whiteSpace: "nowrap", width: "max-content" }}>
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: size, color: col, padding: "0 0.28em 0 0.12em", clipPath: `inset(-20% ${k >= 1 ? -12 : 100 - 100 * k}% -30% -5%)`, textShadow: "0 3px 0 rgba(0,0,0,.6), 0 0 22px rgba(0,0,0,.8), 0 0 3px rgba(0,0,0,.95)", WebkitTextStroke: "1.5px rgba(0,0,0,.55)", lineHeight: 1.1 }}>{txt}</div>
    <div style={{ position: "absolute", left: "2%", bottom: -10, height: 9, width: "96%", borderRadius: 6, background: col === "#fff3d6" ? MZ : col, transformOrigin: "0 50%", transform: `scaleX(${u}) rotate(-0.6deg)`, boxShadow: "0 3px 6px rgba(0,0,0,.5)" }} />
  </div>;
};
const tam = (s: string, g = 132, m = 104) => s.length > 22 ? m : s.length > 15 ? Math.round((g + m) / 2) : g;

// ------------------------------------------------------------------ FOTO
const Foto: React.FC<{ t: number; h: H }> = ({ t, h }) => {
  const D = Math.max(4, h.out - h.at), v = hash(h.k);
  return <Escena t={t} at={h.at} out={h.out}>{(tt) => <Plano id={h.foto} tt={tt} D={D} fx={h.fx} fxAt={1.0} push={0.5} v={v} />}</Escena>;
};

// ------------------------------------------------------------------ LISTA
const Lista: React.FC<{ t: number; h: H }> = ({ t, h }) => {
  const its = h.items as { a: number; tx: string; fx?: string; v?: string; cd?: number }[], fotos: string[] = h.fotos ?? [h.foto];
  return <Escena t={t} at={h.at} out={h.out}>{(tt) => {
    let cur = 0; its.forEach((x, i) => { if (t >= x.a - 0.2) cur = i; });
    const ca = its[cur].a - h.at, sw = eio(tt, ca - 0.2, ca + 0.18), nx = cur + 1 < its.length ? its[cur + 1].a - its[cur].a : h.out - its[cur].a;
    const plano = (j: number, off: number) => <div key={j} style={{ position: "absolute", inset: 0, transform: `translateX(${off}px)`, filter: Math.abs(off) > 5 ? `blur(${Math.min(18, Math.abs(off) / 60)}px)` : undefined }}>
      <Plano id={fotos[j % fotos.length]} tt={tt - (j ? its[j].a - h.at : 0) + (j ? 0.2 : 0)} D={Math.max(3, nx)} fx={its[j].fx} fxAt={0.7} push={0.42} v={j}
        clip={its[j].v ? { at: its[j].a, d: its[j].cd ?? 6 } : undefined} />
    </div>;
    const N = its.length, chip = N > 6 ? 46 : 58;
    return <AbsoluteFill>
      {cur > 0 && sw < 1 && plano(cur - 1, -W * sw)}
      {plano(cur, cur > 0 ? W * (1 - sw) : 0)}
      <Marca key={"m" + cur} tt={tt} at={ca + 0.2} x={W / 2} y={900} txt={`${cur + 1}. ${its[cur].tx}`} size={tam(its[cur].tx)} />
      {/* avance: fichas de metal abajo a la derecha, la actual en dorado */}
      <div style={{ position: "absolute", right: 70, bottom: 60, display: "flex", gap: 14 }}>{its.map((x, i) => {
        const k = phys(tt, x.a - h.at - 0.1, 7, 0.45); if (k <= 0) return null; const on = i === cur;
        return <div key={i} style={{ width: chip, height: chip, borderRadius: "50%", transform: `translateY(${-160 * (1 - k)}px) scale(${on ? 1.18 : 1})`, background: on ? `radial-gradient(circle at 35% 30%, #ffe08a, ${MZ} 60%, #b07d10)` : "radial-gradient(circle at 35% 30%, #e9eef2, #9aa6b0 60%, #5d6872)", boxShadow: "0 8px 14px rgba(0,0,0,.55)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HAND, fontWeight: 700, fontSize: chip * 0.58, color: "#1c232b" }}>{i + 1}</div>;
      })}</div>
    </AbsoluteFill>;
  }}</Escena>;
};

// ------------------------------------------------------------------ VERSUS (pantalla partida + X de marcador)
const Versus: React.FC<{ t: number; h: H }> = ({ t, h }) => {
  const [lt, lf] = h.l as [string, string], [rt, rf] = h.r as [string, string], win = h.win ?? "r", D = h.out - h.at;
  return <Escena t={t} at={h.at} out={h.out}>{(tt) => {
    const va = h.a2 != null ? h.a2 - h.at : Math.min(D * 0.55, 3.2), q = eio(tt, va, va + 0.5), kr = eio(tt, 0.7, 1.15);
    const lado = (izq: boolean) => {
      const gana = (win === "l") === izq, ww = (izq ? W / 2 + (W / 2) * (1 - kr) : W / 2) + (gana ? 140 : -140) * q;
      return <div style={{ position: "absolute", top: 0, left: izq ? 0 : undefined, right: izq ? undefined : 0, width: ww, height: HH, overflow: "hidden", transform: izq ? undefined : `translateX(${(1 - kr) * W / 2}px)` }}>
        <div style={{ position: "absolute", left: Math.min(0, (ww - Math.max(W / 2, ww)) / 2), top: 0 }}><Plano id={izq ? lf : rf} tt={tt} D={D} w={Math.max(W / 2, ww)} h={HH} fx={gana ? h.fx : undefined} fxAt={va + 0.4} push={gana ? 0.35 : 0} dim={gana ? 0 : 0.9 * q} v={izq ? 0 : 1} /></div>
        <Marca tt={tt} at={izq ? 0.5 : 1.2} x={ww / 2} y={930} txt={izq ? lt : rt} size={tam(izq ? lt : rt, 100, 76)} col={gana && q > 0.5 ? "#ffd75e" : "#fff3d6"} rot={izq ? -2 : 2} />
        {!gana && q > 0 && <svg width={ww} height={HH} style={{ position: "absolute", inset: 0 }}>
          {[[0.22, 0.22, 0.78, 0.7], [0.78, 0.22, 0.22, 0.7]].map(([x0, y0, x1, y1], i) => {
            const k = eio(tt, va + 0.1 + i * 0.25, va + 0.35 + i * 0.25);
            return <line key={i} x1={x0 * ww} y1={y0 * HH} x2={(x0 + (x1 - x0) * k) * ww} y2={(y0 + (y1 - y0) * k) * HH} stroke="#e8261c" strokeWidth={26} strokeLinecap="round" opacity={0.92} style={{ filter: "drop-shadow(0 6px 6px rgba(0,0,0,.5))" }} />;
          })}
        </svg>}
      </div>;
    };
    return <AbsoluteFill>{lado(true)}{lado(false)}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: W / 2 + (win === "l" ? 140 : -140) * q - 4 + (W / 2) * (1 - kr), width: 8, background: "#f4ecdc", boxShadow: "0 0 24px rgba(0,0,0,.7)", transform: `scaleY(${kr})` }} />
    </AbsoluteFill>;
  }}</Escena>;
};

// ------------------------------------------------------------------ NÚMERO (tablero de paletas que voltea)
const Paleta: React.FC<{ pos: number; w: number; h: number }> = ({ pos, w, h }) => {
  const cur = Math.floor(pos) % 10, nxt = (cur + 1) % 10, f = pos - Math.floor(pos);
  const mitad = (d: number, arriba: boolean, st?: React.CSSProperties) => <div style={{ position: "absolute", left: 0, width: w, height: h / 2, top: arriba ? 0 : h / 2, overflow: "hidden", background: arriba ? "linear-gradient(180deg,#2b2f35,#1d2025)" : "linear-gradient(180deg,#181b20,#24282e)", borderRadius: arriba ? "14px 14px 2px 2px" : "2px 2px 14px 14px", backfaceVisibility: "hidden", ...st }}>
    <div style={{ position: "absolute", left: 0, width: w, height: h, top: arriba ? 0 : -h / 2, lineHeight: `${h}px`, textAlign: "center", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: h * 0.78, color: "#f2efe6" }}>{d}</div>
  </div>;
  return <div style={{ position: "relative", width: w, height: h, margin: "0 8px", perspective: 1400, filter: "drop-shadow(0 22px 26px rgba(0,0,0,.6))" }}>
    {mitad(nxt, true)}{mitad(cur, false)}
    {f < 0.5 ? mitad(cur, true, { transformOrigin: "50% 100%", transform: `rotateX(${-f * 180}deg)`, filter: `brightness(${1 - f})` })
      : mitad(nxt, false, { transformOrigin: "50% 0%", transform: `rotateX(${(1 - f) * 180}deg)`, filter: `brightness(${f})` })}
    <div style={{ position: "absolute", left: -6, right: -6, top: h / 2 - 2, height: 4, background: "#0a0b0d" }} />
    {[0, 1].map((i) => <div key={i} style={{ position: "absolute", top: h / 2 - 9, left: i ? w - 4 : -14, width: 18, height: 18, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #d3d8dd, #5d666f)" }} />)}
  </div>;
};
const Numero: React.FC<{ t: number; h: H }> = ({ t, h }) => {
  const n = String(h.n), D = Math.max(4, h.out - h.at), v = hash(h.k), dig = n.split("");
  return <Escena t={t} at={h.at} out={h.out}>{(tt) => {
    const kb = phys(tt, 0.2, 6.5, 0.45), fin = eio(tt, 2.6, 3.3);
    const hh = dig.length >= 3 ? 330 : 430, ww = hh * 0.7;
    return <AbsoluteFill>
      <Plano id={h.foto} tt={tt} D={D} fx={h.fx} fxAt={2.9} push={0.3} dim={0.55 * (1 - fin)} v={v} />
      <div style={{ position: "absolute", left: "50%", top: 470 + hh / 2 + 60 - 90 * fin, width: ww * dig.length * 1.3, height: 70, transform: `translateX(-50%) scale(${0.4 + 0.6 * cl(kb)})`, borderRadius: "50%", background: "rgba(0,0,0,.6)", filter: "blur(22px)", opacity: cl(kb) }} />
      <div style={{ position: "absolute", left: "50%", top: 470, display: "flex", transform: `translate(-50%, -50%) translateY(${-760 * (1 - kb)}px) translateY(${-90 * fin}px)`, padding: 26, borderRadius: 30, background: "linear-gradient(180deg,#45505b,#262d35)", border: "5px solid #11161c", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 2px 0 rgba(255,255,255,.15)" }}>
        {dig.map((c, i) => {
          if (!/\d/.test(c)) return <div key={i} style={{ fontFamily: "Arial Black, Arial", fontWeight: 900, fontSize: hh * 0.6, color: "#f2efe6", lineHeight: `${hh}px`, padding: "0 6px" }}>{c}</div>;
          const d = Number(c), pasos = 10 + d + i * 10, k = eio(tt, 0.55 + i * 0.12, 2.1 + i * 0.25);
          return <Paleta key={i} pos={k * pasos} w={ww} h={hh} />;
        })}
      </div>
      {h.sub && <Marca tt={tt} at={2.3} x={W / 2} y={900} txt={h.sub} size={tam(h.sub, 112, 88)} />}
    </AbsoluteFill>;
  }}</Escena>;
};

// ------------------------------------------------------------------ ALERTA (círculo de marcador + advertencia escrita con flecha)
const Alerta: React.FC<{ t: number; h: H }> = ({ t, h }) => {
  const D = Math.max(4, h.out - h.at), c = caja(h.foto), v = hash(h.k);
  return <Escena t={t} at={h.at} out={h.out}>{(tt) => {
    const push = 0.5, sc = 1.06 + 0.08 * eio(tt, 0, Math.max(3, D)) + push * cl(phys(tt, 0.55, 4.2, 0.62));
    const cx = (c.det[0] + c.det[2]) / 2 * W, cy = (c.det[1] + c.det[3]) / 2 * HH;
    const rx = Math.min(560, Math.max(170, (c.det[2] - c.det[0]) * W * sc * 0.62 + 50)), ry = Math.min(400, Math.max(130, (c.det[3] - c.det[1]) * HH * sc * 0.62 + 40));
    const dib = eio(tt, 1.2, 1.9), izq = cx > W / 2, tx = W / 2, ty = 905, bajo = cy + ry > 820; // la advertencia va abajo al centro; la flecha la une al círculo
    return <AbsoluteFill>
      <Plano id={h.foto} tt={tt} D={D} fx={h.fx !== "lupa" ? h.fx : undefined} fxAt={0.9} push={push} v={v} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse ${rx * 1.6}px ${ry * 1.6}px at ${cx}px ${cy}px, transparent 60%, rgba(40,0,0,${0.45 * dib}) 100%)` }} />
      <svg width={W} height={HH} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 6px 8px rgba(0,0,0,.55))", overflow: "visible" }}>
        <path d={`M ${cx + rx} ${cy - ry * 0.1} A ${rx} ${ry} 0 1 1 ${cx + rx * 0.7} ${cy - ry * 0.75} L ${cx + rx * 1.06} ${cy - ry * 0.3}`} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - dib}
          fill="none" stroke="#e8261c" strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" />
        {h.tx && !bajo && Math.abs(cx - W / 2) > 320 && <path d={`M ${tx + (izq ? 120 : -120)} ${ty - 70} Q ${(tx + cx) / 2} ${ty - 60} ${cx + (izq ? -rx * 0.6 : rx * 0.6)} ${cy + ry * 0.8}`} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eio(tt, 1.9, 2.3)} fill="none" stroke="#e8261c" strokeWidth={12} strokeLinecap="round" />}
      </svg>
      {h.tx && <Marca tt={tt} at={2.2} x={tx} y={ty + 40} txt={h.tx} size={tam(h.tx, 104, 84)} col="#ff4a3a" rot={izq ? -2 : 2} />}
    </AbsoluteFill>;
  }}</Escena>;
};

export const TEC: Record<string, React.FC<{ t: number; h: H }>> = { lista: Lista, versus: Versus, numero: Numero, alerta: Alerta, foto: Foto };
