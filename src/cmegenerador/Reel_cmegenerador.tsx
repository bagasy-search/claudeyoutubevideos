// Reel_cmegenerador.tsx — GENERADO por _v3/cmeg_reel.mjs. NO editar a mano.
// Muestras de cada acto y de los dos lados de cada frontera de los 16 movimientos.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { MovCiclo } from "./MovCiclo";
import { MovCierre } from "./MovCierre";
import { MovCuenta } from "./MovCuenta";
import { MovDesglose } from "./MovDesglose";
import { MovDiezAnos } from "./MovDiezAnos";
import { MovDosPreguntas } from "./MovDosPreguntas";
import { MovEscalones } from "./MovEscalones";
import { MovEtiqueta } from "./MovEtiqueta";
import { MovFaltan } from "./MovFaltan";
import { MovLlave } from "./MovLlave";
import { MovPapel } from "./MovPapel";
import { MovPeligro } from "./MovPeligro";
import { MovSuma } from "./MovSuma";
import { MovTresDias } from "./MovTresDias";
import { MovTresNumeros } from "./MovTresNumeros";
import { MovTrescientos } from "./MovTrescientos";

export const TOTAL_FRAMES_REEL = 1520;

export const ReelCmegenerador: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <Sequence from={0} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPapel acto={1} gFrame={0 + (frame - 0)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Papel · acto 1 · g0</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={8} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPapel acto={1} gFrame={307 + (frame - 8)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Papel · frontera 1 ANTES · g307</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={16} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPapel acto={1} gFrame={315 + (frame - 16)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Papel · acto 2 · g315</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={24} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPapel acto={1} gFrame={323 + (frame - 24)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Papel · frontera 1 DESPUES · g323</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={32} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPapel acto={1} gFrame={592 + (frame - 32)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Papel · frontera 2 ANTES · g592</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={40} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPapel acto={1} gFrame={600 + (frame - 40)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Papel · acto 3 · g600</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={48} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPapel acto={1} gFrame={608 + (frame - 48)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Papel · frontera 2 DESPUES · g608</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={56} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPapel acto={1} gFrame={892 + (frame - 56)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Papel · frontera 3 ANTES · g892</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={64} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPapel acto={1} gFrame={900 + (frame - 64)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Papel · acto 4 · g900</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={72} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPapel acto={1} gFrame={908 + (frame - 72)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Papel · frontera 3 DESPUES · g908</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={80} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPapel acto={1} gFrame={1192 + (frame - 80)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Papel · frontera 4 ANTES · g1192</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={88} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPapel acto={1} gFrame={1200 + (frame - 88)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Papel · acto 5 · g1200</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={96} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPapel acto={1} gFrame={1208 + (frame - 96)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Papel · frontera 4 DESPUES · g1208</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={104} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTrescientos acto={1} gFrame={0 + (frame - 104)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Trescientos · acto 1 · g0</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={112} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTrescientos acto={1} gFrame={262 + (frame - 112)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Trescientos · frontera 1 ANTES · g262</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={120} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTrescientos acto={1} gFrame={270 + (frame - 120)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Trescientos · acto 2 · g270</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={128} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTrescientos acto={1} gFrame={278 + (frame - 128)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Trescientos · frontera 1 DESPUES · g278</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={136} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTrescientos acto={1} gFrame={562 + (frame - 136)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Trescientos · frontera 2 ANTES · g562</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={144} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTrescientos acto={1} gFrame={570 + (frame - 144)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Trescientos · acto 3 · g570</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={152} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTrescientos acto={1} gFrame={578 + (frame - 152)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Trescientos · frontera 2 DESPUES · g578</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={160} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTrescientos acto={1} gFrame={892 + (frame - 160)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Trescientos · frontera 3 ANTES · g892</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={168} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTrescientos acto={1} gFrame={900 + (frame - 168)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Trescientos · acto 4 · g900</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={176} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTrescientos acto={1} gFrame={908 + (frame - 176)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Trescientos · frontera 3 DESPUES · g908</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={184} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDesglose acto={1} gFrame={0 + (frame - 184)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Desglose · acto 1 · g0</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={192} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDesglose acto={1} gFrame={292 + (frame - 192)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Desglose · frontera 1 ANTES · g292</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={200} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDesglose acto={1} gFrame={300 + (frame - 200)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Desglose · acto 2 · g300</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={208} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDesglose acto={1} gFrame={308 + (frame - 208)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Desglose · frontera 1 DESPUES · g308</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={216} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDesglose acto={1} gFrame={652 + (frame - 216)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Desglose · frontera 2 ANTES · g652</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={224} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDesglose acto={1} gFrame={660 + (frame - 224)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Desglose · acto 3 · g660</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={232} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDesglose acto={1} gFrame={668 + (frame - 232)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Desglose · frontera 2 DESPUES · g668</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={240} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDesglose acto={1} gFrame={952 + (frame - 240)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Desglose · frontera 3 ANTES · g952</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={248} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDesglose acto={1} gFrame={960 + (frame - 248)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Desglose · acto 4 · g960</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={256} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDesglose acto={1} gFrame={968 + (frame - 256)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Desglose · frontera 3 DESPUES · g968</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={264} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDesglose acto={1} gFrame={1222 + (frame - 264)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Desglose · frontera 4 ANTES · g1222</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={272} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDesglose acto={1} gFrame={1230 + (frame - 272)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Desglose · acto 5 · g1230</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={280} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDesglose acto={1} gFrame={1238 + (frame - 280)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Desglose · frontera 4 DESPUES · g1238</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={288} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDiezAnos acto={1} gFrame={0 + (frame - 288)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>DiezAnos · acto 1 · g0</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={296} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDiezAnos acto={1} gFrame={322 + (frame - 296)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>DiezAnos · frontera 1 ANTES · g322</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={304} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDiezAnos acto={1} gFrame={330 + (frame - 304)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>DiezAnos · acto 2 · g330</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={312} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDiezAnos acto={1} gFrame={338 + (frame - 312)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>DiezAnos · frontera 1 DESPUES · g338</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={320} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDiezAnos acto={1} gFrame={682 + (frame - 320)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>DiezAnos · frontera 2 ANTES · g682</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={328} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDiezAnos acto={1} gFrame={690 + (frame - 328)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>DiezAnos · acto 3 · g690</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={336} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDiezAnos acto={1} gFrame={698 + (frame - 336)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>DiezAnos · frontera 2 DESPUES · g698</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={344} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDiezAnos acto={1} gFrame={1042 + (frame - 344)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>DiezAnos · frontera 3 ANTES · g1042</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={352} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDiezAnos acto={1} gFrame={1050 + (frame - 352)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>DiezAnos · acto 4 · g1050</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={360} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDiezAnos acto={1} gFrame={1058 + (frame - 360)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>DiezAnos · frontera 3 DESPUES · g1058</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={368} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDiezAnos acto={1} gFrame={1312 + (frame - 368)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>DiezAnos · frontera 4 ANTES · g1312</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={376} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDiezAnos acto={1} gFrame={1320 + (frame - 376)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>DiezAnos · acto 5 · g1320</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={384} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDiezAnos acto={1} gFrame={1328 + (frame - 384)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>DiezAnos · frontera 4 DESPUES · g1328</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={392} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEtiqueta acto={1} gFrame={0 + (frame - 392)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Etiqueta · acto 1 · g0</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={400} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEtiqueta acto={1} gFrame={292 + (frame - 400)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Etiqueta · frontera 1 ANTES · g292</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={408} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEtiqueta acto={1} gFrame={300 + (frame - 408)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Etiqueta · acto 2 · g300</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={416} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEtiqueta acto={1} gFrame={308 + (frame - 416)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Etiqueta · frontera 1 DESPUES · g308</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={424} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEtiqueta acto={1} gFrame={652 + (frame - 424)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Etiqueta · frontera 2 ANTES · g652</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={432} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEtiqueta acto={1} gFrame={660 + (frame - 432)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Etiqueta · acto 3 · g660</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={440} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEtiqueta acto={1} gFrame={668 + (frame - 440)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Etiqueta · frontera 2 DESPUES · g668</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={448} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEtiqueta acto={1} gFrame={1012 + (frame - 448)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Etiqueta · frontera 3 ANTES · g1012</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={456} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEtiqueta acto={1} gFrame={1020 + (frame - 456)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Etiqueta · acto 4 · g1020</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={464} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEtiqueta acto={1} gFrame={1028 + (frame - 464)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Etiqueta · frontera 3 DESPUES · g1028</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={472} durationInFrames={8} layout="none">
        <AbsoluteFill><MovSuma acto={1} gFrame={0 + (frame - 472)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Suma · acto 1 · g0</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={480} durationInFrames={8} layout="none">
        <AbsoluteFill><MovSuma acto={1} gFrame={322 + (frame - 480)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Suma · frontera 1 ANTES · g322</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={488} durationInFrames={8} layout="none">
        <AbsoluteFill><MovSuma acto={1} gFrame={330 + (frame - 488)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Suma · acto 2 · g330</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={496} durationInFrames={8} layout="none">
        <AbsoluteFill><MovSuma acto={1} gFrame={338 + (frame - 496)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Suma · frontera 1 DESPUES · g338</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={504} durationInFrames={8} layout="none">
        <AbsoluteFill><MovSuma acto={1} gFrame={652 + (frame - 504)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Suma · frontera 2 ANTES · g652</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={512} durationInFrames={8} layout="none">
        <AbsoluteFill><MovSuma acto={1} gFrame={660 + (frame - 512)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Suma · acto 3 · g660</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={520} durationInFrames={8} layout="none">
        <AbsoluteFill><MovSuma acto={1} gFrame={668 + (frame - 520)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Suma · frontera 2 DESPUES · g668</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={528} durationInFrames={8} layout="none">
        <AbsoluteFill><MovSuma acto={1} gFrame={1012 + (frame - 528)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Suma · frontera 3 ANTES · g1012</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={536} durationInFrames={8} layout="none">
        <AbsoluteFill><MovSuma acto={1} gFrame={1020 + (frame - 536)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Suma · acto 4 · g1020</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={544} durationInFrames={8} layout="none">
        <AbsoluteFill><MovSuma acto={1} gFrame={1028 + (frame - 544)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Suma · frontera 3 DESPUES · g1028</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={552} durationInFrames={8} layout="none">
        <AbsoluteFill><MovSuma acto={1} gFrame={1342 + (frame - 552)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Suma · frontera 4 ANTES · g1342</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={560} durationInFrames={8} layout="none">
        <AbsoluteFill><MovSuma acto={1} gFrame={1350 + (frame - 560)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Suma · acto 5 · g1350</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={568} durationInFrames={8} layout="none">
        <AbsoluteFill><MovSuma acto={1} gFrame={1358 + (frame - 568)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Suma · frontera 4 DESPUES · g1358</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={576} durationInFrames={8} layout="none">
        <AbsoluteFill><MovFaltan acto={1} gFrame={0 + (frame - 576)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Faltan · acto 1 · g0</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={584} durationInFrames={8} layout="none">
        <AbsoluteFill><MovFaltan acto={1} gFrame={352 + (frame - 584)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Faltan · frontera 1 ANTES · g352</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={592} durationInFrames={8} layout="none">
        <AbsoluteFill><MovFaltan acto={1} gFrame={360 + (frame - 592)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Faltan · acto 2 · g360</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={600} durationInFrames={8} layout="none">
        <AbsoluteFill><MovFaltan acto={1} gFrame={368 + (frame - 600)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Faltan · frontera 1 DESPUES · g368</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={608} durationInFrames={8} layout="none">
        <AbsoluteFill><MovFaltan acto={1} gFrame={712 + (frame - 608)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Faltan · frontera 2 ANTES · g712</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={616} durationInFrames={8} layout="none">
        <AbsoluteFill><MovFaltan acto={1} gFrame={720 + (frame - 616)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Faltan · acto 3 · g720</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={624} durationInFrames={8} layout="none">
        <AbsoluteFill><MovFaltan acto={1} gFrame={728 + (frame - 624)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Faltan · frontera 2 DESPUES · g728</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={632} durationInFrames={8} layout="none">
        <AbsoluteFill><MovFaltan acto={1} gFrame={1132 + (frame - 632)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Faltan · frontera 3 ANTES · g1132</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={640} durationInFrames={8} layout="none">
        <AbsoluteFill><MovFaltan acto={1} gFrame={1140 + (frame - 640)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Faltan · acto 4 · g1140</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={648} durationInFrames={8} layout="none">
        <AbsoluteFill><MovFaltan acto={1} gFrame={1148 + (frame - 648)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Faltan · frontera 3 DESPUES · g1148</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={656} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCiclo acto={1} gFrame={0 + (frame - 656)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Ciclo · acto 1 · g0</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={664} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCiclo acto={1} gFrame={322 + (frame - 664)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Ciclo · frontera 1 ANTES · g322</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={672} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCiclo acto={1} gFrame={330 + (frame - 672)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Ciclo · acto 2 · g330</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={680} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCiclo acto={1} gFrame={338 + (frame - 680)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Ciclo · frontera 1 DESPUES · g338</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={688} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCiclo acto={1} gFrame={772 + (frame - 688)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Ciclo · frontera 2 ANTES · g772</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={696} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCiclo acto={1} gFrame={780 + (frame - 696)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Ciclo · acto 3 · g780</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={704} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCiclo acto={1} gFrame={788 + (frame - 704)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Ciclo · frontera 2 DESPUES · g788</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={712} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCiclo acto={1} gFrame={1222 + (frame - 712)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Ciclo · frontera 3 ANTES · g1222</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={720} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCiclo acto={1} gFrame={1230 + (frame - 720)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Ciclo · acto 4 · g1230</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={728} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCiclo acto={1} gFrame={1238 + (frame - 728)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Ciclo · frontera 3 DESPUES · g1238</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={736} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCiclo acto={1} gFrame={1552 + (frame - 736)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Ciclo · frontera 4 ANTES · g1552</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={744} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCiclo acto={1} gFrame={1560 + (frame - 744)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Ciclo · acto 5 · g1560</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={752} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCiclo acto={1} gFrame={1568 + (frame - 752)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Ciclo · frontera 4 DESPUES · g1568</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={760} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDosPreguntas acto={1} gFrame={0 + (frame - 760)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>DosPreguntas · acto 1 · g0</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={768} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDosPreguntas acto={1} gFrame={352 + (frame - 768)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>DosPreguntas · frontera 1 ANTES · g352</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={776} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDosPreguntas acto={1} gFrame={360 + (frame - 776)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>DosPreguntas · acto 2 · g360</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={784} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDosPreguntas acto={1} gFrame={368 + (frame - 784)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>DosPreguntas · frontera 1 DESPUES · g368</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={792} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDosPreguntas acto={1} gFrame={772 + (frame - 792)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>DosPreguntas · frontera 2 ANTES · g772</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={800} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDosPreguntas acto={1} gFrame={780 + (frame - 800)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>DosPreguntas · acto 3 · g780</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={808} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDosPreguntas acto={1} gFrame={788 + (frame - 808)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>DosPreguntas · frontera 2 DESPUES · g788</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={816} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDosPreguntas acto={1} gFrame={1192 + (frame - 816)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>DosPreguntas · frontera 3 ANTES · g1192</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={824} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDosPreguntas acto={1} gFrame={1200 + (frame - 824)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>DosPreguntas · acto 4 · g1200</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={832} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDosPreguntas acto={1} gFrame={1208 + (frame - 832)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>DosPreguntas · frontera 3 DESPUES · g1208</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={840} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTresNumeros acto={1} gFrame={0 + (frame - 840)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>TresNumeros · acto 1 · g0</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={848} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTresNumeros acto={1} gFrame={412 + (frame - 848)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>TresNumeros · frontera 1 ANTES · g412</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={856} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTresNumeros acto={1} gFrame={420 + (frame - 856)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>TresNumeros · acto 2 · g420</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={864} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTresNumeros acto={1} gFrame={428 + (frame - 864)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>TresNumeros · frontera 1 DESPUES · g428</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={872} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTresNumeros acto={1} gFrame={892 + (frame - 872)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>TresNumeros · frontera 2 ANTES · g892</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={880} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTresNumeros acto={1} gFrame={900 + (frame - 880)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>TresNumeros · acto 3 · g900</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={888} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTresNumeros acto={1} gFrame={908 + (frame - 888)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>TresNumeros · frontera 2 DESPUES · g908</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={896} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTresNumeros acto={1} gFrame={1372 + (frame - 896)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>TresNumeros · frontera 3 ANTES · g1372</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={904} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTresNumeros acto={1} gFrame={1380 + (frame - 904)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>TresNumeros · acto 4 · g1380</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={912} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTresNumeros acto={1} gFrame={1388 + (frame - 912)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>TresNumeros · frontera 3 DESPUES · g1388</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={920} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEscalones acto={1} gFrame={0 + (frame - 920)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Escalones · acto 1 · g0</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={928} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEscalones acto={1} gFrame={382 + (frame - 928)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Escalones · frontera 1 ANTES · g382</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={936} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEscalones acto={1} gFrame={390 + (frame - 936)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Escalones · acto 2 · g390</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={944} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEscalones acto={1} gFrame={398 + (frame - 944)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Escalones · frontera 1 DESPUES · g398</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={952} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEscalones acto={1} gFrame={802 + (frame - 952)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Escalones · frontera 2 ANTES · g802</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={960} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEscalones acto={1} gFrame={810 + (frame - 960)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Escalones · acto 3 · g810</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={968} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEscalones acto={1} gFrame={818 + (frame - 968)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Escalones · frontera 2 DESPUES · g818</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={976} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEscalones acto={1} gFrame={1252 + (frame - 976)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Escalones · frontera 3 ANTES · g1252</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={984} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEscalones acto={1} gFrame={1260 + (frame - 984)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Escalones · acto 4 · g1260</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={992} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEscalones acto={1} gFrame={1268 + (frame - 992)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Escalones · frontera 3 DESPUES · g1268</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1000} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEscalones acto={1} gFrame={1732 + (frame - 1000)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Escalones · frontera 4 ANTES · g1732</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1008} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEscalones acto={1} gFrame={1740 + (frame - 1008)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Escalones · acto 5 · g1740</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1016} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEscalones acto={1} gFrame={1748 + (frame - 1016)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Escalones · frontera 4 DESPUES · g1748</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1024} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLlave acto={1} gFrame={0 + (frame - 1024)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Llave · acto 1 · g0</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1032} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLlave acto={1} gFrame={412 + (frame - 1032)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Llave · frontera 1 ANTES · g412</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1040} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLlave acto={1} gFrame={420 + (frame - 1040)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Llave · acto 2 · g420</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1048} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLlave acto={1} gFrame={428 + (frame - 1048)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Llave · frontera 1 DESPUES · g428</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1056} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLlave acto={1} gFrame={832 + (frame - 1056)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Llave · frontera 2 ANTES · g832</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1064} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLlave acto={1} gFrame={840 + (frame - 1064)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Llave · acto 3 · g840</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1072} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLlave acto={1} gFrame={848 + (frame - 1072)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Llave · frontera 2 DESPUES · g848</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1080} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLlave acto={1} gFrame={1372 + (frame - 1080)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Llave · frontera 3 ANTES · g1372</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1088} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLlave acto={1} gFrame={1380 + (frame - 1088)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Llave · acto 4 · g1380</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1096} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLlave acto={1} gFrame={1388 + (frame - 1096)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Llave · frontera 3 DESPUES · g1388</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1104} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLlave acto={1} gFrame={1792 + (frame - 1104)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Llave · frontera 4 ANTES · g1792</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1112} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLlave acto={1} gFrame={1800 + (frame - 1112)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Llave · acto 5 · g1800</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1120} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLlave acto={1} gFrame={1808 + (frame - 1120)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Llave · frontera 4 DESPUES · g1808</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1128} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTresDias acto={1} gFrame={0 + (frame - 1128)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>TresDias · acto 1 · g0</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1136} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTresDias acto={1} gFrame={352 + (frame - 1136)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>TresDias · frontera 1 ANTES · g352</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1144} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTresDias acto={1} gFrame={360 + (frame - 1144)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>TresDias · acto 2 · g360</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1152} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTresDias acto={1} gFrame={368 + (frame - 1152)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>TresDias · frontera 1 DESPUES · g368</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1160} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTresDias acto={1} gFrame={772 + (frame - 1160)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>TresDias · frontera 2 ANTES · g772</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1168} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTresDias acto={1} gFrame={780 + (frame - 1168)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>TresDias · acto 3 · g780</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1176} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTresDias acto={1} gFrame={788 + (frame - 1176)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>TresDias · frontera 2 DESPUES · g788</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1184} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTresDias acto={1} gFrame={1192 + (frame - 1184)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>TresDias · frontera 3 ANTES · g1192</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1192} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTresDias acto={1} gFrame={1200 + (frame - 1192)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>TresDias · acto 4 · g1200</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1200} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTresDias acto={1} gFrame={1208 + (frame - 1200)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>TresDias · frontera 3 DESPUES · g1208</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1208} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPeligro acto={1} gFrame={0 + (frame - 1208)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Peligro · acto 1 · g0</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1216} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPeligro acto={1} gFrame={472 + (frame - 1216)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Peligro · frontera 1 ANTES · g472</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1224} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPeligro acto={1} gFrame={480 + (frame - 1224)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Peligro · acto 2 · g480</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1232} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPeligro acto={1} gFrame={488 + (frame - 1232)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Peligro · frontera 1 DESPUES · g488</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1240} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPeligro acto={1} gFrame={952 + (frame - 1240)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Peligro · frontera 2 ANTES · g952</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1248} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPeligro acto={1} gFrame={960 + (frame - 1248)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Peligro · acto 3 · g960</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1256} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPeligro acto={1} gFrame={968 + (frame - 1256)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Peligro · frontera 2 DESPUES · g968</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1264} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPeligro acto={1} gFrame={1432 + (frame - 1264)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Peligro · frontera 3 ANTES · g1432</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1272} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPeligro acto={1} gFrame={1440 + (frame - 1272)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Peligro · acto 4 · g1440</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1280} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPeligro acto={1} gFrame={1448 + (frame - 1280)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Peligro · frontera 3 DESPUES · g1448</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1288} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPeligro acto={1} gFrame={1852 + (frame - 1288)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Peligro · frontera 4 ANTES · g1852</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1296} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPeligro acto={1} gFrame={1860 + (frame - 1296)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Peligro · acto 5 · g1860</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1304} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPeligro acto={1} gFrame={1868 + (frame - 1304)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Peligro · frontera 4 DESPUES · g1868</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1312} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCuenta acto={1} gFrame={0 + (frame - 1312)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Cuenta · acto 1 · g0</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1320} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCuenta acto={1} gFrame={412 + (frame - 1320)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Cuenta · frontera 1 ANTES · g412</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1328} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCuenta acto={1} gFrame={420 + (frame - 1328)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Cuenta · acto 2 · g420</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1336} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCuenta acto={1} gFrame={428 + (frame - 1336)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Cuenta · frontera 1 DESPUES · g428</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1344} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCuenta acto={1} gFrame={892 + (frame - 1344)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Cuenta · frontera 2 ANTES · g892</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1352} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCuenta acto={1} gFrame={900 + (frame - 1352)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Cuenta · acto 3 · g900</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1360} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCuenta acto={1} gFrame={908 + (frame - 1360)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Cuenta · frontera 2 DESPUES · g908</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1368} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCuenta acto={1} gFrame={1372 + (frame - 1368)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Cuenta · frontera 3 ANTES · g1372</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1376} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCuenta acto={1} gFrame={1380 + (frame - 1376)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Cuenta · acto 4 · g1380</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1384} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCuenta acto={1} gFrame={1388 + (frame - 1384)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Cuenta · frontera 3 DESPUES · g1388</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1392} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCuenta acto={1} gFrame={1792 + (frame - 1392)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Cuenta · frontera 4 ANTES · g1792</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1400} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCuenta acto={1} gFrame={1800 + (frame - 1400)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Cuenta · acto 5 · g1800</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1408} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCuenta acto={1} gFrame={1808 + (frame - 1408)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Cuenta · frontera 4 DESPUES · g1808</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1416} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCierre acto={1} gFrame={0 + (frame - 1416)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Cierre · acto 1 · g0</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1424} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCierre acto={1} gFrame={352 + (frame - 1424)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Cierre · frontera 1 ANTES · g352</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1432} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCierre acto={1} gFrame={360 + (frame - 1432)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Cierre · acto 2 · g360</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1440} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCierre acto={1} gFrame={368 + (frame - 1440)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Cierre · frontera 1 DESPUES · g368</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1448} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCierre acto={1} gFrame={772 + (frame - 1448)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Cierre · frontera 2 ANTES · g772</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1456} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCierre acto={1} gFrame={780 + (frame - 1456)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Cierre · acto 3 · g780</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1464} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCierre acto={1} gFrame={788 + (frame - 1464)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Cierre · frontera 2 DESPUES · g788</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1472} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCierre acto={1} gFrame={1192 + (frame - 1472)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Cierre · frontera 3 ANTES · g1192</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1480} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCierre acto={1} gFrame={1200 + (frame - 1480)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Cierre · acto 4 · g1200</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1488} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCierre acto={1} gFrame={1208 + (frame - 1488)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Cierre · frontera 3 DESPUES · g1208</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1496} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCierre acto={1} gFrame={1612 + (frame - 1496)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Cierre · frontera 4 ANTES · g1612</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1504} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCierre acto={1} gFrame={1620 + (frame - 1504)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Cierre · acto 5 · g1620</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1512} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCierre acto={1} gFrame={1628 + (frame - 1512)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>Cierre · frontera 4 DESPUES · g1628</div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
