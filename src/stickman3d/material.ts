// Materiales: vinilo/arcilla mate (MeshPhysicalMaterial) + oclusión ambiental ANALÍTICA por cápsulas.
// La AO se calcula en el shader contra las cápsulas del esqueleto (fórmula de oclusión de esfera de Íñigo Quílez
// aplicada al punto más cercano de cada segmento): sin halos, sin ruido, sin acumulación entre cuadros (determinista).
// La misma cápsula alimenta la sombra de contacto del piso.
import * as THREE from "three";
import { GLSL_FONDO_ESTUDIO } from "./fondoEstudio";

export const MAX_CAPS = 40;

export type UniformsAO = {
  uCapA: { value: THREE.Vector4[] }; // xyz = punto a, w = radio
  uCapB: { value: THREE.Vector4[] }; // xyz = punto b
  uNCap: { value: number };
  uAOFuerza: { value: number };
  uAODirecta: { value: number };
};

export const crearUniformsAO = (): UniformsAO => ({
  uCapA: { value: Array.from({ length: MAX_CAPS }, () => new THREE.Vector4(0, -100, 0, 0.0001)) },
  uCapB: { value: Array.from({ length: MAX_CAPS }, () => new THREE.Vector4(0, -100, 0, 0)) },
  uNCap: { value: 0 },
  uAOFuerza: { value: 1.15 },
  uAODirecta: { value: 0.35 },
});

export type Capsula = { a: THREE.Vector3; b: THREE.Vector3; r: number };

export const cargarCapsulas = (u: UniformsAO, caps: Capsula[]) => {
  const n = Math.min(MAX_CAPS, caps.length);
  for (let i = 0; i < MAX_CAPS; i++) {
    if (i < n) { const c = caps[i]; u.uCapA.value[i].set(c.a.x, c.a.y, c.a.z, c.r); u.uCapB.value[i].set(c.b.x, c.b.y, c.b.z, 0); }
    else { u.uCapA.value[i].set(0, -100, 0, 0.0001); u.uCapB.value[i].set(0, -100, 0, 0); }
  }
  u.uNCap.value = n;
};

const GLSL_AO = /* glsl */ `
uniform vec4 uCapA[${MAX_CAPS}];
uniform vec4 uCapB[${MAX_CAPS}];
uniform int uNCap;
uniform float uAOFuerza;
float occCapsula(vec3 p, vec3 n, vec3 a, vec3 b, float r) {
  vec3 ba = b - a, pa = p - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
  vec3 d = (a + h * ba) - p;
  float l = length(d);
  if (l < r * 0.999) return 0.0;              // el punto está adentro de esta cápsula: es la propia superficie
  float nl = dot(n, d / l);
  // esfera de radio r a distancia l, ponderada por el coseno (tapa esférica) — más ancho para un cilindro
  float k = r / l;
  return clamp(nl * k * k * 1.15 + 0.06 * k * k, 0.0, 1.0) * smoothstep(r * 7.0, r * 1.5, l);
}
float aoCapsulas(vec3 p, vec3 n) {
  float ao = 1.0;
  for (int i = 0; i < ${MAX_CAPS}; i++) {
    if (i >= uNCap) break;
    ao *= 1.0 - clamp(uAOFuerza * occCapsula(p, n, uCapA[i].xyz, uCapB[i].xyz, uCapA[i].w), 0.0, 0.92);
  }
  return ao;
}
`;

// micro-relieve procedural (opcional): ruido suave con semilla dibujado en canvas
export const crearNormalRuido = (semilla = 7, tam = 256) => {
  if (typeof document === "undefined") return null;
  const cv = document.createElement("canvas"); cv.width = cv.height = tam;
  const cx = cv.getContext("2d")!;
  const img = cx.createImageData(tam, tam);
  const h = (x: number, y: number) => { const s = Math.sin(x * 12.9898 + y * 78.233 + semilla * 3.17) * 43758.5453; return s - Math.floor(s); };
  const alt = (x: number, y: number) => {
    let v = 0, a = 0.5, f = 1 / 32;
    for (let o = 0; o < 3; o++) {
      const X = x * f, Y = y * f, ix = Math.floor(X), iy = Math.floor(Y), fx = X - ix, fy = Y - iy;
      const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
      const w = (i: number, j: number) => h(((ix + i) % (tam * f)) | 0, ((iy + j) % (tam * f)) | 0);
      v += a * ((w(0, 0) * (1 - sx) + w(1, 0) * sx) * (1 - sy) + (w(0, 1) * (1 - sx) + w(1, 1) * sx) * sy);
      a *= 0.5; f *= 2;
    }
    return v;
  };
  for (let y = 0; y < tam; y++) for (let x = 0; x < tam; x++) {
    const dx = alt(x + 1, y) - alt(x - 1, y), dy = alt(x, y + 1) - alt(x, y - 1);
    const n = new THREE.Vector3(-dx * 2, -dy * 2, 1).normalize();
    const i = (y * tam + x) * 4;
    img.data[i] = (n.x * 0.5 + 0.5) * 255; img.data[i + 1] = (n.y * 0.5 + 0.5) * 255; img.data[i + 2] = (n.z * 0.5 + 0.5) * 255; img.data[i + 3] = 255;
  }
  cx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
};

const inyectarAO = (m: THREE.Material, u: UniformsAO) => {
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, u);
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vSWPos;\nvarying vec3 vSWNor;")
      .replace("#include <fog_vertex>", "#include <fog_vertex>\nvSWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;\nvSWNor = normalize(mat3(modelMatrix) * objectNormal);");
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vSWPos;\nvarying vec3 vSWNor;\nuniform float uAODirecta;\n" + GLSL_AO)
      .replace("#include <aomap_fragment>", `#include <aomap_fragment>
      {
        vec3 nW = normalize(vSWNor);
        if (!gl_FrontFacing) nW = -nW;
        float aoC = aoCapsulas(vSWPos, nW);
        reflectedLight.indirectDiffuse *= aoC;
        reflectedLight.indirectSpecular *= mix(1.0, aoC, 0.8);
        reflectedLight.directDiffuse *= mix(1.0, aoC, uAODirecta);
        reflectedLight.directSpecular *= mix(1.0, aoC, uAODirecta);
      }`);
  };
  m.customProgramCacheKey = () => "stickAO";
};

export type OpcionesPiel = { color?: string; rugosidad?: number; sheen?: number; clearcoat?: number; relieve?: THREE.Texture | null };

export const crearPiel = (u: UniformsAO, o: OpcionesPiel = {}) => {
  const m = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(o.color ?? "#EEEEEC"),
    roughness: o.rugosidad ?? 0.55,
    metalness: 0,
    sheen: o.sheen ?? 0.25,
    sheenColor: new THREE.Color("#eef4ff"),
    sheenRoughness: 0.6,
    clearcoat: o.clearcoat ?? 0.1,
    clearcoatRoughness: 0.6,
    specularIntensity: 0.6,
  });
  if (o.relieve) { m.normalMap = o.relieve; m.normalScale.set(0.03, 0.03); }
  inyectarAO(m, u);
  return m;
};

// pintura de la cara: gris carbón, un poco más satinada que la piel
export const crearPintura = (u: UniformsAO, color = "#686868", rugosidad = 0.42) => {
  const m = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(color), roughness: rugosidad, metalness: 0, clearcoat: 0.2, clearcoatRoughness: 0.5 });
  inyectarAO(m, u);
  return m;
};

// rellenos de color (boca, lengua, corazones, rubor con alfa por vértice, lágrimas)
export const crearRellenoMat = (u: UniformsAO, color: string, o: { opacidad?: number; rugosidad?: number; capa?: number; transparente?: boolean } = {}) => {
  const m = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color), roughness: o.rugosidad ?? 0.45, metalness: 0,
    vertexColors: true, transparent: o.transparente ?? false, opacity: o.opacidad ?? 1,
    polygonOffset: true, polygonOffsetFactor: -1 - (o.capa ?? 0), polygonOffsetUnits: -4 - 4 * (o.capa ?? 0),
    depthWrite: !(o.transparente ?? false),
  });
  inyectarAO(m, u);
  return m;
};

// sombra de contacto: plano transparente que sólo oscurece, con la AO de las cápsulas sobre el piso
export const crearMatContacto = (u: UniformsAO, color = "#06142a") => new THREE.ShaderMaterial({
  transparent: true, depthWrite: false,
  uniforms: { ...u, uColor: { value: new THREE.Color(color) }, uOpacidad: { value: 0.9 }, uCentro: { value: new THREE.Vector2() }, uRadio: { value: 3 } },
  vertexShader: /* glsl */ `
    varying vec3 vW;
    void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
  fragmentShader: /* glsl */ `
    varying vec3 vW;
    uniform vec3 uColor; uniform float uOpacidad; uniform vec2 uCentro; uniform float uRadio;
    ${GLSL_AO}
    void main() {
      float ao = aoCapsulas(vW + vec3(0.0, 0.002, 0.0), vec3(0.0, 1.0, 0.0));
      float borde = smoothstep(uRadio, uRadio * 0.6, length(vW.xz - uCentro));
      float a = clamp((1.0 - ao) * 1.35, 0.0, 1.0) * uOpacidad * borde; // el piso oscurece más que el cuerpo (la ref: manchas de contacto marcadas)
      gl_FragColor = vec4(uColor * a, a);
      #include <colorspace_fragment>
    }`,
  premultipliedAlpha: true,
  blending: THREE.NormalBlending,
});

// fondo de estudio en pantalla completa (ya codificado en sRGB, sin tone mapping)
export const crearMatFondoEstudio = (resolucion: THREE.Vector2) => new THREE.ShaderMaterial({
  depthTest: false, depthWrite: false, toneMapped: false,
  uniforms: { uRes: { value: resolucion }, uTinte: { value: new THREE.Vector3(1, 1, 1) } },
  vertexShader: /* glsl */ `void main() { gl_Position = vec4(position.xy, 0.9999, 1.0); }`,
  fragmentShader: /* glsl */ `
    uniform vec2 uRes; uniform vec3 uTinte;
    ${GLSL_FONDO_ESTUDIO}
    vec3 aSRGB(vec3 c) { return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }
    void main() { vec2 uv = gl_FragCoord.xy / uRes; gl_FragColor = vec4(aSRGB(fondoEstudio(uv) * uTinte), 1.0); }`,
});
