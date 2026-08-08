import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {DrVallerQuote} from "./DrVallerQuote";
import {
  ApplicationSteps,
  AvatarCallout,
  FullBleedBroll,
  HookSkinContrast,
  KitchenPromise,
  OilHero,
  OilRibbon,
  OliveWarning,
  PatchTestExplainer,
  RoutineSystem,
  SevenOilOrbit,
  SkinBarrierExplainer,
  TruthCard,
  VallerFilmLayers,
} from "./VallerAceitesKit";

export const TOTAL_FRAMES_VALLER_ACEITES7 = 33508;
const FPS = 30;
const f = (seconds: number) => Math.round(seconds * FPS);

const AvatarBase: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, TOTAL_FRAMES_VALLER_ACEITES7 - 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const microX = Math.sin(frame / 260) * 4;
  const microY = Math.cos(frame / 310) * 2;
  return (
    <AbsoluteFill style={{background: "#03090c", overflow: "hidden"}}>
      <OffthreadVideo
        src={staticFile("valler_aceites7_opt.mp4")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `translate3d(${microX}px,${microY}px,0) scale(${1.006 + progress * 0.026})`,
          transformOrigin: "50% 38%",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(110% 95% at 51% 39%,transparent 57%,rgba(1,5,8,.3) 100%),linear-gradient(180deg,rgba(4,11,14,.02),rgba(4,11,14,.13))",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

const Shot: React.FC<{
  start: number;
  end: number;
  name: string;
  children: (duration: number) => React.ReactNode;
}> = ({start, end, name, children}) => {
  const from = f(start);
  const duration = Math.max(1, Math.min(f(end) - from, TOTAL_FRAMES_VALLER_ACEITES7 - from));
  return (
    <Sequence from={from} durationInFrames={duration} premountFor={Math.min(45, duration - 1)} name={`Valler · ${name}`}>
      {children(duration)}
    </Sequence>
  );
};

export const MainVallerAceites7: React.FC = () => {
  const {durationInFrames} = useVideoConfig();
  const quoteStart = f(1108.933);

  return (
    <AbsoluteFill style={{background: "#03090c", overflow: "hidden"}}>
      <AvatarBase />

      <Audio
        src={staticFile("sfx/music_federer.mp3")}
        loop
        volume={(musicFrame) => {
          const intro = interpolate(musicFrame, [0, 90], [0, 0.042], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const outro = interpolate(musicFrame, [durationInFrames - 330, durationInFrames - 20], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return intro * outro;
        }}
      />

      <Shot start={0} end={11.8} name="hook pérdida de agua">{(d) => <HookSkinContrast duration={d} />}</Shot>
      <Shot start={14.7} end={30.54} name="promesa cocina">{(d) => <KitchenPromise duration={d} />}</Shot>
      <Shot start={30.54} end={40.28} name="alerta textura">
        {(d) => <AvatarCallout duration={d} kicker="Escucha esto" title="SUAVE NO SIGNIFICA GRASOSO" sub="La cantidad y el orden de aplicación cambian el resultado." accent="#D8B56D" />}
      </Shot>
      <Shot start={40.28} end={57.7} name="aceite no contiene agua">{(d) => <SkinBarrierExplainer duration={d} />}</Shot>
      <Shot start={67.88} end={86.4} name="ningún aceite elimina arrugas">{(d) => <TruthCard duration={d} />}</Shot>
      <Shot start={91.2} end={101.8} name="resultado honesto">
        {(d) => <AvatarCallout duration={d} kicker="Expectativa real" title="MÁS SUAVE, NO VEINTE AÑOS MENOS" sub="La evidencia empieza por una barrera mejor cuidada." />}
      </Shot>
      <Shot start={103.4} end={125.2} name="lista de siete aceites">{(d) => <SevenOilOrbit duration={d} />}</Shot>
      <Shot start={128.5} end={139.5} name="antes de la lista">
        {(d) => <AvatarCallout duration={d} kicker="Primero" title="ENTIENDE TU BARRERA CUTÁNEA" side="left" accent="#9FCFE4" />}
      </Shot>
      <Shot start={139.54} end={172.2} name="barrera cutánea explicación">{(d) => <SkinBarrierExplainer duration={d} />}</Shot>
      <Shot start={175.3} end={192.2} name="regla sobre piel húmeda">
        {(d) => <AvatarCallout duration={d} kicker="Regla de oro" title="EL ACEITE VA SOBRE LA HIDRATACIÓN" sub="Sella la humedad que ya está allí." accent="#D8B56D" />}
      </Shot>

      <Shot start={193.54} end={216.4} name="aceite 1 girasol">{(d) => <OilHero duration={d} index={1} />}</Shot>
      <Shot start={223.8} end={240.2} name="girasol detalle">
        {(d) => <FullBleedBroll duration={d} src="broll/va_sunflower_pour.mp4" title="UNA PELÍCULA MUY FINA" sub="Empieza siempre con dos o tres gotas." accent="#F2C94C" />}
      </Shot>
      <Shot start={253.5} end={274.3} name="girasol consejo">{(d) => <OilRibbon duration={d} index={1} />}</Shot>

      <Shot start={276.34} end={299.2} name="aceite 2 cártamo">{(d) => <OilHero duration={d} index={2} />}</Shot>
      <Shot start={303.5} end={313.8} name="cártamo textura">
        {(d) => <AvatarCallout duration={d} kicker="Textura ligera" title="MENOS PESO SOBRE LA PIEL" accent="#E88B46" />}
      </Shot>
      <Shot start={316.0} end={329.5} name="cártamo consejo">{(d) => <OilRibbon duration={d} index={2} />}</Shot>

      <Shot start={330.24} end={353.2} name="aceite 3 coco virgen">{(d) => <OilHero duration={d} index={3} />}</Shot>
      <Shot start={355.0} end={371.8} name="coco real">
        {(d) => <FullBleedBroll duration={d} src="broll/va_coconut.mp4" title="COCO VIRGEN, EN MUY POCA CANTIDAD" sub="Reserva su textura densa para zonas secas." accent="#EDE4CF" />}
      </Shot>
      <Shot start={385.0} end={405.8} name="coco advertencia">{(d) => <OilRibbon duration={d} index={3} />}</Shot>

      <Shot start={408.44} end={426.3} name="pregunta a la audiencia">
        {(d) => <AvatarCallout duration={d} kicker="Ahora dime algo" title="¿QUÉ ACEITE TIENES HOY EN CASA?" sub="Esa respuesta cambia por región y por costumbre." accent="#D8B56D" side="left" />}
      </Shot>
      <Shot start={431.72} end={455.0} name="aceite 4 argán">{(d) => <OilHero duration={d} index={4} />}</Shot>
      <Shot start={469.2} end={493.6} name="argán consejo">{(d) => <OilRibbon duration={d} index={4} />}</Shot>

      <Shot start={496.54} end={520.2} name="aceite 5 almendras">{(d) => <OilHero duration={d} index={5} />}</Shot>
      <Shot start={522.0} end={538.8} name="almendras real">
        {(d) => <FullBleedBroll duration={d} src="broll/va_almond.mp4" title="ALMENDRAS DULCES" sub="Emoliente, flexible y siempre con prueba de parche." accent="#C98B55" />}
      </Shot>
      <Shot start={544.0} end={562.8} name="almendras consejo">{(d) => <OilRibbon duration={d} index={5} />}</Shot>

      <Shot start={564.84} end={588.4} name="aceite 6 semilla de uva">{(d) => <OilHero duration={d} index={6} />}</Shot>
      <Shot start={590.0} end={607.4} name="uva real">
        {(d) => <FullBleedBroll duration={d} src="broll/va_grapeseed.mp4" title="TEXTURA MÁS LIGERA" sub="Una alternativa cuando no quieres sensación pesada." accent="#A48AD4" />}
      </Shot>
      <Shot start={611.2} end={629.7} name="uva consejo">{(d) => <OilRibbon duration={d} index={6} />}</Shot>

      <Shot start={631.76} end={655.4} name="aceite 7 aguacate">{(d) => <OilHero duration={d} index={7} />}</Shot>
      <Shot start={661.5} end={678.6} name="aguacate densidad">
        {(d) => <AvatarCallout duration={d} kicker="Más denso" title="PARA ZONAS ÁSPERAS Y MUY SECAS" sub="No hace falta cubrir todo el rostro." accent="#99B96B" />}
      </Shot>
      <Shot start={681.0} end={700.9} name="aguacate consejo">{(d) => <OilRibbon duration={d} index={7} />}</Shot>

      <Shot start={702.14} end={724.4} name="cómo elegir">
        {(d) => <AvatarCallout duration={d} kicker="Cómo elegir" title="ESCUCHA LA RESPUESTA DE TU PIEL" sub="Sequedad, sensibilidad y tendencia a granitos importan más que la moda." accent="#A8D5C6" side="left" />}
      </Shot>
      <Shot start={728.0} end={753.2} name="prueba de parche">{(d) => <PatchTestExplainer duration={d} />}</Shot>
      <Shot start={758.0} end={785.0} name="tres pasos de aplicación">{(d) => <ApplicationSteps duration={d} />}</Shot>
      <Shot start={790.0} end={808.7} name="masaje suave">
        {(d) => <FullBleedBroll duration={d} src="broll/va_face_massage.mp4" title="PRESIONA, NO ARRASTRES" sub="La piel madura agradece movimientos suaves." accent="#A8D5C6" position="center" />}
      </Shot>
      <Shot start={811.0} end={824.4} name="menos es más">
        {(d) => <AvatarCallout duration={d} kicker="Cantidad" title="DOS O TRES GOTAS BASTAN" accent="#D8B56D" />}
      </Shot>

      <Shot start={826.44} end={853.5} name="advertencia oliva">{(d) => <OliveWarning duration={d} />}</Shot>
      <Shot start={857.0} end={878.8} name="oliva matiz">
        {(d) => <AvatarCallout duration={d} kicker="No es una prohibición" title="SI IRRITA, NO INSISTAS" sub="La piel sensible necesita observación, no obediencia ciega." accent="#E8A06A" />}
      </Shot>

      <Shot start={893.58} end={916.3} name="protector solar">
        {(d) => <AvatarCallout duration={d} kicker="El paso irremplazable" title="PROTECTOR SOLAR CADA MAÑANA" sub="Ningún aceite compensa el daño acumulado del sol." accent="#E8A06A" side="left" />}
      </Shot>
      <Shot start={927.54} end={958.8} name="sistema de rutina">{(d) => <RoutineSystem duration={d} />}</Shot>
      <Shot start={968.0} end={987.4} name="hidratante real">
        {(d) => <FullBleedBroll duration={d} src="broll/va_three_drops.mp4" title="HIDRATA PRIMERO" sub="Después, el aceite ayuda a conservar esa humedad." accent="#9FCFE4" />}
      </Shot>
      <Shot start={995.0} end={1017.8} name="rutina constante">
        {(d) => <AvatarCallout duration={d} kicker="Lo que transforma" title="CONSTANCIA, NO EXCESO" sub="Una rutina simple sostenida vence a diez frascos abandonados." accent="#A8D5C6" />}
      </Shot>
      <Shot start={1021.0} end={1043.5} name="resumen siete aceites">{(d) => <SevenOilOrbit duration={d} />}</Shot>
      <Shot start={1048.34} end={1071.0} name="queridos amigos">
        {(d) => <AvatarCallout duration={d} kicker="Queridos amigos" title="¿CUÁL DE LOS SIETE VAS A PROBAR?" sub="Comparte tu experiencia: puede ayudar a otra persona." accent="#D8B56D" side="left" />}
      </Shot>
      <Shot start={1077.0} end={1098.8} name="llamado a compartir">
        {(d) => <AvatarCallout duration={d} kicker="Comparte conocimiento" title="UNA EXPLICACIÓN SENCILLA EVITA MESES DE ERRORES" accent="#A8D5C6" />}
      </Shot>

      <Sequence from={quoteStart} durationInFrames={TOTAL_FRAMES_VALLER_ACEITES7 - quoteStart} premountFor={45} name="Valler · cita final">
        <DrVallerQuote
          quote="La piel no necesita milagros. Necesita protección, hidratación y constancia."
          name="Dr. Valler"
          credential="Médico · bienestar adulto"
          label="Consejo final"
          accent="#5bb7ad"
          backgroundMedia={staticFile("valler_aceites7_opt.mp4")}
          backgroundType="video"
          backgroundStartFrom={quoteStart}
        />
      </Sequence>

      <VallerFilmLayers />
    </AbsoluteFill>
  );
};
