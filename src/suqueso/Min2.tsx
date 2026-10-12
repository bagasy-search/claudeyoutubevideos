// suqueso · minuto 60-400 s (R5). Generado por r5/gen_min2.py.
// AV: tramos <=8 s con reel (off = offset del reel en segundos). Real: clip normalizado nb2_* (startFrom en s). Still: L/N.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";

const FPS = 30;
const fr = (s: number) => Math.round(s * FPS);

const Push: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const t = Math.max(0, Math.min(1, f / Math.max(1, fr(dur))));
  const s = 1 + 0.06 * t;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{ width: "100%", height: "100%", transform: `scale(${s})`, transformOrigin: "50% 50%" }}>{children}</div>
    </AbsoluteFill>
  );
};

const AV: React.FC<{ a: number; b: number; off: number }> = ({ a, b, off }) => (
  <Sequence from={fr(a)} durationInFrames={fr(b - a)}>
    <AbsoluteFill>
      <OffthreadVideo src={staticFile("avatar_clips/suqueso/reel30_nb.mp4")} startFrom={fr(off)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
  </Sequence>
);
const Real: React.FC<{ a: number; b: number; src: string; st: number }> = ({ a, b, src, st }) => (
  <Sequence from={fr(a)} durationInFrames={fr(b - a)}>
    <Push dur={b - a}>
      <OffthreadVideo src={staticFile(`broll/suqueso/${src}`)} startFrom={fr(st)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </Push>
  </Sequence>
);
const Still: React.FC<{ a: number; b: number; name: string }> = ({ a, b, name }) => (
  <Sequence from={fr(a)} durationInFrames={fr(b - a)}>
    <Push dur={b - a}>
      <Img src={staticFile(`img/suqueso/${name}.png`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </Push>
  </Sequence>
);

export const Min2: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Still a={60.000} b={63.000} name="l_bandeja" />
    <AV a={63.000} b={65.667} off={39.716} />
    <Real a={65.667} b={68.667} src="nb2_wowcheese.mp4" st={0.0} />
    <AV a={68.667} b={73.767} off={42.929} />
    <Real a={73.767} b={76.767} src="nb2_wowproduce.mp4" st={0.0} />
    <AV a={76.767} b={81.867} off={48.569} />
    <Real a={81.867} b={84.867} src="nb2_wowenvasado.mp4" st={0.0} />
    <AV a={84.867} b={89.233} off={54.272} />
    <Real a={89.233} b={92.233} src="nb2_wowconveyor.mp4" st={0.0} />
    <AV a={92.233} b={97.167} off={59.169} />
    <Real a={97.167} b={100.167} src="nb2_cheesecounter.mp4" st={0.0} />
    <Still a={100.167} b={103.167} name="l_comentarios" />
    <Real a={103.167} b={106.167} src="nb2_deli.mp4" st={0.0} />
    <Still a={106.167} b={109.167} name="l_cortadora2" />
    <Still a={109.167} b={112.167} name="l_etiqueta" />
    <Real a={112.167} b={115.167} src="nb2_pallet.mp4" st={0.0} />
    <Still a={115.167} b={118.167} name="l_horma" />
    <AV a={118.167} b={121.333} off={66.569} />
    <Still a={121.333} b={124.333} name="l_mirando_camara2" />
    <AV a={124.333} b={129.233} off={70.289} />
    <Real a={129.233} b={132.233} src="nb2_aisle.mp4" st={0.0} />
    <AV a={132.233} b={137.167} off={75.842} />
    <Real a={137.167} b={140.167} src="nb2_px6658177.mp4" st={0.0} />
    <AV a={140.167} b={142.600} off={83.955} />
    <Real a={142.600} b={145.600} src="nb2_px3191886.mp4" st={0.0} />
    <AV a={145.600} b={150.300} off={86.929} />
    <Real a={150.300} b={153.300} src="nb2_px5488079.mp4" st={0.0} />
    <AV a={153.300} b={158.400} off={92.172} />
    <Real a={158.400} b={161.400} src="nb2_px37326360.mp4" st={0.0} />
    <AV a={161.400} b={166.500} off={97.812} />
    <Real a={166.500} b={169.500} src="nb2_px855237.mp4" st={0.0} />
    <AV a={169.500} b={174.700} off={103.452} />
    <Real a={174.700} b={177.700} src="nb2_px9615644.mp4" st={0.0} />
    <AV a={177.700} b={180.200} off={111.689} />
    <Still a={180.200} b={183.200} name="l_mostrador_pesa" />
    <AV a={183.200} b={188.733} off={114.530} />
    <Real a={188.733} b={191.733} src="nb2_px30747264.mp4" st={0.0} />
    <AV a={191.733} b={197.067} off={120.616} />
    <Real a={197.067} b={200.067} src="nb2_px2948582.mp4" st={0.0} />
    <AV a={200.067} b={205.167} off={126.470} />
    <Real a={205.167} b={208.167} src="nb2_px5100073.mp4" st={0.0} />
    <AV a={208.167} b={213.000} off={132.274} />
    <Real a={213.000} b={216.000} src="nb2_px854634.mp4" st={0.0} />
    <AV a={216.000} b={220.867} off={137.657} />
    <Real a={220.867} b={223.867} src="nb2_px33006235.mp4" st={0.0} />
    <AV a={223.867} b={228.400} off={143.000} />
    <Real a={228.400} b={231.400} src="nb2_px3735225.mp4" st={0.0} />
    <AV a={231.400} b={234.167} off={150.714} />
    <Real a={234.167} b={237.167} src="nb2_px39240107.mp4" st={0.0} />
    <AV a={237.167} b={242.267} off={154.044} />
    <Still a={242.267} b={245.267} name="l_precio_especial" />
    <AV a={245.267} b={250.367} off={159.684} />
    <Real a={250.367} b={253.367} src="nb2_px39238831.mp4" st={0.0} />
    <AV a={253.367} b={259.433} off={165.324} />
    <Real a={259.433} b={262.433} src="nb2_wowcheese.mp4" st={3.0} />
    <Real a={262.433} b={265.433} src="nb2_wowproduce.mp4" st={3.0} />
    <Still a={265.433} b={268.433} name="n_camara_fria" />
    <Real a={268.433} b={271.433} src="nb2_wowenvasado.mp4" st={3.0} />
    <Still a={271.433} b={274.433} name="n_cortadora" />
    <Still a={274.433} b={277.433} name="n_cuna_envasada" />
    <Real a={277.433} b={280.433} src="nb2_wowconveyor.mp4" st={3.0} />
    <Still a={280.433} b={283.433} name="n_etiqueta_balanza2" />
    <Real a={283.433} b={286.433} src="nb2_cheesecounter.mp4" st={3.0} />
    <Still a={286.433} b={289.433} name="n_horma_entera" />
    <Still a={289.433} b={292.433} name="n_papel_bandeja" />
    <Real a={292.433} b={295.433} src="nb2_deli.mp4" st={3.0} />
    <Still a={295.433} b={298.433} name="n_pasillo_etiquetas2" />
    <Real a={298.433} b={301.433} src="nb2_pallet.mp4" st={3.0} />
    <Still a={301.433} b={304.433} name="n_precio_especial" />
    <Still a={304.433} b={307.433} name="l_bandeja" />
    <Real a={307.433} b={310.433} src="nb2_aisle.mp4" st={3.0} />
    <AV a={310.433} b={316.033} off={172.300} />
    <Real a={316.033} b={319.033} src="nb2_px6658177.mp4" st={3.0} />
    <AV a={319.033} b={323.533} off={178.423} />
    <Real a={323.533} b={326.533} src="nb2_px3191886.mp4" st={3.0} />
    <Still a={326.533} b={329.533} name="l_comentarios" />
    <Real a={329.533} b={332.533} src="nb2_px5488079.mp4" st={3.0} />
    <Still a={332.533} b={335.533} name="l_cortadora2" />
    <Real a={335.533} b={338.533} src="nb2_px37326360.mp4" st={3.0} />
    <Still a={338.533} b={341.533} name="l_etiqueta" />
    <Still a={341.533} b={344.533} name="l_horma" />
    <Real a={344.533} b={347.533} src="nb2_px855237.mp4" st={3.0} />
    <Still a={347.533} b={350.533} name="l_mirando_camara2" />
    <Real a={350.533} b={353.533} src="nb2_px9615644.mp4" st={3.0} />
    <Still a={353.533} b={356.533} name="l_mostrador_pesa" />
    <Still a={356.533} b={359.533} name="l_precio_especial" />
    <Real a={359.533} b={362.533} src="nb2_px30747264.mp4" st={3.0} />
    <Still a={362.533} b={365.533} name="n_camara_fria" />
    <Real a={365.533} b={368.533} src="nb2_px2948582.mp4" st={3.0} />
    <Still a={368.533} b={371.533} name="n_cortadora" />
    <Still a={371.533} b={374.533} name="n_cuna_envasada" />
    <Real a={374.533} b={377.533} src="nb2_px5100073.mp4" st={3.0} />
    <Still a={377.533} b={380.533} name="n_etiqueta_balanza2" />
    <Real a={380.533} b={383.533} src="nb2_px854634.mp4" st={3.0} />
    <Still a={383.533} b={386.533} name="n_horma_entera" />
    <Still a={386.533} b={389.533} name="n_papel_bandeja" />
    <Real a={389.533} b={392.533} src="nb2_px33006235.mp4" st={3.0} />
    <Still a={392.533} b={395.533} name="n_pasillo_etiquetas2" />
    <Real a={395.533} b={398.533} src="nb2_px3735225.mp4" st={3.0} />
    <Still a={398.533} b={400.000} name="n_precio_especial" />
  </AbsoluteFill>
);
