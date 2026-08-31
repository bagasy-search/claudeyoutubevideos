import fs from 'node:fs';

const input = process.argv[2] || 'work/cmecalor_v2/agnes_actions.json';
const output = process.argv[3] || 'work/cmecalor_v2/agnes_actions_selected.json';
const rows = JSON.parse(fs.readFileSync(input, 'utf8').replace(/^\uFEFF/, ''));

// Motions chosen for documentary dynamism without asking Agnes to redraw
// electrical topology, exact meter values or dense printed tables.
const wanted = new Set([
  'cmec_v2_0_002', 'cmec_v2_0_003', 'cmec_v2_0_005', 'cmec_v2_0_006',
  'cmec_v2_0_007', 'cmec_v2_0_010', 'cmec_v2_0_012',
  'cmec_v2_5_002', 'cmec_v2_5_004', 'cmec_v2_5_005', 'cmec_v2_5_006',
  'cmec_v2_5_008', 'cmec_v2_5_009',
  'cmec_v2_10_001', 'cmec_v2_10_002', 'cmec_v2_10_003', 'cmec_v2_10_004',
  'cmec_v2_10_005', 'cmec_v2_10_006', 'cmec_v2_10_007',
  'cmec_v2_root_001', 'cmec_v2_root_006', 'cmec_v2_root_007', 'cmec_v2_root_008',
  'cmec_v2_fuel_001', 'cmec_v2_fuel_005', 'cmec_v2_fuel_006',
  'cmec_v2_auto_002', 'cmec_v2_auto_003', 'cmec_v2_auto_006',
  'cmec_v2_heat_002', 'cmec_v2_heat_004', 'cmec_v2_heat_005', 'cmec_v2_heat_006',
]);

const selected = rows
  .filter((row) => wanted.has(row.nombre))
  .sort((a, b) => a.start_ms - b.start_ms || a.nombre.localeCompare(b.nombre));
const selectedNames = new Set(selected.map((row) => row.nombre));
const missing = [...wanted].filter((name) => !selectedNames.has(name)).sort();

fs.writeFileSync(output, `${JSON.stringify(selected, null, 2)}\n`);
console.log(JSON.stringify({available: rows.length, selected: selected.length, missing, output}, null, 2));
