// fotoreal · pieza «simple e impecable» (regla del EVALUADOR tras 3 vueltas): la foto REAL del objeto (agnes, sin caras ni texto)
// llega como copia en papel que cae sobre la mesa con física (resorte con peso, sombra de contacto que se aprieta al apoyar),
// adentro la cámara viaja en curva (nunca zoom lineal) y un brillo de papel la cruza una vez en la palabra clave.
// Seis entradas distintas (por la clave del héroe) para que dos minutos seguidos nunca se vean iguales.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { cl, eio, H, img, phys, Stage } from "./ckit";

const MODOS = ["drop", "iris", "wipe", "diag", "split", "ring"] as const;
const hash = (s: string) => { let x = 7; for (const c of s) x = (x * 31 + c.charCodeAt(0)) % 9973; return x; };

export const FotoReal: React.FC<{ t: number; h: H }> = ({ t, h }) => {
  const v = hash(h.k) % 6, D = Math.max(4, h.out - h.at);
  return <Stage t={t} h={h} mode={MODOS[v] as never} cam={0.6}>{(tt) => {
    const k = phys(tt, 0.05, 6.5, 0.5), a = 1 - k; // a: lo que falta para apoyar (oscila un poco bajo 0 = rebote)
    const ent = [
      `translateY(${-760 * a}px) rotate(${-7 * a + 1.2}deg)`,                       // cae desde arriba y se asienta girando
      `translateX(${-1300 * a}px) rotate(${4 * a - 0.8}deg)`,                       // se desliza por la mesa y frena
      `perspective(1600px) rotateX(${78 * a}deg) translateY(${120 * a}px)`,         // se levanta desde acostada
      `translateY(${820 * a}px) rotate(${3 * a + 0.6}deg)`,                         // sube desde abajo con rebote
      `perspective(1600px) rotateY(${-86 * a}deg)`,                                 // gira como una tarjeta
      `perspective(1600px) translateZ(${-1400 * a}px) rotate(${-1.4 * a}deg)`,      // viene desde el fondo
    ][v];
    const vi = eio(tt, 0.3, D - 0.2), cx = 3 * Math.sin(vi * 1.9 + v), cy = 2 * Math.sin(vi * 1.3 + 1 + v); // cámara curva dentro de la foto
    const brillo = cl((tt - 1.4) / 1.1), sombra = 0.25 + 0.4 * cl(1 - Math.abs(a) * 3);
    return <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", width: 1430, height: 830, top: 160, left: 245, borderRadius: 8, background: "rgba(0,0,0,.55)", filter: `blur(${34 - 20 * cl(1 - Math.abs(a) * 3)}px)`, opacity: sombra, transform: `translate(${18 + 60 * a}px, ${40 + 90 * Math.abs(a)}px)` }} />
      <div style={{ position: "relative", width: 1400, height: 800, marginTop: 40, padding: 16, background: "#f6f2e8", borderRadius: 6, boxShadow: "0 2px 0 #d8d0bf, 0 30px 60px rgba(0,0,0,.35)", transform: ent, transformOrigin: "50% 100%" }}>
        <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", borderRadius: 2, background: "#222" }}>
          <Img src={img(h.foto)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.06 + 0.07 * vi}) translate(${cx}%, ${cy}%)` }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, transparent ${brillo * 140 - 40}%, rgba(255,250,235,.22) ${brillo * 140 - 25}%, transparent ${brillo * 140 - 10}%)` }} />
        </div>
      </div>
    </AbsoluteFill>;
  }}</Stage>;
};
