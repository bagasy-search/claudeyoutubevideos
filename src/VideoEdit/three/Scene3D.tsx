import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, delayRender, continueRender, staticFile } from "remotion";
import * as THREE from "three";
import { createCity } from "./cityScene.js";
import { createGlobe } from "./globeScene.js";
import { createNumber } from "./numberScene.js";
import { createOner } from "./onerScene.js";

type Factory = (r: THREE.WebGLRenderer, w: number, h: number, opts?: any) => { render: (t: number) => void };

// Imperative WebGL layer driven deterministically by Remotion's frame. The scene is built
// ONCE (per chunk) behind a delayRender gate; each frame draws synchronously in useLayoutEffect
// so the canvas holds the correct pixels before Remotion screenshots it. preserveDrawingBuffer
// keeps the buffer for the capture. Works in the farm's headless Chrome (swiftshader WebGL).
const Scene3D: React.FC<{ factory: Factory; opts?: any; w?: number; h?: number; tOffset?: number }>
  = ({ factory, opts, w = 1920, h = 1080, tOffset = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const eng = useRef<{ render: (t: number) => void } | null>(null);
  const rnd = useRef<THREE.WebGLRenderer | null>(null);
  const [handle] = useState(() => delayRender(`three-init`));

  useEffect(() => {
    const canvas = canvasRef.current!;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true, powerPreference: "high-performance" });
    rnd.current = renderer;
    eng.current = factory(renderer, w, h, opts);
    eng.current.render((frame / fps) + tOffset);
    continueRender(handle);
    return () => { renderer.dispose(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (eng.current) eng.current.render((frame / fps) + tOffset);
  }, [frame, fps, tOffset]);

  return (
    <AbsoluteFill>
      <canvas ref={canvasRef} width={w} height={h} style={{ width: "100%", height: "100%", display: "block" }} />
    </AbsoluteFill>
  );
};

export const City3D: React.FC<{ tOffset?: number }> = ({ tOffset }) => <Scene3D factory={createCity as Factory} tOffset={tOffset} />;
export const Globe3D: React.FC<{ tOffset?: number }> = ({ tOffset }) => <Scene3D factory={createGlobe as Factory} tOffset={tOffset} />;
export const Number3D: React.FC<{ num?: string; country?: string; accent?: string; tOffset?: number }>
  = ({ num, country, accent, tOffset }) => <Scene3D factory={createNumber as Factory} opts={{ num, country, accent }} tOffset={tOffset} />;
export const Oner3D: React.FC<{ tOffset?: number }> = ({ tOffset }) => <Scene3D factory={createOner as Factory} tOffset={tOffset} />;

export default Scene3D;
