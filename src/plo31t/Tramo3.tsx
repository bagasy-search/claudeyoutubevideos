import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Avatar } from "./base";
import { FONT, COL, e, ei, spr, extrude, Portal, Tag, DrawX, BigNum, Chips } from "./lib";

const W = 1920, H = 1080;

type Plano = { a: number; b: number; tipo: "av" | "foto"; id?: string; mov?: number; tag?: string; tagAt?: number };

const PLANOS: Plano[] = [
  { a: 531.56, b: 535.41, tipo: "av" },
  { a: 535.41, b: 540.30, tipo: "foto", id: "t3_01", mov: 0, tag: "SARRO EN LA MALLA", tagAt: 536.6 },
  { a: 540.30, b: 543.69, tipo: "foto", id: "t3_02", mov: 1, tag: "SE TAPA DE A POCO", tagAt: 541.4 },
  { a: 543.69, b: 549.15, tipo: "foto", id: "t3_03", mov: 2, tag: "A MANO · IZQUIERDA", tagAt: 546.4 },
  { a: 549.15, b: 554.01, tipo: "av" },
  { a: 554.01, b: 559.20, tipo: "foto", id: "t3_04", mov: 3, tag: "LA MALLITA", tagAt: 557.4 },
  { a: 559.20, b: 565.77, tipo: "foto", id: "t3_05", mov: 0, tag: "1 HORA EN VINAGRE", tagAt: 565.1 },
  { a: 565.77, b: 569.80, tipo: "av" },
  { a: 569.80, b: 575.20, tipo: "foto", id: "t3_06", mov: 1, tag: "CEPILLO VIEJO", tagAt: 571.6 },
  { a: 575.20, b: 578.18, tipo: "foto", id: "t3_07", mov: 2, tag: "MISMO ORDEN", tagAt: 576.2 },
  { a: 578.18, b: 581.96, tipo: "av" },
  { a: 581.96, b: 586.73, tipo: "foto", id: "t3_08", mov: 3, tag: "SIN AIREADOR", tagAt: 584.2 },
  { a: 586.73, b: 594.06, tipo: "foto", id: "t3_09", mov: 0, tag: "LLAVECITA ANGULAR", tagAt: 589.3 },
  { a: 594.06, b: 597.58, tipo: "av" },
  { a: 597.58, b: 603.25, tipo: "foto", id: "t3_10", mov: 1, tag: "LA DEJÓ A LA MITAD", tagAt: 601.6 },
  { a: 603.25, b: 608.29, tipo: "foto", id: "t3_11", mov: 2, tag: "TRUCO Nº 6", tagAt: 603.6 },
  { a: 608.29, b: 617.31, tipo: "foto", id: "t3_12", mov: 3, tag: "MANGUERA DE ENTRADA", tagAt: 615.6 },
  { a: 617.31, b: 625.84, tipo: "foto", id: "t3_13", mov: 0, tag: "SIEMPRE CON PRESIÓN", tagAt: 623.2 },
  { a: 625.84, b: 630.48, tipo: "av" },
  { a: 630.48, b: 636.20, tipo: "foto", id: "t3_14", mov: 1, tag: "SE AGRIETA POR DENTRO", tagAt: 637.3 },
  { a: 636.20, b: 641.49, tipo: "foto", id: "t3_15", mov: 2, tag: "Y UN DÍA REVIENTA", tagAt: 640.8 },
  { a: 641.49, b: 647.03, tipo: "av" },
  { a: 647.03, b: 651.40, tipo: "foto", id: "t3_16", mov: 3, tag: "MALLA DE ACERO", tagAt: 651.6 },
  { a: 651.40, b: 656.95, tipo: "foto", id: "t3_17", mov: 0, tag: "TRENZADA POR FUERA", tagAt: 653.9 },
  { a: 656.95, b: 661.54, tipo: "av" },
  { a: 661.54, b: 667.59, tipo: "foto", id: "t3_18", mov: 1, tag: "CIERRO LA LLAVE", tagAt: 665.9 },
  { a: 667.59, b: 674.80, tipo: "foto", id: "t3_19", mov: 2, tag: "DESPUÉS DE CADA LAVADO", tagAt: 671.4 },
  { a: 674.80, b: 679.26, tipo: "av" },
  { a: 679.26, b: 685.43, tipo: "foto", id: "t3_20", mov: 3, tag: "REVISIÓN HOY", tagAt: 682.2 },
  { a: 685.43, b: 691.09, tipo: "foto", id: "t3_21", mov: 0, tag: "BURBUJA · GRIETAS", tagAt: 688.6 },
  { a: 691.09, b: 694.35, tipo: "av" },
  { a: 694.35, b: 698.25, tipo: "foto", id: "t3_22", mov: 1, tag: "TRUCO Nº 7", tagAt: 694.6 },
  { a: 698.25, b: 703.21, tipo: "foto", id: "t3_23", mov: 2, tag: "AGUA EN LOS PIES", tagAt: 700.5 },
  { a: 703.21, b: 705.16, tipo: "foto", id: "t3_24", mov: 3, tag: "SON PELOS", tagAt: 704.2 },
  { a: 705.16, b: 709.54, tipo: "av" },
  { a: 709.54, b: 715.25, tipo: "foto", id: "t3_25", mov: 0, tag: "SOSA · ÁCIDO", tagAt: 713.9 },
  { a: 715.25, b: 722.13, tipo: "foto", id: "t3_26", mov: 1, tag: "CASTIGA LOS TUBOS", tagAt: 720.9 },
];

const Foto: React.FC<{ id: string; t: number; a: number; b: number; mov: number }> = ({ id, t, a, b, mov }) => {
  const p = e(t, a, b);
  const sc = 1.04 + 0.10 * p;
  const dx = mov % 2 === 0 ? -18 + 36 * p : 18 - 36 * p;
  const dy = mov === 2 ? -14 + 28 * p : mov === 3 ? 14 - 28 * p : 0;
  const rot = (mov - 1.5) * 0.35;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#0b0a08" }}>
      <Img src={staticFile(`plo31t/img/plo31t_${id}.jpg`)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", transform: `translate(${dx}px,${dy}px) scale(${sc}) rotate(${rot}deg)` }} />
    </AbsoluteFill>
  );
};

const Marca: React.FC<{ t: number; a: number; b: number; tipo: number }> = ({ t, a, b, tipo }) => {
  const on = e(t, a + 0.1, a + 0.5) * (1 - e(t, b - 0.35, b - 0.05));
  if (on <= 0.01) return null;
  if (tipo === 1) {
    const d = ei(t, a + 0.1, a + 0.7);
    return (
      <svg width={W} height={H} style={{ position: "absolute", opacity: on }}>
        <circle cx={1150} cy={560} r={150} fill="none" stroke={COL.red} strokeWidth={9} strokeDasharray={950} strokeDashoffset={950 * (1 - d)} transform="rotate(-8 1150 560)" strokeLinecap="round" />
      </svg>
    );
  }
  if (tipo === 2) {
    const d = ei(t, a + 0.1, a + 0.6);
    return (
      <svg width={W} height={H} style={{ position: "absolute", opacity: on }}>
        <path d="M 1180 380 Q 1330 520 1200 690" fill="none" stroke={COL.red} strokeWidth={8} strokeDasharray={520} strokeDashoffset={520 * (1 - d)} strokeLinecap="round" />
        <path d="M 1150 640 L 1200 690 L 1250 630" fill="none" stroke={COL.red} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" opacity={d} />
      </svg>
    );
  }
  return null;
};

const Lupa: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const p = e(t, a + 0.2, b - 0.3);
  const x = 620 + 680 * p, y = 540 + 90 * Math.sin(p * Math.PI * 2);
  const on = e(t, a + 0.2, a + 0.6) * (1 - e(t, b - 0.4, b - 0.05));
  if (on <= 0.01) return null;
  // Lupa: anillo de foco sobre la foto a pantalla completa (sin máscara circular que deje esquinas negras).
  return (
    <div style={{ position: "absolute", left: x - 200, top: y - 200, width: 400, height: 400, borderRadius: "50%", border: `10px solid ${COL.amber}`, boxShadow: "0 0 0 3px rgba(0,0,0,.4), inset 0 0 60px rgba(255,180,90,.28), 0 0 80px rgba(255,180,90,.18)", opacity: on }} />
  );
};

export const Tramo3: React.FC<{ t: number }> = ({ t }) => {
  const idx = PLANOS.findIndex((p) => t >= p.a && t < p.b);
  const i = idx < 0 ? PLANOS.length - 1 : idx;
  const cur = PLANOS[i];
  const prev = i > 0 ? PLANOS[i - 1] : null;
  const tr = prev && t < cur.a + 0.4 ? ei(t, cur.a, cur.a + 0.4) : 1;
  const portalR = prev && t < cur.a + 0.4 ? e(t, cur.a, cur.a + 0.4) : 1;
  const usePortal = !!(prev && tr < 1 && cur.tipo !== "av" && prev.tipo !== "av");

  const render = (p: Plano, alpha: number, key: string) => {
    if (p.tipo === "av") return <AbsoluteFill key={key} style={{ opacity: alpha }}><Avatar t={t} /></AbsoluteFill>;
    return (
      <AbsoluteFill key={key} style={{ opacity: alpha }}>
        <Foto id={p.id!} t={t} a={p.a} b={p.b} mov={p.mov ?? 0} />
        {(p.mov === 1 || p.mov === 2) && <Marca t={t} a={p.a} b={p.b} tipo={p.mov} />}
        {p.mov === 0 && <Lupa t={t} a={p.a} b={p.b} />}
        {p.tag && <Tag t={t} at={p.tagAt ?? p.a + 0.6} out={p.b - 0.3} x={W / 2} y={H - 190} text={p.tag} size={72} col={COL.ink} />}
        {p.id === "t3_11" && <BigNum t={t} at={603.5} text="6" x={W / 2} y={H / 2 - 40} size={420} col={COL.amber} edge={COL.red} out={p.b - 0.3} sub="LA MANGUERA DE LA LAVADORA" />}
        {p.id === "t3_22" && <BigNum t={t} at={694.5} text="7" x={W / 2} y={H / 2 - 40} size={420} col={COL.amber} edge={COL.red} out={p.b - 0.3} sub="EL DESTAPADOR DE PELOS" />}
        {p.id === "t3_24" && (() => {
          const n = Math.round(90 * e(t, 703.4, 704.4));
          return (
            <div style={{ position: "absolute", left: W / 2, top: 260, transform: `translate(-50%,-50%) scale(${Math.min(1.05, spr(t, 703.4))})`, textAlign: "center", fontFamily: FONT, fontWeight: 900, color: "#fff", textShadow: extrude(6, "rgba(0,0,0,.65)") }}>
              <div style={{ fontSize: 220, lineHeight: 1 }}>{n}%</div>
              <div style={{ fontSize: 64, color: COL.amber }}>SON PELOS</div>
            </div>
          );
        })()}
        {p.id === "t3_07" && <Chips t={t} at={575.6} items={["ARO", "MALLA", "INSERTO", "TAPA"]} out={p.b - 0.2} y={H - 210} />}
        {p.id === "t3_10" && <DrawX t={t} at={600.2} x={1180} y={520} w={260} h={260} />}
        {p.id === "t3_25" && <DrawX t={t} at={714.2} x={1240} y={560} w={300} h={300} />}
      </AbsoluteFill>
    );
  };

  return (
    <AbsoluteFill style={{ background: "#0b0a08" }}>
      {usePortal && (
        <AbsoluteFill>
          {render(prev!, 1 - tr, "prev")}
          <Portal x={W / 2} y={H / 2} r={portalR}>{render(cur, 1, "cur")}</Portal>
        </AbsoluteFill>
      )}
      {!usePortal && render(cur, 1, "cur")}
      <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,.42) 100%)" }} />
      <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.06, mixBlendMode: "overlay", backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='120' height='120' filter='url(%23n)' opacity='0.6'/></svg>")` }} />
    </AbsoluteFill>
  );
};

export const SFX3: [number, string, number?][] = [
  [535.45, "whoosh"],
  [536.6, "pop"],
  [540.35, "swish"],
  [541.4, "write", -3],
  [543.75, "whoosh"],
  [546.4, "pop"],
  [549.2, "whoosh"],
  [554.05, "whoosh"],
  [557.4, "pop"],
  [559.25, "swish"],
  [565.1, "pop"],
  [565.82, "whoosh"],
  [569.85, "whoosh_big"],
  [571.6, "pop"],
  [575.25, "swish"],
  [576.2, "click", -2],
  [578.22, "whoosh"],
  [582.0, "whoosh"],
  [584.2, "pop"],
  [586.78, "swish"],
  [589.3, "pop"],
  [594.1, "whoosh"],
  [597.62, "whoosh"],
  [600.2, "write", -3],
  [601.6, "pop"],
  [603.3, "whoosh_big"],
  [603.6, "slam"],
  [608.34, "swish"],
  [615.6, "pop"],
  [617.35, "whoosh"],
  [623.2, "pop"],
  [625.88, "whoosh"],
  [630.52, "whoosh"],
  [636.25, "swish"],
  [637.3, "pop"],
  [640.8, "boom", -3],
  [641.53, "whoosh"],
  [647.07, "whoosh"],
  [651.44, "swish"],
  [651.6, "pop"],
  [653.9, "pop"],
  [656.99, "whoosh"],
  [661.58, "whoosh"],
  [665.9, "pop"],
  [667.63, "swish"],
  [671.4, "pop"],
  [674.84, "whoosh"],
  [679.3, "whoosh"],
  [682.2, "pop"],
  [685.47, "swish"],
  [688.6, "pop"],
  [691.13, "whoosh"],
  [694.4, "whoosh_big"],
  [694.6, "slam"],
  [698.29, "swish"],
  [700.5, "pop"],
  [703.25, "whoosh"],
  [703.4, "roll", -2],
  [704.2, "pop"],
  [705.2, "whoosh"],
  [709.58, "whoosh"],
  [713.9, "fail", -2],
  [715.29, "swish"],
  [720.9, "pop"],
];
