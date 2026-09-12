import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const slug = 'cmecalor';
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(projectRoot, '_v3');
const manifestPath = path.join(outputDir, `${slug}_asset_manifest.json`);
const preflightPath = path.join(outputDir, `${slug}_stage15_preflight.json`);
const expectedAspect = 16 / 9;
const aspectTolerance = 0.06;

const requiredSources = [
  'work/cmecalor/visual_a.json',
  'work/cmecalor/visual_b.json',
  'work/cmecalor/visual_c.json',
  'public/img/cmecalor/cmec_cta_manifest.json',
  'work/cmecalor/agnes_clips_audit_final.json',
  'work/cmecalor/avatar_preflight.json',
];
const optionalMassAudits = [1, 2, 3, 4].map(
  (shard) => `work/cmecalor/mass_audit_s${shard}.json`,
);

const errors = [];
const warnings = [];
const sourceState = [];
const assets = [];
const rejectedExcluded = [];
const nonApprovedExcluded = [];
const approvedWithoutFile = [];

const posix = (value) => value.replaceAll('\\', '/');
const abs = (value) => (path.isAbsolute(value) ? value : path.join(projectRoot, value));
const rel = (value) => {
  const relative = path.relative(projectRoot, value);
  return relative && !relative.startsWith('..') && !path.isAbsolute(relative)
    ? posix(relative)
    : posix(value);
};

function pushError(code, message, context = {}) {
  errors.push({code, message, ...context});
}

function pushWarning(code, message, context = {}) {
  warnings.push({code, message, ...context});
}

function readJson(relativePath, {optional = false} = {}) {
  const fullPath = abs(relativePath);
  if (!fs.existsSync(fullPath)) {
    sourceState.push({path: relativePath, required: !optional, exists: false});
    if (!optional) {
      pushError('missing_required_source', `Required source is missing: ${relativePath}`, {
        source: relativePath,
      });
    }
    return null;
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    sourceState.push({
      path: relativePath,
      required: !optional,
      exists: true,
      size_bytes: fs.statSync(fullPath).size,
    });
    return parsed;
  } catch (error) {
    pushError('invalid_json_source', `Source is not valid JSON: ${relativePath}`, {
      source: relativePath,
      detail: error.message,
    });
    return null;
  }
}

function statusValues(item) {
  return [item?.validation, item?.verdict, item?.status]
    .filter((value) => typeof value === 'string')
    .map((value) => value.trim().toLowerCase());
}

function isApproved(item) {
  const values = statusValues(item);
  const hasReject = values.some((value) => /^(reject|rejected|fail|failed)(?:$|[_:-])/.test(value));
  const hasApproval = values.some((value) => /^(pass|approved)(?:$|[_:-])/.test(value));
  return hasApproval && !hasReject;
}

function isRejected(item) {
  return statusValues(item).some((value) =>
    /^(reject|rejected|fail|failed)(?:$|[_:-])/.test(value),
  );
}

function displayStatus(item) {
  return statusValues(item).join('|') || 'unspecified';
}

function inferBlur(file) {
  const extension = path.extname(file);
  return `${file.slice(0, -extension.length)}_blur.jpg`;
}

function itemFile(item) {
  return item?.filename ?? item?.file ?? item?.path ?? null;
}

function itemBlur(item) {
  return item?.blur_filename ?? item?.blur ?? item?.blur_path ?? null;
}

function photoLike(visualType) {
  return ['photo', 'stock', 'agnes_candidate', 'claudio', 'claudio_pov', 'objeto'].includes(
    String(visualType ?? '').toLowerCase(),
  );
}

function addApprovedAsset({
  id,
  source,
  sourceId,
  role,
  kind,
  visualType,
  status,
  file,
  blur = null,
  needsBlur = false,
  ratioPolicy = '16:9',
  reason = null,
}) {
  if (!file) {
    approvedWithoutFile.push({source, id: sourceId ?? id, status, role});
    return;
  }

  const normalizedFile = posix(file);
  const normalizedBlur = blur
    ? posix(blur)
    : needsBlur
      ? inferBlur(normalizedFile)
      : null;

  assets.push({
    id,
    source,
    source_id: sourceId ?? id,
    role,
    kind,
    visual_type: visualType ?? null,
    approval_status: status,
    file: normalizedFile,
    blur: normalizedBlur,
    needs_blur: needsBlur,
    ratio_policy: ratioPolicy,
    reason,
  });
}

function normalizeAuditedItems(sourcePath, items, {family, massShard = null} = {}) {
  for (const item of items ?? []) {
    const sourceId = item.id ?? item.name ?? `${family}_unknown`;
    const status = displayStatus(item);

    if (isRejected(item)) {
      rejectedExcluded.push({
        source: sourcePath,
        id: sourceId,
        status,
        reason: item.reason ?? item.issue ?? null,
      });
      continue;
    }

    if (!isApproved(item)) {
      nonApprovedExcluded.push({source: sourcePath, id: sourceId, status});
      continue;
    }

    const file = itemFile(item);
    const visualType = massShard ? item.tipo ?? 'photo' : item.visual_type ?? 'photo';
    const hasRaster = typeof file === 'string' && file.length > 0;
    const isPhoto = massShard ? true : photoLike(visualType);
    const kind = hasRaster && /\.mp4$/i.test(file)
      ? 'video'
      : isPhoto
        ? 'photo'
        : 'diagram';

    addApprovedAsset({
      id: `${family}:${sourceId}`,
      source: sourcePath,
      sourceId,
      role: massShard ? `mass_s${massShard}` : family,
      kind,
      visualType,
      status,
      file,
      blur: itemBlur(item),
      needsBlur: kind === 'photo',
      reason: item.reason ?? item.validation_notes ?? null,
    });
  }
}

for (const sourcePath of requiredSources.slice(0, 3)) {
  const source = readJson(sourcePath);
  if (source) normalizeAuditedItems(sourcePath, source.items, {family: path.basename(sourcePath, '.json')});
}

for (let index = 0; index < optionalMassAudits.length; index += 1) {
  const sourcePath = optionalMassAudits[index];
  const source = readJson(sourcePath, {optional: true});
  if (source) normalizeAuditedItems(sourcePath, source.items, {family: `mass_s${index + 1}`, massShard: index + 1});
}

const ctaSourcePath = 'public/img/cmecalor/cmec_cta_manifest.json';
const ctaManifest = readJson(ctaSourcePath);
if (ctaManifest) {
  for (const [role, entry] of Object.entries(ctaManifest.assets ?? {})) {
    const image = entry?.image ? `public/${posix(entry.image).replace(/^public\//, '')}` : null;
    const blur = entry?.blur ? `public/${posix(entry.blur).replace(/^public\//, '')}` : null;
    addApprovedAsset({
      id: `cta:${role}`,
      source: ctaSourcePath,
      sourceId: role,
      role,
      kind: role === 'qr_only' ? 'qr' : 'cta',
      visualType: role === 'qr_only' ? 'qr' : 'graphic',
      status: 'approved_manifest',
      file: image,
      blur,
      needsBlur: false,
      ratioPolicy: role === 'qr_only' ? 'square' : '16:9',
    });
  }
}

const clipsSourcePath = 'work/cmecalor/agnes_clips_audit_final.json';
const clipsAudit = readJson(clipsSourcePath);
if (clipsAudit) {
  normalizeAuditedItems(clipsSourcePath, clipsAudit.items, {family: 'agnes_clip'});
}

const thumbnailPrimary = 'public/img/cmecalor/cmec_thumbnail.png';
const thumbnailFallback = 'public/cmecalor_thumbnail.png';
const thumbnailFile = fs.existsSync(abs(thumbnailPrimary)) ? thumbnailPrimary : thumbnailFallback;
addApprovedAsset({
  id: 'required:thumbnail',
  source: 'stage15_required',
  sourceId: 'thumbnail',
  role: 'thumbnail',
  kind: 'thumbnail',
  visualType: 'thumbnail',
  status: 'approved_required',
  file: thumbnailFile,
  blur: thumbnailFile === thumbnailPrimary ? inferBlur(thumbnailFile) : null,
  needsBlur: thumbnailFile === thumbnailPrimary,
});

const avatarSourcePath = 'work/cmecalor/avatar_preflight.json';
const avatarPreflight = readJson(avatarSourcePath);
if (avatarPreflight) {
  const avatarFile = avatarPreflight.project_link
    ?? avatarPreflight.optimized_media_path
    ?? avatarPreflight.received_path;
  addApprovedAsset({
    id: 'avatar:preflight',
    source: avatarSourcePath,
    sourceId: slug,
    role: 'avatar',
    kind: 'avatar',
    visualType: 'video',
    status: `approved_preflight:${avatarPreflight.motion_gate?.status ?? 'unknown'}`,
    file: avatarFile,
    needsBlur: false,
  });
}

function probeVideo(fullPath) {
  const result = spawnSync(
    'ffprobe',
    [
      '-v', 'error',
      '-select_streams', 'v:0',
      '-show_entries', 'stream=codec_name,width,height,duration',
      '-of', 'json',
      fullPath,
    ],
    {encoding: 'utf8', windowsHide: true},
  );
  if (result.status !== 0) {
    throw new Error((result.stderr || result.stdout || 'ffprobe failed').trim());
  }
  const stream = JSON.parse(result.stdout)?.streams?.[0];
  if (!stream) throw new Error('No video stream found');
  return {
    codec: stream.codec_name ?? null,
    width: Number(stream.width),
    height: Number(stream.height),
    duration_seconds: Number(stream.duration) || null,
  };
}

async function probeImage(fullPath) {
  const metadata = await sharp(fullPath).metadata();
  return {
    codec: metadata.format ?? null,
    width: Number(metadata.width),
    height: Number(metadata.height),
  };
}

function validateDimensions(asset, media) {
  if (!Number.isFinite(media.width) || !Number.isFinite(media.height) || media.width <= 0 || media.height <= 0) {
    pushError('invalid_dimensions', `Approved asset has invalid dimensions: ${asset.file}`, {
      asset_id: asset.id,
      file: asset.file,
    });
    return;
  }

  const ratio = media.width / media.height;
  media.aspect_ratio = Number(ratio.toFixed(5));

  if (asset.ratio_policy === 'square') {
    if (Math.abs(ratio - 1) > 0.04 || media.width < 512 || media.height < 512) {
      pushError('invalid_qr_dimensions', `Approved QR is not a reasonable square asset: ${asset.file}`, {
        asset_id: asset.id,
        file: asset.file,
        width: media.width,
        height: media.height,
      });
    }
    return;
  }

  if (Math.abs(ratio - expectedAspect) > aspectTolerance) {
    pushError('invalid_aspect_ratio', `Approved asset is not reasonably 16:9: ${asset.file}`, {
      asset_id: asset.id,
      file: asset.file,
      width: media.width,
      height: media.height,
      aspect_ratio: media.aspect_ratio,
    });
  }

  if (media.width < 640 || media.height < 360) {
    pushError('approved_asset_too_small', `Approved asset is too small for a 16:9 video: ${asset.file}`, {
      asset_id: asset.id,
      file: asset.file,
      width: media.width,
      height: media.height,
    });
  }
}

async function validateAsset(asset) {
  const fullPath = abs(asset.file);
  const result = {...asset, checks: {exists: false, nonempty: false, dimensions: false, blur: null}};

  if (!fs.existsSync(fullPath)) {
    pushError('missing_approved_asset', `Approved asset is missing: ${asset.file}`, {
      asset_id: asset.id,
      file: asset.file,
    });
    return result;
  }

  result.checks.exists = true;
  let stat;
  try {
    stat = fs.statSync(fullPath);
  } catch (error) {
    pushError('unreadable_approved_asset', `Approved asset cannot be read: ${asset.file}`, {
      asset_id: asset.id,
      file: asset.file,
      detail: error.message,
    });
    return result;
  }

  result.size_bytes = stat.size;
  if (!stat.isFile() || stat.size <= 0) {
    pushError('empty_approved_asset', `Approved asset is empty or not a file: ${asset.file}`, {
      asset_id: asset.id,
      file: asset.file,
    });
    return result;
  }
  result.checks.nonempty = true;

  try {
    const videoLike = ['video', 'avatar'].includes(asset.kind) || /\.mp4$/i.test(asset.file);
    result.media = videoLike ? probeVideo(fullPath) : await probeImage(fullPath);
    validateDimensions(asset, result.media);
    result.checks.dimensions = !errors.some(
      (entry) => entry.asset_id === asset.id && ['invalid_dimensions', 'invalid_aspect_ratio', 'invalid_qr_dimensions', 'approved_asset_too_small'].includes(entry.code),
    );
  } catch (error) {
    pushError('unprobeable_approved_asset', `Approved asset cannot be decoded: ${asset.file}`, {
      asset_id: asset.id,
      file: asset.file,
      detail: error.message,
    });
  }

  if (asset.blur) {
    const blurPath = abs(asset.blur);
    if (!fs.existsSync(blurPath)) {
      pushError('missing_blur', `Approved asset blur is missing: ${asset.blur}`, {
        asset_id: asset.id,
        file: asset.file,
        blur: asset.blur,
      });
      result.checks.blur = false;
    } else {
      try {
        const blurStat = fs.statSync(blurPath);
        if (!blurStat.isFile() || blurStat.size <= 0) throw new Error('empty blur file');
        const blurMedia = await probeImage(blurPath);
        result.blur_media = {...blurMedia, size_bytes: blurStat.size};
        result.checks.blur = true;
      } catch (error) {
        pushError('invalid_blur', `Approved asset blur cannot be decoded: ${asset.blur}`, {
          asset_id: asset.id,
          file: asset.file,
          blur: asset.blur,
          detail: error.message,
        });
        result.checks.blur = false;
      }
    }
  } else if (asset.needs_blur) {
    pushError('missing_blur_reference', `Approved photo has no blur path: ${asset.file}`, {
      asset_id: asset.id,
      file: asset.file,
    });
    result.checks.blur = false;
  }

  try {
    const link = fs.lstatSync(fullPath);
    result.symbolic_link = link.isSymbolicLink();
  } catch {
    result.symbolic_link = false;
  }

  return result;
}

const validatedAssets = [];
for (const asset of assets) validatedAssets.push(await validateAsset(asset));

const qrAsset = validatedAssets.find((asset) => asset.role === 'qr_only');
if (!ctaManifest?.destination_url) {
  pushError('missing_qr_destination', 'CTA manifest has no destination_url.');
} else {
  const standalone = ctaManifest?.qr_checks?.standalone;
  const fullCard = ctaManifest?.qr_checks?.full_card;
  if (standalone !== ctaManifest.destination_url || fullCard !== ctaManifest.destination_url) {
    pushError('qr_destination_mismatch', 'QR verification targets do not match CTA destination_url.', {
      destination_url: ctaManifest.destination_url,
      standalone,
      full_card: fullCard,
    });
  }
}
if (!qrAsset) pushError('missing_approved_qr', 'CTA manifest contains no approved standalone QR asset.');

const thumbnailAsset = validatedAssets.find((asset) => asset.role === 'thumbnail');
if (!thumbnailAsset) pushError('missing_thumbnail', 'No thumbnail was normalized for stage 1.5.');

const avatarAsset = validatedAssets.find((asset) => asset.role === 'avatar');
const avatarChecks = {
  preflight_present: Boolean(avatarPreflight),
  motion_status: avatarPreflight?.motion_gate?.status ?? null,
  sync_status: avatarPreflight?.sync_gate?.status ?? null,
  audio_removed: avatarPreflight?.video?.audio_removed ?? null,
  media_file: avatarAsset?.file ?? null,
  media_valid: Boolean(avatarAsset?.checks?.exists && avatarAsset?.checks?.nonempty && avatarAsset?.checks?.dimensions),
  farm_packaging_status: avatarAsset?.symbolic_link ? 'pending_materialize_symlink' : 'ready_regular_file',
};

if (avatarPreflight) {
  if (!isApproved({status: avatarPreflight.motion_gate?.status})) {
    pushError('avatar_motion_not_approved', 'Avatar motion gate is not pass/approved.', {
      status: avatarPreflight.motion_gate?.status ?? null,
    });
  }
  if (avatarPreflight.video?.audio_removed !== true) {
    pushError('avatar_audio_not_removed', 'Optimized avatar must be silent before master WAV sync.');
  }
  if (avatarPreflight.sync_gate?.status !== 'pending_master_wav') {
    pushWarning('avatar_sync_state_unexpected', 'Avatar sync gate is not pending_master_wav.', {
      status: avatarPreflight.sync_gate?.status ?? null,
    });
  }
  if (avatarAsset?.symbolic_link) {
    pushWarning(
      'avatar_farm_materialization_pending',
      'Avatar project link is a valid symlink now but must be materialized before the FARM package is built.',
      {file: avatarAsset.file},
    );
  }
}

const optionalMissing = sourceState
  .filter((entry) => !entry.required && !entry.exists)
  .map((entry) => entry.path);

const countBy = (field) => Object.fromEntries(
  [...new Set(validatedAssets.map((asset) => asset[field] ?? 'unknown'))]
    .sort()
    .map((value) => [value, validatedAssets.filter((asset) => (asset[field] ?? 'unknown') === value).length]),
);

const counts = {
  approved_assets: validatedAssets.length,
  by_kind: countBy('kind'),
  by_role: countBy('role'),
  approved_photos_requiring_blur: validatedAssets.filter((asset) => asset.needs_blur).length,
  rejected_excluded: rejectedExcluded.length,
  non_approved_excluded: nonApprovedExcluded.length,
  approved_non_asset_decisions: approvedWithoutFile.length,
  blocking_errors: errors.length,
  warnings: warnings.length,
};

const assetManifest = {
  slug,
  stage: '1.5-assets',
  generated_at: new Date().toISOString(),
  timing_status: 'pending_master_wav',
  approval_filter: 'Only pass*/approved* validation, verdict, or status entries are normalized; explicit reject/fail always wins.',
  sources: sourceState,
  optional_audits_missing: optionalMissing,
  counts,
  rejected_excluded: rejectedExcluded,
  non_approved_excluded: nonApprovedExcluded,
  approved_non_asset_decisions: approvedWithoutFile,
  assets: validatedAssets,
};

const preflight = {
  slug,
  stage: '1.5-assets',
  generated_at: new Date().toISOString(),
  status: errors.length === 0 ? 'pass' : 'fail',
  timing_status: 'pending_master_wav',
  non_blocking_pending: ['master_wav', 'whisper_transcript', 'millisecond_beatsheet', 'build', 'farm_render'],
  counts,
  checks: {
    approved_assets: {
      status: errors.some((entry) => entry.asset_id) ? 'fail' : 'pass',
      validated: validatedAssets.length,
    },
    thumbnail: {
      status: thumbnailAsset?.checks?.exists && thumbnailAsset?.checks?.nonempty && thumbnailAsset?.checks?.dimensions ? 'pass' : 'fail',
      file: thumbnailAsset?.file ?? null,
    },
    qr: {
      status: qrAsset && !errors.some((entry) => entry.code.startsWith('qr_') || entry.code === 'missing_approved_qr') ? 'pass' : 'fail',
      file: qrAsset?.file ?? null,
      destination_url: ctaManifest?.destination_url ?? null,
    },
    avatar: avatarChecks,
    timing: {
      status: 'pending_master_wav',
      blocking_stage15: false,
    },
  },
  blocking_errors: errors,
  warnings,
  outputs: {
    asset_manifest: rel(manifestPath),
    preflight: rel(preflightPath),
  },
};

fs.mkdirSync(outputDir, {recursive: true});
fs.writeFileSync(manifestPath, `${JSON.stringify(assetManifest, null, 2)}\n`, 'utf8');
fs.writeFileSync(preflightPath, `${JSON.stringify(preflight, null, 2)}\n`, 'utf8');

console.log(JSON.stringify({
  slug,
  status: preflight.status,
  timing_status: preflight.timing_status,
  approved_assets: counts.approved_assets,
  rejected_excluded: counts.rejected_excluded,
  blocking_errors: counts.blocking_errors,
  warnings: counts.warnings,
  optional_audits_missing: optionalMissing,
  manifest: rel(manifestPath),
  preflight: rel(preflightPath),
}, null, 2));

if (errors.length > 0) process.exitCode = 1;
