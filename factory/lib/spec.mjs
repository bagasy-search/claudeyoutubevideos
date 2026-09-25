// spec.mjs — el CONTRATO de un video. Todo lo específico de un video vive acá, nunca en un script clonado.
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./env.mjs";
import { assertSlug } from "./paths.mjs";

export const SCHEMA = {
  slug: { type: "string", required: true },
  canal: { type: "string", required: true },                    // clave de factory/styles/<canal>.json
  modo: { type: "string", required: true, enum: ["avatar", "narrador"] },
  idioma: { type: "string", required: true, enum: ["es", "en", "pt"] },
  guion: { type: "string", required: true },                    // ruta al .txt (relativa a video2 o absoluta)
  titulo: { type: "string", required: false },
  voz: { type: "object", required: true, props: { id: { type: "string", required: true }, blockChars: { type: "number", required: false } } },
  avatar: { type: "object", required: false, props: { face: { type: "string", required: true }, ref: { type: "string", required: false }, prompt: { type: "string", required: false } } },
  cta: { type: "object", required: true, props: { head: { type: "string", required: true }, sub: { type: "string", required: false }, ancla: { type: "string", required: true }, landing: { type: "string", required: false }, qr: { type: "string", required: false } } },
  bagasy: { type: "object", required: false, props: { channelKey: { type: "string", required: true }, cardId: { type: "string", required: true } } },
  ctas: { type: "array", required: false },                     // CTA del MEDIO: [{ancla, head, sub?, qr?, durS?}]; el de cierre es `cta`
  ambiente: { type: "string", required: false },                 // cama de ambiente bajo todo el video (ruta en public/)
  secciones: { type: "array", required: false },                // [[NOMBRE, "frase ancla"], ...]
  overrides: { type: "object", required: false },               // perillas del estilo por video (auditables)
  fx: { type: "object", required: false },                      // compositing en ventanas de avatar: {pNNN: {kind: detras|orbita, at?, durS?, props}}
  hook: { type: "object", required: false },                    // edición del primer minuto: {cortes, over, sfx, camas} en segundos del máster
};

function check(obj, schema, where, errs) {
  for (const [k, def] of Object.entries(schema)) {
    const v = obj?.[k];
    if (v === undefined || v === null || v === "") { if (def.required) errs.push(`${where}${k}: falta`); continue; }
    const t = Array.isArray(v) ? "array" : typeof v;
    if (t !== def.type) { errs.push(`${where}${k}: es ${t}, se esperaba ${def.type}`); continue; }
    if (def.enum && !def.enum.includes(v)) errs.push(`${where}${k}: "${v}" no está en ${def.enum.join("|")}`);
    if (def.props) check(v, def.props, `${where}${k}.`, errs);
  }
  for (const k of Object.keys(obj || {})) if (!schema[k]) errs.push(`${where}${k}: campo desconocido (¿typo?)`);
}

export function validateSpec(spec) {
  const errs = [];
  check(spec, SCHEMA, "", errs);
  try { assertSlug(spec?.slug); } catch (e) { errs.push(e.message); }
  if (spec?.modo === "avatar" && !spec.avatar) errs.push("modo=avatar exige avatar.face");
  return errs;
}

export function loadStyle(canal) {
  const f = path.join(ROOT, "factory", "styles", `${canal}.json`);
  if (!fs.existsSync(f)) throw new Error(`no existe el estilo ${f}`);
  return JSON.parse(fs.readFileSync(f, "utf8"));
}

export function loadSpec(slug) {
  const f = path.join(ROOT, "factory", "specs", `${slug}.json`);
  if (!fs.existsSync(f)) throw new Error(`no existe el spec ${f} (crealo con: node factory/run.mjs new ${slug} ...)`);
  const spec = JSON.parse(fs.readFileSync(f, "utf8"));
  const errs = validateSpec(spec);
  if (errs.length) throw new Error(`spec ${slug} inválido:\n  - ${errs.join("\n  - ")}`);
  if (spec.slug !== slug) throw new Error(`spec ${f}: slug interno "${spec.slug}" ≠ "${slug}"`);
  const style = loadStyle(spec.canal);
  const abs = (p) => (p && !path.isAbsolute(p) ? path.join(ROOT, p) : p);
  return { ...spec, guion: abs(spec.guion), avatar: spec.avatar ? { ...spec.avatar, face: abs(spec.avatar.face) } : undefined, style: { ...style, ...(spec.overrides || {}) } };
}
