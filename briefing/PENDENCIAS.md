# Pendências

O que depende de você, Eduardo. Quase tudo se resolve editando `lib/data/`.

## 1. Configuração

- [ ] **URL do site**: hoje `https://TODO_DOMINIO.vercel.app`. Defina `NEXT_PUBLIC_SITE_URL` na Vercel (ou troque o valor em `lib/data/site.ts`). Sem isso, sitemap, robots e Open Graph apontam para um domínio que não existe.
- [x] GitHub, e-mail, NNAdsorption e Hero Maze: preenchidos.
- [x] Currículo: virou a página `/curriculo` (conteúdo em `lib/data/cv.ts`).

## 2. Dúvidas sobre o que você pediu

- [ ] **"Tapys"**: esse nome não aparecia em nenhum lugar do site, então não havia o que trocar. Se ele está ligado a algum texto que existe (o Glazzy, por exemplo), me diga qual.
- [ ] **LAMIA**: o nome também não aparecia. Tirei a única coisa ligada a ele, o quadro do "bootcamp de ML" no Cap. 1, e coloquei no lugar um quadro sobre projetos da faculdade (Batalha Naval em Assembly, GymSolver, benchmark de ordenação). O bootcamp também ficou fora do currículo.
- [ ] **Duelo de cartas**: segui o prompt do minijogo, que pede dois personagens originais (o Mangaká e o Ronin Rubro) em vez de personagens de anime. O labirinto antigo saiu.
- [ ] **Vitória no duelo**: conta como 4º segredo no contador, mas é bônus: a página secreta abre com os três primeiros e mostra o selo "Duelista" para quem venceu. Se preferir que a vitória seja obrigatória, tire `optional: true` do item `duelo` em `lib/data/eggs.ts`.
- [ ] **"Em vez de vrrrum, eduardo"**: fiz as duas leituras: a palavra a digitar agora é `eduardo`, e o grito na tela é "EDUARDO!!" (o VRRRUM ficou menor, ao fundo).
- [ ] **Página "Em breve"**: ficou vazia de propósito, só com o desenho. A continuação com PINNs virou o quadro "Parte 2 · Em desenvolvimento" dentro do NNAdsorption. O texto desse quadro (`next` em `lib/data/projects.ts`) fui eu que escrevi: revise.
- [ ] **Imagem do currículo**: a imagem de como o currículo estava ficando não chegou até mim (só veio a do grimório). Refiz o layout e conferi gerando o PDF: uma página em A4 e em Carta.

## 3. Textos que eu escrevi sem ter a informação

- [ ] **Glazzy** (`lib/data/projects.ts`): descrição, destaques e `stack` (`['Web', 'ERP']`) continuam genéricos. Não sei as tecnologias nem o seu papel exato.
- [ ] **Resumo do currículo** (`lib/data/cv.ts`): reescrevi a versão da Blip de forma generalista. Revise o tom.
- [ ] **Equilíbrio do duelo**: os valores das cartas são os do seu prompt. Em simulação, quem joga bem vence o Fácil quase sempre e o Difícil na maioria das vezes; não testei com pessoas.
- [ ] **Lattes**: o PDF tinha o link, mas eu não tenho a URL. Não entrou no currículo.
- [ ] **Links por projeto no currículo**: o PDF tinha "GitHub" em GymSolver, Batalha Naval, ordenação e na IC. Sem as URLs dos repositórios, ficaram sem link; o cabeçalho aponta para o seu perfil.
- [ ] **Linha do tempo** (`lib/data/research.ts`): só o CNMAC tem ano. A ordem (OBMEP → IC → SICITE → CNMAC) é suposição, e o SICITE não aparece no seu currículo: confirme se você apresentou lá ou remova o item.
- [ ] **Habilidades das espadas** (`lib/data/skills.ts`): vieram do briefing original (Next.js, C, UML...) e não batem com as competências do currículo (Python, Java, Flutter, TensorFlow...). Não mexi porque você não pediu.
- [ ] **Ficha do grimório** (`lib/data/eggs.ts`): os números dos atributos e a classe são inventados.

## 4. Decisões que tomei

- OBMEP agora só aparece em dois lugares: um item curto na linha do tempo e uma linha no currículo, sem o "5". Saiu do Cap. 1 e do grimório.
- A capa abre para a direita (lombada à direita), como mangá. O page flip dos projetos continua no sentido ocidental. As duas viradas agora curvam a folha.
- Clicar em um link da contracapa atrasa a abertura em meio segundo para a espada fincar. Com Ctrl/Shift/botão do meio ou movimento reduzido, o link abre na hora.
- O grimório usa vermelho e preto fixos, inclusive no modo P&B.
- O Vitest roda com `pool: 'vmThreads'`: os pools padrão falham no Windows quando o terminal está em `c:\` minúsculo.
- Trocar de capítulo rolando dá só um tremor leve; o corte diagonal ficou exclusivo do sumário.
- Na contracapa o cursor vira espada e o rastro fica vermelho com brilho.
- A logo fica sempre sobre uma plaqueta de papel claro, para o "E" preto continuar visível no tema escuro.
- Easter eggs com alternativa sem teclado (5 toques na logo; trevo na contracapa).
- `/segredo` está fora do sitemap e bloqueada no robots.

## 5. O que não consegui verificar

- [ ] **Lighthouse**: não rodei. Rode no deploy da Vercel.
- [ ] **Impressão real**: gerei o PDF do currículo pelo Chrome (uma página em A4 e em Carta). Não imprimi em papel nem testei Firefox ou Safari.
- [ ] **Folha flexível**: conferida no Chrome headless. O efeito usa 3D aninhado; não testei em Safari nem em máquina fraca.
- [ ] **Arrastar cartas**: testei clique e teclado de forma automatizada; o arrastar com mouse eu não consegui automatizar.
- [ ] **Aparelho real**: testei em Chrome headless (360/390, 768, 1280, 1920). Não testei em celular físico, Safari nem Firefox.
- [ ] **Leitor de tela**: a marcação ARIA está lá, mas não passei NVDA/VoiceOver.
- [ ] **Deploy**: o build local passa; não publiquei.
