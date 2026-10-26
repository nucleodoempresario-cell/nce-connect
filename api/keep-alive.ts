// Vercel Serverless Function — chamada diariamente pelo Vercel Cron.
// Gera tráfego externo real na API do Supabase, que é o que impede a pausa por inatividade.
const SUPABASE_URL = "https://hiduxammdscacaghfzuj.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpZHV4YW1tZHNjYWNhZ2hmenVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxOTUzMzcsImV4cCI6MjA4NDc3MTMzN30.2vaeqpSbd7gbqM8I9PZ4po43zVuP00T-hbMENSaqrNI";

export default async function handler(_req: Request) {
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/keep-alive`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ source: "vercel_cron" }),
    });

    const text = await res.text();
    if (!res.ok) {
      return new Response(
        JSON.stringify({ ok: false, status: res.status, body: text }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(JSON.stringify({ ok: true, supabase: text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
