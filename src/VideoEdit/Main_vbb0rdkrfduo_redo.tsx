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

export const TOTAL_FRAMES_VBB0RDKRFDUO_REDO = 45713;

const FPS = 30;
const SHOT_FRAMES = 84;
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
    start: 8,
    duration: 27,
    kicker: 'SIGLO XIV',
    title: 'La leyenda de Isabel de Polonia',
    accent: GOLD,
    media: [image('isabel_polonia_manuscript'), image('agua_hungria_bottle')],
  },
  {
    start: 120,
    duration: 36,
    kicker: 'SIN FÓRMULA SECRETA',
    title: 'Genética, sol y décadas de hábitos',
    accent: TEAL,
    media: [video('vbb_stock_dignity'), image('rosemary_plant_simple_final')],
  },
  {
    start: 283,
    duration: 36,
    kicker: 'LA RECETA BASE',
    title: 'Ciento veinte mililitros de aceite',
    accent: GOLD,
    media: [image('ingredients_flatlay_oil_wax'), image('oil_pouring_bowl')],
  },
  {
    start: 319,
    duration: 29,
    kicker: 'ROMERO SECO',
    title: 'Dos cucharadas de uso culinario',
    accent: TEAL,
    media: [image('vbb_rosemary_macro')],
  },
  {
    start: 348,
    duration: 65,
    kicker: 'PARA LA POMADA',
    title: 'Diez gramos de cera de abejas',
    accent: GOLD,
    media: [image('beeswax_grams_scale'), image('jars_cooling_dated')],
  },
  {
    start: 597,
    duration: 37,
    kicker: 'ANTES DEL PRIMER USO',
    title: 'La prueba que muchas recetas omiten',
    accent: RED,
    media: [image('vbb_patch_test')],
  },
  {
    start: 696,
    duration: 58,
    kicker: 'PROMESA 1',
    title: 'Venitas, varices y circulación',
    accent: RED,
    media: [image('carmen_legs_massage'), image('leg_veins_diagram')],
  },
  {
    start: 782,
    duration: 56,
    kicker: 'PROMESA 2',
    title: 'Hidratación, no colágeno nuevo',
    accent: TEAL,
    media: [image('hands_elbows_dry_night'), image('vbb_wrinkle_macro')],
  },
  {
    start: 838,
    duration: 32,
    kicker: 'LAS MANCHAS',
    title: 'Protección solar, no aceite',
    accent: GOLD,
    media: [image('vbb_sunscreen_home')],
  },
  {
    start: 899,
    duration: 50,
    kicker: 'PROMESA 3',
    title: 'Ojeras: la compresa fría',
    accent: TEAL,
    media: [image('cold_compress_eyes')],
  },
  {
    start: 949,
    duration: 74,
    kicker: 'PROMESA 4',
    title: 'Molestia muscular y articular',
    accent: RED,
    media: [image('jose_shoulder_garden'), image('shoulder_massage_balm')],
  },
  {
    start: 1051,
    duration: 56,
    kicker: 'PROMESA 5',
    title: 'Hongos, grietas y heridas',
    accent: RED,
    media: [image('foot_care_dry_heel')],
  },
  {
    start: 1136,
    duration: 110,
    kicker: 'TRES USOS CONCRETOS',
    title: 'Manos, masaje y piernas',
    accent: GOLD,
    media: [image('hands_elbows_dry_night'), image('calf_massage_ankle_movement'), image('legs_after_shower')],
  },
  {
    start: 1248,
    duration: 108,
    kicker: 'PLAN DE 14 DÍAS',
    title: 'Constancia, no cantidad',
    accent: TEAL,
    media: [image('fourteen_day_calendar'), image('comparison_photos_setup')],
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
      <div style={{fontSize: 62, lineHeight: 1.05, fontWeight: 760, letterSpacing: -2.2, textShadow: '0 3px 22px rgba(0,0,0,0.75)'}}>
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
        src={staticFile('vbb0rdkrfduo_opt.mp4')}
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

const checklistScene = (
  start: number,
  kicker: string,
  title: string,
  items: string[],
  accent: string = TEAL,
): {start: number; node: React.ReactNode} => ({
  start,
  node: (
    <FedChecklist
      kicker={kicker}
      title={title}
      hot={title.split(' ').slice(-1)}
      items={items}
      accent={accent}
      mood={accent === RED ? 'cool' : 'warmdark'}
    />
  ),
});

const quoteScene = (
  start: number,
  kicker: string,
  quote: string,
  accent: string = GOLD,
): {start: number; node: React.ReactNode} => ({
  start,
  node: (
    <FedQuote
      kicker={kicker}
      quote={quote}
      author="Dr. Valler"
      role="Dermatólogo"
      image={staticFile('img/vbb_rosemary_macro.png')}
      accent={accent}
      mood="warmdark"
    />
  ),
});

const COMPONENT_SCENES: {start: number; node: React.ReactNode}[] = [
  {
    start: 175,
    node: (
      <FedChapter
        kicker="La ciencia"
        index="—"
        title="Agua, alcohol y grasa"
        sub="No todos los compuestos se extraen igual"
        accent={TEAL}
        mood="science"
      />
    ),
  },
  {
    start: 185,
    node: (
      <FedMolecule
        kicker="El mecanismo"
        title="Lo que contiene el romero"
        centerLabel="ROMERO"
        nodes={[
          {label: 'Ác. rosmarínico (agua)'},
          {label: 'Aromáticos (aceite esencial)'},
          {label: 'Ác. carnósico (grasa)'},
          {label: 'No son equivalentes'},
        ]}
        image={staticFile('img/vbb_rosemary_lab.png')}
        accent={TEAL}
        mood="science"
      />
    ),
  },
  {
    start: 216,
    node: (
      <FedChapter
        kicker="La piel protege, no absorbe todo"
        index="—"
        title="No es una inyección sin agujas"
        sub="La dosis, la zona y el tiempo de contacto importan"
        accent={GOLD}
        mood="gold"
      />
    ),
  },
  {
    start: 414,
    node: (
      <FedStep
        step={1}
        total={8}
        title="Agua en la olla"
        hot={['olla']}
        sub="Tres centímetros de agua; el aceite recibe calor indirecto"
        image={staticFile('img/bainmarie_oil_setup.png')}
        accent={TEAL}
        mood="warmdark"
      />
    ),
  },
  {
    start: 426,
    node: (
      <FedStep
        step={2}
        total={8}
        title="Fuego al mínimo"
        hot={['mínimo']}
        sub="Entre 45 y 60 grados. El aceite nunca debe humear"
        image={staticFile('img/bainmarie_thermometer.png')}
        accent={TEAL}
        mood="cool"
      />
    ),
  },
  {
    start: 450,
    node: (
      <FedStep
        step={3}
        total={8}
        title="Agrega el romero seco"
        hot={['romero']}
        sub="Treinta minutos a calor bajo, moviendo cada diez minutos"
        image={staticFile('img/rosemary_added_oil.png')}
        accent={GOLD}
        mood="gold"
      />
    ),
  },
  {
    start: 468,
    node: (
      <FedStep
        step={4}
        total={8}
        title="Apaga y reposa"
        hot={['reposa']}
        sub="Quince minutos. El color no mide la potencia"
        image={staticFile('img/vbb_water_off_heat.png')}
        accent={TEAL}
        mood="warmdark"
      />
    ),
  },
  {
    start: 486,
    node: (
      <FedStep
        step={5}
        total={8}
        title="Cuela mientras está tibio"
        hot={['cuela']}
        sub="Sin exprimir la tela con las manos desnudas"
        image={staticFile('img/straining_cloth_oil.png')}
        accent={GOLD}
        mood="gold"
      />
    ),
  },
  {
    start: 515,
    node: (
      <FedStep
        step={6}
        total={8}
        title="Agrega la cera"
        hot={['cera']}
        sub="De vuelta al baño María, fuego mínimo hasta que se derrita"
        image={staticFile('img/melting_wax_oil.png')}
        accent={TEAL}
        mood="cool"
      />
    ),
  },
  {
    start: 530,
    node: (
      <FedStep
        step={7}
        total={8}
        title="Prueba en un plato frío"
        hot={['prueba']}
        sub="Dos minutos te dicen la textura final"
        image={staticFile('img/texture_test_cold_plate.png')}
        accent={GOLD}
        mood="gold"
      />
    ),
  },
  {
    start: 549,
    node: (
      <FedStep
        step={8}
        total={8}
        title="Frascos, enfriar y fecha"
        hot={['fecha']}
        sub="Tapa solo cuando esté completamente fría"
        image={staticFile('img/jars_cooling_dated.png')}
        accent={TEAL}
        mood="warmdark"
      />
    ),
  },
  checklistScene(573, 'Conservación', 'Usala fresca', [
    'Cantidad para 3-4 semanas',
    'Lugar fresco, seco y oscuro',
    'Espátula o manos limpias y secas',
    'Si cambia de olor: descartar',
  ], GOLD),
  checklistScene(598, 'Antes del primer uso', 'Prueba de parche, 48 horas', [
    'Medio grano de arroz',
    'Cara interna del antebrazo',
    'Sin cubrir, 48 horas',
    'Si arde: lavar y no usar',
  ], RED),
  checklistScene(634, 'No lo hagas', 'No agregues aceite esencial', [
    'Un macerado no es un concentrado',
    'No aplicar puro sobre la piel',
    'No ingerir la pomada',
    'Lejos del alcance de los niños',
  ], RED),
  {
    start: 655,
    node: (
      <FedChapter
        kicker="Lo que puede ahorrarte dinero"
        index="1-5"
        title="Las cinco promesas"
        sub="Separando lo útil de lo peligroso"
        accent={GOLD}
        mood="gold"
      />
    ),
  },
  quoteScene(663, 'Mito 1', 'La pomada borra las venitas porque abre los vasos y barre la sangre estancada', RED),
  {
    start: 700,
    node: (
      <FedHero
        kicker="Imagina a Carmen"
        title="Piernas cansadas, masaje suave"
        hot={['masaje']}
        sub="El alivio es real; la vena visible no desaparece"
        image={staticFile('img/carmen_legs_massage.png')}
        accent={TEAL}
        mood="warmdark"
        side="left"
      />
    ),
  },
  checklistScene(730, 'Señal de alarma', 'No la masajees si', [
    'Se hincha de repente y de un solo lado',
    'Está caliente, roja y muy dolorosa',
    'Hay falta de aire o dolor de pecho',
    'Ahí: atención médica urgente',
  ], RED),
  quoteScene(755, 'Mito 2', 'Estimula colágeno y produce un efecto similar a la toxina botulínica', RED),
  {
    start: 785,
    node: (
      <FedMolecule
        kicker="Lo que sí ocurre"
        title="Hidratación, no rejuvenecimiento"
        centerLabel="PIEL SECA"
        nodes={[
          {label: 'Menos pérdida de agua'},
          {label: 'Piel más flexible'},
          {label: 'Líneas superficiales, menos'},
          {label: 'No es colágeno nuevo'},
        ]}
        image={staticFile('img/collagen_fibroblast_diagram.png')}
        accent={TEAL}
        mood="science"
      />
    ),
  },
  checklistScene(840, 'Las manchas', 'No se aclaran con aceite', [
    'La irritación puede oscurecer más',
    'Evitar quemaduras solares',
    'Protector solar de amplio espectro',
    'No frotar la piel',
  ], GOLD),
  quoteScene(871, 'Mito 3', 'Borra ojeras y bolsas porque drena la linfa', RED),
  checklistScene(914, 'Alternativa simple', 'Agua fría, no romero', [
    'Dos gasas con agua fría',
    'Cinco minutos, ojos cerrados',
    'Sin hielo directo ni limón',
    'Si es unilateral o duele: consultar',
  ], TEAL),
  quoteScene(950, 'Mito 4', 'El alcanfor del romero bloquea el dolor y desinflama el cartílago', RED),
  {
    start: 1023,
    node: (
      <FedHero
        kicker="Pensemos en José"
        title="Tensión en el hombro tras el jardín"
        hot={['tensión']}
        sub="Alivio temporal, no reparación del cartílago"
        image={staticFile('img/jose_shoulder_garden.png')}
        accent={GOLD}
        mood="warmdark"
        side="right"
      />
    ),
  },
  checklistScene(999, 'No la uses como contractura si', 'Articulación de alarma', [
    'La articulación está roja o hinchada',
    'Se deformó tras una caída',
    'El dolor despierta cada noche con fiebre',
    'Ya usa un tratamiento indicado',
  ], RED),
  quoteScene(1052, 'Mito 5', 'Mata hongos, cierra grietas y cura heridas', RED),
  checklistScene(1078, 'No la apliques sobre', 'Piel abierta o infectada', [
    'Quemaduras o ampollas rotas',
    'Úlceras, pus o mal olor',
    'Entre los dedos húmedos del pie',
    'Diabetes: consultar sin esperar',
  ], RED),
  {
    start: 1108,
    node: (
      <FedChapter
        kicker="Entonces, ¿para qué sirve?"
        index="—"
        title="Tres usos razonables"
        sub="No es poco: es honesto"
        accent={TEAL}
        mood="warmdark"
      />
    ),
  },
  checklistScene(1136, 'Tres maneras concretas', 'Manos, masaje y piernas', [
    'Manos y codos secos, de noche',
    'Masaje corporal, tres minutos',
    'Piel seca de las piernas',
  ], GOLD),
  {
    start: 1215,
    node: (
      <FedStat
        kicker="¿Y el rostro?"
        value={1}
        suffix=" PUNTO"
        label="pequeño junto a la mandíbula"
        sub="Nunca en el párpado ni el contorno de ojos"
        image={staticFile('img/jaw_small_test_patch.png')}
        accent={RED}
        mood="cool"
      />
    ),
  },
  {
    start: 1247,
    node: (
      <FedChapter
        kicker="Sin convertir tu piel en un laboratorio"
        index="0-14"
        title="El plan de catorce días"
        accent={TEAL}
        mood="cool"
      />
    ),
  },
  {
    start: 1249,
    node: (
      <FedStat
        kicker="Día cero"
        value={0}
        suffix=""
        label="La prueba en el antebrazo"
        sub="Haber comido romero no cuenta como prueba"
        image={staticFile('img/vbb_patch_test.png')}
        accent={GOLD}
        mood="gold"
      />
    ),
  },
  checklistScene(1259, 'Días 1 a 3', 'Una sola zona pequeña', [
    'Un codo o el dorso de una mano',
    'Aplicá una vez al día',
    'No cambies otros productos a la vez',
  ], TEAL),
  checklistScene(1277, 'Días 4 a 7', 'Si todo está bien, ampliá', [
    'Segunda zona corporal',
    'Anotá tirantez y picazón',
    'Escala de comodidad, cero a diez',
  ], TEAL),
  {
    start: 1293,
    node: (
      <FedStat
        kicker="Día siete"
        value={7}
        suffix=" DÍAS"
        label="Foto con la misma luz, distancia y postura"
        sub="Sin filtro ni brillo del aceite recién aplicado"
        image={staticFile('img/comparison_photos_setup.png')}
        accent={GOLD}
        mood="gold"
      />
    ),
  },
  checklistScene(1331, 'Segunda semana', 'La misma cantidad', [
    'No la dupliques "porque ya te acostumbraste"',
    'Observá si el alivio dura menos',
    'No debe ocultar un dolor que empeora',
  ], TEAL),
  {
    start: 1356,
    node: (
      <FedStat
        kicker="Día catorce"
        value={14}
        suffix=" DÍAS"
        label="Comodidad sin irritación"
        sub="Si no notás diferencia, no es para vos"
        image={staticFile('img/fourteen_day_calendar.png')}
        accent={TEAL}
        mood="cool"
      />
    ),
  },
  {
    start: 1360,
    node: (
      <FedChapter
        kicker="Lo que más arruina esta preparación"
        index="1-7"
        title="Los siete errores"
        accent={RED}
        mood="cool"
      />
    ),
  },
  checklistScene(1361, 'Errores 1 a 4', 'De la preparación', [
    '1. Romero fresco y húmedo guardado',
    '2. Freír las hojas',
    '3. Aceite esencial sin medir',
    '4. Mezclar con limón, alcohol o bicarbonato',
  ], RED),
  checklistScene(1396, 'Errores 5 a 7', 'De la aplicación', [
    '5. Cerca de ojos o mucosas',
    '6. Sobre heridas, hongos o úlceras',
    '7. Confundir ardor con eficacia',
  ], RED),
  checklistScene(1417, 'Si ocurre una reacción', 'Quitá y lavá suave', [
    'Agua y un limpiador que ya tolerás',
    'No neutralices con otra mezcla casera',
    'Ampollas o dificultad para respirar: ayuda',
  ], RED),
  quoteScene(1460, 'Con honestidad', 'Lo natural puede ser útil, pero también necesita dosis, higiene, límites y un diagnóstico correcto', GOLD),
  quoteScene(1478, 'La verdadera promesa', 'No es parecer de cuarenta a los ochenta. Es llegar a los ochenta sin castigar la piel cada semana', GOLD),
  {
    start: 1496,
    node: (
      <FedCta
        kicker="Contame para qué la usarías"
        title="Escribí ROMERO en los comentarios"
        hot={['ROMERO']}
        sub="Manos secas, piernas cansadas o masaje muscular"
        buttonLabel="Te leo en los comentarios"
        image={staticFile('img/rosemary_plant_simple_final.png')}
        accent={GOLD}
        mood="gold"
      />
    ),
  },
  {
    start: 1514,
    node: (
      <FedChapter
        kicker="Gracias por cuidar con criterio"
        index="—"
        title="Instrucciones claras, no promesas grandes"
        accent={TEAL}
        mood="warmdark"
      />
    ),
  },
];

export const MainVbb0rdkrfduoRedo: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#071014'}}>
      <AvatarBase />
      <Audio src={staticFile('sfx/music_federer.mp3')} volume={0.032} loop />

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
