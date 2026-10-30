// Post-proceso de cine para las escenas de la balsa: AO de contacto (GTAO), profundidad de campo (bokeh),
// bloom suave (lámpara y brillos del agua) y salida con ACES. Todo determinista por cuadro.
// Objetos con userData.sinPost (haz de luz, halos, gotas) se ocultan para los pases de AO y de profundidad.
// ⛔ Nada de escala 0 con bloom (NaN = rectángulo negro): ocultar con visible=false.
import React, { useMemo } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { Pass } from "three/examples/jsm/postprocessing/Pass.js";

class PaseVisibilidad extends Pass {
  constructor(private escena: THREE.Scene, private ver: boolean) { super(); this.needsSwap = false; }
  render() {
    this.escena.traverse((o) => { if (o.userData.sinPost) o.visible = this.ver ? o.userData.verPost !== false : false; });
  }
}

export type OpcionesPost = {
  foco: number; // distancia de foco (unidades del mundo, desde la cámara)
  apertura?: number; // fuerza del desenfoque
  maxDesenfoque?: number;
  bloom?: number;
  umbral?: number;
  ao?: number; // mezcla del AO (0–1)
  radioAO?: number;
};

export const Post: React.FC<OpcionesPost> = ({ foco, apertura = 0.00025, maxDesenfoque = 0.006, bloom = 0.32, umbral = 0.82, ao = 1, radioAO = 0.32 }) => {
  const { gl, scene, camera, size } = useThree();
  const p = useMemo(() => {
    const pr = gl.getPixelRatio();
    const W = Math.round(size.width * pr), H = Math.round(size.height * pr);
    const rt = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 });
    const c = new EffectComposer(gl, rt);
    c.setPixelRatio(pr); c.setSize(size.width, size.height);
    const rp = new RenderPass(scene, camera);
    const gtao = new GTAOPass(scene, camera, W, H);
    gtao.output = GTAOPass.OUTPUT.Default;
    gtao.updateGtaoMaterial({ radius: radioAO, distanceExponent: 1.6, thickness: 1.2, scale: 1.15, samples: 16, distanceFallOff: 1, screenSpaceRadius: false });
    gtao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 16 });
    const bokeh = new BokehPass(scene, camera, { focus: foco, aperture: apertura, maxblur: maxDesenfoque });
    const bl = new UnrealBloomPass(new THREE.Vector2(W, H), bloom, 0.55, umbral);
    c.addPass(rp);
    c.addPass(new PaseVisibilidad(scene, false));
    c.addPass(gtao);
    c.addPass(bokeh);
    c.addPass(new PaseVisibilidad(scene, true));
    c.addPass(bl);
    c.addPass(new OutputPass());
    return { c, gtao, bokeh, bl };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl, scene, camera, size.width, size.height]);
  p.gtao.blendIntensity = ao;
  const u = (p.bokeh as unknown as { uniforms: Record<string, { value: number }> }).uniforms;
  u.focus.value = foco; u.aperture.value = apertura; u.maxblur.value = maxDesenfoque;
  p.bl.strength = bloom; p.bl.threshold = umbral;
  useFrame(() => { p.c.render(); }, 1);
  return null;
};
