// Kit del video clc28b (MOHO NEGRO en la PARED: el cloro no lo mata). Un componente ÚNICO por minuto, ninguno repetido de otro video.
//   MwWallReveal   el ropero se corre y la pared aparece con puntitos negros que suben desde el zócalo; contorno «del tamaño de una mesa»
//   MwBleachCycle  la mancha se pone blanca con el cloro, el almanaque pasa 3 semanas y la mancha vuelve más oscura
//   MwTenTags      diez llaveros de habitación en el tablero; el 9 se ilumina con «5 cm»
//   MwBookBed      el libro cae sobre la frazada, se abre en la página REAL y entra el QR
//   MwPlasterSlice el pedacito de revoque de la 214 visto de costado: pintura blanca, revoque gris y la línea negra a medio centímetro
//   MwRootDrink    el poro en corte: el cloro blanquea arriba, el agua baja y le da de tomar a la raíz
//   MwGearHook     la percha del conserje: mascarilla N95, guantes largos y gafas; el barbijo de tela se tacha
//   MwSprayHalo    la mancha en la pared y el círculo de rociado que pasa 20 cm más allá del negro
//   MwHourDoor     la puerta que se cierra con la ventana abierta y el reloj que barre una hora entera
//   MwFizz         el agua oxigenada al 3 % sobre la pared: burbujitas y el arco de 10-15 minutos
//   MwOneADay      el almanaque: día 1 vinagre, día 2 agua oxigenada; el cloro con cualquiera de los dos, NUNCA
//   MwShadowLift   una cucharada de bicarbonato en el vaso y la esponja que levanta la sombra gris
//   MwTriangle     el triángulo del moho: humedad, poco aire, oscuridad; se corta una punta y cae
//   MwBackHand     el dorso de la mano contra la pared: fría y pegajosa = todavía no · tibia y suave = sí
//   MwBlister      pintura sobre moho vivo: ampollas que se levantan; y el orden matar → secar → pintar
//   MwBreathGlass  la persona que duerme y el vapor que llena un vaso por noche; dos personas, dos vasos; va a la pared fría
//   MwIceTest      el vaso con hielo contra la pared: gotas que chorrean, 10 minutos, la pared del sur más fría
//   MwGapPlan      la planta vista de arriba: ropero pegado (cámara fría) contra ropero a 5 cm (el aire pasa)
//   MwFiveCm       la regla de 5 cm: dos dedos y medio y el largo de una caja de fósforos
//   MwSquareMeter  el metro cuadrado: la mancha chica (usted) contra la grande (profesional) y sus tres causas
//   MwMorning      la hoja de la rutina de la mañana: 4 pasos y 10 minutos de par en par contra 1 hora apenas abierta
//   MwFiveErrors   cinco etiquetas de error que se dan vuelta una por una
//   MwLegs         el ropero con patitas: el aire pasa por abajo y por arriba; pared del pasillo tibia, de la calle fría
//   MwRecap10      repaso: diez azulejos manchados que se limpian uno por uno con su punto
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, rnd, clamp01, ease, hexA } from "./ClTheme";
import { Bed, Contact, RoomLight, KeyTag, lin, pop, useOut } from "./ClParts";
import { manoCam } from "../kits/camara/CamaraMano";

const MOLD = "#23251E", WALL = "#EEE8DC", WALLD = "#D9D0BF", WOOD = "#7A4E2D", WOODD = "#5A361C", COLD = "#5D8FC7", WARM = "#E08A3C", OK = "#2F8F48";

const Hand2D: React.FC<{ seed: number; children: React.ReactNode; push?: [number, number] }> = ({ seed, children, push = [1.0, 1.045] }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig();
  const m = manoCam(f / fps, 1, seed);
  const z = interpolate(f, [0, Math.max(2, T)], push, { easing: Easing.inOut(Easing.cubic), extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ transform: `translate(${m.x}px, ${m.y}px) rotate(${m.roll * 0.6}deg) scale(${z})` }}>{children}</AbsoluteFill>;
};
const Tag: React.FC<{ x: number; y: number; text: string; k: number; color?: string; size?: number; center?: boolean }> = ({ x, y, text, k, color = CL.navy, size = 44, center }) => (
  <div style={{ position: "absolute", left: x, top: y, translate: center ? "-50% -50%" : "0% -50%", opacity: clamp01(k), scale: String(0.85 + 0.15 * clamp01(k)), background: color, color: "#fff", fontFamily: LABEL, fontWeight: 600, fontSize: size, letterSpacing: 2, padding: "8px 24px", borderRadius: 10, textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: `0 10px 24px ${CL.shadow}`, borderBottom: `4px solid ${CL.yellow}` }}>{text}</div>
);
const Hand: React.FC<{ x: number; y: number; text: string; k: number; size?: number; color?: string; w?: number }> = ({ x, y, text, k, size = 64, color = CL.navy, w = 760 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, fontFamily: HAND, fontWeight: 700, fontSize: size, lineHeight: 1.08, color, opacity: clamp01(k), translate: `0 ${(1 - clamp01(k)) * 18}px` }}>{text}</div>
);
const Tick: React.FC<{ ok: boolean; s?: number; k?: number }> = ({ ok, s = 70, k = 1 }) => (
  <svg width={s} height={s} viewBox="0 0 70 70" style={{ overflow: "visible" }}>
    {ok ? <path d="M10 38 L28 56 L60 16" stroke={OK} strokeWidth={11} fill="none" strokeLinecap="round" strokeDasharray={90} strokeDashoffset={90 * (1 - clamp01(k))} />
      : <path d="M14 14 L56 56 M56 14 L14 56" stroke={CL.red} strokeWidth={11} strokeLinecap="round" strokeDasharray={120} strokeDashoffset={120 * (1 - clamp01(k))} />}
  </svg>
);
// puntitos de moho deterministas dentro de una caja; k = cuánto creció (0-1), sube desde abajo
const Spots: React.FC<{ x: number; y: number; w: number; h: number; k: number; n?: number; seed?: number; color?: string }> = ({ x, y, w, h, k, n = 260, seed = 3, color = MOLD }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const u = rnd(seed * 1000 + i), v = rnd(seed * 2000 + i * 3), r = 2 + rnd(seed * 3000 + i * 7) * 7;
      const yy = y + h * (1 - Math.pow(v, 0.7)); const reach = 1 - (yy - y) / h; // abajo primero
      const a = clamp01((k * 1.25 - reach) * 4);
      const cx = x + w * (0.5 + (u - 0.5) * (0.55 + 0.45 * (1 - reach)));
      return a > 0 ? <circle key={i} cx={cx} cy={yy} r={r * (0.4 + 0.6 * a)} fill={color} opacity={0.35 + 0.6 * a * rnd(i + 9)} /> : null;
    })}
  </g>
);

// ═════════════ 1 · el ropero se corre
export const MwWallReveal: React.FC<{ stage?: number; bed?: string }> = ({ stage = 0 }) => {
  const f = useCurrentFrame(); const { durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const slide = ease(clamp01(f / 40)), grow = ease(clamp01((f - 18) / 70)), table = lin(f, 40, 62);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out, background: WALL }}>
      <Hand2D seed={201}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          <defs><linearGradient id="mwr_w" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F3EEE4" /><stop offset="1" stopColor="#E2D9C8" /></linearGradient></defs>
          <rect width={1920} height={1080} fill="url(#mwr_w)" />
          <rect x={0} y={900} width={1920} height={180} fill="#B9A58A" /><rect x={0} y={880} width={1920} height={26} fill="#D8CDBB" />
          <Spots x={520} y={330} w={760} h={560} k={grow * (stage ? 1 : 0.95)} n={340} seed={7} />
          {stage ? <g opacity={table}><rect x={500} y={430} width={800} height={460} rx={8} fill="none" stroke={CL.yellow} strokeWidth={8} strokeDasharray="26 16" /></g> : null}
          {/* el ropero */}
          <g transform={`translate(${460 + slide * 980} 0)`}>
            <rect x={0} y={120} width={880} height={780} rx={10} fill={WOOD} /><rect x={0} y={120} width={880} height={30} fill={WOODD} />
            <rect x={36} y={175} width={390} height={690} rx={6} fill="#8A5A35" stroke={WOODD} strokeWidth={6} />
            <rect x={454} y={175} width={390} height={690} rx={6} fill="#8A5A35" stroke={WOODD} strokeWidth={6} />
            <rect x={400} y={500} width={14} height={90} rx={7} fill="#D9B26A" /><rect x={466} y={500} width={14} height={90} rx={7} fill="#D9B26A" />
            <rect x={30} y={900} width={40} height={26} fill={WOODD} /><rect x={810} y={900} width={40} height={26} fill={WOODD} />
          </g>
        </svg>
        {stage ? <Tag x={900} y={360} text="del tamaño de una mesa" k={table} center /> : <Tag x={900} y={970} text="empieza en el zócalo y sube" k={lin(f, 50, 66)} center />}
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════ 2 · cloro: blanco… y a las 3 semanas vuelve
export const MwBleachCycle: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const t = f / Math.max(1, T);
  const white = lin(f, 8, 30), back = lin(f, T * 0.62, T * 0.86);
  const weeks = Math.min(3, Math.floor(lin(f, 34, T * 0.62, 0, 3.999)));
  const p = pop(f, fps, 0, 13);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={202} dim={0.45} />
      <Hand2D seed={202}>
        <Contact x={560} y={940} w={760} />
        <div style={{ position: "absolute", left: 180, top: 140, width: 900, height: 780, borderRadius: 18, background: WALL, boxShadow: `0 30px 60px ${CL.shadow}`, overflow: "hidden", scale: String(0.9 + 0.1 * p) }}>
          <svg width={900} height={780} viewBox="0 0 900 780">
            <Spots x={120} y={160} w={660} h={540} k={1} n={300} seed={11} color={`rgb(${35 + 165 * white * (1 - back)},${37 + 163 * white * (1 - back)},${30 + 165 * white * (1 - back)})`} />
            {back > 0 ? <Spots x={100} y={120} w={700} h={600} k={back} n={200} seed={12} /> : null}
          </svg>
        </div>
        {/* almanaque */}
        <div style={{ position: "absolute", left: 1200, top: 180, width: 520, height: 560, background: "#fff", borderRadius: 14, boxShadow: `0 20px 40px ${CL.shadow}`, overflow: "hidden" }}>
          <div style={{ height: 120, background: CL.red, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 52, display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: 3 }}>SEMANA</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 300, color: CL.navy, textAlign: "center", lineHeight: "400px", fontVariantNumeric: "tabular-nums" }}>{weeks}</div>
        </div>
        <Tag x={1460} y={820} text={back > 0.2 ? "vuelve · a veces peor" : "blanca… qué alivio"} k={back > 0.2 ? back * 2 : white} color={back > 0.2 ? CL.red : CL.navy} center />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════ 3 · diez llaveros; el 9 se ilumina
export const MwTenTags: React.FC<{ hi?: number; bed?: string }> = ({ hi = 9, bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8);
  const glow = lin(f, 30, 44);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={203} dim={0.5} />
      <Hand2D seed={203}>
        <div style={{ position: "absolute", left: 160, top: 120, width: 1600, height: 760, borderRadius: 20, background: "#6B4A2E", boxShadow: `0 30px 60px ${CL.shadow}` }} />
        {Array.from({ length: 10 }).map((_, i) => {
          const p = pop(f, fps, 2 + i * 2, 13); const col = i % 5, row = Math.floor(i / 5); const on = i + 1 === hi;
          return (
            <div key={i} style={{ position: "absolute", left: 250 + col * 300, top: 170 + row * 360, rotate: `${Math.sin(f * 0.12 + i) * 3 * Math.exp(-f / 30)}deg`, transformOrigin: "50% 0", opacity: p, scale: String((0.7 + 0.3 * p) * (on ? 1 + 0.12 * glow : 1)), filter: on ? `drop-shadow(0 0 ${30 * glow}px ${CL.yellow})` : undefined }}>
              <KeyTag num={i + 1} label="PUNTO" w={220} color={on ? CL.red : CL.navy} />
            </div>
          );
        })}
        <Tag x={960} y={960} text="el 9 · cinco centímetros" k={glow} color={CL.red} center />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════ 4 · el libro sobre la frazada → página real → QR
export const MwBookBed: React.FC<{ page: string; cover: string; qr: string; pageNo: number; skip?: number; bed?: string }> = ({ page, cover, qr, pageNo, skip = 0, bed }) => {
  const f0 = useCurrentFrame(); const f = f0 + skip; const { fps } = useVideoConfig(); const out = useOut(8);
  const drop = pop(f, fps, 0, 15), open = ease(clamp01((f - 26) / 26)), q = pop(f, fps, 70, 13);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out, background: "#CDBFA8" }}>
      <Bed src={bed} seed={204} dim={0.35} />
      <Hand2D seed={204} push={[1.0, 1.06]}>
        <Contact x={760} y={980} w={900} />
        <div style={{ position: "absolute", left: 360, top: 120 + (1 - drop) * -900, width: 1240, height: 820, perspective: 2400 }}>
          {/* página real (derecha) */}
          <div style={{ position: "absolute", left: 620, top: 0, width: 600, height: 820, background: "#fff", boxShadow: `0 24px 50px ${CL.shadow}`, overflow: "hidden" }}>
            <Img src={staticFile(page)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0%" }} />
          </div>
          {/* tapa que gira */}
          <div style={{ position: "absolute", left: 620, top: 0, width: 600, height: 820, transformOrigin: "0% 50%", transform: `rotateY(${-178 * open}deg)`, backfaceVisibility: "hidden", boxShadow: `0 24px 50px ${CL.shadow}` }}>
            <Img src={staticFile(cover)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ position: "absolute", left: 20, top: 0, width: 600, height: 820, background: "#F4EFE4", opacity: open, boxShadow: `0 24px 50px ${CL.shadow}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 46, color: CL.brown, textAlign: "center", lineHeight: 1.1, padding: "0 40px" }}>El Frasco Marrón<br />de Claudio</div>
            <div style={{ opacity: q, scale: String(0.85 + 0.15 * q), background: "#fff", padding: 16, borderRadius: 14, boxShadow: `0 10px 24px ${CL.shadow}` }}><Img src={staticFile(qr)} style={{ width: 300, height: 300, display: "block" }} /></div>
            <div style={{ opacity: q, fontFamily: LABEL, fontWeight: 700, fontSize: 30, color: CL.navy, letterSpacing: 1 }}>ESCANEE CON LA CÁMARA</div>
            <div style={{ opacity: q, fontFamily: HAND, fontSize: 30, color: CL.inkSoft, textAlign: "center", padding: "0 50px" }}>el link está en la primera línea de la descripción</div>
          </div>
        </div>
        <Tag x={980} y={70} text={`arreglo 16 · página ${pageNo}`} k={lin(f, 40, 54)} center />
        
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════ 5 · el pedacito de revoque de la 214, de costado
export const MwPlasterSlice: React.FC<{ stage?: number; bed?: string }> = ({ stage = 1, bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const rot = stage ? ease(clamp01(f / 34)) : 0, line = lin(f, 30, 60), lab = lin(f, 50, 66);
  const p = pop(f, fps, 0, 14);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={205} dim={0.5} />
      <Hand2D seed={205}>
        <Contact x={960} y={900} w={900} />
        <div style={{ position: "absolute", left: 460, top: 260, width: 1000, height: 520, perspective: 1800, scale: String(0.85 + 0.15 * p) }}>
          <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateX(${62 - 62 * rot}deg) rotateZ(${-8 + 8 * rot}deg)` }}>
            <svg width={1000} height={520} viewBox="0 0 1000 520" style={{ overflow: "visible" }}>
              <defs><pattern id="mwp_pore" width="26" height="26" patternUnits="userSpaceOnUse"><rect width="26" height="26" fill="#A8A296" /><circle cx="7" cy="9" r="3" fill="#8C867A" /><circle cx="19" cy="20" r="2.4" fill="#948E82" /><circle cx="20" cy="6" r="1.6" fill="#7E786D" /></pattern></defs>
              <path d="M40 40 Q500 10 960 40 L980 480 Q500 510 20 480 Z" fill="url(#mwp_pore)" stroke="#6E685D" strokeWidth={4} />
              <path d="M40 40 Q500 10 960 40 L962 82 Q500 54 38 82 Z" fill="#FBFAF6" stroke="#D8D2C6" strokeWidth={3} />
              <path d="M38 82 Q500 54 962 82 L964 150 Q500 124 36 150 Z" fill="#E7E1D3" />
              {/* la raíz: línea negra a medio centímetro */}
              <path d={`M60 196 Q260 180 ${60 + 880 * line} ${196 - 10 * Math.sin(line * 3)}`} fill="none" stroke={MOLD} strokeWidth={12} strokeLinecap="round" />
              {Array.from({ length: 22 }).map((_, i) => { const x = 80 + i * 40; const a = clamp01((line * 900 - (x - 60)) / 120); return <path key={i} d={`M${x} 194 q ${(rnd(i) - 0.5) * 30} ${-30 - rnd(i + 4) * 30} ${(rnd(i + 2) - 0.5) * 20} ${-50 - rnd(i + 5) * 30}`} stroke={MOLD} strokeWidth={4} fill="none" opacity={a * 0.8} />; })}
            </svg>
          </div>
        </div>
        {stage ? (<>
          <Tag x={960} y={190} text="por fuera: blanco" k={lin(f, 20, 34)} center />
          <Tag x={960} y={860} text="la raíz · 0,5 cm adentro" k={lab} color={CL.red} center />
        </>) : <Tag x={960} y={900} text="un pedacito, como una uña" k={lin(f, 10, 26)} center />}
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════ 6 · el poro: el cloro blanquea arriba y el agua le da de tomar a la raíz
export const MwRootDrink: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const bl = lin(f, 10, 36), down = lin(f, 30, T - 20), grow = lin(f, 50, T - 10);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={206} dim={0.55} />
      <Hand2D seed={206}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
          <rect x={260} y={180} width={1400} height={760} rx={24} fill="#B5AE9F" />
          <rect x={260} y={180} width={1400} height={70} rx={20} fill={`rgb(${60 + 190 * bl},${62 + 188 * bl},${55 + 190 * bl})`} />
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const x = 380 + i * 230, d = 380 + rnd(i) * 360;
            return (<g key={i}>
              <path d={`M${x} 250 C ${x + 40} ${250 + d * 0.4}, ${x - 40} ${250 + d * 0.7}, ${x + 10} ${250 + d}`} stroke="#8F887A" strokeWidth={46} fill="none" strokeLinecap="round" />
              <path d={`M${x} 252 C ${x + 40} ${250 + d * 0.4}, ${x - 40} ${250 + d * 0.7}, ${x + 10} ${250 + d * (0.55 + 0.45 * grow)}`} stroke={MOLD} strokeWidth={6} fill="none" strokeLinecap="round" />
              {Array.from({ length: 4 }).map((_, j) => { const y = 250 + ((down * 900 + j * 160 + i * 70) % (d + 10)); return <ellipse key={j} cx={x + Math.sin(y / 60) * 18} cy={y} rx={11} ry={15} fill="#7FB3E3" opacity={down > 0.02 ? 0.85 : 0} />; })}
            </g>);
          })}
        </svg>
        <Tag x={300} y={110} text="el cloro blanquea la cara" k={bl} />
        <Tag x={1100} y={1000} text="el agua baja y alimenta la raíz" k={lin(f, 46, 62)} color={CL.red} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════ 7 · la percha del conserje
export const MwGearHook: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8);
  const items: [string, number][] = [["mascarilla N95 · ajustada", 6], ["guantes de goma largos", 22], ["gafas si cepilla arriba", 38]];
  const cross = lin(f, 58, 72);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={207} dim={0.5} />
      <Hand2D seed={207}>
        <div style={{ position: "absolute", left: 140, top: 150, width: 1000, height: 780, background: "#F7F3EA", borderRadius: 20, boxShadow: `0 30px 60px ${CL.shadow}` }} />
        <div style={{ position: "absolute", left: 140, top: 150, width: 1000, height: 120, background: CL.navy, borderRadius: "20px 20px 0 0", color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 54, letterSpacing: 3, display: "flex", alignItems: "center", paddingLeft: 50 }}>ANTES DE TOCAR EL MOHO</div>
        {items.map(([t, at], i) => { const p = pop(f, fps, at, 13); return (
          <div key={i} style={{ position: "absolute", left: 200, top: 320 + i * 150, display: "flex", alignItems: "center", gap: 30, opacity: p, translate: `${(1 - p) * -60}px 0` }}>
            <Tick ok k={lin(f, at + 6, at + 16)} /><span style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 62, color: CL.ink }}>{t}</span>
          </div>); })}
        <div style={{ position: "absolute", left: 200, top: 780, display: "flex", alignItems: "center", gap: 30, opacity: lin(f, 50, 60) }}>
          <Tick ok={false} k={cross} /><span style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 62, color: CL.inkSoft, textDecoration: cross > 0.5 ? "line-through" : "none" }}>barbijo de tela</span>
        </div>
        {/* mascarilla dibujada */}
        <svg width={600} height={600} viewBox="0 0 600 600" style={{ position: "absolute", left: 1220, top: 240, opacity: pop(f, fps, 4, 14) }}>
          <path d="M120 250 Q300 120 480 250 Q470 420 300 470 Q130 420 120 250 Z" fill="#FFFFFF" stroke="#C9C4B8" strokeWidth={6} />
          <path d="M150 290 Q300 220 450 290" stroke="#DAD5CA" strokeWidth={5} fill="none" />
          <path d="M120 250 Q40 260 60 340 M480 250 Q560 260 540 340" stroke="#3C7FD9" strokeWidth={8} fill="none" />
          <rect x={250} y={170} width={100} height={14} rx={7} fill="#9AA3AD" />
          <text x={300} y={380} textAnchor="middle" fontFamily="Arial" fontWeight={700} fontSize={44} fill="#5B6472">N95</text>
        </svg>
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════ 8 · el círculo de rociado: 20 cm más allá del negro
export const MwSprayHalo: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const wet = lin(f, 10, 40), halo = lin(f, 36, 60), hidden = lin(f, 56, 76);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out, background: WALL }}>
      <Hand2D seed={208}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          <rect width={1920} height={1080} fill={WALL} />
          <ellipse cx={900} cy={540} rx={250 + 180 * wet} ry={200 + 150 * wet} fill="#B9C9D4" opacity={0.28 * wet} />
          <Spots x={680} y={360} w={440} h={360} k={1} n={200} seed={21} />
          <Spots x={520} y={260} w={760} h={560} k={hidden} n={90} seed={22} color="#6E6E62" />
          <ellipse cx={900} cy={540} rx={430} ry={350} fill="none" stroke={CL.yellow} strokeWidth={10} strokeDasharray="30 18" opacity={halo} />
          <line x1={1120} y1={540} x2={1330} y2={540} stroke={CL.navy} strokeWidth={6} opacity={halo} />
          <path d="M1310 520 L1334 540 L1310 560" stroke={CL.navy} strokeWidth={6} fill="none" opacity={halo} />
        </svg>
        <Tag x={1350} y={540} text="+ 20 cm" k={halo} />
        <Tag x={900} y={980} text="el moho está más lejos de lo que se ve" k={hidden} color={CL.red} center size={40} />
        {/* atomizador */}
        <svg width={300} height={420} viewBox="0 0 300 420" style={{ position: "absolute", left: 1500, top: 600, rotate: "-18deg", opacity: pop(f, fps, 2, 14) }}>
          <rect x={80} y={140} width={150} height={260} rx={30} fill="rgba(255,255,255,0.85)" stroke="#A9B3BE" strokeWidth={5} />
          <rect x={92} y={250} width={126} height={140} rx={22} fill="#F3EED9" opacity={0.9} />
          <rect x={120} y={80} width={70} height={64} rx={8} fill="#E8E8E8" stroke="#9AA3AD" strokeWidth={4} />
          <path d="M130 80 L40 70 L40 100 L130 104 Z" fill="#E8E8E8" stroke="#9AA3AD" strokeWidth={4} />
          <rect x={150} y={110} width={22} height={70} rx={8} fill="#CFD5DB" />
        </svg>
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════ 9 · una hora entera, puerta cerrada y ventana abierta
export const MwHourDoor: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const door = ease(clamp01((f - 4) / 26)), k = ease(clamp01((f - 24) / (T - 40)));
  const mins = Math.round(60 * k);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={209} dim={0.45} />
      <Hand2D seed={209}>
        <div style={{ position: "absolute", left: 220, top: 140, width: 520, height: 800, background: "#E9E2D3", borderRadius: 8, boxShadow: `0 30px 60px ${CL.shadow}`, perspective: 1400 }}>
          <div style={{ position: "absolute", inset: 0, background: "#9A6B43", border: `10px solid ${WOODD}`, transformOrigin: "0% 50%", transform: `rotateY(${-70 + 70 * door}deg)` }}>
            <div style={{ position: "absolute", right: 40, top: 390, width: 26, height: 70, borderRadius: 13, background: "#D9B26A" }} />
            <div style={{ position: "absolute", left: 120, top: 80, width: 240, height: 70, background: "#fff", borderRadius: 6, fontFamily: LABEL, fontWeight: 700, fontSize: 30, color: CL.navy, display: "flex", alignItems: "center", justifyContent: "center" }}>NO PASAR</div>
          </div>
        </div>
        <svg width={620} height={620} viewBox="0 0 620 620" style={{ position: "absolute", left: 900, top: 160 }}>
          <circle cx={310} cy={310} r={280} fill="#fff" stroke={CL.navy} strokeWidth={14} />
          <path d={`M310 310 L310 30 A280 280 0 ${k > 0.5 ? 1 : 0} 1 ${310 + 280 * Math.sin(k * 2 * Math.PI)} ${310 - 280 * Math.cos(k * 2 * Math.PI)} Z`} fill={hexA(CL.yellow, 0.55)} />
          {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={310 + 240 * Math.sin(i * Math.PI / 6)} y1={310 - 240 * Math.cos(i * Math.PI / 6)} x2={310 + 266 * Math.sin(i * Math.PI / 6)} y2={310 - 266 * Math.cos(i * Math.PI / 6)} stroke={CL.navy} strokeWidth={8} />)}
          <line x1={310} y1={310} x2={310 + 220 * Math.sin(k * 2 * Math.PI)} y2={310 - 220 * Math.cos(k * 2 * Math.PI)} stroke={CL.red} strokeWidth={12} strokeLinecap="round" />
          <circle cx={310} cy={310} r={16} fill={CL.navy} />
        </svg>
        <div style={{ position: "absolute", left: 1560, top: 300, fontFamily: SERIF, fontWeight: 900, fontSize: 170, color: CL.navy, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{mins}<span style={{ fontSize: 60 }}> min</span></div>
        <Hand x={1000} y={830} text="una hora entera · no lo toque" k={lin(f, 30, 46)} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════ 10 · el agua oxigenada burbujea
export const MwFizz: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const k = clamp01((f - 10) / (T - 24)), tt = f / fps;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={210} dim={0.5} />
      <Hand2D seed={210}>
        <div style={{ position: "absolute", left: 160, top: 160, width: 1000, height: 760, background: WALL, borderRadius: 20, overflow: "hidden", boxShadow: `0 30px 60px ${CL.shadow}` }}>
          <svg width={1000} height={760} viewBox="0 0 1000 760">
            <Spots x={180} y={160} w={640} h={460} k={1} n={220} seed={31} color={`rgb(${35 + 90 * k},${37 + 90 * k},${30 + 90 * k})`} />
            {Array.from({ length: 70 }).map((_, i) => { const s = (tt * (0.5 + rnd(i) * 0.6) + rnd(i + 3)) % 1; const x = 200 + rnd(i + 7) * 600, y = 600 - rnd(i + 11) * 420 - s * 30; return <circle key={i} cx={x} cy={y} r={4 + rnd(i + 5) * 9 * (1 - s)} fill="rgba(255,255,255,0.9)" stroke="#B8C6D0" strokeWidth={2} opacity={(1 - s) * clamp01(k * 4)} />; })}
          </svg>
        </div>
        <svg width={360} height={600} viewBox="0 0 360 600" style={{ position: "absolute", left: 1260, top: 230, opacity: pop(f, fps, 2, 14) }}>
          <rect x={90} y={150} width={180} height={420} rx={36} fill={CL.brown} />
          <rect x={130} y={80} width={100} height={80} rx={12} fill="#F4F1EA" stroke="#C9C2B4" strokeWidth={4} />
          <rect x={110} y={280} width={140} height={180} rx={10} fill="#FBFAF6" />
          <text x={180} y={360} textAnchor="middle" fontFamily="Arial" fontWeight={800} fontSize={54} fill={CL.navy}>3 %</text>
          <text x={180} y={420} textAnchor="middle" fontFamily="Arial" fontWeight={700} fontSize={30} fill={CL.inkSoft}>10 vol.</text>
        </svg>
        <Tag x={1440} y={900} text={`${Math.round(10 + 5 * k)} minutos · está trabajando`} k={lin(f, 16, 30)} center size={40} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════ 11 · un producto por día
export const MwOneADay: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8);
  const d1 = pop(f, fps, 2, 13), d2 = pop(f, fps, 14, 13), cl = pop(f, fps, 32, 12), x = lin(f, 42, 54);
  const Day: React.FC<{ n: number; t: string; c: string; p: number; left: number }> = ({ n, t, c, p, left }) => (
    <div style={{ position: "absolute", left, top: 180, width: 460, height: 560, background: "#fff", borderRadius: 16, boxShadow: `0 20px 40px ${CL.shadow}`, overflow: "hidden", opacity: p, scale: String(0.8 + 0.2 * p) }}>
      <div style={{ height: 110, background: CL.navy, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 50, display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: 3 }}>DÍA {n}</div>
      <div style={{ margin: "70px auto 0", width: 160, height: 260, borderRadius: 30, background: c, boxShadow: `inset 0 -20px 0 rgba(0,0,0,0.12)` }} />
      <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 52, color: CL.ink, textAlign: "center", marginTop: 30 }}>{t}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={211} dim={0.5} />
      <Hand2D seed={211}>
        <Day n={1} t="vinagre" c="rgba(245,240,215,0.95)" p={d1} left={180} />
        <Day n={2} t="agua oxigenada" c={CL.brown} p={d2} left={720} />
        <div style={{ position: "absolute", left: 1300, top: 220, width: 440, height: 480, opacity: cl, scale: String(0.8 + 0.2 * cl) }}>
          <div style={{ margin: "40px auto 0", width: 200, height: 300, borderRadius: 30, background: "#F4F6F8", border: "6px solid #BFC7CF" }} />
          <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 52, color: CL.ink, textAlign: "center", marginTop: 20 }}>cloro</div>
          <div style={{ position: "absolute", left: 60, top: 40 }}><Tick ok={false} s={320} k={x} /></div>
        </div>
        <Tag x={960} y={880} text="nunca juntos · un producto por día" k={x} color={CL.red} center />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════ 12 · bicarbonato para la sombra
export const MwShadowLift: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const spoon = ease(clamp01((f - 4) / 24)), wipe = ease(clamp01((f - 34) / (T - 50)));
  const sx = 600 + 700 * wipe, sy = 560 + Math.sin(wipe * Math.PI * 6) * 90;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out, background: WALL }}>
      <Hand2D seed={212}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          <rect width={1920} height={1080} fill={WALL} />
          <defs><clipPath id="mws_c"><rect x={sx} y={0} width={1920} height={1080} /></clipPath><radialGradient id="mws_g"><stop offset="0" stopColor="#8F8C82" stopOpacity="0.7" /><stop offset="1" stopColor="#8F8C82" stopOpacity="0" /></radialGradient></defs>
          <g clipPath="url(#mws_c)"><ellipse cx={950} cy={560} rx={420} ry={300} fill="url(#mws_g)" /></g>
          {/* vaso con agua y una cucharada */}
          <g transform="translate(180 520)">
            <path d="M0 0 L200 0 L180 300 L20 300 Z" fill="rgba(210,230,240,0.55)" stroke="#9FB3C2" strokeWidth={5} />
            <path d="M12 80 L188 80 L180 300 L20 300 Z" fill="rgba(235,240,245,0.85)" />
            {Array.from({ length: 30 }).map((_, i) => <circle key={i} cx={30 + rnd(i) * 140} cy={300 - rnd(i + 3) * 200 * spoon} r={3} fill="#fff" opacity={spoon} />)}
            <g transform={`translate(${120 - 60 * spoon} ${-160 + 150 * spoon}) rotate(${-40 + 30 * spoon})`}><ellipse cx={0} cy={0} rx={34} ry={20} fill="#C9CED3" /><rect x={20} y={-6} width={150} height={12} rx={6} fill="#C9CED3" /><ellipse cx={0} cy={-6} rx={26} ry={10} fill="#fff" opacity={1 - spoon} /></g>
          </g>
          {/* esponja */}
          <g transform={`translate(${sx - 90} ${sy - 60})`} opacity={wipe > 0.001 ? 1 : 0}><rect width={180} height={120} rx={18} fill="#F2C230" /><rect y={84} width={180} height={36} rx={10} fill="#4C9A5A" /></g>
        </svg>
        <Tag x={260} y={430} text="1 cucharada · 1 vaso" k={spoon} />
        <Tag x={1100} y={960} text="frote despacio · no raya" k={lin(f, 40, 56)} center />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════ 13 · el triángulo del moho
export const MwTriangle: React.FC<{ cut?: boolean; bed?: string }> = ({ cut = false, bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8);
  const v = [0, 1, 2].map((i) => pop(f, fps, 4 + i * 12, 13));
  const c = cut ? ease(clamp01((f - 44) / 22)) : 0;
  const P = [[960, 170], [520, 880], [1400, 880]];
  const L = ["humedad", "poco aire", "oscuridad"];
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={213} dim={0.5} />
      <Hand2D seed={213}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
          <path d={`M${P[0][0]} ${P[0][1]} L${P[1][0]} ${P[1][1]} L${P[2][0]} ${P[2][1]} Z`} fill={hexA(MOLD, 0.12 * (1 - c))} stroke={CL.navy} strokeWidth={12} strokeLinejoin="round" strokeDasharray={2600} strokeDashoffset={2600 * (1 - v[2])} opacity={1 - c * 0.7} />
          <Spots x={760} y={560} w={400} h={260} k={1 - c} n={120} seed={41} />
        </svg>
        {L.map((t, i) => <Tag key={i} x={P[i][0]} y={P[i][1] + (i === 0 ? -50 : 70)} text={t} k={v[i]} center color={i === 0 && cut ? CL.red : CL.navy} />)}
        {cut ? <Hand x={1300} y={300} text="sin humedad, no prende" k={c} size={62} w={560} /> : null}
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════ 14 · el dorso de la mano
export const MwBackHand: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8);
  const a = pop(f, fps, 2, 13), b = pop(f, fps, 30, 13);
  const Panel: React.FC<{ left: number; p: number; cold: boolean }> = ({ left, p, cold }) => (
    <div style={{ position: "absolute", left, top: 160, width: 760, height: 720, borderRadius: 20, overflow: "hidden", opacity: p, scale: String(0.85 + 0.15 * p), background: cold ? "#DCE6EE" : "#F3E7D6", boxShadow: `0 30px 60px ${CL.shadow}` }}>
      <svg width={760} height={720} viewBox="0 0 760 720">
        {cold ? Array.from({ length: 40 }).map((_, i) => <ellipse key={i} cx={60 + rnd(i) * 640} cy={60 + rnd(i + 2) * 600} rx={5} ry={8} fill="#9FC0DC" opacity={0.8} />) : null}
        <path d="M250 640 L250 420 Q250 330 330 320 L470 310 Q560 300 570 380 L580 640 Z" fill={cold ? "#E9C9AE" : "#E7BF9C"} stroke="#B88C6A" strokeWidth={5} />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={286 + i * 72} y={170 + (i === 0 || i === 3 ? 40 : 0)} width={64} height={190} rx={32} fill={cold ? "#E9C9AE" : "#E7BF9C"} stroke="#B88C6A" strokeWidth={5} />)}
        <path d="M300 420 Q410 400 520 420" stroke="#C99B78" strokeWidth={5} fill="none" />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 30, textAlign: "center", fontFamily: SERIF, fontWeight: 800, fontSize: 56, color: cold ? COLD : "#B5621E" }}>{cold ? "fría y pegajosa" : "tibia y suave"}</div>
      <div style={{ position: "absolute", right: 30, top: 30 }}><Tick ok={!cold} s={110} k={lin(f, cold ? 16 : 44, cold ? 28 : 56)} /></div>
    </div>
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={214} dim={0.5} />
      <Hand2D seed={214}>
        <Panel left={150} p={a} cold />
        <Panel left={1010} p={b} cold={false} />
        <Tag x={530} y={950} text="todavía no" k={lin(f, 16, 28)} center color={COLD} />
        <Tag x={1390} y={950} text="seca · sí" k={lin(f, 44, 56)} center color={OK} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════ 15 · pintura encima del moho vivo = ampollas · el orden
export const MwBlister: React.FC<{ stage?: number; bed?: string }> = ({ stage = 0, bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const paint = lin(f, 6, 30), bl = lin(f, 34, T - 14);
  const steps = ["matar", "secar", "pintar"];
  if (stage) return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={216} dim={0.5} />
      <Hand2D seed={216}>
        {steps.map((t, i) => { const p = pop(f, fps, 4 + i * 14, 13); return (
          <div key={i} style={{ position: "absolute", left: 180 + i * 560, top: 330, width: 460, height: 400, borderRadius: 24, background: "#fff", boxShadow: `0 24px 48px ${CL.shadow}`, opacity: p, scale: String(0.8 + 0.2 * p), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 160, color: i === 2 ? CL.brass : CL.navy, lineHeight: 1 }}>{i + 1}</div>
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 64, letterSpacing: 4, color: CL.ink, textTransform: "uppercase" }}>{t}</div>
          </div>); })}
        {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 660 + i * 560, top: 500, fontSize: 90, color: CL.navy, opacity: lin(f, 18 + i * 14, 26 + i * 14) }}>→</div>)}
        <Tag x={960} y={860} text="pintar no es limpiar" k={lin(f, 44, 58)} center color={CL.red} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out, background: WALL }}>
      <Hand2D seed={215}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          <rect width={1920} height={1080} fill={WALL} />
          <Spots x={460} y={260} w={1000} h={560} k={1} n={300} seed={51} />
          <rect x={0} y={0} width={1920 * paint} height={1080} fill="#F6F3EC" opacity={0.88} />
          {Array.from({ length: 16 }).map((_, i) => { const x = 520 + rnd(i) * 880, y = 300 + rnd(i + 4) * 480, r = 26 + rnd(i + 8) * 50; const a = clamp01(bl * 1.6 - rnd(i + 2) * 0.6); return a > 0 ? <g key={i}><ellipse cx={x + r * 0.18 * a} cy={y + r * 0.22 * a} rx={r * a} ry={r * 0.8 * a} fill="rgba(70,60,45,0.28)" /><ellipse cx={x} cy={y} rx={r * a} ry={r * 0.8 * a} fill="#EFE9DC" stroke="#9C927E" strokeWidth={5} /><circle cx={x + r * 0.15 * a} cy={y + r * 0.1 * a} r={r * 0.32 * a} fill="#3A372F" opacity={0.55} /><ellipse cx={x - r * 0.35 * a} cy={y - r * 0.32 * a} rx={r * 0.28 * a} ry={r * 0.16 * a} fill="#fff" /></g> : null; })}
        </svg>
        <Tag x={960} y={150} text="el moho sigue abajo, comiendo" k={lin(f, 34, 48)} center color={CL.red} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════ 16 · el aliento: un vaso de agua por persona y por noche
export const MwBreathGlass: React.FC<{ two?: boolean; bed?: string }> = ({ two = false, bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const k = ease(clamp01((f - 8) / (T * 0.6))), drift = lin(f, T * 0.55, T - 8), tt = f / fps;
  const n = two ? 2 : 1;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out, background: "#24314F" }}>
      <Hand2D seed={217}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          <rect width={1920} height={1080} fill="#2A3858" />
          <rect x={1640} y={0} width={280} height={1080} fill={hexA(COLD, 0.55 + 0.25 * drift)} />
          <rect x={160} y={640} width={1100} height={180} rx={20} fill="#E8E1D2" /><rect x={160} y={600} width={1100} height={70} rx={20} fill="#C9B79A" />
          <rect x={120} y={520} width={60} height={360} rx={12} fill={WOOD} />
          {Array.from({ length: n }).map((_, i) => (<g key={i} transform={`translate(${260 + i * 360} 0)`}>
            <ellipse cx={80} cy={590} rx={70} ry={50} fill="#F1D6BC" /><path d="M150 610 Q400 560 640 620 L640 660 L150 660 Z" fill="#9CB2D6" />
            {Array.from({ length: 6 }).map((_, j) => { const s = (tt * 0.35 + j / 6) % 1; const x = 120 + s * (1500 - i * 360) * (0.3 + 0.7 * drift), y = 540 - s * 260 + Math.sin(s * 9 + j) * 30; return <circle key={j} cx={x} cy={y} r={18 + s * 30} fill="#DCE8F5" opacity={(1 - s) * 0.55} />; })}
          </g>))}
          {Array.from({ length: n }).map((_, i) => (<g key={i} transform={`translate(${1340 - i * 230} 220)`}>
            <path d="M0 0 L160 0 L145 260 L15 260 Z" fill="rgba(220,235,245,0.25)" stroke="#BFD3E6" strokeWidth={5} />
            <path d={`M${15 + 0} ${260 - 250 * k} L${145 + 0} ${260 - 250 * k} L145 260 L15 260 Z`} fill="rgba(127,179,227,0.85)" />
          </g>))}
          {drift > 0 ? Array.from({ length: 30 }).map((_, i) => <ellipse key={i} cx={1660 + rnd(i) * 240} cy={100 + rnd(i + 3) * 880} rx={6} ry={9} fill="#CFE2F3" opacity={drift * 0.9} />) : null}
        </svg>
        <Tag x={1180} y={140} text={two ? "dos personas · dos vasos" : "una noche = un vaso de agua"} k={lin(f, 16, 30)} center />
        <Tag x={1780} y={980} text="pared fría" k={drift} center color={COLD} size={36} />
      </Hand2D>
    </AbsoluteFill>
  );
};

// ═════════════ 17 · la prueba del vaso frío
export const MwIceTest: React.FC<{ south?: boolean; bed?: string }> = ({ south = false, bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const k = clamp01((f - 8) / (T - 24)), mins = Math.round(10 * k), tt = f / fps;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={218} dim={0.5} />
      <Hand2D seed={218}>
        <div style={{ position: "absolute", left: 120, top: 120, width: 960, height: 840, background: south ? "#D6E1EA" : WALL, borderRadius: 18, boxShadow: `0 30px 60px ${CL.shadow}` }} />
        <svg width={600} height={760} viewBox="0 0 600 760" style={{ position: "absolute", left: 340, top: 170 }}>
          <path d="M100 80 L500 80 L460 700 L140 700 Z" fill="rgba(225,238,247,0.55)" stroke="#9FB3C2" strokeWidth={6} />
          <path d="M112 200 L488 200 L460 700 L140 700 Z" fill="rgba(190,220,240,0.6)" />
          {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={160 + (i % 3) * 100 + rnd(i) * 20} y={210 + Math.floor(i / 3) * 110 + Math.sin(tt + i) * 4} width={90} height={90} rx={14} fill="rgba(255,255,255,0.85)" stroke="#CFE0EC" strokeWidth={4} transform={`rotate(${rnd(i + 3) * 30 - 15} ${200 + i * 60} 260)`} />)}
          {Array.from({ length: 34 }).map((_, i) => { const a = clamp01(k * 2 - rnd(i) * 0.8); const run = clamp01(k * 2.5 - 1 - rnd(i + 1) * 0.6); const x = 130 + rnd(i + 2) * 340; const y = 120 + rnd(i + 4) * 480 + run * 160; return a > 0 ? <g key={i}><ellipse cx={x} cy={y} rx={7 * a} ry={10 * a} fill="#E8F3FB" stroke="#9CC0DA" strokeWidth={2} />{run > 0 ? <line x1={x} y1={y - run * 160} x2={x} y2={y} stroke="#B9D6EA" strokeWidth={5} opacity={0.7} /> : null}</g> : null; })}
        </svg>
        <div style={{ position: "absolute", left: 1180, top: 220, fontFamily: SERIF, fontWeight: 900, fontSize: 190, color: CL.navy, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{mins}<span style={{ fontSize: 70 }}> min</span></div>
        <Hand x={1190} y={460} text={south ? "pared al sur: sin sol, más fría" : "mojado por fuera = mucha humedad"} k={lin(f, 30, 46)} w={640} />
        {south ? <Tag x={1450} y={820} text="ahí se pega el vapor" k={lin(f, 46, 60)} center color={COLD} /> : null}
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════ 18 · la planta vista de arriba: pegado vs 5 cm
export const MwGapPlan: React.FC<{ gap?: boolean; bed?: string }> = ({ gap = false, bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const g = gap ? ease(clamp01((f - 6) / 30)) : 0, tt = f / fps;
  const wx = 300 + 70 * g; // el ropero se separa
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out, background: "#F5F1E8" }}>
      <Hand2D seed={219}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          <defs><pattern id="mwg_grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0 L0 0 0 60" fill="none" stroke="#E4DCCB" strokeWidth={2} /></pattern></defs>
          <rect width={1920} height={1080} fill="url(#mwg_grid)" />
          <rect x={200} y={120} width={100} height={840} fill={gap ? "#C9B79A" : hexA(COLD, 0.85)} />
          <text x={250} y={1010} textAnchor="middle" fontFamily="Arial" fontWeight={700} fontSize={34} fill={CL.inkSoft}>PARED A LA CALLE</text>
          {!gap ? <Spots x={300} y={260} w={40} h={560} k={1} n={80} seed={61} /> : null}
          <rect x={wx} y={240} width={360} height={600} rx={10} fill={WOOD} stroke={WOODD} strokeWidth={8} />
          <text x={wx + 180} y={556} textAnchor="middle" fontFamily="Arial" fontWeight={800} fontSize={46} fill="#F3E7D6">ROPERO</text>
          {gap ? Array.from({ length: 6 }).map((_, i) => { const s = (tt * 0.45 + i / 6) % 1; const y = 960 - s * 900; return <path key={i} d={`M${334} ${y} l -14 26 l 28 0 Z`} fill={OK} opacity={g * (1 - Math.abs(s - 0.5) * 1.6)} />; }) : null}
          {Array.from({ length: 5 }).map((_, i) => { const s = (tt * 0.3 + i / 5) % 1; return <path key={i} d={`M${1700 - s * 900} ${260 + i * 140} q -40 -20 -80 0`} stroke={gap ? OK : "#9AA3AD"} strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.7 * (1 - s)} />; })}
          {gap ? <g opacity={lin(f, 30, 44)}><line x1={300} y1={200} x2={wx} y2={200} stroke={CL.red} strokeWidth={6} /><line x1={300} y1={180} x2={300} y2={220} stroke={CL.red} strokeWidth={6} /><line x1={wx} y1={180} x2={wx} y2={220} stroke={CL.red} strokeWidth={6} /></g> : null}
        </svg>
        {gap ? <Tag x={335} y={140} text="5 cm" k={lin(f, 30, 44)} color={CL.red} center /> : <Tag x={420} y={140} text="cámara oscura, fría y quieta" k={lin(f, 10, 24)} />}
        <Hand x={1120} y={120} text={gap ? "el aire pasa por detrás · la pared se seca" : "el calor de la pieza no llega"} k={lin(f, 20, 36)} w={720} size={58} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════ 19 · cuánto es 5 cm
export const MwFiveCm: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8);
  const r = pop(f, fps, 2, 14), fi = pop(f, fps, 18, 13), mb = pop(f, fps, 38, 13);
  const U = 120; // 1 cm = 120 px
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={220} dim={0.5} />
      <Hand2D seed={220}>
        <div style={{ position: "absolute", left: 560, top: 150, width: 6 * U + 40, height: 150, background: "#F2D27A", borderRadius: 10, boxShadow: `0 16px 30px ${CL.shadow}`, opacity: r, translate: `0 ${(1 - r) * -80}px` }}>
          {Array.from({ length: 61 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 20 + i * U / 10, top: 0, width: 3, height: i % 10 === 0 ? 70 : i % 5 === 0 ? 48 : 28, background: CL.ink }} />)}
          {Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 20 + i * U - 12, top: 80, fontFamily: LABEL, fontWeight: 700, fontSize: 38, color: CL.ink }}>{i}</div>)}
          <div style={{ position: "absolute", left: 20, top: -14, width: 5 * U, height: 178, border: `6px solid ${CL.red}`, borderRadius: 8, opacity: lin(f, 10, 20) }} />
        </div>
        <svg width={700} height={420} viewBox="0 0 700 420" style={{ position: "absolute", left: 540, top: 360, opacity: fi }}>
          {[0, 1, 2].map((i) => <rect key={i} x={20 + i * (U * 1.9)} y={40} width={i === 2 ? U * 0.95 : U * 1.9 - 10} height={330} rx={i === 2 ? 40 : 90} fill="#E7BF9C" stroke="#B88C6A" strokeWidth={5} />)}
        </svg>
        <Hand x={1300} y={420} text="dos dedos y medio" k={fi} w={560} />
        <div style={{ position: "absolute", left: 560, top: 820, width: 5 * U, height: 150, opacity: mb, scale: String(0.8 + 0.2 * mb), background: "#C9483A", borderRadius: 10, boxShadow: `0 16px 30px ${CL.shadow}`, border: "8px solid #F1E3C6" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 46, height: "100%", background: "#5B3A2A" }} />
        </div>
        <Hand x={1300} y={860} text="o una caja de fósforos" k={mb} w={560} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════ 20 · el metro cuadrado
export const MwSquareMeter: React.FC<{ causes?: boolean; bed?: string }> = ({ causes = false, bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8);
  const sq = lin(f, 4, 30), small = pop(f, fps, 22, 13), big = pop(f, fps, 40, 13);
  const C = ["un caño que pierde", "filtración de la terraza", "viga fría · puente térmico"];
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={221} dim={0.5} />
      <Hand2D seed={221}>
        <div style={{ position: "absolute", left: 140, top: 140, width: 1060, height: 800, background: WALL, borderRadius: 18, boxShadow: `0 30px 60px ${CL.shadow}` }} />
        <svg width={1060} height={800} viewBox="0 0 1060 800" style={{ position: "absolute", left: 140, top: 140 }}>
          <rect x={230} y={100} width={600} height={600} fill="none" stroke={CL.navy} strokeWidth={8} strokeDasharray={2400} strokeDashoffset={2400 * (1 - sq)} />
          <text x={530} y={80} textAnchor="middle" fontFamily="Arial" fontWeight={800} fontSize={44} fill={CL.navy} opacity={sq}>1 m × 1 m</text>
          <g opacity={causes ? 0.3 : 1}><Spots x={300} y={420} w={220} h={220} k={small} n={90} seed={71} /></g>
          {causes ? <Spots x={150} y={60} w={800} h={700} k={big} n={380} seed={72} /> : null}
        </svg>
        {!causes ? (<>
          <Tag x={1560} y={380} text="más chica: la limpia usted" k={small} color={OK} center size={34} />
          <Tag x={1560} y={540} text="más grande o vuelve: profesional" k={lin(f, 44, 58)} color={CL.red} center size={32} />
        </>) : C.map((t, i) => { const p = pop(f, fps, 30 + i * 12, 13); return <div key={i} style={{ position: "absolute", left: 1270, top: 260 + i * 190, opacity: p, translate: `${(1 - p) * 80}px 0`, background: "#fff", borderRadius: 16, padding: "26px 34px", fontFamily: SERIF, fontWeight: 800, fontSize: 48, color: CL.ink, boxShadow: `0 16px 30px ${CL.shadow}`, borderLeft: `12px solid ${CL.red}` }}>{t}</div>; })}
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════ 21 · la rutina de la mañana
export const MwMorning: React.FC<{ hi?: number; bed?: string }> = ({ hi = 0, bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8);
  const S = ["ventana de par en par · 10 min", "secar los vidrios y el marco", "nada de ropa secándose adentro", "abrir el ropero una vez por semana"];
  const p = pop(f, fps, 0, 14);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={222} dim={0.5} />
      <Hand2D seed={222}>
        <div style={{ position: "absolute", left: 300, top: 110, width: 1320, height: 860, background: "#FBF8EF", borderRadius: 14, boxShadow: `0 30px 60px ${CL.shadow}`, rotate: "-1.2deg", scale: String(0.9 + 0.1 * p), opacity: p }}>
          <div style={{ height: 130, background: CL.navy, borderRadius: "14px 14px 0 0", color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 54, letterSpacing: 3, display: "flex", alignItems: "center", paddingLeft: 60 }}>CADA MAÑANA DE INVIERNO · 10 MIN</div>
          {S.map((t, i) => { const on = hi === 0 || i + 1 === hi; const k = lin(f, 8 + i * 8, 16 + i * 8); return (
            <div key={i} style={{ position: "absolute", left: 70, top: 190 + i * 160, display: "flex", alignItems: "center", gap: 36, opacity: k * (on ? 1 : 0.35) }}>
              <div style={{ width: 96, height: 96, borderRadius: 48, background: i + 1 === hi ? CL.yellow : CL.navySoft, fontFamily: SERIF, fontWeight: 900, fontSize: 60, color: CL.navy, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
              <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 66, color: CL.ink }}>{t}</span>
            </div>); })}
        </div>
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════ 22 · los cinco errores
export const MwFiveErrors: React.FC<{ hi?: number; bed?: string }> = ({ hi = 1, bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8);
  const E = ["cloro en la pared pintada", "rociar y limpiar enseguida", "mezclar productos", "pintar encima del moho vivo", "pegar el ropero otra vez"];
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={223} dim={0.5} />
      <Hand2D seed={223}>
        {E.map((t, i) => { const on = i + 1 === hi, done = i + 1 < hi; const flip = on ? ease(clamp01((f - 6) / 16)) : done ? 1 : 0; return (
          <div key={i} style={{ position: "absolute", left: 220, top: 110 + i * 175, width: 1480, height: 150, perspective: 1400, opacity: i + 1 <= hi ? 1 : 0.28 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 16, background: on ? "#fff" : "#F1ECE2", boxShadow: on ? `0 18px 40px ${CL.shadow}` : "none", transform: `rotateX(${(1 - flip) * 90 * (on ? 1 : 0)}deg)`, display: "flex", alignItems: "center", gap: 40, paddingLeft: 40, borderLeft: `14px solid ${i + 1 <= hi ? CL.red : CL.grout}` }}>
              <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 80, color: CL.red, width: 70 }}>{i + 1}</span>
              <span style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 64, color: CL.ink }}>{t}</span>
              {i + 1 <= hi ? <div style={{ marginLeft: "auto", marginRight: 40 }}><Tick ok={false} s={80} k={on ? lin(f, 14, 26) : 1} /></div> : null}
            </div>
          </div>); })}
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════ 23 · el ropero con patitas
export const MwLegs: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8);
  const up = ease(clamp01((f - 6) / 24)), tt = f / fps, side = lin(f, 44, 60);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out, background: "#F5F1E8" }}>
      <Hand2D seed={224}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          <rect width={1920} height={1080} fill="#F2ECE1" />
          <rect x={0} y={900} width={1920} height={180} fill="#B9A58A" />
          <rect x={0} y={60} width={110} height={840} fill={hexA(WARM, 0.35 + 0.4 * side)} />
          <rect x={1810} y={60} width={110} height={840} fill={hexA(COLD, 0.35 + 0.4 * side)} />
          <g transform={`translate(0 ${-36 * up})`}>
            <rect x={140} y={220} width={640} height={680} rx={10} fill={WOOD} stroke={WOODD} strokeWidth={8} />
            {[170, 720].map((x) => <rect key={x} x={x} y={900} width={30} height={36 * up + 2} fill="#3A2A1C" />)}
          </g>
          {Array.from({ length: 4 }).map((_, i) => { const s = (tt * 0.5 + i / 4) % 1; return <path key={i} d={`M${820 - s * 700} ${884 - 0} l 26 -12 l 0 24 Z`} fill={OK} opacity={up * (1 - s)} />; })}
          {Array.from({ length: 4 }).map((_, i) => { const s = (tt * 0.5 + i / 4) % 1; return <path key={i} d={`M${140 + s * 700} ${180} l -26 -12 l 0 24 Z`} fill={OK} opacity={up * (1 - s)} />; })}
        </svg>
        <Tag x={460} y={960} text="2-3 cm del piso" k={lin(f, 20, 34)} center />
        <Tag x={200} y={110} text="pared del pasillo · tibia" k={side} color={WARM} />
        <Tag x={1220} y={110} text="pared de la calle · fría" k={side} color={COLD} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════ 24 · repaso: diez azulejos que se limpian
export const MwRecap10: React.FC<{ upto?: number; bed?: string }> = ({ upto = 10, bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const L = ["el cloro no llega", "mascarilla y ventana", "vinagre · 1 hora", "agua oxigenada · 15 min", "bicarbonato", "secar y ventilar", "antihongos: después", "el vaso frío", "5 cm del mueble", "1 m²: profesional"];
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={225} dim={0.5} />
      <Hand2D seed={225}>
        {L.map((t, i) => { const col = i % 5, row = Math.floor(i / 5); const at = (i / 10) * (T - 30); const c = ease(clamp01((f - at) / 14)); const vis = i < upto ? 1 : 0.25; return (
          <div key={i} style={{ position: "absolute", left: 120 + col * 340, top: 170 + row * 400, width: 310, height: 360, borderRadius: 14, overflow: "hidden", background: "#fff", boxShadow: `0 16px 30px ${CL.shadow}`, opacity: vis }}>
            <svg width={310} height={240} viewBox="0 0 310 240"><rect width={310} height={240} fill={WALL} /><g opacity={1 - c}><Spots x={30} y={30} w={250} h={190} k={1} n={60} seed={80 + i} /></g></svg>
            <div style={{ position: "absolute", left: 16, top: 14, fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: i === 8 ? CL.red : CL.navy }}>{i + 1}</div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 246, padding: "0 14px", textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 34, lineHeight: 1.1, color: CL.ink, opacity: c }}>{t}</div>
          </div>); })}
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};
