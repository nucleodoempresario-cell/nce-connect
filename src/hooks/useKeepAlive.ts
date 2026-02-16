import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const STORAGE_KEY = 'lastKeepAlive';
const INTERVAL_MS = 24 * 60 * 60 * 1000; // 24h

export function useKeepAlive() {
  useEffect(() => {
    const last = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    if (last && now - Number(last) < INTERVAL_MS) return;

    supabase.functions
      .invoke('keep-alive', { body: { source: 'website_visit' } })
      .then(({ error }) => {
        if (error) {
          console.warn('[keep-alive] failed:', error.message);
        } else {
          localStorage.setItem(STORAGE_KEY, String(now));
          console.log('[keep-alive] heartbeat sent');
        }
      });
  }, []);
}
