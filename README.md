# Portfólio Eduardo Andrei Staudt · Vol. 1

Portfólio pessoal em formato de volume de mangá: capa que abre com o scroll, capítulos que alternam entre leitura vertical e horizontal, três espadas em 3D, um currículo imprimível e alguns segredos escondidos (um deles é um duelo de cartas).

## Rodando

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de produção
npm run start      # serve o build
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm test           # Vitest: regras do duelo de cartas
npm run format     # Prettier
```

Requer Node 20 ou mais novo.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- Framer Motion: balões, onomatopeias, painéis e modais
- GSAP + ScrollTrigger: capa, scroll horizontal, page flip e transição de capítulo
- React Three Fiber + three.js: cena das espadas, com shader de cel shading próprio
- Fontes via `next/font`: Dela Gothic One (títulos e katakana), Inter (corpo), Comic Neue (balões)
- Vitest: testes das regras do duelo de cartas
- Sem backend. Contato por `mailto:` e links.

## Estrutura

```
app/
  layout.tsx            fontes, metadata, tokens no <head>, header, loader, cursor
  page.tsx              a home: as seis seções em ordem
  globals.css           lê os tokens como CSS variables; utilidades de mangá, keyframes e impressão
  not-found.tsx         404 "Esse capítulo ainda não foi desenhado"
  curriculo/page.tsx    currículo: ficha no estilo do site na tela, documento formal ao imprimir
  segredo/page.tsx      página secreta (abre ao achar todos os easter eggs)
  opengraph-image.tsx   imagem Open Graph gerada no build
  sitemap.ts, robots.ts
styles/tokens.ts        cores, tipografia, espaçamento, bordas, sombras, z-index, durações
components/
  manga/                Panel, PanelGrid, SpeechBubble, ThoughtBubble, Caption, Onomatopoeia,
                        ScreenTone, SpeedLines, InkBorder, PageFlip, PageBend (folha flexível),
                        BreakBubble (balão que quebra ao clicar)
  manga/illustrations/  desenhos em SVG do Cap. 1 e dos projetos
  sections/             Cover, About, Projects, Skills, Research, Contact
  three/                SwordsScene, Sword (modelos procedurais), toon (shaders)
  easter-eggs/          EasterEggProvider, KeySequenceListener, EggCounter, StrawHat, ChainsawCut,
                        Grimoire, PixelEditor, SecretPage, Modal
  easter-eggs/card-duel/  CardDuel (modal e fluxo), Board, Hand, Slot, Card, Portrait, HpBar,
                        ResultScreen
  ui/                   Header, Nav, Cursor, Loader, ThemeToggle, Logo, ChapterSlash, PrintButton,
                        StabLink e SwordGlyph (espada da contracapa)
lib/
  data/                 TODO o conteúdo do site (textos, projetos, links, currículo)
  card-duel/            types, cards (dados), engine (regras puras), ai, engine.test
  theme.ts              tema padrão e script que aplica a escolha salva antes da primeira pintura
  pixel-store.ts        pixel art compartilhada entre o ateliê secreto e o Cap. 1
  hooks/                useKeySequence, useReducedMotion, useIsMobile, useMediaQuery, useTheme
public/logo.svg         a logo
briefing/               logo original e PENDENCIAS.md
```

## Como editar o conteúdo

Tudo que é texto, link ou lista fica em `lib/data/`. Nenhum componente precisa ser aberto.

| Arquivo       | O que tem                                                                      |
| ------------- | ------------------------------------------------------------------------------ |
| `site.ts`     | nome, subtítulo, descrição de SEO, URL do site e os links                      |
| `chapters.ts` | nomes e ordem dos capítulos no sumário (a ordem das seções fica em `page.tsx`) |
| `about.ts`    | os quadros do Cap. 1: recordatório, balões, onomatopeia e qual desenho usar    |
| `projects.ts` | os projetos do Cap. 2 (cada um vira uma página dupla)                          |
| `skills.ts`   | as três espadas do Cap. 3 e as skills de cada uma                              |
| `research.ts` | a linha do tempo do Cap. 4                                                     |
| `contact.ts`  | textos da contracapa                                                           |
| `cv.ts`       | o currículo da página `/curriculo`                                             |
| `eggs.ts`     | easter eggs, ficha do grimório, textos do duelo e da página secreta            |

### Links

Ficam em `lib/data/site.ts`. Um valor que comece com `TODO_` é tratado como pendente: o botão correspondente aparece tracejado com "(em breve)" até você colocar o valor real.

### Currículo

A página `/curriculo` lê `lib/data/cv.ts`. Na tela é uma "ficha do protagonista": faixa com o nome, coluna lateral (formação, competências, honrarias) e coluna principal (resumo, experiência, projetos). O botão "Imprimir / salvar em PDF" abre a impressão do navegador, e a folha impressa é um documento formal: preto no branco, uma fonte só, sem logo, faixas ou etiquetas, em uma página A4. As regras ficam nas classes `print:` da página e no bloco `@media print` de `app/globals.css`; a linha `font-size` do `html` ali dentro controla a escala: diminua se o conteúdo crescer e passar de uma folha.

Cada projeto do currículo aceita uma lista `links`. O do portfólio entra sozinho quando `site.url` deixar de ser placeholder.

### Adicionar um projeto

Copie um bloco em `lib/data/projects.ts` e ajuste. O page flip, os controles e o carrossel mobile se adaptam à quantidade. Campos opcionais: `status` (ex.: `'Em andamento'`) mostra um selo na página; `next` cria o quadro "Parte 2" com a próxima fase do projeto; `soon: true` reserva a página dupla só com o aviso de "em breve". Em `art`, use `'generic'` enquanto o projeto não tiver desenho próprio; para criar um, adicione um componente em `components/manga/illustrations/projects.tsx` e registre o nome no tipo `ProjectArt`.

### Datas da linha do tempo

Em `lib/data/research.ts`, o campo `when` é texto livre (ex.: `'2025'`). Vazio esconde a data.

### Mudar a ordem dos capítulos

Troque a ordem em `lib/data/chapters.ts` (sumário) e a dos componentes em `app/page.tsx`. As duas precisam bater. Ajuste também o `kicker` ("Capítulo N") no arquivo de dados de cada seção.

## Como trocar a logo

Substitua `public/logo.svg` pelo novo arquivo, com o mesmo nome. Só isso.

A logo aparece no header, na capa, no loader, no rodapé, no currículo, no favicon e na imagem Open Graph, e todos leem esse mesmo arquivo. Nenhum efeito depende do desenho: ela só recebe fade/scale simples e `image-rendering: pixelated`. Ela fica sobre uma plaqueta de papel claro, então funciona em qualquer tema. Se a nova logo não for pixel art, remova a classe `pixelated` em `components/ui/Logo.tsx`.

## Temas

- **Colorido** (padrão) e **P&B**: botão no header. No colorido acendem vermelho, laranja e azul; no P&B os acentos apontam para a própria tinta.
- **Página escura** (padrão) e **clara**: botão no header. O padrão de quem ainda não escolheu fica em `DEFAULT_THEME`, em `lib/theme.ts`.
- As cores vivem em `styles/tokens.ts` (`palette` e os temas). O layout gera as CSS variables a partir dali.

## Comportamento por tela

| Seção              | Desktop (≥ 1024px)                                 | Mobile / `prefers-reduced-motion`                                |
| ------------------ | -------------------------------------------------- | ---------------------------------------------------------------- |
| Capa               | abre com o scroll, para a direita, curvando-se     | no mobile abre igual; sem movimento, capa e sumário em sequência |
| Cap. 1 Quem sou    | scroll vertical move a tira para o lado            | quadros empilhados (webtoon)                                     |
| Cap. 2 Projetos    | página dupla em sentido de mangá; a folha se curva | deslizar para o lado (scroll-snap)                               |
| Cap. 3 Habilidades | cena 3D                                            | 3D leve no celular; SVG 2D em aparelho fraco ou sem movimento    |
| Cap. 4 Pesquisa    | os quadros entram deslizando das laterais          | só aparecem (fade)                                               |
| Contracapa         | o cursor vira espada e finca nos links ao clicar   | no toque a espada também finca; sem movimento, link normal       |

No livro de projetos o desenho fica na página direita (lida primeiro) e o texto na esquerda, e as folhas viram para a direita, como a capa. O texto dessas páginas cresce junto com o livro (tamanho em `cqh`/`cqw`).

No Cap. 1, um balão pode ser uma "máscara": em `lib/data/about.ts`, um balão com `reveal` mostra `text`, quebra ao ser clicado e revela `reveal`.

A capa e as folhas dos projetos viram como papel: enquanto a folha está no ar ela é trocada por uma versão cortada em tiras encadeadas (`components/manga/PageBend.tsx`), e cada tira gira um pouco mais que a anterior.

Ao trocar de capítulo rolando, a página dá um tremor leve. O corte diagonal de espada aparece só ao navegar pelo sumário. A cena 3D só é baixada quando a seção se aproxima da tela, e o loop para quando ela sai.

## Easter eggs (spoilers)

<details>
<summary>Mostrar</summary>

1. **Chapéu de palha**: no céu do quadro "Duas graduações" do Cap. 1. Clique: "Tesouro encontrado!", o cursor estica como borracha e o aviso oferece o botão "Aceitar o duelo".
2. **Serra**: digite `eduardo` (ou toque 5 vezes rápido na logo do header). A tela treme, um corte de serra atravessa a página e o nome aparece gritado.
3. **Grimório**: Konami code (↑ ↑ ↓ ↓ ← → ← → B A), ou o trevo discreto no canto da contracapa. O livro desce dentro de um círculo mágico; ao clicar, a capa vira em 3D e a ficha estilo RPG se preenche.

4. **Duelista** (bônus, fora do contador): vencer o duelo de cartas.

O contador no header (de 0 a 3) guarda o progresso no `localStorage`. Com os três segredos, `/segredo` libera o omake: uma tirinha de 4 quadros, o ateliê de pixel art e o atalho para duelar de novo. O desenho feito no ateliê aparece na tela do notebook do Cap. 1 (os dois leem `lib/pixel-store.ts`). Quem venceu o duelo ganha lá o selo "Duelista". Há também uma mensagem no console.

São homenagens com desenhos próprios: nenhum personagem, logo ou arte oficial é reproduzido.

</details>

## Duelo de cartas

O Mangaká (você) contra o Ronin Rubro (IA), dois personagens originais.

- 30 de vida, baralho de 20 cartas, mão de 5, 3 de energia por turno (não acumula), 1 carta comprada por turno.
- Você monta até 3 cartas nos slots e clica em "Executar": elas resolvem da esquerda para a direita. A ordem importa (Foco antes de um golpe dobra o dano; Prazo Final antes de uma carta cara paga por ela).
- O escudo dura até o fim do próximo turno do rival. Baralho vazio: 2 de dano por compra impossível.
- Três níveis: Fácil e Normal mostram a intenção do rival; o Difícil monta combos e esconde o jogo.
- Jogar uma carta: arrastar até o slot, clicar na carta e no slot, ou no teclado (setas andam, Enter seleciona, Enter de novo manda para o primeiro slot livre).

As cartas ficam em `lib/card-duel/cards.ts` e as regras em `lib/card-duel/engine.ts` (funções puras, cobertas por `npm test`). O minijogo só é baixado quando alguém aceita o duelo.

## Deploy na Vercel

1. Importe o repositório na Vercel (framework detectado: Next.js, sem configuração extra).
2. Defina a variável `NEXT_PUBLIC_SITE_URL` com a URL final, sem barra no fim (ex.: `https://eduardostaudt.dev`). Ela alimenta metadata, sitemap e robots.

## Acessibilidade

- Todo o texto é texto real; ilustrações têm `aria-label`, enfeites têm `aria-hidden`.
- Tudo funciona por teclado: sumário, espadas (pelas plaquinhas abaixo da cena), page flip (botões e ← →), grimório e duelo de cartas (foco preso, Esc fecha).
- `prefers-reduced-motion` desliga scroll horizontal, flips, cursor customizado, tremores, o golpe de espada nos links e a cena 3D.
