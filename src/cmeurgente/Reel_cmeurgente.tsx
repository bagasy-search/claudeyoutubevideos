// Reel_cmeurgente.tsx — GENERADO por _v3/cmeg_reel.mjs. NO editar a mano.
// Muestras de cada acto y de los dos lados de cada frontera de los 17 movimientos.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { MovArrendamiento } from "./MovArrendamiento";
import { MovCableSuicida } from "./MovCableSuicida";
import { MovCeroDolares } from "./MovCeroDolares";
import { MovCientoVeintiseis } from "./MovCientoVeintiseis";
import { MovCierre } from "./MovCierre";
import { MovCuandoSi } from "./MovCuandoSi";
import { MovDesglose } from "./MovDesglose";
import { MovDosCaminos } from "./MovDosCaminos";
import { MovEscalonTarifa } from "./MovEscalonTarifa";
import { MovEscudo } from "./MovEscudo";
import { MovLadronesA } from "./MovLadronesA";
import { MovLadronesB } from "./MovLadronesB";
import { MovPresupuesto } from "./MovPresupuesto";
import { MovSemilla } from "./MovSemilla";
import { MovSetecientos } from "./MovSetecientos";
import { MovTreintaDias } from "./MovTreintaDias";
import { MovTresNumeros } from "./MovTresNumeros";

export const TOTAL_FRAMES_REEL = 1720;

export const ReelCmeurgente: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <Sequence from={0} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPresupuesto acto={1} gFrame={0 + (frame - 0)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovPresupuesto · acto 1 · g0</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={8} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPresupuesto acto={1} gFrame={349 + (frame - 8)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovPresupuesto · frontera 1 ANTES · g349</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={16} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPresupuesto acto={1} gFrame={357 + (frame - 16)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovPresupuesto · acto 2 · g357</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={24} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPresupuesto acto={1} gFrame={365 + (frame - 24)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovPresupuesto · frontera 1 DESPUES · g365</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={32} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPresupuesto acto={1} gFrame={679 + (frame - 32)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovPresupuesto · frontera 2 ANTES · g679</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={40} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPresupuesto acto={1} gFrame={687 + (frame - 40)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovPresupuesto · acto 3 · g687</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={48} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPresupuesto acto={1} gFrame={695 + (frame - 48)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovPresupuesto · frontera 2 DESPUES · g695</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={56} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPresupuesto acto={1} gFrame={979 + (frame - 56)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovPresupuesto · frontera 3 ANTES · g979</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={64} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPresupuesto acto={1} gFrame={987 + (frame - 64)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovPresupuesto · acto 4 · g987</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={72} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPresupuesto acto={1} gFrame={995 + (frame - 72)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovPresupuesto · frontera 3 DESPUES · g995</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={80} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPresupuesto acto={1} gFrame={1309 + (frame - 80)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovPresupuesto · frontera 4 ANTES · g1309</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={88} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPresupuesto acto={1} gFrame={1317 + (frame - 88)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovPresupuesto · acto 5 · g1317</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={96} durationInFrames={8} layout="none">
        <AbsoluteFill><MovPresupuesto acto={1} gFrame={1325 + (frame - 96)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovPresupuesto · frontera 4 DESPUES · g1325</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={104} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTreintaDias acto={1} gFrame={0 + (frame - 104)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovTreintaDias · acto 1 · g0</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={112} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTreintaDias acto={1} gFrame={364 + (frame - 112)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovTreintaDias · frontera 1 ANTES · g364</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={120} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTreintaDias acto={1} gFrame={372 + (frame - 120)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovTreintaDias · acto 2 · g372</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={128} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTreintaDias acto={1} gFrame={380 + (frame - 128)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovTreintaDias · frontera 1 DESPUES · g380</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={136} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTreintaDias acto={1} gFrame={724 + (frame - 136)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovTreintaDias · frontera 2 ANTES · g724</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={144} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTreintaDias acto={1} gFrame={732 + (frame - 144)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovTreintaDias · acto 3 · g732</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={152} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTreintaDias acto={1} gFrame={740 + (frame - 152)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovTreintaDias · frontera 2 DESPUES · g740</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={160} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTreintaDias acto={1} gFrame={1114 + (frame - 160)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovTreintaDias · frontera 3 ANTES · g1114</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={168} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTreintaDias acto={1} gFrame={1122 + (frame - 168)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovTreintaDias · acto 4 · g1122</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={176} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTreintaDias acto={1} gFrame={1130 + (frame - 176)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovTreintaDias · frontera 3 DESPUES · g1130</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={184} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTreintaDias acto={1} gFrame={1474 + (frame - 184)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovTreintaDias · frontera 4 ANTES · g1474</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={192} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTreintaDias acto={1} gFrame={1482 + (frame - 192)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovTreintaDias · acto 5 · g1482</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={200} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTreintaDias acto={1} gFrame={1490 + (frame - 200)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovTreintaDias · frontera 4 DESPUES · g1490</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={208} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEscudo acto={1} gFrame={0 + (frame - 208)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovEscudo · acto 1 · g0</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={216} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEscudo acto={1} gFrame={419 + (frame - 216)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovEscudo · frontera 1 ANTES · g419</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={224} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEscudo acto={1} gFrame={427 + (frame - 224)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovEscudo · acto 2 · g427</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={232} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEscudo acto={1} gFrame={435 + (frame - 232)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovEscudo · frontera 1 DESPUES · g435</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={240} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEscudo acto={1} gFrame={839 + (frame - 240)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovEscudo · frontera 2 ANTES · g839</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={248} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEscudo acto={1} gFrame={847 + (frame - 248)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovEscudo · acto 3 · g847</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={256} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEscudo acto={1} gFrame={855 + (frame - 256)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovEscudo · frontera 2 DESPUES · g855</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={264} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEscudo acto={1} gFrame={1319 + (frame - 264)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovEscudo · frontera 3 ANTES · g1319</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={272} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEscudo acto={1} gFrame={1327 + (frame - 272)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovEscudo · acto 4 · g1327</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={280} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEscudo acto={1} gFrame={1335 + (frame - 280)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovEscudo · frontera 3 DESPUES · g1335</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={288} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDesglose acto={1} gFrame={0 + (frame - 288)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovDesglose · acto 1 · g0</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={296} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDesglose acto={1} gFrame={322 + (frame - 296)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovDesglose · frontera 1 ANTES · g322</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={304} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDesglose acto={1} gFrame={330 + (frame - 304)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovDesglose · acto 2 · g330</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={312} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDesglose acto={1} gFrame={338 + (frame - 312)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovDesglose · frontera 1 DESPUES · g338</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={320} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDesglose acto={1} gFrame={712 + (frame - 320)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovDesglose · frontera 2 ANTES · g712</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={328} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDesglose acto={1} gFrame={720 + (frame - 328)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovDesglose · acto 3 · g720</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={336} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDesglose acto={1} gFrame={728 + (frame - 336)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovDesglose · frontera 2 DESPUES · g728</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={344} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDesglose acto={1} gFrame={1132 + (frame - 344)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovDesglose · frontera 3 ANTES · g1132</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={352} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDesglose acto={1} gFrame={1140 + (frame - 352)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovDesglose · acto 4 · g1140</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={360} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDesglose acto={1} gFrame={1148 + (frame - 360)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovDesglose · frontera 3 DESPUES · g1148</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={368} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDesglose acto={1} gFrame={1492 + (frame - 368)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovDesglose · frontera 4 ANTES · g1492</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={376} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDesglose acto={1} gFrame={1500 + (frame - 376)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovDesglose · acto 5 · g1500</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={384} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDesglose acto={1} gFrame={1508 + (frame - 384)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovDesglose · frontera 4 DESPUES · g1508</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={392} durationInFrames={8} layout="none">
        <AbsoluteFill><MovSemilla acto={1} gFrame={0 + (frame - 392)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovSemilla · acto 1 · g0</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={400} durationInFrames={8} layout="none">
        <AbsoluteFill><MovSemilla acto={1} gFrame={352 + (frame - 400)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovSemilla · frontera 1 ANTES · g352</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={408} durationInFrames={8} layout="none">
        <AbsoluteFill><MovSemilla acto={1} gFrame={360 + (frame - 408)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovSemilla · acto 2 · g360</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={416} durationInFrames={8} layout="none">
        <AbsoluteFill><MovSemilla acto={1} gFrame={368 + (frame - 416)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovSemilla · frontera 1 DESPUES · g368</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={424} durationInFrames={8} layout="none">
        <AbsoluteFill><MovSemilla acto={1} gFrame={712 + (frame - 424)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovSemilla · frontera 2 ANTES · g712</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={432} durationInFrames={8} layout="none">
        <AbsoluteFill><MovSemilla acto={1} gFrame={720 + (frame - 432)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovSemilla · acto 3 · g720</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={440} durationInFrames={8} layout="none">
        <AbsoluteFill><MovSemilla acto={1} gFrame={728 + (frame - 440)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovSemilla · frontera 2 DESPUES · g728</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={448} durationInFrames={8} layout="none">
        <AbsoluteFill><MovSemilla acto={1} gFrame={1012 + (frame - 448)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovSemilla · frontera 3 ANTES · g1012</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={456} durationInFrames={8} layout="none">
        <AbsoluteFill><MovSemilla acto={1} gFrame={1020 + (frame - 456)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovSemilla · acto 4 · g1020</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={464} durationInFrames={8} layout="none">
        <AbsoluteFill><MovSemilla acto={1} gFrame={1028 + (frame - 464)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovSemilla · frontera 3 DESPUES · g1028</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={472} durationInFrames={8} layout="none">
        <AbsoluteFill><MovSetecientos acto={1} gFrame={0 + (frame - 472)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovSetecientos · acto 1 · g0</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={480} durationInFrames={8} layout="none">
        <AbsoluteFill><MovSetecientos acto={1} gFrame={412 + (frame - 480)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovSetecientos · frontera 1 ANTES · g412</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={488} durationInFrames={8} layout="none">
        <AbsoluteFill><MovSetecientos acto={1} gFrame={420 + (frame - 488)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovSetecientos · acto 2 · g420</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={496} durationInFrames={8} layout="none">
        <AbsoluteFill><MovSetecientos acto={1} gFrame={428 + (frame - 496)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovSetecientos · frontera 1 DESPUES · g428</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={504} durationInFrames={8} layout="none">
        <AbsoluteFill><MovSetecientos acto={1} gFrame={832 + (frame - 504)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovSetecientos · frontera 2 ANTES · g832</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={512} durationInFrames={8} layout="none">
        <AbsoluteFill><MovSetecientos acto={1} gFrame={840 + (frame - 512)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovSetecientos · acto 3 · g840</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={520} durationInFrames={8} layout="none">
        <AbsoluteFill><MovSetecientos acto={1} gFrame={848 + (frame - 520)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovSetecientos · frontera 2 DESPUES · g848</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={528} durationInFrames={8} layout="none">
        <AbsoluteFill><MovSetecientos acto={1} gFrame={1222 + (frame - 528)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovSetecientos · frontera 3 ANTES · g1222</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={536} durationInFrames={8} layout="none">
        <AbsoluteFill><MovSetecientos acto={1} gFrame={1230 + (frame - 536)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovSetecientos · acto 4 · g1230</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={544} durationInFrames={8} layout="none">
        <AbsoluteFill><MovSetecientos acto={1} gFrame={1238 + (frame - 544)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovSetecientos · frontera 3 DESPUES · g1238</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={552} durationInFrames={8} layout="none">
        <AbsoluteFill><MovSetecientos acto={1} gFrame={1552 + (frame - 552)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovSetecientos · frontera 4 ANTES · g1552</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={560} durationInFrames={8} layout="none">
        <AbsoluteFill><MovSetecientos acto={1} gFrame={1560 + (frame - 560)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovSetecientos · acto 5 · g1560</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={568} durationInFrames={8} layout="none">
        <AbsoluteFill><MovSetecientos acto={1} gFrame={1568 + (frame - 568)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovSetecientos · frontera 4 DESPUES · g1568</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={576} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTresNumeros acto={1} gFrame={0 + (frame - 576)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovTresNumeros · acto 1 · g0</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={584} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTresNumeros acto={1} gFrame={352 + (frame - 584)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovTresNumeros · frontera 1 ANTES · g352</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={592} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTresNumeros acto={1} gFrame={360 + (frame - 592)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovTresNumeros · acto 2 · g360</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={600} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTresNumeros acto={1} gFrame={368 + (frame - 600)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovTresNumeros · frontera 1 DESPUES · g368</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={608} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTresNumeros acto={1} gFrame={832 + (frame - 608)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovTresNumeros · frontera 2 ANTES · g832</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={616} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTresNumeros acto={1} gFrame={840 + (frame - 616)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovTresNumeros · acto 3 · g840</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={624} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTresNumeros acto={1} gFrame={848 + (frame - 624)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovTresNumeros · frontera 2 DESPUES · g848</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={632} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTresNumeros acto={1} gFrame={1312 + (frame - 632)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovTresNumeros · frontera 3 ANTES · g1312</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={640} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTresNumeros acto={1} gFrame={1320 + (frame - 640)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovTresNumeros · acto 4 · g1320</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={648} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTresNumeros acto={1} gFrame={1328 + (frame - 648)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovTresNumeros · frontera 3 DESPUES · g1328</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={656} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTresNumeros acto={1} gFrame={1702 + (frame - 656)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovTresNumeros · frontera 4 ANTES · g1702</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={664} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTresNumeros acto={1} gFrame={1710 + (frame - 664)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovTresNumeros · acto 5 · g1710</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={672} durationInFrames={8} layout="none">
        <AbsoluteFill><MovTresNumeros acto={1} gFrame={1718 + (frame - 672)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovTresNumeros · frontera 4 DESPUES · g1718</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={680} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEscalonTarifa acto={1} gFrame={0 + (frame - 680)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovEscalonTarifa · acto 1 · g0</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={688} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEscalonTarifa acto={1} gFrame={412 + (frame - 688)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovEscalonTarifa · frontera 1 ANTES · g412</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={696} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEscalonTarifa acto={1} gFrame={420 + (frame - 696)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovEscalonTarifa · acto 2 · g420</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={704} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEscalonTarifa acto={1} gFrame={428 + (frame - 704)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovEscalonTarifa · frontera 1 DESPUES · g428</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={712} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEscalonTarifa acto={1} gFrame={862 + (frame - 712)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovEscalonTarifa · frontera 2 ANTES · g862</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={720} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEscalonTarifa acto={1} gFrame={870 + (frame - 720)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovEscalonTarifa · acto 3 · g870</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={728} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEscalonTarifa acto={1} gFrame={878 + (frame - 728)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovEscalonTarifa · frontera 2 DESPUES · g878</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={736} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEscalonTarifa acto={1} gFrame={1252 + (frame - 736)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovEscalonTarifa · frontera 3 ANTES · g1252</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={744} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEscalonTarifa acto={1} gFrame={1260 + (frame - 744)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovEscalonTarifa · acto 4 · g1260</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={752} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEscalonTarifa acto={1} gFrame={1268 + (frame - 752)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovEscalonTarifa · frontera 3 DESPUES · g1268</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={760} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEscalonTarifa acto={1} gFrame={1612 + (frame - 760)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovEscalonTarifa · frontera 4 ANTES · g1612</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={768} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEscalonTarifa acto={1} gFrame={1620 + (frame - 768)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovEscalonTarifa · acto 5 · g1620</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={776} durationInFrames={8} layout="none">
        <AbsoluteFill><MovEscalonTarifa acto={1} gFrame={1628 + (frame - 776)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovEscalonTarifa · frontera 4 DESPUES · g1628</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={784} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLadronesA acto={1} gFrame={0 + (frame - 784)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovLadronesA · acto 1 · g0</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={792} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLadronesA acto={1} gFrame={352 + (frame - 792)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovLadronesA · frontera 1 ANTES · g352</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={800} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLadronesA acto={1} gFrame={360 + (frame - 800)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovLadronesA · acto 2 · g360</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={808} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLadronesA acto={1} gFrame={368 + (frame - 808)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovLadronesA · frontera 1 DESPUES · g368</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={816} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLadronesA acto={1} gFrame={712 + (frame - 816)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovLadronesA · frontera 2 ANTES · g712</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={824} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLadronesA acto={1} gFrame={720 + (frame - 824)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovLadronesA · acto 3 · g720</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={832} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLadronesA acto={1} gFrame={728 + (frame - 832)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovLadronesA · frontera 2 DESPUES · g728</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={840} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLadronesA acto={1} gFrame={1102 + (frame - 840)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovLadronesA · frontera 3 ANTES · g1102</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={848} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLadronesA acto={1} gFrame={1110 + (frame - 848)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovLadronesA · acto 4 · g1110</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={856} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLadronesA acto={1} gFrame={1118 + (frame - 856)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovLadronesA · frontera 3 DESPUES · g1118</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={864} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLadronesA acto={1} gFrame={1492 + (frame - 864)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovLadronesA · frontera 4 ANTES · g1492</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={872} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLadronesA acto={1} gFrame={1500 + (frame - 872)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovLadronesA · acto 5 · g1500</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={880} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLadronesA acto={1} gFrame={1508 + (frame - 880)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovLadronesA · frontera 4 DESPUES · g1508</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={888} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLadronesB acto={1} gFrame={0 + (frame - 888)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovLadronesB · acto 1 · g0</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={896} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLadronesB acto={1} gFrame={412 + (frame - 896)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovLadronesB · frontera 1 ANTES · g412</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={904} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLadronesB acto={1} gFrame={420 + (frame - 904)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovLadronesB · acto 2 · g420</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={912} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLadronesB acto={1} gFrame={428 + (frame - 912)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovLadronesB · frontera 1 DESPUES · g428</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={920} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLadronesB acto={1} gFrame={772 + (frame - 920)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovLadronesB · frontera 2 ANTES · g772</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={928} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLadronesB acto={1} gFrame={780 + (frame - 928)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovLadronesB · acto 3 · g780</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={936} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLadronesB acto={1} gFrame={788 + (frame - 936)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovLadronesB · frontera 2 DESPUES · g788</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={944} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLadronesB acto={1} gFrame={1252 + (frame - 944)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovLadronesB · frontera 3 ANTES · g1252</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={952} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLadronesB acto={1} gFrame={1260 + (frame - 952)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovLadronesB · acto 4 · g1260</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={960} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLadronesB acto={1} gFrame={1268 + (frame - 960)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovLadronesB · frontera 3 DESPUES · g1268</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={968} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLadronesB acto={1} gFrame={1612 + (frame - 968)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovLadronesB · frontera 4 ANTES · g1612</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={976} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLadronesB acto={1} gFrame={1620 + (frame - 976)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovLadronesB · acto 5 · g1620</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={984} durationInFrames={8} layout="none">
        <AbsoluteFill><MovLadronesB acto={1} gFrame={1628 + (frame - 984)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovLadronesB · frontera 4 DESPUES · g1628</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={992} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCeroDolares acto={1} gFrame={0 + (frame - 992)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCeroDolares · acto 1 · g0</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1000} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCeroDolares acto={1} gFrame={382 + (frame - 1000)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCeroDolares · frontera 1 ANTES · g382</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1008} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCeroDolares acto={1} gFrame={390 + (frame - 1008)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCeroDolares · acto 2 · g390</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1016} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCeroDolares acto={1} gFrame={398 + (frame - 1016)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCeroDolares · frontera 1 DESPUES · g398</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1024} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCeroDolares acto={1} gFrame={802 + (frame - 1024)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCeroDolares · frontera 2 ANTES · g802</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1032} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCeroDolares acto={1} gFrame={810 + (frame - 1032)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCeroDolares · acto 3 · g810</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1040} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCeroDolares acto={1} gFrame={818 + (frame - 1040)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCeroDolares · frontera 2 DESPUES · g818</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1048} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCeroDolares acto={1} gFrame={1222 + (frame - 1048)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCeroDolares · frontera 3 ANTES · g1222</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1056} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCeroDolares acto={1} gFrame={1230 + (frame - 1056)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCeroDolares · acto 4 · g1230</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1064} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCeroDolares acto={1} gFrame={1238 + (frame - 1064)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCeroDolares · frontera 3 DESPUES · g1238</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1072} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCeroDolares acto={1} gFrame={1612 + (frame - 1072)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCeroDolares · frontera 4 ANTES · g1612</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1080} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCeroDolares acto={1} gFrame={1620 + (frame - 1080)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCeroDolares · acto 5 · g1620</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1088} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCeroDolares acto={1} gFrame={1628 + (frame - 1088)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCeroDolares · frontera 4 DESPUES · g1628</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1096} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCientoVeintiseis acto={1} gFrame={0 + (frame - 1096)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCientoVeintiseis · acto 1 · g0</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1104} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCientoVeintiseis acto={1} gFrame={352 + (frame - 1104)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCientoVeintiseis · frontera 1 ANTES · g352</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1112} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCientoVeintiseis acto={1} gFrame={360 + (frame - 1112)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCientoVeintiseis · acto 2 · g360</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1120} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCientoVeintiseis acto={1} gFrame={368 + (frame - 1120)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCientoVeintiseis · frontera 1 DESPUES · g368</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1128} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCientoVeintiseis acto={1} gFrame={712 + (frame - 1128)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCientoVeintiseis · frontera 2 ANTES · g712</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1136} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCientoVeintiseis acto={1} gFrame={720 + (frame - 1136)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCientoVeintiseis · acto 3 · g720</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1144} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCientoVeintiseis acto={1} gFrame={728 + (frame - 1144)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCientoVeintiseis · frontera 2 DESPUES · g728</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1152} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCientoVeintiseis acto={1} gFrame={1132 + (frame - 1152)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCientoVeintiseis · frontera 3 ANTES · g1132</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1160} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCientoVeintiseis acto={1} gFrame={1140 + (frame - 1160)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCientoVeintiseis · acto 4 · g1140</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1168} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCientoVeintiseis acto={1} gFrame={1148 + (frame - 1168)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCientoVeintiseis · frontera 3 DESPUES · g1148</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1176} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCientoVeintiseis acto={1} gFrame={1492 + (frame - 1176)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCientoVeintiseis · frontera 4 ANTES · g1492</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1184} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCientoVeintiseis acto={1} gFrame={1500 + (frame - 1184)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCientoVeintiseis · acto 5 · g1500</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1192} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCientoVeintiseis acto={1} gFrame={1508 + (frame - 1192)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCientoVeintiseis · frontera 4 DESPUES · g1508</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1200} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCableSuicida acto={1} gFrame={0 + (frame - 1200)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCableSuicida · acto 1 · g0</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1208} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCableSuicida acto={1} gFrame={382 + (frame - 1208)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCableSuicida · frontera 1 ANTES · g382</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1216} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCableSuicida acto={1} gFrame={390 + (frame - 1216)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCableSuicida · acto 2 · g390</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1224} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCableSuicida acto={1} gFrame={398 + (frame - 1224)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCableSuicida · frontera 1 DESPUES · g398</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1232} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCableSuicida acto={1} gFrame={802 + (frame - 1232)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCableSuicida · frontera 2 ANTES · g802</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1240} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCableSuicida acto={1} gFrame={810 + (frame - 1240)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCableSuicida · acto 3 · g810</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1248} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCableSuicida acto={1} gFrame={818 + (frame - 1248)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCableSuicida · frontera 2 DESPUES · g818</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1256} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCableSuicida acto={1} gFrame={1222 + (frame - 1256)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCableSuicida · frontera 3 ANTES · g1222</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1264} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCableSuicida acto={1} gFrame={1230 + (frame - 1264)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCableSuicida · acto 4 · g1230</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1272} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCableSuicida acto={1} gFrame={1238 + (frame - 1272)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCableSuicida · frontera 3 DESPUES · g1238</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1280} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCableSuicida acto={1} gFrame={1582 + (frame - 1280)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCableSuicida · frontera 4 ANTES · g1582</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1288} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCableSuicida acto={1} gFrame={1590 + (frame - 1288)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCableSuicida · acto 5 · g1590</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1296} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCableSuicida acto={1} gFrame={1598 + (frame - 1296)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCableSuicida · frontera 4 DESPUES · g1598</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1304} durationInFrames={8} layout="none">
        <AbsoluteFill><MovArrendamiento acto={1} gFrame={0 + (frame - 1304)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovArrendamiento · acto 1 · g0</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1312} durationInFrames={8} layout="none">
        <AbsoluteFill><MovArrendamiento acto={1} gFrame={382 + (frame - 1312)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovArrendamiento · frontera 1 ANTES · g382</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1320} durationInFrames={8} layout="none">
        <AbsoluteFill><MovArrendamiento acto={1} gFrame={390 + (frame - 1320)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovArrendamiento · acto 2 · g390</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1328} durationInFrames={8} layout="none">
        <AbsoluteFill><MovArrendamiento acto={1} gFrame={398 + (frame - 1328)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovArrendamiento · frontera 1 DESPUES · g398</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1336} durationInFrames={8} layout="none">
        <AbsoluteFill><MovArrendamiento acto={1} gFrame={832 + (frame - 1336)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovArrendamiento · frontera 2 ANTES · g832</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1344} durationInFrames={8} layout="none">
        <AbsoluteFill><MovArrendamiento acto={1} gFrame={840 + (frame - 1344)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovArrendamiento · acto 3 · g840</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1352} durationInFrames={8} layout="none">
        <AbsoluteFill><MovArrendamiento acto={1} gFrame={848 + (frame - 1352)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovArrendamiento · frontera 2 DESPUES · g848</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1360} durationInFrames={8} layout="none">
        <AbsoluteFill><MovArrendamiento acto={1} gFrame={1282 + (frame - 1360)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovArrendamiento · frontera 3 ANTES · g1282</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1368} durationInFrames={8} layout="none">
        <AbsoluteFill><MovArrendamiento acto={1} gFrame={1290 + (frame - 1368)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovArrendamiento · acto 4 · g1290</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1376} durationInFrames={8} layout="none">
        <AbsoluteFill><MovArrendamiento acto={1} gFrame={1298 + (frame - 1376)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovArrendamiento · frontera 3 DESPUES · g1298</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1384} durationInFrames={8} layout="none">
        <AbsoluteFill><MovArrendamiento acto={1} gFrame={1612 + (frame - 1384)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovArrendamiento · frontera 4 ANTES · g1612</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1392} durationInFrames={8} layout="none">
        <AbsoluteFill><MovArrendamiento acto={1} gFrame={1620 + (frame - 1392)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovArrendamiento · acto 5 · g1620</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1400} durationInFrames={8} layout="none">
        <AbsoluteFill><MovArrendamiento acto={1} gFrame={1628 + (frame - 1400)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovArrendamiento · frontera 4 DESPUES · g1628</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1408} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDosCaminos acto={1} gFrame={0 + (frame - 1408)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovDosCaminos · acto 1 · g0</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1416} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDosCaminos acto={1} gFrame={442 + (frame - 1416)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovDosCaminos · frontera 1 ANTES · g442</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1424} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDosCaminos acto={1} gFrame={450 + (frame - 1424)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovDosCaminos · acto 2 · g450</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1432} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDosCaminos acto={1} gFrame={458 + (frame - 1432)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovDosCaminos · frontera 1 DESPUES · g458</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1440} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDosCaminos acto={1} gFrame={892 + (frame - 1440)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovDosCaminos · frontera 2 ANTES · g892</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1448} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDosCaminos acto={1} gFrame={900 + (frame - 1448)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovDosCaminos · acto 3 · g900</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1456} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDosCaminos acto={1} gFrame={908 + (frame - 1456)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovDosCaminos · frontera 2 DESPUES · g908</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1464} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDosCaminos acto={1} gFrame={1342 + (frame - 1464)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovDosCaminos · frontera 3 ANTES · g1342</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1472} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDosCaminos acto={1} gFrame={1350 + (frame - 1472)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovDosCaminos · acto 4 · g1350</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1480} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDosCaminos acto={1} gFrame={1358 + (frame - 1480)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovDosCaminos · frontera 3 DESPUES · g1358</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1488} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDosCaminos acto={1} gFrame={1732 + (frame - 1488)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovDosCaminos · frontera 4 ANTES · g1732</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1496} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDosCaminos acto={1} gFrame={1740 + (frame - 1496)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovDosCaminos · acto 5 · g1740</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1504} durationInFrames={8} layout="none">
        <AbsoluteFill><MovDosCaminos acto={1} gFrame={1748 + (frame - 1504)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovDosCaminos · frontera 4 DESPUES · g1748</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1512} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCuandoSi acto={1} gFrame={0 + (frame - 1512)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCuandoSi · acto 1 · g0</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1520} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCuandoSi acto={1} gFrame={412 + (frame - 1520)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCuandoSi · frontera 1 ANTES · g412</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1528} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCuandoSi acto={1} gFrame={420 + (frame - 1528)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCuandoSi · acto 2 · g420</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1536} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCuandoSi acto={1} gFrame={428 + (frame - 1536)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCuandoSi · frontera 1 DESPUES · g428</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1544} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCuandoSi acto={1} gFrame={892 + (frame - 1544)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCuandoSi · frontera 2 ANTES · g892</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1552} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCuandoSi acto={1} gFrame={900 + (frame - 1552)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCuandoSi · acto 3 · g900</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1560} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCuandoSi acto={1} gFrame={908 + (frame - 1560)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCuandoSi · frontera 2 DESPUES · g908</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1568} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCuandoSi acto={1} gFrame={1372 + (frame - 1568)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCuandoSi · frontera 3 ANTES · g1372</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1576} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCuandoSi acto={1} gFrame={1380 + (frame - 1576)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCuandoSi · acto 4 · g1380</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1584} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCuandoSi acto={1} gFrame={1388 + (frame - 1584)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCuandoSi · frontera 3 DESPUES · g1388</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1592} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCuandoSi acto={1} gFrame={1732 + (frame - 1592)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCuandoSi · frontera 4 ANTES · g1732</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1600} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCuandoSi acto={1} gFrame={1740 + (frame - 1600)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCuandoSi · acto 5 · g1740</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1608} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCuandoSi acto={1} gFrame={1748 + (frame - 1608)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCuandoSi · frontera 4 DESPUES · g1748</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1616} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCierre acto={1} gFrame={0 + (frame - 1616)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCierre · acto 1 · g0</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1624} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCierre acto={1} gFrame={352 + (frame - 1624)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCierre · frontera 1 ANTES · g352</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1632} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCierre acto={1} gFrame={360 + (frame - 1632)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCierre · acto 2 · g360</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1640} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCierre acto={1} gFrame={368 + (frame - 1640)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCierre · frontera 1 DESPUES · g368</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1648} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCierre acto={1} gFrame={772 + (frame - 1648)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCierre · frontera 2 ANTES · g772</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1656} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCierre acto={1} gFrame={780 + (frame - 1656)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCierre · acto 3 · g780</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1664} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCierre acto={1} gFrame={788 + (frame - 1664)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCierre · frontera 2 DESPUES · g788</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1672} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCierre acto={1} gFrame={952 + (frame - 1672)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCierre · frontera 3 ANTES · g952</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1680} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCierre acto={1} gFrame={960 + (frame - 1680)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCierre · acto 4 · g960</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1688} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCierre acto={1} gFrame={968 + (frame - 1688)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCierre · frontera 3 DESPUES · g968</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1696} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCierre acto={1} gFrame={1252 + (frame - 1696)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCierre · frontera 4 ANTES · g1252</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1704} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCierre acto={1} gFrame={1260 + (frame - 1704)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCierre · acto 5 · g1260</div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1712} durationInFrames={8} layout="none">
        <AbsoluteFill><MovCierre acto={1} gFrame={1268 + (frame - 1712)} /></AbsoluteFill>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 24, bottom: 20, padding: "8px 14px", background: "rgba(0,0,0,.72)", color: "#C8F000", font: "600 26px Inter, sans-serif" }}>MovCierre · frontera 4 DESPUES · g1268</div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
