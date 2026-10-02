// OpFeedSack3D — dos bolsas de alimento de 50 lb en 3D real (three.js) sobre el piso de madera de la feed store: la
// cámara arranca en la bolsa A (la de siempre), viaja a la B (la que conviene ahora) y la B se adelanta y gira un
// poco mostrando su etiqueta; entra la diferencia de proteína y de precio. Etiquetas por props (canvas, sin marcas).
import React, { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, interpolate, Easing, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OP, LABEL, SLAB, HAND, fontsReady, kraftBg } from "./OpTheme";
import { Stamp } from "./OpParts";

type Sack = { name: string; pct: string; price: string; color: string };

const CamLook: React.FC<{ pos: [number, number, number]; target: [number, number, number] }> = ({ pos, target }) => {
  const { camera } = useThree(); camera.position.set(...pos); camera.lookAt(...target); camera.updateProjectionMatrix(); return null;
};

function labelTex(s: Sack) {
  const cv = document.createElement("canvas"); cv.width = 512; cv.height = 768; const c = cv.getContext("2d")!;
  c.fillStyle = "#cfae79"; c.fillRect(0, 0, 512, 768);
  for (let i = 0; i < 2600; i++) { c.fillStyle = `rgba(90,60,20,${0.03 + (i % 5) * 0.01})`; c.fillRect((i * 97) % 512, (i * 211) % 768, 2, 2); }
  c.fillStyle = s.color; c.fillRect(0, 70, 512, 150);
  c.fillStyle = "#fffdf7"; c.textAlign = "center"; c.font = `700 92px ${SLAB}`; c.fillText(s.name, 256, 180);
  c.fillStyle = "#2c2a28"; c.font = `700 210px ${SLAB}`; c.fillText(s.pct, 256, 450);
  c.font = `700 64px ${LABEL}`; c.fillText("PROTEIN", 256, 530);
  c.font = `500 46px ${LABEL}`; c.fillText("NET WT 50 LB", 256, 680);
  c.strokeStyle = "#7a5a30"; c.lineWidth = 6; c.setLineDash([16, 12]); c.strokeRect(24, 24, 464, 720);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function sackGeo() {
  const g = new THREE.BoxGeometry(1, 1.5, 0.55, 12, 16, 8);
  const p = g.attributes.position as any;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const by = Math.cos((y / 0.75) * Math.PI * 0.5); // panza al medio
    const bx = Math.cos((x / 0.5) * Math.PI * 0.5);
    const pinch = y > 0.6 ? 1 - (y - 0.6) * 1.6 : 1; // costura arriba
    p.setZ(i, z * (0.75 + 0.45 * by) * (0.8 + 0.2 * bx) * Math.max(0.2, pinch));
    p.setX(i, x * (0.96 + 0.06 * by));
  }
  g.computeVertexNormals(); return g;
}
function woodTex() {
  const cv = document.createElement("canvas"); cv.width = 1024; cv.height = 256; const c = cv.getContext("2d")!;
  for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? "#8a6a44" : "#94744c"; c.fillRect(0, i * 32, 1024, 32); c.fillStyle = "rgba(0,0,0,0.25)"; c.fillRect(0, i * 32, 1024, 2); }
  const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 4); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export const OpFeedSack3D: React.FC<{ a: Sack; b: Sack; title?: string; diff?: string; moveAt?: number }> = ({ a, b, title = "Read the feed tag", diff = "+4% protein", moveAt = 50 }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const [ready, setReady] = useState(false); const [h] = useState(() => delayRender("op sack fonts"));
  useEffect(() => { fontsReady().then(() => { setReady(true); continueRender(h); }); }, [h]);
  const mats = useMemo(() => {
    if (!ready) return null;
    const geo = sackGeo();
    const side = new THREE.MeshStandardMaterial({ color: "#c9a574", roughness: 0.95 });
    const mk = (s: Sack) => [side, side, side, side, new THREE.MeshStandardMaterial({ map: labelTex(s), roughness: 0.9 }), side];
    return { geo, ma: mk(a), mb: mk(b), floor: new THREE.MeshStandardMaterial({ map: woodTex(), roughness: 0.85 }) };
  }, [ready, a, b]);
  const e = Easing.inOut(Easing.cubic);
  const m = interpolate(f, [moveAt, moveAt + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
  const intro = interpolate(f, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const cam: [number, number, number] = [interpolate(m, [0, 1], [-0.35, 0.35]), 1.15, interpolate(intro, [0, 1], [7.2, 5.6]) - m * 0.5];
  const bz = m * 0.5, brot = -m * 0.35;
  const op = (at: number) => interpolate(f, [at, at + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ ...kraftBg("#e8dcc2") }}>
      {mats ? (
        <ThreeCanvas width={width} height={height} camera={{ fov: 32, position: cam, near: 0.05, far: 40 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
          <CamLook pos={cam} target={[cam[0] * 0.9, 0.62, 0]} />
          <hemisphereLight args={["#FFF6E6", "#7a5a30", 1.0]} />
          <directionalLight position={[2, 4, 4]} intensity={1.9} color="#FFF1D6" />
          <directionalLight position={[-3, 2, 1]} intensity={0.5} color="#DCE6FF" />
          <mesh geometry={mats.geo} material={mats.ma} position={[-0.75, 0.75, 0]} rotation={[0, 0.18, 0]} />
          <mesh geometry={mats.geo} material={mats.mb} position={[0.75, 0.75, bz]} rotation={[0, brot - 0.12, 0]} />
          <mesh material={mats.floor} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}><planeGeometry args={[12, 8]} /></mesh>
        </ThreeCanvas>
      ) : null}
      <div style={{ position: "absolute", top: 40, left: "50%", transform: "translateX(-50%)", background: OP.paper, padding: "8px 30px", boxShadow: `0 8px 18px ${OP.shadow}`, fontFamily: LABEL, fontWeight: 700, fontSize: 42, letterSpacing: 9, color: OP.pencil, textTransform: "uppercase" }}>{title}</div>
      <div style={{ position: "absolute", left: 90, bottom: 60, background: OP.paper, padding: "10px 28px", boxShadow: `0 10px 24px ${OP.shadow}`, opacity: op(20) * (1 - m * 0.4) }}>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: OP.pencil }}>{a.name} · {a.pct}</div>
        <div style={{ fontFamily: SLAB, fontWeight: 700, fontSize: 90, color: OP.pencil }}>{a.price}</div>
      </div>
      <div style={{ position: "absolute", right: 90, bottom: 60, textAlign: "right", background: OP.paper, padding: "10px 28px", boxShadow: `0 10px 24px ${OP.shadow}`, opacity: op(moveAt + 24) }}>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: OP.red }}>{b.name} · {b.pct}</div>
        <div style={{ fontFamily: SLAB, fontWeight: 700, fontSize: 90, color: OP.red }}>{b.price}</div>
      </div>
      <div style={{ position: "absolute", right: 120, top: 150 }}><Stamp text={diff} at={moveAt + 36} size={70} color={OP.green} rot={-6} style={{ background: "rgba(255,253,247,0.85)" }} /></div>
    </AbsoluteFill>
  );
};
