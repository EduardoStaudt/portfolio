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
- [ ] **Vitória no duelo**: é bônus e não entra no contador, que vai de 0 a 3. A página secreta abre com os três segredos e mostra o selo "Duelista" para quem venceu. Se preferir que a vitória conte, tire `optional: true` do item `duelo` em `lib/data/eggs.ts`.
- [ ] **"Em vez de vrrrum, eduardo"**: fiz as duas leituras: a palavra a digitar agora é `eduardo`, e o grito na tela é "EDUARDO!!" (o VRRRUM ficou menor, ao fundo).
- [ ] **Página "Em breve"**: ficou vazia de propósito, só com o desenho. A continuação com PINNs virou o quadro "Parte 2 · Em desenvolvimento" dentro do NNAdsorption. O texto desse quadro (`next` em `lib/data/projects.ts`) fui eu que escrevi: revise.
- [ ] **Currículo impresso**: voltou a ter o desenho da página (faixa preta, títulos numerados com fio vermelho), sem logo, japonês ou retículas. Conferi gerando o PDF: uma página em A4, sem cabeçalho e rodapé do navegador, com os 18 links clicáveis.
- [ ] **Portfólio no currículo**: o projeto aponta para o repositório (`github.com/EduardoStaudt/portfolio`). Quando o site estiver no ar, defina `NEXT_PUBLIC_SITE_URL` (ou troque `site.url` em `lib/data/site.ts`) e o endereço do site aparece junto.
- [ ] **Glazzy**: a stack agora é Flutter, Dart e Cloudflare, no site e no currículo. O texto continua curto ("ERP para vidraçarias, do orçamento à entrega"); se quiser detalhar o que você fez, me passe.
- [ ] **Técnico em Administração**: entrou como quadro no Cap. 1 e na formação do currículo. Faltam o nome da escola e o ano. O balão de pensamento ("Foi ali que comecei a entender como um negócio funciona") fui eu que escrevi: revise.
- [ ] **Quadro da faculdade (Cap. 1)**: juntei os quadros do notebook e da pixel art em um só. A frase nova é "E nos jogos da faculdade, os sprites em pixel art ficam comigo". Ainda há "desenho pixel por pixel" no primeiro quadro, "pixel artist" na descrição do site e "Pixel art 88" no grimório: não mexi.

## 3. Textos que eu escrevi sem ter a informação

- [ ] **Glazzy** (`lib/data/projects.ts`): descrição, destaques e `stack` (`['Web', 'ERP']`) continuam genéricos. Não sei as tecnologias nem o seu papel exato.
- [ ] **Resumo do currículo** (`lib/data/cv.ts`): reescrevi a versão da Blip de forma generalista. Revise o tom.
- [ ] **Equilíbrio do duelo**: os valores das cartas são os do seu prompt. Em simulação, quem joga bem vence o Fácil quase sempre e o Difícil na maioria das vezes; não testei com pessoas.
- [ ] **Lattes**: o PDF tinha o link, mas eu não tenho a URL. Não entrou no currículo.
- [x] **Links por projeto no currículo**: GymSolver, Batalha Naval e ordenação apontam para os repositórios que você passou. A IC continua sem link.
- [ ] **Linha do tempo** (`lib/data/research.ts`): só o CNMAC tem ano. A ordem (OBMEP → IC → SICITE → CNMAC) é suposição, e o SICITE não aparece no seu currículo: confirme se você apresentou lá ou remova o item.
- [ ] **Habilidades das espadas** (`lib/data/skills.ts`): as espadas agora são só as áreas: Full-Stack (azul), Machine Learning (meio) e Outros (laranja). Em "Outros" entraram Aseprite, LaTeX e as soft skills do currículo (trabalho em equipe, aprendizado rápido, curiosidade, metodologias ágeis). Godot/GDScript, C e Assembly ficaram de fora das três: diga se quer que entrem em alguma. Os lemas e descrições das fichas fui eu que escrevi.
- [ ] **Ficha do grimório** (`lib/data/eggs.ts`): os números dos atributos e a classe são inventados.

## 4. Decisões que tomei

- OBMEP agora só aparece em dois lugares: um item curto na linha do tempo e uma linha no currículo, sem o "5". Saiu do Cap. 1 e do grimório.
- A capa e o livro de projetos abrem para a direita (lombada à direita), como mangá, e as viradas curvam a folha. No livro, o desenho fica na página direita e o texto na esquerda. As setas ← → continuam significando anterior/próximo.
- A página de sumário saiu: a capa abre direto sobre o Cap. 1, e a explicação de como ler foi para o quadro "Quem sou". No celular a capa não abre mais: é uma página comum, seguida do Cap. 1.
- O botão de e-mail abre o `mailto:` e também copia o endereço, que agora aparece escrito embaixo do botão. Quem não tem programa de e-mail configurado não via nada acontecer.
- A palavra "protagonista" saiu do site e do currículo.
- O capítulo de habilidades fica pinado por um trecho do scroll no desktop, como o livro de projetos.
- Toda onomatopeia em japonês tem a leitura pequena ao lado (capa, lombada, balão que quebra, golpe de espada, contracapa, espadas). O currículo não tem mais nada em japonês.
- A faixa do chapéu de palha é vermelha e o chapéu inteiro pisca de leve, como pista de que ele é clicável.
- Todos os botões de projeto dizem "Ver projeto" (`projectsIntro.linkLabel`).
- O site abre no modo escuro e colorido para quem ainda não escolheu; a preferência do sistema operacional não é mais consultada. A escolha feita nos botões continua salva.
- O balão "Meu plano?" do último quadro do Cap. 1 quebra ao ser clicado e revela "Empreender!". Com movimento reduzido, a troca é direta.
- O aviso "Role para abrir a capa" ficou cerca de 4 vezes maior.
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
