# Planeta dos Ferros — site (greybox fase 4)

Astro + React Three Fiber + GSAP ScrollTrigger. Tokens em `src/styles/tokens.css` espelham as variáveis do Figma.

## Rodar
    npm install
    npm run dev      # http://localhost:4321
    npm run build    # dist/

## Onde ajustar
- Timing e câmera dos 6 frames: `src/islands/globe/timeline.ts` (poses por breakpoint em `CAM`).
- Poses dos 12 gomos por estado (globo, cluster, coluna, mapa): `src/islands/globe/targets.ts`.
- Geometria do gomo (vergalhão, estribo, tela): `src/islands/globe/Wedge.tsx` — será substituída pelo `.glb` do Blender na fase 5.
- Copy dos frames e mensagens de WhatsApp: `src/content/frames.ts`.
- Filiais: `src/content/filiais.json`.

## Pendente
- Logo oficial em `public/logo.svg` (exportado do Figma, não alterar).
- Páginas internas (Corte e Dobra, Área de Entrega, Contato, categorias) ainda não existem; os links apontam para as rotas planejadas.
- Tier "medium" só reduz DPR/antialias; medir num Android real.
