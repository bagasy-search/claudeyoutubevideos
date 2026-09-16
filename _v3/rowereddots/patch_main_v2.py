p = "D:/Proyectos/video2-wt/rowereddots/src/rowereddots/Main_rowereddots.tsx"
s = open(p, encoding="utf-8").read()
s = s.replace('import { BASE, COMPS, TOTAL_FRAMES } from "./cues.gen";', 'import { BASE, COMPS, SFX, TOTAL_FRAMES } from "./cues.gen";')
s = s.replace('import { SfxCue, SFX } from "../_fed6/VideoEdit/components/Sfx";\n', '')
s = s.replace('import { LineaTiempoPiel } from "./LineaTiempoEN";', '''import { LineaTiempoPiel } from "./LineaTiempoEN";
import { RowePresenter } from "./RowePresenter";
import { RoweCarousel } from "./RoweCarousel";
import { MythTruth } from "./MythTruth";
import { RedFlags } from "./RedFlags";
import { RoutineSwap } from "./RoutineSwap";
import { FallTease } from "./FallTease";
import { SelfCheck } from "./SelfCheck";''')
a = '''  : null;

// Diseño de sonido'''
b = '''  : b.kind === "presenter" ? <RowePresenter durationInFrames={d} name="Dr. Emmett Rowe" mode={b.mode} img={b.img} bg={b.bg} kicker={b.kicker} role={b.role} cta="SUBSCRIBE" />
  : b.kind === "carousel" ? <RoweCarousel durationInFrames={d} mode={b.mode} cards={b.cards} reveals={b.reveals} offset={b.offset ?? 0} kicker={b.kicker} title={b.title} bed={b.bed} />
  : b.kind === "myth2" ? <MythTruth durationInFrames={d} kicker={b.kicker} myth={b.myth} truth={b.truth} mythImg={b.mythImg} truthImg={b.truthImg} bed={b.bed} hitAt={b.hitAt} truthAt={b.truthAt} />
  : b.kind === "redflags" ? <RedFlags durationInFrames={d} kicker={b.kicker} img={b.img} bed={b.bed} flags={b.flags} stamp={b.stamp} stampAt={b.stampAt} />
  : b.kind === "routineswap" ? <RoutineSwap durationInFrames={d} mode={b.mode} kicker={b.kicker} title={b.title} items={b.items} bed={b.bed} chip={b.chip} chipAt={b.chipAt} />
  : b.kind === "falltease" ? <FallTease durationInFrames={d} kicker={b.kicker} title={b.title} img={b.img} sideL={b.sideL} sideR={b.sideR} bed={b.bed} hitAt={b.hitAt} />
  : b.kind === "selfcheck" ? <SelfCheck durationInFrames={d} kicker={b.kicker} questions={b.questions} offset={b.offset ?? 0} bed={b.bed} />
  : null;

// Diseño de sonido'''
assert a in s; s = s.replace(a, b)
a0 = s.index("// Diseño de sonido"); a1 = s.index("export const MainRowereddots")
s = s[:a0] + s[a1:]
s = s.replace("        {sfxFor(c, c.dur)}\n", "")
a = '''    ))}
  </AbsoluteFill>
);'''
b = '''    ))}

    {/* SFX: lista única emitida por el build (la misma que se mezcla con el máster en la entrega) */}
    {SFX.map((x: any, k: number) => (
      <Sequence key={`sfx${k}`} from={x.from} durationInFrames={75} layout="none">
        <Audio src={staticFile(x.src)} volume={x.vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);'''
assert s.count(a) == 1; s = s.replace(a, b)
open(p, "w", encoding="utf-8").write(s); print("ok")
