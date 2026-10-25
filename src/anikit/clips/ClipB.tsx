// CLIP B · «What If You Could Slow Down Time?» (30 s). Paleta whatif: tarde cálida en lo cotidiano, HUD verde-agua
// cuando entra la ciencia. 2 planos: cocina (el vaso cae, el mundo se frena, él no) → destello → lab con los datos del cuerpo.
import React from "react";
import { AbsoluteFill, interpolate, useVideoConfig } from "remotion";
import { mira, useF } from "../camara";
import { Actor, estadoActor } from "../actor";
import { Escena } from "../escena";
import { Montaje } from "../montaje";
import { F_HUD, GranNumero, Globo, MarcaCorto, PanelHUD, Pildora, Temporizador, TextoMano } from "../pantalla";
import { PALETAS } from "../paletas";
import { alcanzar, huesosDe, Look, Pose } from "../personaje";
import { Vaso } from "../props";
import { Cocina, COCINA_PISO } from "../sets/cocina";
import { Lab, LAB_PISO, LAB_PUNTOS } from "../sets/lab";

const pal = PALETAS.whatif;
const ESC = 1.15;
export const LEO: Look = { estilo: "palo", camisa: "#f1ece2", manga: "corta", pantalon: "#3a4a5a", zapatos: "#f05a1f", accesorios: [{ t: "pelo", forma: "punta", color: "#17100d" }] };
const H = huesosDe("palo");
const P = COCINA_PISO;
const MESA_Y = P - 210;

// reloj del mundo: normal → ×0,03 entre 80 y 300 → normal
const LENTO = 0.03;
const reloj = (f: number) => (f < 80 ? f : f < 300 ? 80 + (f - 80) * LENTO : 80 + 220 * LENTO + (f - 300));
// el vaso: se apoya, lo roza el codo, se inclina, cae en cámara lenta, él lo atrapa y lo sube
const ATRAPA = 250;
const vasoEn = (f: number) => {
  if (f < 60) return { x: 1300, y: MESA_Y, rot: 0 };
  if (f < 80) { const u = (f - 60) / 20; return { x: 1300 + 95 * u, y: MESA_Y + 10 * u * u, rot: 60 * u }; }
  const tau = (Math.min(f, ATRAPA) < 80 ? 0 : reloj(Math.min(f, ATRAPA)) - 80);
  const caida = { x: 1395 + 6 * tau, y: MESA_Y + 10 + 5 * tau + 1.25 * tau * tau, rot: 60 + 9 * tau };
  if (f < ATRAPA) return caida;
  // atrapado: lo endereza y lo sube al pecho
  const u = interpolate(f, [ATRAPA, ATRAPA + 20, 300, 345], [0, 0.15, 0.15, 1], { extrapolateRight: "clamp" });
  return { x: caida.x + (1365 - caida.x) * u, y: caida.y + (P - 250 - caida.y) * u, rot: caida.rot * (1 - Math.min(1, (f - ATRAPA) / 14)) };
};

const LEO_ACTOR = {
  look: LEO, escala: ESC, seed: 4, luz: { lado: 1 as const, color: "#ffe0a0", fuerza: 0.9 },
  ruta: [{ f: 0, x: 1170, y: P }, { f: 96, x: 1170, y: P }, { f: 180, x: 1290, y: P }],
  dir: [{ f: 0, v: 1 as const }],
  poses: [{ f: 0, v: { hD: 60, cD: 60 } }, { f: 52, v: { hD: 95, cD: 20, tronco: 4 } }, { f: 66, v: { hD: 40, cD: 40 } }, { f: 100, v: {} }, { f: 182, v: "agacharse" }, { f: 300, v: "agacharse" }, { f: 312, v: {} }] as { f: number; v: string | Partial<Pose> }[],
  caras: [{ f: 0, v: "feliz" }, { f: 70, v: "sorpresa" }, { f: 110, v: "determinado" }, { f: 262, v: "picaro" }, { f: 320, v: "risa" }],
  miradas: [{ f: 0, v: { x: -0.4, y: 0.2 } }, { f: 70, v: { x: 0.8, y: 0.5 } }, { f: 200, v: { x: 0.7, y: 0.8 } }, { f: 320, v: { x: -0.6, y: -0.1 } }],
  habla: [[318, 346]] as [number, number][],
};

// ---------- 1 · cocina al atardecer: el vaso cae y el tiempo se frena ----------
const Cocina1: React.FC = () => {
  const f = useF();
  const { fps } = useVideoConfig();
  const v = vasoEn(f);
  // la mano derecha va al vaso desde que se agacha (IK sobre la pose base)
  const ajuste = (p: Pose, ff: number) => {
    if (ff < 205) return p;
    const s = estadoActor({ ...LEO_ACTOR }, ff, fps);
    const g = vasoEn(ff);
    const obj = { x: (g.x - s.x) / (ESC * s.dir), y: (g.y + 6 - s.y) / ESC };
    const ik = alcanzar(p, "D", obj, undefined, H);
    const w = interpolate(ff, [205, ATRAPA - 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return { ...p, hD: p.hD + ((ik.hD ?? p.hD) - p.hD) * w, cD: p.cD + ((ik.cD ?? p.cD) - p.cD) * w };
  };
  const lento = f >= 80 && f < 300;
  const onda = (f - 80) / 26; // anillo que se expande al frenarse el tiempo
  return (
    <Escena
      Set={Cocina} pal={pal} zLejos={0.85} seed={5} tiempo={reloj} mano={2}
      claves={[mira(0, 1180, 640, 1.15), mira(76, 1250, 660, 1.3), mira(150, 1310, 720, 1.75, { curva: "inout" }), mira(ATRAPA, 1350, 760, 2.15, { curva: "inout" }), mira(300, 1350, 760, 2.15), mira(370, 1260, 680, 1.45)]}
      medio={
        <>
          {f >= 80 && f < 150 && <circle cx={1170} cy={P - 220} r={60 + onda * 420} fill="none" stroke="#bff6e8" strokeWidth={10 * (1 - onda * 0.35)} opacity={Math.max(0, 0.55 - onda * 0.2)} />}
          <Actor {...LEO_ACTOR} ajuste={ajuste} />
          <Vaso x={v.x} y={v.y} rot={v.rot} lleno={0.55} />
          {/* gotas de agua suspendidas en el aire mientras el tiempo está frenado */}
          {f > 78 && f < ATRAPA + 30 && [0, 1, 2, 3, 4].map((k) => {
            const tau = reloj(Math.min(f, 300)) - 80;
            return <circle key={k} cx={1410 + k * 14 + tau * (3 + k)} cy={MESA_Y - 10 - k * 6 + tau * tau * 1.1 + k * tau} r={5 - k * 0.6} fill="#9fdcff" opacity={0.85} />;
          })}
        </>
      }
      hud={
        <>
          {/* tinte verde-agua del tiempo frenado: sólo un velo de color con opacidad (nada de filtros) */}
          <AbsoluteFill style={{ background: "#43e0b4", opacity: lento ? Math.min(0.1, (f - 80) / 120) * (f > 285 ? (300 - f) / 15 : 1) : 0 }} />
          <Temporizador seg={reloj(f) / 30} centesimas x={1600} y={56} color={lento ? pal.acento : "#f4efe4"} />
          <Pildora texto={f < 300 ? "TIME  ×  0.03" : "TIME  ×  1"} x={960} y={62} desde={86} color={pal.acento} />
          <Globo texto="Too slow, gravity." x={1220} y={420} desde={318} hasta={372} cola="abajo" tam={42} />
        </>
      }
    />
  );
};

// ---------- 2 · laboratorio: qué tendría que hacer tu cuerpo ----------
const Lab2: React.FC = () => {
  const f = useF();
  const LP = LAB_PISO;
  const barra = (v: number) => interpolate(f, [150, 210], [0, v], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Escena
      Set={Lab} pal={pal} seed={6} mano={2.5}
      claves={[mira(0, 1330, 700, 1.5), mira(160, 1380, 720, 1.4, { curva: "inout" }), mira(420, 1300, 690, 1.75, { curva: "inout" }), mira(510, 1290, 690, 1.8)]}
      medio={
        <>
          <Actor look={LEO} escala={ESC} seed={4} luz={{ lado: -1, color: pal.acento, fuerza: 0.9 }}
            ruta={[{ f: 0, x: LAB_PUNTOS.escaneo, y: LP }]} dir={[{ f: 0, v: 1 }, { f: 300, v: -1 }]}
            poses={[{ f: 0, v: "firme" }, { f: 120, v: "manosCintura" }, { f: 300, v: "pensar" }, { f: 400, v: "señalar" }]}
            caras={[{ f: 0, v: "neutral" }, { f: 120, v: "sorpresa" }, { f: 300, v: "duda" }, { f: 400, v: "determinado" }]}
            miradas={[{ f: 0, v: { x: 0.2, y: -0.3 } }, { f: 120, v: { x: 0.9, y: -0.4 } }, { f: 300, v: { x: -0.6, y: -0.6 } }]} />
        </>
      }
      hud={
        <>
          <PanelHUD titulo="REACTION TIME" x={1180} y={150} w={600} h={300} desde={24} color={pal.acento}>
            <GranNumero rotulo="NORMAL HUMAN → YOU" claves={[{ f: 0, v: 250 }, { f: 70, v: 2.5, d: 40 }]} x={300} y={64} color={pal.acento} sufijo=" ms" dec={f > 100 ? 1 : 0} tam={110} />
          </PanelHUD>
          <PanelHUD titulo="ENERGY YOUR BRAIN NEEDS" x={1180} y={480} w={600} h={330} desde={140} color="#ffc93c">
            {[["NORMAL", 1, "#e9e3d6"], ["YOU", 100, "#ffc93c"]].map(([n, v, c], i) => (
              <div key={i} style={{ position: "absolute", left: 40, top: 90 + i * 100, fontFamily: F_HUD }}>
                <div style={{ fontSize: 26, color: "#f3ead2", letterSpacing: 2 }}>{n as string}</div>
                <div style={{ width: 20 + barra(v as number) * 3.4, height: 34, borderRadius: 10, background: c as string, marginTop: 6 }} />
              </div>
            ))}
            <div style={{ position: "absolute", right: 40, top: 150, fontFamily: F_HUD, fontWeight: 600, fontSize: 56, color: "#ffc93c", opacity: f > 205 ? 1 : 0 }}>×100</div>
          </PanelHUD>
          <TextoMano texto={"…and you'd be starving\nin 3 hours."} x={140} y={720} desde={330} color={pal.acento} tam={74} vel={1.6} />
        </>
      }
    />
  );
};

export const ClipB: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Montaje planos={[{ dur: 390, el: <Cocina1 /> }, { dur: 510, el: <Lab2 />, trans: { tipo: "luz", d: 18, color: "#d8fff2" } }]} />
    <MarcaCorto />
  </AbsoluteFill>
);
