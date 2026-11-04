import { useState } from 'react';
import { API } from '../config.js';

const STAT_FIELDS = [['totalRuns', 'Total runs'], ['powerPlayRuns', 'Power-play runs'], ['totalWickets', 'Total wickets'], ['maidens', 'Maiden overs'],
  ['pacePct', 'Pace %'], ['spinPct', 'Spin %'], ['freeHits', 'Free hits'], ['dotBalls', 'Dot balls'], ['fours', 'Fours'], ['sixes', 'Sixes']];
const COUNTER_FIELDS = [['matches', 'Matches played'], ['runs', 'Runs scored'], ['wickets', 'Wickets taken']];
const BLANK = { id: 0, date: '', time: '', opponent: '', venue: 'TU Stadium', home: true, result: '' };

/** Hidden editor at /admin. Needs the server's ADMIN_TOKEN (kept in memory only, never stored). */
export default function Admin() {
  const [token, setToken] = useState('');
  const [ok, setOk] = useState(false);
  const [fx, setFx] = useState([]);
  const [stats, setStats] = useState({});
  const [counters, setCounters] = useState({});
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  const call = async (path, method = 'GET', body, t = token) => {
    const r = await fetch(`${API}/admin${path}`, { method, headers: { 'X-Admin-Token': t, 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.message || d.error || `Request failed (${r.status})`);
    return d;
  };
  const run = async (label, fn) => {
    setBusy(true); setMsg(null);
    try { await fn(); setMsg({ ok: true, text: label }); } catch (e) { setMsg({ ok: false, text: e.message }); } finally { setBusy(false); }
  };
  const load = async t => {
    const [f, s, c] = await Promise.all([call('/fixtures', 'GET', null, t), call('/stats', 'GET', null, t), call('/counters', 'GET', null, t)]);
    setFx(f.map(x => ({ ...x, result: x.result ?? '' }))); setStats(s); setCounters(c);
  };
  const login = e => { e.preventDefault(); run('Signed in', async () => { await load(token); setOk(true); }); };
  const num = o => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, Number(v)]));
  const setRow = (i, k, v) => setFx(fx.map((r, j) => (j === i ? { ...r, [k]: v } : r)));

  if (!ok) return (
    <div className="page narrow">
      <h1 className="h1s">Admin</h1>
      <form className="checkout" onSubmit={login}>
        <label className="field">Admin token<input type="password" value={token} onChange={e => setToken(e.target.value)} autoComplete="current-password" /></label>
        {msg && <p className={msg.ok ? 'muted' : 'error'} role="alert">{msg.text}</p>}
        <button className="btn btn--gold" disabled={busy || !token}>{busy ? 'Checking…' : 'Sign in'}</button>
        <p className="muted caption">Set the <code>ADMIN_TOKEN</code> environment variable on the server to enable this page.</p>
      </form>
    </div>
  );

  return (
    <div className="page admin">
      <h1 className="h1s">Update site data</h1>
      {msg && <p className={msg.ok ? 'admin__ok' : 'error'} role="status">{msg.text}</p>}

      <section className="card">
        <h2>Fixtures</h2>
        <p className="muted">Leave <b>Result</b> empty to let the live feed fill it in automatically (e.g. “Won by 5 wickets”).</p>
        <div className="tablewrap">
          <table className="pt admin__table">
            <thead><tr><th>#</th><th>Date</th><th>Time</th><th>Opponent</th><th>Venue</th><th>Home</th><th>Result</th><th /></tr></thead>
            <tbody>
              {fx.map((r, i) => (
                <tr key={i}>
                  <td><input aria-label="id" type="number" value={r.id} onChange={e => setRow(i, 'id', Number(e.target.value))} /></td>
                  {['date', 'time', 'opponent', 'venue', 'result'].map(k => <td key={k}><input aria-label={k} value={r[k]} onChange={e => setRow(i, k, e.target.value)} /></td>)}
                  <td><input aria-label="home" type="checkbox" checked={r.home} onChange={e => setRow(i, 'home', e.target.checked)} /></td>
                  <td><button className="link" onClick={() => setFx(fx.filter((_, j) => j !== i))}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="hero__cta">
          <button className="btn btn--ghost" onClick={() => setFx([...fx, { ...BLANK, id: fx.length + 1 }])}>+ Add fixture</button>
          <button className="btn btn--gold" disabled={busy} onClick={() => run('Fixtures saved', async () => setFx((await call('/fixtures', 'PUT', { fixtures: fx.map(r => ({ ...r, result: r.result.trim() || null })) })).map(x => ({ ...x, result: x.result ?? '' }))))}>Save fixtures</button>
        </div>
      </section>

      <section className="card">
        <h2>Kings statistics</h2>
        <div className="admin__grid">{STAT_FIELDS.map(([k, l]) => <label key={k} className="field">{l}<input type="number" step="any" value={stats[k] ?? ''} onChange={e => setStats({ ...stats, [k]: e.target.value })} /></label>)}</div>
        <button className="btn btn--gold" disabled={busy} onClick={() => run('Statistics saved', async () => setStats(await call('/stats', 'PUT', num(stats))))}>Save statistics</button>
      </section>

      <section className="card">
        <h2>Headline counters</h2>
        <div className="admin__grid">{COUNTER_FIELDS.map(([k, l]) => <label key={k} className="field">{l}<input type="number" value={counters[k] ?? ''} onChange={e => setCounters({ ...counters, [k]: e.target.value })} /></label>)}</div>
        <button className="btn btn--gold" disabled={busy} onClick={() => run('Counters saved', async () => setCounters(await call('/counters', 'PUT', num(counters))))}>Save counters</button>
      </section>

      <button className="link" onClick={() => confirm('Discard all edits and go back to defaults + live data?') && run('Reset to defaults', async () => { await call('/overrides', 'DELETE'); await load(token); })}>Reset everything to defaults</button>
    </div>
  );
}
