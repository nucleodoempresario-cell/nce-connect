
# Sistema Page Builder Dinâmico - CMS Completo

## Problema Identificado

1. **Dados não populados**: A tabela `site_content` só possui 2 registros (`institucional` e `requisitos`). Os 15+ tipos de conteúdo criados para as seções da Home, Sobre, etc. não foram inseridos no banco.

2. **Sistema atual é rígido**: Cada página tem seções fixas pré-definidas. O admin pode editar textos, mas não pode adicionar novas seções, reordenar ou remover blocos.

## Solução: Page Builder Dinâmico

Vamos criar um sistema onde cada página é uma coleção de **blocos de conteúdo** que podem ser:
- Adicionados dinamicamente
- Reordenados via drag-and-drop
- Editados individualmente
- Removidos

```text
┌─────────────────────────────────────────────────────────────┐
│  EDITOR DE PÁGINA: HOME                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ☰ Bloco: HERO                               [✏️] [🗑️] │   │
│  │ Título: "Conectando Empresários..."                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                         ↕️ arrastar                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ☰ Bloco: FEATURES                           [✏️] [🗑️] │   │
│  │ 3 cards com ícone + título + descrição               │   │
│  └─────────────────────────────────────────────────────┘   │
│                         ↕️ arrastar                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ☰ Bloco: TEXTO + IMAGEM                     [✏️] [🗑️] │   │
│  │ Layout 2 colunas: texto à esquerda, imagem à direita │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              [+ ADICIONAR NOVO BLOCO]                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Tipos de Blocos Disponíveis

| Bloco | Descrição | Campos |
|-------|-----------|--------|
| **hero** | Banner principal | badge, título, subtítulo, botões, imagem, estatística |
| **features** | Cards lado a lado | título da seção, subtítulo, cards (ícone + título + descrição) |
| **texto_imagem** | Texto + Imagem | título, texto, imagem, lado da imagem (esq/dir), botão opcional |
| **lista_beneficios** | Lista com checks | título, descrição, lista de itens, botão |
| **cta** | Call to action | título, subtítulo, botão primário, botão secundário |
| **cards_icone** | Grid de cards | título da seção, subtítulo, cards (até 6) |
| **texto_simples** | Parágrafo | título, texto (editor WYSIWYG) |
| **galeria** | Grid de imagens | título, imagens |
| **divisor** | Linha separadora | estilo (linha, espaço) |
| **embed** | Conteúdo externo | tipo (empresas, membros, notícias) |

---

## Nova Estrutura do Banco de Dados

### Tabela: `page_blocks` (nova)

```sql
CREATE TABLE page_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pagina TEXT NOT NULL,           -- 'home', 'sobre', 'seja-nucleado', etc.
  tipo_bloco TEXT NOT NULL,       -- 'hero', 'features', 'texto_imagem', etc.
  ordem INTEGER NOT NULL,         -- posição do bloco na página
  conteudo JSONB NOT NULL,        -- dados específicos do bloco
  visivel BOOLEAN DEFAULT true,   -- permite ocultar sem deletar
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Exemplo de conteúdo por tipo:**

```json
// Bloco tipo: hero
{
  "badge": "Rede de Empresários",
  "titulo": "Conectando Empresários para o Sucesso",
  "subtitulo": "Uma comunidade exclusiva...",
  "botao_primario": { "texto": "Explorar", "link": "/empresas" },
  "botao_secundario": { "texto": "Saiba Mais", "link": "/sobre" },
  "imagem_url": "https://...",
  "estatistica": { "numero": "50+", "label": "Empresários" }
}

// Bloco tipo: features
{
  "titulo": "Nossos Pilares",
  "subtitulo": "Os fundamentos que guiam...",
  "cards": [
    { "icon": "Target", "titulo": "Missão", "descricao": "..." },
    { "icon": "Eye", "titulo": "Visão", "descricao": "..." },
    { "icon": "Heart", "titulo": "Valores", "descricao": "..." }
  ]
}
```

---

## Arquivos a Criar

### Core do Page Builder

| Arquivo | Descrição |
|---------|-----------|
| `src/components/pagebuilder/PageBuilder.tsx` | Componente principal com drag-and-drop |
| `src/components/pagebuilder/BlockWrapper.tsx` | Container de cada bloco com ações |
| `src/components/pagebuilder/BlockSelector.tsx` | Modal para escolher tipo de bloco |
| `src/components/pagebuilder/BlockRenderer.tsx` | Renderiza bloco na página pública |
| `src/hooks/usePageBlocks.ts` | Hook para carregar/salvar blocos |

### Editores de Bloco

| Arquivo | Bloco |
|---------|-------|
| `src/components/pagebuilder/editors/HeroEditor.tsx` | Editor do hero |
| `src/components/pagebuilder/editors/FeaturesEditor.tsx` | Editor de features |
| `src/components/pagebuilder/editors/TextoImagemEditor.tsx` | Editor texto+imagem |
| `src/components/pagebuilder/editors/ListaBeneficiosEditor.tsx` | Editor de lista |
| `src/components/pagebuilder/editors/CtaEditor.tsx` | Editor de CTA |
| `src/components/pagebuilder/editors/CardsIconeEditor.tsx` | Editor de cards |
| `src/components/pagebuilder/editors/TextoSimplesEditor.tsx` | Editor de texto |

### Renderizadores de Bloco (públicos)

| Arquivo | Bloco |
|---------|-------|
| `src/components/blocks/HeroBlock.tsx` | Renderiza hero |
| `src/components/blocks/FeaturesBlock.tsx` | Renderiza features |
| `src/components/blocks/TextoImagemBlock.tsx` | Renderiza texto+imagem |
| `src/components/blocks/ListaBeneficiosBlock.tsx` | Renderiza lista |
| `src/components/blocks/CtaBlock.tsx` | Renderiza CTA |
| `src/components/blocks/CardsIconeBlock.tsx` | Renderiza cards |
| `src/components/blocks/TextoSimplesBlock.tsx` | Renderiza texto |
| `src/components/blocks/EmbedBlock.tsx` | Renderiza lista de empresas/membros/notícias |

### Admin

| Arquivo | Descrição |
|---------|-----------|
| `src/pages/admin/PageEditor.tsx` | Página de edição com Page Builder |

---

## Migração de Dados

Vamos criar registros na tabela `page_blocks` **usando os textos atuais do site**:

```sql
-- PÁGINA: HOME
INSERT INTO page_blocks (pagina, tipo_bloco, ordem, conteudo) VALUES
('home', 'hero', 1, '{
  "badge": "Rede de Empresários Multisetorial",
  "titulo": "Conectando Empresários para o Sucesso",
  "subtitulo": "Uma comunidade exclusiva de líderes empresariais comprometidos com o crescimento mútuo, networking estratégico e excelência nos negócios.",
  "botao_primario": {"texto": "Explorar Oportunidades", "link": "/empresas"},
  "botao_secundario": {"texto": "Conheça o Núcleo", "link": "/sobre"},
  "imagem_url": "https://images.unsplash.com/photo-1600880292203-757bb62b4baf",
  "estatistica": {"numero": "50+", "label": "Empresários"}
}'::jsonb),

('home', 'texto_imagem', 2, '{
  "titulo": "Fundado em Confiança e Credibilidade",
  "descricao": "O Núcleo do Empresário nasceu da necessidade de criar um ambiente onde líderes empresariais pudessem se conectar de forma genuína e gerar oportunidades reais.",
  "imagem_url": "https://images.unsplash.com/photo-1521791136064-7986c2920216",
  "imagem_lado": "esquerda",
  "features": [
    {"icon": "Shield", "titulo": "Ambiente Seguro", "descricao": "Grupo seleto e comprometido com valores éticos"},
    {"icon": "Network", "titulo": "Networking Estratégico", "descricao": "Conexões de alto nível que geram resultados"},
    {"icon": "TrendingUp", "titulo": "Crescimento Compartilhado", "descricao": "Sucesso mútuo através da colaboração"}
  ]
}'::jsonb),

-- ... todos os outros blocos da Home, Sobre, Seja Nucleado, etc.
```

---

## Fluxo de Uso para o Admin

```text
1. Admin acessa /admin/conteudo
                ↓
2. Seleciona página (Home, Sobre, Seja Nucleado...)
                ↓
3. Vê lista de blocos existentes (drag para reordenar)
                ↓
4. Pode:
   • [+ Adicionar] → Escolhe tipo → Preenche campos → Salvar
   • [✏️ Editar] → Modifica campos → Salvar
   • [🗑️ Remover] → Confirmação → Remove
   • [☰ Arrastar] → Muda ordem → Auto-salva
   • [👁️ Ocultar] → Oculta bloco sem deletar
                ↓
5. Alterações aparecem imediatamente no site
```

---

## Como as Páginas Renderizam os Blocos

As páginas públicas (Home, Sobre, etc.) vão iterar sobre os blocos cadastrados:

```typescript
// src/pages/Index.tsx (simplificado)
export default function Index() {
  const { data: blocks } = usePageBlocks('home');
  
  return (
    <PageLayout>
      {blocks?.map(block => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </PageLayout>
  );
}

// src/components/blocks/BlockRenderer.tsx
export function BlockRenderer({ block }) {
  const components = {
    hero: HeroBlock,
    features: FeaturesBlock,
    texto_imagem: TextoImagemBlock,
    lista_beneficios: ListaBeneficiosBlock,
    cta: CtaBlock,
    cards_icone: CardsIconeBlock,
    texto_simples: TextoSimplesBlock,
    embed: EmbedBlock,
  };
  
  const Component = components[block.tipo_bloco];
  return Component ? <Component {...block.conteudo} /> : null;
}
```

---

## Ordem de Implementação

### Fase 1: Infraestrutura
1. Criar tabela `page_blocks` no banco de dados
2. Criar hook `usePageBlocks` com CRUD
3. Criar tipos TypeScript para cada bloco
4. Popular banco com dados atuais do site

### Fase 2: Componentes de Bloco (Públicos)
5. Extrair seções atuais para componentes `*Block.tsx`
6. Criar `BlockRenderer.tsx`
7. Atualizar páginas para usar blocos dinâmicos

### Fase 3: Page Builder (Admin)
8. Instalar dependência de drag-and-drop (@dnd-kit/core)
9. Criar `PageBuilder.tsx` com lista arrastável
10. Criar `BlockWrapper.tsx` com ações
11. Criar `BlockSelector.tsx` para adicionar blocos

### Fase 4: Editores
12. Criar editores para cada tipo de bloco
13. Integrar editores no Page Builder

### Fase 5: Finalização
14. Atualizar AdminContentPage
15. Testar todas as páginas
16. Adicionar permissões

---

## Benefícios

- **Flexibilidade Total**: Adicione qualquer bloco em qualquer página
- **Fácil de Usar**: Drag-and-drop intuitivo
- **Mantém Conteúdo Atual**: Migração preserva todos os textos existentes
- **Escalável**: Fácil adicionar novos tipos de blocos
- **Preview em Tempo Real**: Veja mudanças instantaneamente
- **Consistência Visual**: Cada bloco segue o design system do site
