// Composiciones de QA y demo de Blanquito (sólo stills en local; el demo se rinde en el farm).
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { Stickman } from "./Stickman";
import { Camara, Camara3D, FondoEstudio, Luces, LuzEscena } from "./iluminacion";
import { POSES, NombrePose, PasoGuion } from "./acciones";
import { EXPRESIONES, LISTA_EXPRESIONES, NombreExpresion } from "./expresiones";
import { StickmanEnFondo, StickmanEnFondoProps } from "./EnFondo";

// cámara medida sobre la ref: 1 cabeza = 166 px a z = 0, eje en y = 1,9
export const CAM_REF: Camara = { pos: [0, 1.9, 10.5], mira: [0, 1.9, 0], fov: 24.9 };

// dpr 2 = supersampleo 2×2 (bordes lisos como el render de Blender; el MSAA del Chrome sin GPU no alcanza)
export const Estudio: React.FC<{ w: number; h: number; camara?: Camara; luz?: LuzEscena; fondo?: boolean; dpr?: number; children: React.ReactNode }> = ({ w, h, camara = CAM_REF, luz, fondo = true, dpr = 2, children }) => (
  <ThreeCanvas width={w} height={h} dpr={dpr} shadows="soft" gl={{ antialias: true, preserveDrawingBuffer: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace }}
    camera={{ fov: camara.fov, position: camara.pos, near: 0.5, far: 120 }}>
    <Camara3D {...camara} />
    {fondo && <FondoEstudio />}
    <Luces {...luz} />
    {children}
  </ThreeCanvas>
);

// Fase B: misma cámara, pose y cara que la ref (1376×768)
export const StickmanRef: React.FC<{ luz?: LuzEscena }> = ({ luz }) => {
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Estudio w={width} h={height} luz={luz}>
        <Stickman pose={POSES.ref} expr="feliz" cuadro={0} />
      </Estudio>
    </AbsoluteFill>
  );
};

// ⚠ Chrome tolera ~16 contextos WebGL: las grillas NO son muchos canvas. Cada comp de QA muestra UNA celda por cuadro
// (cuadro i = celda i) y la lámina se arma con _qa/lamina.py.

// Fase C: 20 expresiones en primer plano (cuadro i = expresión i)
export const LISTA_CARAS = (LISTA_EXPRESIONES.filter((n) => !["espantado", "bostezo", "hablando"].includes(n)) as NombreExpresion[]).slice(0, 20);
export const StickmanCaras: React.FC = () => {
  const { width, height } = useVideoConfig();
  const f = useCurrentFrame();
  const n = LISTA_CARAS[Math.min(f, LISTA_CARAS.length - 1)];
  return (
    <AbsoluteFill>
      <Estudio w={width} h={height} camara={{ pos: [0, 3.0, 5.6], mira: [0, 2.88, 0], fov: 21 }}>
        <Stickman pose={POSES.parado} expr={n} cuadro={30} semilla={f + 3} />
      </Estudio>
    </AbsoluteFill>
  );
};

// Fase C bis: la hoja de la referencia (4×3) con las mismas poses y caras (cuadro i = celda i)
export const HOJA_REF: { pose: NombrePose; expr: NombreExpresion; cam?: number }[] = [
  { pose: "saludo_carcajada", expr: "carcajada" }, { pose: "cabizbajo", expr: "triste" }, { pose: "brazos_cruzados", expr: "enojado" }, { pose: "temblando", expr: "asustado" },
  { pose: "manos_cabeza", expr: "sorprendido" }, { pose: "rascarse", expr: "confundido" }, { pose: "pensar", expr: "pensativo" }, { pose: "bostezar", expr: "bostezo" },
  { pose: "pulgar_arriba", expr: "guino" }, { pose: "manos_cadera", expr: "sonrisa_picara" }, { pose: "salto_alegria", expr: "carcajada", cam: 1 }, { pose: "panza_risa", expr: "carcajada" },
];
export const StickmanHoja: React.FC = () => {
  const { width, height } = useVideoConfig();
  const f = useCurrentFrame();
  const c = HOJA_REF[Math.min(f, HOJA_REF.length - 1)];
  // la hoja de la ref usa un degradé liso de estudio (sin línea de horizonte): canvas transparente sobre CSS
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #0e2b57 0%, #143f6e 55%, #1d5a85 100%)" }}>
      <Estudio w={width} h={height} fondo={false} luz={{ sombra: 0 }} camara={c.cam ? { pos: [0, 2.55, 11], mira: [0, 2.55, 0], fov: 22 } : { pos: [0, 2.98, 7.2], mira: [0, 2.98, 0], fov: 18.5 }}>
        <Stickman pose={POSES[c.pose]} expr={c.expr} cuadro={0} semilla={f + 1} contacto={0} />
      </Estudio>
    </AbsoluteFill>
  );
};

// Fase D: turnaround (cuadro i = 0°, 45°, 90°, 135°, 180°)
export const StickmanVuelta: React.FC = () => {
  const { width, height } = useVideoConfig();
  const f = useCurrentFrame();
  const a = [0, 45, 90, 135, 180][Math.min(f, 4)];
  return (
    <AbsoluteFill>
      <Estudio w={width} h={height} camara={{ pos: [0, 1.9, 10.5], mira: [0, 1.85, 0], fov: 23 }}>
        <Stickman pose={POSES.ref} expr="feliz" rotY={a} cuadro={0} />
      </Estudio>
    </AbsoluteFill>
  );
};

export const ACCIONES_QA: { accion: string; t: number; expr: NombreExpresion; objetivo?: [number, number]; rotY?: number }[] = [
  { accion: "idle", t: 1.2, expr: "neutral" }, { accion: "saludar", t: 1.0, expr: "feliz" }, { accion: "saludar_dos_manos", t: 0.9, expr: "carcajada" },
  { accion: "caminar", t: 0.4, expr: "decidido", rotY: 50 }, { accion: "correr", t: 0.3, expr: "decidido", rotY: 60 }, { accion: "saltar", t: 0.62, expr: "carcajada" },
  { accion: "festejar", t: 0.68, expr: "carcajada" }, { accion: "senalar", t: 0.9, expr: "sorprendido", objetivo: [0.9, 0.35] }, { accion: "explicar", t: 0.8, expr: "hablando" },
  { accion: "pensar", t: 1.0, expr: "pensativo" }, { accion: "encogerse_de_hombros", t: 0.7, expr: "confundido" }, { accion: "facepalm", t: 0.9, expr: "avergonzado" },
  { accion: "enojado_pisoton", t: 0.35, expr: "furioso" }, { accion: "cruzarse_de_brazos", t: 1.0, expr: "enojado" }, { accion: "asustarse", t: 1.2, expr: "asustado" },
  { accion: "caerse_y_levantarse", t: 1.0, expr: "llorando" }, { accion: "sentarse", t: 1.2, expr: "aburrido", rotY: 35 }, { accion: "tipear", t: 1.0, expr: "decidido", rotY: 30 },
  { accion: "cargar_caja", t: 0.9, expr: "decidido" }, { accion: "empujar", t: 0.9, expr: "decidido", rotY: 70 }, { accion: "aplaudir", t: 0.95, expr: "feliz" },
  { accion: "bailar", t: 0.9, expr: "feliz" }, { accion: "dormir_de_pie", t: 1.5, expr: "dormido" }, { accion: "llorar", t: 1.0, expr: "llorando" },
  { accion: "mirar_reloj", t: 1.0, expr: "aburrido" },
];

// Fase D: una pose clave de cada acción (cuadro i = acción i en su instante clave)
export const StickmanPoses: React.FC = () => {
  const { width, height, fps } = useVideoConfig();
  const f = useCurrentFrame();
  const a = ACCIONES_QA[Math.min(f, ACCIONES_QA.length - 1)];
  return (
    <AbsoluteFill>
      <Estudio w={width} h={height} camara={{ pos: [0, 1.85, 10.5], mira: [0, 1.7, 0], fov: 25 }}>
        <Stickman guion={[{ t: 0, accion: a.accion, expr: a.expr, objetivo: a.objetivo, rotY: a.rotY }]} cuadro={Math.round(a.t * fps)} semilla={f + 2} />
      </Estudio>
    </AbsoluteFill>
  );
};

// Fase E: la acción corriendo en el tiempo (props) — de acá salen las tiras de 8 stills
export const StickmanAccion: React.FC<{ accion: string; expr?: NombreExpresion; objetivo?: [number, number]; rotY?: number }> = ({ accion, expr = "neutral", objetivo, rotY = 0 }) => {
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Estudio w={width} h={height} camara={{ pos: [0, 1.85, 11.5], mira: [0, 1.7, 0], fov: 25 }}>
        <Stickman guion={[{ t: 0, accion, expr, objetivo, rotY }]} />
      </Estudio>
    </AbsoluteFill>
  );
};

export const _usar = { EXPRESIONES };

// Fase F: Blanquito sobre 3 fotos reales (un cuadro por foto). Las fotos van en public/ del bundle de stills, nunca al repo.
export const FONDOS_QA: (StickmanEnFondoProps & { t: number })[] = [
  { fondo: "fondos/interior.jpg", horizonte: 0.4, fov: 50, dirLuz: "izq", t: 40,
    personajes: [{ piso: [0.8, 0.9], alto: 0.42, rotY: -20, guion: [{ t: 0, accion: "saludar", expr: "feliz" }] }] },
  { fondo: "fondos/exterior.jpg", horizonte: 0.52, fov: 50, dirLuz: "izq", t: 50,
    personajes: [{ piso: [0.28, 0.9], alto: 0.39, rotY: 15, guion: [{ t: 0, accion: "senalar", expr: "sorprendido", objetivo: [1, 0.3] }] }] },
  { fondo: "fondos/oficina.jpg", horizonte: 0.45, fov: 55, dirLuz: "izq", t: 40,
    personajes: [{ piso: [0.62, 0.8], alto: 0.43, rotY: -10, guion: [{ t: 0, accion: "cruzarse_de_brazos", expr: "enojado" }] }] },
];
export const StickmanEnFondoQA: React.FC = () => {
  const f = useCurrentFrame();
  const { t, personajes, ...c } = FONDOS_QA[f % FONDOS_QA.length];
  return <StickmanEnFondo {...c} personajes={personajes.map((p) => ({ ...p, cuadro: t }))} />;
};

// Fase G: demo de 20 s en el estudio — entra caminando, saluda feliz, se sorprende, se enoja, se ríe y se va corriendo.
export const GUION_DEMO: PasoGuion[] = [
  { t: 0, accion: "caminar", expr: "neutral", rotY: 90 },
  { t: 4.6, accion: "idle", expr: "feliz", rotY: 0, mezcla: 14 },
  { t: 5.1, accion: "saludar", expr: "feliz" },
  { t: 8.4, accion: "asustarse", expr: "sorprendido", mezcla: 4 },
  { t: 10.8, accion: "enojado_pisoton", expr: "enojado", mezcla: 8 },
  { t: 13.6, accion: "reir", expr: "carcajada", mezcla: 10 },
  { t: 16.6, accion: "caminar", expr: "feliz", rotY: 90, mezcla: 12 },
  { t: 17.3, accion: "correr", expr: "feliz", rotY: 90, mezcla: 8 },
];
export const StickmanDemo: React.FC = () => {
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Estudio w={width} h={height} camara={{ pos: [-0.6, 2.0, 10.5], mira: [-0.6, 1.95, 0], fov: 28.5 }}>
        <Stickman x={-5.5} guion={GUION_DEMO} semilla={7} />
      </Estudio>
    </AbsoluteFill>
  );
};
