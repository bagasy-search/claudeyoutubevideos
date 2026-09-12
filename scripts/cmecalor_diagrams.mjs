import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const outDir = path.resolve('public/img/cmecalor');
fs.mkdirSync(outDir, {recursive: true});

const W = 1920;
const H = 1080;
const C = {
  bg: '#10161d',
  panel: '#1b2631',
  panel2: '#243340',
  ink: '#f7f4eb',
  muted: '#b9c4ca',
  heat: '#ffb21c',
  orange: '#ff6b35',
  safe: '#54d18b',
  danger: '#f35b66',
  line: '#526370',
};

const esc = (s) => String(s).replace(/[&<>]/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]));
const text = (x, y, value, size=50, weight=700, fill=C.ink, anchor='start') =>
  `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${esc(value)}</text>`;
const line = (x1,y1,x2,y2,stroke=C.line,width=8) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round"/>`;
const rounded = (x,y,w,h,fill=C.panel,stroke='none',sw=0,r=30) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const arrow = (x1,y1,x2,y2,color=C.heat) => `${line(x1,y1,x2-26,y2,color,10)}<path d="M ${x2-34} ${y2-22} L ${x2} ${y2} L ${x2-34} ${y2+22} Z" fill="${color}"/>`;
const check = (x,y,color=C.safe) => `<circle cx="${x}" cy="${y}" r="32" fill="${color}"/><path d="M ${x-15} ${y} l 11 13 l 23 -29" fill="none" stroke="#0c1c14" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`;
const cross = (x,y,color=C.danger) => `<circle cx="${x}" cy="${y}" r="32" fill="${color}"/>${line(x-12,y-12,x+12,y+12,'#2b0b0e',8)}${line(x+12,y-12,x-12,y+12,'#2b0b0e',8)}`;
const fan = (cx,cy,s=1,color=C.muted) => `<g transform="translate(${cx} ${cy}) scale(${s})"><circle r="22" fill="${color}"/><path d="M 0 -20 C 40 -78 90 -46 62 -8 C 42 15 16 7 0 0 Z M 18 10 C 85 19 82 76 35 70 C 8 67 1 42 0 20 Z M -18 10 C -47 72 -99 47 -80 2 C -68 -23 -41 -19 -20 -10 Z" fill="${color}" opacity=".9"/><circle r="10" fill="${C.bg}"/></g>`;
const flame = (cx,cy,s=1) => `<path d="M ${cx} ${cy+80*s} C ${cx-75*s} ${cy+42*s},${cx-54*s} ${cy-22*s},${cx-10*s} ${cy-75*s} C ${cx-5*s} ${cy-25*s},${cx+55*s} ${cy-25*s},${cx+32*s} ${cy-90*s} C ${cx+110*s} ${cy-30*s},${cx+98*s} ${cy+55*s},${cx} ${cy+80*s} Z" fill="${C.orange}"/><path d="M ${cx} ${cy+64*s} C ${cx-32*s} ${cy+35*s},${cx-12*s} ${cy},${cx+5*s} ${cy-30*s} C ${cx+45*s} ${cy+12*s},${cx+40*s} ${cy+48*s},${cx} ${cy+64*s} Z" fill="${C.heat}"/>`;
const battery = (x,y,w=210,h=120,level=.7) => `<g>${rounded(x,y,w,h,C.panel2,C.muted,5,20)}<rect x="${x+w}" y="${y+h*.34}" width="18" height="${h*.32}" rx="5" fill="${C.muted}"/><rect x="${x+16}" y="${y+16}" width="${Math.max(0,(w-32)*level)}" height="${h-32}" rx="10" fill="${level<.25?C.danger:C.safe}"/></g>`;
const furnace = (x,y,w=220,h=280,active=true) => `<g>${rounded(x,y,w,h,'#d7dde0','#8f9da5',6,18)}<rect x="${x+30}" y="${y+30}" width="${w-60}" height="68" rx="10" fill="#394954"/>${active?flame(x+w/2,y+67,.34):''}<circle cx="${x+w/2}" cy="${y+192}" r="62" fill="#53636e"/>${fan(x+w/2,y+192,.62,'#b9c4ca')}</g>`;

const frame = (eyebrow, title, body) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="1920" height="1080" fill="${C.bg}"/>
  <rect width="1920" height="18" fill="${C.heat}"/>
  ${text(110,105,eyebrow.toUpperCase(),28,800,C.heat)}
  ${text(110,178,title,66,800,C.ink)}
  ${body}
  <circle cx="1810" cy="98" r="18" fill="${C.heat}"/><circle cx="1760" cy="98" r="10" fill="${C.orange}"/>
</svg>`;

const diagrams = {
  'dg_cmec_a_016': frame('Los cuatro datos', 'Antes de elegir el respaldo', `
    ${rounded(110,260,390,600)}${rounded(540,260,390,600)}${rounded(970,260,390,600)}${rounded(1400,260,410,600)}
    ${text(305,365,'W',92,900,C.heat,'middle')}${text(735,365,'↗',92,900,C.orange,'middle')}${text(1165,365,'%',92,900,C.safe,'middle')}${battery(1505,292,200,105,.72)}
    ${text(305,500,'POTENCIA',42,800,C.ink,'middle')}${text(305,555,'EN MARCHA',42,800,C.ink,'middle')}
    ${text(735,500,'PICO DE',42,800,C.ink,'middle')}${text(735,555,'ARRANQUE',42,800,C.ink,'middle')}
    ${text(1165,500,'CICLO DE',42,800,C.ink,'middle')}${text(1165,555,'TRABAJO',42,800,C.ink,'middle')}
    ${text(1605,500,'CAPACIDAD',42,800,C.ink,'middle')}${text(1605,555,'ÚTIL',42,800,C.ink,'middle')}
    ${text(305,735,'Consumo estable',30,500,C.muted,'middle')}${text(735,735,'El salto al encender',30,500,C.muted,'middle')}${text(1165,735,'Cuánto tiempo trabaja',30,500,C.muted,'middle')}${text(1605,735,'Lo realmente disponible',30,500,C.muted,'middle')}
  `),
  'dg_cmec_b_002': frame('Ejemplo medido', 'El ventilador consume 420 W', `
    ${rounded(130,270,1660,650)}${furnace(260,430,300,380,true)}${fan(790,590,1.15,C.heat)}
    ${arrow(985,590,1190,590,C.heat)}${rounded(1210,410,420,300,C.panel2,C.heat,6,28)}
    ${text(1420,565,'420 W',102,900,C.heat,'middle')}${text(1420,645,'VENTILADOR ACTIVO',32,700,C.ink,'middle')}
    ${text(790,810,'Electricidad para mover el aire',34,600,C.muted,'middle')}
  `),
  'dg_cmec_b_003': frame('Capacidad anunciada', '1024 Wh no llegan completos al enchufe', `
    ${rounded(100,290,1720,610)}${battery(180,475,300,170,1)}${text(330,700,'1024 Wh',48,900,C.ink,'middle')}
    ${arrow(520,560,700,560)}${rounded(720,430,250,260,C.panel2)}${text(845,525,'INVERSOR',36,800,C.ink,'middle')}${text(845,590,'consume',31,500,C.muted,'middle')}
    ${arrow(1000,560,1180,560)}${rounded(1200,430,250,260,C.panel2)}${text(1325,525,'FRÍO',42,800,C.ink,'middle')}${text(1325,590,'reduce',31,500,C.muted,'middle')}
    ${arrow(1480,560,1620,560)}${battery(1630,490,110,75,.45)}${text(1685,700,'RESERVA',30,800,C.ink,'middle')}
  `),
  'dg_cmec_b_007': frame('Lectura', 'Tres preguntas, una decisión', `
    ${rounded(100,255,535,670)}${rounded(692,255,535,670)}${rounded(1284,255,535,670)}
    ${text(367,340,'1',60,900,C.heat,'middle')}${text(959,340,'2',60,900,C.heat,'middle')}${text(1551,340,'3',60,900,C.heat,'middle')}
    ${text(367,415,'¿QUÉ PRODUCE',34,800,C.ink,'middle')}${text(367,460,'EL CALOR?',34,800,C.ink,'middle')}
    ${text(367,560,'Gas',36,600,C.muted,'middle')}${text(367,625,'Combustible',36,600,C.muted,'middle')}${text(367,690,'Electricidad',36,600,C.muted,'middle')}${flame(367,795,.55)}
    ${text(959,415,'¿QUÉ NECESITA',34,800,C.ink,'middle')}${text(959,460,'CORRIENTE?',34,800,C.ink,'middle')}
    ${text(959,560,'Control',36,600,C.muted,'middle')}${text(959,625,'Ventilador',36,600,C.muted,'middle')}${text(959,690,'Bomba',36,600,C.muted,'middle')}${text(959,755,'Resistencia',36,600,C.muted,'middle')}
    ${text(1551,415,'¿QUÉ RESPALDO',34,800,C.ink,'middle')}${text(1551,460,'TIENE SENTIDO?',34,800,C.ink,'middle')}${battery(1446,545,210,120,.72)}${text(1551,725,'Sólo la carga',36,700,C.safe,'middle')}${text(1551,780,'que necesitas',36,700,C.safe,'middle')}
  `),
  'dg_cmec_b_009': frame('Tres controles', 'La cuenta funciona sólo si pasan los tres', `
    ${rounded(100,260,535,650)}${rounded(692,260,535,650)}${rounded(1284,260,535,650)}
    ${text(367,350,'AUTONOMÍA',38,900,C.heat,'middle')}${text(367,500,'CAPACIDAD ÚTIL',31,700,C.ink,'middle')}${line(220,540,514,540,C.muted,4)}${text(367,595,'PROMEDIO REAL',31,700,C.ink,'middle')}${text(367,690,'=',50,700,C.muted,'middle')}${text(367,770,'HORAS',48,900,C.safe,'middle')}
    ${text(959,350,'ARRANQUE',38,900,C.heat,'middle')}${text(959,500,'PICO DISPONIBLE',31,700,C.ink,'middle')}${text(959,585,'>',70,900,C.safe,'middle')}${text(959,680,'PICO MEDIDO',31,700,C.ink,'middle')}${check(959,790)}
    ${text(1551,350,'CONEXIÓN',38,900,C.heat,'middle')}${text(1420,520,'RED',34,800,C.ink,'middle')}${text(1680,520,'RESPALDO',34,800,C.ink,'middle')}${line(1420,570,1680,570,C.danger,10)}${cross(1550,570)}${text(1551,690,'FÍSICAMENTE',33,700,C.muted,'middle')}${text(1551,735,'AISLADOS',42,900,C.safe,'middle')}
  `),
  'dg_cmec_b_010': frame('Lista de salida', 'Si una casilla falla, no está listo', `
    ${rounded(170,285,1580,590)}
    ${rounded(260,385,420,360,C.panel2)}${rounded(750,385,420,360,C.panel2)}${rounded(1240,385,420,360,C.panel2)}
    ${check(470,485)}${check(960,485)}${check(1450,485)}
    ${text(470,615,'AUTONOMÍA',43,900,C.ink,'middle')}${text(960,615,'ARRANQUE',43,900,C.ink,'middle')}${text(1450,615,'AISLAMIENTO',43,900,C.ink,'middle')}
    ${text(470,690,'¿Dura lo necesario?',27,500,C.muted,'middle')}${text(960,690,'¿Supera el pico?',27,500,C.muted,'middle')}${text(1450,690,'¿Separa las fuentes?',27,500,C.muted,'middle')}
  `),
  'dg_cmec_b_013': frame('Ciclo completo', 'La calefacción debe superar cada paso', `
    ${rounded(85,300,1750,500)}
    ${rounded(120,420,280,230,C.panel2)}${rounded(460,420,280,230,C.panel2)}${rounded(800,420,280,230,C.panel2)}${rounded(1140,420,280,230,C.panel2)}${rounded(1480,420,280,230,C.panel2)}
    ${text(260,500,'1',46,900,C.heat,'middle')}${text(600,500,'2',46,900,C.heat,'middle')}${text(940,500,'3',46,900,C.heat,'middle')}${text(1280,500,'4',46,900,C.heat,'middle')}${text(1620,500,'5',46,900,C.heat,'middle')}
    ${text(260,585,'TERMOSTATO',29,800,C.ink,'middle')}${text(600,565,'EXTRACTOR',29,800,C.ink,'middle')}${text(600,605,'ARRANCA',29,800,C.ink,'middle')}${text(940,585,'IGNICIÓN',29,800,C.ink,'middle')}${text(1280,565,'LLAMA',29,800,C.ink,'middle')}${text(1280,605,'CONFIRMADA',29,800,C.ink,'middle')}${text(1620,565,'VENTILADOR',29,800,C.ink,'middle')}${text(1620,605,'PRINCIPAL',29,800,C.ink,'middle')}
    ${arrow(400,535,460,535)}${arrow(740,535,800,535)}${arrow(1080,535,1140,535)}${arrow(1420,535,1480,535)}
  `),
  'dg_cmec_b_018': frame('Mismos vatios, distinto resultado', 'El número no garantiza el arranque', `
    ${rounded(110,270,805,650)}${rounded(1005,270,805,650)}
    ${text(510,365,'FUENTE A',40,900,C.ink,'middle')}${text(1405,365,'FUENTE B',40,900,C.ink,'middle')}
    ${battery(250,435,230,130,.8)}${furnace(610,405,190,250,true)}${arrow(500,510,600,510,C.safe)}${check(510,750)}${text(510,835,'ARRANCA',42,900,C.safe,'middle')}
    ${battery(1145,435,230,130,.8)}${furnace(1505,405,190,250,false)}${arrow(1395,510,1495,510,C.danger)}${cross(1405,750)}${text(1405,815,'ENCIENDE LA PANTALLA',29,800,C.muted,'middle')}${text(1405,855,'Y SE BLOQUEA',38,900,C.danger,'middle')}
    ${text(960,950,'Misma cifra de vatios',34,700,C.heat,'middle')}
  `),
};

for (const [name, svg] of Object.entries(diagrams)) {
  const png = path.join(outDir, `${name}.png`);
  const blur = path.join(outDir, `${name}_blur.jpg`);
  await sharp(Buffer.from(svg)).png().toFile(png);
  await sharp(png).resize(48, 27, {fit: 'fill'}).blur(2.2).resize(W, H, {kernel: 'nearest'}).jpeg({quality: 72}).toFile(blur);
}

console.log(JSON.stringify({ok:true, diagrams:Object.keys(diagrams).length, outDir}, null, 2));
