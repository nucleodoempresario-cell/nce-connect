import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type FormQuestion = Database['public']['Tables']['form_questions']['Row'];
type FormQuestionInsert = Database['public']['Tables']['form_questions']['Insert'];
type FormQuestionUpdate = Database['public']['Tables']['form_questions']['Update'];

export function useFormQuestions() {
  return useQuery({
    queryKey: ['form_questions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('form_questions')
        .select('*')
        .eq('ativo', true)
        .order('ordem');
      
      if (error) throw error;
      return data as FormQuestion[];
    },
  });
}

export function useAllFormQuestions() {
  return useQuery({
    queryKey: ['form_questions', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('form_questions')
        .select('*')
        .order('ordem');
      
      if (error) throw error;
      return data as FormQuestion[];
    },
  });
}

export function useCreateFormQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (question: FormQuestionInsert) => {
      const { data, error } = await supabase
        .from('form_questions')
        .insert(question)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form_questions'] });
    },
  });
}

export function useUpdateFormQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: FormQuestionUpdate }) => {
      const { data, error } = await supabase
        .from('form_questions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form_questions'] });
    },
  });
}

export function useDeleteFormQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('form_questions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form_questions'] });
    },
  });
}
