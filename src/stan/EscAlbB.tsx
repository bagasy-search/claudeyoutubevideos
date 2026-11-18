// Escenas sobre fotos · alb14b (ideas.md en D:/rtmp/alb14b). Escritas de cero; foto real a pantalla completa
// (1920x1080, objectFit 'fill', coordenadas de la rejilla), recortes con clip-path y máscaras, sin dibujos.
//
// 1 EscGotasNacen (p530) · el vidrio empieza seco y cada una de las 366 gotas reales nace en su lugar exacto.
// 2 EscGoteron (p2110) · la gota real cae al vacío; otra igual se forma, sube por el hilo y repta bajo el ribete.
// 3 EscPieMuro (p3360) · desde el punto donde pega el chorro (1270,640) la piedra real se moja hacia arriba.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing, spring, useVideoConfig } from "remotion";

const EZ = Easing.bezier(0.45, 0, 0.25, 1);
type Cam = { f: number; x: number; y: number; s: number };
const camAt = (f: number, ks: Cam[]) => {
  let i = 0;
  while (i < ks.length - 2 && f > ks[i + 1].f) i++;
  const a = ks[i], b = ks[i + 1];
  const t = EZ(Math.min(1, Math.max(0, (f - a.f) / Math.max(1, b.f - a.f))));
  const s = Math.exp(Math.log(a.s) + (Math.log(b.s) - Math.log(a.s)) * t);
  const x = Math.min(1920 - 960 / s, Math.max(960 / s, a.x + (b.x - a.x) * t));
  const y = Math.min(1080 - 540 / s, Math.max(540 / s, a.y + (b.y - a.y) * t));
  return { s, x, y };
};
const mundo = (c: { s: number; x: number; y: number }): React.CSSProperties => ({
  position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0",
  transform: `translate(${960 - c.x * c.s}px, ${540 - c.y * c.s}px) scale(${c.s})`,
});
const Foto: React.FC<{ src: string; style?: React.CSSProperties }> = ({ src, style }) => (
  <Img src={staticFile(src)} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill", ...style }} />
);
const poly = (pts: number[][]) => `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(",")})`;
const lerp = (f: number, a: number[], b: number[], ease = EZ) =>
  interpolate(f, a, b, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
// un pedazo redondo de la foto real, en (x,y) de la foto, dibujado en (px,py)
const Pedazo: React.FC<{ src: string; x: number; y: number; r: number; px?: number; py?: number; style?: React.CSSProperties }> = ({ src, x, y, r, px, py, style }) => (
  <div style={{ position: "absolute", left: (px ?? x) - r, top: (py ?? y) - r, width: 2 * r, height: 2 * r, borderRadius: "50%", overflow: "hidden", ...style }}>
    <Img src={staticFile(src)} style={{ position: "absolute", left: r - x, top: r - y, width: 1920, height: 1080, objectFit: "fill" }} />
  </div>
);

// ───────────── 1 · las gotas nacen del aire ─────────────
const GOTAS: number[][] = [[86,6,8],[300,15,17],[669,3,8],[1187,3,8],[618,20,17],[852,48,22],[156,44,14],[754,73,41],[636,60,22],[86,51,9],[191,54,8],[133,66,10],[506,72,22],[604,68,11],[1820,88,31],[1251,80,12],[582,92,20],[28,90,24],[1069,79,8],[378,104,35],[566,92,8],[1614,96,18],[285,92,8],[1520,92,8],[638,104,9],[664,106,12],[1902,127,22],[292,124,17],[1235,116,9],[668,129,8],[628,136,8],[80,178,51],[760,140,8],[1434,140,8],[812,147,8],[1122,148,8],[658,158,10],[439,162,8],[1322,176,24],[1030,172,9],[900,198,32],[1517,174,10],[1440,196,28],[760,180,12],[714,182,8],[18,191,8],[502,203,8],[684,201,10],[1123,210,15],[1664,225,36],[692,210,8],[212,226,22],[1834,218,13],[1212,222,10],[766,230,13],[20,234,14],[670,234,16],[1766,240,18],[1903,240,18],[1474,243,9],[762,246,8],[1276,248,8],[537,278,36],[718,250,9],[1026,260,8],[358,280,24],[1884,268,10],[703,280,22],[673,272,8],[1304,272,8],[1830,274,9],[1378,279,10],[664,282,8],[116,288,10],[50,292,12],[1550,290,8],[270,302,16],[650,302,8],[158,316,12],[1073,312,9],[634,316,14],[1476,316,9],[708,320,9],[820,332,29],[658,324,9],[554,333,8],[502,351,16],[575,347,9],[367,374,32],[666,351,8],[1040,356,10],[682,364,12],[1731,367,17],[630,376,18],[166,372,11],[596,374,18],[727,370,10],[1884,374,8],[1544,376,8],[1032,384,20],[1320,380,8],[458,389,10],[764,390,8],[42,414,38],[1394,405,18],[702,427,47],[492,416,35],[878,404,10],[1076,402,9],[818,404,9],[1132,414,16],[1508,434,37],[1118,416,8],[1804,419,11],[610,426,16],[1700,446,29],[540,443,12],[1916,442,9],[15,443,8],[245,456,15],[898,482,89],[1880,454,9],[584,464,18],[772,458,8],[502,462,8],[753,460,8],[1390,466,10],[1812,469,9],[300,476,11],[535,481,14],[1264,472,8],[198,476,8],[1846,482,8],[1380,484,8],[420,493,10],[578,489,8],[224,491,11],[986,498,10],[601,498,9],[720,497,8],[294,504,8],[326,504,8],[1730,513,18],[795,514,17],[1895,511,8],[650,532,42],[1402,513,9],[421,515,8],[738,525,21],[1685,522,8],[1173,540,26],[29,545,21],[832,534,10],[1318,552,32],[428,560,24],[547,544,8],[223,548,8],[961,552,16],[1753,555,18],[766,580,36],[1714,558,9],[258,578,34],[595,564,13],[1902,560,8],[827,560,8],[551,562,13],[174,562,8],[810,566,8],[90,569,11],[1834,580,25],[736,580,10],[630,619,46],[696,598,12],[1644,600,8],[1392,617,21],[848,610,8],[146,616,8],[452,646,35],[1614,618,9],[828,634,18],[962,632,10],[1302,633,11],[320,638,11],[756,634,10],[1807,638,9],[1822,641,8],[1840,642,8],[1678,651,12],[1904,646,10],[408,653,8],[789,656,16],[35,662,17],[739,656,8],[676,658,8],[754,657,8],[1196,669,29],[149,669,8],[167,678,12],[988,678,8],[881,695,25],[986,692,14],[676,690,8],[708,700,9],[216,704,21],[1500,698,8],[1700,700,8],[10,704,8],[288,706,8],[385,707,8],[1423,708,8],[1038,724,24],[1102,710,8],[1846,718,21],[937,718,14],[1557,718,14],[1892,717,11],[48,728,37],[1918,720,8],[1170,725,9],[1805,725,8],[900,728,8],[1782,742,18],[1873,733,8],[1633,742,18],[1722,738,9],[1794,741,8],[1912,742,9],[909,743,8],[1846,748,11],[1256,754,19],[1164,756,16],[1568,782,35],[691,760,8],[1902,760,9],[1842,768,8],[636,774,9],[1579,790,25],[811,793,24],[702,788,8],[1364,790,8],[1114,792,8],[1001,797,8],[318,820,41],[1240,832,55],[1904,805,9],[1037,812,14],[1800,818,32],[1374,817,28],[945,812,13],[700,836,60],[106,831,21],[973,816,8],[169,821,8],[782,826,10],[1408,829,8],[1470,833,8],[490,873,55],[1688,851,36],[1904,841,8],[814,844,8],[1278,853,15],[778,850,8],[954,852,8],[1342,852,8],[903,880,46],[1398,868,17],[1484,866,11],[968,868,10],[1327,868,8],[1569,867,8],[1918,872,8],[184,872,8],[1814,880,8],[250,885,13],[1178,882,10],[310,886,13],[869,890,10],[1205,883,8],[1828,886,8],[1846,886,8],[777,890,12],[1001,894,8],[1763,892,8],[1274,896,13],[805,895,8],[1486,900,17],[416,898,8],[740,900,8],[682,900,8],[1572,915,21],[727,903,8],[1202,910,21],[1360,906,9],[572,908,8],[1762,910,12],[384,925,36],[672,910,8],[1564,922,17],[724,913,8],[781,916,12],[1794,923,18],[1839,918,14],[1066,922,14],[1417,930,14],[805,921,8],[1126,938,24],[59,944,22],[823,936,15],[749,936,15],[718,938,8],[168,959,32],[866,946,12],[1893,944,8],[328,954,24],[288,946,8],[684,952,14],[524,964,16],[926,956,9],[1218,968,23],[1356,960,8],[1097,978,21],[97,970,9],[1814,970,8],[738,971,8],[802,972,8],[398,973,8],[351,974,8],[1782,974,8],[830,979,8],[615,980,8],[719,982,8],[747,986,12],[426,994,22],[1846,988,8],[58,993,16],[1588,1018,31],[694,998,12],[907,996,8],[968,1002,15],[1049,1001,14],[1749,1012,22],[1886,1020,40],[1141,1009,8],[190,1021,21],[757,1016,13],[70,1021,12],[730,1018,8],[1834,1024,12],[13,1030,15],[1132,1027,27],[878,1048,48],[1012,1032,8],[1672,1032,8],[635,1040,8],[960,1041,11],[452,1042,8],[1340,1044,8],[517,1054,14],[749,1044,8],[762,1051,13],[118,1055,9],[414,1053,8],[572,1056,9],[28,1061,9],[212,1064,8],[976,1067,8]];
// orden fijo: 40 chicas al azar en "mojada", el resto de la más chica a la más grande en "aire"→"fría"
const rnd = (i: number) => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const ORDEN = (() => {
  const idx = GOTAS.map((g, i) => i);
  const chicas = idx.filter((i) => GOTAS[i][2] < 16).sort((a, b) => rnd(a) - rnd(b)).slice(0, 40);
  const resto = idx.filter((i) => !chicas.includes(i)).sort((a, b) => GOTAS[a][2] - GOTAS[b][2] || rnd(a) - rnd(b));
  const t: number[] = new Array(GOTAS.length);
  chicas.forEach((i, k) => (t[i] = 75 + Math.round((k / 40) * 60)));
  resto.forEach((i, k) => (t[i] = 290 + Math.round((k / Math.max(1, resto.length - 1)) * 75)));
  return t;
})();
export const EscGotasNacen: React.FC<{ src: string; dur: number }> = ({ src, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = camAt(f, [{ f: 0, x: 960, y: 540, s: 1.04 }, { f: 280, x: 900, y: 500, s: 1.08 }, { f: dur, x: 898, y: 482, s: 1.14 }]);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={mundo(c)}>
        <Foto src={src} style={{ filter: "blur(38px) brightness(1.05)", transform: "scale(1.04)" }} />
        {GOTAS.map(([x, y, r], i) => {
          const t0 = ORDEN[i];
          if (f < t0) return null;
          const k = spring({ frame: f - t0, fps, config: { damping: 14, mass: 0.6, stiffness: 120 } });
          const R = r * 1.25 + 4;
          return <Pedazo key={i} src={src} x={x} y={y - r * 0.25} r={R} style={{ transform: `scale(${k})` }} />;
        })}
      </div>
    </AbsoluteFill>
  );
};

// ───────────── 2 · el goterón ─────────────
export const EscGoteron: React.FC<{ src: string; dur: number }> = ({ src, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const G = [1006, 864], RG = 30;
  // gota 1: cae al vacío desde "caer" (87)
  const t1 = Math.max(0, f - 87);
  const y1 = G[1] + 0.9 * t1 * t1;
  // gota 2: nace en "en vez" (110), sube por el hilo (134) y repta por debajo del ribete hasta salir (147-193)
  const nace = spring({ frame: f - 110, fps, config: { damping: 15, mass: 0.7, stiffness: 110 } });
  const sube = lerp(f, [134, 154], [0, 1]);
  const repta = lerp(f, [150, 200], [0, 1], Easing.inOut(Easing.cubic));
  const CAM = [[1004, 575], [1250, 545], [1500, 455], [1750, 360], [1990, 270]];
  const along = (u: number) => { const p = u * (CAM.length - 1); const i = Math.min(CAM.length - 2, Math.floor(p)); const q = p - i; return [CAM[i][0] + (CAM[i + 1][0] - CAM[i][0]) * q, CAM[i][1] + (CAM[i + 1][1] - CAM[i][1]) * q]; };
  let x2 = G[0] + (1004 - G[0]) * sube, y2 = G[1] + (575 - G[1]) * sube;
  if (repta > 0) [x2, y2] = along(repta);
  const c = camAt(f, [{ f: 0, x: 1006, y: 700, s: 1.05 }, { f: 100, x: 1006, y: 700, s: 1.08 }, { f: 140, x: 1060, y: 640, s: 1.12 }, { f: dur, x: 1350, y: 480, s: 1.12 }]);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={mundo(c)}>
        <Foto src={src} />
        {/* la gota de la foto se tapa con el verde que tiene 60 px a la derecha */}
        <Pedazo src={src} x={G[0] + 62} y={G[1]} r={RG + 6} px={G[0]} py={G[1]} style={{ filter: "blur(2px)" }} />
        {y1 < 1200 && <Pedazo src={src} x={G[0]} y={G[1]} r={RG} py={y1} style={{ transform: `scaleY(${1 + Math.min(0.25, t1 * 0.01)})` }} />}
        {f >= 110 && (
          <Pedazo src={src} x={G[0]} y={G[1]} r={RG} px={x2} py={y2}
            style={{ transform: `scale(${nace}) scaleX(${1 + 0.25 * repta}) scaleY(${1 - 0.2 * repta})` }} />
        )}
      </div>
    </AbsoluteFill>
  );
};

// ───────────── 3 · al pie del muro ─────────────
export const EscPieMuro: React.FC<{ src: string; dur: number }> = ({ src, dur }) => {
  const f = useCurrentFrame();
  const B = [1270, 640];
  const alto = f < 279 ? lerp(f, [92, 140], [0, 120]) : f < 352 ? lerp(f, [279, 320], [120, 260]) : lerp(f, [352, 397], [260, 430]);
  const llama = (h: number, extra: number) => {
    const pts: number[][] = [];
    const w = 0.9 * h + 120 + extra;
    for (let i = 0; i <= 20; i++) {
      const u = i / 20, th = u * Math.PI;
      const k = 1 + 0.12 * Math.sin(7 * u * Math.PI + 0.8) + 0.07 * Math.sin(13 * u * Math.PI + 2.1 + f * 0.01);
      pts.push([B[0] - Math.cos(th) * w * 0.5 * (0.85 + 0.15 * k), B[1] - Math.sin(th) * (h + extra) * k]);
    }
    pts.push([B[0] + w * 0.5, 660], [B[0] - w * 0.5, 660]);
    return poly(pts);
  };
  const c = camAt(f, [{ f: 0, x: 960, y: 540, s: 1.0 }, { f: 128, x: 1270, y: 520, s: 1.15 }, { f: 300, x: 1230, y: 480, s: 1.12 }, { f: dur, x: 1200, y: 420, s: 1.08 }]);
  const mojado = { filter: "brightness(0.55) saturate(1.2) contrast(1.1)" };
  const muro = poly([[0, 0], [1690, 0], [1690, 640], [0, 640]]);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={mundo(c)}>
        <Foto src={src} />
        {alto > 1 && (
          <div style={{ position: "absolute", inset: 0, clipPath: muro }}>
            {[60, 36, 16].map((e) => (
              <div key={e} style={{ position: "absolute", inset: 0, clipPath: llama(alto, e), opacity: 0.35 }}><Foto src={src} style={mojado} /></div>
            ))}
            <div style={{ position: "absolute", inset: 0, clipPath: llama(alto, 0) }}><Foto src={src} style={mojado} /></div>
            {/* el tubo y el chorro quedan encima, como en la foto */}
            <div style={{ position: "absolute", inset: 0, clipPath: poly([[1190, 0], [1325, 0], [1325, 420], [1360, 470], [1350, 650], [1180, 650], [1170, 470], [1190, 420]]) }}><Foto src={src} /></div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
