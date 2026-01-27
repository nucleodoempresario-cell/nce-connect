export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          created_at: string
          email: string
          empresa_nome: string | null
          id: string
          nome_candidato: string
          notas_admin: string | null
          respostas: Json
          status: Database["public"]["Enums"]["application_status"]
          telefone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          empresa_nome?: string | null
          id?: string
          nome_candidato: string
          notas_admin?: string | null
          respostas?: Json
          status?: Database["public"]["Enums"]["application_status"]
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          empresa_nome?: string | null
          id?: string
          nome_candidato?: string
          notas_admin?: string | null
          respostas?: Json
          status?: Database["public"]["Enums"]["application_status"]
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          ano_fundacao: number | null
          cep: string | null
          cidade: string | null
          contato: Json | null
          created_at: string
          descricao_completa: string | null
          descricao_curta: string | null
          dono_id: string | null
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          logo_url: string | null
          nome: string
          numero_funcionarios: string | null
          redes_sociais: Json | null
          segmento: string | null
          site_url: string | null
          status: Database["public"]["Enums"]["company_status"]
          telefone: string | null
          updated_at: string
        }
        Insert: {
          ano_fundacao?: number | null
          cep?: string | null
          cidade?: string | null
          contato?: Json | null
          created_at?: string
          descricao_completa?: string | null
          descricao_curta?: string | null
          dono_id?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          logo_url?: string | null
          nome: string
          numero_funcionarios?: string | null
          redes_sociais?: Json | null
          segmento?: string | null
          site_url?: string | null
          status?: Database["public"]["Enums"]["company_status"]
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          ano_fundacao?: number | null
          cep?: string | null
          cidade?: string | null
          contato?: Json | null
          created_at?: string
          descricao_completa?: string | null
          descricao_curta?: string | null
          dono_id?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          logo_url?: string | null
          nome?: string
          numero_funcionarios?: string | null
          redes_sociais?: Json | null
          segmento?: string | null
          site_url?: string | null
          status?: Database["public"]["Enums"]["company_status"]
          telefone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "companies_dono_id_fkey"
            columns: ["dono_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      form_questions: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          obrigatoria: boolean
          opcoes: Json | null
          ordem: number
          texto_pergunta: string
          tipo: Database["public"]["Enums"]["question_type"]
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          obrigatoria?: boolean
          opcoes?: Json | null
          ordem?: number
          texto_pergunta: string
          tipo: Database["public"]["Enums"]["question_type"]
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          obrigatoria?: boolean
          opcoes?: Json | null
          ordem?: number
          texto_pergunta?: string
          tipo?: Database["public"]["Enums"]["question_type"]
          updated_at?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          autor_id: string | null
          conteudo: string
          created_at: string
          id: string
          imagem_capa: string | null
          publicado: boolean
          resumo: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          autor_id?: string | null
          conteudo: string
          created_at?: string
          id?: string
          imagem_capa?: string | null
          publicado?: boolean
          resumo?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          autor_id?: string | null
          conteudo?: string
          created_at?: string
          id?: string
          imagem_capa?: string | null
          publicado?: boolean
          resumo?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          cargo: string | null
          cidade: string | null
          created_at: string
          data_entrada: string | null
          data_nascimento: string | null
          email: string | null
          estado: string | null
          foto_url: string | null
          id: string
          nome: string
          redes_sociais: Json | null
          status: Database["public"]["Enums"]["profile_status"]
          telefone: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          bio?: string | null
          cargo?: string | null
          cidade?: string | null
          created_at?: string
          data_entrada?: string | null
          data_nascimento?: string | null
          email?: string | null
          estado?: string | null
          foto_url?: string | null
          id?: string
          nome: string
          redes_sociais?: Json | null
          status?: Database["public"]["Enums"]["profile_status"]
          telefone?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          bio?: string | null
          cargo?: string | null
          cidade?: string | null
          created_at?: string
          data_entrada?: string | null
          data_nascimento?: string | null
          email?: string | null
          estado?: string | null
          foto_url?: string | null
          id?: string
          nome?: string
          redes_sociais?: Json | null
          status?: Database["public"]["Enums"]["profile_status"]
          telefone?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      site_content: {
        Row: {
          conteudo: Json
          id: string
          tipo: string
          updated_at: string
        }
        Insert: {
          conteudo: Json
          id?: string
          tipo: string
          updated_at?: string
        }
        Update: {
          conteudo?: Json
          id?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_profile_status: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["profile_status"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "membro"
      application_status: "novo" | "analisado" | "aprovado" | "rejeitado"
      company_status: "publicado" | "pendente_aprovacao" | "rejeitado"
      profile_status: "ativo" | "inativo" | "pendente"
      question_type:
        | "texto_curto"
        | "texto_longo"
        | "checkbox"
        | "multipla_escolha"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "membro"],
      application_status: ["novo", "analisado", "aprovado", "rejeitado"],
      company_status: ["publicado", "pendente_aprovacao", "rejeitado"],
      profile_status: ["ativo", "inativo", "pendente"],
      question_type: [
        "texto_curto",
        "texto_longo",
        "checkbox",
        "multipla_escolha",
      ],
    },
  },
} as const
