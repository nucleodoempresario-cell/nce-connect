import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // Verify the requesting user is an admin
    const authHeader = req.headers.get('Authorization')!
    const anonClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_PUBLISHABLE_KEY')!, {
      global: { headers: { Authorization: authHeader } }
    })

    const { data: { user: callerUser }, error: authError } = await anonClient.auth.getUser()
    if (authError || !callerUser) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Check admin status using service role
    const adminClient = createClient(supabaseUrl, serviceRoleKey)
    const { data: isAdmin } = await adminClient.rpc('is_admin', { _user_id: callerUser.id })
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Apenas administradores podem excluir usuários' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { user_id } = await req.json()
    if (!user_id) {
      return new Response(JSON.stringify({ error: 'user_id é obrigatório' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Prevent self-deletion
    if (user_id === callerUser.id) {
      return new Response(JSON.stringify({ error: 'Você não pode excluir sua própria conta' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Get the profile to find owned companies
    const { data: profile } = await adminClient
      .from('profiles')
      .select('id')
      .eq('user_id', user_id)
      .maybeSingle()

    if (profile) {
      // Delete owned companies
      await adminClient.from('companies').delete().eq('dono_id', profile.id)
      // Delete profile
      await adminClient.from('profiles').delete().eq('id', profile.id)
    }

    // Delete user roles
    await adminClient.from('user_roles').delete().eq('user_id', user_id)
    // Delete admin permissions
    await adminClient.from('admin_permissions').delete().eq('user_id', user_id)

    // Delete the auth user
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user_id)
    if (deleteError) {
      return new Response(JSON.stringify({ error: deleteError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})