// Envoltorio para lanzar la cadena de Loretta con SLUG por argumento (bg.mjs no pasa env de forma fiable):
//   node vlog/hh/av.mjs <slug> <script.mjs relativo> [args…]   p.ej. node vlog/hh/av.mjs hhwinter vlog/loretta/avatar_run.mjs run
const [, , slug, script, ...rest] = process.argv;
process.env.SLUG = slug;
process.argv = [process.argv[0], script, ...rest];
await import("file:///D:/Proyectos/video2-wt/lhh/" + script);
