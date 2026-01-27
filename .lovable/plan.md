
# Plano: Sistema Administrativo Completo para NCE

## Visao Geral

Este plano aborda todas as solicitacoes para melhorar o painel administrativo:

1. **Visualizacao completa de dados** de usuarios e empresas
2. **Edicao de dados** pelo administrador
3. **Ativar/Desativar usuarios e empresas** (com vinculo automatico)
4. **Auto-aprovacao** para empresas selecionadas
5. **Historico de alteracoes** com registro de datas
6. **Relatorios** sobre nucleados e empresas
7. **Controle de usuarios Admin** com gestao de roles

---

## 1. Alteracoes no Banco de Dados

### 1.1 Adicionar campo auto_aprovacao na tabela companies

```text
ALTER TABLE public.companies 
ADD COLUMN auto_aprovacao boolean DEFAULT false;
```

### 1.2 Criar tabela de historico de alteracoes (audit_log)

```text
CREATE TABLE public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tabela text NOT NULL,
  registro_id uuid NOT NULL,
  usuario_id uuid NOT NULL,
  acao text NOT NULL,
  dados_anteriores jsonb,
  dados_novos jsonb,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Apenas admins podem ver o historico
CREATE POLICY "Admins podem ver audit_log"
  ON public.audit_log FOR SELECT
  USING (is_admin(auth.uid()));
```

### 1.3 Trigger para registrar alteracoes automaticamente

```text
CREATE OR REPLACE FUNCTION log_changes()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.audit_log (tabela, registro_id, usuario_id, acao, dados_anteriores, dados_novos)
  VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    auth.uid(),
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP != 'DELETE' THEN to_jsonb(NEW) ELSE NULL END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aplicar trigger em profiles e companies
CREATE TRIGGER audit_profiles AFTER UPDATE OR DELETE ON profiles
  FOR EACH ROW EXECUTE FUNCTION log_changes();

CREATE TRIGGER audit_companies AFTER UPDATE OR DELETE ON companies
  FOR EACH ROW EXECUTE FUNCTION log_changes();
```

### 1.4 Modificar useUpdateCompany para respeitar auto_aprovacao

Na logica de update da empresa pelo membro:
- Se `auto_aprovacao = true` => status permanece `publicado`
- Se `auto_aprovacao = false` => status muda para `pendente_aprovacao`

---

## 2. Pagina de Gerenciamento de Usuarios (ManageUsers.tsx)

### 2.1 Funcionalidades a adicionar

| Funcionalidade | Descricao |
|----------------|-----------|
| Ver dados completos | Modal/painel expansivel mostrando todos os campos do perfil |
| Editar dados | Formulario inline ou modal para admin editar qualquer campo |
| Ativar/Desativar | Toggle ou botoes para mudar status do usuario |
| Ver empresa vinculada | Link para a empresa do nucleado |
| Converter em Admin | Botao para adicionar role de admin |

### 2.2 Interface proposta

```text
+--------------------------------------------------+
| Gerenciar Usuarios                               |
+--------------------------------------------------+
| [Tabs: Pendentes | Ativos | Inativos | Admins]   |
+--------------------------------------------------+
| Nome        | Email         | Empresa   | Acoes  |
|-------------|---------------|-----------|--------|
| Joao Silva  | joao@...      | Tech SA   | [botoes]|
|   [Expandir para ver todos os dados]             |
|   - Cargo: CEO                                   |
|   - Nascimento: 01/01/1980                       |
|   - Entrada NCE: 15/03/2020                      |
|   [Editar] [Ativar/Desativar] [Tornar Admin]     |
+--------------------------------------------------+
```

---

## 3. Pagina de Gerenciamento de Empresas (ManageCompanies.tsx)

### 3.1 Funcionalidades a adicionar

| Funcionalidade | Descricao |
|----------------|-----------|
| Ver dados completos | Painel expansivel com todas as informacoes |
| Editar dados | Formulario para admin editar empresa |
| Ativar/Desativar | Toggle para mudar status |
| Auto-aprovacao | Toggle para marcar empresa como auto-aprovacao |
| Ver proprietario | Link para o perfil do nucleado |
| Historico | Ver alteracoes feitas na empresa |

### 3.2 Logica de desativacao em cascata

Quando desativar um usuario:
1. Alterar status do perfil para `inativo`
2. Buscar empresa vinculada (onde `dono_id = profile.id`)
3. Alterar status da empresa para `rejeitado`

---

## 4. Pagina de Relatorios (Nova: AdminReports.tsx)

### 4.1 Relatorios propostos

**Nucleados:**
- Total de membros por status
- Membros por ano de entrada
- Faixa etaria dos membros
- Membros por cidade/estado

**Empresas:**
- Total por segmento
- Empresas por numero de funcionarios
- Empresas por ano de fundacao
- Empresas por cidade/estado

### 4.2 Exportacao de dados

- Botao para exportar lista de nucleados (CSV)
- Botao para exportar lista de empresas (CSV)
- Dados incluem todas as informacoes cadastradas

---

## 5. Controle de Usuarios Admin (Nova: AdminRoles.tsx)

### 5.1 Funcionalidades

| Funcionalidade | Descricao |
|----------------|-----------|
| Listar admins | Mostrar todos usuarios com role admin |
| Adicionar admin | Selecionar nucleado ativo e tornar admin |
| Remover admin | Remover role de admin (mantendo role membro) |
| Protecao | Nao permitir remover o ultimo admin |

### 5.2 Interface

```text
+--------------------------------------------------+
| Controle de Administradores                      |
+--------------------------------------------------+
| Administradores Atuais (3)                       |
|--------------------------------------------------|
| Nome           | Email           | Desde | Acoes |
|----------------|-----------------|-------|-------|
| Admin Master   | admin@...       | 2020  | -     |
| Maria Santos   | maria@...       | 2023  | [X]   |
+--------------------------------------------------+
| Adicionar Administrador                          |
| [Select: Nucleados ativos] [Adicionar]           |
+--------------------------------------------------+
```

---

## 6. Arquivos a Criar/Modificar

### Novos arquivos:

| Arquivo | Descricao |
|---------|-----------|
| `src/hooks/useAuditLog.ts` | Hook para buscar historico |
| `src/hooks/useUserRoles.ts` | Hook para gerenciar roles |
| `src/pages/admin/AdminReports.tsx` | Pagina de relatorios |
| `src/components/admin/UserDetailPanel.tsx` | Painel de detalhes do usuario |
| `src/components/admin/CompanyDetailPanel.tsx` | Painel de detalhes da empresa |
| `src/components/admin/AuditHistory.tsx` | Componente de historico |

### Arquivos a modificar:

| Arquivo | Alteracoes |
|---------|-----------|
| `src/pages/admin/ManageUsers.tsx` | Adicionar visualizacao, edicao, ativacao, admin control |
| `src/pages/admin/ManageCompanies.tsx` | Adicionar visualizacao, edicao, auto-aprovacao, historico |
| `src/hooks/useCompanies.ts` | Atualizar logica de auto-aprovacao |
| `src/components/layout/AdminLayout.tsx` | Adicionar link para Relatorios |
| `src/App.tsx` | Adicionar rota para relatorios |

---

## 7. Fluxo de Auto-aprovacao

```text
+-------------------+     +-------------------+
| Nucleado edita    |---->| Verifica empresa  |
| dados da empresa  |     | auto_aprovacao?   |
+-------------------+     +-------------------+
                                |
              +--------+--------+--------+
              |                          |
              v                          v
    +----------------+          +----------------+
    | TRUE:          |          | FALSE:         |
    | status =       |          | status =       |
    | 'publicado'    |          | 'pendente'     |
    +----------------+          +----------------+
              |                          |
              v                          v
    +----------------+          +----------------+
    | Alteracao      |          | Aguarda        |
    | imediata       |          | aprovacao      |
    +----------------+          +----------------+
```

---

## 8. Secao Tecnica

### 8.1 Hook useUserRoles

```typescript
export function useUserRoles() {
  const queryClient = useQueryClient();

  const { data: admins } = useQuery({
    queryKey: ['user_roles', 'admins'],
    queryFn: async () => {
      const { data } = await supabase
        .from('user_roles')
        .select(`
          *,
          profile:profiles!user_roles_user_id_fkey(id, nome, email)
        `)
        .eq('role', 'admin');
      return data;
    }
  });

  const addAdmin = useMutation({
    mutationFn: async (userId: string) => {
      await supabase.from('user_roles').insert({ 
        user_id: userId, 
        role: 'admin' 
      });
    },
    onSuccess: () => queryClient.invalidateQueries(['user_roles'])
  });

  const removeAdmin = useMutation({
    mutationFn: async (userId: string) => {
      await supabase.from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', 'admin');
    },
    onSuccess: () => queryClient.invalidateQueries(['user_roles'])
  });

  return { admins, addAdmin, removeAdmin };
}
```

### 8.2 Logica de desativacao em cascata

```typescript
const handleDeactivateUser = async (profileId: string) => {
  // 1. Desativar usuario
  await supabase.from('profiles')
    .update({ status: 'inativo' })
    .eq('id', profileId);

  // 2. Desativar empresa vinculada
  await supabase.from('companies')
    .update({ status: 'rejeitado' })
    .eq('dono_id', profileId);
};
```

### 8.3 Exportacao CSV

```typescript
const exportToCSV = (data: any[], filename: string) => {
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => 
    Object.values(row).map(v => `"${v}"`).join(',')
  ).join('\n');
  
  const blob = new Blob([headers + '\n' + rows], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
};
```

---

## 9. Navegacao Atualizada do Admin

```text
[Dashboard] [Usuarios] [Empresas] [Noticias] [Formulario] [Inscricoes] [Relatorios]
```

A aba "Usuarios" tera sub-secoes:
- Gerenciar Nucleados
- Controle de Admins

---

## Resumo das Entregas

1. **Migracao SQL** com novos campos e tabela de auditoria
2. **ManageUsers.tsx** expandido com visualizacao, edicao e controle de status
3. **ManageCompanies.tsx** expandido com auto-aprovacao e historico
4. **AdminReports.tsx** nova pagina com relatorios e exportacao
5. **Controle de Admins** integrado na gestao de usuarios
6. **Hooks auxiliares** para roles e auditoria
7. **Atualizacao do layout** com nova navegacao
