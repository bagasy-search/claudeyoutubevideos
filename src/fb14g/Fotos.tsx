// Escenas sobre las fotos reales de fb14g (ideas en D:/rtmp/fb14g/ideas.md). Solo DOM/CSS, sin SVG.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";

const FPS = 30;
const P = (n: string) => staticFile(`fb14g/g/${n}.png`);
const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const ease = Easing.bezier(0.33, 0, 0.2, 1);

// ── Escena 1 · capilaridad en la junta real ──────────────────────────────
// t0 = 13.74 s. "chupa" 14.38 · "lado" 18.34 · "sellé" 19.16 · fin 20.28
export const Capilar: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS + 13.74;
  const PAN0 = 16.0, PAN1 = 16.9; // la cámara corre a la junta de al lado
  const pan = interpolate(t, [PAN0, PAN1], [0, 1], { ...cl, easing: ease });
  // g0070: la junta se chupa la gota
  const a = interpolate(t, [14.38, 15.6], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) });
  const reach = 30 + a * 330; // la mancha corre por el canal
  const drop = 1 - a;
  // g0080: misma mancha que intenta y no arranca; la gota tiembla y queda
  const b = interpolate(t, [19.16, 19.5, 20.0], [0, 1, 0], cl);
  const jig = Math.sin((t - 19.16) * 22) * Math.exp(-(t - 19.16) * 3.2) * (t > 19.16 ? 1 : 0);
  const zoom = 1.06 + 0.04 * interpolate(t, [13.74, 20.28], [0, 1], cl);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#111" }}>
      <AbsoluteFill style={{ transform: `translateX(${-pan * 1920}px)` }}>
        {/* foto 1 */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "1000px 543px" }}>
            <Img src={P("g0070")} style={full} />
            {/* clon de la misma junta 110 px más arriba tapa el lugar de la gota */}
            <Img src={P("g0070")} style={{ ...full, transform: "translateY(110px)", clipPath: `circle(${44 * (a > 0 ? 1 : 0)}px at 1000px 433px)` }} />
            {/* mancha húmeda: misma foto oscurecida, solo dentro del canal real de la junta */}
            <Img src={P("g0070")} style={{ ...full, filter: "brightness(0.5) saturate(0.7)", clipPath: "polygon(968px 95px,1043px 95px,1046px 1080px,966px 1080px)", WebkitMaskImage: `radial-gradient(ellipse 60px ${reach}px at 1004px 543px, #000 55%, transparent 100%)`, maskImage: `radial-gradient(ellipse 60px ${reach}px at 1004px 543px, #000 55%, transparent 100%)`, opacity: a > 0 ? 0.9 : 0 }} />
            {/* la gota real, recortada, se aplana y se hunde */}
            <Img src={P("g0070")} style={{ ...full, clipPath: "circle(38px at 1000px 543px)", transformOrigin: "1000px 560px", transform: `scale(${0.3 + 0.7 * drop}, ${Math.max(0.02, drop * drop)})`, opacity: drop > 0.03 ? 1 : 0 }} />
          </div>
          <div style={{ position: "absolute", left: 1090, top: 470, fontFamily: "Georgia, serif", fontSize: 92, fontWeight: 700, color: "#fff", textShadow: "0 4px 18px rgba(0,0,0,.7)", opacity: interpolate(t, [14.9, 15.2, 15.85, 16.0], [0, 1, 1, 0], cl) }}>2 s</div>
        </div>
        {/* foto 2: la junta de al lado, sellada */}
        <div style={{ position: "absolute", left: 1920, top: 0, width: 1920, height: 1080, overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, transform: `scale(${1.04 + 0.05 * interpolate(t, [16.9, 20.28], [0, 1], cl)})`, transformOrigin: "963px 537px" }}>
            <Img src={P("g0080")} style={full} />
            <Img src={P("g0080")} style={{ ...full, filter: "brightness(0.55)", clipPath: "polygon(910px 0px,983px 0px,1025px 1080px,910px 1080px)", WebkitMaskImage: `radial-gradient(ellipse 50px ${40 + b * 30}px at 960px 560px, #000 40%, transparent 100%)`, maskImage: `radial-gradient(ellipse 50px ${40 + b * 30}px at 960px 560px, #000 40%, transparent 100%)`, opacity: b * 0.6 }} />
            <Img src={P("g0080")} style={{ ...full, clipPath: "circle(46px at 963px 537px)", transformOrigin: "963px 575px", transform: `scale(${1 + jig * 0.12}, ${1 - jig * 0.14})`, filter: `brightness(${1 + 0.25 * Math.abs(jig)})` }} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Escena 2 · frente de sellado que tapiza cada poro real ───────────────
// parte "a": 1152.23–1168.53 sobre e_poro; parte "b": 1172.03–1177.09 sobre e_porolleno
export const Poros: React.FC<{ parte: "a" | "b" }> = ({ parte }) => {
  const f = useCurrentFrame();
  if (parte === "a") {
    const t = f / FPS + 1152.23;
    // "entrando" 1154.67 → "agua" 1163.75: el frente recorre la piedra desde la junta
    const r = interpolate(t, [1154.67, 1156.11, 1163.75], [0, 520, 1500], { ...cl, easing: ease });
    // "la gota ya no entra" 1167.23: la gota rebota sobre la superficie sellada
    const g = t - 1167.23; const bo = g > 0 ? Math.sin(g * 16) * Math.exp(-g * 3) : 0;
    const cam = interpolate(t, [1152.23, 1168.53], [0, 1], cl);
    const s = 1.04 + 0.08 * cam;
    const ox = interpolate(cam, [0, 0.7, 1], [760, 1000, 1345]);
    const oy = interpolate(cam, [0, 0.7, 1], [520, 450, 380]);
    const mask = `radial-gradient(circle ${Math.max(1, r)}px at 700px 500px, #000 82%, transparent 100%)`;
    return (
      <AbsoluteFill style={{ overflow: "hidden", background: "#111" }}>
        <div style={{ position: "absolute", inset: 0, transform: `scale(${s})`, transformOrigin: `${ox}px ${oy}px` }}>
          <Img src={P("e_poro")} style={full} />
          <Img src={P("e_poro_sellado")} style={{ ...full, WebkitMaskImage: mask, maskImage: mask }} />
          {/* borde del frente: un anillo de brillo que viaja */}
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle ${Math.max(1, r)}px at 700px 500px, transparent 78%, rgba(220,235,245,${r > 0 && r < 1450 ? 0.28 : 0}) 92%, transparent 100%)`, mixBlendMode: "screen" }} />
          {/* la gota real sigue arriba y rebota */}
          <Img src={P("e_poro")} style={{ ...full, clipPath: "ellipse(212px 130px at 1345px 375px)", transformOrigin: "1345px 470px", transform: `scale(${1 - bo * 0.06}, ${1 + bo * 0.09})`, filter: "drop-shadow(0 8px 10px rgba(0,0,0,.35))" }} />
        </div>
      </AbsoluteFill>
    );
  }
  const t = f / FPS + 1172.03;
  // "poro está lleno de agua" 1173.65–1174.49: los poros llenos se iluminan apenas · "no puede entrar" 1175.91: el frente baja desde la película y se frena
  const lit = interpolate(t, [1173.65, 1174.5], [0, 1], cl);
  const r = interpolate(t, [1175.39, 1176.2, 1176.9], [0, 230, 205], { ...cl, easing: ease });
  const mask = `radial-gradient(ellipse ${r * 3}px ${Math.max(1, r)}px at 900px 360px, #000 70%, transparent 100%)`;
  const s = 1.03 + 0.05 * interpolate(t, [1172.03, 1177.09], [0, 1], cl);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#111" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${s})`, transformOrigin: "900px 520px" }}>
        <Img src={P("e_porolleno")} style={full} />
        <Img src={P("e_porolleno")} style={{ ...full, filter: "brightness(1.35) contrast(1.15)", clipPath: "polygon(0px 640px,1920px 560px,1920px 1080px,0px 1080px)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0px, #000 120px)", maskImage: "linear-gradient(to bottom, transparent 0px, #000 120px)", opacity: lit * 0.55 }} />
        <Img src={P("e_porolleno")} style={{ ...full, filter: "brightness(1.18) saturate(0.6) hue-rotate(-10deg)", WebkitMaskImage: mask, maskImage: mask, opacity: 0.85 }} />
      </div>
    </AbsoluteFill>
  );
};

// ── Escena 3 · el film se empaña dentro de su contorno real; la linterna lo barre ──
// 2050.95–2064.28: g4450 hasta 2053.38 · g4460 hasta 2056.45 · e_filmmal hasta el final
export const Empanado: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS + 2050.95;
  const FILM = "polygon(386px 104px,956px 132px,970px 654px,388px 678px)";
  if (t < 2053.38) {
    // "veinticuatro horas" 2051.95–2053.2: la condensación sube de abajo arriba
    const k = interpolate(t, [2051.7, 2053.3], [0, 1], { ...cl, easing: Easing.inOut(Easing.quad) });
    const edge = 690 - k * 640;
    const m = `linear-gradient(to bottom, transparent ${edge - 120}px, #000 ${edge + 40}px)`;
    return (
      <AbsoluteFill style={{ overflow: "hidden", background: "#111" }}>
        <div style={{ position: "absolute", inset: 0, transform: `scale(${1.03 + 0.06 * k})`, transformOrigin: "680px 390px" }}>
          <Img src={P("g4450")} style={full} />
          <div style={{ position: "absolute", inset: 0, clipPath: FILM }}>
            <Img src={P("g4450")} style={{ ...full, filter: "blur(7px) brightness(1.18) contrast(0.8)", WebkitMaskImage: m, maskImage: m, opacity: 0.92 }} />
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  if (t < 2056.45) {
    // "a contraluz" 2055.97: todo baja menos el haz que sale de la lente real hacia el film
    const k = interpolate(t, [2055.4, 2056.1], [0, 1], cl);
    const BEAM = "polygon(1112px 470px,1150px 175px,1445px 165px,1455px 645px,1150px 685px,1112px 552px)";
    return (
      <AbsoluteFill style={{ overflow: "hidden", background: "#111" }}>
        <div style={{ position: "absolute", inset: 0, transform: `scale(${1.02 + 0.04 * interpolate(t, [2053.38, 2056.45], [0, 1], cl)})`, transformOrigin: "1200px 420px" }}>
          <Img src={P("g4460")} style={{ ...full, filter: `brightness(${1 - 0.45 * k})` }} />
          <Img src={P("g4460")} style={{ ...full, clipPath: BEAM, filter: `brightness(${1 + 0.25 * k})`, opacity: k }} />
        </div>
      </AbsoluteFill>
    );
  }
  // e_filmmal: "gotitas" 2058.64 → "empañado" 2059.7: el haz real barre el film y las gotitas brillan donde pasa
  const x = interpolate(t, [2057.4, 2059.9], [560, 1260], { ...cl, easing: ease });
  const spot = `radial-gradient(ellipse 260px 330px at ${x}px 470px, #000 30%, transparent 100%)`;
  const sw = interpolate(t, [2057.3, 2057.6, 2061.5, 2062.2], [0, 1, 1, 0.35], cl);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#111" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1.03 + 0.07 * interpolate(t, [2056.45, 2064.28], [0, 1], cl)})`, transformOrigin: "905px 480px" }}>
        <Img src={P("e_filmmal")} style={{ ...full, filter: `brightness(${1 - 0.3 * sw})` }} />
        <div style={{ position: "absolute", inset: 0, clipPath: "polygon(640px 92px,1236px 192px,1238px 815px,642px 758px)" }}>
          <Img src={P("e_filmmal")} style={{ ...full, filter: "brightness(1.45) contrast(1.35)", WebkitMaskImage: spot, maskImage: spot, opacity: sw }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
