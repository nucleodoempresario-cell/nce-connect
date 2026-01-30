import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PageBlock, BlockContent, BlockType } from '@/types/pageBlocks';
import { toast } from 'sonner';

// Fetch blocks for a specific page
export function usePageBlocks(pagina: string) {
  return useQuery({
    queryKey: ['page-blocks', pagina],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_blocks')
        .select('*')
        .eq('pagina', pagina)
        .order('ordem', { ascending: true });
      
      if (error) throw error;
      return data as unknown as PageBlock[];
    },
  });
}

// Fetch all blocks for admin (including hidden)
export function useAllPageBlocks(pagina: string) {
  return useQuery({
    queryKey: ['page-blocks-admin', pagina],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_blocks')
        .select('*')
        .eq('pagina', pagina)
        .order('ordem', { ascending: true });
      
      if (error) throw error;
      return data as unknown as PageBlock[];
    },
  });
}

// Create a new block
export function useCreateBlock() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      pagina, 
      tipo_bloco, 
      ordem, 
      conteudo 
    }: { 
      pagina: string; 
      tipo_bloco: BlockType; 
      ordem: number; 
      conteudo: BlockContent;
    }) => {
      const { data, error } = await supabase
        .from('page_blocks')
        .insert([{
          pagina,
          tipo_bloco,
          ordem,
          conteudo: JSON.parse(JSON.stringify(conteudo)),
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data as unknown as PageBlock;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['page-blocks', variables.pagina] });
      queryClient.invalidateQueries({ queryKey: ['page-blocks-admin', variables.pagina] });
      toast.success('Bloco criado com sucesso!');
    },
    onError: (error) => {
      console.error('Error creating block:', error);
      toast.error('Erro ao criar bloco');
    },
  });
}

// Update block content
export function useUpdateBlock() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      conteudo,
      visivel,
    }: { 
      id: string; 
      conteudo?: BlockContent;
      visivel?: boolean;
    }) => {
      const updateData: Record<string, unknown> = {};
      if (conteudo !== undefined) updateData.conteudo = conteudo;
      if (visivel !== undefined) updateData.visivel = visivel;
      
      const { data, error } = await supabase
        .from('page_blocks')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as unknown as PageBlock;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['page-blocks', data.pagina] });
      queryClient.invalidateQueries({ queryKey: ['page-blocks-admin', data.pagina] });
      toast.success('Bloco atualizado!');
    },
    onError: (error) => {
      console.error('Error updating block:', error);
      toast.error('Erro ao atualizar bloco');
    },
  });
}

// Reorder blocks
export function useReorderBlocks() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      pagina, 
      orderedIds 
    }: { 
      pagina: string; 
      orderedIds: string[];
    }) => {
      // Update each block's ordem based on its position in the array
      const updates = orderedIds.map((id, index) => 
        supabase
          .from('page_blocks')
          .update({ ordem: index + 1 })
          .eq('id', id)
      );
      
      await Promise.all(updates);
      return { pagina };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['page-blocks', data.pagina] });
      queryClient.invalidateQueries({ queryKey: ['page-blocks-admin', data.pagina] });
    },
    onError: (error) => {
      console.error('Error reordering blocks:', error);
      toast.error('Erro ao reordenar blocos');
    },
  });
}

// Delete a block
export function useDeleteBlock() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // First get the block to know the page
      const { data: block } = await supabase
        .from('page_blocks')
        .select('pagina')
        .eq('id', id)
        .single();
      
      const { error } = await supabase
        .from('page_blocks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { pagina: block?.pagina };
    },
    onSuccess: (data) => {
      if (data.pagina) {
        queryClient.invalidateQueries({ queryKey: ['page-blocks', data.pagina] });
        queryClient.invalidateQueries({ queryKey: ['page-blocks-admin', data.pagina] });
      }
      toast.success('Bloco removido!');
    },
    onError: (error) => {
      console.error('Error deleting block:', error);
      toast.error('Erro ao remover bloco');
    },
  });
}

// Toggle block visibility
export function useToggleBlockVisibility() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, visivel }: { id: string; visivel: boolean }) => {
      const { data, error } = await supabase
        .from('page_blocks')
        .update({ visivel })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as unknown as PageBlock;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['page-blocks', data.pagina] });
      queryClient.invalidateQueries({ queryKey: ['page-blocks-admin', data.pagina] });
      toast.success(data.visivel ? 'Bloco visível' : 'Bloco oculto');
    },
    onError: (error) => {
      console.error('Error toggling visibility:', error);
      toast.error('Erro ao alterar visibilidade');
    },
  });
}
