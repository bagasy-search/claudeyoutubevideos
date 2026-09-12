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
import {AvatarCallout, FullBleedBroll, VallerFilmLayers} from "./VallerAceitesKit";
import {
  DepthImageScene,
  LimitsGrid,
  QuoteCard,
  RecipeSteps,
  SixMechanismsOrbit,
  SplitCompare,
  TirosinasaDiagram,
  TresFrentesDiagram,
  CARMIN,
} from "./JamaicaKit";

export const TOTAL_FRAMES_VBRHDSVZLYW5 = 26241;
const FPS = 30;
const f = (seconds: number) => Math.round(seconds * FPS);
const GOLD = "#D8B56D";

const AvatarBase: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, TOTAL_FRAMES_VBRHDSVZLYW5 - 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const microX = Math.sin(frame / 260) * 4;
  const microY = Math.cos(frame / 310) * 2;
  return (
    <AbsoluteFill style={{background: "#03090c", overflow: "hidden"}}>
      <OffthreadVideo
        src={staticFile("vbrhdsvzlyw5_opt.mp4")}
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
  const duration = Math.max(1, Math.min(f(end) - from, TOTAL_FRAMES_VBRHDSVZLYW5 - from));
  return (
    <Sequence from={from} durationInFrames={duration} premountFor={Math.min(45, duration - 1)} name={`Jamaica · ${name}`}>
      {children(duration)}
    </Sequence>
  );
};

export const MainVbrhdsvzlyw5: React.FC = () => {
  const {durationInFrames} = useVideoConfig();
  const quoteStart = f(870.0);

  return (
    <AbsoluteFill style={{background: "#03090c", overflow: "hidden"}}>
      <AvatarBase />

      <Audio
        src={staticFile("sfx/music_federer.mp3")}
        loop
        volume={(musicFrame) => {
          const intro = interpolate(musicFrame, [0, 90], [0, 0.04], {
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

      <Shot start={11.9} end={21.9} name="hook manos consultorio">
        {(d) => (
          <DepthImageScene
            duration={d}
            src="img/vbr_manos_consultorio.png"
            kicker="Consultorio, hace tres semanas"
            title="LAS MANOS QUE LO DICEN TODO"
            sub="Antes de hablarle de la flor, quiero mostrarle por qué me importa tanto este tema."
            accent={CARMIN}
          />
        )}
      </Shot>

      <Shot start={24.3} end={33.3} name="cita 14 años de ahorros">
        {(d) => (
          <QuoteCard
            duration={d}
            kicker="Palabras textuales de la paciente"
            big="14 AÑOS DE AHORROS EN CREMAS"
            sub="“Mi piel sigue envejeciendo más rápido de lo que puedo pagar para frenarla.”"
            bgImage="img/vbr_frascos_cremas.png"
            accent={CARMIN}
          />
        )}
      </Shot>

      <Shot start={44.6} end={52.6} name="cliffhanger el error">
        {(d) => (
          <AvatarCallout
            duration={d}
            kicker="El error que viene"
            title="PUEDE TERMINAR MANCHÁNDOLA"
            sub="Se lo explico completo sobre el final."
            accent={CARMIN}
            side="right"
          />
        )}
      </Shot>

      <Shot start={67.9} end={78.9} name="vitamina C vs naranja">
        {(d) => (
          <SplitCompare
            duration={d}
            kicker="Un dato que sorprende"
            heading="MÁS VITAMINA C QUE UNA NARANJA"
            left={{label: "Naranja mediana", big: "100 g", sub: "La referencia clásica de vitamina C", accent: "#C98B6E"}}
            right={{label: "Flor de Jamaica seca", big: "100 g", sub: "Igual cantidad, más vitamina C en promedio", accent: CARMIN}}
          />
        )}
      </Shot>

      <Shot start={85.2} end={95.2} name="indice seis mecanismos">
        {(d) => <SixMechanismsOrbit duration={d} />}
      </Shot>

      <Shot start={112.0} end={125.0} name="tres frentes del envejecimiento">
        {(d) => <TresFrentesDiagram duration={d} />}
      </Shot>

      <Shot start={131.4} end={140.4} name="ataca la raiz no el sintoma">
        {(d) => (
          <QuoteCard
            duration={d}
            kicker="La idea central"
            big="ATACA LA RAÍZ, NO EL SÍNTOMA"
            sub="Por eso funciona distinto a una crema que solo hidrata o un sérum que solo ilumina."
            accent="#7FB8AA"
          />
        )}
      </Shot>

      <Shot start={196.0} end={207.0} name="costo serum vs flor">
        {(d) => (
          <SplitCompare
            duration={d}
            kicker="Por qué casi nadie se lo cuenta"
            heading="EL SÉRUM CARO VS. LA FLOR DE SU PATIO"
            left={{label: "Sérum con un AHA sintético", big: "$50–100", sub: "Dura 6 a 8 semanas de uso diario", accent: "#C98B6E"}}
            right={{label: "Bolsa de flor de Jamaica seca", big: "UNA FRACCIÓN", sub: "Rinde meses, para tomar y aplicar", accent: CARMIN}}
          />
        )}
      </Shot>

      <Shot start={242.3} end={251.3} name="antioxidantes gotas">
        {(d) => (
          <FullBleedBroll
            duration={d}
            src="img/vbr_gotas_flor.png"
            type="image"
            eyebrow="Mecanismo uno"
            title="MÁS ANTIOXIDANTES QUE EL ARÁNDANO"
            sub="Antocianinas: el pigmento rojo que neutraliza radicales libres."
            accent={CARMIN}
          />
        )}
      </Shot>

      <Shot start={293.2} end={301.2} name="karkade tradicion">
        {(d) => (
          <AvatarCallout
            duration={d}
            kicker="Una costumbre de siglos"
            title="KARKADÉ (EGIPTO/SUDÁN) · AGUA DE JAMAICA (MÉXICO)"
            accent={GOLD}
            side="left"
          />
        )}
      </Shot>

      <Shot start={378.4} end={384.4} name="cita menos de papel">
        {(d) => (
          <QuoteCard
            duration={d}
            kicker="Seis semanas después"
            big="“MENOS DE PAPEL”"
            sub="Así describió Liliana el cambio en sus propias manos."
            bgImage="img/vbr_manos_consultorio.png"
            accent={GOLD}
          />
        )}
      </Shot>

      <Shot start={384.8} end={392.8} name="cta1 metodo piel joven">
        {(d) => (
          <AvatarCallout
            duration={d}
            kicker="Un aliado, no todo el sistema"
            title="EL MÉTODO PIEL JOVEN"
            sub="La guía completa que uso en consultorio, para complementar esto."
            accent={GOLD}
            side="right"
          />
        )}
      </Shot>

      <Shot start={480.0} end={489.0} name="tonico casero">
        {(d) => (
          <FullBleedBroll
            duration={d}
            src="img/vbr_tonico_mujer.png"
            type="image"
            eyebrow="Mecanismo cuatro"
            title="TÓNICO CASERO, DIEZ MINUTOS"
            sub="Frío y colado, después de lavarse la cara a la mañana."
            accent="#A8D5C6"
          />
        )}
      </Shot>

      <Shot start={497.7} end={510.7} name="receta tonico">
        {(d) => (
          <RecipeSteps
            duration={d}
            kicker="La receta exacta"
            heading="TÓNICO DE JAMAICA, PASO A PASO"
            accent={GOLD}
            steps={[
              {n: "01", title: "2 CUCHARADAS · 300 ML", sub: "Flor seca en agua recién hervida"},
              {n: "02", title: "REPOSAR 15 MIN Y COLAR", sub: "Tapado, para no perder los compuestos"},
              {n: "03", title: "ENFRIAR 1 HORA", sub: "Recién entonces, sobre la piel limpia"},
            ]}
          />
        )}
      </Shot>

      <Shot start={567.4} end={575.4} name="rosacea testimonial">
        {(d) => (
          <AvatarCallout
            duration={d}
            kicker="Piel con rosácea leve"
            title="MENOS ROJEZ EN CUATRO SEMANAS"
            sub="Tónico frío, dos veces por semana — no todos los días."
            accent="#9FCFE4"
            side="left"
          />
        )}
      </Shot>

      <Shot start={594.9} end={606.9} name="tirosinasa diagrama">
        {(d) => <TirosinasaDiagram duration={d} />}
      </Shot>

      <Shot start={617.3} end={626.3} name="no reemplaza hidroquinona">
        {(d) => (
          <QuoteCard
            duration={d}
            kicker="Honestidad médica"
            big="NO REEMPLAZA A LA HIDROQUINONA"
            sub="Pero sí puede acompañar y sostener el resultado en manchas leves a moderadas."
            accent="#7FB8AA"
          />
        )}
      </Shot>

      <Shot start={675.3} end={685.3} name="error sin protector solar">
        {(d) => (
          <DepthImageScene
            duration={d}
            src="img/vbr_piel_mancha_sol.png"
            kicker="El error que le prometí"
            title="SIN PROTECTOR SOLAR, EL RESULTADO SE INVIERTE"
            titleAccentWord="SE INVIERTE"
            sub="El mismo ácido suave que empareja el tono aumenta la sensibilidad al sol."
            accent="#E8A06A"
            sweep
          />
        )}
      </Shot>

      <Shot start={699.0} end={716.0} name="limites honestos">
        {(d) => (
          <LimitsGrid
            duration={d}
            kicker="Un médico serio no vende milagros"
            heading="CUATRO ADVERTENCIAS HONESTAS"
            accent="#E8A06A"
            footer="La constancia, no la prisa, es lo que da resultado."
            items={[
              {n: "01", title: "PRESIÓN ARTERIAL: CONSULTE"},
              {n: "02", title: "PRUEBA DE PARCHE, 24–48 H"},
              {n: "03", title: "EMBARAZO: CONSULTE ANTES"},
              {n: "04", title: "NO REEMPLAZA RETINOIDES"},
            ]}
          />
        )}
      </Shot>

      <Shot start={763.6} end={771.6} name="cta2 metodo piel joven">
        {(d) => (
          <AvatarCallout
            duration={d}
            kicker="Para ir más a fondo"
            title="EL MÉTODO PIEL JOVEN"
            sub="Guía completa, paso a paso, en la descripción."
            accent={GOLD}
            side="right"
          />
        )}
      </Shot>

      <Shot start={781.9} end={790.4} name="recap receta y error">
        {(d) => (
          <RecipeSteps
            duration={d}
            kicker="Para este fin de semana"
            heading="LO ACCIONABLE, RESUMIDO"
            accent={GOLD}
            steps={[
              {n: "01", title: "TÓNICO: 2 CDA · 300 ML", sub: "Reposar 15 min, colar, enfriar 1 hora"},
              {n: "02", title: "SIEMPRE CON PROTECTOR SOLAR", sub: "De día, sin excepción — ese es el error a evitar"},
            ]}
          />
        )}
      </Shot>

      <Shot start={826.1} end={834.1} name="cta3 metodo piel joven">
        {(d) => (
          <AvatarCallout
            duration={d}
            kicker="El resto del sistema"
            title="EL MÉTODO PIEL JOVEN"
            sub="Completo y ordenado, no una pieza suelta."
            accent={GOLD}
            side="left"
          />
        )}
      </Shot>

      <Sequence from={quoteStart} durationInFrames={TOTAL_FRAMES_VBRHDSVZLYW5 - quoteStart} premountFor={45} name="Jamaica · cita final">
        <DrVallerQuote
          quote="Su piel no necesita milagros. Necesita constancia, protección solar y, a veces, una flor que ya conocía."
          name="Dr. Valler"
          credential="Médico · bienestar adulto"
          label="Consejo final"
          accent={CARMIN}
          backgroundMedia={staticFile("vbrhdsvzlyw5_opt.mp4")}
          backgroundType="video"
          backgroundStartFrom={quoteStart}
        />
      </Sequence>

      <VallerFilmLayers accent={CARMIN} />
    </AbsoluteFill>
  );
};
