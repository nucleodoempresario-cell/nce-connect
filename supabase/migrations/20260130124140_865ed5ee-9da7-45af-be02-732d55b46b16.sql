-- Adicionar bloco "Como ser um Nucleado" no final da página Sobre
INSERT INTO page_blocks (pagina, tipo_bloco, ordem, conteudo, visivel) VALUES
('sobre', 'lista_beneficios', 5, '{
  "titulo": "Como ser um Nucleado",
  "subtitulo": "Faça parte da nossa comunidade de empresários",
  "descricao": "Para se tornar um nucleado, você precisa atender aos seguintes requisitos:",
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
    "texto": "Candidatar-se Agora",
    "link": "/seja-nucleado"
  }
}'::jsonb, true);