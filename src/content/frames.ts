/** Storyboard do scroll — aba 1 e aba 4 da documentação. `range` = fração do scroll da seção pinada. */
export type Frame = {
  id: number;
  range: [number, number];
  overline: string;
  title: string;
  sub?: string;
  bullets?: string[];
  ctas: { label: string; href: string; kind: 'primary' | 'whatsapp' | 'secondary' | 'ghost' }[];
};

export const WA = (msg: string) =>
  `https://wa.me/5594991631413?text=${encodeURIComponent(msg)}`;

export const frames: Frame[] = [
  {
    id: 1, range: [0, 0.1], overline: '01 / 06',
    title: 'Todo o aço da sua obra. Cortado, dobrado e entregue.',
    sub: 'Ferro e aço para construção e serralheria, com entrega em todo o sul do Pará.',
    ctas: [
      { label: 'Pedir orçamento no WhatsApp', href: WA('Olá! Vim pelo site e quero um orçamento de aço.'), kind: 'whatsapp' },
      { label: 'Enviar projeto', href: '/corte-e-dobra#projeto', kind: 'primary' },
    ],
  },
  {
    id: 2, range: [0.1, 0.25], overline: '02 / 06',
    title: 'Corte e dobra automatizado.',
    sub: 'Na medida do projeto, sem sobra de ponta no canteiro.',
    ctas: [{ label: 'Como funciona', href: '/corte-e-dobra', kind: 'secondary' }],
  },
  {
    id: 3, range: [0.25, 0.5], overline: '03 / 06',
    title: 'Construção, estrutura e serralheria no mesmo lugar.',
    ctas: [{ label: 'Ver produtos', href: '/produtos', kind: 'secondary' }],
  },
  {
    id: 4, range: [0.5, 0.7], overline: '04 / 06',
    title: 'Mande o projeto. O resto é com a gente.',
    bullets: ['Projeto plotado e orçado sem custo', 'Corte e dobra na máquina', 'Entrega no cronograma da obra'],
    ctas: [{ label: 'Enviar projeto', href: '/corte-e-dobra#projeto', kind: 'primary' }],
  },
  {
    id: 5, range: [0.7, 0.85], overline: '05 / 06',
    title: 'Entregamos de Parauapebas a Xinguara.',
    sub: 'Duas lojas e entrega programada para o sul do Pará.',
    ctas: [{ label: 'Ver área de entrega', href: '/area-de-entrega', kind: 'secondary' }],
  },
  {
    id: 6, range: [0.85, 1], overline: '06 / 06',
    title: 'Planeta dos Ferros. Aço para a obra que não pode parar.',
    ctas: [
      { label: 'Falar com a loja', href: WA('Olá! Vim pelo site e quero falar com a loja.'), kind: 'whatsapp' },
      { label: 'Enviar projeto', href: '/corte-e-dobra#projeto', kind: 'primary' },
    ],
  },
];

/** Clusters do frame 3 (nome + posição relativa na cena, em unidades de mundo). */
export const clusters = [
  { label: 'Vergalhão', pos: [-2.6, 1.3, 0] },
  { label: 'Colunas e treliças', pos: [0.2, 1.9, -0.6] },
  { label: 'Telas soldadas', pos: [2.8, 1.0, 0.2] },
  { label: 'Vigas e perfis', pos: [-1.4, -1.5, 0.4] },
  { label: 'Telhas', pos: [1.9, -1.6, -0.3] },
] as const;
