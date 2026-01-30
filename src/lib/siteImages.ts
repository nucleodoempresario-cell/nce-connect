// Mapeamento de imagens locais do site
// Essas imagens são importadas como ES6 modules para melhor bundling

import heroNetworking from '@/assets/hero-networking.jpg';
import confiancaCredibilidade from '@/assets/confianca-credibilidade.jpg';
import crescimentoColaboracao from '@/assets/crescimento-colaboracao.jpg';
import comunidadeUnida from '@/assets/comunidade-unida.jpg';
import sejaNucleado from '@/assets/seja-nucleado.jpg';
import sobreNce from '@/assets/sobre-nce.jpg';

// Mapa de identificadores para imagens locais
export const SITE_IMAGES: Record<string, string> = {
  'hero-networking': heroNetworking,
  'confianca-credibilidade': confiancaCredibilidade,
  'crescimento-colaboracao': crescimentoColaboracao,
  'comunidade-unida': comunidadeUnida,
  'seja-nucleado': sejaNucleado,
  'sobre-nce': sobreNce,
};

/**
 * Resolve uma URL de imagem - suporta:
 * - URLs completas (https://...)
 * - Identificadores locais (local:hero-networking)
 */
export function resolveImageUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  
  // Se começa com "local:", busca no mapa de imagens locais
  if (url.startsWith('local:')) {
    const imageId = url.replace('local:', '');
    return SITE_IMAGES[imageId] || url;
  }
  
  // Caso contrário, retorna a URL como está
  return url;
}
