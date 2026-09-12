import { interpolate, Easing } from "remotion";

// Follow-cam reutilizable: dada una lista de targets (frame de aparición + punto
// x,y a enfocar) y el centro del lienzo, devuelve un transform que hace un GRAN
// zoom limpio sobre cada target al aparecer (con OVERSHOOT/settle como una cámara
// real), lo sostiene, VIAJA al siguiente con pull-back + MOTION-BLUR proporcional a
// la velocidad, y al final se aleja para mostrar todo. Mismo lenguaje en todos los
// gráficos → todo "respira" igual.
export type CamTarget = { at: number; x: number; y: number };

const easeIO = Easing.inOut(Easing.cubic);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type CamOpts = {
  frame: number;
  fps: number;
  targets: CamTarget[];
  cx: number;
  cy: number;
  hold?: number;
  zPunch?: number;
  zHold?: number;
  zTravel?: number;
  endHold?: number;
  zoomOut?: number;
};

function posAt(o: CamOpts, frame: number): { fx: number; fy: number; z: number } {
  const { fps, targets, cx, cy } = o;
  const sec = (s: number) => Math.round(s * fps);
  // ★ SUAVE (feedback usuario jun 2026): zoom-punch y rebote contenidos (antes
  // zPunch 1.4 / zHold 1.2 / zTravel 1.06 = brusco y robótico). Movimiento limpio.
  const hold = sec(o.hold ?? 0.8);
  const zPunch = o.zPunch ?? 1.2;
  const zHold = o.zHold ?? 1.12;
  const zTravel = o.zTravel ?? 1.0;
  const zoomOut = o.zoomOut ?? 1.0;
  const n = targets.length;
  if (n === 0) return { fx: cx, fy: cy, z: 1 };

  let active = 0;
  for (let k = 0; k < n; k++) if (frame >= targets[k].at) active = k;
  const lastAt = targets[n - 1].at;
  const endStart = lastAt + sec(o.endHold ?? 1.2);
  const endEnd = endStart + sec(1.3);
  const la = frame - targets[active].at;

  if (frame < targets[0].at) return { fx: cx, fy: cy, z: 1.03 };
  if (frame >= endStart) {
    const e = easeIO(interpolate(frame, [endStart, endEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
    return { fx: lerp(targets[active].x, cx, e), fy: lerp(targets[active].y, cy, e), z: lerp(zHold, zoomOut, e) };
  }
  if (la < hold || active === n - 1) {
    // aterrizaje SUAVE: leve overshoot apenas perceptible (antes rebotaba feo)
    const z = interpolate(la, [0, sec(0.34), sec(0.6), hold], [zTravel, zPunch, zHold * 1.003, zHold], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
    });
    return { fx: targets[active].x, fy: targets[active].y, z };
  }
  const tp = easeIO(interpolate(frame, [targets[active].at + hold, targets[active + 1].at], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return {
    fx: lerp(targets[active].x, targets[active + 1].x, tp),
    fy: lerp(targets[active].y, targets[active + 1].y, tp),
    z: lerp(zHold, zTravel, Math.sin(tp * Math.PI)),
  };
}

export function followCam(opts: CamOpts): { transform: string; active: number; z: number; blur: number } {
  const { frame, targets, cx, cy } = opts;
  const n = targets.length;
  if (n === 0) return { transform: "scale(1)", active: -1, z: 1, blur: 0 };

  let active = 0;
  for (let k = 0; k < n; k++) if (frame >= targets[k].at) active = k;

  const cur = posAt(opts, frame);
  const prev = posAt(opts, frame - 1);
  // velocidad en px de pantalla (incluye el zoom) → motion blur direccional breve
  const vel = Math.hypot((cur.fx - prev.fx) * cur.z, (cur.fy - prev.fy) * cur.z) + Math.abs(cur.z - prev.z) * 600;
  // motion-blur SUTIL (antes hasta 7px = smeary/raro): tope 2.5px, rampa más alta
  const blur = Math.min(2.5, Math.max(0, vel * 0.03 - 0.5));

  return {
    transform: `scale(${cur.z}) translate(${cx - cur.fx}px, ${cy - cur.fy}px)`,
    active,
    z: cur.z,
    blur,
  };
}
