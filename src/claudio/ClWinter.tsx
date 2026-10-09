// Kit del INVIERNO (Claudio Old Mechanic ep. 10 "omwinter"), dentro del mundo (cama real + tarjeta):
//   ClTreadCoin  corte de la banda de rodamiento con una moneda metida cabeza abajo: "penny" (Lincoln: se ve la cabeza = muy gastada) o
//                "quarter" (Washington: se ve = poca banda para nieve); la goma sube hasta `depth` (0-1) y se ve o no la cabeza · label
//   ClPsiDrop    termómetro de la mañana y manómetro de la goma: la temperatura baja de `from` a `to` °F y la presión cae 1 PSI cada
//                10 °F (desde `psi`) · label
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, clamp01, ease, hexA } from "./ClTheme";
import { Bed, Card, RoomLight, lin, pop, useOut } from "./ClParts";

export const ClTreadCoin: React.FC<{ coin?: "penny" | "quarter"; depth?: number; label?: string; bed?: string }> = ({ coin = "quarter", depth = 0.35, label, bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 14);
  const dropIn = ease(clamp01((f - 8) / 14));
  const R = coin === "penny" ? 150 : 190, cx = 960, groove = 760;      // fondo de la canaleta
  const coinTop = groove - 2 * R + 40;
  const cy = coinTop + R - 260 * (1 - dropIn);
  const headTop = coinTop + 0.18 * R * 2;                                 // la coronilla de la cabeza en la moneda
  const rubberTop = groove - depth * 2 * R * 0.6;
  const seen = rubberTop > headTop + 20;
  const verdict = label || (seen ? (coin === "penny" ? "SEE HIS HEAD = REPLACE" : "SEE HIS HEAD = NOT ENOUGH FOR SNOW") : "HEAD COVERED = GOOD TREAD");
  const vk = clamp01((f - 26) / 8);
  const col = coin === "penny" ? "#B4683C" : "#B8BEC6", colD = coin === "penny" ? "#8A4A26" : "#8E959E";
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={1051} dim={0.62} />
      <div style={{ position: "absolute", left: 360, top: 110, width: 1200, height: 860, opacity: clamp01(p * 1.3), transform: `translateY(${(1 - p) * 40}px)` }}>
        <Card style={{ position: "absolute", inset: 0, background: "#DDE3EA", padding: 0, overflow: "hidden" }}>
          <svg width={1200} height={860} viewBox="360 110 1200 860" style={{ position: "absolute", inset: 0 }}>
            {/* la moneda */}
            <g opacity={clamp01(dropIn * 2)}>
              <circle cx={cx} cy={cy} r={R} fill={col} stroke={colD} strokeWidth={10} />
              {/* cabeza cabeza abajo: la coronilla mira al fondo de la canaleta (abajo) */}
              <ellipse cx={cx} cy={cy + R * 0.25} rx={R * 0.38} ry={R * 0.48} fill={colD} opacity={0.55} />
              <ellipse cx={cx + R * 0.05} cy={cy - R * 0.25} rx={R * 0.3} ry={R * 0.2} fill={colD} opacity={0.45} />
            </g>
            {/* los bloques de goma a los costados de la canaleta */}
            <rect x={360} y={rubberTop} width={cx - 360 - R - 30} height={980 - rubberTop} fill="#22252B" />
            <rect x={cx + R + 30} y={rubberTop} width={1560 - cx - R - 30} height={980 - rubberTop} fill="#22252B" />
            <rect x={cx - R - 30} y={groove} width={2 * R + 60} height={980 - groove} fill="#2C3038" />
            {[0, 1, 2, 3].map((i) => <rect key={i} x={380 + i * 70} y={rubberTop + 30} width={40} height={10} fill="#3A3F48" />)}
            <line x1={360} x2={1560} y1={rubberTop} y2={rubberTop} stroke="#5B6372" strokeWidth={4} strokeDasharray="14 10" />
          </svg>
          <div style={{ position: "absolute", left: 40, top: 30, fontFamily: LABEL, fontWeight: 700, fontSize: 42, letterSpacing: 4, color: CL.ink }}>{coin === "penny" ? "THE PENNY TEST · LINCOLN" : "THE QUARTER TEST · WASHINGTON"}</div>
          <div style={{ position: "absolute", right: 40, top: 30, fontFamily: HAND, fontWeight: 700, fontSize: 44, color: CL.inkSoft }}>head first, upside down</div>
        </Card>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 50, display: "flex", justifyContent: "center" }}>
        <div style={{ transform: `rotate(-2deg) scale(${1.4 - 0.4 * vk})`, opacity: vk, border: `8px solid ${seen ? CL.red : "#2E7D32"}`, color: seen ? CL.red : "#2E7D32", background: "rgba(255,255,255,0.93)", fontFamily: LABEL, fontWeight: 800, fontSize: 50, letterSpacing: 3, padding: "6px 28px", borderRadius: 14 }}>{verdict}</div>
      </div>
      <RoomLight k={0.25} />
    </AbsoluteFill>
  );
};

export const ClPsiDrop: React.FC<{ from?: number; to?: number; psi?: number; label?: string; bed?: string }> = ({ from = 70, to = 30, psi = 32, label, bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 14);
  const t = ease(clamp01((f - 10) / (T * 0.5)));
  const temp = from + (to - from) * t;
  const pr = psi - (from - temp) / 10;
  const lk = clamp01((f - 10 - T * 0.5) / 8);
  const gaugeA = -120 + ((pr - 20) / 20) * 240;                         // aguja 20-40 PSI
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={1061} dim={0.62} />
      <div style={{ position: "absolute", left: 200, top: 130, width: 1520, height: 820, opacity: clamp01(p * 1.3), transform: `translateY(${(1 - p) * 40}px)` }}>
        <Card style={{ position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", left: 60, top: 36, fontFamily: SERIF, fontWeight: 900, fontSize: 60, color: CL.ink }}>Colder air, lower pressure</div>
          {/* termómetro */}
          <div style={{ position: "absolute", left: 180, top: 170, width: 90, height: 470, borderRadius: 45, background: "#EEF1F5", border: "6px solid #9AA2AF" }}>
            <div style={{ position: "absolute", left: 18, right: 18, bottom: 18, height: `${clamp01((temp - 0) / 100) * 420}px`, borderRadius: 30, background: temp > 45 ? CL.red : "#3E8AD6" }} />
          </div>
          <div style={{ position: "absolute", left: 300, top: 360, fontFamily: SERIF, fontWeight: 900, fontSize: 120, color: temp > 45 ? CL.red : "#3E8AD6" }}>{`${Math.round(temp)}°F`}</div>
          {/* manómetro */}
          <svg width={520} height={520} style={{ position: "absolute", left: 860, top: 150 }}>
            <circle cx={260} cy={260} r={230} fill="#1E232C" stroke="#9AA2AF" strokeWidth={12} />
            {Array.from({ length: 11 }, (_, i) => { const a = (-120 + i * 24) * Math.PI / 180; return <line key={i} x1={260 + Math.sin(a) * 190} y1={260 - Math.cos(a) * 190} x2={260 + Math.sin(a) * 215} y2={260 - Math.cos(a) * 215} stroke="#E3E6EA" strokeWidth={6} />; })}
            {[20, 30, 40].map((v, i) => { const a = (-120 + i * 120) * Math.PI / 180; return <text key={v} x={260 + Math.sin(a) * 150} y={275 - Math.cos(a) * 150} textAnchor="middle" fontFamily="Arial" fontWeight={800} fontSize={40} fill="#E3E6EA">{v}</text>; })}
            <g transform={`rotate(${gaugeA} 260 260)`}><path d="M252 260 L260 70 L268 260 Z" fill={CL.red} /></g>
            <circle cx={260} cy={260} r={20} fill="#9AA2AF" />
            <text x={260} y={400} textAnchor="middle" fontFamily="Arial" fontWeight={800} fontSize={60} fill="#fff">{pr.toFixed(0)} PSI</text>
          </svg>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, textAlign: "center", opacity: lk }}>
            <span style={{ display: "inline-block", border: `8px solid ${CL.red}`, color: CL.red, fontFamily: LABEL, fontWeight: 800, fontSize: 52, letterSpacing: 3, padding: "4px 26px", borderRadius: 12, transform: "rotate(-2deg)" }}>{label || `−${Math.round((from - to) / 10)} PSI, NO LEAK`}</span>
          </div>
        </Card>
      </div>
      <RoomLight k={0.25} />
    </AbsoluteFill>
  );
};
