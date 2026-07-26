/**
 * ============================================================================
 * Main_vn2vhn3n8eqs — "Tu PIEL Arrugada Tiene SOLUCIÓN en tu Cocina (7 Aceites)"
 * Canal: Dr Valler · kit: Dr. Federer Fluid (dark-cinematic)
 * GENERADO por scripts/build_vn2vhn3n8eqs.mjs — no editar a mano.
 * ----------------------------------------------------------------------------
 * ARQUITECTURA (la de FedererFluid):
 *   L0 · UN solo <OffthreadVideo> del avatar, PERSISTENTE: nunca se desmonta,
 *        de ahí sale el audio y por eso no glitchea en ningún corte.
 *   L1 · lower-thirds sutiles sobre los beats de avatar.
 *   L2 · escenas de profundidad (avatar oculto) = componentes de FedererKit,
 *        cada una con SOLAPE de whip → sin cortes duros.
 * 377 beats · 245 escenas de profundidad · media 3.35s
 * ============================================================================
 */
import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  FedChapter,
  FedHero,
  FedStat,
  FedQuote,
  FedMolecule,
  FedStep,
  FedBeforeAfter,
  FedLowerThird,
  FedChecklist,
  FedCta,
  FedFullShot,
  FedOilCarousel,
  type FedCarouselCard,
} from '../FedererKit';
import {FedBrickWall} from '../FedBrickWall_vn2vhn3n8eqs';
import {FedRivet} from '../FedRivet_vn2vhn3n8eqs';
import {FedTrial} from '../FedTrial_vn2vhn3n8eqs';
import {FedLabelScan} from '../FedLabelScan_vn2vhn3n8eqs';
import {FedSplitFace} from '../FedSplitFace_vn2vhn3n8eqs';
import {FedSeal} from '../FedSeal_vn2vhn3n8eqs';
import {FedOilBars} from '../FedOilBars_vn2vhn3n8eqs';
import {FedBlacklist} from '../FedBlacklist_vn2vhn3n8eqs';
import {FedRoutineRing} from '../FedRoutineRing_vn2vhn3n8eqs';

export const TOTAL_FRAMES_VN2 = 37908;
const ACCENT = '#E9B44C';
const AVATAR = staticFile('vn2vhn3n8eqs_opt.mp4');
const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const CARDS: FedCarouselCard[] = [
  {
    "image": staticFile('img/vn2_card_1_girasol.png'),
    "index": "ACEITE 1",
    "name": "Girasol alto linoleico",
    "tag": "el campeón olvidado"
  },
  {
    "image": staticFile('img/vn2_card_2_coco.png'),
    "index": "ACEITE 2",
    "name": "Coco virgen",
    "tag": "el único probado en piel madura"
  },
  {
    "image": staticFile('img/vn2_card_3_rosamosqueta.png'),
    "index": "ACEITE 3",
    "name": "Rosa mosqueta",
    "tag": "la mejor fórmula, la peor prueba"
  },
  {
    "image": staticFile('img/vn2_card_4_argan.png'),
    "index": "ACEITE 4",
    "name": "Argán",
    "tag": "el de la elasticidad medida"
  },
  {
    "image": staticFile('img/vn2_card_5_jojoba.png'),
    "index": "ACEITE 5",
    "name": "Jojoba",
    "tag": "lo más parecido a su propia grasa"
  },
  {
    "image": staticFile('img/vn2_card_6_sesamo.png'),
    "index": "ACEITE 6",
    "name": "Sésamo",
    "tag": "el aceite del masaje"
  },
  {
    "image": staticFile('img/vn2_card_7_almendras.png'),
    "index": "ACEITE 7",
    "name": "Almendras dulces",
    "tag": "el clásico de la abuela"
  }
];

/* props de cada beat (rutas literales de assets: el gate de densidad las cuenta acá) */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const P: any[] = [
  /* b000 0s */ {},
  /* b001 2.6s */ {"src":staticFile('broll/vn2vhn3n8eqs/vn2_a01.mp4'),"video":true,"mood":"warmdark","ken":"out"},
  /* b002 5.4s */ {"kicker":"LO QUE NADIE LE DIJO","title":"Mejor que la crema más cara","hot":["más cara"],"sub":"y ya lo tiene en su alacena","image":staticFile('img/vn2_a02.png'),"mood":"cool","side":"right"},
  /* b003 8.4s */ {"name":"Dr. Valler","role":"Medicina interna","topic":"El octavo aceite","avatarSrc":null},
  /* b004 11.4s */ {"src":staticFile('broll/vn2vhn3n8eqs/vn2_a03.mp4'),"video":true,"mood":"warmdark","ken":"in"},
  /* b005 14.4s */ {"kicker":"MIENTRAS TANTO","title":"Se la está rompiendo","hot":["rompiendo"],"sub":"usted cree que se la está cuidando","image":staticFile('img/vn2_a04.png'),"mood":"warmdark","side":"left"},
  /* b006 17.7s */ {},
  /* b007 20.9s */ {"kicker":"LA EVIDENCIA","index":"2013","title":"Pediatric Dermatology","sub":"ensayo controlado en humanos","mood":"science"},
  /* b008 24.1s */ {"kicker":"UNIVERSIDAD DE SHEFFIELD","value":19,"suffix":"","prefix":"","decimals":0,"label":"ADULTOS MEDIDOS","sub":"equipo del Dr. Simon Danby","image":staticFile('img/vn2_a05.png'),"mood":"science"},
  /* b009 29.2s */ {"kicker":"EL PROTOCOLO","title":"6 gotas por antebrazo","hot":["6 gotas"],"items":["Dos veces por día","Durante cuatro semanas","Un aceite distinto en cada brazo"],"mood":"science"},
  /* b010 33.8s */ {"src":staticFile('broll/vn2vhn3n8eqs/vn2_a06.mp4'),"video":true,"mood":"warmdark","ken":"left"},
  /* b011 36.5s */ {"src":staticFile('broll/vn2vhn3n8eqs/vn2_a07.mp4'),"video":true,"mood":"warmdark","ken":"right"},
  /* b012 39s */ {"kicker":"RESULTADO A 4 SEMANAS","title":"El brazo del oliva perdió MÁS agua","hot":["MÁS agua"],"sub":"que antes de empezar · con significación estadística","image":staticFile('img/vn2_a08.png'),"mood":"warmdark","side":"left"},
  /* b013 45s */ {"kicker":"EN LOS DOS GRUPOS","title":"No solo en la piel delicada","hot":["delicada"],"items":["Piel atópica: barrera peor","Piel perfectamente sana: peor también"],"mood":"warmdark"},
  /* b014 49.5s */ {},
  /* b015 51.1s */ {"kicker":"GIRASOL","title":"Ese conservó la barrera","hot":["conservó"],"items":["No perdió agua","No enrojeció","Encima mejoró la hidratación"],"mood":"cool"},
  /* b016 55.6s */ {"name":"Dr. Valler","role":"Medicina interna","topic":"Cuesta creerlo","avatarSrc":null},
  /* b017 57.9s */ {"src":staticFile('broll/vn2vhn3n8eqs/vn2_a09.mp4'),"video":true,"mood":"warmdark","ken":"out"},
  /* b018 62.1s */ {"kicker":"EN LA PIEL SECA","title":"Le desarma la barrera","hot":["desarma"],"sub":"lo mismo que en el plato le hace bien","image":staticFile('img/vn2_a10.png'),"mood":"warmdark","side":"right"},
  /* b019 65.3s */ {"kicker":"EL MÁS BARATO DE LA GÓNDOLA","title":"Y es el que se la protege","hot":["protege"],"sub":"ninguna marca lo publicita jamás","image":staticFile('img/vn2_a11.png'),"mood":"cool","side":"left"},
  /* b020 71.3s */ {"name":"Dr. Valler","role":"Medicina interna","topic":"7 aceites que sí funcionan","avatarSrc":null},
  /* b021 74.4s */ {"kicker":"EN ESTE VIDEO","value":7,"suffix":"","prefix":"","decimals":0,"label":"ACEITES QUE SÍ FUNCIONAN","sub":"cuál sirve para qué, cuántas gotas y en qué orden","mood":"gold","image":staticFile('img/vn2_fb_gold.png')},
  /* b022 77.5s */ {"kicker":"QUÉDESE HASTA EL FINAL","value":90,"suffix":"%","prefix":"","decimals":0,"label":"DE LOS INTENTOS SE ARRUINAN","sub":"y no es por elegir mal el aceite","image":staticFile('img/vn2_a12.png'),"mood":"warmdark"},
  /* b023 82.5s */ {},
  /* b024 84.3s */ {"src":staticFile('broll/vn2vhn3n8eqs/vn2_a13.mp4'),"video":true,"mood":"warmdark","ken":"in"},
  /* b025 89.5s */ {"name":"Dr. Valler","role":"Medicina interna","topic":"Primero, una aclaración","avatarSrc":null},
  /* b026 93s */ {"kicker":"ACLARACIÓN","index":"01","title":"Dos cosas distintas","sub":"pasan en su cara al mismo tiempo","mood":"cool"},
  /* b027 98.3s */ {},
  /* b028 102.6s */ {"kicker":"ARRIBA · CÉLULAS MUERTAS","title":"Opaca, áspera, apagada","hot":["apagada"],"items":["Se ve opaca, sin brillo","Áspera al tacto","Líneas finas como papel de seda arrugado"],"mood":"cool"},
  /* b029 108.5s */ {},
  /* b030 109.7s */ {"name":"Dr. Valler","role":"Medicina interna","topic":"Lo otro: el colágeno","avatarSrc":null},
  /* b031 112.1s */ {"kicker":"DESDE LOS 20 AÑOS","value":1,"suffix":"%","prefix":"","decimals":0,"label":"DE COLÁGENO POR AÑO","sub":"y eso pasa en tejido vivo","mood":"science","image":staticFile('img/vn2_fb_science.png')},
  /* b032 118.1s */ {},
  /* b033 121.1s */ {"src":staticFile('img/vn2_a14.png'),"video":false,"mood":"warmdark","ken":"out"},
  /* b034 124.3s */ {"name":"Dr. Valler","role":"Medicina interna","topic":"Qué sí toca el colágeno","avatarSrc":null},
  /* b035 126.5s */ {"kicker":"LO QUE SÍ LE PROMETO","value":3,"suffix":"","prefix":"","decimals":0,"label":"SEMANAS","sub":"no le borra una arruga: le cambia la superficie","mood":"gold","image":staticFile('img/vn2_fb_gold.png')},
  /* b036 132.1s */ {},
  /* b037 136.4s */ {"kicker":"LA CAPA DE ARRIBA","title":"Deshidratada refleja mal la luz","hot":["refleja mal la luz"],"sub":"y le apaga la cara entera","image":staticFile('img/vn2_a15.png'),"mood":"warmdark","side":"right"},
  /* b038 140.8s */ {"src":staticFile('broll/vn2vhn3n8eqs/vn2_a16.mp4'),"video":true,"mood":"warmdark","ken":"left"},
  /* b039 143.6s */ {"name":"Dr. Valler","role":"Medicina interna","topic":"El principio","avatarSrc":null},
  /* b040 148.1s */ {"theme":"dark","scene":{"cameras":[{"time":0,"fx":32,"fy":14,"z":1.15},{"time":2.4,"fx":24,"fy":44,"z":1.5},{"time":4.4,"fx":60,"fy":44,"z":1.5}],"elements":[{"t":"title","x":5,"y":8,"text":"Su barrera = una pared de ladrillos","start":0.3},{"t":"note","x":24,"y":44,"w":24,"text":"Ladrillos = células muertas","start":2.7,"box":true,"align":"center"},{"t":"arrow","from":[38,46],"to":[48,46],"start":4.3,"curve":-0.25},{"t":"note","x":60,"y":44,"w":24,"text":"Entre ellos: un cemento de grasa","start":4.8,"highlight":true,"align":"center"}]},"nodes":[{"label":"Barrera"},{"label":"Ceramidas"},{"label":"Linoleico"},{"label":"Agua"}]},
  /* b041 153.9s */ {"theme":"dark","scene":{"cameras":[{"time":0,"fx":30,"fy":14,"z":1.15},{"time":1.2,"fx":26,"fy":46,"z":1.55},{"time":2.6,"fx":52,"fy":46,"z":1.55},{"time":3.4,"fx":50,"fy":40,"z":1.05}],"elements":[{"t":"title","x":5,"y":8,"text":"De qué está hecho ese cemento","start":0.2},{"t":"note","x":22,"y":46,"w":20,"text":"1/2 ceramidas","start":1.4,"highlight":true,"align":"center"},{"t":"note","x":50,"y":46,"w":20,"text":"1/4 colesterol","start":2.5,"box":true,"align":"center"},{"t":"note","x":78,"y":46,"w":20,"text":"el resto: ácidos grasos","start":3.2,"box":true,"align":"center"}]},"nodes":[{"label":"Barrera"},{"label":"Ceramidas"},{"label":"Linoleico"},{"label":"Agua"}]},
  /* b042 157.8s */ {"kicker":"EL CEMENTO DE SU PIEL","title":"Tres grasas, una sola pared","hot":["una sola pared"],"sub":"si falta una, la pared filtra","centerLabel":"CEMENTO","nodes":[{"label":"50% ceramidas"},{"label":"25% colesterol"},{"label":"25% ácidos grasos"}],"mood":"science","image":staticFile('img/vn2_fb_science.png')},
  /* b043 161.4s */ {"src":staticFile('broll/vn2vhn3n8eqs/vn2_a17.mp4'),"video":true,"mood":"warmdark","ken":"right"},
  /* b044 165s */ {"kicker":"CEMENTO DESARMADO","title":"Así se siente","hot":["se siente"],"items":["Picazón","Tirantez","La crema se le fue en dos horas"],"mood":"warmdark"},
  /* b045 168.7s */ {},
  /* b046 170.9s */ {"src":staticFile('broll/vn2vhn3n8eqs/vn2_a18.mp4'),"video":true,"mood":"warmdark","ken":"left"},
  /* b047 174.6s */ {"kicker":"NO LO DECIDE","title":"Nada de esto","hot":["Nada"],"items":["El precio","La marca","El aroma","Que diga orgánico"],"mood":"cool"},
  /* b048 178.9s */ {"kicker":"LO QUE SÍ LO DECIDE","title":"La proporción entre dos grasas","hot":["dos grasas"],"sub":"todo el video se juega acá","centerLabel":"PROPORCIÓN","nodes":[{"label":"Ácido linoleico"},{"label":"Ácido oleico"}],"mood":"science","image":staticFile('img/vn2_fb_science.png')},
  /* b049 183.5s */ {},
  /* b050 185.2s */ {"kicker":"ESENCIAL","title":"Su cuerpo no lo fabrica","hot":["no lo fabrica"],"sub":"tiene que entrar de afuera","image":staticFile('img/vn2_a19.png'),"mood":"gold","side":"left"},
  /* b051 188s */ {"theme":"dark","scene":{"cameras":[{"time":0,"fx":28,"fy":13,"z":1.15},{"time":1.2,"fx":20,"fy":46,"z":1.55},{"time":3,"fx":50,"fy":46,"z":1.55},{"time":4.8,"fx":78,"fy":46,"z":1.55},{"time":5.8,"fx":50,"fy":40,"z":1.02}],"elements":[{"t":"title","x":5,"y":8,"text":"Cómo el linoleico remacha la pared","start":0.2},{"t":"note","x":20,"y":46,"w":20,"text":"Entra el linoleico","start":1.4,"box":true,"align":"center"},{"t":"arrow","from":[32,48],"to":[40,48],"start":2.8,"curve":-0.25},{"t":"note","x":50,"y":46,"w":22,"text":"La piel lo engancha a una ceramida gigante","start":3.2,"box":true,"align":"center"},{"t":"arrow","from":[63,48],"to":[70,48],"start":4.6,"curve":-0.25},{"t":"note","x":80,"y":46,"w":20,"text":"Se forma el REMACHE","start":4.9,"highlight":true,"align":"center"},{"t":"lasso","x":80,"y":46,"w":26,"h":22,"start":5.6,"rot":-3}]},"nodes":[{"label":"Barrera"},{"label":"Ceramidas"},{"label":"Linoleico"},{"label":"Agua"}]},
  /* b052 194.5s */ {"kicker":"SIN REMACHE","title":"La pared filtra","hot":["filtra"],"sub":"sin linoleico no hay remache","image":staticFile('img/vn2_a20.png'),"mood":"warmdark","side":"right"},
  /* b053 198.3s */ {},
  /* b054 199.4s */ {"src":staticFile('broll/vn2vhn3n8eqs/vn2_a21.mp4'),"video":true,"mood":"warmdark","ken":"left"},
  /* b055 203.5s */ {"kicker":"SE NORMALIZAN EN","value":4,"suffix":"","prefix":"","decimals":0,"label":"SEMANAS","sub":"aplicando grasas ricas en linoleico","mood":"science","image":staticFile('img/vn2_fb_science.png')},
  /* b056 207s */ {"name":"Dr. Valler","role":"Medicina interna","topic":"El plazo real: 4 semanas","avatarSrc":null},
  /* b057 211.8s */ {"kicker":"EL OTRO LADO","index":"03","title":"Ácido oleico","sub":"hace exactamente lo contrario","mood":"warmdark"},
  /* b058 213.9s */ {"name":"Dr. Valler","role":"Medicina interna","topic":"Potenciador de penetración","avatarSrc":null},
  /* b059 217.2s */ {"theme":"dark","scene":{"cameras":[{"time":0,"fx":28,"fy":13,"z":1.15},{"time":0.9,"fx":24,"fy":48,"z":1.55},{"time":2,"fx":52,"fy":48,"z":1.55},{"time":3,"fx":78,"fy":48,"z":1.55}],"elements":[{"t":"title","x":5,"y":8,"text":"Qué le hace el oleico a la pared","start":0.2},{"t":"note","x":24,"y":48,"w":20,"text":"Desordena las láminas de grasa","start":1,"box":true,"align":"center"},{"t":"arrow","from":[36,50],"to":[43,50],"start":1.9,"curve":-0.25},{"t":"note","x":52,"y":48,"w":18,"text":"Las separa","start":2.1,"box":true,"align":"center"},{"t":"arrow","from":[62,50],"to":[69,50],"start":2.9,"curve":-0.25},{"t":"note","x":79,"y":48,"w":18,"text":"Abre huecos","start":3.1,"fill":true,"align":"center"}]},"nodes":[{"label":"Barrera"},{"label":"Ceramidas"},{"label":"Linoleico"},{"label":"Agua"}]},
  /* b060 221.1s */ {"src":staticFile('broll/vn2vhn3n8eqs/vn2_a23.mp4'),"video":true,"mood":"warmdark","ken":"in"},
  /* b061 225.9s */ {},
  /* b062 229.1s */ {"src":staticFile('img/vn2_a24.png'),"video":false,"mood":"warmdark","ken":"left"},
  /* b063 230.7s */ {"kicker":"ACEITE DE OLIVA","value":83,"suffix":"%","prefix":"hasta ","decimals":0,"label":"ÁCIDO OLEICO","sub":"y muy poco linoleico","image":staticFile('img/vn2_a25.png'),"mood":"warmdark"},
  /* b064 236.5s */ {},
  /* b065 238.7s */ {"src":staticFile('img/vn2_a26.png'),"video":false,"mood":"warmdark","ken":"out"},
  /* b066 242s */ {"kicker":"EL ERROR","title":"Le pide lo contrario de lo que hace","hot":["lo contrario"],"sub":"abrir la puerta en vez de cerrarla","image":staticFile('img/vn2_a27.png'),"mood":"warmdark","side":"right"},
  /* b067 244.6s */ {"name":"Dr. Valler","role":"Medicina interna","topic":"La pregunta incómoda","avatarSrc":null},
  /* b068 246.4s */ {"src":staticFile('broll/vn2vhn3n8eqs/vn2_a28.mp4'),"video":true,"mood":"warmdark","ken":"in"},
  /* b069 250.6s */ {"kicker":"LA PREGUNTA INCÓMODA","quote":"¿Por qué usted nunca vio una publicidad de aceite de girasol para la cara?","author":"","role":"","image":staticFile('img/vn2_a29.png'),"mood":"cool"},
  /* b070 256.3s */ {},
  /* b071 257.7s */ {"kicker":"SIN MARGEN","title":"Nadie construye una marca sobre lo que usted ya tiene","hot":["ya tiene"],"sub":"y usted ya lo tiene en la cocina","image":staticFile('img/vn2_a30.png'),"mood":"cool","side":"left"},
  /* b072 261.9s */ {"kicker":"LA HISTORIA QUE LE VENDEN","title":"Una semilla de un país lejano","hot":["país lejano"],"sub":"y un frasco chiquito","image":staticFile('img/vn2_a31.png'),"mood":"gold","side":"right"},
  /* b073 271s */ {"focus":-1,"intro":true,"kicker":"Los siete","cards":CARDS,"bg":staticFile('img/vn2_bg_kitchen.png')},
  /* b074 276.5s */ {"focus":0,"intro":false,"cards":CARDS,"bg":staticFile('img/vn2_bg_kitchen.png')},
  /* b075 285.8s */ {"kicker":"ACEITE Nº1","title":"Girasol alto linoleico","hot":["alto linoleico"],"sub":"En cualquier supermercado","image":staticFile('img/vn2_fb_gold.png'),"mood":"gold","side":"left"},
  /* b076 290.3s */ {"name":"Dr. Valler","role":"Médico clínico","topic":"Aceite nº1 · Girasol alto linoleico","avatarSrc":null},
  /* b077 293.9s */ {},
  /* b078 296.7s */ {"mood":"cool","src":staticFile('broll/vn2vhn3n8eqs/vn2_b02.mp4'),"video":true,"ken":"left"},
  /* b079 299.7s */ {"mood":"cool","src":staticFile('broll/vn2vhn3n8eqs/vn2_b03.mp4'),"video":true,"ken":"right"},
  /* b080 302.7s */ {"mood":"cool","src":staticFile('img/vn2_b04.png'),"video":false,"ken":"in"},
  /* b081 306.4s */ {"kicker":"HOSPITAL DHAKA SHISHU","value":26,"prefix":"−","suffix":"%","decimals":0,"label":"de mortalidad","sub":"En bebés prematuros","mood":"cool","image":staticFile('img/vn2_fb_cool.png')},
  /* b082 310.5s */ {"kicker":"DÓNDE SE PUBLICÓ","quote":"Un aceite de cocina untado en la piel, moviendo la mortalidad de un bebé.","author":"The Lancet","role":"Ensayo clínico","image":staticFile('img/vn2_b05.png'),"mood":"science"},
  /* b083 313.4s */ {"name":"Dr. Valler","role":"Médico clínico","topic":"The Lancet · barrera cutánea","avatarSrc":null},
  /* b084 316.6s */ {"kicker":"LA BARRERA","title":"No es cosmética","hot":["cosmética"],"sub":"Es un órgano de defensa","steps":["Piel rota = puerta abierta","El linoleico sella la puerta","Menos infección"],"mood":"science","nodes":[{"label":"Barrera"},{"label":"Ceramidas"},{"label":"Linoleico"},{"label":"Agua"}],"image":staticFile('img/vn2_fb_science.png'),"centerLabel":"No es cosmética"},
  /* b085 320.5s */ {},
  /* b086 323.3s */ {"mood":"gold","src":staticFile('broll/vn2vhn3n8eqs/vn2_b06.mp4'),"video":true,"ken":"left"},
  /* b087 325.8s */ {},
  /* b088 328.6s */ {"kicker":"BOTELLA A","title":"Alto linoleico","hot":["linoleico"],"sub":"El común. El que le sirve.","image":staticFile('img/vn2_b07.png'),"mood":"gold","side":"left"},
  /* b089 332.4s */ {"name":"Dr. Valler","role":"Médico clínico","topic":"Alto oleico: la botella de moda","avatarSrc":null},
  /* b090 334.9s */ {"kicker":"BOTELLA B","title":"Alto oleico","hot":["oleico"],"sub":"Aguanta mejor la fritura","image":staticFile('img/vn2_b08.png'),"mood":"warmdark","side":"right"},
  /* b091 337.5s */ {"kicker":"ALTO OLEICO","value":90,"suffix":"%","decimals":0,"label":"de ácido oleico","sub":"Hasta","mood":"warmdark","image":staticFile('img/vn2_fb_warm.png'),"prefix":""},
  /* b092 339.9s */ {"kicker":"ALTO OLEICO","value":10,"suffix":"%","decimals":0,"label":"de linoleico","sub":"Apenas 2 a 10%","mood":"warmdark","image":staticFile('img/vn2_fb_warm.png'),"prefix":""},
  /* b093 342.3s */ {},
  /* b094 344.8s */ {"kicker":"OPUESTOS","title":"Misma góndola, distinto órgano","hot":["Opuestos"],"imageA":staticFile('img/vn2_none12_a.png'),"imageB":staticFile('img/vn2_none12_b.png'),"labelA":"Alto linoleico · repara su barrera","labelB":"Alto oleico · para la sartén","mood":"cool"},
  /* b095 347.9s */ {"mood":"gold","src":staticFile('broll/vn2vhn3n8eqs/vn2_b09.mp4'),"video":true,"ken":"right"},
  /* b096 351.4s */ {},
  /* b097 353.1s */ {"kicker":"ESTA NOCHE, EN SU COCINA","title":"Dé vuelta la botella","hot":["Dé vuelta"],"items":["Si dice «alto oleico» → esa es para la sartén","Si no lo dice → esa es la suya","Sin abrir: la etiqueta lo dice todo"],"mood":"gold"},
  /* b098 358.4s */ {"focus":1,"intro":false,"cards":CARDS,"bg":staticFile('img/vn2_bg_kitchen.png')},
  /* b099 365s */ {"mood":"cool","src":staticFile('broll/vn2vhn3n8eqs/vn2_b10.mp4'),"video":true,"ken":"right"},
  /* b100 367.5s */ {},
  /* b101 369.9s */ {"mood":"warmdark","src":staticFile('broll/vn2vhn3n8eqs/vn2_b11.mp4'),"video":true,"ken":"out"},
  /* b102 372.8s */ {},
  /* b103 374.6s */ {"step":1,"total":2,"title":"Ensayo aleatorizado","hot":["aleatorizado"],"sub":"Con evaluador ciego","image":staticFile('img/vn2_b12.png'),"mood":"science"},
  /* b104 377.5s */ {"name":"Dr. Valler","role":"Médico clínico","topic":"Acta Médica Filipina · 2023","avatarSrc":null},
  /* b105 380.4s */ {"kicker":"EL ENSAYO","value":148,"decimals":0,"label":"personas","sub":"Edad promedio: 68 años","mood":"cool","image":staticFile('img/vn2_fb_cool.png'),"suffix":"","prefix":""},
  /* b106 384.1s */ {"mood":"warmdark","src":staticFile('broll/vn2vhn3n8eqs/vn2_b13.mp4'),"video":true,"ken":"left"},
  /* b107 387.8s */ {"kicker":"CARA A CARA","title":"Ganó el coco virgen","hot":["Ganó"],"sub":"Contra aceite mineral","image":staticFile('img/vn2_b14.png'),"mood":"gold","side":"right"},
  /* b108 391s */ {"mood":"warmdark","src":staticFile('img/vn2_b15.png'),"video":false,"ken":"in"},
  /* b109 394s */ {},
  /* b110 396.3s */ {"kicker":"AL EMPEZAR","value":20,"decimals":0,"label":"pacientes colonizados","sub":"Estafilococo dorado sobre la piel","mood":"warmdark","image":staticFile('img/vn2_fb_warm.png'),"suffix":"","prefix":""},
  /* b111 400.3s */ {"kicker":"GRUPO COCO","value":1,"decimals":0,"label":"quedaba colonizado","sub":"Al final del ensayo","mood":"cool","image":staticFile('img/vn2_fb_cool.png'),"suffix":"","prefix":""},
  /* b112 402.9s */ {"kicker":"GRUPO OLIVA","value":6,"decimals":0,"label":"seguían colonizados","sub":"De 12 que empezaron","mood":"warmdark","image":staticFile('img/vn2_fb_warm.png'),"suffix":"","prefix":""},
  /* b113 406.1s */ {"kicker":"EL RESPONSABLE","title":"Ácido láurico","hot":["láurico"],"sub":"Casi la mitad del aceite de coco","centerLabel":"C12","nodes":[{"label":"48% del coco"},{"label":"Antibacteriano"},{"label":"Rompe la membrana"},{"label":"Sella la barrera"}],"image":staticFile('img/vn2_b16.png'),"mood":"science"},
  /* b114 409.5s */ {},
  /* b115 410.7s */ {"name":"Dr. Valler","role":"Médico clínico","topic":"Lo que el coco NO hace","avatarSrc":null},
  /* b116 412.4s */ {"kicker":"EVIDENCIA EN COCO","title":"Cero estudios de","hot":["Cero"],"items":["Arrugas: 0 estudios","Elasticidad: 0 estudios","Manchas: 0 estudios"],"mood":"warmdark"},
  /* b117 415.3s */ {"kicker":"QUÉ ES DE VERDAD","title":"Reparador de barrera","hot":["barrera"],"sub":"Con efecto antibacteriano","image":staticFile('img/vn2_fb_cool.png'),"mood":"cool","side":"left"},
  /* b118 417.9s */ {},
  /* b119 421.8s */ {"mood":"warmdark","src":staticFile('img/vn2_b17.png'),"video":false,"ken":"right"},
  /* b120 426.7s */ {"kicker":"DE DÓNDE SALE ESE NÚMERO","value":1972,"decimals":0,"label":"el año del test","sub":"Comedogenicidad grado 4","mood":"warmdark","image":staticFile('img/vn2_fb_warm.png'),"suffix":"","prefix":""},
  /* b121 430.2s */ {"mood":"warmdark","src":staticFile('broll/vn2vhn3n8eqs/vn2_b18.mp4'),"video":true,"ken":"out"},
  /* b122 434.7s */ {"kicker":"HOY","title":"La oreja del conejo no predice su cara","hot":["no predice"],"items":["Test de 1972, con el ingrediente puro","No se replica en piel humana","No está probado en usted"],"mood":"cool"},
  /* b123 438.1s */ {},
  /* b124 439.5s */ {"mood":"warmdark","src":staticFile('img/vn2_b19.png'),"video":false,"ken":"in"},
  /* b125 443.9s */ {"focus":2,"intro":false,"cards":CARDS,"bg":staticFile('img/vn2_bg_kitchen.png')},
  /* b126 450s */ {"mood":"warmdark","src":staticFile('broll/vn2vhn3n8eqs/vn2_c01.mp4'),"video":true,"ken":"left"},
  /* b127 452.6s */ {"name":"Dr. Valler","role":"Medicina · piel","topic":"Rosa mosqueta · Aceite nº3","avatarSrc":null},
  /* b128 454.8s */ {"kicker":"Rosa mosqueta · perfil graso","value":55,"prefix":"hasta ","suffix":"%","label":"Ácido linoleico","sub":"Entre 36 y 55% del aceite","mood":"science","image":staticFile('img/vn2_c03.png'),"decimals":0},
  /* b129 458.5s */ {"kicker":"Lo que trae adentro","title":"Mucho omega 3","hot":["omega 3"],"sub":"y poquísimo oleico","centerLabel":"Rosa mosqueta","nodes":[{"label":"Linoleico 36-55%"},{"label":"Omega 3 alto"},{"label":"Oleico bajo"},{"label":"Betacaroteno"}],"mood":"science","image":staticFile('img/vn2_fb_science.png')},
  /* b130 461.3s */ {"name":"Dr. Valler","role":"Medicina · piel","topic":"Sobre el papel, el mejor","avatarSrc":null},
  /* b131 463.4s */ {},
  /* b132 465.8s */ {"kicker":"Lo mejor que tiene","value":27,"label":"personas","sub":"Un solo estudio piloto","mood":"cool","image":staticFile('img/vn2_fb_cool.png'),"suffix":"","prefix":"","decimals":0},
  /* b133 469.5s */ {"kicker":"Ese estudio piloto","title":"Lo que le faltó","hot":["faltó"],"items":["Sin grupo control","Sin placebo","Sin ciego"],"mood":"warmdark"},
  /* b134 472.4s */ {},
  /* b135 474.5s */ {"kicker":"Ensayo aleatorizado","title":"La rosa mosqueta dio negativo","hot":["negativo"],"sub":"El diseño bueno no la acompañó","mood":"warmdark","image":staticFile('img/vn2_fb_warm.png')},
  /* b136 477s */ {},
  /* b137 479.3s */ {"name":"Dr. Valler","role":"Medicina · piel","topic":"Ganó el grupo control","avatarSrc":null},
  /* b138 482.8s */ {},
  /* b139 485.7s */ {"mood":"cool","src":staticFile('broll/vn2vhn3n8eqs/vn2_c14.mp4'),"video":true,"ken":"right"},
  /* b140 489.2s */ {},
  /* b141 490.6s */ {"kicker":"Bioquímica básica","title":"El retinol lo fabrican los animales","hot":["los animales"],"sub":"No las plantas","mood":"science","image":staticFile('img/vn2_c16.png')},
  /* b142 493.9s */ {"kicker":"Lo que sí tiene","title":"Betacaroteno","hot":["Betacaroteno"],"sub":"Que es otra cosa","centerLabel":"β-caroteno","nodes":[{"label":"Pigmento vegetal"},{"label":"No es retinol"},{"label":"Da el color naranja"},{"label":"Precursor lejano"}],"mood":"science","image":staticFile('img/vn2_fb_science.png')},
  /* b143 496.9s */ {},
  /* b144 499.2s */ {"kicker":"La comparación honesta","title":"Trazas contra retinol de verdad","hot":["de verdad"],"labelA":"Rosa mosqueta · trazas","labelB":"Retinol de médico","mood":"cool","imageA":staticFile('img/vn2_c19.png'),"imageB":staticFile('img/vn2_c19_b.png')},
  /* b145 504.9s */ {"mood":"cool","src":staticFile('broll/vn2vhn3n8eqs/vn2_c20.mp4'),"video":true,"ken":"out"},
  /* b146 509.1s */ {},
  /* b147 510.3s */ {"kicker":"Úsela, pero por esto","title":"Lo que sí le da","hot":["sí"],"items":["Muy rica en linoleico","Nutre la barrera de la piel","No es un retinol"],"mood":"gold"},
  /* b148 515.1s */ {},
  /* b149 516.5s */ {"name":"Dr. Valler","role":"Medicina · piel","topic":"Se pone rancia rápido","avatarSrc":null},
  /* b150 518.6s */ {"kicker":"Cómo guardarla","title":"Botella oscura y heladera","hot":["heladera"],"items":["Botella oscura, nunca transparente","A la heladera después de abrirla","Se oxida en semanas"],"mood":"cool"},
  /* b151 521.4s */ {"name":"Dr. Valler","role":"Medicina · piel","topic":"Le quiero mostrar una foto","avatarSrc":null},
  /* b152 524.3s */ {"kicker":"2012","quote":"Una de las revistas médicas más serias que existen.","author":"New England Journal of Medicine","role":"Publicación original del caso","mood":"cool","image":staticFile('img/vn2_fb_cool.png')},
  /* b153 527.6s */ {"mood":"cool","src":staticFile('broll/vn2vhn3n8eqs/vn2_c28.mp4'),"video":true,"ken":"out"},
  /* b154 530.9s */ {"kicker":"El caso publicado","value":69,"suffix":" años","label":"Camionero de reparto","sub":"New England Journal of Medicine, 2012","mood":"warmdark","image":staticFile('img/vn2_c29.png'),"prefix":"","decimals":0},
  /* b155 534.9s */ {"kicker":"Al volante","value":25,"suffix":" años","label":"manejando todos los días","sub":"Siempre el mismo lado al sol","mood":"warmdark","image":staticFile('img/vn2_fb_warm.png'),"prefix":"","decimals":0},
  /* b156 537s */ {"mood":"warmdark","src":staticFile('broll/vn2vhn3n8eqs/vn2_c31.mp4'),"video":true,"ken":"in"},
  /* b157 539.5s */ {"kicker":"New England Journal of Medicine · 2012","title":"Las dos mitades no parecen la misma persona","hot":["no parecen"],"labelA":"Izquierdo · ventanilla","labelB":"Derecho · protegido","mood":"warmdark","imageA":staticFile('img/vn2_c32.png'),"imageB":staticFile('img/vn2_c32_b.png')},
  /* b158 542.7s */ {},
  /* b159 545.9s */ {"mood":"warmdark","src":staticFile('img/vn2_c34.png'),"video":false,"ken":"right"},
  /* b160 549.5s */ {"kicker":"Lado izquierdo · el de la ventanilla","title":"Lo que le hizo el sol","hot":["el sol"],"items":["Piel engrosada y colgada","Surcos profundos","Poros dilatados","20 años más de un solo lado"],"mood":"warmdark"},
  /* b161 554.7s */ {"name":"Dr. Valler","role":"Medicina · piel","topic":"Grábese este detalle","avatarSrc":null},
  /* b162 557.2s */ {"mood":"warmdark","src":staticFile('broll/vn2vhn3n8eqs/vn2_c37.mp4'),"video":true,"ken":"left"},
  /* b163 560s */ {"theme":"dark","scene":{"avatarSrc":null,"muted":true,"cameras":[{"time":0,"fx":50,"fy":14,"z":1.15},{"time":0.9,"fx":26,"fy":42,"z":1.42},{"time":3.4,"fx":72,"fy":42,"z":1.42},{"time":5.8,"fx":50,"fy":46,"z":1}],"elements":[{"t":"title","x":4,"y":7,"text":"El vidrio no lo protege","start":0.2},{"t":"note","x":16,"y":26,"w":24,"text":"UVB · los que queman","start":0.8,"align":"center"},{"t":"arrow","from":[26,34],"to":[26,43],"start":1.4,"curve":-0.2},{"t":"note","x":16,"y":49,"w":24,"text":"El vidrio los detiene","start":1.9,"box":true,"align":"center"},{"t":"note","x":70,"y":26,"w":26,"text":"UVA · los que envejecen","start":3.4,"align":"center"},{"t":"arrow","from":[76,34],"to":[76,43],"start":4,"curve":-0.2},{"t":"note","x":70,"y":49,"w":26,"text":"Atraviesan el vidrio","start":4.3,"fill":true,"align":"center"},{"t":"note","x":70,"y":68,"w":26,"text":"Y también las nubes","start":5.8,"highlight":true,"align":"center"},{"t":"lasso","x":73,"y":47,"w":34,"h":54,"start":6.3,"rot":-2}]},"nodes":[{"label":"Barrera"},{"label":"Ceramidas"},{"label":"Linoleico"},{"label":"Agua"}]},
  /* b164 567.5s */ {"mood":"cool","src":staticFile('broll/vn2vhn3n8eqs/vn2_c39.mp4'),"video":true,"ken":"in"},
  /* b165 571.2s */ {},
  /* b166 574s */ {"name":"Dr. Valler","role":"Medicina · piel","topic":"La proporción real","avatarSrc":null},
  /* b167 576.3s */ {"kicker":"2013","quote":"¿Qué parte de los signos visibles del envejecimiento facial se explica por el sol?","author":"Grupo de Frederick Flament","role":"Investigación publicada, 2013","mood":"science","image":staticFile('img/vn2_fb_science.png')},
  /* b168 580.3s */ {"mood":"warmdark","src":staticFile('img/vn2_c43.png'),"video":false,"ken":"in"},
  /* b169 584.7s */ {"kicker":"Flament, 2013","value":80.3,"decimals":1,"suffix":"%","label":"del envejecimiento facial visible","sub":"Lo explica el sol","mood":"gold","image":staticFile('img/vn2_fb_gold.png'),"prefix":""},
  /* b170 589s */ {"kicker":"Lo que ve en el espejo","title":"No se lo hicieron los años","hot":["los años"],"sub":"Se lo hizo el sol","mood":"warmdark","image":staticFile('img/vn2_c45.png')},
  /* b171 594s */ {},
  /* b172 595.8s */ {"focus":3,"intro":false,"cards":CARDS,"bg":staticFile('img/vn2_bg_kitchen.png')},
  /* b173 603.6s */ {"kicker":"El ensayo","value":60,"label":"mujeres posmenopáusicas","sub":"De 49 a 61 años","mood":"science","image":staticFile('img/vn2_c49.png'),"suffix":"","prefix":"","decimals":0},
  /* b174 608.3s */ {"kicker":"Duración","value":60,"suffix":" días","label":"de seguimiento","sub":"Medido con cutómetro","mood":"science","image":staticFile('img/vn2_fb_science.png'),"prefix":"","decimals":0},
  /* b175 610.9s */ {"mood":"science","src":staticFile('img/vn2_c51.png'),"video":false,"ken":"right"},
  /* b176 615s */ {"kicker":"El resultado","value":15,"prefix":"+","suffix":"%","label":"Elasticidad biológica","sub":"A los 60 días","mood":"gold","image":staticFile('img/vn2_fb_gold.png'),"decimals":0},
  /* b177 617.9s */ {"name":"Dr. Valler","role":"Medicina · piel","topic":"El grupo de oliva no mejoró","avatarSrc":null},
  /* b178 621.5s */ {},
  /* b179 624.9s */ {"kicker":"El detalle que no le cuentan","value":25,"suffix":" g","label":"de aceite de argán por día","sub":"Además, tomado","mood":"gold","image":staticFile('img/vn2_c55.png'),"prefix":"","decimals":0},
  /* b180 629.4s */ {"mood":"gold","src":staticFile('broll/vn2vhn3n8eqs/vn2_c56.mp4'),"video":true,"ken":"in"},
  /* b181 631.8s */ {"kicker":"El protocolo real del estudio","title":"Así se hizo","hot":["Así"],"items":["25 gramos por día","Dos cucharadas soperas","Todos los días","Dos meses"],"mood":"gold"},
  /* b182 633.9s */ {"name":"Dr. Valler","role":"Medicina · piel","topic":"El 15% no fue de la cara","avatarSrc":null},
  /* b183 638.2s */ {},
  /* b184 640.8s */ {"kicker":"Sea honesto con el dato","title":"Untarlo no es comerlo","hot":["no es comerlo"],"labelA":"Untado en la cara","labelB":"Comido · 25 g al día","mood":"cool","imageA":staticFile('img/vn2_c60.png'),"imageB":staticFile('img/vn2_c60_b.png')},
  /* b185 645.5s */ {},
  /* b186 647.1s */ {"name":"Dr. Valler","role":"Medicina · piel","topic":"Advertencia seria","avatarSrc":null},
  /* b187 650.1s */ {},
  /* b188 653.2s */ {"kicker":"Casos publicados","title":"Anafilaxia por contacto","hot":["contacto"],"items":["Por contacto con la piel","No solo por comerlo","Reacción grave, inmediata"],"mood":"warmdark"},
  /* b189 656.4s */ {"mood":"warmdark","src":staticFile('broll/vn2vhn3n8eqs/vn2_c65.mp4'),"video":true,"ken":"out"},
  /* b190 659.5s */ {"kicker":"Hable con su médico antes","title":"Si es alérgico a","hot":["alérgico"],"items":["Durazno","Mostaza","Frutos secos"],"mood":"warmdark"},
  /* b191 662.9s */ {"step":1,"total":1,"title":"Hágase la prueba del parche","hot":["del parche"],"sub":"Se la explico al final del video","mood":"cool","image":staticFile('img/vn2_c67.png')},
  /* b192 668.3s */ {"focus":4,"intro":false,"cards":CARDS,"bg":staticFile('img/vn2_bg_kitchen.png')},
  /* b193 674.6s */ {"mood":"gold","ken":"in","src":staticFile('broll/vn2vhn3n8eqs/vn2_d02.mp4'),"video":true},
  /* b194 676.4s */ {"kicker":"El sebo que usted fabrica","value":25,"suffix":"%","prefix":"","decimals":0,"label":"son ésteres de cera","sub":"Por eso la jojoba, que es cera y no aceite, encaja tan bien.","mood":"science","image":staticFile('img/vn2_d03.png')},
  /* b195 681.2s */ {"kicker":"Nº 5 · Jojoba","title":"Lo más parecido al sebo humano","hot":["sebo humano"],"sub":"Ningún otro vegetal se le acerca tanto a lo que su piel ya hacía sola.","centerLabel":"Jojoba","nodes":[{"label":"Ésteres de cera"},{"label":"Casi idéntica al sebo"},{"label":"Casi no se oxida"}],"mood":"science","image":staticFile('img/vn2_d04.png')},
  /* b196 685.1s */ {"kicker":"Piel que dejó de producir sebo","title":"Repone lo que la glándula ya no hace","hot":["Repone"],"sub":"No la tapa: le devuelve la misma cera que perdió.","mood":"warmdark","side":"right","image":staticFile('img/vn2_d05.png')},
  /* b197 689.5s */ {},
  /* b198 692.6s */ {"kicker":"La lección del video","title":"La mejor química, la peor evidencia","hot":["mejor química","peor evidencia"],"labelA":"Química: la nº 1","labelB":"Evidencia: la última","mood":"cool","imageA":staticFile('img/vn2_d06.png'),"imageB":staticFile('img/vn2_d06_b.png')},
  /* b199 696.9s */ {"kicker":"Jojoba · literatura clínica","value":0,"suffix":"","prefix":"","decimals":0,"label":"ensayos controlados en humanos","sub":"Cero. Toda la fama viene del mecanismo, no de la prueba.","mood":"cool","image":staticFile('img/vn2_d07.png')},
  /* b200 699.1s */ {"name":"Dr. Valler","role":"Médico clínico","topic":"¿Para qué sirve la jojoba?","avatarSrc":null},
  /* b201 702.8s */ {"kicker":"Jojoba · a quién le sirve","title":"Úsela si usted tiene","hot":["usted"],"items":["Piel seca y grasa a la vez","Piel sensible que reacciona a todo","El aceite más seguro de los 7"],"mood":"cool"},
  /* b202 706.8s */ {},
  /* b203 709.9s */ {"focus":5,"intro":false,"cards":CARDS,"bg":staticFile('img/vn2_bg_kitchen.png')},
  /* b204 715.8s */ {"name":"Dr. Valler","role":"Médico clínico","topic":"Ensayo triple ciego · estrías","avatarSrc":null},
  /* b205 719.3s */ {"mood":"warmdark","ken":"in","src":staticFile('broll/vn2vhn3n8eqs/vn2_d10.mp4'),"video":true},
  /* b206 721.9s */ {"kicker":"Grupo que usó sésamo","value":16,"suffix":"%","prefix":"","decimals":0,"label":"tuvo estrías","sub":"200 embarazadas primerizas, triple ciego.","mood":"science","image":staticFile('img/vn2_d11.png')},
  /* b207 724.5s */ {"kicker":"Grupo sin tratamiento","value":82,"suffix":"%","prefix":"","decimals":0,"label":"tuvo estrías","sub":"Cinco veces más que el grupo del aceite.","mood":"warmdark","image":staticFile('img/vn2_d12.png')},
  /* b208 727.4s */ {},
  /* b209 730.9s */ {"kicker":"La trampa del estudio","title":"El masaje solo ya mejora la circulación","hot":["masaje solo"],"sub":"Nadie separó el aceite de la mano que lo aplica.","mood":"cool","side":"left","image":staticFile('img/vn2_d13.png')},
  /* b210 733.5s */ {},
  /* b211 734.6s */ {"kicker":"Sésamo · uso realista","title":"Un buen aceite de cuerpo","hot":["cuerpo"],"items":["Cuerpo","Piernas","Manos"],"mood":"gold"},
  /* b212 737.7s */ {"name":"Dr. Valler","role":"Médico clínico","topic":"FDA · 2021","avatarSrc":null},
  /* b213 741.4s */ {"kicker":"FDA · Estados Unidos · 2021","value":9,"suffix":"º","prefix":"","decimals":0,"label":"alérgeno alimentario mayor","sub":"El sésamo entró a la lista oficial junto al maní y la leche.","mood":"warmdark","image":staticFile('img/vn2_d14.png')},
  /* b214 746.1s */ {},
  /* b215 747.7s */ {"kicker":"Advertencia · sésamo","title":"Si usted es alérgico","hot":["alérgico"],"items":["Ni se le ocurra ponérselo en la piel","Revise la etiqueta de sus cremas","La piel también sensibiliza"],"mood":"warmdark"},
  /* b216 751.3s */ {"focus":6,"intro":false,"cards":CARDS,"bg":staticFile('img/vn2_bg_kitchen.png')},
  /* b217 757.3s */ {},
  /* b218 759.3s */ {"kicker":"Almendras dulces · tacto de seda","title":"Ideal para","hot":["Ideal"],"items":["Manos","Codos","Talones"],"mood":"gold"},
  /* b219 762.9s */ {},
  /* b220 765s */ {"kicker":"Almendras dulces","value":86,"suffix":"%","prefix":"hasta ","decimals":0,"label":"de ácido oleico","sub":"El mismo ácido que le marqué como problema en el oliva.","mood":"science","image":staticFile('img/vn2_d16.png')},
  /* b221 766.9s */ {"kicker":"Mismo perfil, distinta fama","title":"Se parece al aceite de oliva","hot":["oliva"],"labelA":"Almendras dulces","labelB":"Oliva","mood":"cool","imageA":staticFile('img/vn2_d17.png'),"imageB":staticFile('img/vn2_d17_b.png')},
  /* b222 769.2s */ {"name":"Dr. Valler","role":"Médico clínico","topic":"El estudio que nadie hizo","avatarSrc":null},
  /* b223 772.9s */ {"kicker":"Cómo leerlo","quote":"Es una sospecha por mecanismo, no un dato.","author":"Dr. Valler","role":"Sobre el aceite de almendras","mood":"cool","image":staticFile('img/vn2_d18.png')},
  /* b224 775.9s */ {},
  /* b225 777.4s */ {},
  /* b226 778.8s */ {"step":1,"total":2,"title":"La piel dañada es una puerta de entrada","hot":["puerta de entrada"],"sub":"El alimento sensibiliza por la barrera rota, no por la boca.","mood":"science","image":staticFile('img/vn2_d19.png')},
  /* b227 782.5s */ {},
  /* b228 784.8s */ {"kicker":"New England Journal of Medicine","value":14000,"suffix":"","prefix":"","decimals":0,"label":"chicos seguidos","sub":"El precedente que nadie quiere mirar: el maní.","mood":"science","image":staticFile('img/vn2_d20.png')},
  /* b229 788s */ {"kicker":"Chicos alérgicos al maní","value":84,"suffix":"%","prefix":"","decimals":0,"label":"había recibido cremas con aceite de maní","sub":"De bebés, sobre la piel. No por la comida.","mood":"warmdark","image":staticFile('img/vn2_d21.png')},
  /* b230 791.2s */ {"mood":"warmdark","ken":"in","src":staticFile('img/vn2_d22.png'),"video":false},
  /* b231 794.1s */ {"kicker":"La regla que le dejo","title":"Frutos secos sobre piel con eczema","hot":["eczema"],"sub":"Con cuidado.","mood":"warmdark","side":"right","image":staticFile('img/vn2_d23.png')},
  /* b232 796.1s */ {},
  /* b233 798.1s */ {"kicker":"Segunda parte","index":"II","title":"La lista negra","sub":"Igual de importante que los siete buenos.","mood":"warmdark"},
  /* b234 803.2s */ {"kicker":"DANBY, 2013","title":"El aceite de oliva le seca más la piel","hot":["seca más"],"sub":"Aumentó la pérdida de agua por la piel","image":staticFile('img/vn2_e01.png'),"mood":"science","side":"left"},
  /* b235 807.8s */ {"name":"Dr. Valler","role":"Médico","topic":"La lista negra","avatarSrc":null},
  /* b236 810.3s */ {"mood":"gold","src":staticFile('broll/vn2vhn3n8eqs/vn2_e02.mp4'),"video":true,"ken":"in"},
  /* b237 812.4s */ {},
  /* b238 814.3s */ {"kicker":"LISTA NEGRA","index":"02","title":"Vitamina E en la piel","sub":"Y el aceite que la lleva","mood":"warmdark"},
  /* b239 816.9s */ {"mood":"gold","src":staticFile('broll/vn2vhn3n8eqs/vn2_e03.mp4'),"video":true,"ken":"right"},
  /* b240 819.3s */ {},
  /* b241 823.9s */ {},
  /* b242 827s */ {"kicker":"EL ENSAYO","value":15,"decimals":0,"label":"pacientes operados","sub":"Cirugía de cáncer de piel","image":staticFile('img/vn2_e04.png'),"mood":"science","suffix":"","prefix":""},
  /* b243 829.1s */ {"kicker":"MITAD Y MITAD","title":"Cada cicatriz partida en dos","hot":["partida en dos"],"labelA":"Crema sola","labelB":"Crema + vitamina E","mood":"science","imageA":staticFile('img/vn2_e05.png'),"imageB":staticFile('img/vn2_e05_b.png')},
  /* b244 833.1s */ {},
  /* b245 835.3s */ {"kicker":"RESULTADO","value":90,"suffix":"%","decimals":0,"label":"sin ningún efecto o peor","sub":"La vitamina E no mejoró la cicatriz","image":staticFile('img/vn2_e06.png'),"mood":"warmdark","prefix":""},
  /* b246 841.2s */ {"kicker":"ADEMÁS","prefix":"1 de cada","value":3,"decimals":0,"label":"con dermatitis de contacto","sub":"Alergia en la piel tratada","image":staticFile('img/vn2_e07.png'),"mood":"warmdark","suffix":""},
  /* b247 845s */ {},
  /* b248 847.6s */ {"kicker":"DÓNDE SALTA","title":"En piel con la barrera rota","hot":["barrera rota"],"sub":"Ahí la alergia trepa a un tercio","image":staticFile('img/vn2_e08.png'),"mood":"warmdark","side":"right"},
  /* b249 851.3s */ {},
  /* b250 854.5s */ {"mood":"warmdark","src":staticFile('broll/vn2vhn3n8eqs/vn2_e09.mp4'),"video":true,"ken":"left"},
  /* b251 856.8s */ {"kicker":"LISTA NEGRA","index":"03","title":"Cítricos prensados en frío","sub":"Este es directamente peligroso","mood":"warmdark"},
  /* b252 860.1s */ {},
  /* b253 863.2s */ {"mood":"gold","src":staticFile('broll/vn2vhn3n8eqs/vn2_e10.mp4'),"video":true,"ken":"out"},
  /* b254 865.1s */ {"theme":"white","title":"Furocumarinas","steps":["El aceite prensado en frío trae furocumarinas","Usted sale al sol: llega la luz ultravioleta","La furocumarina se activa"],"mood":"cool","nodes":[{"label":"Barrera"},{"label":"Ceramidas"},{"label":"Linoleico"},{"label":"Agua"}],"image":staticFile('img/vn2_fb_cool.png'),"kicker":"","sub":"","centerLabel":"Furocumarinas","hot":[]},
  /* b255 869.9s */ {"theme":"white","title":"Se pega al ADN","steps":["Entra al núcleo de la célula","Se pega al ADN","La célula muere: quemadura química"],"mood":"cool","nodes":[{"label":"Barrera"},{"label":"Ceramidas"},{"label":"Linoleico"},{"label":"Agua"}],"image":staticFile('img/vn2_fb_cool.png'),"kicker":"","sub":"","centerLabel":"Se pega al ADN","hot":[]},
  /* b256 874.8s */ {},
  /* b257 876.5s */ {"step":1,"total":2,"title":"Ampollas","hot":["Ampollas"],"sub":"A las 24 o 72 horas","image":staticFile('img/vn2_e11.png'),"mood":"warmdark"},
  /* b258 879s */ {"step":2,"total":2,"title":"Mancha oscura","hot":["Mancha oscura"],"sub":"Con forma de chorreado","image":staticFile('img/vn2_e12.png'),"mood":"warmdark"},
  /* b259 882.4s */ {},
  /* b260 885.1s */ {"kicker":"ASOCIACIÓN DE FRAGANCIAS","value":0.4,"suffix":"%","decimals":1,"label":"es el tope permitido","sub":"Bergamota prensada en productos que quedan en la piel","image":staticFile('img/vn2_e13.png'),"mood":"science","prefix":""},
  /* b261 889.6s */ {"mood":"gold","src":staticFile('broll/vn2vhn3n8eqs/vn2_e14.mp4'),"video":true,"ken":"out"},
  /* b262 894.5s */ {"kicker":"HAY REPORTES","value":0.03,"suffix":"%","decimals":2,"label":"ya dio fototoxicidad","sub":"Treinta veces menos que el tope","mood":"warmdark","image":staticFile('img/vn2_fb_warm.png'),"prefix":""},
  /* b263 898.2s */ {},
  /* b264 900.4s */ {"kicker":"REGLA DURA","title":"Si el frasco no dice destilado al vapor","hot":["destilado al vapor"],"items":["No se lo ponga y salga al sol","Cítricos, solo de noche","Bergamota prensada, nunca al sol"],"mood":"warmdark"},
  /* b265 904.9s */ {},
  /* b266 907.6s */ {"kicker":"PARTE 4","index":"04","title":"Límites honestos","sub":"El tramo que menos me conviene contarle","mood":"cool"},
  /* b267 911.2s */ {"kicker":"LÍMITE 1","title":"Ningún aceite le fabrica colágeno","hot":["Ningún","colágeno"],"sub":"Ninguno","image":staticFile('img/vn2_e15.png'),"mood":"cool","side":"left"},
  /* b268 914.6s */ {},
  /* b269 918.4s */ {"kicker":"LO QUE CIRCULA","prefix":"+","value":85,"suffix":"%","decimals":0,"label":"de procolágeno","sub":"Ese dato no existe","image":staticFile('img/vn2_e16.png'),"mood":"warmdark"},
  /* b270 921.3s */ {"kicker":"LO QUE CIRCULA","prefix":"-","value":43,"suffix":"%","decimals":0,"label":"de arrugas","sub":"Tampoco existe","mood":"warmdark","image":staticFile('img/vn2_fb_warm.png')},
  /* b271 923.9s */ {},
  /* b272 928.1s */ {"kicker":"EL MÁS PELIGROSO","title":"Los aceites no protegen del sol","hot":["no protegen"],"sub":"Ninguno de los que le venden como natural","image":staticFile('img/vn2_e17.png'),"mood":"warmdark","side":"right"},
  /* b273 931.9s */ {"kicker":"2021","value":5,"decimals":0,"label":"aceites medidos","sub":"En laboratorio y en piel humana","image":staticFile('img/vn2_e18.png'),"mood":"science","suffix":"","prefix":""},
  /* b274 936s */ {},
  /* b275 939s */ {"kicker":"ACEITE DE COCO","prefix":"0 a","value":1.2,"decimals":1,"label":"de factor de protección","sub":"Eso es nada","image":staticFile('img/vn2_e19.png'),"mood":"warmdark","suffix":""},
  /* b276 943.3s */ {},
  /* b277 945.7s */ {"kicker":"FACTOR 30","value":97,"suffix":"%","decimals":0,"label":"de la radiación bloqueada","sub":"Compare usted mismo","image":staticFile('img/vn2_e20.png'),"mood":"science","prefix":""},
  /* b278 948.4s */ {},
  /* b279 951.2s */ {"mood":"gold","src":staticFile('broll/vn2vhn3n8eqs/vn2_e21.mp4'),"video":true,"ken":"right"},
  /* b280 954.6s */ {},
  /* b281 957.1s */ {"kicker":"EL AGRAVANTE","title":"Le saca la señal de alarma","hot":["señal de alarma"],"sub":"La radiación sigue entrando igual","image":staticFile('img/vn2_e22.png'),"mood":"warmdark","side":"left"},
  /* b282 960.7s */ {},
  /* b283 964.5s */ {"mood":"warmdark","src":staticFile('broll/vn2vhn3n8eqs/vn2_e23.mp4'),"video":true,"ken":"right"},
  /* b284 966.3s */ {"kicker":"QUÉ SÍ FUNCIONA","title":"Dos cosas para el colágeno","hot":["Dos cosas"],"items":["Protector solar todos los días","Retinoides de noche","Y ninguna de las dos es un aceite"],"mood":"science"},
  /* b285 969.3s */ {},
  /* b286 971.9s */ {"step":1,"total":2,"title":"El protector solar","hot":["protector solar"],"sub":"Todos los días, no solo en la playa","image":staticFile('img/vn2_e24.png'),"mood":"science"},
  /* b287 975.5s */ {"kicker":"2013","quote":"El único ensayo aleatorizado de prevención del envejecimiento de la piel que existe","author":"Annals of Internal Medicine","role":"Ensayo aleatorizado, Australia","image":staticFile('img/vn2_e25.png'),"mood":"science"},
  /* b288 981s */ {"kicker":"AUSTRALIA","value":903,"decimals":0,"label":"adultos seguidos","sub":"Durante años, en la vida real","image":staticFile('img/vn2_e26.png'),"mood":"science","suffix":"","prefix":""},
  /* b289 983s */ {"mood":"gold","src":staticFile('broll/vn2vhn3n8eqs/vn2_e27.mp4'),"video":true,"ken":"out"},
  /* b290 986.3s */ {"kicker":"RESULTADO","prefix":"-","value":24,"suffix":"%","decimals":0,"label":"de envejecimiento de la piel","sub":"En el grupo que se lo puso todos los días","image":staticFile('img/vn2_e28.png'),"mood":"science"},
  /* b291 991.2s */ {},
  /* b292 993.2s */ {"step":2,"total":2,"title":"Los retinoides","hot":["retinoides"],"sub":"New England Journal of Medicine","image":staticFile('img/vn2_e29.png'),"mood":"science"},
  /* b293 997s */ {"kicker":"TRETINOÍNA","prefix":"+","value":80,"suffix":"%","decimals":0,"label":"de colágeno tipo 1","sub":"Formación medida en la piel","mood":"science","image":staticFile('img/vn2_fb_science.png')},
  /* b294 999.8s */ {},
  /* b295 1002s */ {"kicker":"OTRO ENSAYO","value":87,"decimals":0,"label":"años de promedio","sub":"Doble ciego, y también mejoraron","image":staticFile('img/vn2_e30.png'),"mood":"gold","suffix":"","prefix":""},
  /* b296 1004.5s */ {"kicker":"ENSAYO CLÍNICO","value":3,"suffix":" veces por semana","label":"Retinol","sub":"Mejoría medible en las arrugas finas","image":staticFile('img/vn2_f01.png'),"mood":"science","prefix":"","decimals":0},
  /* b297 1008.2s */ {"kicker":"LOS PARTICIPANTES","value":87,"suffix":" años","label":"Edad promedio del grupo","sub":"Y la piel igual respondió","image":staticFile('img/vn2_f02.png'),"mood":"gold","prefix":"","decimals":0},
  /* b298 1010.3s */ {},
  /* b299 1012.9s */ {"kicker":"AHORA SÍ","index":"06","title":"EL ERROR","sub":"El que le prometí al principio","mood":"warmdark"},
  /* b300 1016.1s */ {},
  /* b301 1018.2s */ {"kicker":"EL ERROR","title":"Usted se pone el aceite sobre la piel SECA","hot":["SECA"],"sub":"No es cuál aceite. Es cuándo.","image":staticFile('img/vn2_f06.png'),"mood":"warmdark","side":"right"},
  /* b302 1021.7s */ {"src":staticFile('broll/vn2vhn3n8eqs/vn2_f07.mp4'),"video":true,"mood":"warmdark","ken":"left"},
  /* b303 1024.7s */ {"kicker":"ANHIDRO","value":0,"suffix":"%","label":"De agua en un aceite vegetal puro","sub":"Cero. No tiene agua para dar.","image":staticFile('img/vn2_f08.png'),"mood":"science","prefix":"","decimals":0},
  /* b304 1027.2s */ {"src":staticFile('broll/vn2vhn3n8eqs/vn2_f09.mp4'),"video":true,"mood":"warmdark","ken":"in"},
  /* b305 1031.3s */ {},
  /* b306 1033.6s */ {},
  /* b307 1037.9s */ {"theme":"dark","scene":{"avatarSrc":"","muted":true,"cameras":[{"time":0,"fx":24,"fy":30,"z":1.22},{"time":2,"fx":62,"fy":28,"z":1.28},{"time":3.3,"fx":62,"fy":54,"z":1.3}],"elements":[{"t":"title","x":4,"y":8,"text":"El aceite es la TAPA, no el contenido","start":0.2},{"t":"note","x":8,"y":30,"w":22,"text":"Aceite = TAPA","start":0.6,"box":true,"align":"center"},{"t":"note","x":8,"y":48,"w":22,"text":"Agua = CONTENIDO","start":1.3,"highlight":true,"align":"center"},{"t":"arrow","from":[32,34],"to":[47,32],"start":1.9,"curve":-0.25},{"t":"note","x":52,"y":26,"w":26,"text":"Piel SECA + aceite = sella la nada","start":2.2,"fill":true,"align":"center"},{"t":"note","x":52,"y":52,"w":26,"text":"Piel HÚMEDA + aceite = sella el agua","start":3.2,"highlight":true,"align":"center"},{"t":"lasso","x":64,"y":54,"w":32,"h":18,"start":4,"rot":-2}]},"mood":"warmdark","nodes":[{"label":"Barrera"},{"label":"Ceramidas"},{"label":"Linoleico"},{"label":"Agua"}]},
  /* b308 1042.7s */ {"src":staticFile('img/vn2_f13.png'),"video":false,"mood":"warmdark","ken":"in"},
  /* b309 1045s */ {"kicker":"EL ORDEN LO ES TODO","title":"Sobre piel seca usted sella la nada","hot":["la nada"],"imageA":staticFile('img/vn2_f14_a.png'),"imageB":staticFile('img/vn2_f14_b.png'),"labelA":"Piel seca + aceite","labelB":"Piel húmeda + aceite","mood":"cool"},
  /* b310 1048.6s */ {},
  /* b311 1050.9s */ {"kicker":"LO QUE PASA DE VERDAD","title":"Brillante por fuera. Igual de seca por dentro.","hot":["seca por dentro"],"sub":"El agua real no subió ni un punto","image":staticFile('img/vn2_f16.png'),"mood":"warmdark","side":"left"},
  /* b312 1053.7s */ {"src":staticFile('broll/vn2vhn3n8eqs/vn2_f17.mp4'),"video":true,"mood":"warmdark","ken":"in"},
  /* b313 1058s */ {"src":staticFile('img/vn2_f18.png'),"video":false,"mood":"warmdark","ken":"out"},
  /* b314 1061.3s */ {},
  /* b315 1063.9s */ {"kicker":"LA REGLA","title":"Agua primero. Aceite después.","hot":["Agua","Aceite"],"sub":"Ese es todo el secreto","image":staticFile('img/vn2_fb_cool.png'),"mood":"cool","side":"right"},
  /* b316 1066.1s */ {},
  /* b317 1069.7s */ {"src":staticFile('broll/vn2vhn3n8eqs/vn2_f22.mp4'),"video":true,"mood":"warmdark","ken":"out"},
  /* b318 1072.9s */ {"kicker":"SI NO SE PONE NADA","value":91,"suffix":"%","label":"De la hidratación que tenía ANTES de bañarse","sub":"La ducha se lleva más de lo que deja","image":staticFile('img/vn2_f23.png'),"mood":"warmdark","prefix":"","decimals":0},
  /* b319 1077.4s */ {},
  /* b320 1080s */ {"kicker":"OJO CON ESTO","title":"Bañarse y no ponerse nada la deja PEOR","hot":["PEOR"],"sub":"Peor que antes de bañarse","image":staticFile('img/vn2_f25.png'),"mood":"warmdark","side":"left"},
  /* b321 1082.6s */ {"name":"Dr. Valler","role":"Médico","topic":"El error del aceite","avatarSrc":null},
  /* b322 1085.1s */ {"kicker":"ESTA NOCHE","index":"07","title":"LA RUTINA","sub":"Cinco pasos, en este orden","mood":"cool"},
  /* b323 1088.9s */ {"step":1,"total":5,"title":"Ducha tibia y corta","hot":["tibia"],"sub":"El agua caliente disuelve el mismo cemento de grasa que queremos reponer","image":staticFile('img/vn2_f28.png'),"mood":"cool"},
  /* b324 1093.3s */ {},
  /* b325 1096s */ {"step":2,"total":5,"title":"Séquese a toques","hot":["a toques"],"sub":"Deje la piel apenas húmeda, que brille de agua","image":staticFile('img/vn2_f30.png'),"mood":"cool"},
  /* b326 1100.4s */ {"src":staticFile('broll/vn2vhn3n8eqs/vn2_f31.mp4'),"video":true,"mood":"warmdark","ken":"left"},
  /* b327 1103.5s */ {"step":3,"total":5,"title":"Humectante sobre piel húmeda","hot":["húmeda"],"sub":"Glicerina · ácido hialurónico · urea","image":staticFile('img/vn2_f32.png'),"mood":"science"},
  /* b328 1108.1s */ {"src":staticFile('broll/vn2vhn3n8eqs/vn2_f33.mp4'),"video":true,"mood":"warmdark","ken":"in"},
  /* b329 1111.4s */ {},
  /* b330 1113.7s */ {"step":4,"total":5,"title":"Ahora sí, el aceite","hot":["Ahora sí"],"sub":"Y menos de lo que usted cree","image":staticFile('img/vn2_f35.png'),"mood":"gold"},
  /* b331 1117s */ {"kicker":"DOSIS · CARA","prefix":"3 a ","value":5,"suffix":" gotas","label":"Para toda la cara","sub":"Nada más","image":staticFile('img/vn2_f36.png'),"mood":"gold","decimals":0},
  /* b332 1119.1s */ {"kicker":"DOSIS · ANTEBRAZO","value":10,"suffix":" gotas","label":"Para un antebrazo entero","sub":"La dosis exacta del estudio de argán","image":staticFile('img/vn2_f37.png'),"mood":"science","prefix":"","decimals":0},
  /* b333 1123.3s */ {"src":staticFile('img/vn2_f38.png'),"video":false,"mood":"warmdark","ken":"out"},
  /* b334 1126.4s */ {"kicker":"TÉCNICA","title":"Presione y suelte. No frote.","hot":["No frote"],"sub":"Frotar en piel madura la irrita","image":staticFile('img/vn2_f39.png'),"mood":"gold","side":"right"},
  /* b335 1129.6s */ {"step":5,"total":5,"title":"Cuatro semanas","hot":["Cuatro semanas"],"sub":"Ese es el plazo real. No tres días.","image":staticFile('img/vn2_f40.png'),"mood":"cool"},
  /* b336 1133.5s */ {},
  /* b337 1136.8s */ {"src":staticFile('broll/vn2vhn3n8eqs/vn2_f42.mp4'),"video":true,"mood":"warmdark","ken":"out"},
  /* b338 1140.8s */ {"kicker":"PRUEBA DEL PARCHE","value":48,"suffix":" horas","label":"Antes de ponérselo en la cara","sub":"Una gota, una curita y esperar","image":staticFile('img/vn2_f43.png'),"mood":"science","prefix":"","decimals":0},
  /* b339 1144.6s */ {"src":staticFile('img/vn2_f44.png'),"video":false,"mood":"warmdark","ken":"right"},
  /* b340 1147.3s */ {"kicker":"OBLIGATORIO","title":"Con el argán y los de frutos secos no es opcional","hot":["no es opcional"],"sub":"Son los que más alergia dan","image":staticFile('img/vn2_f45.png'),"mood":"warmdark","side":"left"},
  /* b341 1150.8s */ {"src":staticFile('broll/vn2vhn3n8eqs/vn2_f46.mp4'),"video":true,"mood":"warmdark","ken":"out"},
  /* b342 1153.1s */ {},
  /* b343 1155.4s */ {"kicker":"SI HUELE ASÍ, TÍRELO","title":"Señales de un aceite rancio","hot":["rancio"],"items":["Olor a pintura vieja","Olor a crayón","Olor rancio, a viejo"],"mood":"warmdark"},
  /* b344 1159.4s */ {"kicker":"QUÍMICA","title":"Un aceite oxidado es un pro-oxidante","hot":["pro-oxidante"],"sub":"Le hace exactamente lo contrario","centerLabel":"OXIDACIÓN","nodes":[{"label":"Radicales libres"},{"label":"Inflamación"},{"label":"Menos colágeno"},{"label":"Más daño"}],"image":staticFile('img/vn2_f49.png'),"mood":"science"},
  /* b345 1162.9s */ {"src":staticFile('broll/vn2vhn3n8eqs/vn2_f50.mp4'),"video":true,"mood":"warmdark","ken":"out"},
  /* b346 1166.5s */ {"kicker":"EL RESUMEN","title":"Esta noche, tres cosas","hot":["tres cosas"],"items":["Girasol alto linoleico","Piel húmeda primero, aceite después","Aceites de noche, protector de día"],"mood":"cool"},
  /* b347 1169.4s */ {"src":staticFile('broll/vn2vhn3n8eqs/vn2_f52.mp4'),"video":true,"mood":"warmdark","ken":"right"},
  /* b348 1171.6s */ {"kicker":"UNO","title":"Girasol ALTO LINOLEICO","hot":["ALTO LINOLEICO"],"sub":"Su reparador de barrera número uno","image":staticFile('img/vn2_f53.png'),"mood":"gold","side":"right"},
  /* b349 1175.1s */ {},
  /* b350 1177s */ {"kicker":"DOS","title":"Piel húmeda primero. Aceite después.","hot":["Siempre"],"sub":"Siempre","image":staticFile('img/vn2_fb_cool.png'),"mood":"cool","side":"left"},
  /* b351 1181.2s */ {},
  /* b352 1183.7s */ {"kicker":"TRES","title":"Aceites de noche. De día, protector solar.","hot":["protector solar"],"sub":"Nunca al revés","image":staticFile('img/vn2_f57.png'),"mood":"warmdark","side":"right"},
  /* b353 1187.2s */ {"kicker":"FOTOENVEJECIMIENTO","value":80,"suffix":"%","label":"De lo que ve en el espejo se lo hizo el SOL","sub":"No el calendario","image":staticFile('img/vn2_f58.png'),"mood":"gold","prefix":"","decimals":0},
  /* b354 1191.9s */ {"kicker":"GRATIS","title":"La ficha completa está en la descripción","hot":["ficha completa"],"sub":"Para que no tenga que anotar nada mientras mira","buttonLabel":"Mire la descripción","image":staticFile('img/vn2_f59.png'),"mood":"gold"},
  /* b355 1194.9s */ {},
  /* b356 1197s */ {"src":staticFile('img/vn2_f61.png'),"video":false,"mood":"warmdark","ken":"in"},
  /* b357 1200.7s */ {},
  /* b358 1203.3s */ {"src":staticFile('broll/vn2vhn3n8eqs/vn2_f63.mp4'),"video":true,"mood":"warmdark","ken":"left"},
  /* b359 1206s */ {},
  /* b360 1208s */ {"src":staticFile('broll/vn2vhn3n8eqs/vn2_f65.mp4'),"video":true,"mood":"warmdark","ken":"in"},
  /* b361 1211.1s */ {"kicker":"ESCRÍBAME","title":"¿Qué aceite tiene en la cocina ahora mismo?","hot":["en la cocina"],"sub":"Vaya, mire la etiqueta y cuéntemelo","image":staticFile('img/vn2_f66.png'),"mood":"gold","side":"left"},
  /* b362 1213.7s */ {"src":staticFile('broll/vn2vhn3n8eqs/vn2_f67.mp4'),"video":true,"mood":"warmdark","ken":"left"},
  /* b363 1217.8s */ {},
  /* b364 1220.4s */ {"src":staticFile('img/vn2_f69.png'),"video":false,"mood":"warmdark","ken":"in"},
  /* b365 1222.9s */ {"kicker":"EN EL PRÓXIMO VIDEO","index":"08","title":"LO QUE LE DIJERON","sub":"Algo que discute con la mitad de lo que le contaron","mood":"warmdark"},
  /* b366 1227.7s */ {"src":staticFile('broll/vn2vhn3n8eqs/vn2_f71.mp4'),"video":true,"mood":"warmdark","ken":"left"},
  /* b367 1231.5s */ {"kicker":"EN USO DESDE","value":1872,"suffix":"","label":"Y sigue costando monedas","sub":"Está en cualquier farmacia, en el estante de abajo","image":staticFile('img/vn2_f72.png'),"mood":"warmdark","prefix":"","decimals":0},
  /* b368 1234.5s */ {"kicker":"PÉRDIDA DE AGUA","value":99,"suffix":"%","label":"Menos pérdida de agua por la piel","sub":"Casi la corta del todo","image":staticFile('img/vn2_f73.png'),"mood":"science","prefix":"","decimals":0},
  /* b369 1237.1s */ {},
  /* b370 1238.7s */ {"kicker":"LOS ACEITES DE HOY","value":30,"suffix":"%","label":"Ninguno de este video pasa de ahí","sub":"Y son los mejores que hay","image":staticFile('img/vn2_f75.png'),"mood":"cool","prefix":"","decimals":0},
  /* b371 1241.5s */ {},
  /* b372 1244.5s */ {"src":staticFile('img/vn2_f77.png'),"video":false,"mood":"warmdark","ken":"in"},
  /* b373 1247.7s */ {"kicker":"ESTUDIO","value":1992,"suffix":"","label":"Lo demostró mirando la piel con microscopio","sub":"Poro por poro","image":staticFile('img/vn2_f78.png'),"mood":"science","prefix":"","decimals":0},
  /* b374 1250.4s */ {},
  /* b375 1255.3s */ {"name":"Dr. Valler","role":"Médico","topic":"Cuídese del sol de día","avatarSrc":null},
  /* b376 1258.4s */ {},
];

/* ---------------------- L0 · avatar persistente (audio) ------------------- */
const CUTS: number[] = [2.6, 5.4, 11.4, 14.4, 20.9, 24.1, 29.2, 33.8, 36.5, 39, 45, 51.1, 57.9, 62.1, 65.3, 74.4, 77.5, 84.3, 93, 102.6, 112.1, 121.1, 126.5, 136.4, 140.8, 157.8, 161.4, 165, 170.9, 174.6, 178.9, 185.2, 194.5, 199.4, 203.5, 211.8, 221.1, 229.1, 230.7, 238.7, 242, 246.4, 250.6, 257.7, 261.9, 271, 276.5, 285.8, 296.7, 299.7, 302.7, 306.4, 310.5, 316.6, 323.3, 328.6, 334.9, 337.5, 339.9, 344.8, 347.9, 353.1, 358.4, 365, 369.9, 374.6, 380.4, 384.1, 387.8, 391, 396.3, 400.3, 402.9, 406.1, 412.4, 415.3, 421.8, 426.7, 430.2, 434.7, 439.5, 443.9, 450, 454.8, 458.5, 465.8, 469.5, 474.5, 485.7, 490.6, 493.9, 499.2, 504.9, 510.3, 518.6, 524.3, 527.6, 530.9, 534.9, 537, 539.5, 545.9, 549.5, 557.2, 567.5, 576.3, 580.3, 584.7, 589, 595.8, 603.6, 608.3, 610.9, 615, 624.9, 629.4, 631.8, 640.8, 653.2, 656.4, 659.5, 662.9, 668.3, 674.6, 676.4, 681.2, 685.1, 692.6, 696.9, 702.8, 709.9, 719.3, 721.9, 724.5, 730.9, 734.6, 741.4, 747.7, 751.3, 759.3, 765, 766.9, 772.9, 778.8, 784.8, 788, 791.2, 794.1, 798.1, 803.2, 810.3, 814.3, 816.9, 827, 829.1, 835.3, 841.2, 847.6, 854.5, 856.8, 863.2, 865.1, 869.9, 876.5, 879, 885.1, 889.6, 894.5, 900.4, 907.6, 911.2, 918.4, 921.3, 928.1, 931.9, 939, 945.7, 951.2, 957.1, 964.5, 966.3, 971.9, 975.5, 981, 983, 986.3, 993.2, 997, 1002, 1004.5, 1008.2, 1012.9, 1018.2, 1021.7, 1024.7, 1027.2, 1042.7, 1045, 1050.9, 1053.7, 1058, 1063.9, 1069.7, 1072.9, 1080, 1085.1, 1088.9, 1096, 1100.4, 1103.5, 1108.1, 1113.7, 1117, 1119.1, 1123.3, 1126.4, 1129.6, 1136.8, 1140.8, 1144.6, 1147.3, 1150.8, 1155.4, 1159.4, 1162.9, 1166.5, 1169.4, 1171.6, 1177, 1183.7, 1187.2, 1191.9, 1197, 1203.3, 1208, 1211.1, 1213.7, 1220.4, 1222.9, 1227.7, 1231.5, 1234.5, 1238.7, 1244.5, 1247.7];

const AvatarLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height, durationInFrames} = useVideoConfig();
  const t = frame / fps;
  let act = 0;
  for (let i = 0; i < CUTS.length; i++) {
    const d = Math.abs(t - CUTS[i]);
    if (d > 0.5) continue;
    const b = interpolate(d, [0, 0.5], [1, 0], CLAMP);
    if (b > act) act = b;
  }
  const push = interpolate(frame, [0, durationInFrames], [1, 1.045], CLAMP);
  const hx =
    Math.sin(frame * 0.05) * width * 0.0012 + Math.sin(frame * 0.016 + 1.1) * width * 0.0018;
  const hy = Math.cos(frame * 0.042 + 0.7) * height * 0.0014;
  return (
    <>
      <AbsoluteFill
        style={{
          transform: `translate(${(hx - act * width * 0.02).toFixed(1)}px, ${hy.toFixed(
            1
          )}px) scale(${(push * (1 + act * 0.016)).toFixed(4)})`,
          filter: `blur(${(act * 7).toFixed(2)}px)`,
          willChange: 'transform, filter',
        }}
      >
        <OffthreadVideo src={AVATAR} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        <AbsoluteFill
          style={{
            pointerEvents: 'none',
            background:
              'linear-gradient(160deg, rgba(233,180,76,0.05), transparent 38%, transparent 68%, rgba(2,6,14,0.3))',
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background:
            'radial-gradient(120% 100% at 50% 42%, transparent 60%, rgba(2,5,12,0.46) 100%)',
        }}
      />
    </>
  );
};

/* ================================ COMPOSICIÓN ============================= */

export const MainVn2: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const fadeIn = interpolate(frame, [0, Math.round(0.4 * fps)], [1, 0], CLAMP);
  const foS = Math.max(0, durationInFrames - Math.round(0.7 * fps));
  const fadeOut = interpolate(frame, [foS, Math.max(foS + 1, durationInFrames - 1)], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{background: '#020409', overflow: 'hidden'}}>
      <AvatarLayer />

      <Sequence from={252} durationInFrames={90} name="LT b003">
        <FedLowerThird {...P[3]} totalF={90} accent={ACCENT} avatarSrc={null} />
      </Sequence>
      <Sequence from={1668} durationInFrames={63} name="LT b016">
        <FedLowerThird {...P[16]} totalF={63} accent={ACCENT} avatarSrc={null} />
      </Sequence>
      <Sequence from={2139} durationInFrames={90} name="LT b020">
        <FedLowerThird {...P[20]} totalF={90} accent={ACCENT} avatarSrc={null} />
      </Sequence>
      <Sequence from={2685} durationInFrames={99} name="LT b025">
        <FedLowerThird {...P[25]} totalF={99} accent={ACCENT} avatarSrc={null} />
      </Sequence>
      <Sequence from={3291} durationInFrames={72} name="LT b030">
        <FedLowerThird {...P[30]} totalF={72} accent={ACCENT} avatarSrc={null} />
      </Sequence>
      <Sequence from={3729} durationInFrames={63} name="LT b034">
        <FedLowerThird {...P[34]} totalF={63} accent={ACCENT} avatarSrc={null} />
      </Sequence>
      <Sequence from={4308} durationInFrames={129} name="LT b039">
        <FedLowerThird {...P[39]} totalF={129} accent={ACCENT} avatarSrc={null} />
      </Sequence>
      <Sequence from={6210} durationInFrames={135} name="LT b056">
        <FedLowerThird {...P[56]} totalF={135} accent={ACCENT} avatarSrc={null} />
      </Sequence>
      <Sequence from={6417} durationInFrames={99} name="LT b058">
        <FedLowerThird {...P[58]} totalF={99} accent={ACCENT} avatarSrc={null} />
      </Sequence>
      <Sequence from={7338} durationInFrames={54} name="LT b067">
        <FedLowerThird {...P[67]} totalF={54} accent={ACCENT} avatarSrc={null} />
      </Sequence>
      <Sequence from={8709} durationInFrames={102} name="LT b076">
        <FedLowerThird {...P[76]} totalF={102} accent={ACCENT} avatarSrc={null} />
      </Sequence>
      <Sequence from={9402} durationInFrames={87} name="LT b083">
        <FedLowerThird {...P[83]} totalF={87} accent={ACCENT} avatarSrc={null} />
      </Sequence>
      <Sequence from={9972} durationInFrames={75} name="LT b089">
        <FedLowerThird {...P[89]} totalF={75} accent={ACCENT} avatarSrc={null} />
      </Sequence>
      <Sequence from={11325} durationInFrames={84} name="LT b104">
        <FedLowerThird {...P[104]} totalF={84} accent={ACCENT} avatarSrc={null} />
      </Sequence>
      <Sequence from={12321} durationInFrames={51} name="LT b115">
        <FedLowerThird {...P[115]} totalF={51} accent={ACCENT} avatarSrc={null} />
      </Sequence>
      <Sequence from={13578} durationInFrames={60} name="LT b127">
        <FedLowerThird {...P[127]} totalF={60} accent={ACCENT} avatarSrc={null} />
      </Sequence>
      <Sequence from={13839} durationInFrames={57} name="LT b130">
        <FedLowerThird {...P[130]} totalF={57} accent={ACCENT} avatarSrc={null} />
      </Sequence>
      <Sequence from={14379} durationInFrames={84} name="LT b137">
        <FedLowerThird {...P[137]} totalF={84} accent={ACCENT} avatarSrc={null} />
      </Sequence>
      <Sequence from={15495} durationInFrames={57} name="LT b149">
        <FedLowerThird {...P[149]} totalF={57} accent={ACCENT} avatarSrc={null} />
      </Sequence>
      <Sequence from={15642} durationInFrames={87} name="LT b151">
        <FedLowerThird {...P[151]} totalF={87} accent={ACCENT} avatarSrc={null} />
      </Sequence>
      <Sequence from={16641} durationInFrames={69} name="LT b161">
        <FedLowerThird {...P[161]} totalF={69} accent={ACCENT} avatarSrc={null} />
      </Sequence>
      <Sequence from={17220} durationInFrames={69} name="LT b166">
        <FedLowerThird {...P[166]} totalF={69} accent={ACCENT} avatarSrc={null} />
      </Sequence>
      <Sequence from={18537} durationInFrames={105} name="LT b177">
        <FedLowerThird {...P[177]} totalF={105} accent={ACCENT} avatarSrc={null} />
      </Sequence>
      <Sequence from={19017} durationInFrames={120} name="LT b182">
        <FedLowerThird {...P[182]} totalF={120} accent={ACCENT} avatarSrc={null} />
      </Sequence>
      <Sequence from={19413} durationInFrames={81} name="LT b186">
        <FedLowerThird {...P[186]} totalF={81} accent={ACCENT} avatarSrc={null} />
      </Sequence>
      <Sequence from={20973} durationInFrames={111} name="LT b200">
        <FedLowerThird {...P[200]} totalF={111} accent={ACCENT} avatarSrc={null} />
      </Sequence>
      <Sequence from={21474} durationInFrames={105} name="LT b204">
        <FedLowerThird {...P[204]} totalF={105} accent={ACCENT} avatarSrc={null} />
      </Sequence>
      <Sequence from={22131} durationInFrames={111} name="LT b212">
        <FedLowerThird {...P[212]} totalF={111} accent={ACCENT} avatarSrc={null} />
      </Sequence>
      <Sequence from={23076} durationInFrames={108} name="LT b222">
        <FedLowerThird {...P[222]} totalF={108} accent={ACCENT} avatarSrc={null} />
      </Sequence>
      <Sequence from={24234} durationInFrames={75} name="LT b235">
        <FedLowerThird {...P[235]} totalF={75} accent={ACCENT} avatarSrc={null} />
      </Sequence>
      <Sequence from={32478} durationInFrames={72} name="LT b321">
        <FedLowerThird {...P[321]} totalF={72} accent={ACCENT} avatarSrc={null} />
      </Sequence>
      <Sequence from={37659} durationInFrames={93} name="LT b375">
        <FedLowerThird {...P[375]} totalF={93} accent={ACCENT} avatarSrc={null} />
      </Sequence>

      {/* 2.6s · y uno de ellos le repara la barrera de la piel */}
      <Sequence from={78} durationInFrames={96} name="FedFullShot b001">
        <FedFullShot {...P[1]} totalF={96} accent={ACCENT} />
      </Sequence>
      {/* 5.4s · mejor que la crema más cara de la farmacia. */}
      <Sequence from={162} durationInFrames={99} name="FedHero b002">
        <FedHero {...P[2]} totalF={99} accent={ACCENT} />
      </Sequence>
      {/* 11.4s · porque le dijeron que era el más sano del mundo, */}
      <Sequence from={342} durationInFrames={102} name="FedFullShot b004">
        <FedFullShot {...P[4]} totalF={102} accent={ACCENT} />
      </Sequence>
      {/* 14.4s · que se la está rompiendo mientras usted cree que se la está cu */}
      <Sequence from={432} durationInFrames={105} name="FedHero b005">
        <FedHero {...P[5]} totalF={105} accent={ACCENT} />
      </Sequence>
      {/* 20.9s · Año 2013, revista Pediatric Dermatology. */}
      <Sequence from={627} durationInFrames={108} name="FedChapter b007">
        <FedChapter {...P[7]} totalF={108} accent={ACCENT} />
      </Sequence>
      {/* 24.1s · El equipo del Dr. Simon Danby, Universidad de Sheffield, 19 ad */}
      <Sequence from={723} durationInFrames={162} name="FedStat b008">
        <FedTrial journal={"Pediatric Dermatology"} year={"2013"} n={19} design={"aleatorizado · dos antebrazos · 4 semanas"} title={"El equipo del Dr. Simon Danby"} sub={"Universidad de Sheffield"} groupA={{"label":"Aceite de oliva","value":19,"suffix":"","tone":"bad"}} groupB={{"label":"Aceite de girasol","value":19,"suffix":"","tone":"good"}} unit={"adultos por brazo"} totalF={162} accent={ACCENT} />
      </Sequence>
      {/* 29.2s · 6 gotas de aceite en un antebrazo, 2 veces por día, 4 semanas. */}
      <Sequence from={876} durationInFrames={141} name="FedChecklist b009">
        <FedChecklist {...P[9]} totalF={141} accent={ACCENT} />
      </Sequence>
      {/* 33.8s · En un brazo, aceite de oliva extravirgen. */}
      <Sequence from={1014} durationInFrames={87} name="FedFullShot b010">
        <FedFullShot {...P[10]} totalF={87} accent={ACCENT} />
      </Sequence>
      {/* 36.5s · En el otro, aceite de girasol común. */}
      <Sequence from={1095} durationInFrames={78} name="FedFullShot b011">
        <FedFullShot {...P[11]} totalF={78} accent={ACCENT} />
      </Sequence>
      {/* 39s · El brazo del aceite de oliva terminó perdiendo más agua que an */}
      <Sequence from={1170} durationInFrames={186} name="FedHero b012">
        <FedTrial journal={"Pediatric Dermatology"} year={"2013"} n={19} design={"pérdida de agua medida a las 4 semanas"} title={"El brazo del oliva perdió MÁS agua"} sub={"que antes de empezar"} groupA={{"label":"Oliva","value":24,"suffix":"%","tone":"bad"}} groupB={{"label":"Girasol","value":7,"suffix":"%","tone":"good"}} unit={"pérdida de agua"} verdict={"El oliva desarma la barrera"} totalF={186} accent={ACCENT} />
      </Sequence>
      {/* 45s · Y no solo en los de piel delicada, también en los que tenían l */}
      <Sequence from={1350} durationInFrames={138} name="FedChecklist b013">
        <FedChecklist {...P[13]} totalF={138} accent={ACCENT} />
      </Sequence>
      {/* 51.1s · Ese conservó la barrera, no enrojeció, y encima mejoró la hidr */}
      <Sequence from={1533} durationInFrames={141} name="FedChecklist b015">
        <FedChecklist {...P[15]} totalF={141} accent={ACCENT} />
      </Sequence>
      {/* 57.9s · El aceite de oliva. El mismo que le hace bien al corazón cuand */}
      <Sequence from={1737} durationInFrames={132} name="FedFullShot b017">
        <FedFullShot {...P[17]} totalF={132} accent={ACCENT} />
      </Sequence>
      {/* 62.1s · Cuando se lo unta en la piel seca, le desarma la barrera. */}
      <Sequence from={1863} durationInFrames={105} name="FedHero b018">
        <FedHero {...P[18]} totalF={105} accent={ACCENT} />
      </Sequence>
      {/* 65.3s · Y el girasol, el más barato de la góndola, el que ninguna marc */}
      <Sequence from={1959} durationInFrames={189} name="FedHero b019">
        <FedHero {...P[19]} totalF={189} accent={ACCENT} />
      </Sequence>
      {/* 74.4s · ¿Cuál sirve para qué? ¿Cuántas gotas y en qué orden? */}
      <Sequence from={2232} durationInFrames={105} name="FedStat b021">
        <FedStat {...P[21]} totalF={105} accent={ACCENT} />
      </Sequence>
      {/* 77.5s · Y quédese hasta el final, porque hay un error que arruina el 9 */}
      <Sequence from={2325} durationInFrames={156} name="FedStat b022">
        <FedStat {...P[22]} totalF={156} accent={ACCENT} />
      </Sequence>
      {/* 84.3s · Es otra cosa, mucho más simple, que la mayoría hace todas las  */}
      <Sequence from={2529} durationInFrames={159} name="FedFullShot b024">
        <FedFullShot {...P[24]} totalF={159} accent={ACCENT} />
      </Sequence>
      {/* 93s · Incluso gente que vende cremas. En su cara están pasando dos c */}
      <Sequence from={2790} durationInFrames={168} name="FedChapter b026">
        <FedChapter {...P[26]} totalF={168} accent={ACCENT} />
      </Sequence>
      {/* 102.6s · Y es la que se ve opaca, áspera, apagada. Con esas líneas fina */}
      <Sequence from={3078} durationInFrames={183} name="FedChecklist b028">
        <FedChecklist {...P[28]} totalF={183} accent={ACCENT} />
      </Sequence>
      {/* 112.1s · Pasa abajo, en tejido vivo, y se pierde alrededor de un 1% por */}
      <Sequence from={3363} durationInFrames={189} name="FedStat b031">
        <FedStat {...P[31]} totalF={189} accent={ACCENT} />
      </Sequence>
      {/* 121.1s · Y eso ningún aceite del mundo lo toca, ninguno. */}
      <Sequence from={3633} durationInFrames={105} name="FedFullShot b033">
        <FedFullShot {...P[33]} totalF={105} accent={ACCENT} />
      </Sequence>
      {/* 126.5s · Así que cuando le digo que un aceite le puede cambiar la cara  */}
      <Sequence from={3795} durationInFrames={180} name="FedStat b035">
        <FedStat {...P[35]} totalF={180} accent={ACCENT} />
      </Sequence>
      {/* 136.4s · es una capa de arriba deshidratada, que refleja mal la luz y l */}
      <Sequence from={4092} durationInFrames={141} name="FedHero b037">
        <FedHero {...P[37]} totalF={141} accent={ACCENT} />
      </Sequence>
      {/* 140.8s · Eso sí se arregla, con lo que ya tiene en la alacena. */}
      <Sequence from={4224} durationInFrames={93} name="FedFullShot b038">
        <FedFullShot {...P[38]} totalF={93} accent={ACCENT} />
      </Sequence>
      {/* 157.8s · un cuarto colesterol, el resto ácidos grasos. */}
      <Sequence from={4734} durationInFrames={120} name="FedMolecule b042">
        <FedBrickWall state={"build"} title={"La pared de su piel"} sub={"ladrillos de células muertas, cemento de grasa"} legend={[{"label":"Ceramidas","pct":"50%"},{"label":"Colesterol","pct":"25%"},{"label":"Ácidos grasos","pct":"25%"}]} brickLabel={"Células muertas"} cementLabel={"Cemento de grasa"} totalF={120} accent={ACCENT} />
      </Sequence>
      {/* 161.4s · Cuando ese cemento se desarma, usted tiene picazón, tirantez */}
      <Sequence from={4842} durationInFrames={120} name="FedFullShot b043">
        <FedBrickWall state={"leaking"} title={"Cuando el cemento se desarma"} sub={"picazón, tirantez, y la crema que se va en dos horas"} legend={[{"label":"Juntas vacías","pct":"—"}]} brickLabel={"Células muertas"} cementLabel={"Cemento faltante"} totalF={120} accent={ACCENT} />
      </Sequence>
      {/* 165s · y esa sensación de que la crema se le fue en dos horas. */}
      <Sequence from={4950} durationInFrames={120} name="FedChecklist b044">
        <FedChecklist {...P[44]} totalF={120} accent={ACCENT} />
      </Sequence>
      {/* 170.9s · Lo que decide si un aceite repara ese cemento o lo rompe, */}
      <Sequence from={5127} durationInFrames={123} name="FedFullShot b046">
        <FedFullShot {...P[46]} totalF={123} accent={ACCENT} />
      </Sequence>
      {/* 174.6s · no es el precio, no es la marca, no es el aroma ni si dice org */}
      <Sequence from={5238} durationInFrames={135} name="FedChecklist b047">
        <FedChecklist {...P[47]} totalF={135} accent={ACCENT} />
      </Sequence>
      {/* 178.9s · Es la proporción entre dos grasas, el ácido linoleico y el áci */}
      <Sequence from={5367} durationInFrames={150} name="FedMolecule b048">
        <FedMolecule {...P[48]} totalF={150} accent={ACCENT} />
      </Sequence>
      {/* 185.2s · Su cuerpo no lo fabrica, tiene que entrar de afuera. */}
      <Sequence from={5556} durationInFrames={96} name="FedHero b050">
        <FedHero {...P[50]} totalF={96} accent={ACCENT} />
      </Sequence>
      {/* 194.5s · Sin linoleico no hay remache, sin remache la pared filtra. */}
      <Sequence from={5835} durationInFrames={126} name="FedHero b052">
        <FedRivet mode={"rivet"} title={"Sin linoleico no hay remache"} sub={"y sin remache, la pared filtra"} chainLabel={"Ácido linoleico"} targetLabel={"Ceramida"} resultLabel={"Acilceramida · el remache"} totalF={126} accent={ACCENT} />
      </Sequence>
      {/* 199.4s · Los niveles de esa ceramida bajan en invierno */}
      <Sequence from={5982} durationInFrames={135} name="FedFullShot b054">
        <FedFullShot {...P[54]} totalF={135} accent={ACCENT} />
      </Sequence>
      {/* 203.5s · y se normalizan aplicando grasas ricas en linoleico durante cu */}
      <Sequence from={6105} durationInFrames={117} name="FedStat b055">
        <FedStat {...P[55]} totalF={117} accent={ACCENT} />
      </Sequence>
      {/* 211.8s · El ácido oleico hace lo contrario. */}
      <Sequence from={6354} durationInFrames={72} name="FedChapter b057">
        <FedChapter {...P[57]} totalF={72} accent={ACCENT} />
      </Sequence>
      {/* 221.1s · La industria lo usa a propósito cuando quiere que un medicamen */}
      <Sequence from={6633} durationInFrames={150} name="FedFullShot b060">
        <FedRivet mode={"disorder"} title={"El oleico abre la puerta"} sub={"la industria lo usa para que un medicamento atraviese la piel"} chainLabel={"Ácido oleico"} targetLabel={"Láminas de grasa"} resultLabel={"La pared filtra"} totalF={150} accent={ACCENT} />
      </Sequence>
      {/* 229.1s · Ahora haga la cuenta. */}
      <Sequence from={6873} durationInFrames={54} name="FedFullShot b062">
        <FedFullShot {...P[62]} totalF={54} accent={ACCENT} />
      </Sequence>
      {/* 230.7s · El aceite de oliva tiene hasta un 83% de oleico y muy poco lin */}
      <Sequence from={6921} durationInFrames={183} name="FedStat b063">
        <FedOilBars title={"La proporción decide"} sub={"no el precio, no la marca, no el aroma"} highlight={"Oliva"} cutoff={40} cutoffLabel={"mínimo útil"} foot={"El oliva tiene la peor relación de la lista."} totalF={183} accent={ACCENT} />
      </Sequence>
      {/* 238.7s · No es que el oliva sea malo, */}
      <Sequence from={7161} durationInFrames={111} name="FedFullShot b065">
        <FedFullShot {...P[65]} totalF={111} accent={ACCENT} />
      </Sequence>
      {/* 242s · es que usted le está pidiendo que haga exactamente lo contrari */}
      <Sequence from={7260} durationInFrames={87} name="FedHero b066">
        <FedHero {...P[66]} totalF={87} accent={ACCENT} />
      </Sequence>
      {/* 246.4s · Si el aceite con mejor evidencia de reparación de barrera en h */}
      <Sequence from={7392} durationInFrames={138} name="FedFullShot b068">
        <FedFullShot {...P[68]} totalF={138} accent={ACCENT} />
      </Sequence>
      {/* 250.6s · ¿por qué usted nunca vio una publicidad de aceite de girasol p */}
      <Sequence from={7518} durationInFrames={180} name="FedQuote b069">
        <FedQuote {...P[69]} totalF={180} accent={ACCENT} />
      </Sequence>
      {/* 257.7s · Nadie construye una marca sobre algo que usted ya tiene en la  */}
      <Sequence from={7731} durationInFrames={135} name="FedHero b071">
        <FedHero {...P[71]} totalF={135} accent={ACCENT} />
      </Sequence>
      {/* 261.9s · La industria necesita una historia exótica, una semilla de un  */}
      <Sequence from={7857} durationInFrames={177} name="FedHero b072">
        <FedHero {...P[72]} totalF={177} accent={ACCENT} />
      </Sequence>
      {/* 271s · Vamos a los siete */}
      <Sequence from={8130} durationInFrames={177} name="FedOilCarousel b073">
        <FedOilCarousel {...P[73]} totalF={177} accent={ACCENT} />
      </Sequence>
      {/* 276.5s · Número 1 */}
      <Sequence from={8295} durationInFrames={183} name="FedOilCarousel b074">
        <FedOilCarousel {...P[74]} totalF={183} accent={ACCENT} />
      </Sequence>
      {/* 285.8s · Es el aceite con más linoleico que usted puede comprar sin sal */}
      <Sequence from={8574} durationInFrames={141} name="FedHero b075">
        <FedHero {...P[75]} totalF={141} accent={ACCENT} />
      </Sequence>
      {/* 296.7s · En Bangladesh, en el hospital Dhaka Shishu... */}
      <Sequence from={8901} durationInFrames={102} name="FedFullShot b078">
        <FedFullShot {...P[78]} totalF={102} accent={ACCENT} />
      </Sequence>
      {/* 299.7s · ...se aplicó aceite de girasol en la piel de bebés prematuros. */}
      <Sequence from={8991} durationInFrames={96} name="FedFullShot b079">
        <FedFullShot {...P[79]} totalF={96} accent={ACCENT} />
      </Sequence>
      {/* 302.7s · La terapia de barrera con girasol se asoció a una reducción... */}
      <Sequence from={9081} durationInFrames={123} name="FedFullShot b080">
        <FedFullShot {...P[80]} totalF={123} accent={ACCENT} />
      </Sequence>
      {/* 306.4s · ...de alrededor del 26% en la mortalidad de esos prematuros. */}
      <Sequence from={9192} durationInFrames={126} name="FedStat b081">
        <FedStat {...P[81]} totalF={126} accent={ACCENT} />
      </Sequence>
      {/* 310.5s · Se publicó en The Lancet, un aceite de cocina untado en la pie */}
      <Sequence from={9315} durationInFrames={99} name="FedQuote b082">
        <FedQuote {...P[82]} totalF={99} accent={ACCENT} />
      </Sequence>
      {/* 316.6s · Porque la barrera de la piel no es cosmética, es un órgano de  */}
      <Sequence from={9498} durationInFrames={126} name="FedMolecule b084">
        <FedMolecule {...P[84]} totalF={126} accent={ACCENT} />
      </Sequence>
      {/* 323.3s · Hay dos aceites de girasol distintos... */}
      <Sequence from={9699} durationInFrames={87} name="FedFullShot b086">
        <FedFullShot {...P[86]} totalF={87} accent={ACCENT} />
      </Sequence>
      {/* 328.6s · Está el común alto linoleico que es el que le sirve. */}
      <Sequence from={9858} durationInFrames={126} name="FedHero b088">
        <FedLabelScan title={"El girasol común"} sub={"este es el que le sirve"} labelName={"ACEITE DE GIRASOL"} labelSub={"alto linoleico"} verdict={"ok"} verdictLabel={"PARA LA PIEL"} liquid={"#D8A33C"} bars={[{"label":"Linoleico","pct":60,"tone":"good"},{"label":"Oleico","pct":25,"tone":"bad"}]} totalF={126} accent={ACCENT} />
      </Sequence>
      {/* 334.9s · ...porque aguanta mejor la fritura. */}
      <Sequence from={10047} durationInFrames={81} name="FedHero b090">
        <FedHero {...P[90]} totalF={81} accent={ACCENT} />
      </Sequence>
      {/* 337.5s · Hasta un 90% de oleico... */}
      <Sequence from={10125} durationInFrames={84} name="FedStat b091">
        <FedStat {...P[91]} totalF={84} accent={ACCENT} />
      </Sequence>
      {/* 339.9s · ...y apenas 2 a 10% del linoleico. */}
      <Sequence from={10197} durationInFrames={81} name="FedStat b092">
        <FedStat {...P[92]} totalF={81} accent={ACCENT} />
      </Sequence>
      {/* 344.8s · Uno es el mejor reparador de barrera de su alacena. */}
      <Sequence from={10344} durationInFrames={99} name="FedBeforeAfter b094">
        <FedBeforeAfter {...P[94]} totalF={99} accent={ACCENT} />
      </Sequence>
      {/* 347.9s · El otro se parece bioquímicamente al aceite de oliva. */}
      <Sequence from={10437} durationInFrames={108} name="FedFullShot b095">
        <FedFullShot {...P[95]} totalF={108} accent={ACCENT} />
      </Sequence>
      {/* 353.1s · Si dice alto oleico, esa es para la sartén. Si no lo dice, esa */}
      <Sequence from={10593} durationInFrames={171} name="FedChecklist b097">
        <FedLabelScan title={"Si dice ALTO OLEICO"} sub={"esa es para la sartén"} labelName={"ACEITE DE GIRASOL"} labelSub={"alto oleico"} verdict={"bad"} verdictLabel={"PARA LA SARTÉN"} liquid={"#C9932F"} bars={[{"label":"Oleico","pct":90,"tone":"bad"},{"label":"Linoleico","pct":8,"tone":"good"}]} totalF={171} accent={ACCENT} />
      </Sequence>
      {/* 358.4s · Número 2 */}
      <Sequence from={10752} durationInFrames={168} name="FedOilCarousel b098">
        <FedOilCarousel {...P[98]} totalF={168} accent={ACCENT} />
      </Sequence>
      {/* 365s · Casi todos los estudios de aceites en piel se hicieron en bebé */}
      <Sequence from={10950} durationInFrames={87} name="FedFullShot b099">
        <FedFullShot {...P[99]} totalF={87} accent={ACCENT} />
      </Sequence>
      {/* 369.9s · Piel de 60 o 70 años casi no hay. */}
      <Sequence from={11097} durationInFrames={96} name="FedFullShot b101">
        <FedFullShot {...P[101]} totalF={96} accent={ACCENT} />
      </Sequence>
      {/* 374.6s · Ensayo aleatorizado con evaluador ciego. */}
      <Sequence from={11238} durationInFrames={96} name="FedStep b103">
        <FedStep {...P[103]} totalF={96} accent={ACCENT} />
      </Sequence>
      {/* 380.4s · 148 personas, edad promedio 68 años. */}
      <Sequence from={11412} durationInFrames={117} name="FedStat b105">
        <FedTrial journal={"Acta Medica Philippina"} year={"2023"} n={148} design={"aleatorizado · evaluador ciego · piel madura"} title={"148 personas, 68 años de promedio"} sub={"coco virgen contra aceite mineral"} groupA={{"label":"Coco virgen","value":68,"suffix":"%","tone":"good"}} groupB={{"label":"Aceite mineral","value":38,"suffix":"%","tone":"bad"}} unit={"mejoría"} verdict={"Ganó el coco"} totalF={117} accent={ACCENT} />
      </Sequence>
      {/* 384.1s · Con esa piel de la pierna que se descama como escamas de pesca */}
      <Sequence from={11523} durationInFrames={114} name="FedFullShot b106">
        <FedFullShot {...P[106]} totalF={114} accent={ACCENT} />
      </Sequence>
      {/* 387.8s · Coco virgen contra aceite mineral. El coco ganó. */}
      <Sequence from={11634} durationInFrames={105} name="FedHero b107">
        <FedHero {...P[107]} totalF={105} accent={ACCENT} />
      </Sequence>
      {/* 391s · Y en otro ensayo, cabeza a cabeza contra el oliva. */}
      <Sequence from={11730} durationInFrames={99} name="FedFullShot b108">
        <FedFullShot {...P[108]} totalF={99} accent={ACCENT} />
      </Sequence>
      {/* 396.3s · Había 20 pacientes con la piel colonizada por estafilococo dor */}
      <Sequence from={11889} durationInFrames={126} name="FedStat b110">
        <FedStat {...P[110]} totalF={126} accent={ACCENT} />
      </Sequence>
      {/* 400.3s · En el grupo del coco, al final quedaba uno. */}
      <Sequence from={12009} durationInFrames={81} name="FedStat b111">
        <FedStat {...P[111]} totalF={81} accent={ACCENT} />
      </Sequence>
      {/* 402.9s · En el del oliva, de 12 colonizados, quedaban 6. */}
      <Sequence from={12087} durationInFrames={102} name="FedStat b112">
        <FedStat {...P[112]} totalF={102} accent={ACCENT} />
      </Sequence>
      {/* 406.1s · Eso es el ácido láurico, que es casi la mitad del coco. */}
      <Sequence from={12183} durationInFrames={105} name="FedMolecule b113">
        <FedMolecule {...P[113]} totalF={105} accent={ACCENT} />
      </Sequence>
      {/* 412.4s · ...cero, ni de elasticidad. */}
      <Sequence from={12372} durationInFrames={93} name="FedChecklist b116">
        <FedChecklist {...P[116]} totalF={93} accent={ACCENT} />
      </Sequence>
      {/* 415.3s · Es un reparador de barrera con efecto antibacteriano. */}
      <Sequence from={12459} durationInFrames={90} name="FedHero b117">
        <FedHero {...P[117]} totalF={90} accent={ACCENT} />
      </Sequence>
      {/* 421.8s · Y lo de los poros. Usted escuchó que el coco es comedogénico g */}
      <Sequence from={12654} durationInFrames={150} name="FedFullShot b119">
        <FedFullShot {...P[119]} totalF={150} accent={ACCENT} />
      </Sequence>
      {/* 426.7s · Ese número sale de un test de 1972. */}
      <Sequence from={12801} durationInFrames={117} name="FedStat b120">
        <FedStat {...P[120]} totalF={117} accent={ACCENT} />
      </Sequence>
      {/* 430.2s · Poner el ingrediente puro en la oreja de un conejo y contar pu */}
      <Sequence from={12906} durationInFrames={144} name="FedFullShot b121">
        <FedFullShot {...P[121]} totalF={144} accent={ACCENT} />
      </Sequence>
      {/* 434.7s · Hoy se considera que eso no predice lo que pasa en piel humana */}
      <Sequence from={13041} durationInFrames={111} name="FedChecklist b122">
        <FedChecklist {...P[122]} totalF={111} accent={ACCENT} />
      </Sequence>
      {/* 439.5s · Pero si su piel hace granitos, no se lo ponga en la cara. */}
      <Sequence from={13185} durationInFrames={102} name="FedFullShot b124">
        <FedFullShot {...P[124]} totalF={102} accent={ACCENT} />
      </Sequence>
      {/* 443.9s · Número 3 */}
      <Sequence from={13317} durationInFrames={171} name="FedOilCarousel b125">
        <FedOilCarousel {...P[125]} totalF={171} accent={ACCENT} />
      </Sequence>
      {/* 450s · (entrada) Rosa mosqueta */}
      <Sequence from={13500} durationInFrames={90} name="FedFullShot b126">
        <FedFullShot {...P[126]} totalF={90} accent={ACCENT} />
      </Sequence>
      {/* 454.8s · Entre 36 y 55% de linoleico. */}
      <Sequence from={13644} durationInFrames={117} name="FedStat b128">
        <FedStat {...P[128]} totalF={117} accent={ACCENT} />
      </Sequence>
      {/* 458.5s · Mucho omega 3 y poquísimo oleico. */}
      <Sequence from={13755} durationInFrames={90} name="FedMolecule b129">
        <FedMolecule {...P[129]} totalF={90} accent={ACCENT} />
      </Sequence>
      {/* 465.8s · Lo mejor que tiene es un estudio piloto de 27 personas. */}
      <Sequence from={13974} durationInFrames={120} name="FedStat b132">
        <FedStat {...P[132]} totalF={120} accent={ACCENT} />
      </Sequence>
      {/* 469.5s · Sin grupo control, sin placebo y sin ciego. */}
      <Sequence from={14085} durationInFrames={99} name="FedChecklist b133">
        <FedChecklist {...P[133]} totalF={99} accent={ACCENT} />
      </Sequence>
      {/* 474.5s · Y hay un ensayo aleatorizado donde la rosa mosqueta directamen */}
      <Sequence from={14235} durationInFrames={87} name="FedHero b135">
        <FedHero {...P[135]} totalF={87} accent={ACCENT} />
      </Sequence>
      {/* 485.7s · Le van a decir que la rosa mosqueta es el retinol natural. */}
      <Sequence from={14571} durationInFrames={108} name="FedFullShot b139">
        <FedFullShot {...P[139]} totalF={108} accent={ACCENT} />
      </Sequence>
      {/* 490.6s · El retinol lo fabrican los animales, no las plantas. */}
      <Sequence from={14718} durationInFrames={108} name="FedHero b141">
        <FedHero {...P[141]} totalF={108} accent={ACCENT} />
      </Sequence>
      {/* 493.9s · Lo que tiene es betacaroteno, que es otra cosa. */}
      <Sequence from={14817} durationInFrames={96} name="FedMolecule b142">
        <FedMolecule {...P[142]} totalF={96} accent={ACCENT} />
      </Sequence>
      {/* 499.2s · Pero cientos de veces por debajo de la crema de retinol de méd */}
      <Sequence from={14976} durationInFrames={162} name="FedBeforeAfter b144">
        <FedBeforeAfter {...P[144]} totalF={162} accent={ACCENT} />
      </Sequence>
      {/* 504.9s · Comparar una con la otra es comparar una vela con un reflector */}
      <Sequence from={15147} durationInFrames={138} name="FedFullShot b145">
        <FedFullShot {...P[145]} totalF={138} accent={ACCENT} />
      </Sequence>
      {/* 510.3s · Sí, pero por lo que es un aceite riquísimo en linoleico que le */}
      <Sequence from={15309} durationInFrames={153} name="FedChecklist b147">
        <FedChecklist {...P[147]} totalF={153} accent={ACCENT} />
      </Sequence>
      {/* 518.6s · Botella oscura y heladera después de abierta. */}
      <Sequence from={15558} durationInFrames={90} name="FedChecklist b150">
        <FedChecklist {...P[150]} totalF={90} accent={ACCENT} />
      </Sequence>
      {/* 524.3s · En 2012, el New England Journal of Medicine, una de las revist */}
      <Sequence from={15729} durationInFrames={111} name="FedQuote b152">
        <FedQuote {...P[152]} totalF={111} accent={ACCENT} />
      </Sequence>
      {/* 527.6s · ...publicó la fotografía de un hombre... */}
      <Sequence from={15828} durationInFrames={111} name="FedFullShot b153">
        <FedFullShot {...P[153]} totalF={111} accent={ACCENT} />
      </Sequence>
      {/* 530.9s · ...publicó la fotografía de un hombre de 69 años, camionero de */}
      <Sequence from={15927} durationInFrames={126} name="FedStat b154">
        <FedStat {...P[154]} totalF={126} accent={ACCENT} />
      </Sequence>
      {/* 534.9s · Durante 25 años manejó... */}
      <Sequence from={16047} durationInFrames={75} name="FedStat b155">
        <FedStat {...P[155]} totalF={75} accent={ACCENT} />
      </Sequence>
      {/* 537s · ...con el lado izquierdo de la cara pegado a la ventanilla. */}
      <Sequence from={16110} durationInFrames={78} name="FedFullShot b156">
        <FedFullShot {...P[156]} totalF={78} accent={ACCENT} />
      </Sequence>
      {/* 539.5s · Las dos mitades de su cara no parecen de la misma persona. */}
      <Sequence from={16185} durationInFrames={99} name="FedBeforeAfter b157">
        <FedBeforeAfter {...P[157]} totalF={99} accent={ACCENT} />
      </Sequence>
      {/* 545.9s · El izquierdo tiene la piel engrosada, colgada, con surcos prof */}
      <Sequence from={16377} durationInFrames={120} name="FedFullShot b159">
        <FedFullShot {...P[159]} totalF={120} accent={ACCENT} />
      </Sequence>
      {/* 549.5s · ...como si le hubieran puesto 20 años más de un solo lado. */}
      <Sequence from={16485} durationInFrames={159} name="FedChecklist b160">
        <FedSplitFace image={staticFile("img/vn2_c32.png")} title={"La misma cara, dos edades"} sub={"veinte años más de un solo lado"} leftLabel={"25 años contra la ventanilla"} rightLabel={"el otro lado, 69 años"} callouts={["Piel engrosada y colgada","Surcos profundos","Poros dilatados y tapados"]} journal={"New England Journal of Medicine"} year={"2012"} totalF={159} accent={ACCENT} />
      </Sequence>
      {/* 557.2s · Él iba adentro del camión, con la ventana cerrada. */}
      <Sequence from={16716} durationInFrames={90} name="FedFullShot b162">
        <FedFullShot {...P[162]} totalF={90} accent={ACCENT} />
      </Sequence>
      {/* 567.5s · Los UVA atraviesan el vidrio y atraviesan las nubes. */}
      <Sequence from={17025} durationInFrames={120} name="FedFullShot b164">
        <FedFullShot {...P[164]} totalF={120} accent={ACCENT} />
      </Sequence>
      {/* 576.3s · En 2013, el grupo de Frederick Flament calculó qué parte de lo */}
      <Sequence from={17289} durationInFrames={132} name="FedQuote b167">
        <FedQuote {...P[167]} totalF={132} accent={ACCENT} />
      </Sequence>
      {/* 580.3s · ...del envejecimiento facial se explica por el sol. */}
      <Sequence from={17409} durationInFrames={132} name="FedFullShot b168">
        <FedFullShot {...P[168]} totalF={132} accent={ACCENT} />
      </Sequence>
      {/* 584.7s · La cifra fue 80,3%. 80%. */}
      <Sequence from={17541} durationInFrames={141} name="FedStat b169">
        <FedStat {...P[169]} totalF={141} accent={ACCENT} />
      </Sequence>
      {/* 589s · La mayor parte de lo que usted ve en el espejo y le achaca a l */}
      <Sequence from={17670} durationInFrames={153} name="FedHero b170">
        <FedHero {...P[170]} totalF={153} accent={ACCENT} />
      </Sequence>
      {/* 595.8s · Número 4 */}
      <Sequence from={17874} durationInFrames={168} name="FedOilCarousel b172">
        <FedOilCarousel {...P[172]} totalF={168} accent={ACCENT} />
      </Sequence>
      {/* 603.6s · 60 mujeres posmenopáusicas de 49 a 61 años. */}
      <Sequence from={18108} durationInFrames={144} name="FedStat b173">
        <FedTrial journal={"Clinical Interventions in Aging"} year={"2015"} n={60} design={"mujeres posmenopáusicas de 49 a 61 años · 60 días"} title={"Medido con cutómetro"} sub={"el aparato que succiona la piel y mide cuánto tarda en volver"} groupA={{"label":"Argán","value":15,"suffix":"%","tone":"good"}} groupB={{"label":"Oliva","value":0,"suffix":"%","tone":"bad"}} unit={"elasticidad"} totalF={144} accent={ACCENT} />
      </Sequence>
      {/* 608.3s · 60 días. Se midió con cutómetro. */}
      <Sequence from={18249} durationInFrames={81} name="FedStat b174">
        <FedStat {...P[174]} totalF={81} accent={ACCENT} />
      </Sequence>
      {/* 610.9s · Un aparato que succiona un pedacito de piel y mide cuánto tard */}
      <Sequence from={18327} durationInFrames={126} name="FedFullShot b175">
        <FedFullShot {...P[175]} totalF={126} accent={ACCENT} />
      </Sequence>
      {/* 615s · La elasticidad biológica subió un 15%. */}
      <Sequence from={18450} durationInFrames={99} name="FedStat b176">
        <FedStat {...P[176]} totalF={99} accent={ACCENT} />
      </Sequence>
      {/* 624.9s · Ese grupo además tomaba 25 gramos de aceite de argán por día. */}
      <Sequence from={18747} durationInFrames={138} name="FedStat b179">
        <FedStat {...P[179]} totalF={138} accent={ACCENT} />
      </Sequence>
      {/* 629.4s · Comido. Dos cucharadas soperas. */}
      <Sequence from={18882} durationInFrames={81} name="FedFullShot b180">
        <FedFullShot {...P[180]} totalF={81} accent={ACCENT} />
      </Sequence>
      {/* 631.8s · Todos los días. Dos meses. */}
      <Sequence from={18954} durationInFrames={75} name="FedChecklist b181">
        <FedChecklist {...P[181]} totalF={75} accent={ACCENT} />
      </Sequence>
      {/* 640.8s · Yo no le puedo prometer 15% de elasticidad untándose argán en  */}
      <Sequence from={19224} durationInFrames={144} name="FedBeforeAfter b184">
        <FedBeforeAfter {...P[184]} totalF={144} accent={ACCENT} />
      </Sequence>
      {/* 653.2s · Anafilaxia por contacto con la piel. No solo por comerlo. */}
      <Sequence from={19596} durationInFrames={102} name="FedChecklist b188">
        <FedChecklist {...P[188]} totalF={102} accent={ACCENT} />
      </Sequence>
      {/* 656.4s · Si usted es alérgico al durazno... */}
      <Sequence from={19692} durationInFrames={105} name="FedFullShot b189">
        <FedFullShot {...P[189]} totalF={105} accent={ACCENT} />
      </Sequence>
      {/* 659.5s · ...a la mostaza o a los frutos secos, hable con su médico ante */}
      <Sequence from={19785} durationInFrames={108} name="FedChecklist b190">
        <FedChecklist {...P[190]} totalF={108} accent={ACCENT} />
      </Sequence>
      {/* 662.9s · Y si no lo es, igual hágase la prueba del parche que le explic */}
      <Sequence from={19887} durationInFrames={132} name="FedStep b191">
        <FedStep {...P[191]} totalF={132} accent={ACCENT} />
      </Sequence>
      {/* 668.3s · Número 5 */}
      <Sequence from={20049} durationInFrames={159} name="FedOilCarousel b192">
        <FedOilCarousel {...P[192]} totalF={159} accent={ACCENT} />
      </Sequence>
      {/* 674.6s · Es una cera líquida. */}
      <Sequence from={20238} durationInFrames={66} name="FedFullShot b193">
        <FedFullShot {...P[193]} totalF={66} accent={ACCENT} />
      </Sequence>
      {/* 676.4s · Y el sebo que su propia piel fabrica tiene alrededor de un 25% */}
      <Sequence from={20292} durationInFrames={150} name="FedStat b194">
        <FedStat {...P[194]} totalF={150} accent={ACCENT} />
      </Sequence>
      {/* 681.2s · Es el ingrediente vegetal más parecido al sebo humano que se c */}
      <Sequence from={20436} durationInFrames={123} name="FedMolecule b195">
        <FedMolecule {...P[195]} totalF={123} accent={ACCENT} />
      </Sequence>
      {/* 685.1s · Para una piel que dejó de producir sebo, es reponer lo que la  */}
      <Sequence from={20553} durationInFrames={141} name="FedHero b196">
        <FedHero {...P[196]} totalF={141} accent={ACCENT} />
      </Sequence>
      {/* 692.6s · La jojoba tiene la mejor química de las 7 y la peor evidencia  */}
      <Sequence from={20778} durationInFrames={135} name="FedBeforeAfter b198">
        <FedBeforeAfter {...P[198]} totalF={135} accent={ACCENT} />
      </Sequence>
      {/* 696.9s · No hay un solo ensayo controlado en humanos. */}
      <Sequence from={20907} durationInFrames={75} name="FedStat b199">
        <FedStat {...P[199]} totalF={75} accent={ACCENT} />
      </Sequence>
      {/* 702.8s · Para la piel sensible que reacciona a todo. Es el más seguro d */}
      <Sequence from={21084} durationInFrames={129} name="FedChecklist b201">
        <FedChecklist {...P[201]} totalF={129} accent={ACCENT} />
      </Sequence>
      {/* 709.9s · Número 6 */}
      <Sequence from={21297} durationInFrames={153} name="FedOilCarousel b203">
        <FedOilCarousel {...P[203]} totalF={153} accent={ACCENT} />
      </Sequence>
      {/* 719.3s · las estrías aparecieron en... */}
      <Sequence from={21579} durationInFrames={90} name="FedFullShot b205">
        <FedFullShot {...P[205]} totalF={90} accent={ACCENT} />
      </Sequence>
      {/* 721.9s · el 16% de las que usaron sésamo, */}
      <Sequence from={21657} durationInFrames={90} name="FedStat b206">
        <FedStat {...P[206]} totalF={90} accent={ACCENT} />
      </Sequence>
      {/* 724.5s · contra el 82% del grupo sin tratamiento. */}
      <Sequence from={21735} durationInFrames={96} name="FedStat b207">
        <FedStat {...P[207]} totalF={96} accent={ACCENT} />
      </Sequence>
      {/* 730.9s · Y el masaje solo ya mejora la circulación. */}
      <Sequence from={21927} durationInFrames={87} name="FedHero b209">
        <FedHero {...P[209]} totalF={87} accent={ACCENT} />
      </Sequence>
      {/* 734.6s · Un buen aceite de cuerpo, de piernas y de manos. */}
      <Sequence from={22038} durationInFrames={102} name="FedChecklist b211">
        <FedChecklist {...P[211]} totalF={102} accent={ACCENT} />
      </Sequence>
      {/* 741.4s · declaró al sésamo el noveno alérgeno alimentario mayor. */}
      <Sequence from={22242} durationInFrames={147} name="FedStat b213">
        <FedStat {...P[213]} totalF={147} accent={ACCENT} />
      </Sequence>
      {/* 747.7s · Si usted es alérgico al sésamo, ni se le ocurra ponérselo en l */}
      <Sequence from={22431} durationInFrames={120} name="FedChecklist b215">
        <FedChecklist {...P[215]} totalF={120} accent={ACCENT} />
      </Sequence>
      {/* 751.3s · Número 7 */}
      <Sequence from={22539} durationInFrames={159} name="FedOilCarousel b216">
        <FedOilCarousel {...P[216]} totalF={159} accent={ACCENT} />
      </Sequence>
      {/* 759.3s · Da tacto de seda. Ideal para manos, codos y talones. */}
      <Sequence from={22779} durationInFrames={117} name="FedChecklist b218">
        <FedChecklist {...P[218]} totalF={117} accent={ACCENT} />
      </Sequence>
      {/* 765s · Hasta un 86%. */}
      <Sequence from={22950} durationInFrames={69} name="FedStat b220">
        <FedStat {...P[220]} totalF={69} accent={ACCENT} />
      </Sequence>
      {/* 766.9s · O sea, se parece al aceite de oliva. */}
      <Sequence from={23007} durationInFrames={78} name="FedBeforeAfter b221">
        <FedBeforeAfter {...P[221]} totalF={78} accent={ACCENT} />
      </Sequence>
      {/* 772.9s · Así que es una sospecha por mecanismo, no un dato. */}
      <Sequence from={23187} durationInFrames={99} name="FedQuote b223">
        <FedQuote {...P[223]} totalF={99} accent={ACCENT} />
      </Sequence>
      {/* 778.8s · La piel dañada es puerta de entrada para sensibilizarse a un a */}
      <Sequence from={23364} durationInFrames={120} name="FedStep b226">
        <FedStep {...P[226]} totalF={120} accent={ACCENT} />
      </Sequence>
      {/* 784.8s · publicado en el New England Journal of Medicine, */}
      <Sequence from={23544} durationInFrames={108} name="FedStat b228">
        <FedStat {...P[228]} totalF={108} accent={ACCENT} />
      </Sequence>
      {/* 788s · el 84% de los que terminaron alérgicos al maní */}
      <Sequence from={23640} durationInFrames={108} name="FedStat b229">
        <FedStat {...P[229]} totalF={108} accent={ACCENT} />
      </Sequence>
      {/* 791.2s · habían estado expuestos a cremas con aceite de maní de bebés. */}
      <Sequence from={23736} durationInFrames={93} name="FedFullShot b230">
        <FedFullShot {...P[230]} totalF={93} accent={ACCENT} />
      </Sequence>
      {/* 794.1s · Frutos secos sobre piel con eczema. Con cuidado. */}
      <Sequence from={23823} durationInFrames={72} name="FedHero b231">
        <FedHero {...P[231]} totalF={72} accent={ACCENT} />
      </Sequence>
      {/* 798.1s · Ahora la lista negra. Que es igual de importante. */}
      <Sequence from={23943} durationInFrames={90} name="FedChapter b233">
        <FedChapter {...P[233]} totalF={90} accent={ACCENT} />
      </Sequence>
      {/* 803.2s · Danby 2013. Aumentó significativamente la pérdida de agua por  */}
      <Sequence from={24096} durationInFrames={147} name="FedHero b234">
        <FedBlacklist index={"01 / 03"} name={"Aceite de oliva"} reason={"Aumentó significativamente la pérdida de agua por la piel — también en piel perfectamente sana."} evidence={"Danby · Pediatric Dermatology · 2013"} stamp={"NO SE PONE"} totalF={147} accent={ACCENT} />
      </Sequence>
      {/* 810.3s · Cómalo. Es maravilloso para comer. */}
      <Sequence from={24309} durationInFrames={75} name="FedFullShot b236">
        <FedFullShot {...P[236]} totalF={75} accent={ACCENT} />
      </Sequence>
      {/* 814.3s · Segundo. La vitamina E aplicada en la piel. */}
      <Sequence from={24429} durationInFrames={90} name="FedChapter b238">
        <FedChapter {...P[238]} totalF={90} accent={ACCENT} />
      </Sequence>
      {/* 816.9s · Y el aceite de germen de trigo que la lleva. */}
      <Sequence from={24507} durationInFrames={84} name="FedFullShot b239">
        <FedFullShot {...P[239]} totalF={84} accent={ACCENT} />
      </Sequence>
      {/* 827s · 15 pacientes operados de cáncer de piel. */}
      <Sequence from={24810} durationInFrames={75} name="FedStat b242">
        <FedStat {...P[242]} totalF={75} accent={ACCENT} />
      </Sequence>
      {/* 829.1s · Cada cicatriz dividida en dos mitades. Una con crema sola. */}
      <Sequence from={24873} durationInFrames={132} name="FedBeforeAfter b243">
        <FedBeforeAfter {...P[243]} totalF={132} accent={ACCENT} />
      </Sequence>
      {/* 835.3s · En el 90% de los casos la vitamina E no tuvo ningún efecto o e */}
      <Sequence from={25059} durationInFrames={189} name="FedStat b245">
        <FedBlacklist index={"02 / 03"} name={"Vitamina E y germen de trigo"} reason={"En el 90% de los casos no tuvo ningún efecto o empeoró la cicatriz. Un tercio de los pacientes hizo dermatitis de contacto."} evidence={"Dermatologic Surgery · 1999 · 15 pacientes operados"} stamp={"NO SE PONE"} totalF={189} accent={ACCENT} />
      </Sequence>
      {/* 841.2s · Y un tercio de los pacientes desarrolló dermatitis de contacto */}
      <Sequence from={25236} durationInFrames={126} name="FedStat b246">
        <FedStat {...P[246]} totalF={126} accent={ACCENT} />
      </Sequence>
      {/* 847.6s · Fíjese dónde saltó a un tercio. En piel con la barrera rota. */}
      <Sequence from={25428} durationInFrames={123} name="FedHero b248">
        <FedHero {...P[248]} totalF={123} accent={ACCENT} />
      </Sequence>
      {/* 854.5s · Sobre la cicatriz. Sobre lo que le arde. */}
      <Sequence from={25635} durationInFrames={81} name="FedFullShot b250">
        <FedFullShot {...P[250]} totalF={81} accent={ACCENT} />
      </Sequence>
      {/* 856.8s · Y tercero. El que es directamente peligroso. */}
      <Sequence from={25704} durationInFrames={111} name="FedChapter b251">
        <FedChapter {...P[251]} totalF={111} accent={ACCENT} />
      </Sequence>
      {/* 863.2s · Bergamota, lima, limón. */}
      <Sequence from={25896} durationInFrames={69} name="FedFullShot b253">
        <FedFullShot {...P[253]} totalF={69} accent={ACCENT} />
      </Sequence>
      {/* 865.1s · Traen unas sustancias que se llaman furocumarinas. Con la luz  */}
      <Sequence from={25953} durationInFrames={156} name="FedMolecule b254">
        <FedBlacklist index={"03 / 03"} name={"Cítricos prensados en frío"} reason={"Las furocumarinas se activan con la luz, se pegan al ADN y dejan una mancha que a veces no se va nunca."} evidence={"Bergamota, lima, limón · tope de la industria: 0,4%"} stamp={"PELIGRO"} totalF={156} accent={ACCENT} />
      </Sequence>
      {/* 869.9s · Entran en el núcleo de la célula. Se pegan al ADN y producen m */}
      <Sequence from={26097} durationInFrames={159} name="FedMolecule b255">
        <FedMolecule {...P[255]} totalF={159} accent={ACCENT} />
      </Sequence>
      {/* 876.5s · Ampollas a las 24 o 72. */}
      <Sequence from={26295} durationInFrames={87} name="FedStep b257">
        <FedStep {...P[257]} totalF={87} accent={ACCENT} />
      </Sequence>
      {/* 879s · Y después una mancha oscura con forma de chorreado. */}
      <Sequence from={26370} durationInFrames={114} name="FedStep b258">
        <FedStep {...P[258]} totalF={114} accent={ACCENT} />
      </Sequence>
      {/* 885.1s · La Asociación Internacional de Fragancias le pone un tope del  */}
      <Sequence from={26553} durationInFrames={147} name="FedStat b260">
        <FedStat {...P[260]} totalF={147} accent={ACCENT} />
      </Sequence>
      {/* 889.6s · En un producto que queda sobre la piel expuesta al sol. */}
      <Sequence from={26688} durationInFrames={159} name="FedFullShot b261">
        <FedFullShot {...P[261]} totalF={159} accent={ACCENT} />
      </Sequence>
      {/* 894.5s · Y hay reportes de fototoxicidad con 0,03. */}
      <Sequence from={26835} durationInFrames={123} name="FedStat b262">
        <FedStat {...P[262]} totalF={123} accent={ACCENT} />
      </Sequence>
      {/* 900.4s · Si el frasco no aclara que es destilado al vapor, no se lo pon */}
      <Sequence from={27012} durationInFrames={147} name="FedChecklist b264">
        <FedChecklist {...P[264]} totalF={147} accent={ACCENT} />
      </Sequence>
      {/* 907.6s · Este es el tramo que menos me conviene y el que más necesita e */}
      <Sequence from={27228} durationInFrames={120} name="FedChapter b266">
        <FedChapter {...P[266]} totalF={120} accent={ACCENT} />
      </Sequence>
      {/* 911.2s · Ningún aceite vegetal le va a fabricar colágeno. Ninguno. */}
      <Sequence from={27336} durationInFrames={114} name="FedHero b267">
        <FedHero {...P[267]} totalF={114} accent={ACCENT} />
      </Sequence>
      {/* 918.4s · Sube el procolágeno un 85%. */}
      <Sequence from={27552} durationInFrames={99} name="FedStat b269">
        <FedStat {...P[269]} totalF={99} accent={ACCENT} />
      </Sequence>
      {/* 921.3s · O baja las arrugas un 43%. No existen. */}
      <Sequence from={27639} durationInFrames={90} name="FedStat b270">
        <FedStat {...P[270]} totalF={90} accent={ACCENT} />
      </Sequence>
      {/* 928.1s · Y este es el más peligroso. Los aceites no protegen del sol. */}
      <Sequence from={27843} durationInFrames={126} name="FedHero b272">
        <FedHero {...P[272]} totalF={126} accent={ACCENT} />
      </Sequence>
      {/* 931.9s · En 2021 se midieron en laboratorio y en piel humana los cinco  */}
      <Sequence from={27957} durationInFrames={135} name="FedStat b273">
        <FedStat {...P[273]} totalF={135} accent={ACCENT} />
      </Sequence>
      {/* 939s · El aceite de coco dio un factor de protección de entre 0 y 1,2 */}
      <Sequence from={28170} durationInFrames={141} name="FedStat b275">
        <FedStat {...P[275]} totalF={141} accent={ACCENT} />
      </Sequence>
      {/* 945.7s · Factor 30 bloquea el 97%. */}
      <Sequence from={28371} durationInFrames={93} name="FedStat b277">
        <FedStat {...P[277]} totalF={93} accent={ACCENT} />
      </Sequence>
      {/* 951.2s · El aceite vuelve más transparente la capa de arriba de la piel */}
      <Sequence from={28536} durationInFrames={114} name="FedFullShot b279">
        <FedFullShot {...P[279]} totalF={114} accent={ACCENT} />
      </Sequence>
      {/* 957.1s · Le saca la señal de alarma mientras la radiación sigue entrand */}
      <Sequence from={28713} durationInFrames={120} name="FedHero b281">
        <FedHero {...P[281]} totalF={120} accent={ACCENT} />
      </Sequence>
      {/* 964.5s · Los aceites de noche. */}
      <Sequence from={28935} durationInFrames={66} name="FedFullShot b283">
        <FedFullShot {...P[283]} totalF={66} accent={ACCENT} />
      </Sequence>
      {/* 966.3s · ¿Y qué sí funciona para el colágeno? Dos cosas. */}
      <Sequence from={28989} durationInFrames={102} name="FedChecklist b284">
        <FedChecklist {...P[284]} totalF={102} accent={ACCENT} />
      </Sequence>
      {/* 971.9s · El protector solar. */}
      <Sequence from={29157} durationInFrames={120} name="FedStep b286">
        <FedStep {...P[286]} totalF={120} accent={ACCENT} />
      </Sequence>
      {/* 975.5s · En 2013, en Annals of Internal Medicine, el único ensayo aleat */}
      <Sequence from={29265} durationInFrames={165} name="FedQuote b287">
        <FedTrial journal={"Annals of Internal Medicine"} year={"2013"} n={903} design={"el único ensayo aleatorizado de prevención que existe · Australia"} title={"Protector solar todos los días"} sub={"contra usarlo cuando uno quiere"} groupA={{"label":"Uso diario","value":24,"suffix":"%","tone":"good"}} groupB={{"label":"Discrecional","value":0,"suffix":"%","tone":"bad"}} unit={"menos envejecimiento"} verdict={"24% menos"} totalF={165} accent={ACCENT} />
      </Sequence>
      {/* 981s · 903 adultos en Australia. */}
      <Sequence from={29430} durationInFrames={72} name="FedStat b288">
        <FedStat {...P[288]} totalF={72} accent={ACCENT} />
      </Sequence>
      {/* 983s · Unos con protector todos los días y otros cuando querían. */}
      <Sequence from={29490} durationInFrames={111} name="FedFullShot b289">
        <FedFullShot {...P[289]} totalF={111} accent={ACCENT} />
      </Sequence>
      {/* 986.3s · El envejecimiento de la piel fue un 24% menor en el grupo del  */}
      <Sequence from={29589} durationInFrames={159} name="FedStat b290">
        <FedStat {...P[290]} totalF={159} accent={ACCENT} />
      </Sequence>
      {/* 993.2s · En el New England Journal of Medicine, la tretinoína. */}
      <Sequence from={29796} durationInFrames={126} name="FedStep b292">
        <FedStep {...P[292]} totalF={126} accent={ACCENT} />
      </Sequence>
      {/* 997s · Aumentó la formación de colágeno tipo 1, un 80%. */}
      <Sequence from={29910} durationInFrames={96} name="FedStat b293">
        <FedStat {...P[293]} totalF={96} accent={ACCENT} />
      </Sequence>
      {/* 1002s · Con personas de 87 años de promedio. */}
      <Sequence from={30060} durationInFrames={78} name="FedStat b295">
        <FedStat {...P[295]} totalF={78} accent={ACCENT} />
      </Sequence>
      {/* 1004.5s · Mostró mejoría en las arrugas finas con retinol tres veces por */}
      <Sequence from={30135} durationInFrames={117} name="FedStat b296">
        <FedStat {...P[296]} totalF={117} accent={ACCENT} />
      </Sequence>
      {/* 1008.2s · 87 años de promedio. */}
      <Sequence from={30246} durationInFrames={72} name="FedStat b297">
        <FedStat {...P[297]} totalF={72} accent={ACCENT} />
      </Sequence>
      {/* 1012.9s · Y ahora sí, el error. El que le prometí al principio. */}
      <Sequence from={30387} durationInFrames={105} name="FedChapter b299">
        <FedChapter {...P[299]} totalF={105} accent={ACCENT} />
      </Sequence>
      {/* 1018.2s · El error es que usted se está poniendo el aceite sobre la piel */}
      <Sequence from={30546} durationInFrames={114} name="FedHero b301">
        <FedHero {...P[301]} totalF={114} accent={ACCENT} />
      </Sequence>
      {/* 1021.7s · Un aceite vegetal puro es anhidro. */}
      <Sequence from={30651} durationInFrames={99} name="FedFullShot b302">
        <FedFullShot {...P[302]} totalF={99} accent={ACCENT} />
      </Sequence>
      {/* 1024.7s · Tiene 0% de agua. Cero. */}
      <Sequence from={30741} durationInFrames={84} name="FedStat b303">
        <FedStat {...P[303]} totalF={84} accent={ACCENT} />
      </Sequence>
      {/* 1027.2s · Es imposible que le aporte agua a la piel porque no tiene agua */}
      <Sequence from={30816} durationInFrames={132} name="FedFullShot b304">
        <FedFullShot {...P[304]} totalF={132} accent={ACCENT} />
      </Sequence>
      {/* 1042.7s · Si abajo hay agua, la tapa la retiene y usted gana. */}
      <Sequence from={31281} durationInFrames={78} name="FedFullShot b308">
        <FedFullShot {...P[308]} totalF={78} accent={ACCENT} />
      </Sequence>
      {/* 1045s · Si abajo no hay agua, usted acaba de sellar una piel seca. */}
      <Sequence from={31350} durationInFrames={117} name="FedBeforeAfter b309">
        <FedSeal title={"El aceite es la tapa, no el contenido"} sub={"un aceite vegetal puro es anhidro"} leftLabel={"Aceite sobre piel SECA"} rightLabel={"Aceite sobre piel HÚMEDA"} leftNote={"sella la nada"} rightNote={"sella el agua"} dropLabel={"0% de agua"} totalF={117} accent={ACCENT} />
      </Sequence>
      {/* 1050.9s · Y el contenido real de agua no subió ni un punto. */}
      <Sequence from={31527} durationInFrames={93} name="FedHero b311">
        <FedHero {...P[311]} totalF={93} accent={ACCENT} />
      </Sequence>
      {/* 1053.7s · Por eso millones de personas se untan aceite todas las noches  */}
      <Sequence from={31611} durationInFrames={138} name="FedFullShot b312">
        <FedFullShot {...P[312]} totalF={138} accent={ACCENT} />
      </Sequence>
      {/* 1058s · No ven nada y concluyen que los aceites no sirven. */}
      <Sequence from={31740} durationInFrames={108} name="FedFullShot b313">
        <FedFullShot {...P[313]} totalF={108} accent={ACCENT} />
      </Sequence>
      {/* 1063.9s · Agua primero. Aceite después. */}
      <Sequence from={31917} durationInFrames={75} name="FedHero b315">
        <FedHero {...P[315]} totalF={75} accent={ACCENT} />
      </Sequence>
      {/* 1069.7s · Bañarse y no ponerse absolutamente nada después. */}
      <Sequence from={32091} durationInFrames={102} name="FedFullShot b317">
        <FedFullShot {...P[317]} totalF={102} accent={ACCENT} />
      </Sequence>
      {/* 1072.9s · Dejó la piel en el 91% de como estaba antes de bañarse. */}
      <Sequence from={32187} durationInFrames={141} name="FedStat b318">
        <FedStat {...P[318]} totalF={141} accent={ACCENT} />
      </Sequence>
      {/* 1080s · Bañarse y no ponerse nada la deja peor que antes de bañarse. */}
      <Sequence from={32400} durationInFrames={87} name="FedHero b320">
        <FedHero {...P[320]} totalF={87} accent={ACCENT} />
      </Sequence>
      {/* 1085.1s · Entonces, ¿cómo se hace bien? Esto es lo que quiero que haga e */}
      <Sequence from={32553} durationInFrames={123} name="FedChapter b322">
        <FedChapter {...P[322]} totalF={123} accent={ACCENT} />
      </Sequence>
      {/* 1088.9s · Uno. El agua caliente le disuelve el mismo cemento de grasa qu */}
      <Sequence from={32667} durationInFrames={141} name="FedStep b323">
        <FedRoutineRing step={1} kicker={"Esta noche"} totalF={141} accent={ACCENT} />
      </Sequence>
      {/* 1096s · Séquese a toques y deje la piel apenas húmeda. */}
      <Sequence from={32880} durationInFrames={141} name="FedStep b325">
        <FedRoutineRing step={2} kicker={"Esta noche"} totalF={141} accent={ACCENT} />
      </Sequence>
      {/* 1100.4s · Que brille de agua. Esa agua es el contenido. */}
      <Sequence from={33012} durationInFrames={102} name="FedFullShot b326">
        <FedFullShot {...P[326]} totalF={102} accent={ACCENT} />
      </Sequence>
      {/* 1103.5s · Si tiene una crema o un gel con glicerina, ácido hialurónico o */}
      <Sequence from={33105} durationInFrames={147} name="FedStep b327">
        <FedRoutineRing step={3} kicker={"Esta noche"} totalF={147} accent={ACCENT} />
      </Sequence>
      {/* 1108.1s · Ese es el que aporta. */}
      <Sequence from={33243} durationInFrames={108} name="FedFullShot b328">
        <FedFullShot {...P[328]} totalF={108} accent={ACCENT} />
      </Sequence>
      {/* 1113.7s · Cuatro. Ahora sí el aceite. Y menos de lo que usted cree. */}
      <Sequence from={33411} durationInFrames={108} name="FedStep b330">
        <FedRoutineRing step={4} kicker={"Esta noche"} totalF={108} accent={ACCENT} />
      </Sequence>
      {/* 1117s · Tres a cinco gotas para toda la cara. */}
      <Sequence from={33510} durationInFrames={72} name="FedStat b331">
        <FedStat {...P[331]} totalF={72} accent={ACCENT} />
      </Sequence>
      {/* 1119.1s · Diez para un antebrazo entero, que es la dosis exacta del estu */}
      <Sequence from={33573} durationInFrames={135} name="FedStat b332">
        <FedStat {...P[332]} totalF={135} accent={ACCENT} />
      </Sequence>
      {/* 1123.3s · Caliéntelas entre las palmas y presione. No frote. */}
      <Sequence from={33699} durationInFrames={102} name="FedFullShot b333">
        <FedFullShot {...P[333]} totalF={102} accent={ACCENT} />
      </Sequence>
      {/* 1126.4s · Presionar y soltar. Frotar en piel madura la irrita. */}
      <Sequence from={33792} durationInFrames={105} name="FedHero b334">
        <FedHero {...P[334]} totalF={105} accent={ACCENT} />
      </Sequence>
      {/* 1129.6s · Cinco. Cuatro semanas. Ese es el plazo real. No tres días. */}
      <Sequence from={33888} durationInFrames={126} name="FedStep b335">
        <FedRoutineRing step={5} kicker={"Esta noche"} totalF={126} accent={ACCENT} />
      </Sequence>
      {/* 1136.8s · Una gota en la cara interna del antebrazo, tapada con una curi */}
      <Sequence from={34104} durationInFrames={126} name="FedFullShot b337">
        <FedFullShot {...P[337]} totalF={126} accent={ACCENT} />
      </Sequence>
      {/* 1140.8s · Cuarenta y ocho horas. */}
      <Sequence from={34224} durationInFrames={123} name="FedStat b338">
        <FedStat {...P[338]} totalF={123} accent={ACCENT} />
      </Sequence>
      {/* 1144.6s · Si pica, si se pone rojo, si aparece un sarpullido, ese aceite */}
      <Sequence from={34338} durationInFrames={90} name="FedFullShot b339">
        <FedFullShot {...P[339]} totalF={90} accent={ACCENT} />
      </Sequence>
      {/* 1147.3s · Con el argán y con los de frutos secos, no es opcional. */}
      <Sequence from={34419} durationInFrames={114} name="FedHero b340">
        <FedHero {...P[340]} totalF={114} accent={ACCENT} />
      </Sequence>
      {/* 1150.8s · Y huela la botella antes de usarla. */}
      <Sequence from={34524} durationInFrames={78} name="FedFullShot b341">
        <FedFullShot {...P[341]} totalF={78} accent={ACCENT} />
      </Sequence>
      {/* 1155.4s · Si tiene olor a pintura vieja, a crayón, a rancio, tírelo. */}
      <Sequence from={34662} durationInFrames={129} name="FedChecklist b343">
        <FedChecklist {...P[343]} totalF={129} accent={ACCENT} />
      </Sequence>
      {/* 1159.4s · Un aceite oxidado sobre la piel es un pro-oxidante. Le hace lo */}
      <Sequence from={34782} durationInFrames={114} name="FedMolecule b344">
        <FedMolecule {...P[344]} totalF={114} accent={ACCENT} />
      </Sequence>
      {/* 1162.9s · Y jamás use un aceite con el que ya frió. */}
      <Sequence from={34887} durationInFrames={117} name="FedFullShot b345">
        <FedFullShot {...P[345]} totalF={117} accent={ACCENT} />
      </Sequence>
      {/* 1166.5s · Le hago el resumen. Esta noche, tres cosas. */}
      <Sequence from={34995} durationInFrames={96} name="FedChecklist b346">
        <FedChecklist {...P[346]} totalF={96} accent={ACCENT} />
      </Sequence>
      {/* 1169.4s · Uno. Revise la etiqueta del girasol. */}
      <Sequence from={35082} durationInFrames={75} name="FedFullShot b347">
        <FedFullShot {...P[347]} totalF={75} accent={ACCENT} />
      </Sequence>
      {/* 1171.6s · Alto linoleico es su reparador de barrera número uno. */}
      <Sequence from={35148} durationInFrames={114} name="FedHero b348">
        <FedHero {...P[348]} totalF={114} accent={ACCENT} />
      </Sequence>
      {/* 1177s · Dos. Cambie el orden. Piel húmeda primero, aceite después. Sie */}
      <Sequence from={35310} durationInFrames={129} name="FedHero b350">
        <FedHero {...P[350]} totalF={129} accent={ACCENT} />
      </Sequence>
      {/* 1183.7s · Tres. Aceites de noche. De día, protector solar. */}
      <Sequence from={35511} durationInFrames={114} name="FedHero b352">
        <FedHero {...P[352]} totalF={114} accent={ACCENT} />
      </Sequence>
      {/* 1187.2s · Porque el 80% de lo que ve en el espejo se lo hizo el sol, no  */}
      <Sequence from={35616} durationInFrames={150} name="FedStat b353">
        <FedStat {...P[353]} totalF={150} accent={ACCENT} />
      </Sequence>
      {/* 1191.9s · En la descripción le dejé la ficha completa. */}
      <Sequence from={35757} durationInFrames={102} name="FedCta b354">
        <FedCta {...P[354]} totalF={102} accent={ACCENT} />
      </Sequence>
      {/* 1197s · Los siete aceites. El linoleico y el oleico de cada uno. */}
      <Sequence from={35910} durationInFrames={120} name="FedFullShot b356">
        <FedOilBars title={"Los siete, de un vistazo"} sub={"el linoleico y el oleico de cada uno"} cutoff={40} cutoffLabel={"mínimo útil"} foot={"La ficha completa está en la descripción."} totalF={120} accent={ACCENT} />
      </Sequence>
      {/* 1203.3s · La dosis en gotas y la lista de los que no se ponen nunca. */}
      <Sequence from={36099} durationInFrames={93} name="FedFullShot b358">
        <FedFullShot {...P[358]} totalF={93} accent={ACCENT} />
      </Sequence>
      {/* 1208s · Y cuénteme algo en los comentarios, que los leo todos. */}
      <Sequence from={36240} durationInFrames={102} name="FedFullShot b360">
        <FedFullShot {...P[360]} totalF={102} accent={ACCENT} />
      </Sequence>
      {/* 1211.1s · ¿Qué aceite tiene en la cocina en este momento? */}
      <Sequence from={36333} durationInFrames={87} name="FedHero b361">
        <FedHero {...P[361]} totalF={87} accent={ACCENT} />
      </Sequence>
      {/* 1213.7s · Escríbame cuál es y si la etiqueta dice alto oleico o no. */}
      <Sequence from={36411} durationInFrames={129} name="FedFullShot b362">
        <FedFullShot {...P[362]} totalF={129} accent={ACCENT} />
      </Sequence>
      {/* 1220.4s · …estuvo usando el equivocado sin tener la menor idea. */}
      <Sequence from={36612} durationInFrames={84} name="FedFullShot b364">
        <FedFullShot {...P[364]} totalF={84} accent={ACCENT} />
      </Sequence>
      {/* 1222.9s · En el próximo video le voy a mostrar algo que discute con la m */}
      <Sequence from={36687} durationInFrames={153} name="FedChapter b365">
        <FedChapter {...P[365]} totalF={153} accent={ACCENT} />
      </Sequence>
      {/* 1227.7s · Hay un producto de tres pesos en cualquier farmacia… */}
      <Sequence from={36831} durationInFrames={123} name="FedFullShot b366">
        <FedFullShot {...P[366]} totalF={123} accent={ACCENT} />
      </Sequence>
      {/* 1231.5s · …que se usa desde 1872. */}
      <Sequence from={36945} durationInFrames={99} name="FedStat b367">
        <FedStat {...P[367]} totalF={99} accent={ACCENT} />
      </Sequence>
      {/* 1234.5s · Y que baja la pérdida de agua de la piel casi un 99%. */}
      <Sequence from={37035} durationInFrames={87} name="FedStat b368">
        <FedStat {...P[368]} totalF={87} accent={ACCENT} />
      </Sequence>
      {/* 1238.7s · Ningún aceite de este video pasa del 30. */}
      <Sequence from={37161} durationInFrames={93} name="FedStat b370">
        <FedStat {...P[370]} totalF={93} accent={ACCENT} />
      </Sequence>
      {/* 1244.5s · …y por qué eso de que tapa los poros es falso. */}
      <Sequence from={37335} durationInFrames={105} name="FedFullShot b372">
        <FedFullShot {...P[372]} totalF={105} accent={ACCENT} />
      </Sequence>
      {/* 1247.7s · Hay un estudio de 1992 que lo demuestra. */}
      <Sequence from={37431} durationInFrames={93} name="FedStat b373">
        <FedStat {...P[373]} totalF={93} accent={ACCENT} />
      </Sequence>

      <AbsoluteFill
        style={{
          zIndex: 30,
          pointerEvents: 'none',
          background:
            'radial-gradient(125% 105% at 50% 46%, transparent 62%, rgba(1,3,8,0.3) 100%)',
        }}
      />
      <AbsoluteFill
        style={{
          zIndex: 50,
          background: '#020409',
          opacity: Math.max(fadeIn, fadeOut),
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

export default MainVn2;
