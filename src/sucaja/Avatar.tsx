// sucaja · avatar (reel RunPod). Cada ventana entra en su tiempo de la línea final y arranca en su offset dentro del reel.
// Offsets = startFrom MEDIDO por xcorr de audio voz↔reel (r5/startfrom_medido.json), no la suma acumulada. Recta de labios: lead(tau) = 0.0946 + 0.001042*tau (5 medidas, R²bajo).
import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile } from "remotion";
const FPS = 30;
const fr = (s: number) => Math.round(s * FPS);
const REEL = staticFile("avatar/sucaja_reel0.mp4");
type Win = { n: string; ms: number; me: number; off: number };
const WINS: Win[] = [{n:"00",ms:3.690,me:9.890,off:0.120}, {n:"01",ms:32.530,me:41.630,off:6.560}, {n:"02",ms:57.500,me:83.010,off:15.900}, {n:"03",ms:111.590,me:118.070,off:41.650}, {n:"04",ms:129.350,me:136.510,off:48.370}, {n:"05",ms:157.210,me:164.760,off:55.770}, {n:"06",ms:193.170,me:200.970,off:63.560}, {n:"07",ms:207.410,me:215.270,off:71.600}, {n:"08",ms:222.710,me:230.130,off:79.700}, {n:"09",ms:250.270,me:258.170,off:87.360}, {n:"10",ms:311.580,me:320.480,off:95.500}, {n:"11",ms:328.330,me:337.150,off:104.640}, {n:"12",ms:378.750,me:387.440,off:113.700}, {n:"13",ms:407.040,me:414.880,off:122.630}, {n:"14",ms:438.820,me:447.630,off:130.710}, {n:"15",ms:543.240,me:552.510,off:139.760}, {n:"16",ms:589.290,me:617.910,off:149.270}, {n:"17",ms:634.710,me:643.550,off:178.130}, {n:"18",ms:685.260,me:691.690,off:187.210}, {n:"19",ms:732.060,me:740.080,off:193.880}, {n:"20",ms:777.750,me:790.210,off:202.140}, {n:"21",ms:821.890,me:830.430,off:214.840}, {n:"22",ms:871.950,me:890.710,off:223.620}, {n:"23",ms:919.150,me:932.510,off:242.620}, {n:"24",ms:956.800,me:988.660,off:256.220}];
const lipLead = (tau: number) => 0.0946 + 0.001042 * tau;
export const AvatarWins: React.FC<{ from: number; to: number }> = ({ from, to }) => (
  <>
    {WINS.filter((w) => w.me > from && w.ms < to).map((w) => (
      <Sequence key={w.n} from={fr(w.ms)} durationInFrames={fr(w.me) - fr(w.ms)}>
        <AbsoluteFill style={{ backgroundColor: "#000" }}>
          <OffthreadVideo
            src={REEL}
            startFrom={Math.round(Math.max(0, w.off - lipLead(w.off + (w.me - w.ms) / 2)) * FPS)}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      </Sequence>
    ))}
  </>
);
