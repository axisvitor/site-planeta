import { useEffect, useRef, useState } from 'react';
import Scene, { initialDriver, type Driver } from './Scene';
import { buildTimeline, initialCam } from './timeline';
import { frames, clusters } from '../../content/frames';
import './hero.css';

type Tier = 'high' | 'medium' | 'low';

function detectTier(): Tier {
  if (typeof window === 'undefined') return 'low';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'low';
  const c = document.createElement('canvas');
  const gl = c.getContext('webgl2') || c.getContext('webgl');
  if (!gl) return 'low';
  const cores = navigator.hardwareConcurrency || 4;
  const mem = (navigator as any).deviceMemory || 4;
  const narrow = window.innerWidth < 768;
  if (narrow && (cores <= 4 || mem <= 4)) return 'medium';
  return 'high';
}

const WaIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.1.7a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z"/></svg>
);

export default function Hero() {
  const driver = useRef<Driver>(initialDriver());
  const root = useRef<HTMLElement>(null!);
  const overlayRefs = useRef<HTMLElement[]>([]);
  const tickRefs = useRef<HTMLElement[]>([]);
  const [tier, setTier] = useState<Tier | null>(null);

  useEffect(() => { setTier(detectTier()); }, []);

  useEffect(() => {
    if (!tier || tier === 'low') return;
    const mobile = window.innerWidth < 1200;
    driver.current.cam = initialCam(mobile);
    const tl = buildTimeline(driver.current, root.current, overlayRefs.current, tickRefs.current, mobile);
    return () => { tl.scrollTrigger?.kill(); tl.kill(); };
  }, [tier]);

  // tier baixo / reduced-motion: só o frame 1, sem pin, sem WebGL
  const shown = tier === 'low' ? frames.slice(0, 1) : frames;

  return (
    <section ref={root} className={`hero hero--${tier ?? 'loading'}`} data-theme="dark">
      <div className="hero__canvas">
        {tier && tier !== 'low' && <Scene driver={driver} tier={tier} />}
        {tier === 'low' && <div className="hero__poster" aria-hidden />}
      </div>
      <div className="hero__scrim" aria-hidden />

      {tier !== 'low' && (
        <ul className="hero__labels" aria-hidden>
          {clusters.map((c) => <li key={c.label} className="label3d">{c.label}</li>)}
        </ul>
      )}

      <div className="hero__copy container">
        {shown.map((f, i) => (
          <article key={f.id} ref={(el) => { if (el) overlayRefs.current[i] = el; }} className="frame" data-frame={f.id}>
            <p className="t-overline frame__overline">{f.overline}</p>
            <h1 className="t-display frame__title">{f.title}</h1>
            {f.sub && <p className="t-body-lg frame__sub">{f.sub}</p>}
            {f.bullets && (
              <ul className="frame__bullets">{f.bullets.map((b) => <li key={b} className="t-h4">{b}</li>)}</ul>
            )}
            <div className="frame__ctas">
              {f.ctas.map((c) => (
                <a key={c.label} href={c.href} className={`btn btn--l btn--${c.kind}`} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                  {c.kind === 'whatsapp' && <WaIcon />}{c.label}
                </a>
              ))}
            </div>
          </article>
        ))}
        {tier !== 'low' && <p className="t-small hero__hint">Role para explorar</p>}
      </div>

      {tier !== 'low' && (
        <ol className="hero__progress" aria-hidden>
          {frames.map((f, i) => <li key={f.id} ref={(el) => { if (el) tickRefs.current[i] = el; }} className={i === 0 ? 'is-active' : ''} />)}
        </ol>
      )}
    </section>
  );
}
