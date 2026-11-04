import { useEffect, useState } from 'react';
import { API } from './config.js';

const cache = new Map(); // in-memory: static endpoints are fetched once per session
const inflight = new Map();

export function get(path) {
  if (cache.has(path)) return Promise.resolve(cache.get(path));
  if (!inflight.has(path)) {
    inflight.set(path, fetch(API + path)
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(d => { cache.set(path, d); inflight.delete(path); return d; })
      .catch(e => { inflight.delete(path); throw e; }));
  }
  return inflight.get(path);
}

/** Bypasses the cache (used for live data). */
export const getFresh = path => fetch(API + path, { cache: 'no-store' }).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); });

export async function post(path, body) {
  const r = await fetch(API + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) { const e = new Error(data.message || 'Request failed (' + r.status + ')'); e.fields = data.errors || {}; throw e; }
  return data;
}

export function useApi(path) {
  const [state, set] = useState({ data: cache.get(path) ?? null, error: null });
  useEffect(() => {
    let live = true;
    set({ data: cache.get(path) ?? null, error: null });
    get(path).then(data => live && set({ data, error: null })).catch(error => live && set({ data: null, error }));
    return () => { live = false; };
  }, [path]);
  return state;
}

/** Live data: fetched fresh, re-polled while the tab is visible, and refreshed when the tab regains focus. */
export function useLive(path, ms = 60000) {
  const [state, set] = useState({ data: null, error: null });
  useEffect(() => {
    let alive = true;
    const load = () => getFresh(path).then(data => alive && set({ data, error: null })).catch(error => alive && set(s => ({ data: s.data, error })));
    const visible = () => { if (document.visibilityState === 'visible') load(); };
    load();
    const t = setInterval(visible, ms);
    document.addEventListener('visibilitychange', visible);
    return () => { alive = false; clearInterval(t); document.removeEventListener('visibilitychange', visible); };
  }, [path, ms]);
  return state;
}

export function useMedia(query) {
  const [m, set] = useState(() => typeof matchMedia !== 'undefined' && matchMedia(query).matches);
  useEffect(() => {
    const mq = matchMedia(query), on = () => set(mq.matches);
    on(); mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return m;
}
