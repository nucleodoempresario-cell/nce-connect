

# Layout Expansivo e Imponente - NCE

## Visao Geral do Problema

O site atual parece "espremido" por varios motivos:
- Container limitado a 1400px de largura
- Falta de sombras e profundidade nas imagens
- Cards muito simples sem impacto visual
- Elementos decorativos de fundo muito sutis
- Espacamentos uniformes demais

## Solucoes Propostas

### 1. Expandir o Container Principal

**Arquivo:** `tailwind.config.ts`

Aumentar o container de 1400px para 1536px (xl) e adicionar breakpoint 3xl:

```text
container: {
  center: true,
  padding: {
    DEFAULT: "1rem",
    sm: "2rem",
    lg: "4rem",
    xl: "5rem",
    "2xl": "6rem",
  },
  screens: {
    "2xl": "1536px",
  },
},
```

### 2. Adicionar Sombras Mais Pronunciadas

**Arquivo:** `tailwind.config.ts`

Adicionar sombras customizadas para criar profundidade:

```text
boxShadow: {
  'hero': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  'card-hover': '0 20px 40px -12px rgba(0, 0, 0, 0.2)',
  'elevated': '0 10px 40px -10px rgba(0, 0, 0, 0.15)',
}
```

### 3. Hero Section Mais Imponente

**Arquivo:** `src/pages/Index.tsx`

Modificacoes no Hero:
- Padding vertical maior (pt-32 pb-24)
- Imagem com sombra mais pronunciada (shadow-hero)
- Elementos decorativos maiores e mais visiveis
- Tipografia maior (text-5xl md:text-6xl lg:text-7xl)
- Gap maior entre colunas (gap-16 lg:gap-20)

### 4. Elementos Decorativos de Fundo

**Arquivo:** `src/pages/Index.tsx`

Adicionar elementos de textura em varias secoes:
- Circulos com blur em tamanhos variados
- Gradientes sutis de fundo
- Linhas decorativas

Exemplo para o Hero:
```text
<!-- Elementos decorativos de fundo -->
<div className="absolute top-20 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
<div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
```

### 5. Cards com Mais Impacto Visual

**Arquivo:** `src/components/CompanyCard.tsx`, `src/components/MemberCard.tsx`, `src/components/NewsCard.tsx`

- Sombras mais pronunciadas no hover
- Transicao de elevacao suave
- Bordas mais definidas

```text
className="shadow-lg hover:shadow-card-hover hover:-translate-y-2 transition-all duration-300"
```

### 6. Secoes com Espacamento Generoso

**Arquivo:** `src/pages/Index.tsx`

- Aumentar py-20 para py-24 ou py-28
- Gaps maiores entre elementos (gap-16 para gap-20)
- Margens mais generosas nos titulos

### 7. Imagens com Sombras e Decoracao

**Arquivo:** `src/pages/Index.tsx`

Para cada imagem nas secoes:
- Adicionar shadow-hero ou shadow-elevated
- Elementos decorativos posicionados atras da imagem
- Bordas arredondadas maiores (rounded-3xl)

Exemplo:
```text
<div className="relative">
  <!-- Decorative elements -->
  <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-accent/20 rounded-full blur-xl" />
  <div className="absolute -top-8 -left-8 w-32 h-32 bg-primary/15 rounded-full blur-xl" />
  
  <!-- Image with shadow -->
  <img 
    className="rounded-3xl shadow-hero relative z-10"
  />
</div>
```

---

## Arquivos a Modificar

| Arquivo | Alteracoes |
|---------|------------|
| `tailwind.config.ts` | Container maior, sombras customizadas |
| `src/index.css` | Utilitarios de sombra e textura |
| `src/pages/Index.tsx` | Hero expandido, decoracoes, espacamentos |
| `src/components/CompanyCard.tsx` | Sombras e hover mais impactantes |
| `src/components/MemberCard.tsx` | Sombras e hover mais impactantes |
| `src/components/NewsCard.tsx` | Sombras e hover mais impactantes |
| `src/components/SectionTitle.tsx` | Tipografia maior |

---

## Resultado Esperado

Apos as alteracoes, o site tera:

1. **Layout mais amplo** - Conteudo ocupando melhor o espaco em telas grandes
2. **Profundidade visual** - Sombras que criam hierarquia e impacto
3. **Elementos decorativos** - Texturas sutis que adicionam sofisticacao
4. **Tipografia imponente** - Titulos maiores e mais bold
5. **Cards elevados** - Efeitos de hover que transmitem qualidade premium
6. **Espacamento generoso** - Respiro entre secoes que transmite exclusividade

O resultado sera um site que transmite **forca, solidez e profissionalismo** - digno de uma organizacao empresarial de alto nivel.

