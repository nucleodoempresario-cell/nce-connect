
# Plano: Correção de Botões Brancos em Fundos Escuros

## Problema Identificado

Alguns botões com `variant="outline"` estão aparecendo totalmente brancos em seções com fundo escuro. O problema está nas páginas de detalhe de Empresa e Membro, que possuem seções de CTA com fundo escuro (`bg-foreground`) onde o botão secundário usa a variante `outline`.

A variante `outline` padrão aplica `bg-background` (branco), o que cria o problema de visibilidade.

## Arquivos Afetados

1. **`src/pages/CompanyDetail.tsx`** (linha 371)
   - Seção CTA com fundo escuro (`bg-foreground`)
   - Botão usando `variant="outline"` com classes customizadas

2. **`src/pages/MemberDetail.tsx`** (linha 262)
   - Seção CTA com fundo escuro (`bg-foreground`)
   - Botão usando `variant="outline"` com classes customizadas

3. **`src/components/blocks/CtaBlock.tsx`** (linhas 94-105)
   - Versão "clara" do CTA (fundo `bg-primary`) 
   - Botão secundário usando `variant="outline"` com override de classes

## Solução

Substituir `variant="outline"` por `variant="outlineDark"` nos locais onde o botão aparece em fundo escuro. A variante `outlineDark` já existe no sistema:

```tsx
outlineDark: "border-2 border-white/40 bg-transparent text-white hover:bg-white hover:text-slate-900"
```

### Alterações Específicas

**1. CompanyDetail.tsx (linha 371)**
```tsx
// De:
<Button asChild size="lg" variant="outline" className="border-background text-background hover:bg-background hover:text-foreground">

// Para:
<Button asChild size="lg" variant="outlineDark">
```

**2. MemberDetail.tsx (linha 262)**
```tsx
// De:
<Button asChild size="lg" variant="outline" className="border-background text-background hover:bg-background hover:text-foreground">

// Para:
<Button asChild size="lg" variant="outlineDark">
```

**3. CtaBlock.tsx (linhas 94-105)** - Versão clara
```tsx
// De:
<Button 
  size="lg" 
  variant="outline" 
  className="h-12 px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
  asChild
>

// Para:
<Button 
  size="lg" 
  variant="outlineDark" 
  className="h-12 px-8"
  asChild
>
```

---

## Resumo

| Arquivo | Linha | Ação |
|---------|-------|------|
| CompanyDetail.tsx | 371 | Trocar `variant="outline"` por `variant="outlineDark"` e remover classes redundantes |
| MemberDetail.tsx | 262 | Trocar `variant="outline"` por `variant="outlineDark"` e remover classes redundantes |
| CtaBlock.tsx | 94-105 | Trocar para `variant="outlineDark"` na versão clara do CTA |

Estas alterações garantem que todos os botões em fundos escuros do sistema usem a variante apropriada, eliminando o problema de botões brancos de forma definitiva.
