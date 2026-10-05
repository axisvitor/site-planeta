export const frentes = {
  construcao: { nome: 'Construção', ordem: ['vergalhao', 'colunas-e-trelicas', 'telas-soldadas', 'arames'] },
  estrutura: { nome: 'Estrutura e cobertura', ordem: ['vigas-e-perfis', 'telhas'] },
  serralheria: { nome: 'Serralheria e solda', ordem: ['material-para-serralheria', 'eletrodos', 'discos'] },
} as const;
export type Frente = keyof typeof frentes;
