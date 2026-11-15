// Escenas sobre fotos · alb14a (ideas.md en D:/rtmp/alb14a). Escritas de cero; foto real a pantalla completa
// (1920x1080, objectFit 'fill', coordenadas de la rejilla), recortes con clip-path/máscaras, sin dibujos.
//
// 1 EscLapiz (g0820 → g0830) · LA IDEA: las marcas de lápiz reales se escriben en vivo. Sobre g0820 los dos aros
//   se tapan con revoque limpio de la misma foto (✓ con revoque de 190 px a la izquierda; ✗ con revoque de 150 px
//   más abajo) y una máscara redibuja cada trazo real: el aro con un barrido cónico (sentido horario, como la mano)
//   y la marca de adentro con un barrido lineal. Después la cámara entra en el aro ✗ (749,355) hasta escala 2.8 y,
//   a esa escala, se cambia a g0830 con su cruz real (1045,205) en el mismo punto de pantalla; sale a la barda
//   entera y en "burbujeó" la ✓ recortada de g0820 se vuelve a escribir sobre la costra blanca baja (1150,640).
//   ELEMENTOS: ✓ elipse 545,380 radios 74x86; ✗ elipse 749,355 radios 53x75; ✓ nueva en g0830 1150,640.
//   TIEMPO (cuadros a 30): aro ✓ 16-34, tilde 36-48, aro ✗ 70-86, cruz 86-98, entrada 96-112, cambio 106-114,
//   salida 114-150, ✓ en la barda 160-180 + 180-192. PROHIBIDO: dibujos, otras fotos, texto. SONIDO: el de la mezcla.
// 2 EscCinta (g2400) · LA IDEA: la cinta azul real del piso (903-933, desde 742) sigue subiendo por el muro hasta
//   el borde de arriba (45) y parte la pared en dos; pasa por detrás de las flores y la jardinera (recorte en
//   primer plano). CÁMARA: entera → mitad izquierda en "blanca" → costra baja 520,470 en "costra de abajo" →
//   cruza la cinta a la mitad derecha 1250,400 en "mitad derecha".
// 3 EscChorro (g2690) · LA IDEA: el chorro real tarda. Copia sin chorro (revoque del escalón 50 px a la derecha)
//   y el chorro recortado se alarga desde la boca del bidón (587,490) y toca el escalón (658,732) justo en
//   "Directo"; ahí aparece el charco real (los escurridos del contraescalón son los de la foto, no se tocan).
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";

type K = { f: number; x: number; y: number; s: number };
const EZ = Easing.bezier(0.45, 0, 0.25, 1);
const cam = (f: number, ks: K[]) => {
  let i = 0;
  while (i < ks.length - 2 && f > ks[i + 1].f) i++;
  const a = ks[i], b = ks[i + 1];
  const t = EZ(Math.min(1, Math.max(0, (f - a.f) / Math.max(1, b.f - a.f))));
  const s = Math.exp(Math.log(a.s) + (Math.log(b.s) - Math.log(a.s)) * t);
  let x = a.x + (b.x - a.x) * t, y = a.y + (b.y - a.y) * t;
  x = Math.min(1920 - 960 / s, Math.max(960 / s, x));
  y = Math.min(1080 - 540 / s, Math.max(540 / s, y));
  return { s, x, y };
};
const camStyle = (c: { s: number; x: number; y: number }): React.CSSProperties => ({
  position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0",
  transform: `translate(${960 - c.x * c.s}px, ${540 - c.y * c.s}px) scale(${c.s})`,
});
const P = (n: number) => `${n}px`;
const prog = (f: number, a: number, b: number, ease = true) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease ? EZ : undefined });
const Foto: React.FC<{ src: string; dx?: number; dy?: number; style?: React.CSSProperties }> = ({ src, dx = 0, dy = 0, style }) => (
  <Img src={staticFile(src)} style={{ position: "absolute", left: dx, top: dy, width: 1920, height: 1080, objectFit: "fill", ...style }} />
);
const mask = (m: string, comp = false): React.CSSProperties => ({
  WebkitMaskImage: m, maskImage: m, WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat",
  WebkitMaskSize: "1920px 1080px", maskSize: "1920px 1080px",
  ...(comp ? { WebkitMaskComposite: "source-in", maskComposite: "intersect" } : {}),
});

// un trazo real de lápiz: aro (barrido cónico) + marca de adentro (barrido lineal), de la foto `src` con el centro
// (cx,cy) y radios (rx,ry); `ox,oy` lo corren a otro lugar; `tinta` deja sólo el grafito (para escribir sobre otra foto)
const Trazo: React.FC<{ src: string; cx: number; cy: number; rx: number; ry: number; aro: number; marca: number; ang: number; ox?: number; oy?: number; tinta?: boolean }> =
  ({ src, cx, cy, rx, ry, aro, marca, ang, ox = 0, oy = 0, tinta }) => {
    const deg = aro * 362;
    const el = `ellipse ${P(rx)} ${P(ry)} at ${P(cx)} ${P(cy)}`;
    const look: React.CSSProperties = tinta ? { filter: "grayscale(1) contrast(3) brightness(1.5)", mixBlendMode: "multiply" } : {};
    const m = marca * 118 - 9;
    return (
      <div style={{ position: "absolute", left: ox, top: oy, width: 1920, height: 1080, ...look }}>
        {aro > 0 && (
          <div style={{ position: "absolute", inset: 0, ...mask(`conic-gradient(from 200deg at ${P(cx)} ${P(cy)}, #000 0deg, #000 ${deg}deg, transparent ${deg + 2}deg), radial-gradient(${el}, transparent 80%, #000 84%, #000 114%, transparent 118%)`, true) }}>
            <Foto src={src} />
          </div>
        )}
        {marca > 0 && (
          <div style={{ position: "absolute", inset: 0, ...mask(`linear-gradient(${ang}deg, #000 ${m}%, transparent ${m + 9}%), radial-gradient(${el}, #000 78%, transparent 82%)`, true) }}>
            <Foto src={src} />
          </div>
        )}
      </div>
    );
  };
// revoque limpio de la misma foto tapando un aro (la foto corrida dx,dy, con borde suave)
const Tapa: React.FC<{ src: string; cx: number; cy: number; rx: number; ry: number; dx: number; dy: number }> = ({ src, cx, cy, rx, ry, dx, dy }) => (
  <div style={{ position: "absolute", inset: 0, ...mask(`radial-gradient(ellipse ${P(rx)} ${P(ry)} at ${P(cx)} ${P(cy)}, #000 80%, transparent 100%)`) }}>
    <Foto src={src} dx={dx} dy={dy} />
  </div>
);

export const EscLapiz: React.FC<{ a: string; b: string; dur: number }> = ({ a, b }) => {
  const f = useCurrentFrame();
  const c1 = cam(f, [{ f: 0, x: 960, y: 540, s: 1.05 }, { f: 90, x: 650, y: 390, s: 1.2 }, { f: 96, x: 650, y: 390, s: 1.2 }, { f: 112, x: 749, y: 355, s: 2.8 }]);
  const c2 = cam(f, [{ f: 0, x: 1045, y: 205, s: 2.8 }, { f: 112, x: 1045, y: 205, s: 2.8 }, { f: 150, x: 1010, y: 500, s: 1.08 }, { f: 330, x: 1060, y: 520, s: 1.13 }]);
  const swap = prog(f, 106, 114, false);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {swap < 1 && (
        <div style={camStyle(c1)}>
          <Foto src={a} />
          <Tapa src={a} cx={545} cy={380} rx={92} ry={104} dx={190} dy={0} />
          <Tapa src={a} cx={749} cy={355} rx={70} ry={92} dx={0} dy={-150} />
          <Trazo src={a} cx={545} cy={380} rx={74} ry={86} aro={prog(f, 16, 34)} marca={prog(f, 36, 48)} ang={70} />
          <Trazo src={a} cx={749} cy={355} rx={53} ry={75} aro={prog(f, 70, 86)} marca={prog(f, 86, 98)} ang={180} />
        </div>
      )}
      {swap > 0 && (
        <div style={{ ...camStyle(c2), opacity: swap }}>
          <Foto src={b} />
          <Trazo src={a} cx={545} cy={380} rx={74} ry={86} aro={prog(f, 160, 180)} marca={prog(f, 180, 192)} ang={70} ox={1150 - 545} oy={640 - 380} tinta />
        </div>
      )}
    </AbsoluteFill>
  );
};

// recorte de flores + jardinera que queda delante de la cinta (20 puntos, un poco hacia adentro del contorno)
const FLORES = [[858, 590], [872, 575], [886, 566], [898, 552], [910, 543], [924, 541], [936, 548], [944, 560], [952, 578], [962, 592],
  [972, 606], [980, 640], [982, 700], [982, 770], [940, 772], [900, 772], [860, 770], [852, 700], [852, 640], [854, 610]];
export const EscCinta: React.FC<{ src: string; dur: number }> = ({ src }) => {
  const f = useCurrentFrame();
  const c = cam(f, [{ f: 0, x: 960, y: 540, s: 1.04 }, { f: 34, x: 960, y: 540, s: 1.04 }, { f: 70, x: 640, y: 450, s: 1.35 }, { f: 155, x: 620, y: 455, s: 1.38 },
    { f: 185, x: 520, y: 470, s: 1.7 }, { f: 250, x: 540, y: 470, s: 1.72 }, { f: 285, x: 1250, y: 400, s: 1.35 }, { f: 340, x: 1290, y: 400, s: 1.38 }]);
  const top = 742 - prog(f, 4, 40) * (742 - 45);
  const h = 742 - top, k = 2.35;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={camStyle(c)}>
        <Foto src={src} />
        {h > 1 && (
          <div style={{ position: "absolute", left: 904, top, width: 28, height: h, overflow: "hidden", mixBlendMode: "multiply", filter: "brightness(1.35) saturate(0.85)" }}>
            {/* la misma cinta del piso (903-933 x 760-1060) estirada por el muro, el extremo ancho arriba */}
            <div style={{ position: "absolute", inset: 0, transform: "scaleY(-1)" }}>
              <Img src={staticFile(src)} style={{ position: "absolute", left: -904, top: -760 * k, width: 1920, height: 1080 * k, objectFit: "fill" }} />
            </div>
          </div>
        )}
        <div style={{ position: "absolute", inset: 0, clipPath: `polygon(${FLORES.map(([x, y]) => `${x}px ${y}px`).join(",")})` }}>
          <Foto src={src} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// banda del chorro real (borde izquierdo y derecho medidos en zoom), 16 puntos
const CH_L = [[585, 488], [598, 510], [613, 545], [625, 585], [638, 625], [648, 670], [654, 710], [656, 734]];
const CH_R = [[602, 488], [612, 515], [627, 545], [639, 585], [649, 625], [659, 670], [663, 710], [664, 734]];
const CHORRO = [...CH_L, ...CH_R.slice().reverse()];
// tapa del chorro + charco (más ancha, 16 puntos)
const TAPA_CH = [[580, 496], [612, 496], [630, 540], [644, 585], [657, 625], [668, 668], [676, 712], [706, 728], [706, 750], [660, 760],
  [616, 750], [614, 728], [640, 712], [636, 668], [622, 625], [596, 545]];
export const EscChorro: React.FC<{ src: string; dur: number }> = ({ src }) => {
  const f = useCurrentFrame();
  const c = cam(f, [{ f: 0, x: 900, y: 560, s: 1.04 }, { f: 100, x: 760, y: 610, s: 1.14 }, { f: 140, x: 800, y: 640, s: 1.18 }]);
  // cae con gravedad: lento al salir, rápido al llegar; toca en "Directo" (3.37 s = cuadro 101)
  const tip = 488 + (734 - 488) * Math.pow(prog(f, 34, 101, false), 1.7);
  const charco = prog(f, 100, 112);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={camStyle(c)}>
        <Foto src={src} />
        {/* escalón sin chorro ni charco */}
        <div style={{ position: "absolute", inset: 0, clipPath: `polygon(${TAPA_CH.map(([x, y]) => `${x}px ${y}px`).join(",")})` }}>
          <Foto src={src} dx={-50} />
        </div>
        {/* charco real */}
        {charco > 0 && (
          <div style={{ position: "absolute", inset: 0, clipPath: `ellipse(${42 * charco}px ${18 * charco}px at 660px 738px)` }}>
            <Foto src={src} />
          </div>
        )}
        {/* chorro real, se alarga desde la boca */}
        <div style={{ position: "absolute", inset: 0, clipPath: `polygon(${CHORRO.map(([x, y]) => `${x}px ${Math.min(y, tip)}px`).join(",")})` }}>
          <Foto src={src} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
