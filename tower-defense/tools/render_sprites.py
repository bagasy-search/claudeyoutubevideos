#!/usr/bin/env python3
"""
Renderiza un modelo 3D animado (el que sale de Meshy, por ejemplo) a los frames
PNG que consume el atlas del juego.

Es la pieza que falta entre "tengo un GLB con una caminata" y "tengo un sprite".
Y es la que resuelve de raiz el problema de consistencia: los frames son
renders del MISMO modelo, asi que calzan por construccion. Una IA de imagenes
no puede garantizar eso, un render si.

Agrega dos cosas que el modelo no trae y que el juego necesita:

- **Camara ortografica al frente.** Sin perspectiva, para que el personaje no
  cambie de proporcion segun donde este parado en el mapa.
- **Fondo transparente y luz pareja**, para que el sprite se recorte solo.

El contorno NO se hace aca. Se probo con casco invertido en 3D y es fragil: el
grosor queda en unidades de mundo (cambia con el tamaño del modelo), y sobre
mallas poco densas la superficie desplazada se hunde entre vertices y la tinta
asoma como una rejilla. Ademas Cycles ignora el culling de caras, que es en lo
que el truco se apoya. El contorno del estilo chibi es una propiedad de
PANTALLA — tantos pixeles, siempre los mismos — asi que lo hace prep_sprite.py
sobre el PNG, donde ademas sirve igual para arte 2D que nunca paso por 3D.

Uso (con Blender instalado):

    blender -b -P tools/render_sprites.py -- modelo.glb --out frames/ --frames 12

Uso (con el modulo bpy de pip, sin Blender instalado):

    pip install bpy
    python3 tools/render_sprites.py modelo.glb --out frames/ --frames 12

Despues, los PNG pasan por prep_sprite.py, que los centra y escala al radio del
enemigo.
"""

import argparse
import math
import os
import sys

try:
    import bpy
    from mathutils import Vector
except ImportError:
    sys.exit("Esto corre dentro de Blender.  blender -b -P tools/render_sprites.py -- ...\n"
             "O instala el modulo:  pip install bpy")


def parse_args() -> argparse.Namespace:
    # Con `blender -b -P script -- a b c`, los argumentos reales van despues de --.
    argv = sys.argv
    if "--" in argv:
        argv = argv[argv.index("--") + 1:]
    else:
        argv = argv[1:]

    ap = argparse.ArgumentParser(description="Renderiza un modelo animado a frames PNG.")
    ap.add_argument("model", help="archivo .glb, .gltf o .fbx")
    ap.add_argument("--out", required=True, help="carpeta de salida")
    ap.add_argument("--frames", type=int, default=12, help="frames del ciclo (default 12)")
    ap.add_argument("--size", type=int, default=512, help="lado del render en px")
    ap.add_argument("--engine", default="CYCLES", choices=["CYCLES", "BLENDER_EEVEE_NEXT", "BLENDER_WORKBENCH"])
    ap.add_argument("--samples", type=int, default=16, help="muestras de render")
    ap.add_argument("--yaw", type=float, default=0.0, help="giro del personaje en grados")
    ap.add_argument("--margin", type=float, default=1.12, help="aire alrededor del personaje")
    return ap.parse_args(argv)


def clear_scene() -> None:
    bpy.ops.wm.read_factory_settings(use_empty=True)


def import_model(path: str) -> None:
    ext = os.path.splitext(path)[1].lower()
    if ext in (".glb", ".gltf"):
        bpy.ops.import_scene.gltf(filepath=path)
    elif ext == ".fbx":
        bpy.ops.import_scene.fbx(filepath=path)
    elif ext == ".obj":
        bpy.ops.wm.obj_import(filepath=path)
    else:
        sys.exit(f"formato no soportado: {ext}")


def scene_bounds() -> tuple[Vector, Vector]:
    """Caja que contiene toda la geometria, en coordenadas de mundo."""
    lo = Vector((1e9, 1e9, 1e9))
    hi = Vector((-1e9, -1e9, -1e9))
    found = False
    for obj in bpy.context.scene.objects:
        if obj.type != "MESH":
            continue
        found = True
        for corner in obj.bound_box:
            p = obj.matrix_world @ Vector(corner)
            lo = Vector((min(lo[i], p[i]) for i in range(3)))
            hi = Vector((max(hi[i], p[i]) for i in range(3)))
    if not found:
        sys.exit("el archivo no trae ninguna malla")
    return lo, hi


def add_lighting() -> None:
    """Luz plana y pareja: el sombreado lo tiene que dar el dibujo, no la escena."""
    world = bpy.data.worlds.new("mundo")
    bpy.context.scene.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes["Background"]
    bg.inputs["Color"].default_value = (1, 1, 1, 1)
    bg.inputs["Strength"].default_value = 0.8

    for name, rot, energy in [
        ("clave", (math.radians(55), 0, math.radians(35)), 3.0),
        ("relleno", (math.radians(70), 0, math.radians(-120)), 1.2),
    ]:
        light = bpy.data.lights.new(name, type="SUN")
        light.energy = energy
        light.angle = math.radians(20)
        obj = bpy.data.objects.new(name, light)
        obj.rotation_euler = rot
        bpy.context.collection.objects.link(obj)


def add_camera(lo: Vector, hi: Vector, margin: float) -> bpy.types.Object:
    """
    Camara ortografica de frente. Sin perspectiva el personaje mide siempre lo
    mismo, que es lo que hace que un sprite se pueda escalar sin sorpresas.
    """
    center = (lo + hi) / 2
    size = hi - lo
    span = max(size.x, size.z) * margin

    cam_data = bpy.data.cameras.new("camara")
    cam_data.type = "ORTHO"
    cam_data.ortho_scale = span
    cam = bpy.data.objects.new("camara", cam_data)
    # Blender mira hacia -Z; rotando 90 en X queda mirando a -Y (el frente).
    cam.rotation_euler = (math.radians(90), 0, 0)
    cam.location = (center.x, lo.y - max(size.y, 1.0) * 4, center.z)
    bpy.context.collection.objects.link(cam)
    bpy.context.scene.camera = cam
    return cam


def setup_render(args: argparse.Namespace) -> None:
    scene = bpy.context.scene
    scene.render.engine = args.engine
    scene.render.resolution_x = args.size
    scene.render.resolution_y = args.size
    scene.render.resolution_percentage = 100
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"

    if args.engine == "CYCLES":
        scene.cycles.samples = args.samples
        scene.cycles.use_denoising = False
    elif args.engine == "BLENDER_EEVEE_NEXT":
        scene.eevee.taa_render_samples = args.samples


def animation_range() -> tuple[int, int]:
    """
    Rango de la animacion importada; si no hay, un solo frame.

    El importador de glTF a veces deja la accion sin asignar al objeto. Si no se
    asigna, `frame_set` no mueve nada y salen doce frames identicos — que es
    exactamente el sintoma de "el sprite no se anima".
    """
    for obj in bpy.context.scene.objects:
        if obj.type != "ARMATURE":
            continue
        if obj.animation_data is None:
            obj.animation_data_create()
        if obj.animation_data.action is None and bpy.data.actions:
            obj.animation_data.action = bpy.data.actions[0]

    start, end = None, None
    for action in bpy.data.actions:
        a, b = action.frame_range
        start = a if start is None else min(start, a)
        end = b if end is None else max(end, b)
    if start is None:
        return 1, 1
    return int(start), int(end)


def main() -> None:
    args = parse_args()
    os.makedirs(args.out, exist_ok=True)

    clear_scene()
    import_model(args.model)

    if args.yaw:
        for obj in bpy.context.scene.objects:
            if obj.parent is None:
                obj.rotation_euler.z += math.radians(args.yaw)
        bpy.context.view_layer.update()

    lo, hi = scene_bounds()
    add_lighting()
    add_camera(lo, hi, args.margin)
    setup_render(args)

    start, end = animation_range()
    scene = bpy.context.scene
    print(f"animacion: frames {start} a {end}")

    # Se muestrea el ciclo en `frames` pasos. El ultimo frame se omite porque en
    # un ciclo cerrado es igual al primero y duplicarlo genera un tranco doble.
    span = max(1, end - start)
    written = []
    for i in range(args.frames):
        frame = start + round(span * i / args.frames)
        scene.frame_set(int(frame))
        dest = os.path.join(args.out, f"walk_{i:02d}.png")
        scene.render.filepath = dest
        bpy.ops.render.render(write_still=True)
        written.append(dest)
        print(f"  frame {i + 1}/{args.frames} -> {dest}")

    print(f"\nlisto: {len(written)} frames en {args.out}")
    print("Siguiente paso:")
    print(f"  python3 tools/prep_sprite.py {args.out}/*.png --radius 40 --out-dir public/art/coloso")


if __name__ == "__main__":
    main()
