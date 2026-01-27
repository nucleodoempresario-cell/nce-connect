

# Novo Layout NCE - Design Limpo e Profissional

## Visao Geral

Vou transformar o site para seguir exatamente o layout da referencia fornecida. O novo design e mais **limpo, moderno e profissional**, com fundo branco predominante, cores teal/verde como primaria e detalhes em dourado/amarelo para acentos.

---

## Nova Paleta de Cores

| Elemento | Cor Atual | Nova Cor |
|----------|-----------|----------|
| Primary (botoes, links) | Azul #1e3a8a | Teal #0d9488 |
| Accent (destaques texto) | Dourado #f59e0b | Dourado #eab308 |
| Footer/CTA | Azul escuro | Slate #0f172a |
| Background | Branco/Cinza | Branco puro |

---

## Mudancas por Secao (Pagina Inicial)

### 1. Hero Section
**Layout atual:** Imagem de fundo full-screen com overlay azul
**Novo layout:**
- Fundo branco limpo
- Layout em 2 colunas: texto a esquerda, imagem a direita
- Tag "Rede de Empresarios Multisetorial" em teal com icone
- Titulo "Conectando **Empresarios** para o Sucesso" com destaque amarelo
- Botoes: "Explorar Oportunidades" (teal cheio) + "Conheca o Nucleo" (outline teal)
- Imagem de reuniao empresarial com bordas arredondadas e sombra

### 2. Secao "Fundado em Confianca e Credibilidade"
**Novo bloco:**
- Imagem ilustrativa a esquerda (handshake com elementos graficos)
- Titulo com barra dourada no topo
- Lista de beneficios com icones teal:
  - Ambiente Seguro
  - Networking Estrategico
  - Crescimento Compartilhado

### 3. Secao "Nossos Pilares" (Missao/Visao/Valores)
- Titulo centralizado com barra dourada
- 3 cards brancos com sombra suave
- Icones em quadrados com fundo teal claro
- Sem borda colorida no topo

### 4. Secao "Crescimento Atraves da Colaboracao"
- Layout 2 colunas inverso: texto a esquerda, imagem a direita
- Titulo com barra dourada no topo
- Lista com barra lateral dourada:
  - Reunioes Estrategicas
  - Parcerias e Oportunidades
  - Conhecimento Compartilhado

### 5. Secao "Empresas do Nucleo"
- Titulo centralizado com barra dourada
- 3 cards simples: logo, nome, descricao, "Ver Detalhes >"
- Botao "Explorar Todas as Empresas" outline centralizado

### 6. Secao "Nucleados"
- Titulo centralizado com barra dourada
- Cards de membros com foto arredondada
- Nome, Setor, "Ver Perfil ->"
- Botao "Conheca Todos os Nucleados" centralizado

### 7. Secao "Noticias e Acoes"
- Titulo centralizado com barra dourada
- Cards com placeholder teal claro quando sem imagem
- Data em teal, titulo em preto
- "Ler Mais >" como link

### 8. Secao "A Forca de Uma Comunidade Unida"
- Layout 2 colunas: imagem ilustrativa a esquerda
- Lista com checkmarks em teal
- Botao "Junte-se ao NCE" teal

### 9. CTA Final + Footer
- CTA em fundo slate escuro
- Titulo grande, dois botoes brancos outline
- Footer em slate escuro com colunas de navegacao

---

## Arquivos a Modificar

### Estilos Globais
1. **src/index.css** - Atualizar variaveis CSS (primary para teal)
2. **tailwind.config.ts** - Manter configuracao compativel

### Layout
3. **src/components/layout/Header.tsx** - Ajustar botao CTA para teal
4. **src/components/layout/Footer.tsx** - Redesenhar com novo layout

### Pagina Inicial
5. **src/pages/Index.tsx** - Redesenho completo com novas secoes

### Componentes
6. **src/components/SectionTitle.tsx** - Ajustar barra dourada no topo
7. **src/components/CompanyCard.tsx** - Simplificar, remover borda colorida
8. **src/components/MemberCard.tsx** - Novo layout com setor
9. **src/components/NewsCard.tsx** - Ajustar para novo visual

### Outras Paginas (ajustes menores)
10. **src/pages/About.tsx** - Alinhar com novo estilo
11. **src/pages/Companies.tsx** - Usar novos cards
12. **src/pages/Members.tsx** - Usar novos cards
13. **src/pages/News.tsx** - Usar novos cards
14. **src/pages/BecomeNucleado.tsx** - Ajustar botoes

---

## Detalhes Tecnicos

### Nova Paleta CSS (index.css)
```text
--primary: 168 84% 32%  (teal #0d9488)
--accent: 48 96% 53%    (amarelo #eab308)
```

### Novas Ilustracoes
Usarei imagens do Unsplash para:
- Hero: foto de reuniao empresarial
- Secoes de confianca: imagens ilustrativas de negocios
- Placeholder para membros: fundo teal claro

### Animacoes
- Manter Framer Motion para fade-in suaves
- Hover sutil nos cards e botoes
- Sem animacoes excessivas

---

## Resultado Esperado

Um site que transmite:
- **Clareza**: Layout limpo e bem organizado
- **Profissionalismo**: Cores corporativas equilibradas
- **Confianca**: Secoes bem estruturadas com proposito claro
- **Modernidade**: Design atual sem exageros
- **Acessibilidade**: Alto contraste e boa legibilidade

