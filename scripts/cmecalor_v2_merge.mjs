// Merge only approved phrase-level v2 assets into the already delivered cmecalor timeline.
// The base audio/captions/timing remain untouched.
import fs from 'node:fs';
import path from 'node:path';

const BASE_MOMENTS = '_v3/cmecalor_moments_ms.json';
const BASE_MANIFEST = '_v3/cmecalor_asset_manifest.json';
const OUT_MOMENTS = '_v3/cmecalor_moments_ms_v2.json';
const OUT_MANIFEST = '_v3/cmecalor_asset_manifest_v2.json';
const AUDITS = [
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
const PLAN_FILES = [
  'work/cmecalor_v2/moments_0_500.json',
  'work/cmecalor_v2/moments_500_1000.json',
  'work/cmecalor_v2/moments_1000_1494.json',
];

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const base = readJson(BASE_MOMENTS);
const manifest = readJson(BASE_MANIFEST);
const additions = [];
const planByStart = new Map();
for (const planFile of PLAN_FILES) {
  if (!fs.existsSync(planFile)) continue;
  const value = readJson(planFile);
  const candidates = Array.isArray(value) ? value : value.candidates || [];
  for (const candidate of candidates) planByStart.set(Number(candidate.start_ms), candidate);
}

const normalizeItems = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.images)) return value.images;
  if (Array.isArray(value?.approved)) return value.approved;
  return [];
};

const approvedStatus = (item) => {
  if (item.ok === true) return true;
  return /^(approved|pass|ok|accepted)$/i.test(String(item.status || item.verdict || ''));
};

const approvedClips = new Set();
const clipAuditFile = 'work/cmecalor_v2/audit_clips_agnes.json';
if (fs.existsSync(clipAuditFile)) {
  for (const item of normalizeItems(readJson(clipAuditFile))) {
    if (!approvedStatus(item)) continue;
    const file = item.file || item.filename;
    if (file) approvedClips.add(path.basename(file, path.extname(file)));
  }
}

for (const auditFile of AUDITS) {
  if (!fs.existsSync(auditFile)) continue;
  for (const item of normalizeItems(readJson(auditFile))) {
    if (!approvedStatus(item)) continue;
    const sparse = item.candidate || item.moment || item;
    const candidate = {...(planByStart.get(Number(sparse.start_ms)) || {}), ...sparse};
    const file = item.file || item.filename || candidate.file || candidate.filename;
    if (!file || !Number.isFinite(Number(candidate.start_ms)) || !Number.isFinite(Number(candidate.end_ms))) continue;
    const baseName = path.basename(file, path.extname(file));
    const relStill = String(file).replace(/^public[\\/]/, '').replaceAll('\\', '/');
    const relBlur = `img/cmecalor_v2/${baseName}_blur.jpg`;
    const clipFile = `public/broll/cmecalor_v2_agnes/${baseName}.mp4`;
    additions.push({
      id: baseName,
      paragraph: candidate.paragraph ?? null,
      anchor: candidate.caption_exact || candidate.anchor,
      nouns: candidate.nouns || [],
      action: candidate.action || '',
      start_ms: Number(candidate.start_ms),
      end_ms: Number(candidate.end_ms),
      still: relStill,
      blur: fs.existsSync(`public/${relBlur}`) ? relBlur : null,
      clip: approvedClips.has(baseName) && fs.existsSync(clipFile) ? clipFile.replace(/^public[\\/]/, '').replaceAll('\\', '/') : null,
      source_span: null,
      v2: true,
      safety: candidate.safety || '',
      agnes_motion_es: candidate.agnes_motion_es || '',
    });
  }
}

const existingIds = new Set(base.moments.map((moment) => moment.id));
const unique = additions.filter((moment) => !existingIds.has(moment.id));
const moments = [...base.moments, ...unique].sort((a, b) => a.start_ms - b.start_ms || a.end_ms - b.end_ms);

for (let index = 1; index < moments.length; index += 1) {
  const previous = moments[index - 1];
  const current = moments[index];
  if (current.start_ms < previous.end_ms && previous.v2 && current.v2) {
    throw new Error(`Overlapping v2 moments: ${previous.id} and ${current.id}`);
  }
}

const assets = [...manifest.assets];
const assetFiles = new Set(assets.map((asset) => asset.file));
for (const moment of unique) {
  const file = `public/${moment.still}`;
  if (!assetFiles.has(file)) {
    assets.push({id: moment.id, file, blur: moment.blur ? `public/${moment.blur}` : null, type: 'image', v2: true});
    assetFiles.add(file);
  }
  if (moment.clip) {
    const clip = `public/${moment.clip}`;
    if (!assetFiles.has(clip)) {
      assets.push({id: `${moment.id}_clip`, file: clip, blur: null, type: 'video', v2: true});
      assetFiles.add(clip);
    }
  }
}

fs.writeFileSync(OUT_MOMENTS, `${JSON.stringify({...base, version: 2, v2_added: unique.length, moments}, null, 2)}\n`);
const addedImages = unique.length;
const addedVideos = unique.filter((moment) => Boolean(moment.clip)).length;
const counts = {
  ...manifest.counts,
  approved_assets: assets.length,
  approved_photos_requiring_blur: Number(manifest.counts.approved_photos_requiring_blur || 0) + addedImages,
  by_kind: {
    ...(manifest.counts.by_kind || {}),
    photo: Number(manifest.counts.by_kind?.photo || 0) + addedImages,
    video: Number(manifest.counts.by_kind?.video || 0) + addedVideos,
  },
  by_role: {
    ...(manifest.counts.by_role || {}),
    v2_phrase_still: addedImages,
    v2_agnes_clip: addedVideos,
  },
};
fs.writeFileSync(OUT_MANIFEST, `${JSON.stringify({...manifest, version: 2, v2_added: assets.length - manifest.assets.length, counts, assets}, null, 2)}\n`);

console.log(JSON.stringify({base: base.moments.length, added: unique.length, total: moments.length, assets: assets.length, outputs: [OUT_MOMENTS, OUT_MANIFEST]}, null, 2));
