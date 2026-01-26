
# Redesign Completo - NCE: Site Premium Corporativo

## Visao Geral

Vou transformar o site atual em uma experiencia visual de alto nivel, inspirada na referencia fornecida mas elevando significativamente a qualidade. A nova identidade visual sera **corporativa, elegante e impactante**, transmitindo a exclusividade e profissionalismo do Nucleo do Empresario.

---

## Nova Identidade Visual

### Paleta de Cores
- **Azul Corporativo Principal**: #1e3a8a (primary)
- **Azul Escuro**: #0f172a (dark backgrounds)
- **Dourado/Amber**: #f59e0b (accent/destaques)
- **Branco e Cinzas**: Para fundos e textos secundarios

### Tipografia
- Manter a fonte **Inter** com pesos 300, 400, 600 e 800
- Titulos grandes e impactantes
- Textos com boa legibilidade

---

## Mudancas por Componente

### 1. Variaveis CSS Globais (src/index.css)
- Atualizar toda a paleta de cores CSS
- Novo primary: azul corporativo
- Adicionar variavel "accent" para dourado
- Ajustar tons de background e foreground

### 2. Tailwind Config (tailwind.config.ts)
- Adicionar cor "accent" (dourado)
- Configurar variantes de cores corporativas

### 3. Header (src/components/layout/Header.tsx)
- Fundo **branco solido** com sombra quando scrollado
- Sem transparencia na home (mais profissional)
- Botao "Seja Nucleado" com destaque dourado
- Navegacao com hover em azul

### 4. Footer (src/components/layout/Footer.tsx)
- Background azul escuro corporativo
- Detalhes em dourado nos hover
- Links organizados em colunas
- Visual mais limpo e profissional

### 5. Pagina Inicial (src/pages/Index.tsx)
**Hero Section:**
- Background com imagem real de negocios (reuniao executiva)
- Overlay azul com gradiente
- Tag animada "Conexao & Crescimento" em dourado
- Titulo grande e impactante
- Botoes: primario dourado + secundario outline branco
- Seta animada de scroll no rodape

**Secao Nossa Essencia (Missao/Visao/Valores):**
- Cards brancos com borda colorida no topo
- Icones em circulos que mudam de cor no hover
- Layout 3 colunas

**Secao Empresas:**
- Cards com efeito de elevacao
- Ultimo card especial "Sua empresa aqui?"
- Link "Ver todas" com seta

**Secao Noticias:**
- Layout assimetrico (destaque grande + lista lateral)
- Imagens com hover zoom
- Tags coloridas por categoria

**CTA Final:**
- Background azul escuro
- Texto impactante
- Botao dourado

### 6. Pagina Sobre (src/pages/About.tsx)
- Hero com imagem de fundo
- Cards Missao/Visao/Valores com borda colorida no topo
- Numeros/estatisticas em destaque
- Timeline da historia do NCE

### 7. Pagina Empresas (src/pages/Companies.tsx)
- Cards redesenhados com visual corporativo
- Hover com sombra e elevacao
- Modal mais elegante

### 8. Pagina Membros (src/pages/Members.tsx)
- Grid de cards profissionais
- Foto circular com borda
- Nome e cargo em destaque

### 9. Pagina Noticias (src/pages/News.tsx)
- Layout de blog moderno
- Noticia em destaque maior
- Cards com data e categoria

### 10. Pagina Seja Nucleado (src/pages/BecomeNucleado.tsx)
- Hero inspirador
- Formulario limpo e profissional
- Sidebar com requisitos

### 11. Componentes Auxiliares
- **CompanyCard**: Redesenhar com novo visual
- **MemberCard**: Adicionar cargo e estilizar
- **NewsCard**: Layout mais editorial

---

## Novos Componentes a Criar

### 1. SectionTitle
Componente reutilizavel para titulos de secao com:
- Titulo centralizado
- Linha decorativa dourada abaixo
- Subtitulo opcional

### 2. StatCard
Card para exibir estatisticas com:
- Numero grande
- Descricao
- Icone opcional

### 3. HeroBackground
Componente para heros com:
- Imagem de fundo
- Overlay com gradiente
- Conteudo centralizado

---

## Detalhes Tecnicos

### Arquivos a Modificar
1. `src/index.css` - Variaveis CSS globais
2. `tailwind.config.ts` - Cores e tema
3. `src/components/layout/Header.tsx` - Novo header
4. `src/components/layout/Footer.tsx` - Novo footer
5. `src/pages/Index.tsx` - Pagina inicial completa
6. `src/pages/About.tsx` - Pagina sobre
7. `src/pages/Companies.tsx` - Pagina empresas
8. `src/pages/Members.tsx` - Pagina membros
9. `src/pages/News.tsx` - Pagina noticias
10. `src/pages/NewsDetail.tsx` - Detalhe noticia
11. `src/pages/BecomeNucleado.tsx` - Formulario candidatura
12. `src/pages/Auth.tsx` - Pagina login
13. `src/components/CompanyCard.tsx` - Card empresa
14. `src/components/MemberCard.tsx` - Card membro
15. `src/components/NewsCard.tsx` - Card noticia

### Novos Arquivos a Criar
1. `src/components/SectionTitle.tsx`
2. `src/components/HeroSection.tsx`

### Imagens de Fundo (Unsplash)
- Hero principal: reuniao executiva
- Sobre: ambiente corporativo
- CTA: networking empresarial

---

## Resultado Esperado

Um site que transmite:
- **Exclusividade**: Visual que mostra que e um grupo seleto
- **Profissionalismo**: Cores corporativas classicas
- **Confianca**: Design limpo e bem estruturado
- **Modernidade**: Animacoes sutis e responsividade perfeita
- **Impacto**: Hero sections memoraveis

O novo design sera digno de uma organizacao empresarial de alto nivel, equilibrando elegancia classica com elementos modernos.
