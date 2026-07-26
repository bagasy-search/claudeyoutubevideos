import { Filter, GlProgram, defaultFilterVert } from 'pixi.js'

/**
 * Ruido de superficie: la diferencia entre "relleno vectorial" y "material".
 *
 * Se aplica UNA VEZ, al hornear cada sprite. Los filtros de Pixi son caros en
 * ejecucion porque cada objeto filtrado obliga a cambiar de framebuffer — pero
 * en el horneado eso pasa una sola vez al arrancar y despues el ruido es parte
 * de la textura. Coste en runtime: cero.
 *
 * Cuatro detalles que hacen que se lea como superficie y no como suciedad:
 *
 * 1. **Multiplica, no suma.** `col *= 1 + (n-0.5)*A` conserva el tono y deja
 *    los oscuros oscuros. Sumar lava la imagen y tiñe las sombras, que es
 *    exactamente el aspecto de "mugre".
 *
 * 2. **La amplitud sigue a la luminancia.** Textura en las luces, limpio en las
 *    sombras. Ruido de amplitud uniforme sobre una figura sombreada es el
 *    delator mas claro de "shader aplicado encima" en vez de "material".
 *
 * 3. **Coordenadas en TEXELES, no en UV.** Asi un sprite de 32 px y uno de 512
 *    tienen el mismo tamaño APARENTE de grano, en vez del mismo numero de
 *    granos.
 *
 * 4. **Una frecuencia dominante, no un espectro plano.** Un FBM con ganancia
 *    0.5 reparte energia por todas las escalas: correcto para nubes, generico
 *    para un material. Los materiales tienen un tamaño de rasgo caracteristico.
 *
 * La amplitud por defecto es 5%: por debajo del 1% es invisible, por encima del
 * 30% se ve sucio.
 */
const fragment = /* glsl */ `
in vec2 vTextureCoord;
out vec4 finalColor;

uniform sampler2D uTexture;
// highp explicito: el vertex shader por defecto de Pixi declara uInputSize en
// alta precision, y en un fragment shader la precision por defecto es media.
// Si no coinciden, el programa NO ENLAZA y no se dibuja nada — sin error
// evidente mas alla de un aviso en consola.
uniform highp vec4 uInputSize;

uniform float uAmount;
uniform float uScale;
uniform float uWarp;

// Hash sin seno: la version con fract(sin(dot())) depende de la precision de
// cada GPU y muestra estructura visible.
float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    // Interpolante quintico: con el cubico aparecen pliegues en la grilla.
    vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    float a = hash12(i);
    float b = hash12(i + vec2(1.0, 0.0));
    float c = hash12(i + vec2(0.0, 1.0));
    float d = hash12(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// Rotacion entre octavas, o se apilan sobre los mismos ejes y sale un cuadrille.
const mat2 ROT = mat2(0.80, 0.60, -0.60, 0.80);

float fbm(vec2 p) {
    float f = 0.0;
    // Pesos desparejos a proposito: una frecuencia manda y las otras acompañan.
    f += 0.700 * valueNoise(p); p = ROT * p * 2.02;
    f += 0.200 * valueNoise(p); p = ROT * p * 2.03;
    f += 0.100 * valueNoise(p);
    return f;
}

void main(void) {
    vec4 c = texture(uTexture, vTextureCoord);
    if (c.a <= 0.0) { finalColor = c; return; }

    // Pixi trabaja con alfa premultiplicado: hay que deshacerlo antes de tocar
    // el color y rehacerlo al final.
    vec3 rgb = c.rgb / c.a;

    vec2 px = vTextureCoord * uInputSize.xy * uScale;

    // Deformacion del dominio: convierte manchas isotropas en flujo, que es la
    // firma visual de lo organico frente a lo calculado.
    vec2 q = vec2(fbm(px), fbm(px + vec2(5.2, 1.3)));
    float n = fbm(px + uWarp * q);

    float luma = dot(rgb, vec3(0.2126, 0.7152, 0.0722));
    float amp = uAmount * (0.3 + 0.7 * luma);

    rgb *= 1.0 + (n - 0.5) * 2.0 * amp;

    finalColor = vec4(clamp(rgb, 0.0, 1.0) * c.a, c.a);
}
`

export function makeGrainFilter(amount = 0.05, scale = 0.16, warp = 0.4): Filter {
  return new Filter({
    glProgram: GlProgram.from({ vertex: defaultFilterVert, fragment, name: 'grain' }),
    resources: {
      grainUniforms: {
        uAmount: { value: amount, type: 'f32' },
        uScale: { value: scale, type: 'f32' },
        uWarp: { value: warp, type: 'f32' },
      },
    },
    resolution: 'inherit',
  })
}
