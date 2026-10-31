// ctr31a · componentes 0:00 → 5:40 (tanda 1). Cada uno: escenario (Stage) + el OBJETO que la idea es, llegadas de a una en su palabra.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Casa, ROOM, camPath, screenOf, PT, Pose, V3 } from "./casa";
import { Mesa, Balde, Frasco, Linterna, Trapo, CanoVidrio, Bx, drop, orbit, win } from "./mesa3d";
import { Stage, Rot, HAS, Clip } from "./base";
import { FONT, P, e, ei, spr, extrude } from "./lib";
import { plugsOn } from "./marks";

const W = 1920, H = 1080;
// cuadro de una pieza 2.5D que deriva (empuje 1 → 1,045 + deriva lenta en curva)
export const Drift: React.FC<{ t: number; a: number; children: React.ReactNode; ry?: number; amt?: number }> = ({ t, a, children, ry = 5, amt = 1 }) => (
  <AbsoluteFill style={{ transform: `perspective(2200px) translate(${14 * Math.sin((t - a) * 0.23) * amt}px, ${8 * Math.sin((t - a) * 0.19 + 1) * amt}px) rotateY(${ry * Math.sin((t - a) * 0.17) * amt}deg) scale(${1 + 0.045 * e(t, a, a + 10) * amt})` }}>{children}</AbsoluteFill>
);

// ---------- 0:00 cuadro 0 = la miniatura sin texto; la cámara entra en ella ----------
export const THUMB = true;  // cuadro 0 = la miniatura de ChatGPT sin texto (en el bucket: el tar del farm no se re-sube en un parcial)
export const Thumb0: React.FC<{ t: number; b: number }> = ({ t, b }) => {
  const k = ei(t, 0.15, b);
  return (
    <AbsoluteFill style={{ background: "#0a0c10" }}>
      {THUMB
        ? <Img src="https://whibcuyeufzlvcvbivny.supabase.co/storage/v1/object/public/thumbnails/36cb8b82-9850-4e26-8ac6-de41ea2e6020/base-ctr2026103101-1793489609040.jpg" style={{ width: "100%", height: "100%", objectFit: "cover", transformOrigin: "50% 58%", transform: `scale(${1 + 0.5 * k})`, filter: k > 0.4 ? `blur(${(k - 0.4) * 20}px)` : undefined }} />
        : <Casa t={t} cam={{ p: [0.4 - k * 0.6, 3.4 - k * 0.8, 9.6 - k * 4], l: [-0.6, FLOOR_L, -0.6], fov: 38 }} ev={{ plugs: [1, 1, 1, 1, 1] }} />}
    </AbsoluteFill>
  );
};
const FLOOR_L = 2.4;

// ---------- 0:20 LA CASA DE CRISTAL se arma desde la profundidad; el agua circula; 5 tapones rojos se encienden ----------
// wow: en «Ningún caño se tapa» la casa nace pieza por pieza; en «un poquito cada día» los tapones laten
export const CasaArma: React.FC<{ t: number; a: number; b: number; m: { poquito: number; hoy: number } }> = ({ t, a, b, m }) => {
  const cam = camPath([
    { t: a - 0.4, p: [1.0, 4.8, 15], l: [0, 2.2, -0.4], fov: 32 },
    { t: a + 5.0, ...ROOM.wide, arc: 0.6 },
    { t: m.hoy, p: [-2.6, 4.2, 8.4], l: [-0.4, 2.4, -0.5], fov: 37 },
    { t: b + 0.6, p: [-1.6, 2.2, 4.4], l: [-1.7, 0.9, -1.1], fov: 39, arc: 0.3 },
  ], 1)(t);
  const build = ei(t, a - 1.4, a + 4.2), flow = e(t, a + 4.2, a + 5.6);
  const plugs = [0, 1, 2, 3, 4].map((i) => plugsOn(t, i));
  const lab = screenOf(cam, [0, 5.75, -0.4]);
  return (
    <AbsoluteFill>
      <Casa t={t} cam={cam} ev={{ build, flow, plugs, focus: t > m.hoy ? "kitchen" : undefined, focusAmt: e(t, m.hoy, m.hoy + 1.5) }} />
      <Rot t={t} at={m.poquito} out={m.hoy - 0.4} text="UN POQUITO CADA DÍA" x={lab.x} y={Math.max(120, lab.y - 40)} size={70} />
    </AbsoluteFill>
  );
};

// ---------- 1:12 EL KIT: todo lo que vamos a usar cae sobre el trapo azul en el piso del mueble, de a uno en su palabra ----------
export const Kit: React.FC<{ t: number; a: number; b: number; m: { agua: number; det: number; balde: number; lint: number; trapo: number } }> = ({ t, a, b, m }) => {
  const cam = orbit(t, a, { p: [0.1, 1.05, 1.75], l: [-0.02, 0.14, 0], fov: 30 });
  // los objetos ya están sobre la mesada al entrar (escalonados); el nombre llega en su palabra
  const d = { agua: Math.min(m.agua, a + 0.35), det: Math.min(m.det, a + 0.8), balde: Math.min(m.balde, a + 1.25), lint: Math.min(m.lint, a + 1.7), trapo: a - 2 };
  // vapor de la llave caliente: anillos que suben (f(t))
  return (
    <Stage t={t} a={a} b={b} beam={[960, 640]}>
      <Mesa cam={cam} floor="mueble">
        {t >= d.trapo - 0.4 && <group position={[0, drop(t, d.trapo, 0.6), 0]}><Trapo p={[0, 0.006, 0.05]} s={1.25} rot={0.12} /></group>}
        {/* agua caliente de la llave = jarra de vidrio con agua humeante */}
        {t >= d.agua - 0.4 && <group position={[-0.5, drop(t, d.agua) + 0.012, -0.05]}>
          <mesh castShadow><cylinderGeometry args={[0.1, 0.09, 0.3, 40, 1, true]} /><meshPhysicalMaterial color="#eaf6fb" transmission={0.9} roughness={0.03} thickness={0.02} transparent opacity={0.5} side={2} /></mesh>
          <mesh position={[0, -0.03, 0]}><cylinderGeometry args={[0.094, 0.088, 0.22, 40]} /><meshPhysicalMaterial color="#cfe9f4" transmission={0.7} roughness={0.05} transparent opacity={0.6} /></mesh>
          {[0, 1, 2, 3, 4].map((i) => { const ph = ((t - d.agua) * 0.5 + i / 5) % 1; return <mesh key={i} position={[Math.sin(i * 2 + t) * 0.02, 0.18 + ph * 0.45, 0]} scale={0.04 + ph * 0.06}><sphereGeometry args={[1, 12, 10]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.16 * (1 - ph) * win(t, d.agua, d.agua + 0.8)} depthWrite={false} /></mesh>; })}
        </group>}
        {/* detergente de platos: botella verde lisa, sin marca */}
        {t >= d.det - 0.4 && <group position={[-0.2, drop(t, d.det) + 0.012, 0.22]} rotation={[0, 0.4, (1 - Math.min(1, spr(t, d.det))) * 0.3]}>
          <Bx p={[0, 0.16, 0]} s={[0.12, 0.32, 0.07]} c="#3e9a5a" r={0.03} ro={0.25} />
          <mesh position={[0, 0.35, 0]} castShadow><cylinderGeometry args={[0.018, 0.026, 0.06, 20]} /><meshStandardMaterial color="#f2f2ee" roughness={0.35} /></mesh>
        </group>}
        {t >= d.balde - 0.4 && <group position={[0.38, drop(t, d.balde, 1.4) + 0.006, -0.12]}><Balde p={[0, 0, 0]} s={0.8} /></group>}
        {t >= d.lint - 0.4 && <group position={[0.1, drop(t, d.lint) + 0.03, 0.42]}><Linterna p={[0, 0, 0]} rot={[Math.PI / 2, 0, -0.9]} on={win(t, m.lint + 0.3, m.lint + 0.6)} target={[0.6, 0.02, -0.6]} /></group>}
      </Mesa>
      {/* cada nombre nace pegado a su objeto (proyectado desde la cámara que orbita), nunca en fila */}
      {([["AGUA CALIENTE", m.agua, [-0.5, 0, -0.05], 60], ["DETERGENTE", m.det, [-0.2, 0, 0.22], 60], ["UN BALDE", m.balde, [0.38, 0, -0.12], 60], ["LINTERNA", m.lint, [0.1, 0, 0.42], -90], ["UN TRAPO", m.trapo, [0.55, 0, 0.45], 60]] as [string, number, V3, number][]).map(([s, at0, q, dy]) => {
        const p = screenOf(cam, q);
        return <Rot key={s} t={t} at={at0 + 0.1} out={b - 0.35} text={s} x={p.x} y={p.y + dy} size={54} />;
      })}
    </Stage>
  );
};

// ---------- 1:44 EL FRASCO MARRÓN: la botella genérica de farmacia gira en el estante; «3 %» y «agua oxigenada» ----------
export const FrascoHero: React.FC<{ t: number; a: number; b: number; m: { tres: number; botella: number; ahora: number } }> = ({ t, a, b, m }) => {
  const cam = orbit(t, a, { p: [0.0, 0.42, 1.05], l: [0, 0.2, 0], fov: 30 }, 0.8);
  const k = Math.min(1, spr(t, a + 0.15, 0.8));
  return (
    <Stage t={t} a={a} b={b} tint="#ffcf9a" beam={[960, 600]}>
      <Mesa cam={cam} floor="madera" bloom={0.6} light={[0.8, 2.4, 1.4]}>
        <Bx p={[0, -0.012, 0]} s={[2.4, 0.03, 0.6]} c="#7a5638" ro={0.45} />
        <group position={[0, drop(t, a + 0.15, 0.9), 0]}><Frasco p={[0, 0, 0]} s={1.25} rot={(t - a) * 0.35 + (1 - k) * 2} glow={win(t, m.tres, m.tres + 0.5)} /></group>
        <group position={[0.42, 0, -0.18]} rotation={[0, 0.3, 0]}><Frasco p={[0, 0, 0]} s={0.9} level={0.4} /></group>
      </Mesa>
      <Rot t={t} at={m.tres} out={b - 0.3} text="AGUA OXIGENADA 3 %" x={W / 2} y={870} size={74} />
      <Rot t={t} at={m.botella} out={b - 0.3} text="= LA BOTELLA MARRÓN" x={W / 2} y={985} size={56} col="#ffcf9a" />
    </Stage>
  );
};

// ---------- 2:37 EL DIAL DEL AGUA: radio antigua; la aguja va a cada síntoma y la pantallita muestra ese clip ----------
const POS = ["LENTO", "GÁRGARAS", "NO BAJA", "SUBE EN\nOTRO"];
const DANG = (i: number) => -66 + 44 * i;
export const Dial: React.FC<{ t: number; a: number; b: number; m: number[]; clips: string[] }> = ({ t, a, b, m, clips }) => {
  // aguja: resorte hacia la posición del aviso vigente (-60°, -20°, 20°, 60°)
  let ang = -88; let cur = -1;
  m.forEach((x, i) => { if (t >= x) cur = i; });
  if (cur >= 0) { const prevA = cur ? DANG(cur - 1) : -88, tgt = DANG(cur); ang = prevA + (tgt - prevA) * Math.min(1.08, spr(t, m[cur], 0.7)); }
  const glow = cur >= 0 ? e(t, m[cur] + 0.15, m[cur] + 0.5) : 0;
  const wood = "linear-gradient(160deg,#6e3f22 0%,#4a2814 45%,#2d170b 100%)";
  return (
    <Stage t={t} a={a} b={b} beam={[960, 560]}>
      <Drift t={t} a={a} ry={7}>
        <div style={{ position: "absolute", left: W / 2, top: 560, transformStyle: "preserve-3d", transform: `translate(-50%,-50%) translateY(${(1 - Math.min(1, spr(t, a + 0.1, 0.8))) * 500}px) rotateX(${4 + 3 * Math.sin(t * 0.4)}deg) rotateY(${-14 + 8 * Math.sin((t - a) * 0.2)}deg)` }}>
          {/* gabinete con profundidad */}
          <div style={{ position: "relative", width: 1080, height: 620, borderRadius: "70px 70px 26px 26px", background: wood, boxShadow: "inset 0 0 0 10px #2a150a, inset 0 18px 30px rgba(255,210,160,.18), 0 60px 90px rgba(0,0,0,.65)", transformStyle: "preserve-3d" }}>
            <div style={{ position: "absolute", top: 0, right: -60, width: 60, height: "100%", background: "linear-gradient(90deg,#3a1f0f,#1e0f06)", transform: "rotateY(90deg)", transformOrigin: "left" }} />
            {/* rejilla de tela del parlante */}
            <div style={{ position: "absolute", left: 60, top: 60, width: 400, height: 380, borderRadius: 30, background: "repeating-linear-gradient(90deg,#c8b48a 0 3px,#a8936a 3px 6px), #b9a47c", boxShadow: "inset 0 0 40px rgba(0,0,0,.55)" }}>
              {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 20, right: 20, top: 90 + i * 100, height: 14, borderRadius: 7, background: "linear-gradient(180deg,#5a3219,#2c170a)" }} />)}
            </div>
            {/* pantallita con el clip del aviso */}
            <div style={{ position: "absolute", left: 520, top: 60, width: 500, height: 282, borderRadius: 18, overflow: "hidden", background: "#0b1016", boxShadow: "inset 0 0 0 8px #1a0d05, 0 0 40px rgba(140,200,255,.25)" }}>
              {m.map((x, i) => (t >= x - 0.2 && (i === m.length - 1 || t < m[i + 1] + 0.3)) ? (
                <AbsoluteFill key={i} style={{ opacity: e(t, x, x + 0.3) }}>
                  {HAS[clips[i]] ? <Clip id={clips[i]} at={x} /> : <Remolino t={t} i={i} />}
                </AbsoluteFill>) : null)}
              {/* antes del primer aviso: estática de radio vieja (nunca la pantalla apagada) */}
              {t < m[0] + 0.3 && <AbsoluteFill style={{ opacity: 1 - e(t, m[0], m[0] + 0.3), background: `repeating-linear-gradient(${(t * 37) % 8}deg,#3a4a58 0 2px,#151c24 2px 5px,#59697a 5px 6px,#10161c 6px 9px)`, backgroundPosition: `0 ${(t * 900) % 40}px`, filter: `brightness(${1 + 0.35 * Math.sin(t * 23)})` }} />}
              <AbsoluteFill style={{ background: "linear-gradient(160deg,rgba(255,255,255,.22),transparent 40%)" }} />
            </div>
            {/* ventana del dial con escala, 4 posiciones y aguja */}
            <div style={{ position: "absolute", left: 520, top: 370, width: 500, height: 190, borderRadius: "250px 250px 14px 14px", background: "radial-gradient(120% 140% at 50% 100%, #f7e7c0 0%, #e6cf98 60%, #c9ad6c 100%)", boxShadow: `inset 0 0 0 6px #8a6a2c, inset 0 0 30px rgba(120,80,20,.5), 0 0 ${60 * glow}px rgba(255,190,90,${0.5 * glow})`, overflow: "hidden" }}>
              {POS.map((p, i) => { const an = DANG(i), on = cur === i ? glow : 0; return (
                <div key={p} style={{ position: "absolute", left: 250, top: 182, width: 0, height: 0, transform: `rotate(${an}deg)` }}>
                  <div style={{ position: "absolute", left: -2, top: -118, width: 4, height: 16, background: "#4a3410" }} />
                  <div style={{ position: "absolute", left: -70, top: -172, width: 140, textAlign: "center", whiteSpace: "pre", lineHeight: 0.95, fontFamily: FONT, fontWeight: 900, fontSize: 21, color: on > 0.1 ? "#b2160c" : "#4a3410", transform: `scale(${1 + 0.18 * on})` }}>{p}</div>
                </div>); })}
              <div style={{ position: "absolute", left: 247, top: 64, width: 6, height: 122, borderRadius: 3, background: "linear-gradient(#e0261a,#8a0f08)", transformOrigin: "50% 100%", transform: `rotate(${ang}deg)`, boxShadow: "2px 2px 6px rgba(0,0,0,.4)" }} />
              <div style={{ position: "absolute", left: 232, top: 168, width: 36, height: 36, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#f1d58a,#8a6a2c)" }} />
            </div>
            {/* perillas que giran con la aguja */}
            {[160, 360].map((x, i) => <div key={x} style={{ position: "absolute", left: x, top: 470, width: 110, height: 110, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#f1d58a 0%,#a8853a 45%,#5a4214 100%)", boxShadow: "0 10px 18px rgba(0,0,0,.55), inset 0 -6px 10px rgba(0,0,0,.35)", transform: `rotate(${i ? ang * 2 : ang}deg)` }}><div style={{ position: "absolute", left: 51, top: 8, width: 8, height: 30, borderRadius: 4, background: "#3a2a0c" }} /></div>)}
          </div>
        </div>
      </Drift>
      <Rot t={t} at={a + 0.6} out={m[0] + 6} text="CUATRO AVISOS" x={W / 2} y={150} size={72} />
    </Stage>
  );
};
// sin clip: el agua en el desagüe dibujada (remolino que cambia según el aviso)
const Remolino: React.FC<{ t: number; i: number }> = ({ t, i }) => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #9aa3ab 0%, #6b737a 30%, #2b3036 31%, #151a1f 60%)" }}>
    {[0, 1, 2, 3, 4, 5].map((k) => <div key={k} style={{ position: "absolute", left: "50%", top: "50%", width: 40 + k * 34, height: 40 + k * 34, marginLeft: -(20 + k * 17), marginTop: -(20 + k * 17), borderRadius: "50%", border: `3px solid rgba(160,210,255,${0.5 - k * 0.07})`, borderLeftColor: "transparent", transform: `rotate(${t * (i === 2 ? 10 : i === 0 ? 90 : 220) * (1 - k * 0.1)}deg) scale(${i === 3 ? 1 + 0.1 * Math.sin(t * 3) : 1})` }} />)}
  </AbsoluteFill>
);

// ---------- 3:45 CTA1: el libro sale del mueble del fregadero de la casa, se abre en la p7 real; QR grande ----------
export const LibroCTA: React.FC<{ t: number; a: number; b: number; m: { abre: number; p7: number; qr: number }; page?: string; title?: string }> = ({ t, a, b, m, page = "p7", title = "EL FRASCO MARRÓN DE CLAUDIO" }) => {
  const fly = ei(t, a + 0.2, a + 2.0), open = ei(t, m.abre, m.abre + 1.1), zoom = ei(t, m.p7, m.p7 + 1.4) * (1 - ei(t, m.qr, m.qr + 1.0));
  const qr = Math.min(1, spr(t, m.qr, 0.8));
  const bx = W / 2 - 330 * qr, by = 560;
  const cam: Pose = { p: [-1.2 + fly * 0.2, 1.3 - fly * 0.4, 2.4 - fly * 1.1], l: [-1.7, 0.45, -1.0], fov: 40 };
  return (
    <AbsoluteFill>
      {/* la casa detrás: el mueble del fregadero, que se abre y de ahí sale el libro */}
      <AbsoluteFill style={{ filter: `blur(${4 + 16 * fly}px) brightness(${1 - 0.45 * fly})`, transform: `scale(${1 + 0.06 * fly})` }}><Casa t={t} cam={cam} ev={{ focus: "cabinet", focusAmt: 1, plugs: [0, 1, 2, 3, 4].map((i) => plugsOn(t, i)) }} /></AbsoluteFill>
      <div style={{ position: "absolute", left: bx, top: by, perspective: 2400, transform: `translate(-50%,-50%) scale(${(0.18 + 0.82 * fly) * (1 + 0.55 * zoom)})`, transformOrigin: "50% 50%" }}>
        <div style={{ position: "relative", width: 1080, height: 700, transformStyle: "preserve-3d", transform: `translateY(${(1 - fly) * 260}px) rotateX(${(1 - fly) * 50 + 12 - 6 * open}deg) rotateY(${(1 - fly) * -40 + 3 * Math.sin(t * 0.3)}deg) rotateZ(${(1 - fly) * 12}deg)` }}>
          {/* página derecha (la p7 real) */}
          <div style={{ position: "absolute", left: 540, top: 0, width: 540, height: 700, background: "#f6f1e6", boxShadow: "inset 18px 0 30px rgba(0,0,0,.18), 0 40px 70px rgba(0,0,0,.55)", overflow: "hidden" }}>
            <Img src={staticFile(P + "libro/" + page + ".png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          {/* tapa que se abre hacia la izquierda */}
          <div style={{ position: "absolute", left: 540, top: 0, width: 540, height: 700, transformOrigin: "0% 50%", transform: `rotateY(${-178 * open}deg)`, transformStyle: "preserve-3d" }}>
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", boxShadow: "0 40px 70px rgba(0,0,0,.55)" }}><Img src={staticFile(P + "libro/tapa.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "#f6f1e6", boxShadow: "inset -18px 0 30px rgba(0,0,0,.15)", overflow: "hidden" }}><Img src={staticFile(P + "libro/p6.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
          </div>
          {/* lomo */}
          <div style={{ position: "absolute", left: 528, top: 0, width: 24, height: 700, background: "linear-gradient(90deg,#3d2412,#6b4224,#3d2412)" }} />
        </div>
      </div>
      {/* QR grande + nombre de la guía + dónde está el link */}
      {qr > 0.01 && <div style={{ position: "absolute", left: 1290, top: 300, width: 470, opacity: Math.min(1, qr * 1.4), transform: `translateX(${(1 - qr) * 300}px) rotateY(${(1 - qr) * 30}deg)` }}>
        <div style={{ width: 420, height: 420, padding: 22, borderRadius: 26, background: "#fff", boxShadow: "0 40px 80px rgba(0,0,0,.6), 0 0 0 6px #ffb257" }}><Img src={staticFile(P + "libro/qr.png")} style={{ width: "100%", height: "100%" }} /></div>
      </div>}
      <Rot t={t} at={a + 1.2} out={b - 0.3} text={title} x={W / 2 - 330 * qr} y={110} size={64} col="#ffd9a8" />
      <Rot t={t} at={m.qr + 0.4} out={b - 0.2} text="el link está en la primera línea" x={1525} y={790} size={34} />
      <Rot t={t} at={m.qr + 0.6} out={b - 0.2} text="de la descripción" x={1525} y={836} size={34} />
    </AbsoluteFill>
  );
};

// ---------- 4:22 EL RECORRIDO: vuelo cuarto por cuarto; en cada llave abierta un caudalímetro DENTRO del caño marca cómo baja ----------
const MEDIDOR: Record<string, { q: V3; v: number; star?: boolean }> = {
  kitchen: { q: [PT.sink[0], 0.55, -1.15], v: 0.85 }, basin: { q: [PT.basin[0], PT.basin[1] - 0.4, -1.22], v: 0.35, star: true },
  shower: { q: [PT.shower[0], PT.shower[1] - 0.12, -1.1], v: 0.25, star: true }, tub: { q: [PT.tub[0], PT.tub[1] - 0.45, -1.2], v: 0.7 },
  laundry: { q: [2.25, 0.25, -1.45], v: 0.9 }, toilet: { q: [PT.toilet[0], PT.toilet[1] - 0.45, -1.3], v: 0.4, star: true },
};
export const Recorrido: React.FC<{ t: number; a: number; b: number; m: [string, number][] }> = ({ t, a, b, m }) => {
  const K = [{ t: a - 0.4, ...ROOM.wide }, ...m.flatMap(([r, x]) => [{ t: x - 0.2, ...near(ROOM[r]), arc: 0.4 }, { t: x + 2.6, ...near(ROOM[r], 0.9) }])];
  K.push({ t: b + 0.5, ...ROOM.wideHi, arc: 0.8 });
  const cam = camPath(K.sort((p, q) => p.t - q.t), 1)(t);
  let cur = -1; m.forEach(([, x], i) => { if (t >= x) cur = i; });
  const room = cur >= 0 ? m[cur][0] : "wide";
  return (
    <AbsoluteFill>
      <Casa t={t} cam={cam} ev={{ plugs: [0, 1, 2, 3, 4].map((i) => plugsOn(t, i)), focus: room, focusAmt: cur >= 0 ? e(t, m[cur][1], m[cur][1] + 0.6) : 0 }} />
      {m.map(([r, x], i) => {
        const M = MEDIDOR[r]; if (!M || t < x) return null;
        const s = screenOf(cam, M.q), fill = M.v * Math.min(1.05, spr(t, x + 0.4, 0.6)), on = e(t, x + 0.2, x + 0.5);
        const late = t > b - 2.5 ? 1 : 0; // al final quedan sólo las estrellitas (el mapa de tu casa)
        return (
          <div key={r} style={{ position: "absolute", left: s.x, top: s.y, transform: `translate(-50%,-50%) scale(${(i === cur ? 1.55 : 0.95) * on})`, opacity: on * (late && !M.star ? 0.35 : 1) }}>
            <div style={{ position: "relative", width: 86, height: 210, borderRadius: 43, background: "linear-gradient(90deg,rgba(255,255,255,.35),rgba(255,255,255,.08) 40%,rgba(255,255,255,.3))", boxShadow: "0 0 0 4px #d7dde2, 0 20px 40px rgba(0,0,0,.5)", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 6, right: 6, bottom: 6, height: `${fill * 92}%`, borderRadius: 37, background: "linear-gradient(180deg,#7fd0ff,#1f7fe0)", boxShadow: "0 0 24px #3fb2ff" }} />
              {[0.25, 0.5, 0.75].map((y) => <div key={y} style={{ position: "absolute", left: 0, width: 24, top: `${(1 - y) * 100}%`, height: 3, background: "#e6edf2" }} />)}
            </div>
            {M.star && t > x + 1.6 && <div style={{ position: "absolute", left: 60, top: -46, fontSize: 84, color: "#ffcc3a", textShadow: "0 0 24px rgba(255,190,40,.8), 0 6px 0 #a87a10", transform: `scale(${Math.min(1.15, spr(t, x + 1.6))}) rotate(${-12 + 8 * Math.sin(t)}deg)` }}>★</div>}
          </div>
        );
      })}
      <Rot t={t} at={b - 2.4} out={b} text="EL MAPA DE TU CASA" x={W / 2} y={150} size={70} />
    </AbsoluteFill>
  );
};
const near = (p: Pose, k = 1): Pose => ({ p: [p.l[0] + (p.p[0] - p.l[0]) * k * 0.95, p.l[1] + (p.p[1] - p.l[1]) * k, p.l[2] + (p.p[2] - p.l[2]) * k * 0.95], l: p.l, fov: p.fov });

// ---------- 5:12 EL CAÑO-TERMÓMETRO: el aceite baja caliente y dorado; la aguja cae; se vuelve blanco y se pega a la pared ----------
export const CanoTermo: React.FC<{ t: number; a: number; b: number; m: { frio: number; blanco: number; pega: number; atun: number } }> = ({ t, a, b, m }) => {
  const cam = orbit(t, a, { p: [0.2, 0.5, 2.4], l: [0.1, 0.32, 0], fov: 32 }, 0.8);
  const cool = e(t, m.frio, m.blanco + 0.6);              // 0 caliente → 1 frío (a lo largo del caño también)
  const wall = e(t, m.blanco, m.pega + 2.5);              // espesor de la costra pegada
  const temp = 72 - 56 * cool;
  const n = 26;
  return (
    <Stage t={t} a={a} b={b} tint="#ffd4a0">
      <Mesa cam={cam} floor="mueble" bloom={0.55}>
        <CanoVidrio p={[0, 0.32, 0]} len={2.6} r={0.13}>
          {/* gotas de aceite que viajan: doradas a la izquierda, blancas y lentas a la derecha */}
          {Array.from({ length: n }, (_, i) => {
            const u = ((i / n + (t - a) * 0.12) % 1), x = -1.25 + u * 2.5, c = Math.min(1, cool * (0.4 + u)), sp = 1 - 0.7 * c;
            return <mesh key={i} position={[x, -0.1 + 0.01 * Math.sin(i), 0.03 * Math.sin(i * 3)]} scale={[0.05 + 0.03 * sp, 0.022, 0.05]}><sphereGeometry args={[1, 16, 10]} /><meshPhysicalMaterial color={`rgb(${Math.round(230 + 20 * c)},${Math.round(160 + 85 * c)},${Math.round(40 + 200 * c)})`} roughness={0.15 + 0.6 * c} clearcoat={1 - c} emissive="#ff9a20" emissiveIntensity={0.35 * (1 - c)} /></mesh>;
          })}
          {/* la costra blanca pegada a la pared del caño (crece hacia la derecha, que está más fría) */}
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0.45, 0, 0]}><cylinderGeometry args={[0.126, 0.126, 1.6, 48, 1, true]} /><meshStandardMaterial color="#f1ece0" roughness={0.9} transparent opacity={0.92 * wall} side={2} /></mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0.45, 0, 0]}><cylinderGeometry args={[0.126 - 0.045 * wall, 0.126 - 0.045 * wall, 1.6, 48, 1, true]} /><meshStandardMaterial color="#e6dfcf" roughness={0.95} transparent opacity={0.8 * wall} side={2} /></mesh>
          {/* migas que se agarran a la costra */}
          {Array.from({ length: 18 }, (_, i) => t > m.pega + i * 0.12 && <mesh key={"c" + i} position={[-0.2 + (i % 9) * 0.17, -0.08 + 0.02 * ((i * 7) % 5), 0.06 * Math.sin(i * 2.1)]} scale={0.018 + 0.01 * (i % 3)}><dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color={i % 2 ? "#6a4a2a" : "#c9b48a"} roughness={0.9} /></mesh>)}
        </CanoVidrio>
        {/* lata de atún que se vuelca a la izquierda */}
        {t > m.atun - 0.4 && <group position={[-1.05, 0.7 + drop(t, m.atun, 0.5) * 0.4, 0.05]} rotation={[0, 0, -0.9 * win(t, m.atun + 0.3, m.atun + 1)]}>
          <mesh castShadow><cylinderGeometry args={[0.11, 0.11, 0.06, 40]} /><meshStandardMaterial color="#c8ccd0" metalness={0.95} roughness={0.25} /></mesh>
        </group>}
      </Mesa>
      {/* el termómetro arriba del caño */}
      <div style={{ position: "absolute", left: 1500, top: 330, width: 130, height: 460, transform: `translateY(${(1 - Math.min(1, spr(t, a + 0.3, 0.8))) * -300}px) rotate(${3 * Math.sin(t * 0.5)}deg)` }}>
        <div style={{ position: "absolute", left: 40, top: 0, width: 50, height: 380, borderRadius: 25, background: "linear-gradient(90deg,#f4f7f9,#cfd8de 60%,#f7fafb)", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>
          <div style={{ position: "absolute", left: 14, right: 14, bottom: 0, height: `${18 + (temp / 80) * 78}%`, borderRadius: 11, background: "linear-gradient(180deg,#ff5a3c,#c2180c)" }} />
        </div>
        <div style={{ position: "absolute", left: 22, top: 350, width: 86, height: 86, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#ff7a5c,#b0140a)", boxShadow: "0 12px 24px rgba(0,0,0,.45)" }} />
        <div style={{ position: "absolute", left: -150, top: 120, fontFamily: FONT, fontWeight: 900, fontSize: 64, color: "#fff", textShadow: extrude(5, "rgba(0,0,0,.6)") }}>{Math.round(temp)}°</div>
      </div>
      <Rot t={t} at={m.frio} out={m.blanco - 0.2} text="EL CAÑO ESTÁ FRÍO" x={W / 2 - 120} y={160} size={68} />
      <Rot t={t} at={m.blanco} out={m.atun - 0.2} text="BLANCO Y DURO" x={W / 2 - 120} y={160} size={78} col="#f1ece0" />
      <Rot t={t} at={m.atun + 0.3} out={b - 0.2} text="TAMBIÉN EL DEL ATÚN" x={W / 2 - 120} y={160} size={66} col="#ffd9a8" />
    </Stage>
  );
};
