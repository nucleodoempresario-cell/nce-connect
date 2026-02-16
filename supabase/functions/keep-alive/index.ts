import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    let source = 'unknown'
    try {
      const body = await req.json()
      if (body?.source) source = body.source
    } catch {
      // no body is fine
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { error } = await supabase.from('system_heartbeat').insert({
      tipo: 'keep_alive',
      detalhes: { timestamp: new Date().toISOString(), source },
    })

    if (error) throw error

    // Cleanup: keep only last 30 records
    const { data: old } = await supabase
      .from('system_heartbeat')
      .select('id')
      .order('created_at', { ascending: false })

    if (old && old.length > 30) {
      const idsToDelete = old.slice(30).map((r) => r.id)
      await supabase.from('system_heartbeat').delete().in('id', idsToDelete)
    }

    return new Response(JSON.stringify({ ok: true, source }), {
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
