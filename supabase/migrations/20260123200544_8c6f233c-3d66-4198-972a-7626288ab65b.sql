-- =============================================
-- NCE - Núcleo do Empresário - Database Schema
-- =============================================

-- 1. Create Enums
create type public.app_role as enum ('admin', 'membro');
create type public.profile_status as enum ('ativo', 'inativo', 'pendente');
create type public.company_status as enum ('publicado', 'pendente_aprovacao', 'rejeitado');
create type public.question_type as enum ('texto_curto', 'texto_longo', 'checkbox', 'multipla_escolha');
create type public.application_status as enum ('novo', 'analisado', 'aprovado', 'rejeitado');

-- 2. Create profiles table
create table public.profiles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null unique,
    nome text not null,
    foto_url text,
    bio text,
    telefone text,
    email text,
    redes_sociais jsonb default '{}'::jsonb,
    status public.profile_status default 'pendente' not null,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

-- 3. Create user_roles table (separate for security)
create table public.user_roles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    role public.app_role not null,
    created_at timestamp with time zone default now() not null,
    unique (user_id, role)
);

-- 4. Create companies table
create table public.companies (
    id uuid primary key default gen_random_uuid(),
    nome text not null,
    logo_url text,
    descricao_curta text,
    descricao_completa text,
    site_url text,
    redes_sociais jsonb default '{}'::jsonb,
    contato jsonb default '{}'::jsonb,
    dono_id uuid references public.profiles(id) on delete set null,
    status public.company_status default 'pendente_aprovacao' not null,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

-- 5. Create news table
create table public.news (
    id uuid primary key default gen_random_uuid(),
    titulo text not null,
    conteudo text not null,
    resumo text,
    imagem_capa text,
    autor_id uuid references public.profiles(id) on delete set null,
    publicado boolean default false not null,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

-- 6. Create form_questions table
create table public.form_questions (
    id uuid primary key default gen_random_uuid(),
    texto_pergunta text not null,
    tipo public.question_type not null,
    opcoes jsonb default '[]'::jsonb,
    ordem integer default 0 not null,
    obrigatoria boolean default true not null,
    ativo boolean default true not null,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

-- 7. Create applications table
create table public.applications (
    id uuid primary key default gen_random_uuid(),
    nome_candidato text not null,
    email text not null,
    telefone text,
    empresa_nome text,
    respostas jsonb default '{}'::jsonb not null,
    status public.application_status default 'novo' not null,
    notas_admin text,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

-- 8. Create site_content table for institutional content
create table public.site_content (
    id uuid primary key default gen_random_uuid(),
    tipo text not null unique,
    conteudo jsonb not null,
    updated_at timestamp with time zone default now() not null
);

-- =============================================
-- Security Definer Functions
-- =============================================

-- Function to check if user has a specific role
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- Function to check if user is admin
create or replace function public.is_admin(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role(_user_id, 'admin')
$$;

-- Function to get user's profile status
create or replace function public.get_profile_status(_user_id uuid)
returns public.profile_status
language sql
stable
security definer
set search_path = public
as $$
  select status from public.profiles where user_id = _user_id
$$;

-- =============================================
-- Triggers
-- =============================================

-- Function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
set search_path = public
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

-- Apply updated_at trigger to all tables
create trigger update_profiles_updated_at
    before update on public.profiles
    for each row execute function public.update_updated_at_column();

create trigger update_companies_updated_at
    before update on public.companies
    for each row execute function public.update_updated_at_column();

create trigger update_news_updated_at
    before update on public.news
    for each row execute function public.update_updated_at_column();

create trigger update_form_questions_updated_at
    before update on public.form_questions
    for each row execute function public.update_updated_at_column();

create trigger update_applications_updated_at
    before update on public.applications
    for each row execute function public.update_updated_at_column();

-- Function to create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.profiles (user_id, nome, email)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'nome', new.email),
        new.email
    );
    
    -- Assign default 'membro' role
    insert into public.user_roles (user_id, role)
    values (new.id, 'membro');
    
    return new;
end;
$$;

-- Trigger to create profile on signup
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- =============================================
-- Enable RLS on all tables
-- =============================================

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.companies enable row level security;
alter table public.news enable row level security;
alter table public.form_questions enable row level security;
alter table public.applications enable row level security;
alter table public.site_content enable row level security;

-- =============================================
-- RLS Policies
-- =============================================

-- PROFILES policies
create policy "Profiles ativos são públicos"
    on public.profiles for select
    using (status = 'ativo');

create policy "Usuários podem ver próprio perfil"
    on public.profiles for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Admins podem ver todos os perfis"
    on public.profiles for select
    to authenticated
    using (public.is_admin(auth.uid()));

create policy "Usuários podem editar próprio perfil"
    on public.profiles for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- USER_ROLES policies
create policy "Usuários podem ver própria role"
    on public.user_roles for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Admins podem ver todas as roles"
    on public.user_roles for select
    to authenticated
    using (public.is_admin(auth.uid()));

create policy "Admins podem inserir roles"
    on public.user_roles for insert
    to authenticated
    with check (public.is_admin(auth.uid()));

create policy "Admins podem atualizar roles"
    on public.user_roles for update
    to authenticated
    using (public.is_admin(auth.uid()));

create policy "Admins podem deletar roles"
    on public.user_roles for delete
    to authenticated
    using (public.is_admin(auth.uid()));

-- COMPANIES policies
create policy "Empresas publicadas são públicas"
    on public.companies for select
    using (status = 'publicado');

create policy "Donos podem ver própria empresa"
    on public.companies for select
    to authenticated
    using (dono_id = (select id from public.profiles where user_id = auth.uid()));

create policy "Admins podem ver todas as empresas"
    on public.companies for select
    to authenticated
    using (public.is_admin(auth.uid()));

create policy "Membros podem criar empresa"
    on public.companies for insert
    to authenticated
    with check (
        dono_id = (select id from public.profiles where user_id = auth.uid())
    );

create policy "Donos podem editar própria empresa"
    on public.companies for update
    to authenticated
    using (dono_id = (select id from public.profiles where user_id = auth.uid()))
    with check (dono_id = (select id from public.profiles where user_id = auth.uid()));

create policy "Admins podem editar qualquer empresa"
    on public.companies for update
    to authenticated
    using (public.is_admin(auth.uid()));

create policy "Admins podem deletar empresas"
    on public.companies for delete
    to authenticated
    using (public.is_admin(auth.uid()));

-- NEWS policies
create policy "Notícias publicadas são públicas"
    on public.news for select
    using (publicado = true);

create policy "Admins podem ver todas as notícias"
    on public.news for select
    to authenticated
    using (public.is_admin(auth.uid()));

create policy "Admins podem criar notícias"
    on public.news for insert
    to authenticated
    with check (public.is_admin(auth.uid()));

create policy "Admins podem editar notícias"
    on public.news for update
    to authenticated
    using (public.is_admin(auth.uid()));

create policy "Admins podem deletar notícias"
    on public.news for delete
    to authenticated
    using (public.is_admin(auth.uid()));

-- FORM_QUESTIONS policies
create policy "Perguntas ativas são públicas"
    on public.form_questions for select
    using (ativo = true);

create policy "Admins podem ver todas as perguntas"
    on public.form_questions for select
    to authenticated
    using (public.is_admin(auth.uid()));

create policy "Admins podem criar perguntas"
    on public.form_questions for insert
    to authenticated
    with check (public.is_admin(auth.uid()));

create policy "Admins podem editar perguntas"
    on public.form_questions for update
    to authenticated
    using (public.is_admin(auth.uid()));

create policy "Admins podem deletar perguntas"
    on public.form_questions for delete
    to authenticated
    using (public.is_admin(auth.uid()));

-- APPLICATIONS policies
create policy "Qualquer pessoa pode criar inscrição"
    on public.applications for insert
    with check (true);

create policy "Admins podem ver inscrições"
    on public.applications for select
    to authenticated
    using (public.is_admin(auth.uid()));

create policy "Admins podem editar inscrições"
    on public.applications for update
    to authenticated
    using (public.is_admin(auth.uid()));

create policy "Admins podem deletar inscrições"
    on public.applications for delete
    to authenticated
    using (public.is_admin(auth.uid()));

-- SITE_CONTENT policies
create policy "Conteúdo do site é público"
    on public.site_content for select
    using (true);

create policy "Admins podem editar conteúdo"
    on public.site_content for all
    to authenticated
    using (public.is_admin(auth.uid()));

-- =============================================
-- Storage Buckets
-- =============================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values 
    ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
    ('company-logos', 'company-logos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
    ('news-images', 'news-images', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

-- Storage policies for avatars
create policy "Avatar images are publicly accessible"
    on storage.objects for select
    using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
    on storage.objects for insert
    to authenticated
    with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can update their own avatar"
    on storage.objects for update
    to authenticated
    using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete their own avatar"
    on storage.objects for delete
    to authenticated
    using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for company logos
create policy "Company logos are publicly accessible"
    on storage.objects for select
    using (bucket_id = 'company-logos');

create policy "Authenticated users can upload company logos"
    on storage.objects for insert
    to authenticated
    with check (bucket_id = 'company-logos');

create policy "Authenticated users can update company logos"
    on storage.objects for update
    to authenticated
    using (bucket_id = 'company-logos');

create policy "Admins can delete company logos"
    on storage.objects for delete
    to authenticated
    using (bucket_id = 'company-logos' and public.is_admin(auth.uid()));

-- Storage policies for news images
create policy "News images are publicly accessible"
    on storage.objects for select
    using (bucket_id = 'news-images');

create policy "Admins can upload news images"
    on storage.objects for insert
    to authenticated
    with check (bucket_id = 'news-images' and public.is_admin(auth.uid()));

create policy "Admins can update news images"
    on storage.objects for update
    to authenticated
    using (bucket_id = 'news-images' and public.is_admin(auth.uid()));

create policy "Admins can delete news images"
    on storage.objects for delete
    to authenticated
    using (bucket_id = 'news-images' and public.is_admin(auth.uid()));

-- =============================================
-- Insert default site content
-- =============================================

insert into public.site_content (tipo, conteudo) values
('institucional', '{
    "missao": "Conectar lideranças empresariais para fortalecer o desenvolvimento econômico regional através do networking qualificado e da troca de experiências.",
    "visao": "Ser referência em networking empresarial, reconhecido pela excelência na conexão de líderes e pela contribuição ao crescimento sustentável dos negócios.",
    "valores": ["Ética e Transparência", "Colaboração e Parceria", "Inovação e Crescimento", "Comprometimento", "Respeito e Diversidade"],
    "objetivos": [
        "Promover networking de qualidade entre empresários",
        "Facilitar parcerias estratégicas entre empresas",
        "Compartilhar conhecimentos e boas práticas de gestão",
        "Fortalecer a economia regional através da colaboração",
        "Desenvolver lideranças empresariais"
    ]
}'::jsonb),
('requisitos', '{
    "titulo": "Requisitos para se tornar um Nucleado",
    "requisitos": [
        "Ser proprietário ou sócio de empresa legalmente constituída",
        "Apresentar conduta ética e profissional reconhecida",
        "Estar comprometido com os valores do NCE",
        "Participar ativamente das reuniões e eventos",
        "Contribuir para o crescimento do grupo"
    ]
}'::jsonb);

-- Insert default form questions
insert into public.form_questions (texto_pergunta, tipo, ordem, obrigatoria) values
('Por que você deseja fazer parte do NCE?', 'texto_longo', 1, true),
('Como você conheceu o NCE?', 'multipla_escolha', 2, true),
('Quais são seus principais objetivos de networking?', 'texto_longo', 3, true),
('Você se compromete a participar ativamente das reuniões?', 'checkbox', 4, true);

-- Update the question with options
update public.form_questions 
set opcoes = '["Indicação de membro", "Redes sociais", "Evento", "Pesquisa online", "Outro"]'::jsonb
where texto_pergunta = 'Como você conheceu o NCE?';