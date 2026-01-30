-- Atualizar bloco "Como ser um Nucleado" com texto mais convidativo
UPDATE page_blocks 
SET conteudo = '{
  "titulo": "Faça Parte do NCE",
  "subtitulo": "Junte-se a uma comunidade exclusiva de empresários",
  "descricao": "Estamos sempre em busca de novos líderes empresariais que compartilhem nossos valores e queiram crescer junto conosco. Se você é um empresário comprometido com a excelência e busca conexões estratégicas de alto nível, queremos conhecer você! Para se candidatar, você precisa atender aos seguintes requisitos:",
  "itens": [
    "Ter 28 anos ou mais",
    "Possuir 5 ou mais anos de experiência na empresa",
    "CNPJ ativo e regularizado",
    "Empresa com 2 ou mais colaboradores",
    "Comprometimento com os valores éticos do grupo",
    "Disponibilidade para participar dos encontros"
  ],
  "estilo": "check",
  "nota": "Após o envio da candidatura, sua solicitação será analisada pela nossa equipe. Retornaremos em até 7 dias úteis.",
  "botao": {
    "texto": "Preencher Formulário de Candidatura",
    "link": "/seja-nucleado#formulario"
  }
}'::jsonb,
updated_at = now()
WHERE id = '5768c8eb-1e9b-4019-8480-e122c0973c9a';