import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {
  FedChapter,
  FedChecklist,
  FedCta,
  FedHero,
  FedMolecule,
  FedQuote,
  FedStat,
  FedStep,
} from '../FedererKit';

export const TOTAL_FRAMES_VFH490RRUVAB = 36252;

const FPS = 30;
const SHOT_FRAMES = 78;
const IVORY = '#F4EFE4';
const TEAL = '#88B9A7';
const GOLD = '#C7A35C';
const RED = '#C96857';

type MediaAsset = {src: string; type: 'image' | 'video'};

type VisualWindow = {
  start: number;
  duration: number;
  kicker: string;
  title: string;
  accent?: string;
  media: MediaAsset[];
};

const image = (name: string): MediaAsset => ({src: `img/${name}.png`, type: 'image'});
const video = (name: string): MediaAsset => ({src: `broll/${name}.mp4`, type: 'video'});
const frames = (seconds: number) => Math.round(seconds * FPS);

const WINDOWS: VisualWindow[] = [
  {
    start: 129.56,
    duration: 36.4,
    kicker: 'DESPUÉS DE LOS 50',
    title: 'Cada gesto rinde más',
    accent: TEAL,
    media: [image('mujer_madura_rutina_espejo'), video('vfh_stock_mirror'), image('mujer_madura_rutina_espejo')],
  },
  {
    start: 208.28,
    duration: 51.0,
    kicker: 'RUTINA IMPECABLE, ORIGEN OCULTO',
    title: 'La inflamación no pide permiso',
    accent: TEAL,
    media: [video('vfh_stock_routine'), image('mujer_madura_rutina_espejo'), video('vfh_stock_mirror')],
  },
  {
    start: 349.2,
    duration: 40.1,
    kicker: 'FORMACIÓN MÉDICA',
    title: 'Un punto ciego estructural',
    accent: GOLD,
    media: [image('consultorio_dr_valler'), video('vfh_stock_derm')],
  },
  {
    start: 505.92,
    duration: 39.66,
    kicker: 'MÉTODO 1',
    title: 'Revise la etiqueta',
    accent: TEAL,
    media: [image('etiqueta_inci_shampoo')],
  },
  {
    start: 545.58,
    duration: 37.38,
    kicker: 'MÉTODO 2',
    title: 'Agua tibia, no caliente',
    accent: TEAL,
    media: [image('ducha_agua_tibia'), video('vfh_stock_mirror')],
  },
  {
    start: 582.96,
    duration: 32.26,
    kicker: 'MÉTODO 3',
    title: 'Cepille antes de mojar',
    accent: TEAL,
    media: [image('cepillado_cerdas_suaves'), video('vfh_stock_brush')],
  },
  {
    start: 615.22,
    duration: 44.78,
    kicker: 'MÉTODO 4',
    title: 'Proteja la raya del pelo',
    accent: GOLD,
    media: [image('gorro_proteccion_solar'), video('vfh_stock_hat')],
  },
  {
    start: 660.0,
    duration: 40.98,
    kicker: 'MÉTODO 5',
    title: 'Día por medio, no a diario',
    accent: GOLD,
    media: [image('ducha_agua_tibia'), video('vfh_stock_routine')],
  },
  {
    start: 739.28,
    duration: 83.12,
    kicker: 'MÉTODO 6',
    title: 'El tiempo de contacto',
    accent: RED,
    media: [image('masaje_capilar_dos_manos'), video('vfh_stock_brush')],
  },
  {
    start: 822.4,
    duration: 76.4,
    kicker: 'MÉTODO 7',
    title: 'Lo que potencia el efecto',
    accent: GOLD,
    media: [image('niacinamida_pantenol_argan'), image('funda_almohada_seda'), video('vfh_stock_pillow')],
  },
  {
    start: 1050.38,
    duration: 77.0,
    kicker: 'RECAPITULEMOS',
    title: 'Los 7 pasos, otra vez',
    accent: TEAL,
    media: [
      image('etiqueta_inci_shampoo'),
      image('ducha_agua_tibia'),
      image('cepillado_cerdas_suaves'),
      image('gorro_proteccion_solar'),
      image('masaje_capilar_dos_manos'),
      image('niacinamida_pantenol_argan'),
      video('vfh_stock_routine'),
    ],
  },
];

const MediaShot: React.FC<{asset: MediaAsset; index: number}> = ({asset, index}) => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, SHOT_FRAMES], [1.015, 1.075], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const x = index % 2 === 0 ? 0.8 : -0.8;

  return (
    <AbsoluteFill style={{backgroundColor: '#071014', overflow: 'hidden'}}>
      {asset.type === 'video' ? (
        <OffthreadVideo
          src={staticFile(asset.src)}
          muted
          startFrom={(index % 4) * 21}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${drift}) translateX(${x}%)`,
          }}
        />
      ) : (
        <Img
          src={staticFile(asset.src)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${drift}) translateX(${x}%)`,
          }}
        />
      )}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(90deg, rgba(4,10,12,0.78) 0%, rgba(4,10,12,0.22) 48%, rgba(4,10,12,0.04) 74%)',
        }}
      />
    </AbsoluteFill>
  );
};

const EditorialTitle: React.FC<{kicker: string; title: string; accent: string}> = ({kicker, title, accent}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 8, 72, 88], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const x = interpolate(frame, [0, 20], [-34, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: 102,
        top: 106,
        width: 820,
        opacity,
        transform: `translateX(${x}px)`,
        fontFamily: 'Arial, Helvetica, sans-serif',
        color: IVORY,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18}}>
        <div style={{width: 62, height: 4, backgroundColor: accent}} />
        <div style={{fontSize: 22, fontWeight: 800, letterSpacing: 4, color: accent}}>{kicker}</div>
      </div>
      <div style={{fontSize: 68, lineHeight: 1.02, fontWeight: 760, letterSpacing: -2.4, textShadow: '0 3px 22px rgba(0,0,0,0.75)'}}>
        {title}
      </div>
    </div>
  );
};

const FullVisual: React.FC<{window: VisualWindow}> = ({window}) => {
  const duration = frames(window.duration);
  const count = Math.ceil(duration / SHOT_FRAMES);

  return (
    <AbsoluteFill style={{backgroundColor: '#071014'}}>
      {Array.from({length: count}).map((_, index) => {
        const from = index * SHOT_FRAMES;
        const shotDuration = Math.min(SHOT_FRAMES, duration - from);
        const asset = window.media[index % window.media.length];
        return (
          <Sequence key={`${asset.src}-${index}`} from={from} durationInFrames={shotDuration} premountFor={15}>
            <MediaShot asset={asset} index={index} />
          </Sequence>
        );
      })}
      <EditorialTitle kicker={window.kicker} title={window.title} accent={window.accent ?? TEAL} />
    </AbsoluteFill>
  );
};

const AvatarBase: React.FC = () => {
  const frame = useCurrentFrame();
  const cycle = frame % frames(42);
  const scale = interpolate(cycle, [0, frames(42)], [1.006, 1.035], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const drift = Math.sin(frame / 225) * 0.35;

  return (
    <AbsoluteFill style={{backgroundColor: '#071014', overflow: 'hidden'}}>
      <OffthreadVideo
        src={staticFile('vfh490rruvab_opt.mp4')}
        volume={1}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: '50% 50%',
          transformOrigin: '50% 38%',
          transform: `scale(${scale}) translateX(${drift}%)`,
        }}
      />
    </AbsoluteFill>
  );
};

const COMPONENT_SCENES: {start: number; node: React.ReactNode}[] = [
  {
    start: 28.0,
    node: (
      <FedQuote
        kicker="El momento que cambió todo"
        quote="¿Con qué se lava el suyo?"
        author="Dr. Valler"
        role="Dermatólogo, a Liliana"
        image={staticFile('img/liliana_peluqueria_silueta.png')}
        accent={TEAL}
        mood="warmdark"
      />
    ),
  },
  {
    start: 108.0,
    node: (
      <FedHero
        kicker="Quién habla"
        title="28 años de consultorio"
        hot={['28']}
        sub="Dermatología enfocada en piel adulta y madura"
        image={staticFile('img/consultorio_dr_valler.png')}
        accent={GOLD}
        mood="gold"
        side="right"
      />
    ),
  },
  {
    start: 140.0,
    node: (
      <FedHero
        kicker="Después de los 50"
        title="Cada gesto rinde más"
        hot={['50']}
        sub="Menos estrógeno, menos colágeno de base, menor capacidad de repararse"
        image={staticFile('img/mujer_madura_rutina_espejo.png')}
        accent={TEAL}
        mood="warmdark"
        side="left"
      />
    ),
  },
  {
    start: 195.0,
    node: (
      <FedHero
        kicker="El mismo patrón"
        title="El shampoo de la nieta"
        hot={['patrón']}
        sub="Ricardo, 68 años, ingeniero jubilado"
        image={staticFile('img/ricardo_planilla_carpeta.png')}
        accent={GOLD}
        mood="warmdark"
        side="right"
      />
    ),
  },
  {
    start: 245.0,
    node: (
      <FedHero
        kicker="La conexión oculta"
        title="De la nuca al rostro"
        hot={['rostro']}
        sub="La inflamación no se queda en el cuero cabelludo"
        image={staticFile('img/mujer_madura_rutina_espejo.png')}
        accent={TEAL}
        mood="cool"
        side="left"
      />
    ),
  },
  {
    start: 310.0,
    node: (
      <FedStat
        kicker="El número que nadie dice"
        value={120}
        prefix="$"
        suffix=""
        label="por 30 ml de sérum de lujo"
        sub="El extracto puro cuesta una fracción de eso"
        image={staticFile('img/frasco_lujo_vs_extracto.png')}
        accent={GOLD}
        mood="gold"
      />
    ),
  },
  {
    start: 344.0,
    node: (
      <FedQuote
        kicker="La razón del silencio"
        quote="Un consejo gratuito, aplicado bien, no genera una suscripción. Un frasco de sérum, sí."
        author="Dr. Valler"
        role="Dermatólogo"
        accent={GOLD}
        mood="warmdark"
      />
    ),
  },
  {
    start: 355.0,
    node: (
      <FedChapter
        kicker="Un punto ciego, no una conspiración"
        index="—"
        title="El punto ciego"
        sub="Cuero cabelludo y rostro: dos consultas separadas"
        accent={TEAL}
        mood="cool"
      />
    ),
  },
  {
    start: 400.0,
    node: (
      <FedHero
        kicker="El principio activo"
        title="Ácido rosmarínico"
        hot={['rosmarínico']}
        sub="Polifenoles con acción antiinflamatoria y antioxidante documentada"
        image={staticFile('img/romero_macro_planta.png')}
        accent={GOLD}
        mood="gold"
        side="left"
      />
    ),
  },
  {
    start: 425.0,
    node: (
      <FedMolecule
        kicker="El mecanismo"
        title="De la inflamación al colágeno"
        centerLabel="FIBROBLASTOS"
        nodes={[
          {label: 'Inflamación ↓'},
          {label: 'Microcirculación ↑'},
          {label: 'Daño oxidativo ↓'},
          {label: 'Colágeno ↑'},
        ]}
        image={staticFile('img/romero_macro_planta.png')}
        accent={TEAL}
        mood="science"
      />
    ),
  },
  {
    start: 460.0,
    node: (
      <FedChapter
        kicker="El término clínico"
        index="—"
        title="Inflammaging"
        sub="Acumulativo. Reversible de a poco."
        accent={GOLD}
        mood="gold"
      />
    ),
  },
  {
    start: 507.0,
    node: (
      <FedChapter
        kicker="Los 7 métodos"
        index="1-7"
        title="Empecemos"
        sub="Siete cambios concretos, desde esta semana"
        accent={GOLD}
        mood="gold"
      />
    ),
  },
  {
    start: 512.0,
    node: (
      <FedStep
        step={1}
        total={7}
        title="Revise la etiqueta"
        hot={['etiqueta']}
        sub="Romero o Rosmarinus officinalis entre los primeros 8-10 ingredientes"
        image={staticFile('img/etiqueta_inci_shampoo.png')}
        accent={TEAL}
        mood="warmdark"
      />
    ),
  },
  {
    start: 550.0,
    node: (
      <FedStep
        step={2}
        total={7}
        title="Agua tibia, no caliente"
        hot={['tibia']}
        sub="El agua caliente reseca e inflama el cuero cabelludo"
        image={staticFile('img/ducha_agua_tibia.png')}
        accent={TEAL}
        mood="cool"
      />
    ),
  },
  {
    start: 588.0,
    node: (
      <FedStep
        step={3}
        total={7}
        title="Cepille antes de mojar"
        hot={['cepille']}
        sub="30 segundos con cerdas suaves: exfoliación mecánica leve"
        image={staticFile('img/cepillado_cerdas_suaves.png')}
        accent={TEAL}
        mood="warmdark"
      />
    ),
  },
  {
    start: 620.0,
    node: (
      <FedStep
        step={4}
        total={7}
        title="Proteja la raya del pelo"
        hot={['protección']}
        sub="Radiación UV acumulada en el cuero cabelludo expuesto"
        image={staticFile('img/gorro_proteccion_solar.png')}
        accent={GOLD}
        mood="gold"
      />
    ),
  },
  {
    start: 660.0,
    node: (
      <FedStep
        step={5}
        total={7}
        title="Día por medio, no todos los días"
        hot={['frecuencia']}
        sub="Día por medio o cada tres días, según su cuero cabelludo"
        image={staticFile('img/ducha_agua_tibia.png')}
        accent={TEAL}
        mood="warmdark"
      />
    ),
  },
  {
    start: 705.0,
    node: (
      <FedChecklist
        kicker="Desmintiendo un mito"
        title="'Anticaída' no es lo mismo"
        hot={['mismo']}
        items={[
          'Promete detener la caída',
          'No garantiza romero activo',
          'No garantiza la concentración correcta',
          'Lea la etiqueta igual',
        ]}
        accent={RED}
        mood="cool"
      />
    ),
  },
  {
    start: 745.0,
    node: (
      <FedStep
        step={6}
        total={7}
        title="El tiempo de contacto"
        hot={['tiempo']}
        sub="Dos pasadas de 10-15 segundos desperdician todo el esfuerzo"
        image={staticFile('img/masaje_capilar_dos_manos.png')}
        accent={RED}
        mood="cool"
      />
    ),
  },
  {
    start: 795.0,
    node: (
      <FedStat
        kicker="La forma correcta"
        value={3}
        suffix=" MIN"
        label="de masaje circular suave, como mínimo"
        sub="Con las yemas de los dedos, no con las uñas"
        image={staticFile('img/masaje_capilar_dos_manos.png')}
        accent={GOLD}
        mood="gold"
      />
    ),
  },
  {
    start: 828.0,
    node: (
      <FedStep
        step={7}
        total={7}
        title="Tres ingredientes que potencian"
        hot={['potencian']}
        sub="Niacinamida, pantenol y aceite de argán"
        image={staticFile('img/niacinamida_pantenol_argan.png')}
        accent={GOLD}
        mood="gold"
      />
    ),
  },
  {
    start: 875.0,
    node: (
      <FedChecklist
        kicker="Un dato adicional"
        title="La funda de la almohada"
        hot={['almohada']}
        items={[
          'Algodón: más fricción e inflamación',
          'Seda o raso: menos roce nocturno',
          'Menos marcas al despertar',
          'Un cambio simple y sin costo extra',
        ]}
        accent={TEAL}
        mood="warmdark"
      />
    ),
  },
  {
    start: 905.0,
    node: (
      <FedStat
        kicker="Con calidez"
        value={6}
        prefix="4-"
        suffix=" SEMANAS"
        label="para notar los primeros cambios"
        sub="Con la rutina completa, aplicada con constancia"
        image={staticFile('img/mujer_madura_rutina_espejo.png')}
        accent={GOLD}
        mood="gold"
      />
    ),
  },
  {
    start: 930.0,
    node: (
      <FedHero
        kicker="Liliana, dos meses después"
        title="Treinta años y nadie se lo había explicado"
        hot={['explicado']}
        sub="La peluquera que abrió este video"
        image={staticFile('img/liliana_peluqueria_silueta.png')}
        accent={TEAL}
        mood="warmdark"
        side="left"
      />
    ),
  },
  {
    start: 957.0,
    node: (
      <FedHero
        kicker="Ricardo, seis semanas después"
        title="La misma planilla, una fila nueva"
        hot={['nueva']}
        sub="Ingeniero jubilado, 68 años"
        image={staticFile('img/ricardo_planilla_carpeta.png')}
        accent={GOLD}
        mood="warmdark"
        side="right"
      />
    ),
  },
  {
    start: 985.0,
    node: (
      <FedChecklist
        kicker="Los límites reales"
        title="Lo que este método NO hace"
        hot={['NO']}
        items={[
          'No reemplaza su rutina facial',
          'No trata arrugas profundas',
          'No vence la genética',
          'Consulte antes si tiene una condición diagnosticada',
        ]}
        accent={RED}
        mood="cool"
      />
    ),
  },
  {
    start: 1036.0,
    node: (
      <FedQuote
        kicker="Con humildad"
        quote="Sé que suena demasiado simple para ser real."
        author="Dr. Valler"
        role="28 años de consultorio"
        accent={GOLD}
        mood="warmdark"
      />
    ),
  },
  {
    start: 1055.0,
    node: (
      <FedChecklist
        kicker="Recapitulemos"
        title="Los primeros 4 pasos"
        hot={['4']}
        items={[
          '1. Etiqueta con romero real',
          '2. Agua tibia, nunca caliente',
          '3. Cepillado previo, 30 seg',
          '4. Protección solar en la raya',
        ]}
        accent={GOLD}
        mood="gold"
      />
    ),
  },
  {
    start: 1082.0,
    node: (
      <FedChecklist
        kicker="Recapitulemos"
        title="Los últimos 3 pasos"
        hot={['3']}
        items={[
          '5. Frecuencia día por medio',
          '6. Masaje de 2-3 minutos',
          '7. Niacinamida, pantenol, argán',
        ]}
        accent={GOLD}
        mood="gold"
      />
    ),
  },
  {
    start: 1118.0,
    node: (
      <FedStat
        kicker="La regla de oro"
        value={7}
        suffix=" PASOS"
        label="Ninguno exige perfección. Todos exigen constancia."
        image={staticFile('img/etiqueta_inci_shampoo.png')}
        accent={TEAL}
        mood="cool"
      />
    ),
  },
  {
    start: 1130.0,
    node: (
      <FedCta
        kicker="Para quien quiera ir más allá"
        title="Método Piel Joven"
        hot={['Piel Joven']}
        sub="La rutina completa, paso a paso, sin promesas milagrosas"
        buttonLabel="Más información en la descripción"
        image={staticFile('img/romero_macro_planta.png')}
        accent={GOLD}
        mood="gold"
      />
    ),
  },
  {
    start: 1158.0,
    node: (
      <FedChapter
        kicker="La próxima vez"
        index="—"
        title="Un ingrediente de su cocina"
        sub="Puede estar acelerando sus arrugas sin que lo sepa"
        accent={GOLD}
        mood="gold"
      />
    ),
  },
  {
    start: 1180.0,
    node: (
      <FedChapter
        kicker="Para cerrar"
        index="—"
        title="Entender para cuidar"
        sub="El conocimiento es la base de cada buen hábito"
        accent={TEAL}
        mood="warmdark"
      />
    ),
  },
];

export const MainVfh490rruvab: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#071014'}}>
      <AvatarBase />
      <Audio src={staticFile('sfx/music_federer.mp3')} volume={0.035} loop />

      {WINDOWS.map((window) => (
        <Sequence
          key={`${window.start}-${window.title}`}
          from={frames(window.start)}
          durationInFrames={frames(window.duration)}
          premountFor={FPS}
        >
          <FullVisual window={window} />
        </Sequence>
      ))}

      {COMPONENT_SCENES.map((scene) => (
        <Sequence key={scene.start} from={frames(scene.start)} durationInFrames={150} premountFor={FPS}>
          {scene.node}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
