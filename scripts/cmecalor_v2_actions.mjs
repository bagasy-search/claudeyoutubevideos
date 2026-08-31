import fs from 'node:fs';
import path from 'node:path';

const audits = [
  'work/cmecalor_v2/audit_images_root.json',
  'work/cmecalor_v2/audit_images_0_500.json',
  'work/cmecalor_v2/audit_images_500_1000.json',
  'work/cmecalor_v2/audit_images_1000_1494.json',
  'work/cmecalor_v2/audit_images_fuel.json',
  'work/cmecalor_v2/audit_images_autonomy.json',
  'work/cmecalor_v2/audit_images_heating.json',
  'work/cmecalor_v2/audit_images_flow.json',
  'work/cmecalor_v2/audit_images_home.json',
];
const plans = [
  'work/cmecalor_v2/moments_0_500.json',
  'work/cmecalor_v2/moments_500_1000.json',
  'work/cmecalor_v2/moments_1000_1494.json',
];

const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const rows = [];
const planByStart = new Map();
for (const file of plans) {
  if (!fs.existsSync(file)) continue;
  const value = read(file);
  for (const candidate of (Array.isArray(value) ? value : value.candidates || [])) {
    planByStart.set(Number(candidate.start_ms), candidate);
  }
}

for (const file of audits) {
  if (!fs.existsSync(file)) continue;
  const value = read(file);
  const items = Array.isArray(value) ? value : value.items || value.images || value.approved || [];
  for (const item of items) {
    const ok = item.ok === true || /^(approved|pass|ok|accepted)$/i.test(String(item.status || item.verdict || ''));
    if (!ok) continue;
    const sparse = item.candidate || item.moment || item;
    const candidate = {...(planByStart.get(Number(sparse.start_ms)) || {}), ...sparse};
    const image = item.file || item.filename || candidate.file || candidate.filename;
    if (!image || !candidate.agnes_motion_es) continue;
    const nombre = path.basename(image, path.extname(image));
    const motion = String(candidate.agnes_motion_es)
      .replaceAll('<Picture 1>', 'the supplied source photograph')
      .replaceAll('<Picture 2>', 'the general Claudio appearance already present in the source photograph');
    rows.push({
      nombre,
      start_ms: Number(candidate.start_ms),
      end_ms: Number(candidate.end_ms),
      anchor: candidate.caption_exact || candidate.anchor || '',
      change: 'The supplied source photograph is the immutable first frame. Keep the same person, hands, appliance, cable topology, connector geometry, room and practical lighting for the whole take.',
      motion,
      causality: candidate.action || '',
      safety: candidate.safety || '',
      reference_transport: 'PNG bytes are sent as a data URI in the Agnes video request image field; a filesystem path is never sent as the reference.',
    });
  }
}

rows.sort((a, b) => a.nombre.localeCompare(b.nombre));
fs.writeFileSync('work/cmecalor_v2/agnes_actions.json', `${JSON.stringify(rows, null, 2)}\n`);
console.log(JSON.stringify({actions: rows.length, output: 'work/cmecalor_v2/agnes_actions.json'}, null, 2));
