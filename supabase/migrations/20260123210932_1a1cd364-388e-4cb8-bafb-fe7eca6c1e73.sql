-- Adicionar role de admin para o usuário robsongaeski@gmail.com
INSERT INTO user_roles (user_id, role) 
VALUES ('d30e9139-cbcf-4081-9d21-f68da45ca8d6', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Garantir que o perfil do usuário esteja ativo
UPDATE profiles 
SET status = 'ativo' 
WHERE user_id = 'd30e9139-cbcf-4081-9d21-f68da45ca8d6';