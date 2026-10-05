import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Driver } from './Scene';
import { frames } from '../../content/frames';

gsap.registerPlugin(ScrollTrigger);

type Cam = Driver['cam'];
/** Poses de câmera por frame. Desktop: objeto à direita (texto à esquerda). Mobile: objeto no terço superior. */
const CAM = {
  desktop: {
    f1: { x: -2.4, y: 0.2, z: 7.2, tx: -1.3, ty: 0, tz: 0 },
    f2: { x: -0.4, y: 0.5, z: 3.0, tx: -0.9, ty: 0.3, tz: 0.6 },
    f3: { x: -1.2, y: 0.3, z: 8.4, tx: -0.6, ty: 0.2, tz: 0 },
    f4: { x: -3.2, y: 0.4, z: 6.4, tx: -0.4, ty: 0, tz: 0 },
    f5: { x: -1.4, y: 7.6, z: 2.4, tx: -1.0, ty: 0, tz: -0.2 },
  },
  mobile: {
    f1: { x: 0, y: -1.2, z: 11.5, tx: 0, ty: -3.2, tz: 0 },
    f2: { x: 0, y: -0.6, z: 5.2, tx: 0.2, ty: -2.2, tz: 0.6 },
    f3: { x: 0, y: -1.0, z: 12.5, tx: 0, ty: -3.0, tz: 0 },
    f4: { x: -1.2, y: -0.8, z: 9.5, tx: 1.4, ty: -2.6, tz: 0 },
    f5: { x: 0, y: 8.5, z: 3.5, tx: 0, ty: 0, tz: 0.6 },
  },
} satisfies Record<string, Record<string, Cam>>;

export function initialCam(mobile: boolean): Cam { return { ...(mobile ? CAM.mobile.f1 : CAM.desktop.f1) }; }

/**
 * Uma timeline de duração 1 (= 100% do scroll da seção pinada), com scrub.
 * O GSAP só escreve no `driver`; o R3F lê a cada frame. Timing ajustável sem re-exportar nada.
 */
export function buildTimeline(driver: Driver, root: HTMLElement, overlays: HTMLElement[], ticks: HTMLElement[], mobile: boolean) {
  const W = driver.w, C = driver.cam;
  const P = mobile ? CAM.mobile : CAM.desktop;
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: root,
      start: 'top top',
      end: '+=500%',            // ~500vh de scroll
      pin: true,
      scrub: 0.6,               // leve suavização; mantém o scroll responsivo
      anticipatePin: 1,
      onUpdate: (st) => {
        const i = frames.findIndex((f) => st.progress >= f.range[0] && st.progress < f.range[1]);
        const idx = i < 0 ? frames.length - 1 : i;
        ticks.forEach((t, k) => t.classList.toggle('is-active', k === idx));
        root.dataset.frame = String(idx + 1);
      },
    },
  });

  // F1 0–.10: globo girando, câmera média
  tl.to(driver, { spin: 0.6, duration: 0.10 }, 0);
  // F2 .10–.25: dolly in até um meridiano
  tl.to(C, { ...P.f2, duration: 0.15, ease: 'power2.inOut' }, 0.10);
  tl.to(driver, { spin: 1.3, duration: 0.15 }, 0.10);
  // F3 .25–.50: pull back + gomos viram clusters
  tl.to(C, { ...P.f3, duration: 0.12, ease: 'power2.inOut' }, 0.25);
  tl.to(W, { globe: 0, cluster: 1, duration: 0.14, ease: 'power3.inOut' }, 0.27);
  // F4 .50–.70: travelling lateral + clusters viram coluna armada
  tl.to(W, { cluster: 0, column: 1, duration: 0.12, ease: 'power3.inOut' }, 0.50);
  tl.to(C, { ...P.f4, duration: 0.18, ease: 'power2.inOut' }, 0.50);
  // F5 .70–.85: plongée; peças viram rota no mapa
  tl.to(W, { column: 0, map: 1, duration: 0.10, ease: 'power3.inOut' }, 0.70);
  tl.to(driver, { mapOpacity: 1, duration: 0.08 }, 0.72);
  tl.to(C, { ...P.f5, duration: 0.14, ease: 'power2.inOut' }, 0.70);
  // F6 .85–1: globo se remonta, câmera volta ao F1
  tl.to(driver, { mapOpacity: 0, duration: 0.05 }, 0.85);
  tl.to(W, { map: 0, globe: 1, duration: 0.11, ease: 'power3.inOut' }, 0.86);
  tl.to(C, { ...P.f1, duration: 0.14, ease: 'power2.inOut' }, 0.85);
  tl.to(driver, { spin: 2.4, duration: 0.15 }, 0.85);

  // overlays HTML: cada frame entra (ease-out) e sai rápido
  frames.forEach((f, i) => {
    const el = overlays[i]; if (!el) return;
    const [a, b] = f.range;
    const fadeIn = Math.min(0.03, (b - a) * 0.25), fadeOut = Math.min(0.02, (b - a) * 0.2);
    gsap.set(el, { autoAlpha: i === 0 ? 1 : 0, y: i === 0 ? 0 : 24 });
    if (i > 0) tl.to(el, { autoAlpha: 1, y: 0, duration: fadeIn, ease: 'power2.out' }, a);
    if (i < frames.length - 1) tl.to(el, { autoAlpha: 0, y: -16, duration: fadeOut, ease: 'power2.in' }, b - fadeOut);
  });

  return tl;
}
