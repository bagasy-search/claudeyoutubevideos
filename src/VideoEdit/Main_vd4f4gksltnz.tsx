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
  CardRow,
  FlowDiagram,
  KickerChip,
  PhotoRevealCard,
  RecapList,
  StatCard,
  TZoneDiagram,
  WarningCard,
} from "./NarizPielKit";

export const TOTAL_FRAMES_VD4F4GKSLTNZ = 26662;
const FPS = 30;
const f = (seconds: number) => Math.round(seconds * FPS);

const AvatarBase: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, TOTAL_FRAMES_VD4F4GKSLTNZ - 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const microX = Math.sin(frame / 260) * 4;
  const microY = Math.cos(frame / 310) * 2;
  return (
    <AbsoluteFill style={{background: "#03090c", overflow: "hidden"}}>
      <OffthreadVideo
        src={staticFile("vd4f4gksltnz_opt.mp4")}
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
  const duration = Math.max(1, Math.min(f(end) - from, TOTAL_FRAMES_VD4F4GKSLTNZ - from));
  return (
    <Sequence from={from} durationInFrames={duration} premountFor={Math.min(45, duration - 1)} name={`Nariz · ${name}`}>
      {children(duration)}
    </Sequence>
  );
};

export const MainVd4f4gksltnz: React.FC = () => {
  const {durationInFrames} = useVideoConfig();
  const quoteStart = f(872.1);

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

      <Shot start={0} end={14.16} name="hook Marta">
        {() => <KickerChip text="DR. VALLER · CONSULTA REAL" accent="#A8D5C6" />}
      </Shot>

      <Shot start={14.16} end={41.9} name="foto de los 43">
        {(d) => (
          <PhotoRevealCard
            duration={d}
            image="med/antes_despues.png"
            kicker="Las fotos de Marta"
            title="43 AÑOS. LOS POROS YA HABLABAN."
            sub="Nadie se lo dijo entonces."
            accent="#D8B56D"
          />
        )}
      </Shot>

      <Shot start={41.9} end={61.94} name="380 mil gastados">
        {(d) => (
          <StatCard
            duration={d}
            kicker="En cinco años"
            big="$380.000"
            sub="en cremas, tratamientos y láser que nunca tocaron la causa real."
            accent="#D8B56D"
          />
        )}
      </Shot>

      <Shot start={61.94} end={81.36} name="7 de 10 pacientes">
        {(d) => (
          <StatCard
            duration={d}
            kicker="El patrón en consultorio"
            big="7 DE 10"
            sub="pacientes con flacidez tuvieron el mismo antecedente en la nariz, quince años antes."
            accent="#A8D5C6"
          />
        )}
      </Shot>

      <Shot start={81.36} end={98.56} name="cutis graso, nada más">
        {(d) => (
          <AvatarCallout
            duration={d}
            kicker="Sus palabras"
            title="“ME DECÍAN QUE TENÍA CUTIS GRASO, NADA MÁS.”"
            accent="#D8B56D"
          />
        )}
      </Shot>

      <Shot start={98.56} end={121.94} name="la pregunta">
        {(d) => (
          <AvatarCallout
            duration={d}
            kicker="La pregunta"
            title="¿QUÉ ZONA LE AVISA 15 AÑOS ANTES?"
            side="left"
            accent="#A8D5C6"
          />
        )}
      </Shot>

      <Shot start={121.94} end={141} name="es la nariz">
        {(d) => (
          <FullBleedBroll
            duration={d}
            src="broll/va_skin_dry_macro.mp4"
            title="ES LA NARIZ."
            sub="Y sé que suena raro. Quédese conmigo."
            accent="#A8D5C6"
          />
        )}
      </Shot>

      <Shot start={158.54} end={178.44} name="credenciales">
        {() => <KickerChip text="DR. VALLER · +20 AÑOS DE CONSULTORIO" accent="#A8D5C6" />}
      </Shot>

      <Shot start={178.44} end={196.62} name="10 a 15 años de anticipación">
        {(d) => (
          <StatCard
            duration={d}
            kicker="El resultado, primero"
            big="10–15 AÑOS"
            sub="de anticipación en la estructura de la piel de la nariz."
            accent="#A8D5C6"
          />
        )}
      </Shot>

      <Shot start={196.62} end={220} name="zona T">
        {(d) => <TZoneDiagram duration={d} />}
      </Shot>

      <Shot start={230.66} end={271.88} name="misma causa dos apariciones">
        {(d) => (
          <FlowDiagram
            duration={d}
            mode="linear"
            nodes={[
              {label: "43 AÑOS", sub: "nariz congestionada"},
              {label: "58 AÑOS", sub: "flacidez en mejillas y mentón"},
            ]}
            title="MISMA CAUSA. DOS APARICIONES."
            sub="Quince años de diferencia."
            accent="#A8D5C6"
          />
        )}
      </Shot>

      <Shot start={271.88} end={304.9} name="factor sol">
        {(d) => (
          <StatCard
            duration={d}
            kicker="El primer factor"
            big="MÁS SOL DE FRENTE"
            sub="La forma convexa de la nariz recibe la luz solar casi perpendicular. Años de esa exposición directa suman fotoenvejecimiento extra."
            accent="#E8A06A"
            side="right"
          />
        )}
      </Shot>

      <Shot start={304.9} end={329.88} name="factor hormonal">
        {(d) => (
          <StatCard
            duration={d}
            kicker="El segundo factor"
            big="MENOS ESTRÓGENO"
            sub="más andrógenos activos: la zona T produce más grasa justo cuando el colágeno pierde sostén."
            accent="#E8A06A"
            side="right"
          />
        )}
      </Shot>

      <Shot start={329.88} end={365} name="modelo de negocio">
        {(d) => (
          <WarningCard
            duration={d}
            title="EL MODELO DE NEGOCIO DETRÁS DEL BRILLO"
            bullets={[
              "Resecar la superficie esconde el problema por un par de horas. No lo resuelve.",
              "Eso significa que usted vuelve a comprarlo. Cada mes. Durante años.",
              "Una piel resuelta de raíz no genera una segunda compra al mes siguiente.",
            ]}
            accent="#E8A06A"
          />
        )}
      </Shot>

      <Shot start={383.52} end={431.96} name="tres signos">
        {(d) => (
          <CardRow
            duration={d}
            kicker="Revísese ahora mismo"
            items={[
              {n: "1", title: "PORO", sub: "visible a treinta centímetros de distancia"},
              {n: "2", title: "BRILLO", sub: "el pañuelo queda marcado en dos o tres horas"},
              {n: "3", title: "TEXTURA", sub: "relieve irregular, como cáscara de naranja"},
            ]}
            accent="#A8D5C6"
          />
        )}
      </Shot>

      <Shot start={431.96} end={461.0} name="el error">
        {(d) => (
          <AvatarCallout duration={d} kicker="El error" title="NUEVE DE CADA DIEZ LO HACEN MAL" accent="#D8B56D" />
        )}
      </Shot>

      <Shot start={461.0} end={497.18} name="circulo de rebote">
        {(d) => (
          <FlowDiagram
            duration={d}
            mode="loop"
            nodes={[{label: "RESECAR"}, {label: "REBOTE"}, {label: "MÁS GRASA"}]}
            title="EL CÍRCULO QUE ARRUINA EL TRATAMIENTO"
            accent="#D8B56D"
          />
        )}
      </Shot>

      <Shot start={497.18} end={527.5} name="paso 1 limpieza">
        {(d) => (
          <FullBleedBroll
            duration={d}
            src="broll/vbb_stock_cleanse.mp4"
            title="PASO 1 · LIMPIEZA SUAVE"
            sub="Dos veces al día, sin fricción."
            accent="#A8D5C6"
          />
        )}
      </Shot>

      <Shot start={529.0} end={580.18} name="paso 2 romero">
        {(d) => (
          <PhotoRevealCard
            duration={d}
            image="med/romero.png"
            kicker="Paso 2 · Estructura"
            title="ROMERO"
            sub="Ácido rosmarínico y ácido carnósico protegen el colágeno mientras la glándula sigue trabajando."
            accent="#A8D5C6"
          />
        )}
      </Shot>

      <Shot start={580.18} end={624.1} name="paso 3 alimentacion">
        {(d) => (
          <CardRow
            duration={d}
            kicker="Paso 3 · Alimentación"
            items={[
              {title: "ZINC", sub: "regula la actividad de la glándula sebácea"},
              {title: "OMEGA 3", sub: "baja el tono inflamatorio de la piel"},
            ]}
            accent="#D8B56D"
          />
        )}
      </Shot>

      <Shot start={624.1} end={652.08} name="paso 4 exfoliacion">
        {(d) => (
          <AvatarCallout
            duration={d}
            kicker="Paso 4 · Ritmo"
            title="DOS VECES POR SEMANA, NO TODOS LOS DÍAS"
            accent="#A8D5C6"
          />
        )}
      </Shot>

      <Shot start={652.08} end={692.34} name="paso 5 protector solar">
        {(d) => (
          <FullBleedBroll
            duration={d}
            src="broll/vbb_stock_sunscreen.mp4"
            title="PASO 5 · PROTECTOR SOLAR MINERAL"
            sub="Reaplicado a media mañana, no solo al salir de casa."
            accent="#E8A06A"
          />
        )}
      </Shot>

      <Shot start={692.34} end={715.72} name="paso 6 foto mensual">
        {(d) => (
          <AvatarCallout
            duration={d}
            kicker="Paso 6 · Registro"
            title="UNA FOTO POR MES"
            sub="El mismo registro que tuvo Marta, sin saberlo, a los 43."
            accent="#D8B56D"
          />
        )}
      </Shot>

      <Shot start={715.72} end={742.96} name="tambien en hombres">
        {(d) => (
          <AvatarCallout
            duration={d}
            kicker="Una aclaración"
            title="TAMBIÉN LE PASA A LOS HOMBRES"
            sub="El mismo patrón, a veces desde los treinta."
            side="left"
            accent="#A8D5C6"
          />
        )}
      </Shot>

      <Shot start={742.96} end={778} name="lo que no hace">
        {(d) => (
          <WarningCard
            duration={d}
            title="LO QUE ESTE PROTOCOLO NO HACE"
            bullets={[
              "No borra arrugas ya instaladas de un día para el otro.",
              "No reemplaza la consulta presencial si hay rosácea o dermatitis activa.",
              "No es igual para toda piel: la piel seca de zona T necesita otro enfoque.",
            ]}
            accent="#A8D5C6"
          />
        )}
      </Shot>

      <Shot start={787.46} end={833.56} name="recapitulemos">
        {(d) => (
          <RecapList
            duration={d}
            items={[
              "Revise los tres signos: poro, brillo y textura, con buena luz.",
              "Saque los limpiadores agresivos y los tónicos con alcohol.",
              "Sume un activo estructural, como el romero.",
              "Cuide el zinc y los omega tres en su alimentación.",
              "Exfolie dos veces por semana, no todos los días.",
              "Protector solar mineral, reaplicado a media mañana.",
              "Fotografíe su nariz una vez por mes.",
            ]}
            accent="#D8B56D"
          />
        )}
      </Shot>

      <Shot start={833.56} end={856.36} name="cta metodo piel joven">
        {(d) => (
          <AvatarCallout
            duration={d}
            kicker="El protocolo completo"
            title="EL MÉTODO PIEL JOVEN"
            sub="Con las cantidades exactas, paso a paso."
            accent="#D8B56D"
          />
        )}
      </Shot>

      <Sequence from={quoteStart} durationInFrames={240} premountFor={45} name="Nariz · cita final">
        <DrVallerQuote
          quote="Misma causa. Dos apariciones. Quince años de diferencia."
          name="Dr. Valler"
          credential="Médico · piel madura"
          label="Para recordar"
          accent="#A8D5C6"
          backgroundMedia={staticFile("vd4f4gksltnz_opt.mp4")}
          backgroundType="video"
          backgroundStartFrom={quoteStart}
        />
      </Sequence>

      <VallerFilmLayers />
    </AbsoluteFill>
  );
};
