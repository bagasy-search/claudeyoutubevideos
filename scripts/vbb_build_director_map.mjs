import fs from 'fs';

const source = fs.readFileSync('src/VideoEdit/Main_vbb0rdkrfduo.tsx', 'utf8');
const sceneBlock = source.match(/const SCENES: SceneSpec\[\] = \[([\s\S]*?)\n\];/)?.[1] ?? '';
const lines = sceneBlock.split(/\r?\n/).map((line) => line.trim()).filter((line) => line.startsWith('{id:'));
const field = (line, name) => line.match(new RegExp(`${name}: '([^']*)'`))?.[1] ?? '';
const numberField = (line, name) => Number(line.match(new RegExp(`${name}: ([0-9.]+)`))?.[1] ?? 0);
const listField = (line, name) => {
  const raw = line.match(new RegExp(`${name}: \\[([^\\]]*)\\]`))?.[1] ?? '';
  return [...raw.matchAll(/'([^']+)'/g)].map((match) => match[1]);
};

const movementByKind = {
  image: 'Ken Burns suave y cambio de foco hacia el sujeto nombrado.',
  montage: 'Cortes por cambio semántico; cada recurso tiene movimiento natural y encuadre progresivo.',
  chapter: 'Entrada de capítulo por profundidad y jerarquía tipográfica.',
  checklist: 'Revelación escalonada; cada punto entra cuando la voz lo justifica.',
  step: 'Número estable, cantidades progresivas y demostración visible durante todo el paso.',
  promise: 'La promesa aparece primero; el veredicto y los límites se revelan después.',
  mechanism: 'Nodos y relaciones aparecen por etapas sin cambiar de tema.',
  triptych: 'Tres paneles se activan en el orden exacto de la enumeración.',
  alert: 'Placa sobria con señales progresivas y pausa visual final.',
  calendar: 'Avance temporal de día 0 a día 14.',
  error: 'Número dominante, acción equivocada y corrección visual inmediata.',
  compare: 'Dos estados permanecen juntos; divisor central y diferencia explícita.',
};

const maps = lines.map((line) => {
  const kind = field(line, 'kind');
  const start = numberField(line, 'start');
  const end = numberField(line, 'end');
  const media = [...line.matchAll(/(?:img|stock)\('([^']+)'/g)].map((match) => match[1]);
  const labels = listField(line, 'labels');
  const items = listField(line, 'items');
  const title = field(line, 'title');
  return {
    id: field(line, 'id'),
    start_sec: start,
    end_sec: end,
    phrase_anchor: `${field(line, 'kicker')} — ${title}`,
    narrative_intent: title,
    indispensable_visual_information: labels.length ? labels : items,
    shot_type: kind,
    primary_resource: media,
    internal_motion: movementByKind[kind] ?? 'Movimiento interno derivado de frames.',
    editorial_text: [field(line, 'kicker'), title, ...labels, ...items],
    transition_in: kind === 'montage' ? 'Corte limpio motivado por cambio de sujeto.' : 'Corte limpio o transformación de profundidad en límite semántico.',
    transition_out: 'Salida al completar la unidad de voz; nunca a mitad de palabra o gesto.',
    retention_reason: 'Representa la idea pronunciada y agrega una revelación visual funcional.',
    mismatch_risk: kind === 'error' || kind === 'alert' || kind === 'promise'
      ? 'La acción peligrosa o exagerada debe leerse como negada, nunca como recomendación.'
      : 'No adelantar el siguiente concepto ni mantener el recurso cuando la voz ya cambió de tema.',
  };
});

fs.writeFileSync('beatsheet/vbb0rdkrfduo_director.json', JSON.stringify({
  slug: 'vbb0rdkrfduo',
  clock: 'public/captions_vbb0rdkrfduo.json',
  first_minute: 'beatsheet/vbb0rdkrfduo_first_minute.json',
  scene_count: maps.length,
  scenes: maps,
}, null, 2));
console.log(`${maps.length} escenas dirigidas -> beatsheet/vbb0rdkrfduo_director.json`);
