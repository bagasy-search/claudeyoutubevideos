// Capa3D: personajes 3D del kit Blanquito DENTRO de un set 2D de anikit, con la MISMA cámara (mira/temblor/zoom).
// Mundo 2D en px ↔ mundo 3D en unidades: K px por unidad, el piso del set (PISO) en y = 0. Cámara ortográfica que
// reproduce la transform de la Capa z=1: pantalla = R(zoom·(P−960)) − c  ⇒  centro de cámara = R⁻¹(c)/zoom + 960.
// Un solo canvas WebGL por cuadro (Chrome tolera pocos contextos). Sin sombras dinámicas: la sombra de contacto es un
// óvalo plano que sigue los pies (estilo 2D del set).
import React from "react";
import * as THREE from "three";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { useVideoConfig } from "remotion";
import { useCamara, useF } from "../anikit/camara";
import { Luces, LuzEscena } from "../stickman3d/iluminacion";
import { Stickman, StickmanProps } from "../stickman3d/Stickman";
import { evaluarGuion } from "../stickman3d/acciones";
import { PISO } from "./sets/londres";

export const K = 93; // Blanquito parado ≈ 3,55 u ≈ 330 px del mundo

const CamOrto: React.FC<{ piso: number }> = ({ piso }) => {
  const c = useCamara();
  const { camera } = useThree();
  const cam = camera as THREE.OrthographicCamera;
  const th = (c.rot * Math.PI) / 180;
  // R⁻¹ aplicado al desplazamiento de cámara (en pantalla, y hacia abajo)
  const ux = (Math.cos(th) * c.x + Math.sin(th) * c.y) / c.zoom, uy = (-Math.sin(th) * c.x + Math.cos(th) * c.y) / c.zoom;
  const Xc = 960 + ux, Yc = 540 + uy;
  const hw = 960 / c.zoom / K, hh = 540 / c.zoom / K;
  cam.left = -hw; cam.right = hw; cam.top = hh; cam.bottom = -hh; cam.near = 0.1; cam.far = 400;
  cam.position.set(Xc / K, (piso - Yc) / K, 60);
  cam.rotation.set(0, 0, th);
  cam.zoom = 1;
  cam.updateProjectionMatrix();
  cam.updateMatrixWorld(true);
  return null;
};

// un personaje en el mundo del set: x en px del mundo; el resto como <Stickman> (guion con t en segundos del PLANO)
export type Personaje = Omit<StickmanProps, "x" | "cuadro"> & { x: number; prof?: number; sombra?: number; t0?: number; alto?: number;
  // mov(s): movimiento libre en px/grados según el segundo del plano: dx/dy (dy hacia ARRIBA), rz = acostado (90 = tirado
  // de espaldas, pivote en los pies). Para despertar en el barro, ser levantado, volar por un empujón…
  mov?: (s: number) => { dx?: number; dy?: number; rz?: number };
}; // alto: px sobre el piso (arriba del heno, de una mesa)

const Sombra: React.FC<{ x: number; z: number; o: number; ancho: number }> = ({ x, z, o, ancho }) => (
  <mesh position={[x, -0.02, z - 0.6]} scale={[ancho, 0.22, 1]} renderOrder={-2}>
    <circleGeometry args={[1, 40]} />
    <meshBasicMaterial color="#1a0e06" transparent opacity={o} depthWrite={false} />
  </mesh>
);

const Uno: React.FC<{ p: Personaje; f: number; fps: number }> = ({ p, f, fps }) => {
  const cuadro = f - (p.t0 ?? 0) * fps;
  const ev = evaluarGuion({ guion: p.guion ?? [{ t: 0, accion: "idle", expr: "neutral" }], frame: cuadro, fps, semilla: p.semilla ?? 1, poseFija: p.pose, exprFija: undefined, mirada: p.mirada, boca: p.boca });
  const esc = p.escala ?? 1;
  const z = p.prof ?? 0;
  const salto = Math.max(0, ev.pose.raiz?.[1] ?? 0);
  const m = p.mov ? p.mov(cuadro / fps) : {};
  const px = p.x / K, dx = (m.dx ?? 0) / K, alto = ((p.alto ?? 0) + (m.dy ?? 0)) / K, rz = ((m.rz ?? 0) * Math.PI) / 180;
  return (
    <>
      {!p.alto && !(m.dy && m.dy > 40) && <Sombra x={px + dx + ev.dx} z={z} o={(p.sombra ?? 0.32) / (1 + salto * 1.5)} ancho={(0.95 * esc + Math.abs(Math.sin(rz)) * 1.4) / (1 + salto * 0.6)} />}
      <group position={[px + dx + ev.dx, alto, z]} rotation={[0, 0, rz]}>
        <group position={[-(px + dx + ev.dx), 0, -z]}><Stickman {...p} x={px + dx} z={z} cuadro={cuadro} sombras={false} contacto={0} /></group>
      </group>
    </>
  );
};

export const Capa3D: React.FC<{ personajes: Personaje[]; luz?: LuzEscena; piso?: number }> = ({ personajes, luz, piso = PISO }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  const cx = personajes.length ? personajes.reduce((a, p) => a + p.x, 0) / personajes.length / K : 0;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <ThreeCanvas orthographic width={1920} height={1080} dpr={1}
        gl={{ antialias: true, preserveDrawingBuffer: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace }}
        camera={{ position: [0, 2, 60], near: 0.1, far: 400 }}>
        <CamOrto piso={piso} />
        <Luces dir={[-0.55, 1.2, 1]} intensidad={2.5} relleno={0.85} contraluz={1.1} entorno={0.85} tinte="#f3e2c8" piso="#6e5238" sombra={0} {...luz} centro={[cx, 1.6, 0]} />
        {personajes.map((p, i) => <Uno key={i} p={p} f={f} fps={fps} />)}
      </ThreeCanvas>
    </div>
  );
};
