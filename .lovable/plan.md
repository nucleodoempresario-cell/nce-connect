
# Sistema de Gerenciamento de Conteúdo (CMS) Completo

## Objetivo
Criar uma interface administrativa intuitiva que permita editar TODOS os textos, imagens e banners do site de forma visual e organizada, tornando a manutenção do site simples e acessível para qualquer administrador.

---

## Visão Geral da Solução

O CMS será organizado por **páginas do site**, permitindo que o administrador navegue facilmente e edite qualquer seção. Cada página terá suas seções editáveis claramente identificadas.

```text
┌─────────────────────────────────────────────────────────────┐
│  PAINEL ADMIN > CONTEÚDO DO SITE                           │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌───────┐ │
│  │  Home   │ │  Sobre  │ │Empresas │ │Membros  │ │ Seja  │ │
│  │         │ │         │ │         │ │         │ │Nuclead│ │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └───────┘ │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PÁGINA HOME - Seções Editáveis:                           │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  🏠 HERO PRINCIPAL                              [✏️]  │  │
│  │  Título, subtítulo, botões, imagem                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  🤝 SEÇÃO CONFIANÇA                             [✏️]  │  │
│  │  Título, descrição, features                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  🎯 PILARES (Missão/Visão/Valores)              [✏️]  │  │
│  │  3 cards editáveis                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Estrutura de Conteúdos Editáveis

### 1. Página Inicial (Home)
| Seção | Campos Editáveis |
|-------|------------------|
| **Hero Principal** | Título, subtítulo, texto do botão primário, texto do botão secundário, imagem de fundo, estatística (número de empresários) |
| **Confiança** | Título, descrição, imagem, 3 features (ícone + título + descrição) |
| **Pilares** | Título da seção, subtítulo, 3 cards (título + descrição cada) |
| **Colaboração** | Título, descrição, 3 features, imagem, texto do botão CTA |
| **Seção Empresas** | Título, subtítulo |
| **Seção Membros** | Título, subtítulo |
| **Seção Notícias** | Título, subtítulo |
| **Comunidade** | Título, descrição, lista de benefícios (até 5) |
| **CTA Final** | Título, subtítulo, texto do botão |

### 2. Página Sobre (O NCE)
| Seção | Campos Editáveis |
|-------|------------------|
| **Hero** | Título, subtítulo, imagem |
| **Estatísticas** | 4 cards (valor + label cada) |
| **Missão/Visão/Valores** | Já existente no banco (tipo: institucional) |
| **Descrição** | Título, 3 parágrafos de texto |
| **Objetivos** | Já existente no banco (tipo: institucional) |

### 3. Página Seja Nucleado
| Seção | Campos Editáveis |
|-------|------------------|
| **Hero** | Título, subtítulo |
| **Benefícios** | 3 cards (ícone + título + descrição) |
| **Requisitos** | Já existente no banco (tipo: requisitos) |
| **Mensagem de sucesso** | Título, descrição |

### 4. Páginas de Listagem (Empresas, Membros, Notícias)
| Seção | Campos Editáveis |
|-------|------------------|
| **Hero** | Título, subtítulo, ícone badge |

### 5. Configurações Globais
| Item | Campos Editáveis |
|------|------------------|
| **Footer** | Descrição do NCE |
| **Redes Sociais** | Link do Instagram |
| **Informações Gerais** | Nome do núcleo, slogan |

---

## Mudanças no Banco de Dados

Será criada uma nova estrutura de conteúdo mais granular na tabela `site_content`:

```sql
-- Novos tipos de conteúdo a serem inseridos
INSERT INTO site_content (tipo, conteudo) VALUES
('home_hero', '{"titulo": "...", "subtitulo": "...", ...}'),
('home_confianca', '{"titulo": "...", "descricao": "...", ...}'),
('home_pilares', '{"titulo": "...", "subtitulo": "...", "cards": [...]}'),
...
```

**Estrutura de cada tipo:**

```text
home_hero:
  - titulo: string
  - subtitulo: string
  - botao_primario: string
  - botao_secundario: string
  - imagem_url: string
  - estatistica_numero: string
  - estatistica_label: string

home_confianca:
  - titulo: string
  - descricao: string
  - imagem_url: string
  - features: [{icon: string, titulo: string, descricao: string}]

home_pilares:
  - titulo_secao: string
  - subtitulo_secao: string
  - cards: [{icon: string, titulo: string, descricao: string}]

... (demais seções seguem o mesmo padrão)
```

---

## Arquivos a Serem Criados/Modificados

### Novos Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `src/pages/AdminContentPage.tsx` | Wrapper da página de conteúdo |
| `src/pages/admin/ManageContent.tsx` | Página principal do CMS |
| `src/components/admin/content/HomeContentEditor.tsx` | Editor da página Home |
| `src/components/admin/content/AboutContentEditor.tsx` | Editor da página Sobre |
| `src/components/admin/content/BecomeContentEditor.tsx` | Editor da página Seja Nucleado |
| `src/components/admin/content/ListingPagesEditor.tsx` | Editor das páginas de listagem |
| `src/components/admin/content/GlobalSettingsEditor.tsx` | Configurações globais |
| `src/components/admin/content/SectionEditor.tsx` | Componente reutilizável para editar seções |
| `src/components/admin/content/ImageUploader.tsx` | Upload de imagens para banners |
| `src/hooks/useSiteContentMutations.ts` | Hook para salvar conteúdos |

### Arquivos Modificados

| Arquivo | Modificação |
|---------|-------------|
| `src/components/layout/AdminLayout.tsx` | Adicionar link "Conteúdo" no menu |
| `src/App.tsx` | Adicionar rota `/admin/conteudo` |
| `src/pages/Index.tsx` | Consumir dados dinâmicos do banco |
| `src/pages/About.tsx` | Consumir dados dinâmicos do banco |
| `src/pages/BecomeNucleado.tsx` | Consumir dados dinâmicos do banco |
| `src/pages/Companies.tsx` | Consumir dados dinâmicos do banco |
| `src/pages/Members.tsx` | Consumir dados dinâmicos do banco |
| `src/pages/News.tsx` | Consumir dados dinâmicos do banco |
| `src/hooks/useSiteContent.ts` | Adicionar novos hooks para cada tipo |

---

## Interface do Editor

### Layout Principal
- **Navegação por abas**: Cada aba representa uma página do site
- **Accordion por seção**: Dentro de cada página, seções colapsáveis
- **Prévia visual**: Mostrar como ficará o texto/imagem
- **Salvamento individual**: Botão salvar em cada seção
- **Indicador de alterações**: Mostrar quando há mudanças não salvas

### Componentes de Edição
- **Campo de texto simples**: Para títulos e frases curtas
- **Campo de texto longo**: Para descrições e parágrafos
- **Editor de lista**: Para valores, objetivos, requisitos
- **Seletor de ícone**: Para escolher ícones Lucide
- **Upload de imagem**: Para banners e fotos de seção
- **Editor de features**: Para grupos de 3-4 itens com ícone+título+descrição

---

## Fluxo de Uso

```text
1. Admin acessa /admin/conteudo
          ↓
2. Seleciona a página que quer editar (ex: Home)
          ↓
3. Vê todas as seções da página como cards/accordions
          ↓
4. Clica em "Editar" na seção desejada
          ↓
5. Preenche os campos no formulário
          ↓
6. Clica em "Salvar" 
          ↓
7. Alterações refletem imediatamente no site
```

---

## Detalhes Técnicos

### Migração SQL
```sql
-- Inserir conteúdos padrão para todas as seções
-- (usando os textos atuais do código como valores iniciais)
```

### Hook de Mutação
```typescript
export function useUpdateSiteContent() {
  return useMutation({
    mutationFn: async ({ tipo, conteudo }) => {
      const { error } = await supabase
        .from('site_content')
        .upsert({ tipo, conteudo, updated_at: new Date().toISOString() })
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries(['site_content'])
  });
}
```

### Permissões
- Será adicionada permissão `content_edit` ao enum de permissões
- Apenas admins com essa permissão poderão editar conteúdos

---

## Benefícios da Solução

- **Intuitivo**: Organizado por páginas, fácil de encontrar o que editar
- **Completo**: Permite editar absolutamente todo o texto do site
- **Visual**: Campos claramente identificados com seus propósitos
- **Seguro**: Permissões granulares controlam quem pode editar
- **Performático**: Dados cacheados com React Query
- **Flexível**: Estrutura permite adicionar novas seções facilmente

---

## Ordem de Implementação

1. Criar migração SQL com estrutura de conteúdos
2. Criar hooks de leitura/escrita de conteúdo
3. Criar componentes de edição (SectionEditor, ImageUploader)
4. Criar página ManageContent com tabs por página
5. Implementar editores de cada página
6. Atualizar páginas públicas para consumir dados do banco
7. Adicionar rota e link no menu admin
8. Adicionar permissão content_edit

