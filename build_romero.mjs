// build_romero.mjs — transforma el plan del DIRECTOR (_v3/truco-romero-joven_plan.json)
// al formato que consume el motor Main (rol/kind/payload por beat + carouselCards),
// idéntico al de secretos. Salida: _v3/truco-romero-joven_plan.build.json
import fs from 'fs';
const SLUG = 'truco-romero-joven';
const plan = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, 'utf8').replace(/^﻿/, ''));
const beats = plan.beats;

// Nombres de las 15 tarjetas del carrusel (uso → nombre corto)
const USE_NAMES = {
  1: 'Tónico facial', 2: 'Vapor facial', 3: 'Cubitos de hielo', 4: 'Contorno de ojos',
  5: 'Enjuague · crecimiento', 6: 'Oscurecer canas', 7: 'Aceite · masaje', 8: 'Caspa y brillo',
  9: 'Piernas y circulación', 10: 'Manchas del cuerpo', 11: 'Aromaterapia · sueño', 12: 'Baño de inmersión',
  13: 'Piel grasa', 14: 'Uñas y cutículas', 15: 'El elixir',
};
const carouselCards = Object.entries(USE_NAMES).map(([i, name]) => ({
  index: String(i).padStart(2, '0'), name,
  image: `img/${SLUG}_uso${i}.jpg`, // se genera aparte; si falta, el motor usa fallback
}));

const num = (t) => { const m = String(t || '').match(/-?\d+(?:[.,]\d+)?/); return m ? Number(m[0].replace(',', '.')) : null; };
const stripQuotes = (t) => String(t || '').replace(/^[“"']|[”"']$/g, '').trim();
const splitItems = (t) => String(t || '').split(/[·✓|]/).map((s) => s.trim()).filter(Boolean);
const asBroll = (b) => `broll/${SLUG}_${b.name}.mp4`;
const asImg = (b) => `img/${SLUG}_${b.name}.jpg`;

// contador de pasos por uso (para ValStep.step/total)
const stepCount = {};
const stepTotalByUse = {};
for (const b of beats) if (b.componente === 'ValStep' && b.uso != null) stepTotalByUse[b.uso] = (stepTotalByUse[b.uso] || 0) + 1;

const out = [];
for (let i = 0; i < beats.length; i++) {
  const b = beats[i];
  const startMs = b.ms;
  const endMs = i + 1 < beats.length ? beats[i + 1].ms : b.ms + Math.round((b.seg || 4) * 1000);
  const texto = (b.texto && b.texto !== '-') ? b.texto : '';
  const kicker = b.uso != null ? `Uso ${b.uso}` : 'Romero';
  const base = { startMs, endMs, dice: b.dice };

  // AVATAR (incluye ValLowerThird como overlay sutil sobre la doctora)
  if (b.tipo === 'avatar' || b.componente === 'ValLowerThird') {
    const pay = {};
    if (b.componente === 'ValLowerThird' || texto) { pay.title = texto || 'Dra. Valeria Alcázar'; pay.kicker = b.componente === 'ValLowerThird' ? '' : ''; }
    out.push({ ...base, role: 'avatar', payload: pay });
    continue;
  }
  // CLIP real
  if (b.tipo === 'clip') { out.push({ ...base, role: 'broll', asset: asBroll(b), payload: { sub: '' } }); continue; }
  // IMAGEN IA
  if (b.tipo === 'imagen') { out.push({ ...base, role: 'presenterAI', asset: asImg(b), payload: {} }); continue; }

  // COMPONENTE
  const c = b.componente;
  if (c === 'ValOilCarousel') {
    const intro = b.uso == null || i < 20; // s_07 (hook) = intro
    out.push({ ...base, role: 'carousel', focus: b.uso != null ? b.uso : 0, intro: b.uso == null });
    continue;
  }
  if (c === 'RosemaryHero-STING') {
    // sustituto premium coherente: ValHero (escena hero del romero, cualquier duración)
    out.push({ ...base, role: 'component', kind: 'ValHero', payload: { kicker, title: texto || 'El romero', hot: [], sub: b.muestra, bigTitle: /elixir|romero/i.test(texto) ? undefined : undefined } });
    continue;
  }
  if (c === 'ValStat') {
    const v = num(texto);
    if (v != null) {
      const suffix = /años/i.test(texto) ? ' años' : /min/i.test(texto) ? ' min' : /%/.test(texto) ? '%' : '';
      const prefix = /^-/.test(texto.trim()) ? '−' : '';
      out.push({ ...base, role: 'component', kind: 'ValStat', payload: { kicker, value: Math.abs(v), prefix, suffix, label: texto.replace(/[-−]?\d+[.,]?\d*\s*(años|min|%)?/i, '').trim() || b.muestra, sub: '' } });
    } else {
      // sin número → ValHero como tarjeta de énfasis
      out.push({ ...base, role: 'component', kind: 'ValHero', payload: { kicker, title: texto, hot: [], sub: b.muestra } });
    }
    continue;
  }
  if (c === 'ValStep') {
    stepCount[b.uso] = (stepCount[b.uso] || 0) + 1;
    out.push({ ...base, role: 'component', kind: 'ValStep', payload: { step: stepCount[b.uso], total: stepTotalByUse[b.uso] || 1, title: texto || b.muestra, hot: [], sub: b.muestra } });
    continue;
  }
  if (c === 'ValMolecule' || c === 'pizarra') {
    out.push({ ...base, role: 'component', kind: 'ValMolecule', payload: { kicker: 'Por qué funciona', title: texto || 'Antioxidantes', hot: [], sub: b.muestra, centerLabel: 'Romero', nodes: splitItems(texto).slice(0, 4).map((label) => ({ label })) } });
    continue;
  }
  if (c === 'ValChecklist') {
    out.push({ ...base, role: 'component', kind: 'ValChecklist', payload: { kicker, title: (texto.split('·')[0] || 'En resumen').trim(), items: splitItems(texto) } });
    continue;
  }
  if (c === 'ValBeforeAfter') {
    const parts = texto.split('|').map((s) => s.trim());
    out.push({ ...base, role: 'component', kind: 'ValBeforeAfter', payload: { kicker, title: b.muestra, labelA: parts[0] || 'Antes', labelB: parts[1] || 'Después' } });
    continue;
  }
  if (c === 'ValQuote') {
    out.push({ ...base, role: 'component', kind: 'ValQuote', payload: { kicker: 'Dra. Valeria Alcázar', quote: stripQuotes(texto) || b.muestra, author: 'Dra. Valeria Alcázar', role: 'Medicina estética' } });
    continue;
  }
  if (c === 'ValHero') {
    out.push({ ...base, role: 'component', kind: 'ValHero', payload: { kicker, title: texto || 'El romero', hot: [], sub: b.muestra } });
    continue;
  }
  if (c === 'ValCta') {
    out.push({ ...base, role: 'component', kind: 'ValCta', payload: { kicker: 'Antes de irse', title: texto, sub: b.muestra } });
    continue;
  }
  if (c === 'ValFullShot') {
    out.push({ ...base, role: 'presenterAI', asset: `img/${SLUG}_recap_rostro.jpg`, payload: { kicker, title: texto, sub: b.muestra } });
    continue;
  }
  // fallback
  out.push({ ...base, role: 'component', kind: 'ValHero', payload: { kicker, title: texto || b.muestra, hot: [] } });
}

const lastEnd = out[out.length - 1].endMs;
const build = { slug: SLUG, fps: 30, totalMs: lastEnd, carouselCards, beats: out };
fs.writeFileSync(`_v3/${SLUG}_plan.build.json`, JSON.stringify(build, null, 1));
// stats
const byRole = {}, byKind = {};
for (const b of out) { byRole[b.role] = (byRole[b.role] || 0) + 1; if (b.kind) byKind[b.kind] = (byKind[b.kind] || 0) + 1; }
console.log('beats:', out.length, '| totalMs:', lastEnd, '| frames:', Math.round(lastEnd / 1000 * 30));
console.log('roles:', JSON.stringify(byRole));
console.log('kinds:', JSON.stringify(byKind));
console.log('carouselCards:', carouselCards.length);
