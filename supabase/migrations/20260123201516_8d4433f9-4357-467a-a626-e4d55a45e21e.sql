-- Fix the overly permissive INSERT policy for applications
-- The previous policy allowed ANY modifications, we need to restrict it

-- First drop the existing policy
drop policy if exists "Qualquer pessoa pode criar inscrição" on public.applications;

-- Create a more restrictive INSERT policy that still allows public submissions
-- but validates the data being inserted
create policy "Público pode criar inscrição"
    on public.applications for insert
    with check (
        -- Ensure required fields are not empty
        nome_candidato is not null 
        and nome_candidato != '' 
        and email is not null 
        and email != ''
        -- Ensure status is always 'novo' for new applications
        and status = 'novo'
    );