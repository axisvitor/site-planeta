import { clusters } from '../../content/frames';

export const WEDGES = 12;
export const R = 1.6;

export type Pose = { p: [number, number, number]; r: [number, number, number]; s: number };
export type State = 'globe' | 'cluster' | 'column' | 'map';
export const STATES: State[] = ['globe', 'cluster', 'column', 'map'];

const rand = (seed: number) => { const x = Math.sin(seed * 9999) * 10000; return x - Math.floor(x); };

/** Pose de cada gomo em cada estado. Globo = identidade (os gomos já nascem na posição). */
export const targets: Record<State, Pose[]> = {
  globe: Array.from({ length: WEDGES }, () => ({ p: [0, 0, 0], r: [0, 0, 0], s: 1 })),

  // F3: 12 gomos em 5 clusters (vergalhão, colunas, telas, vigas, telhas)
  cluster: Array.from({ length: WEDGES }, (_, i) => {
    const c = clusters[i % clusters.length];
    const k = Math.floor(i / clusters.length);
    return {
      p: [c.pos[0] + (rand(i) - 0.5) * 0.9, c.pos[1] + (rand(i + 7) - 0.5) * 0.7 - k * 0.25, c.pos[2] + k * 0.3],
      r: [rand(i + 3) * 1.4, rand(i + 11) * 2.2, rand(i + 19) * 0.8],
      s: 0.42,
    };
  }),

  // F4: gomos deitados e empilhados viram a gaiola de uma coluna armada
  column: Array.from({ length: WEDGES }, (_, i) => ({
    p: [1.4, -1.9 + i * (3.8 / (WEDGES - 1)), 0],
    r: [Math.PI / 2, (i % 2) * (Math.PI / 6), 0],
    s: 0.34,
  })),

  // F5: gomos viram pinos/trecho de rota sobre o plano do mapa (vista de cima)
  map: Array.from({ length: WEDGES }, (_, i) => {
    const t = i / (WEDGES - 1);
    // rota Parauapebas (−1.2, 1.4) → Canaã (−0.6, 0.4) → Xinguara (0.3, −1.6)
    const x = t < 0.5 ? -1.2 + (t / 0.5) * 0.6 : -0.6 + ((t - 0.5) / 0.5) * 0.9;
    const z = t < 0.5 ? -1.4 + (t / 0.5) * 1.0 : -0.4 + ((t - 0.5) / 0.5) * 2.0;
    const isPin = i === 0 || i === 6 || i === WEDGES - 1;
    return { p: [x, isPin ? 0.35 : 0.05, z], r: [isPin ? 0 : Math.PI / 2, t * 3, 0], s: isPin ? 0.22 : 0.12 };
  }),
};
