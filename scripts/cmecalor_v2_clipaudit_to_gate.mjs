import fs from 'node:fs';
import path from 'node:path';

const input = process.argv[2] || 'work/cmecalor_v2/agnes_clip_audit_raw.json';
const output = process.argv[3] || 'work/cmecalor_v2/audit_clips_agnes.json';
const clipDir = process.argv[4] || 'public/broll/cmecalor_v2_agnes';
const raw = JSON.parse(fs.readFileSync(input, 'utf8').replace(/^\uFEFF/, ''));

const items = raw.map((row) => {
  // The user explicitly relaxed facial identity. Keep every structural gate:
  // hands, anatomy, object topology, impossible motion and corrupted frames.
  const structuralReasons = (row.reasons || []).filter((reason) => !/^identidad\s/i.test(reason));
  const approved = row.verdict !== 'unknown' && structuralReasons.length === 0;
  return {
    status: approved ? 'approved' : 'rejected',
    file: path.join(clipDir, `${row.name}.mp4`).replaceAll('\\', '/'),
    reason: approved
      ? 'Pasa manos, anatomía, objetos y continuidad física; la identidad facial no es gate por pedido explícito del usuario.'
      : structuralReasons.join('; ') || 'Auditor visual sin veredicto suficiente.',
    source_verdict: row.verdict,
    structural_reasons: structuralReasons,
    worst: row.worst || null,
    motion_what: row.motion_what || '',
  };
});

fs.writeFileSync(output, `${JSON.stringify({policy: 'Identidad relajada; literalidad, manos, objetos, mecánica y seguridad obligatorios.', items}, null, 2)}\n`);
console.log(JSON.stringify({approved: items.filter((x) => x.status === 'approved').length, rejected: items.filter((x) => x.status === 'rejected').length, output}, null, 2));
