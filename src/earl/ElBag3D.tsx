// ElBag3D — la bolsa de camarones congelados en 3D real (three.js): una "almohada" de plástico con el frente (marca
// inventada + "GULF STYLE" + ventanita con camarones) que gira y muestra el dorso con la letra chica. Al terminar el
// giro entra una lupa que agranda LA línea que importa (zoom) y cae el veredicto. Textos por props; sin marcas reales.
import React, { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, interpolate, Easing, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EL, LABEL, BODY, MARKER, fontsReady, dockBg } from "./ElTheme";
import { Stamp } from "./ElParts";

const CamLook: React.FC<{ pos: [number, number, number]; target: [number, number, number] }> = ({ pos, target }) => {
  const { camera } = useThree(); camera.position.set(...pos); camera.lookAt(...target); camera.updateProjectionMatrix(); return null;
};
function frontTex(brand: string, title: string, sub: string) {
  const cv = document.createElement("canvas"); cv.width = 768; cv.height = 1024; const c = cv.getContext("2d")!;
  c.fillStyle = "#F7FAFC"; c.fillRect(0, 0, 768, 1024);
  c.fillStyle = "#1F4E8C"; c.fillRect(0, 0, 768, 120); c.fillRect(0, 900, 768, 124);
  c.fillStyle = "#fff"; c.textAlign = "center"; c.font = `700 56px ${LABEL}`; c.fillText(brand, 384, 80);
  c.fillStyle = "#C8302C"; c.font = `700 92px ${LABEL}`; c.fillText(title, 384, 245);
  c.fillStyle = "#1F4E8C"; c.font = `700 150px ${LABEL}`; c.fillText("SHRIMP", 384, 400);
  c.fillStyle = "#1B1F24"; c.font = `500 44px ${BODY}`; c.fillText(sub, 384, 470);
  // ventana transparente con camarones
  c.fillStyle = "#dfe8ee"; c.beginPath(); c.roundRect(110, 510, 548, 360, 40); c.fill();
  for (let i = 0; i < 26; i++) { const x = 150 + (i * 97) % 470, y = 540 + ((i * 53) % 300); c.strokeStyle = "#f0a988"; c.lineWidth = 26; c.lineCap = "round"; c.beginPath(); c.arc(x, y, 30, 0.3 + i, 3.6 + i); c.stroke(); c.strokeStyle = "rgba(255,255,255,0.5)"; c.lineWidth = 6; c.beginPath(); c.arc(x, y, 34, 0.6 + i, 2.4 + i); c.stroke(); }
  c.fillStyle = "#fff"; c.font = `500 46px ${LABEL}`; c.fillText("NET WT 2 LB (32 OZ)", 384, 975);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function backTex(lines: string[], hi: number[]) {
  const cv = document.createElement("canvas"); cv.width = 768; cv.height = 1024; const c = cv.getContext("2d")!;
  c.fillStyle = "#F7FAFC"; c.fillRect(0, 0, 768, 1024);
  c.fillStyle = "#1F4E8C"; c.fillRect(0, 0, 768, 80);
  c.fillStyle = "#fff"; c.fillRect(70, 130, 628, 520); c.strokeStyle = "#1B1F24"; c.lineWidth = 4; c.strokeRect(70, 130, 628, 520);
  c.fillStyle = "#1B1F24"; c.font = `700 46px ${LABEL}`; c.textAlign = "left"; c.fillText("Nutrition Facts", 95, 190);
  for (let i = 0; i < 9; i++) { c.fillRect(95, 220 + i * 46, 578, 2); c.font = `500 26px ${BODY}`; c.fillText(["Serving size 4 oz", "Calories 60", "Total Fat 0.5g", "Sodium 290mg", "Cholesterol 130mg", "Protein 13g", "Calcium 2%", "Iron 2%", "Potassium 3%"][i], 100, 252 + i * 46); }
  c.font = `500 30px ${BODY}`;
  lines.forEach((l, i) => { const y = 720 + i * 52; if (hi.includes(i)) { c.fillStyle = "rgba(255,226,92,0.85)"; c.fillRect(64, y - 34, 640, 46); } c.fillStyle = "#1B1F24"; c.fillText(l, 72, y); });
  for (let i = 0; i < 22; i++) { c.fillStyle = i % 2 ? "#111" : "#fff"; c.fillRect(470 + i * 9, 920, 9, 80); }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function pillow(sign: 1 | -1) {
  const g = new THREE.PlaneGeometry(1.15, 1.55, 24, 32); const p = g.attributes.position as any;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); const b = Math.cos((x / 0.575) * Math.PI * 0.5) * Math.cos((y / 0.775) * Math.PI * 0.5); p.setZ(i, sign * (0.015 + 0.13 * Math.max(0, b))); }
  g.computeVertexNormals(); return g;
}

export const ElBag3D: React.FC<{ brand?: string; title?: string; sub?: string; lines: string[]; hi?: number[]; zoom?: string; verdict?: string; good?: boolean; flipAt?: number; caption?: string }> = ({ brand = "COASTAL CATCH", title = "GULF STYLE", sub = "Peeled & Deveined · Raw", lines, hi = [], zoom, verdict, good = false, flipAt = 40, caption = "turn it over" }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const [ready, setReady] = useState(false); const [h] = useState(() => delayRender("el bag fonts"));
  useEffect(() => { fontsReady().then(() => { setReady(true); continueRender(h); }); }, [h]);
  const m = useMemo(() => {
    if (!ready) return null;
    const plastic = (map: any) => new THREE.MeshPhysicalMaterial({ map, roughness: 0.32, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.15 });
    return { gf: pillow(1), gb: pillow(-1), mf: plastic(frontTex(brand, title, sub)), mb: plastic(backTex(lines, hi)) };
  }, [ready, brand, title, sub, lines, hi]);
  const e = Easing.inOut(Easing.cubic);
  const flip = interpolate(f, [flipAt, flipAt + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
  const intro = interpolate(f, [0, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.4)) });
  const sway = Math.sin(f / 18) * 0.06 * (1 - flip * 0.7);
  const cam: [number, number, number] = [0, 0.05, interpolate(flip, [0, 1], [3.3, 2.75])];
  const zk = interpolate(f, [flipAt + 30, flipAt + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.6)) });
  return (
    <AbsoluteFill style={{ ...dockBg() }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0.28), transparent 60%)" }} />
      {m ? (
        <ThreeCanvas width={width} height={height} camera={{ fov: 34, position: cam, near: 0.05, far: 30 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
          <CamLook pos={cam} target={[0, 0, 0]} />
          <hemisphereLight args={["#FFFFFF", "#6b5a44", 1.0]} />
          <directionalLight position={[2, 3, 4]} intensity={1.8} />
          <directionalLight position={[-3, 1, -3]} intensity={0.7} color="#DCE6FF" />
          <group rotation={[0.05, flip * Math.PI + sway, -0.04 + sway * 0.3]} scale={[intro, intro, intro]}>
            <mesh geometry={m.gf} material={m.mf} />
            <mesh geometry={m.gb} material={m.mb} rotation={[0, Math.PI, 0]} />
          </group>
        </ThreeCanvas>
      ) : null}
      <div style={{ position: "absolute", top: 48, width: "100%", textAlign: "center" }}>
        <span style={{ background: EL.navy, color: EL.white, fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 9, padding: "8px 28px", textTransform: "uppercase" }}>{caption}</span>
      </div>
      {zoom ? (
        <div style={{ position: "absolute", right: 120, top: 300, width: 620, transform: `scale(${zk})`, transformOrigin: "20% 50%" }}>
          <div style={{ width: 620, height: 620, borderRadius: 310, border: `22px solid ${EL.ink}`, background: "#F7FAFC", boxShadow: `0 30px 60px ${EL.shadow}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <div style={{ background: "rgba(255,226,92,0.9)", padding: "18px 26px", fontFamily: BODY, fontWeight: 700, fontSize: zoom.length > 22 ? 52 : 64, color: EL.ink, textAlign: "center", lineHeight: 1.1 }}>{zoom}</div>
          </div>
          {verdict ? <div style={{ position: "absolute", left: 40, bottom: -40 }}><Stamp text={verdict} at={flipAt + 46} size={66} color={good ? EL.green : EL.red} rot={-7} style={{ background: "rgba(255,255,255,0.9)" }} /></div> : null}
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 90, bottom: 70, fontFamily: MARKER, fontSize: 44, color: EL.white, opacity: interpolate(f, [8, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (1 - flip), textShadow: "0 3px 8px rgba(0,0,0,0.5)" }}>the front says…</div>
    </AbsoluteFill>
  );
};
