import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Stage } from "./base";
import { FONT, e, ei, spr, extrude } from "./lib";

const W = 1920, H = 1080;
const S = (x: unknown, d = 0): number => {
  const n = typeof x === "number" ? x : Number(x);
  return Number.isFinite(n) ? n : d;
};
const c01 = (x: unknown) => Math.max(0, Math.min(1, S(x, 0)));
const drop = (t: number, a: number, h = 1.1) => {
  const u = S(t) - S(a);
  if (u <= 0) return h;
  const fall = Math.min(1, u / 0.25);
  const bounce = u > 0.25 ? Math.sin(Math.min(1, (u - 0.25) / 0.2) * Math.PI) * 0.06 : 0;
  return h * (1 - fall) - bounce;
};
const over = (x: number) => {
  const c = Math.max(0, Math.min(1, x));
  return 1 + 0.16 * Math.sin(c * Math.PI * 1.5) * (1 - c);
};

const TANQUE_W = 760, TANQUE_H = 460;
const TANQUE_L = W * 0.5 - TANQUE_W / 2 - 140;
const TANQUE_T = H * 0.42 - TANQUE_H / 2;
const AGUA_CX = TANQUE_L + TANQUE_W * 0.5;
const AGUA_CY = TANQUE_T + TANQUE_H * 0.55;
const TAZA_W = 420, TAZA_H = 420;
const TAZA_L = W * 0.5 - TAZA_W / 2 + 260;
const TAZA_T = H * 0.72 - TAZA_H / 2;
const TAZA_BOCA_Y = TAZA_T + TAZA_H * 0.35;

export const PruebaColorante: React.FC<{
  t: number; at: number; out: number; clave: number;
  gota?: string; tazaImg?: string; tanqueImg?: string; label?: string;
}> = ({ t, at, out, clave, gota = "#1e6fff", tazaImg, tanqueImg, label = "LA TAZA ESTABA AZUL" }) => {
  const T = S(t), AT = S(at), OUT = S(out), CLAVE = S(clave);

  const enter = c01(spr(T, AT, 0.9));
  const exit = c01((T - OUT) / 0.5);
  const zOut = -110 * exit;
  const blurOut = 16 * exit;
  const camScale = 1 + 0.05 * c01(e(T, AT, OUT + 0.5));
  const drift = 6 * Math.sin((T - AT) * 0.8);
  const microPar = T >= CLAVE + 2.5 ? Math.sin((T - CLAVE - 2.5) * 2.4) * 2.6 * c01((T - CLAVE - 2.5) / 0.4) : 0;

  // GOTA
  const gA = AT + 0.3;
  const gFall = c01(drop(T, gA, 1.1));
  const gVis = T >= gA - 0.02 && T <= gA + 0.55;
  const GOTA_TOP = AGUA_CY - 40 - 260;
  const trail = [0, 1, 2, 3].map(i => ({ y: c01(gFall + 0.13 * (i + 1)), o: Math.max(0, 0.85 - i * 0.18), sz: 30 - i * 5 }));

  // IMPACTO
  const impAt = gA + 0.25;
  const impact = c01((T - impAt) / 1.0);
  const ringR = 1 + impact * 4.2;
  const ringO = (1 - impact) * 1.0;
  const ring2R = 1 + impact * 2.8;
  const ring2O = (1 - impact) * 0.7;
  const splash = T >= impAt && T <= impAt + 0.35 ? Math.max(0, 1 - (T - impAt) / 0.35) : 0;

  const mancha = c01(ei(T, impAt, impAt + 1.2));
  const manchaInt = 0.55 + 0.4 * c01(ei(T, CLAVE, CLAVE + 2.5));

  // CRONÓMETRO — entra en clave-0.3, barre 0→600 en 3s
  const cronIn = c01(spr(T, CLAVE - 0.3, 0.9));
  const cronT = c01((T - CLAVE) / 3);
  const cronEase = cronT < 1 ? 1 - Math.pow(1 - cronT, 2.4) : 1;
  const overshoot = T > CLAVE + 3 ? Math.sin(c01((T - CLAVE - 3) / 0.45) * Math.PI) * 9 * (1 - c01((T - CLAVE - 3) / 0.45)) : 0;
  const needle = -90 + cronEase * 360 + overshoot;
  const segs = Math.round(cronEase * 600);
  const mm = Math.floor(segs / 60), ss = segs % 60;
  const counter = `${mm}:${ss.toString().padStart(2, "0")}`;
  const counterPop = T >= CLAVE + 3 ? over(c01((T - CLAVE - 3) / 0.4)) : 1;
  const dialPulse = T >= CLAVE + 3 ? Math.max(0, 1 - (T - CLAVE - 3) / 0.7) : 0;

  const needleRad = (needle * Math.PI) / 180;
  const nx = S(160 + Math.cos(needleRad) * 100, 160);
  const ny = S(160 + Math.sin(needleRad) * 100, 160);
  const dash = S(Math.max(0, cronEase * 880), 0);
  const glowNeedle = T >= CLAVE + 2.6 ? c01((T - CLAVE - 2.6) / 0.5) : 0;

  // HILITO — visible desde clave+0.6 (≈2.7s en demo)
  const hilo = c01(ei(T, CLAVE + 0.6, CLAVE + 1.6));
  const hiloBoost = T >= CLAVE + 3 ? c01((T - CLAVE - 3) / 0.4) : 0;

  // TINTE — arranca en clave+2.5, dura 1.8s
  const tinteRaw = c01(ei(T, CLAVE + 2.5, CLAVE + 4.3));
  const tinte = tinteRaw < 1 ? Math.pow(tinteRaw, 0.75) : 1;
  const tinteOvershoot = T >= CLAVE + 4.3 ? Math.sin(c01((T - CLAVE - 4.3) / 0.5) * Math.PI) * 0.12 * (1 - c01((T - CLAVE - 4.3) / 0.5)) : 0;
  const tinteFinal = Math.min(1, tinte + tinteOvershoot);
  const rim = c01(ei(T, CLAVE + 2.8, CLAVE + 4.4));

  // BLOOM volumétrico anclado a la taza
  const bloomAt = CLAVE + 2.5;
  const bloom = c01(ei(T, bloomAt, bloomAt + 0.9)) * (1 - c01((T - OUT) / 0.5));
  const bloomPulse = 1 + 0.06 * Math.sin((T - bloomAt) * 3.2);

  // TAG — entra en clave+2.5 (mismo instante que el tinte arranca)
  const tagAt = CLAVE + 2.5;
  const tagBreathe = 1 + 0.012 * Math.sin((T - tagAt) * 1.6);
  const tagS = Math.max(0.01, over(c01((T - tagAt) / 0.5))) * tagBreathe;

  const nubes = [0, 1, 2, 3, 4].map(i => {
    const sp = 0.7 + i * 0.12;
    const ph = i * 1.3;
    const grow = c01(ei(T, CLAVE + 2.5 + i * 0.15, CLAVE + 4.3 + i * 0.2));
    const cx = 50 + Math.sin((T - AT) * 0.6 * sp + ph) * 22;
    const cy = 60 + Math.cos((T - AT) * 0.5 * sp + ph) * 18 - grow * 34;
    const r = 24 + grow * (36 + i * 6);
    const op = (0.35 + i * 0.08) * grow * (0.6 + 0.4 * Math.sin((T - AT) * 1.1 + ph));
    return { cx, cy, r, op };
  });
  const spec = ((T - AT) * 0.4) % 1;

  const SAPO_X = AGUA_CX + 40;
  const SAPO_Y = TANQUE_T + TANQUE_H - 10;
  const HILO_LEN = TAZA_BOCA_Y - SAPO_Y;
  const hiloBend = 26 * Math.sin((T - AT) * 1.4);

  const tagAnchorX = TAZA_L + TAZA_W * 0.28;
  const tagAnchorY = TAZA_T + TAZA_H * 0.30;
  const tagBoxL = TAZA_L - 40;
  const tagBoxT = TAZA_T - 130;

  return (
    <AbsoluteFill style={{ background: "#05070c" }}>
      <Stage t={T} a={AT} b={OUT + 0.5} bg="v004_hook" tint="#0a1830">
        <AbsoluteFill style={{ perspective: 1400, transform: `scale(${camScale}) translateX(${microPar}px) translateY(${microPar * 0.5}px)` }}>

          {/* TANQUE — fondo, z negativo, blur, sombra de contacto */}
          <div style={{
            position: "absolute", left: TANQUE_L, top: TANQUE_T,
            width: TANQUE_W, height: TANQUE_H,
            transform: `translateY(${(1 - enter) * 40 + drift}px) translateZ(${zOut * 0.4 - 220}px) scale(${0.94 + 0.06 * enter})`,
            filter: `blur(${6 + blurOut * 0.4}px) brightness(0.85)`,
            opacity: 0.9 * enter, borderRadius: 24, overflow: "hidden",
            boxShadow: "0 40px 90px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.06) inset",
          }}>
            {tanqueImg
              ? <Img src={staticFile(tanqueImg)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <div style={{ width: "100%", height: "100%", background: "linear-gradient(180deg,#9aa9b8,#5a6a7a)" }} />}
            <div style={{
              position: "absolute", left: "8%", right: "8%", top: "18%", bottom: "12%",
              background: "radial-gradient(ellipse at 50% 55%, rgba(217,243,255,0.85), rgba(217,243,255,0.35) 70%, transparent 90%)",
              borderRadius: "50%",
            }} />
            {mancha > 0.01 && (
              <div style={{
                position: "absolute", left: "50%", top: "55%",
                width: 260 * mancha, height: 200 * mancha,
                transform: "translate(-50%,-50%)",
                background: `radial-gradient(circle, ${gota} 0%, ${gota}aa 45%, transparent 75%)`,
                opacity: mancha * manchaInt, filter: "blur(4px)", mixBlendMode: "screen",
              }} />
            )}
            {impact > 0.01 && impact < 1 && (
              <>
                <div style={{
                  position: "absolute", left: "50%", top: "55%", width: 130, height: 100,
                  transform: `translate(-50%,-50%) scale(${ringR})`,
                  border: `6px solid rgba(217,243,255,${ringO})`,
                  borderRadius: "50%", boxShadow: `0 0 40px ${gota}, 0 0 80px ${gota}88, inset 0 0 24px rgba(255,255,255,0.7)`,
                }} />
                <div style={{
                  position: "absolute", left: "50%", top: "55%", width: 90, height: 70,
                  transform: `translate(-50%,-50%) scale(${ring2R})`,
                  border: `3px solid rgba(255,255,255,${ring2O})`,
                  borderRadius: "50%", filter: "blur(2px)", boxShadow: `0 0 30px ${gota}aa`,
                }} />
                <div style={{
                  position: "absolute", left: "50%", top: "55%", width: 60, height: 46,
                  transform: `translate(-50%,-50%) scale(${1 + impact * 6})`,
                  background: `radial-gradient(circle, ${gota}cc 0%, transparent 70%)`,
                  borderRadius: "50%", opacity: ringO * 0.8, filter: "blur(6px)", mixBlendMode: "screen",
                }} />
              </>
            )}
            {splash > 0.01 && (
              <div style={{
                position: "absolute", left: "50%", top: "55%",
                width: 180, height: 140, transform: "translate(-50%,-50%)",
                background: `radial-gradient(circle, #ffffff 0%, ${gota} 30%, transparent 70%)`,
                opacity: splash * 0.95, filter: "blur(4px)", mixBlendMode: "screen",
              }} />
            )}
          </div>

          {/* HILITO sapo→taza */}
          <svg width={W} height={H} style={{ position: "absolute", inset: 0, transform: `translateZ(${zOut * 0.6 - 40}px)`, opacity: hilo, pointerEvents: "none" }}>
            <defs>
              <linearGradient id="hiloGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={`${gota}00`} />
                <stop offset="30%" stopColor={`${gota}cc`} />
                <stop offset="100%" stopColor={`${gota}ff`} />
              </linearGradient>
              <filter id="hiloGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" />
              </filter>
            </defs>
            <path
              d={`M ${SAPO_X} ${SAPO_Y} C ${SAPO_X + hiloBend} ${SAPO_Y + HILO_LEN * 0.35}, ${AGUA_CX - 30 - hiloBend * 0.4} ${SAPO_Y + HILO_LEN * 0.7}, ${AGUA_CX - 10} ${TAZA_BOCA_Y}`}
              stroke={`${gota}88`} strokeWidth={22 + hiloBoost * 8} fill="none" strokeLinecap="round"
              filter="url(#hiloGlow)" style={{ strokeDasharray: 1400, strokeDashoffset: 1400 * (1 - hilo) }}
            />
            <path
              d={`M ${SAPO_X} ${SAPO_Y} C ${SAPO_X + hiloBend} ${SAPO_Y + HILO_LEN * 0.35}, ${AGUA_CX - 30 - hiloBend * 0.4} ${SAPO_Y + HILO_LEN * 0.7}, ${AGUA_CX - 10} ${TAZA_BOCA_Y}`}
              stroke="url(#hiloGrad)" strokeWidth={10 + hiloBoost * 4} fill="none" strokeLinecap="round"
              style={{ strokeDasharray: 1400, strokeDashoffset: 1400 * (1 - hilo) }}
            />
          </svg>

          {/* BLOOM volumétrico anclado a la taza */}
          {bloom > 0.01 && (
            <div style={{
              position: "absolute",
              left: TAZA_L + TAZA_W * 0.5, top: TAZA_T + TAZA_H * 0.55,
              width: TAZA_W * 2.2, height: TAZA_H * 2.2,
              transform: `translate(-50%,-50%) translateZ(${zOut + 40}px) scale(${bloomPulse})`,
              background: `radial-gradient(ellipse at 50% 55%, ${gota}cc 0%, ${gota}66 25%, ${gota}22 50%, transparent 72%)`,
              opacity: bloom * 0.75, mixBlendMode: "screen", filter: "blur(28px)",
              pointerEvents: "none",
            }} />
          )}

          {/* TAZA — frente, z positivo, sombra de contacto */}
          <div style={{
            position: "absolute", left: TAZA_L, top: TAZA_T, width: TAZA_W, height: TAZA_H,
            transform: `translateY(${(1 - enter) * 40 - drift * 0.6}px) translateZ(${zOut + 60}px) scale(${0.94 + 0.06 * enter})`,
            filter: `blur(${blurOut}px)`, opacity: enter,
          }}>
            <div style={{
              position: "absolute", left: "8%", right: "8%", bottom: -34, height: 44,
              background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,.75), transparent 70%)",
              filter: "blur(10px)", opacity: enter,
            }} />
            <div style={{
              position: "relative", width: "100%", height: "100%",
              borderRadius: "50% / 42%", overflow: "hidden",
              boxShadow: `0 30px 70px rgba(0,0,0,.65), inset 0 0 40px rgba(0,0,0,.4)${bloom > 0.01 ? `, 0 0 ${60 * bloom}px ${gota}aa` : ""}`,
              background: "#e8dcc4",
            }}>
              {tazaImg && <Img src={staticFile(tazaImg)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", maskImage: "radial-gradient(ellipse at 50% 55%, #000 60%, transparent 92%)", WebkitMaskImage: "radial-gradient(ellipse at 50% 55%, #000 60%, transparent 92%)" }} />}
              <div style={{
                position: "absolute", left: "14%", right: "14%", top: "22%", bottom: "18%",
                borderRadius: "50%",
                background: "radial-gradient(ellipse at 50% 60%, rgba(217,243,255,0.85), rgba(217,243,255,0.35) 70%, transparent 92%)",
              }} />
              {tinteFinal > 0.01 && (
                <div style={{
                  position: "absolute", left: "14%", right: "14%", top: "22%", bottom: "18%",
                  borderRadius: "50%",
                  overflow: "hidden",
                  maskImage: "radial-gradient(ellipse at 50% 55%, #000 70%, transparent 96%)",
                  WebkitMaskImage: "radial-gradient(ellipse at 50% 55%, #000 70%, transparent 96%)",
                }}>
                  <div style={{
                    position: "absolute", inset: 0,
                    background: `radial-gradient(ellipse at 50% 100%, ${gota}ff 0%, ${gota}dd 40%, ${gota}88 70%, transparent 95%)`,
                    opacity: tinteFinal,
                    transform: `translateY(${(1 - tinteFinal) * 40}%)`,
                    filter: `blur(${2 + (1 - tinteFinal) * 8}px)`,
                  }} />
                  {nubes.map((n, i) => (
                    <div key={i} style={{
                      position: "absolute",
                      left: `${n.cx}%`, top: `${n.cy}%`,
                      width: `${n.r * 2}%`, height: `${n.r * 2}%`,
                      transform: "translate(-50%,-50%)",
                      background: `radial-gradient(circle, ${gota}ee 0%, ${gota}88 40%, ${gota}22 70%, transparent 90%)`,
                      opacity: n.op, mixBlendMode: "multiply", filter: "blur(6px)",
                    }} />
                  ))}
                  <div style={{
                    position: "absolute", left: `${20 + spec * 40}%`, top: "30%",
                    width: "30%", height: "20%",
                    borderRadius: "50%",
                    background: "radial-gradient(ellipse at 40% 40%, rgba(255,255,255,0.9), rgba(255,255,255,0) 70%)",
                    opacity: tinteFinal * 0.85, mixBlendMode: "screen", filter: "blur(3px)",
                  }} />
                </div>
              )}
              {rim > 0.01 && (
                <div style={{
                  position: "absolute", inset: 0,
                  borderRadius: "50% / 42%",
                  boxShadow: `inset 0 0 30px ${gota}cc, inset 0 0 70px ${gota}88, inset 0 0 120px ${gota}44`,
                  opacity: rim * 0.95, mixBlendMode: "screen",
                }} />
              )}
            </div>
          </div>

          {/* GOTA */}
          {gVis && (
            <div style={{ position: "absolute", left: AGUA_CX - 14, top: GOTA_TOP, transform: `translateZ(${zOut * 0.4 - 100}px)` }}>
              {trail.map((p, i) => (
                <div key={i} style={{
                  position: "absolute", left: (30 - p.sz) / 2, top: p.y * 260,
                  width: p.sz, height: p.sz, borderRadius: "50%",
                  background: gota, opacity: p.o, filter: "blur(1.5px)", boxShadow: `0 0 24px ${gota}, 0 0 44px ${gota}88`,
                }} />
              ))}
              <div style={{
                position: "absolute", left: 0, top: gFall * 260,
                width: 28, height: 34, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                background: `radial-gradient(circle at 35% 30%, #ffffff, ${gota} 55%, #0a3faa)`,
                boxShadow: `0 0 30px ${gota}, 0 0 60px ${gota}88`,
              }} />
            </div>
          )}

          {/* CRONÓMETRO — contador ≥96px */}
          {cronIn > 0.01 && (
            <div style={{
              position: "absolute", right: 140, top: 120, width: 320, height: 320,
              transform: `translateZ(${zOut * 0.8}px) scale(${Math.max(0.01, cronIn) * (0.98 + 0.02 * Math.sin((T - AT) * 1.4))}) rotate(${Math.sin((T - AT) * 0.7) * 1.2}deg)`,
              opacity: cronIn * (1 - exit * 0.6),
              filter: `blur(${blurOut * 0.6}px)`,
            }}>
              <svg width="320" height="320" viewBox="0 0 320 320">
                <defs>
                  <radialGradient id="dial" cx="50%" cy="40%">
                    <stop offset="0%" stopColor="#1a2b48" />
                    <stop offset="100%" stopColor="#050a16" />
                  </radialGradient>
                  <filter id="needleShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="4" dy="6" stdDeviation="4" floodColor="#000" floodOpacity="0.7" />
                  </filter>
                  <filter id="needleGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="6" />
                  </filter>
                </defs>
                <circle cx="160" cy="160" r="150" fill="url(#dial)" stroke="#2a4a7a" strokeWidth="6" />
                <circle cx="160" cy="160" r="130" fill="none" stroke="#1e6fff" strokeWidth="2" opacity="0.4" />
                {Array.from({ length: 60 }).map((_, i) => {
                  const ang = (i / 60) * Math.PI * 2 - Math.PI / 2;
                  const r1 = i % 5 === 0 ? 112 : 122;
                  return <line key={i} x1={S(160 + Math.cos(ang) * r1, 160)} y1={S(160 + Math.sin(ang) * r1, 160)} x2={S(160 + Math.cos(ang) * 132, 160)} y2={S(160 + Math.sin(ang) * 132, 160)} stroke={i % 5 === 0 ? "#8fd6ff" : "#3a5a8a"} strokeWidth={i % 5 === 0 ? 3 : 1.5} />;
                })}
                <circle cx="160" cy="160" r="140" fill="none" stroke={gota} strokeWidth="8"
                  strokeDasharray={`${dash} 880`} transform="rotate(-90 160 160)"
                  style={{ filter: `drop-shadow(0 0 12px ${gota})` }} />
                {dialPulse > 0.01 && (
                  <circle cx="160" cy="160" r={140 + (1 - dialPulse) * 40} fill="none"
                    stroke={gota} strokeWidth={8 * dialPulse} opacity={dialPulse}
                    style={{ filter: `drop-shadow(0 0 24px ${gota})` }} />
                )}
                {glowNeedle > 0.01 && (
                  <line x1="160" y1="160" x2={nx} y2={ny} stroke={gota} strokeWidth={14 + glowNeedle * 6}
                    strokeLinecap="round" opacity={glowNeedle} filter="url(#needleGlow)" />
                )}
                <line x1="160" y1="160" x2={nx} y2={ny} stroke="#ff4a3d" strokeWidth="6" strokeLinecap="round" filter="url(#needleShadow)" />
                <circle cx="160" cy="160" r="10" fill="#ff4a3d" />
              </svg>
              <div style={{
                position: "absolute", left: 0, right: 0, top: 220, textAlign: "center",
                fontFamily: FONT, fontWeight: 900, fontSize: 96, color: "#fff",
                textShadow: extrude(4, "rgba(0,0,0,.7)") + `, 0 0 ${20 * dialPulse}px ${gota}`,
                letterSpacing: "-0.02em",
                transform: `scale(${counterPop})`,
              }}>{counter}</div>
            </div>
          )}

          {/* TAG — entra con el tinte, ≥68px */}
          {T >= tagAt && (
            <div style={{
              position: "absolute", inset: 0,
              transform: `translateZ(${zOut * 0.9}px)`,
              opacity: c01((T - tagAt) / 0.2) * (1 - c01((T - (OUT - 0.1)) / 0.4)),
              filter: `blur(${blurOut * 0.7}px)`,
              pointerEvents: "none",
            }}>
              <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
                <line x1={tagAnchorX} y1={tagAnchorY} x2={tagBoxL + 30} y2={tagBoxT + 90}
                  stroke={gota} strokeWidth={4} strokeLinecap="round"
                  style={{ strokeDasharray: 400, strokeDashoffset: 400 * (1 - c01((T - tagAt) / 0.4)) }} />
                <circle cx={tagAnchorX} cy={tagAnchorY} r={10} fill={gota}
                  style={{ filter: `drop-shadow(0 0 12px ${gota})` }} />
              </svg>
              <div style={{
                position: "absolute", left: tagBoxL, top: tagBoxT,
                transform: `scale(${tagS})`, transformOrigin: "left center",
                padding: "22px 36px", borderRadius: 18,
                background: "rgba(6,14,30,0.88)",
                border: `3px solid ${gota}`,
                boxShadow: `0 20px 50px rgba(0,0,0,.7), 0 0 40px ${gota}66`,
                fontFamily: FONT, fontWeight: 900, fontSize: 72, color: "#fff",
                letterSpacing: "-0.01em", whiteSpace: "nowrap",
                textShadow: extrude(4, "rgba(0,0,0,.7)"),
              }}>{label}</div>
            </div>
          )}
        </AbsoluteFill>
      </Stage>
    </AbsoluteFill>
  );
};

export const sfxPruebaColorante = (at: number): [number, string, number?][] => {
  const clave = at + 3.8;
  const imp = at + 0.55;
  const ticks: [number, string, number?][] = [];
  for (let i = 0; i < 10; i++) {
    ticks.push([clave + i * 0.3, "tick", -4 + i * 0.4]);
  }
  return [
    [at + 0.00, "whoosh"],
    [at + 0.30, "k_gota", -4],
    [imp, "k_burbuja", -6],
    [imp, "sparkle", -3],
    [clave - 0.30, "pop", -2],
    ...ticks,
    [clave + 2.50, "k_chorro", -6],
    [clave + 2.50, "riser", -3],
    [clave + 3.30, "slam", -1],
    [clave + 3.40, "sparkle", -2],
    [clave + 4.00, "ding", 1],
    [clave + 4.50, "pop", -3],
  ];
};
