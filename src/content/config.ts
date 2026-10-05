import { defineCollection, z } from 'astro:content';

const categorias = defineCollection({
  type: 'content',
  schema: z.object({
    nome: z.string(),
    frente: z.enum(['construcao', 'estrutura', 'serralheria']),
    resumo: z.string(),
    ponte: z.boolean().default(false),
    waTermo: z.string(),
    specs: z.array(z.object({ label: z.string(), valor: z.string() })),
    aplicacoes: z.array(z.string()),
  }),
});

export const collections = { categorias };
