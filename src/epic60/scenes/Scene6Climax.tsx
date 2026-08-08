import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring} from 'remotion';
import {Avatar} from '../components/Avatar';
import {LightRays} from '../components/LightRays';
import {Particles} from '../components/Particles';
import {Shockwave} from '../components/Shockwave';
import {Letterbox} from '../components/Letterbox';
import {lin, eo, shake} from '../lib/anim';
import {DISPLAY, UI} from '../fonts';
import {COLORS, BEAT, S} from '../config';
import {useBrand} from '../lib/Brand';

const DROP = 30; // beat global 94 → frame 1410

export const Scene6Climax: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {accent} = useBrand();
  const d = S.S6;

  // ── Fase A: riser (0–28) ──
  const dim = lin(f, 0, 28, 0, 0.92);
  const ringD = lin(f, 0, 28, 900, 40);
  const preShake = f < 28 ? shake('pre', f, f * 0.25) : {x: 0, y: 0, r: 0};

  // ── Fase B: drop (30+) ──
  const slam = eo(f, DROP, DROP + 12);
  const titleScale = 2.4 - 1.4 * slam;
  const chroma = f > DROP + 12 && f < DROP + 24;
  // bass pump: escala en cada beat post-drop
  const sinceDrop = f - DROP;
  const pumpT = sinceDrop > 0 ? (sinceDrop % BEAT) / 7 : 1;
  const bassPump = sinceDrop > 0 ? 1 + 0.022 * Math.max(0, 1 - pumpT) : 1;
  const hero = spring({frame: Math.max(0, f - (DROP + 24)), fps, config: {damping: 10, stiffness: 110}});
  const out = lin(f, d - 6, d, 0, 1);

  return (
    <AbsoluteFill style={{background: '#040406', justifyContent: 'center', alignItems: 'center', overflow: 'hidden'}}>
      {f >= DROP && (
        <>
          <LightRays color={`${accent}1a`} />
          <AbsoluteFill style={{background: `radial-gradient(circle at 50% 46%, ${accent}26, transparent 55%)`}} />
        </>
      )}

      {/* 2 frames de negro total: el silencio antes del drop */}
      {f >= 28 && f < DROP && <AbsoluteFill style={{background: '#000'}} />}

      <AbsoluteFill
        style={{
          justifyContent: 'center', alignItems: 'center',
          transform: `scale(${(f >= DROP ? lin(f, DROP, d, 1, 1.08) : 1) * bassPump}) translate(${preShake.x}px, ${preShake.y}px)`,
        }}
      >
        {f < 28 && (
          <>
            {/* anillo que colapsa + porcentaje de carga */}
            <div style={{width: ringD, height: ringD, borderRadius: ringD, border: `2px solid ${accent}`, opacity: 0.8}} />
            <div style={{position: 'absolute', bottom: 130, fontFamily: UI, fontSize: 26, letterSpacing: '0.4em', color: COLORS.dim, fontVariantNumeric: 'tabular-nums'}}>
              CARGANDO NIVEL… {Math.round(lin(f, 0, 27, 0, 100))}%
            </div>
          </>
        )}

        {f >= DROP && (
          <>
            <div style={{fontFamily: DISPLAY, fontSize: 84, letterSpacing: '0.5em', color: COLORS.dim, opacity: eo(f, DROP, DROP + 12), transform: `translateY(${(1 - eo(f, DROP, DROP + 12)) * 40}px)`, marginBottom: 10}}>
              ESTO ES
            </div>

            {/* título 3D en capas */}
            <div style={{position: 'relative', transform: `scale(${titleScale})`}}>
              {[6, 5, 4, 3, 2, 1].map((k) => (
                <div
                  key={k}
                  style={{
                    position: 'absolute', top: 0, left: 0, right: 0,
                    fontFamily: DISPLAY, fontSize: 290, whiteSpace: 'nowrap', textAlign: 'center',
                    color: '#191920', WebkitTextStroke: '1px #2a2a35',
                    transform: `translateY(${k * 5}px)`,
                  }}
                >
                  EL NIVEL
                </div>
              ))}
              <div
                style={{
                  fontFamily: DISPLAY, fontSize: 290, whiteSpace: 'nowrap', color: '#fff', textAlign: 'center',
                  textShadow: chroma ? '-8px 0 rgba(255,45,85,0.65), 8px 0 rgba(46,230,255,0.65)' : `0 0 90px ${accent}66`,
                }}
              >
                EL NIVEL
              </div>
            </div>
          </>
        )}
      </AbsoluteFill>

      {/* shockwaves + partículas del drop */}
      <Shockwave at={DROP} color="#ffffff" max={1700} dur={24} />
      <Shockwave at={DROP + 16} color={accent} max={1200} dur={22} />
      <Particles mode="burst" count={90} seed="boom" color={accent} start={DROP} life={70} gravity={0.22} origin={{x: 960, y: 470}} />
      {f >= DROP + 10 && <Particles count={34} seed="embers" color={`${accent}aa`} />}

      {/* avatar héroe */}
      {f >= DROP + 20 && (
        <div style={{position: 'absolute', right: 130, bottom: 60, transform: `scale(${hero}) rotate(${(1 - hero) * 30}deg)`, opacity: hero}}>
          <div style={{position: 'absolute', inset: -70, borderRadius: 300, background: `radial-gradient(circle, ${accent}40, transparent 65%)`}} />
          <Avatar size={360} mood="hero" src="avatar/hero.png" />
        </div>
      )}

      <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: '#000', opacity: f < 28 ? dim : 0, pointerEvents: 'none'}} />
      {f >= DROP && <Letterbox at={DROP} dur={15} max={80} />}

      {/* fade a blanco hacia el outro */}
      <AbsoluteFill style={{background: '#fff', opacity: out}} />
    </AbsoluteFill>
  );
};
