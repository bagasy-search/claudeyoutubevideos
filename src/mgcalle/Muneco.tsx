// Muñeco cutout: piezas PNG cortadas de UNA ilustración en pose A (rig/autorig.py) + ángulos por pieza.
// Cada pieza gira sobre su pivote (coordenadas de la imagen original), así una pose es sólo una lista de ángulos.
// Nombres fijos para las poses (brazoFrente, antebrazoAtras, piernaFrente...) vía rig.alias.
import React from "react";
import { Img, staticFile } from "remotion";

export type Rig = {
  ancho: number; alto: number; orden: string[];
  piezas: Record<string, { caja: number[]; pivote: number[]; padre?: string }>;
  alias?: Record<string, string>; puntos?: Record<string, number[]>;
};
export type PoseMuneco = Partial<Record<string, number>> & { cuerpo?: number; bob?: number };

// objeto en la mano: se dibuja en coordenadas de la imagen original y se mueve con esa pieza
export type EnMano = { pieza: string; nodo: React.ReactNode; delante?: boolean };

export const Muneco: React.FC<{
  rig: Rig; carpeta: string; pose: PoseMuneco; x: number; y: number; escala: number;
  espejo?: boolean; enMano?: EnMano; style?: React.CSSProperties;
}> = ({ rig, carpeta, pose, x, y, escala, espejo, enMano, style }) => {
  const piso = Math.max(...Object.values(rig.piezas).map((p) => p.caja[1] + p.caja[3]));
  const [tx, ty] = rig.piezas.torso.pivote;
  const real = (n: string) => rig.alias?.[n] ?? n;
  const ang: Record<string, number> = {};
  for (const [k, v] of Object.entries(pose)) if (k !== "cuerpo" && k !== "bob") ang[real(k)] = v ?? 0;

  // transformación de una pieza (origen = su pivote en coordenadas de la imagen)
  const tr = (n: string) => {
    const { pivote: [px, py], padre } = rig.piezas[n];
    let t = `rotate(${ang[n] ?? 0}deg)`;
    if (padre) {
      const [qx, qy] = rig.piezas[padre].pivote;
      t = `translate(${qx - px}px,${qy - py}px) rotate(${ang[padre] ?? 0}deg) translate(${px - qx}px,${py - qy}px) ${t}`;
    }
    return t;
  };
  const objeto = (n: string) => {
    const [px, py] = rig.piezas[n].pivote;
    return (
      <div key={`obj-${n}`} style={{ position: "absolute", inset: 0, transformOrigin: `${px}px ${py}px`, transform: tr(n) }}>
        {enMano!.nodo}
      </div>
    );
  };
  const manoReal = enMano ? real(enMano.pieza) : "";

  return (
    // (x, y) = punto entre los pies, apoyado en el piso
    <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0, ...style }}>
      <div style={{
        position: "absolute", width: rig.ancho, height: rig.alto, left: -tx, top: -piso,
        transformOrigin: `${tx}px ${piso}px`, transform: `scale(${espejo ? -escala : escala},${escala})`,
      }}>
        <div style={{ position: "absolute", inset: 0, transformOrigin: `${tx}px ${ty}px`, transform: `translateY(${pose.bob ?? 0}px) rotate(${pose.cuerpo ?? 0}deg)` }}>
          {rig.orden.map((n) => {
            const { caja: [cx, cy, w, h], pivote: [px, py] } = rig.piezas[n];
            const pieza = (
              <Img key={n} src={staticFile(`${carpeta}/${n}.png`)} style={{
                position: "absolute", left: cx, top: cy, width: w, height: h,
                transformOrigin: `${px - cx}px ${py - cy}px`, transform: tr(n),
              }} />
            );
            if (n !== manoReal) return pieza;
            return enMano!.delante ? [pieza, objeto(n)] : [objeto(n), pieza];
          })}
        </div>
      </div>
    </div>
  );
};
