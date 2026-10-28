// Blanquito delante de CUALQUIER imagen de fondo: la cámara se calibra con el horizonte de la foto, el personaje
// se planta donde se le diga (en píxeles relativos de la imagen) con el tamaño pedido, la luz y el rebote toman
// el color de la foto ('auto' = promedio medido por canvas) y la sombra de contacto lo apoya en el piso.
// Uso:
//   <StickmanEnFondo fondo="cocina.jpg" horizonte={0.42} personajes={[{ piso: [0.5, 0.86], alto: 0.55, guion: [...] }]} />
import React, { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, Img, continueRender, delayRender, staticFile, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { Stickman, StickmanProps } from "./Stickman";
import { Camara3D, Luces } from "./iluminacion";
import { PROPORCIONES as P } from "./proporciones";
import type { V3 } from "./geometria";

export type PersonajeEnFondo = StickmanProps & {
  piso: [number, number]; // dónde apoya los pies: [x, y] en fracción de la imagen (0–1, desde arriba a la izquierda)
  alto?: number; // alto del personaje parado en fracción de la altura del cuadro (default: el de `escala` del fondo)
};

export type StickmanEnFondoProps = {
  fondo: string; // archivo de public/ (staticFile) o URL
  horizonte?: number; // altura de la línea del horizonte en la foto (0 arriba, 1 abajo)
  fov?: number; // campo visual vertical de la foto (º): 40 = tele, 55 = celular, 70 = gran angular
  escala?: number; // alto del personaje en fracción del cuadro (si el personaje no trae `alto`)
  personajes: PersonajeEnFondo[];
  dirLuz?: "izq" | "der" | "arriba" | V3; // de dónde viene la luz principal de la foto
  tinte?: "auto" | string; // color del ambiente
  piso?: "auto" | string; // color del rebote del piso
  sombra?: number; // opacidad de la sombra proyectada (0–0,3)
  contacto?: number; // fuerza de la sombra de contacto
  brillo?: "auto" | number; // multiplicador de la luz (auto = según la luminancia de la foto)
  oscurecer?: number; // opcional: oscurece la foto (0–1) para despegar al personaje. Default 0
  desenfoque?: number; // opcional: desenfoque de la foto en px. Default 0
};

const resolverSrc = (s: string) => (/^(https?:|data:|blob:)/.test(s) ? s : staticFile(s));

// color medio de la foto entera y de la franja de abajo (piso), en sRGB 0–1
type Muestra = { media: [number, number, number]; abajo: [number, number, number]; luz: number };
const medirFoto = (src: string, hecho: (m: Muestra) => void, error: () => void) => {
  const im = new Image();
  im.crossOrigin = "anonymous";
  im.onload = () => {
    const c = document.createElement("canvas");
    c.width = 48; c.height = 27;
    const g = c.getContext("2d");
    if (!g) return error();
    g.drawImage(im, 0, 0, 48, 27);
    const d = g.getImageData(0, 0, 48, 27).data;
    const acc = (y0: number, y1: number) => {
      let r = 0, gg = 0, b = 0, n = 0;
      for (let y = y0; y < y1; y++) for (let x = 0; x < 48; x++) { const i = (y * 48 + x) * 4; r += d[i]; gg += d[i + 1]; b += d[i + 2]; n++; }
      return [r / n / 255, gg / n / 255, b / n / 255] as [number, number, number];
    };
    const media = acc(0, 27), abajo = acc(20, 27);
    const luz = 0.2126 * media[0] + 0.7152 * media[1] + 0.0722 * media[2];
    hecho({ media, abajo, luz });
  };
  im.onerror = error;
  im.src = src;
};

const hex = (c: [number, number, number], mezcla: number) => {
  // acerca el color a blanco (el tinte de ambiente no puede teñir de más al personaje blanco)
  const t = c.map((v) => Math.min(1, v + (1 - v) * mezcla));
  return "#" + t.map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("");
};

export const StickmanEnFondo: React.FC<StickmanEnFondoProps> = ({
  fondo, horizonte = 0.45, fov = 50, escala = 0.5, personajes, dirLuz = "izq", tinte = "auto", piso = "auto",
  sombra = 0.38, contacto = 1.15, brillo = "auto", oscurecer = 0, desenfoque = 0,
}) => {
  const { width: W, height: H } = useVideoConfig();
  const src = resolverSrc(fondo);
  const auto = tinte === "auto" || piso === "auto" || brillo === "auto";
  const [muestra, setMuestra] = useState<Muestra | null>(null);
  const [handle] = useState(() => (auto ? delayRender("stickman: midiendo el color del fondo") : null));
  useEffect(() => {
    if (!auto || handle === null) return;
    medirFoto(src, (m) => { setMuestra(m); continueRender(handle); }, () => { setMuestra({ media: [0.5, 0.5, 0.5], abajo: [0.4, 0.4, 0.4], luz: 0.45 }); continueRender(handle); });
  }, [auto, handle, src]);

  // --- cámara calibrada con la foto: pinhole con el horizonte en la fila pedida ---
  const cam = useMemo(() => {
    const f = H / 2 / Math.tan(THREE.MathUtils.degToRad(fov / 2)); // focal en px
    const alfa = Math.atan((H / 2 - horizonte * H) / f); // >0: el horizonte está arriba del centro → la cámara mira hacia abajo
    return { f, alfa };
  }, [H, fov, horizonte]);

  // cada personaje: altura de cámara para que mida `alto` del cuadro parado sobre su punto de piso
  // (una sola cámara para todos: la calibra el primero; los demás se escalan para respetar su `alto`)
  const ubicados = useMemo(() => {
    const altoCuerpo = P.alturaTotal;
    const filaAng = (py: number) => cam.alfa + Math.atan((py * H - H / 2) / cam.f); // ángulo bajo la horizontal
    const p0 = personajes[0];
    const b0 = Math.max(0.02, filaAng(p0?.piso[1] ?? 0.85));
    const a0 = p0?.alto ?? escala;
    // distancia horizontal D tal que altoCuerpo se vea como a0·H píxeles (aprox. de lente fina)
    const D0 = (cam.f * altoCuerpo) / (a0 * H) * Math.cos(b0);
    const hc = D0 * Math.tan(b0);
    const camara = new THREE.PerspectiveCamera(fov, W / H, 0.05, 400);
    camara.position.set(0, hc, 0);
    camara.rotation.set(-cam.alfa, 0, 0, "YXZ");
    camara.updateMatrixWorld(true);
    const lista = personajes.map((p) => {
      const ndc = new THREE.Vector3(p.piso[0] * 2 - 1, 1 - p.piso[1] * 2, 0.5).unproject(camara).sub(camara.position).normalize();
      const t = ndc.y < -1e-4 ? -hc / ndc.y : 50;
      const pt = camara.position.clone().addScaledVector(ndc, t);
      const dist = Math.hypot(pt.x, hc, pt.z);
      const quiero = (p.alto ?? escala) * H;
      const tengo = (cam.f * altoCuerpo) / dist;
      const esc = (p.escala ?? 1) * (p === p0 ? 1 : quiero / tengo);
      // por default mira a la cámara
      const mira = THREE.MathUtils.radToDeg(Math.atan2(-pt.x, -pt.z));
      return { p, pos: pt, esc, rotY: (p.rotY ?? 0) + mira };
    });
    const mira = camara.position.clone().add(new THREE.Vector3(0, -Math.sin(cam.alfa), -Math.cos(cam.alfa)));
    return { hc, lista, camara: { pos: [0, hc, 0] as V3, mira: [mira.x, mira.y, mira.z] as V3, fov } };
  }, [personajes, cam, H, W, fov, escala]);

  const m = muestra ?? { media: [0.5, 0.5, 0.5] as [number, number, number], abajo: [0.4, 0.4, 0.4] as [number, number, number], luz: 0.45 };
  const tinteHex = tinte === "auto" ? hex(m.media, 0.15) : tinte;
  // el vinilo blanco toma apenas el color del lugar (sin esto parece un recorte pegado)
  const cuerpoHex = hex(m.media, 0.92);
  const pisoHex = piso === "auto" ? hex(m.abajo, 0.15) : piso;
  // la mancha de contacto = el piso de la foto muy oscurecido (nunca el azul del estudio)
  const contactoHex = "#" + m.abajo.map((v) => Math.round(Math.min(255, v * 255 * 0.22)).toString(16).padStart(2, "0")).join("");
  const k = brillo === "auto" ? Math.min(1.05, Math.max(0.55, 0.45 + m.luz * 1.1)) : brillo;
  const dir: V3 = Array.isArray(dirLuz) ? dirLuz : dirLuz === "der" ? [0.55, 1, 0.6] : dirLuz === "arriba" ? [0.05, 1.6, 0.4] : [-0.55, 1, 0.6];
  const c0 = ubicados.lista[0]?.pos ?? new THREE.Vector3(0, 0, -6);
  const ext = 2.5 * Math.max(1, ...ubicados.lista.map((u) => u.esc));

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ filter: desenfoque > 0 ? `blur(${desenfoque}px)` : undefined }}>
        <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {oscurecer > 0 && <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${oscurecer})` }} />}
      <ThreeCanvas width={W} height={H} dpr={2} shadows="soft" style={{ position: "absolute", inset: 0 }}
        gl={{ antialias: true, preserveDrawingBuffer: true, alpha: true, premultipliedAlpha: false, toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace }}
        camera={{ fov, position: ubicados.camara.pos, near: 0.05, far: 400 }}>
        <Camara3D {...ubicados.camara} />
        <Luces dir={dir} intensidad={3.1 * k} relleno={0.32 * k} contraluz={1.0 * k} entorno={0.66 * k} tinte={tinteHex} piso={pisoHex}
          sombra={sombra} centro={[c0.x, 1.6, c0.z]} extension={ext} />
        {ubicados.lista.map(({ p, pos, esc, rotY }, i) => {
          const { piso: _p, alto: _a, ...resto } = p;
          return <Stickman key={i} {...resto} x={pos.x} z={pos.z} escala={esc} rotY={rotY} contacto={p.contacto ?? contacto} colorContacto={p.colorContacto ?? contactoHex} color={p.color ?? cuerpoHex} semilla={p.semilla ?? i + 1} />;
        })}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
