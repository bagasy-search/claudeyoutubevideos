// Piezas propias de Claudio el Conserje (cons15c, trastes: el lavaloza del hotel). Todo CSS/DOM, sin SVG sobre las fotos.
// Ninguna repite trucos de cons15a (llave, cartel de picaporte, tarjeta del huésped, hoja de servicio) ni de cons15b
// (dial del ascensor, tarjeta-llave, recado rosa, persiana). Registro: D:/rtmp/cons14_COMPONENTES.md
//  · ComandaRail  — contador "error n de 9": la comanda de papel térmico corre por el riel de acero del pase y la sella "ERROR".
//  · ClocheCTA    — suscripción: v1 la campana de acero se levanta del plato; v2 un plato gira en el escurridor.
//  · VaporText    — pregunta de comentarios: v1 un dedo escribe en el vidrio empañado; v2 tiza en la pizarra del lavaloza.
//  · RackRecap    — repaso: 9 platos entran de canto al escurridor, cada uno con la foto de su error.
//  · TresTinas    — el premio del error 6: las tres tinas de acero se llenan (lavar · enjuagar · desinfectar).
//  · NuncaJuntos  — el cloro solo: los otros frascos salen despedidos y cae la barrera roja.
import React from "react";
import { AbsoluteFill, Img, Easing, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { CL, SERIF, LABEL, HAND } from "./ClTheme";

const K = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const MONO = "'Courier New', Courier, monospace";
const steel = "linear-gradient(180deg, #F4F6F8 0%, #C9CED4 22%, #9AA1A9 50%, #D7DBE0 72%, #8D949C 100%)";
const steelV = "linear-gradient(90deg, #8D949C 0%, #D7DBE0 18%, #F1F3F5 34%, #AEB4BB 60%, #E2E5E8 82%, #8D949C 100%)";
// salida: todo sube y sale por arriba (nunca un fundido encima de la cara)
const liftOut = (f: number, dur: number, n = 12) => interpolate(f, [dur - n, dur], [0, -1150], { ...K, easing: Easing.in(Easing.cubic) });
const dropOut = (f: number, dur: number, n = 12) => interpolate(f, [dur - n, dur], [0, 700], { ...K, easing: Easing.in(Easing.cubic) });
// borde dentado del papel térmico
const zig = (n: number) => { const p: string[] = ["0% 0%", "100% 0%", "100% 96%"]; for (let i = n; i >= 0; i--) p.push(`${(i / n) * 100}% ${i % 2 ? 100 : 96}%`); return `polygon(${p.join(",")})`; };

const BgPhoto: React.FC<{ src: string; dur: number; f: number }> = ({ src, dur, f }) => {
  const z = interpolate(f, [0, dur], [1.05, 1.15]);
  const x = interpolate(f, [0, dur], [12, -12]);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: CL.navyDeep }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translateX(${x}px) scale(${z})`, transformOrigin: "50% 70%" }} />
    </AbsoluteFill>
  );
};

// 1) COMANDA EN EL RIEL: riel de acero del pase arriba; las comandas de los errores anteriores ya cuelgan (chicas, tachadas);
// la nueva entra corriendo desde la derecha, se balancea colgada de la pinza y un sello rojo "ERROR" la golpea.
export const ComandaRail: React.FC<{ n: number; total: number; title: string; src: string; dur: number }> = ({ n, total, title, src, dur }) => {
  const f = useCurrentFrame();
  const y = liftOut(f, dur);
  const railIn = spring({ frame: f, fps: 30, config: { damping: 18 } });
  const run = interpolate(f, [4, 22], [1300, 0], { ...K, easing: Easing.out(Easing.cubic) });
  const swing = f < 22 ? 9 : 9 * Math.exp(-(f - 22) / 14) * Math.cos((f - 22) / 3.2);
  const ST = 28;
  const stamp = spring({ frame: f - ST, fps: 30, config: { damping: 9, stiffness: 160 } });
  const shake = f >= ST && f < ST + 6 ? Math.sin(f * 3.1) * 5 : 0;
  const tIn = spring({ frame: f - 16, fps: 30, config: { damping: 18 } });
  const last = n === total;
  const glow = last ? interpolate(f, [ST, ST + 6, ST + 26], [0, 0.22, 0], K) : 0;
  return (
    <AbsoluteFill style={{ transform: `translateY(${y}px)` }}>
      <BgPhoto src={src} dur={dur} f={f} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(19,29,53,0.88) 0%, rgba(19,29,53,0.5) 34%, rgba(19,29,53,0.05) 55%, rgba(19,29,53,0.2) 66%, rgba(19,29,53,0.9) 100%)" }} />
      {/* riel */}
      <div style={{ position: "absolute", left: 80, right: 80, top: 54, height: 46, borderRadius: 10, background: steel, transform: `translateY(${(1 - railIn) * -200}px)`,
        boxShadow: "0 14px 26px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.8)" }}>
        <div style={{ position: "absolute", left: 14, right: 14, bottom: 6, height: 8, borderRadius: 4, background: "rgba(40,46,54,0.55)" }} />
      </div>
      {/* comandas de los errores anteriores */}
      {Array.from({ length: n - 1 }, (_, i) => {
        const sw = Math.sin(f / 9 + i) * 1.4;
        return (
          <div key={i} style={{ position: "absolute", left: 120 + i * 92, top: 86, width: 84, height: 128, transformOrigin: "50% 0%", transform: `translateY(${(1 - railIn) * -260}px) rotate(${sw - 3 + (i % 3)}deg)`,
            background: "#F3F0E8", clipPath: zig(8), boxShadow: "0 6px 10px rgba(0,0,0,0.35)", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 16 }}>
            <div style={{ fontFamily: MONO, fontSize: 13, color: "#6B6B6B" }}>ERROR</div>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 46, color: "#8A8A8A", lineHeight: 1 }}>{i + 1}</div>
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 30, color: "#2E8B57", lineHeight: 1, marginTop: 4 }}>✓</div>
          </div>
        );
      })}
      {/* comanda nueva */}
      <div style={{ position: "absolute", left: 960 - 230, top: 70, width: 460, height: 560, transform: `translateX(${run}px) rotate(${swing}deg)`, transformOrigin: "50% 0%" }}>
        <div style={{ position: "absolute", left: 200, top: -18, width: 60, height: 44, borderRadius: 8, background: steelV, boxShadow: "0 4px 8px rgba(0,0,0,0.5)", zIndex: 2 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #FFFFFF 0%, #F6F3EC 70%, #ECE6DA 100%)", clipPath: zig(18),
          boxShadow: "0 24px 40px rgba(0,0,0,0.55)", padding: "40px 34px 0", display: "flex", flexDirection: "column", alignItems: "center", fontFamily: MONO, color: "#2A2A2A" }}>
          <div style={{ fontSize: 26, letterSpacing: 4, fontWeight: 700 }}>LAVALOZA</div>
          <div style={{ fontSize: 20, marginTop: 4, color: "#555" }}>Doña Chela · turno noche</div>
          <div style={{ width: "100%", borderTop: "3px dashed #9A9A9A", margin: "18px 0 6px" }} />
          <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 40, letterSpacing: 8, color: CL.inkSoft, marginTop: 6 }}>ERROR</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, lineHeight: 1 }}>
            <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 230, color: CL.navy }}>{n}</span>
            <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 70, color: "#8C8C8C" }}>/ {total}</span>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            {Array.from({ length: total }, (_, i) => (
              <div key={i} style={{ width: 22, height: 22, borderRadius: 11, border: "3px solid #3A3A3A", background: i < n - 1 ? "#3A3A3A" : i === n - 1 ? CL.red : "transparent" }} />
            ))}
          </div>
        </div>
        {/* sello */}
        <div style={{ position: "absolute", left: 130, top: 452, width: 200, height: 84, border: `7px solid ${CL.red}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: LABEL, fontWeight: 700, fontSize: 58, letterSpacing: 10, color: CL.red, mixBlendMode: "multiply",
          opacity: f >= ST ? Math.min(1, stamp * 1.2) * 0.86 : 0, transform: `rotate(-12deg) scale(${1.9 - 0.9 * Math.min(1, stamp)}) translateX(${shake}px)` }}>MAL</div>
      </div>
      <AbsoluteFill style={{ background: "#FFF3C9", opacity: glow }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, display: "flex", justifyContent: "center", opacity: tIn, transform: `translateY(${(1 - tIn) * 50}px)` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: title.length > 26 ? 92 : 112, lineHeight: 1.02, color: CL.white, maxWidth: 1640,
          textAlign: "center", textWrap: "balance" as any, textShadow: "0 5px 22px rgba(0,0,0,0.75), 0 2px 4px rgba(0,0,0,0.6)" }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// 2a) CAMPANA DEL PASE (v=1): en el tercio derecho, un plato blanco sobre la repisa de acero bajo la lámpara de calor;
// la campana de acero se levanta y deja ver "SUSCRÍBASE" escrito en el plato; vapor que sube; luego el sello "SUSCRITO ✓".
// 2b) PLATO QUE GIRA (v=2): un plato parado en el escurridor gira sobre su eje y del otro lado dice "SUSCRITO ✓".
export const ClocheCTA: React.FC<{ text?: string; v?: number; dur: number }> = ({ v = 1, dur }) => {
  const f = useCurrentFrame();
  const y = dropOut(f, dur, 14);
  const inn = spring({ frame: f, fps: 30, config: { damping: 16 } });
  if (v === 2) {
    const turn = interpolate(f, [26, 46], [0, 180], { ...K, easing: Easing.inOut(Easing.cubic) });
    const wob = f > 46 ? Math.sin((f - 46) / 2.4) * 6 * Math.exp(-(f - 46) / 12) : 0;
    const ring = interpolate(f, [46, 70], [0, 1], K);
    return (
      <AbsoluteFill style={{ transform: `translateY(${y}px)` }}>
        <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(19,29,53,0.6) 0%, rgba(19,29,53,0) 48%)" }} />
        <div style={{ position: "absolute", left: 1120, top: 470, width: 640, height: 600, transform: `translateY(${(1 - inn) * 640}px)` }}>
          {/* escurridor de alambre */}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, height: 150, borderRadius: 18, border: "8px solid #C9CED4",
            background: "repeating-linear-gradient(90deg, rgba(201,206,212,0.95) 0 8px, rgba(0,0,0,0) 8px 54px)", boxShadow: "0 18px 30px rgba(0,0,0,0.45)" }} />
          <div style={{ position: "absolute", left: 120, top: 0, width: 400, height: 400, perspective: 1400 }}>
            <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateY(${turn}deg) rotate(${wob}deg)` }}>
              {[0, 1].map((s) => (
                <div key={s} style={{ position: "absolute", inset: 0, borderRadius: 200, backfaceVisibility: "hidden", transform: s ? "rotateY(180deg)" : undefined,
                  background: "radial-gradient(circle at 42% 38%, #FFFFFF 0%, #F7F4EE 46%, #E4DED2 64%, #FFFFFF 67%, #DCD5C7 100%)",
                  boxShadow: "0 16px 30px rgba(0,0,0,0.45), inset 0 0 0 10px rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                  <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: s ? 60 : 56, letterSpacing: 3, color: s ? CL.navy : CL.red, textAlign: "center", lineHeight: 1.05 }}>{s ? "SUSCRITO" : "SUSCRÍBASE"}</div>
                  {s ? <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: CL.yellow, lineHeight: 1, textShadow: "0 3px 0 #9C7A12" }}>✓</div> : null}
                </div>
              ))}
            </div>
            {f >= 46 && ring < 1 ? <div style={{ position: "absolute", left: -20, top: -20, width: 440, height: 440, borderRadius: 220, border: `6px solid ${CL.yellow}`, opacity: 1 - ring, transform: `scale(${1 + ring * 0.5})` }} /> : null}
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  const lift = interpolate(f, [14, 34], [0, 1], { ...K, easing: Easing.inOut(Easing.cubic) });
  const ST = 52;
  const stamp = spring({ frame: f - ST, fps: 30, config: { damping: 10, stiffness: 150 } });
  const lamp = 0.55 + 0.1 * Math.sin(f / 5);
  return (
    <AbsoluteFill style={{ transform: `translateY(${y}px)` }}>
      <AbsoluteFill style={{ background: "linear-gradient(270deg, rgba(19,29,53,0.6) 0%, rgba(19,29,53,0) 52%)" }} />
      <div style={{ position: "absolute", left: 1080, top: 0, width: 760, height: 1080, transform: `translateX(${(1 - inn) * 820}px)` }}>
        {/* lámpara de calor */}
        <div style={{ position: "absolute", left: 160, top: -30, width: 440, height: 120, borderRadius: "0 0 40px 40px", background: steel, boxShadow: "0 10px 20px rgba(0,0,0,0.5)" }} />
        <div style={{ position: "absolute", left: 120, top: 80, width: 520, height: 700, background: `radial-gradient(ellipse at 50% 0%, rgba(255,170,80,${lamp}) 0%, rgba(255,170,80,0) 70%)` }} />
        {/* repisa */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 820, height: 70, background: steel, borderRadius: 8, boxShadow: "0 24px 40px rgba(0,0,0,0.55)" }} />
        {/* plato */}
        <div style={{ position: "absolute", left: 110, top: 700, width: 540, height: 150, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 40%, #FFFFFF 0%, #F3EFE7 50%, #DDD6C9 66%, #FFFFFF 70%, #CFC7B8 100%)",
          boxShadow: "0 14px 22px rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 58, letterSpacing: 4, color: CL.red, transform: "scaleY(0.62)", opacity: interpolate(f, [24, 34], [0, 1], K) }}>SUSCRÍBASE</div>
        </div>
        {/* vapor */}
        {[0, 1, 2].map((i) => { const t = ((f + i * 17) % 50) / 50; return f > 30 ? (
          <div key={i} style={{ position: "absolute", left: 300 + i * 70 + Math.sin(t * 6 + i) * 20, top: 680 - t * 260, width: 60, height: 120, borderRadius: 40,
            background: "radial-gradient(ellipse, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%)", opacity: Math.sin(t * Math.PI) * 0.8, filter: "blur(6px)" }} />) : null; })}
        {/* campana */}
        <div style={{ position: "absolute", left: 130, top: 470, width: 500, height: 300, transformOrigin: "100% 100%",
          transform: `translate(${lift * 260}px, ${lift * -420}px) rotate(${lift * 28}deg)` }}>
          <div style={{ position: "absolute", left: 210, top: -10, width: 80, height: 50, borderRadius: "40px 40px 10px 10px", background: steelV }} />
          <div style={{ position: "absolute", left: 0, top: 30, width: 500, height: 270, borderRadius: "250px 250px 20px 20px", background: "radial-gradient(ellipse at 35% 25%, #FFFFFF 0%, #DDE1E5 22%, #A3AAB2 60%, #6E757D 100%)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.5), inset 0 -16px 24px rgba(0,0,0,0.25)" }} />
        </div>
        {/* sello */}
        <div style={{ position: "absolute", left: 150, top: 560, width: 460, height: 120, borderRadius: 16, background: CL.yellow, display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: LABEL, fontWeight: 700, fontSize: 68, letterSpacing: 4, color: CL.navyDeep, boxShadow: "0 16px 30px rgba(0,0,0,0.5)",
          opacity: f >= ST ? 1 : 0, transform: `rotate(-6deg) scale(${f >= ST ? 1.7 - 0.7 * Math.min(1, stamp) : 1})` }}>SUSCRITO ✓</div>
      </div>
    </AbsoluteFill>
  );
};

// 3a) VIDRIO EMPAÑADO (v=1): en el tercio inferior, la ventana del lavaloza empañada por el vapor; un dedo invisible
// escribe la pregunta a mano (se aclara el vidrio de izquierda a derecha) y caen gotitas desde las letras.
// 3b) PIZARRA (v=2): la pizarra verde del lavaloza entra de lado y la pregunta aparece en tiza, letra por letra, con polvo.
export const VaporText: React.FC<{ text: string; v?: number; dur: number }> = ({ text, v = 1, dur }) => {
  const f = useCurrentFrame();
  const y = dropOut(f, dur, 12);
  const inn = spring({ frame: f, fps: 30, config: { damping: 16 } });
  const W0 = 14, W1 = W0 + Math.max(30, Math.round(text.length * 1.2));
  const rev = interpolate(f, [W0, W1], [0, 100], K);
  if (v === 2) {
    const shown = Math.floor(interpolate(f, [W0, W1], [0, text.length], K));
    return (
      <AbsoluteFill style={{ transform: `translateY(${y}px)` }}>
        <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(19,29,53,0.55) 0%, rgba(19,29,53,0) 45%)" }} />
        <div style={{ position: "absolute", left: 160, right: 160, bottom: 60, height: 330, transform: `translateX(${(1 - inn) * -1800}px) rotate(-1deg)`,
          borderRadius: 10, border: "22px solid #7A5230", background: "radial-gradient(ellipse at 40% 40%, #2F4A3A 0%, #24392D 70%, #1C2D23 100%)",
          boxShadow: "0 26px 50px rgba(0,0,0,0.55), inset 0 0 40px rgba(0,0,0,0.5)", padding: "26px 50px", display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 34, letterSpacing: 6, color: "rgba(255,255,255,0.72)" }}>PREGUNTA DEL LAVALOZA ↓ COMENTARIOS</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: text.length > 40 ? 84 : 96, lineHeight: 1.05, color: "rgba(250,250,245,0.94)", marginTop: 10,
            textShadow: "0 0 2px rgba(255,255,255,0.6)" }}>{text.slice(0, shown)}<span style={{ opacity: 0 }}>{text.slice(shown)}</span></div>
          <div style={{ position: "absolute", left: 60, right: 60, bottom: -8, height: 16, borderRadius: 4, background: "#5E3E22" }} />
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ transform: `translateY(${y}px)` }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 400, transform: `translateY(${(1 - inn) * 420}px)` }}>
        {/* vidrio empañado */}
        <div style={{ position: "absolute", inset: 0, backdropFilter: "blur(16px) brightness(1.08)", background: "linear-gradient(180deg, rgba(230,236,240,0.55) 0%, rgba(215,224,230,0.72) 100%)",
          borderTop: `8px solid ${CL.white}`, boxShadow: "0 -16px 40px rgba(0,0,0,0.3)" }} />
        {/* marco de la ventana */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 18, background: steel }} />
        <div style={{ position: "absolute", left: 120, top: 46, fontFamily: LABEL, fontWeight: 700, fontSize: 32, letterSpacing: 6, color: CL.navy, opacity: 0.85 }}>DÍGAME EN LOS COMENTARIOS</div>
        {/* letras limpias sobre el vapor: el vidrio se aclara donde pasa el dedo */}
        <div style={{ position: "absolute", left: 120, right: 120, top: 100, fontFamily: HAND, fontWeight: 700, fontSize: text.length > 40 ? 96 : 110, lineHeight: 1.04, color: CL.navyDeep,
          WebkitMaskImage: `linear-gradient(90deg, #000 ${rev}%, transparent ${rev + 4}%)`, maskImage: `linear-gradient(90deg, #000 ${rev}%, transparent ${rev + 4}%)`,
          textShadow: "0 0 10px rgba(255,255,255,0.8)" }}>{text}</div>
        {/* yema del dedo que va escribiendo */}
        {rev > 0 && rev < 100 ? <div style={{ position: "absolute", left: 120 + (1680 * rev) / 100 - 30, top: 150 + Math.sin(f / 2) * 30, width: 60, height: 60, borderRadius: 30,
          background: "radial-gradient(circle, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 70%)" }} /> : null}
        {/* gotas que bajan */}
        {[0, 1, 2, 3, 4].map((i) => { const s = W0 + 10 + i * 9; const p = interpolate(f, [s, s + 50], [0, 1], K); return f > s ? (
          <div key={i} style={{ position: "absolute", left: 220 + i * 330, top: 230 + p * 150, width: 10, height: 18 + p * 30, borderRadius: 6,
            background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 100%)" }} />) : null; })}
      </div>
    </AbsoluteFill>
  );
};

// 4) REPASO EN EL ESCURRIDOR: sobre la foto desenfocada, un escurridor de alambre cruza la pantalla; cuando Claudio
// dice cada número, un plato entra de canto desde arriba a su ranura con la foto de ese error y rebota; arriba, el
// error que se está diciendo en letra grande. Al final, ola de brillo por todos los platos.
export const RackRecap: React.FC<{ items: string[]; marks: number[]; srcs?: string[]; bg?: string; dur: number }> = ({ items, marks, srcs = [], bg, dur }) => {
  const f = useCurrentFrame();
  const y = liftOut(f, dur, 14);
  const inn = spring({ frame: f, fps: 30, config: { damping: 18 } });
  const N = items.length, PW = 186, GAP = 12, X0 = 960 - (N * PW + (N - 1) * GAP) / 2;
  const cur = marks.reduce((a, m, i) => (f >= m ? i : a), -1);
  const lastM = marks[N - 1] ?? 0;
  const wave = interpolate(f, [lastM + 30, lastM + 60], [-20, 120], K);
  return (
    <AbsoluteFill style={{ transform: `translateY(${y}px)` }}>
      <AbsoluteFill style={{ overflow: "hidden", background: CL.navyDeep }}>
        {bg ? <Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(14px) brightness(0.55)", transform: `scale(${1.1 + f * 0.00012}) translate(${Math.sin(f / 70) * 18}px, ${Math.cos(f / 90) * 10}px)` }} /> : null}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(19,29,53,0.55) 0%, rgba(19,29,53,0.25) 50%, rgba(19,29,53,0.7) 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", flexDirection: "column", alignItems: "center", opacity: inn }}>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 44, letterSpacing: 10, color: CL.yellow }}>{cur >= 0 ? `ERROR ${cur + 1}` : "LOS NUEVE ERRORES"}</div>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 92, lineHeight: 1.04, color: CL.white, maxWidth: 1600, textAlign: "center", textWrap: "balance" as any,
          textShadow: "0 4px 18px rgba(0,0,0,0.6)", minHeight: 200 }}>{cur >= 0 ? items[cur] : ""}</div>
      </div>
      {/* escurridor */}
      <div style={{ position: "absolute", left: X0 - 50, width: N * PW + (N - 1) * GAP + 100, top: 800, height: 150, transform: `translateY(${(1 - inn) * 400}px)`,
        borderRadius: 20, border: "9px solid #C9CED4", background: "repeating-linear-gradient(90deg, rgba(201,206,212,0.9) 0 7px, rgba(0,0,0,0) 7px 50px)", boxShadow: "0 22px 40px rgba(0,0,0,0.5)" }} />
      {items.map((it, i) => {
        const m = marks[i] ?? 0;
        const d = spring({ frame: f - m, fps: 30, config: { damping: 11, stiffness: 140 } });
        const on = i === cur;
        const sh = interpolate(wave, [i * 11 - 10, i * 11, i * 11 + 10], [0, 1, 0], K);
        return f >= m ? (
          <div key={i} style={{ position: "absolute", left: X0 + i * (PW + GAP), top: 470, width: PW, height: PW * 1.0 + 160,
            transform: `translateY(${(1 - d) * -700 + Math.sin((f + i * 9) / 16) * 5}px) scale(${on ? 1.08 + Math.sin(f / 8) * 0.025 : 1})`, transformOrigin: "50% 100%" }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: PW, height: PW, borderRadius: PW / 2, overflow: "hidden",
              background: "radial-gradient(circle, #FFFFFF 0%, #F3EFE7 60%, #DCD5C7 100%)", padding: 16, boxSizing: "border-box",
              boxShadow: on ? `0 0 0 6px ${CL.yellow}, 0 16px 26px rgba(0,0,0,0.5)` : "0 14px 22px rgba(0,0,0,0.45)" }}>
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: CL.tile }}>
                {srcs[i] ? <Img src={staticFile(srcs[i])} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
              </div>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,${0.55 * sh}) 50%, rgba(255,255,255,0) 70%)` }} />
            </div>
            <div style={{ position: "absolute", left: PW / 2 - 34, top: -22, width: 68, height: 68, borderRadius: 34, background: on ? CL.yellow : CL.navy, color: on ? CL.navyDeep : CL.white,
              display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 40, boxShadow: "0 6px 12px rgba(0,0,0,0.45)" }}>{i + 1}</div>
            <div style={{ position: "absolute", left: -6, right: -6, top: PW + 196, fontFamily: LABEL, fontWeight: 600, fontSize: 24, lineHeight: 1.1, color: CL.white, textAlign: "center",
              textShadow: "0 2px 6px rgba(0,0,0,0.8)", opacity: on ? 1 : 0.8 }}>{it}</div>
          </div>
        ) : null;
      })}
    </AbsoluteFill>
  );
};

// 5) LAS TRES TINAS (el premio): tres tinas de acero de frente; en cada marca una se llena — espuma en la 1ª,
// agua clara con ondas en la 2ª, agua fría apenas azul con la cucharada que cae en la 3ª — y se enciende su rótulo.
export const TresTinas: React.FC<{ marks: number[]; dose?: string; dur: number }> = ({ marks, dose = "1 cucharada de cloro sin aroma · 1 galón (≈ 4 L) de agua fría · 1 minuto", dur }) => {
  const f = useCurrentFrame();
  const y = liftOut(f, dur, 14);
  const inn = spring({ frame: f, fps: 30, config: { damping: 17 } });
  const LBL = ["LAVAR", "ENJUAGAR", "DESINFECTAR"], SUB = ["agua caliente + jabón", "agua limpia", "agua fría + cloro"];
  const WATER = ["linear-gradient(180deg, #DCE7EA 0%, #B9CCD2 100%)", "linear-gradient(180deg, #CFE6F2 0%, #9CC7DD 100%)", "linear-gradient(180deg, #D6ECFA 0%, #8FC3E6 100%)"];
  const doseIn = interpolate(f, [(marks[2] ?? 60) + 24, (marks[2] ?? 60) + 36], [0, 1], K);
  return (
    <AbsoluteFill style={{ transform: `translateY(${y}px)` }}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${CL.tile} 0%, ${CL.white} 55%, #E2DCD0 100%)` }} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${CL.grout} 2px, transparent 2px), linear-gradient(90deg, ${CL.grout} 2px, transparent 2px)`, backgroundSize: "120px 120px", opacity: 0.55 }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: CL.navy, opacity: inn }}>Las tres tinas del hotel</div>
      {/* mesada de acero */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 400, height: 60, background: steel, borderRadius: 10, transform: `translateY(${(1 - inn) * 600}px)`, boxShadow: "0 10px 20px rgba(0,0,0,0.25)" }} />
      {[0, 1, 2].map((i) => {
        const m = marks[i] ?? 0;
        const fill = interpolate(f, [m, m + 22], [0, 1], { ...K, easing: Easing.out(Easing.cubic) });
        const on = f >= m;
        const x = 180 + i * 540;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 450, width: 480, height: 420, transform: `translateY(${(1 - inn) * 600}px)` }}>
            {/* tina */}
            <div style={{ position: "absolute", inset: 0, borderRadius: "0 0 36px 36px", background: "linear-gradient(90deg, #7E858D 0%, #B9BFC6 20%, #D9DDE1 50%, #B1B7BE 80%, #7E858D 100%)",
              boxShadow: "inset 0 18px 30px rgba(0,0,0,0.35), 0 20px 30px rgba(0,0,0,0.25)", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 18, right: 18, bottom: 18, height: `${fill * 78}%`, borderRadius: "0 0 26px 26px", background: WATER[i], opacity: 0.92 }}>
                {/* superficie */}
                <div style={{ position: "absolute", left: 0, right: 0, top: -6, height: 14, borderRadius: 7, background: "rgba(255,255,255,0.7)", transform: `translateY(${Math.sin(f / 4 + i) * 3}px)` }} />
                {i === 0 && fill > 0.3 ? Array.from({ length: 14 }, (_, k) => (
                  <div key={k} style={{ position: "absolute", left: (k * 37) % 420, top: -26 + ((k * 13) % 22), width: 34 + (k % 4) * 10, height: 34 + (k % 4) * 10, borderRadius: "50%",
                    background: "radial-gradient(circle at 35% 35%, #FFFFFF 0%, #F1F4F5 60%, #D5DDE0 100%)", transform: `scale(${Math.min(1, (fill - 0.3) * 2)})` }} />)) : null}
                {i === 1 ? [0, 1].map((k) => { const p = ((f - m + k * 20) % 40) / 40; return f > m ? (
                  <div key={k} style={{ position: "absolute", left: 220 - p * 160, top: 20 - p * 10, width: 40 + p * 320, height: 20 + p * 30, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.7)", opacity: 1 - p }} />) : null; }) : null}
              </div>
              {/* cucharada que cae en la 3ª */}
              {i === 2 ? (() => { const p = interpolate(f, [m + 10, m + 26], [0, 1], { ...K, easing: Easing.in(Easing.quad) }); return f > m + 8 && p < 1 ? (
                <div style={{ position: "absolute", left: 210, top: -40 + p * 260, width: 60, height: 60, borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)", background: "rgba(255,255,255,0.95)" }} />) : null; })() : null}
            </div>
            {/* rótulo */}
            <div style={{ position: "absolute", left: 0, right: 0, top: -250, display: "flex", flexDirection: "column", alignItems: "center", opacity: on ? 1 : 0.25, transform: `scale(${on ? 1 : 0.94})` }}>
              <div style={{ width: 92, height: 92, borderRadius: 46, background: on ? CL.yellow : CL.navySoft, display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: SERIF, fontWeight: 900, fontSize: 56, color: CL.navyDeep, boxShadow: "0 6px 12px rgba(0,0,0,0.2)" }}>{i + 1}</div>
              <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 60, letterSpacing: 4, color: i === 2 ? CL.nitrile : CL.navy, marginTop: 6 }}>{LBL[i]}</div>
              <div style={{ fontFamily: LABEL, fontWeight: 500, fontSize: 32, color: CL.inkSoft }}>{SUB[i]}</div>
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 160, right: 160, bottom: 50, padding: "18px 30px", borderRadius: 18, background: CL.navy, color: CL.white, textAlign: "center",
        fontFamily: LABEL, fontWeight: 600, fontSize: 44, letterSpacing: 1, opacity: doseIn, transform: `translateY(${(1 - doseIn) * 40}px)` }}>{dose}</div>
    </AbsoluteFill>
  );
};

// 6) NUNCA JUNTOS: el frasco de cloro queda solo en el centro; vinagre y amoníaco intentan acercarse, salen despedidos
// hacia los costados y cae una barrera roja con "NUNCA JUNTOS". Frascos lisos, sin marcas.
export const NuncaJuntos: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const y = liftOut(f, dur, 12);
  const inn = spring({ frame: f, fps: 30, config: { damping: 16 } });
  const near = interpolate(f, [8, 22], [0, 1], { ...K, easing: Easing.inOut(Easing.cubic) });
  const kick = spring({ frame: f - 26, fps: 30, config: { damping: 10, stiffness: 120 } });
  const off = near * 240 - (f >= 26 ? kick * 520 : 0);
  const bar = spring({ frame: f - 30, fps: 30, config: { damping: 12 } });
  const B: React.FC<{ label: string; color: string; cap: string; x: number; rot?: number }> = ({ label, color, cap, x, rot = 0 }) => (
    <div style={{ position: "absolute", left: x - 110, top: 420, width: 220, height: 420, transform: `rotate(${rot}deg)` }}>
      <div style={{ position: "absolute", left: 70, top: 0, width: 80, height: 70, borderRadius: 12, background: cap }} />
      <div style={{ position: "absolute", left: 0, top: 60, width: 220, height: 360, borderRadius: "60px 60px 30px 30px", background: color, boxShadow: "inset -20px 0 30px rgba(0,0,0,0.18), 0 20px 30px rgba(0,0,0,0.3)" }} />
      <div style={{ position: "absolute", left: 20, right: 20, top: 200, padding: "10px 0", borderRadius: 10, background: "rgba(255,255,255,0.92)", textAlign: "center",
        fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 2, color: CL.ink }}>{label}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ transform: `translateY(${y}px)` }}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${CL.white} 0%, ${CL.tile} 100%)`, opacity: inn }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 92, color: CL.navy, opacity: inn }}>El cloro, siempre solo</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 880, height: 30, background: "#C7BCA9" }} />
      <B label="CLORO" color="#F7F7F2" cap={CL.nitrile} x={960} />
      <B label="VINAGRE" color="#EDE3C8" cap={CL.red} x={960 - 520 + off} rot={f >= 26 ? -kick * 14 : 0} />
      <B label="AMONIACO" color="#DCE8EE" cap="#4A8A5C" x={960 + 520 - off} rot={f >= 26 ? kick * 14 : 0} />
      {f >= 30 ? (
        <div style={{ position: "absolute", left: 960 - 420, top: 300, width: 840, height: 120, borderRadius: 16, background: CL.red, color: CL.white,
          display: "flex", alignItems: "center", justifyContent: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 72, letterSpacing: 8,
          transform: `translateY(${(1 - bar) * -400}px)`, boxShadow: "0 18px 30px rgba(0,0,0,0.35)" }}>NUNCA JUNTOS</div>
      ) : null}
    </AbsoluteFill>
  );
};
