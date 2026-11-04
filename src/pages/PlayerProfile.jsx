import { Link, useParams } from 'react-router-dom';
import { useApi } from '../api.js';
import PlayerImg from '../components/PlayerImg.jsx';

const age = iso => {
  const b = new Date(iso), n = new Date();
  let a = n.getFullYear() - b.getFullYear();
  if (n < new Date(n.getFullYear(), b.getMonth(), b.getDate())) a--;
  return a;
};
const fmtDate = iso => new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

export default function PlayerProfile() {
  const { id } = useParams();
  const { data: p, error } = useApi(`/players/${id}`);
  const { data: all } = useApi('/players');
  if (error) return <div className="loading">Player not found. <Link className="link" to="/#squad">Back to squad</Link></div>;
  if (!p) return <div className="loading">Loading…</div>;

  const idx = all ? all.findIndex(x => x.id === p.id) : -1;
  const prev = idx > 0 ? all[idx - 1] : null, next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;
  const rows = [
    ['Full name', p.fullName],
    ['Born', p.born && `${fmtDate(p.born)} (${age(p.born)} years)`],
    ['Birth place', p.birthPlace],
    ['Playing role', p.role],
    ['Batting style', p.battingStyle],
    ['Bowling style', p.bowlingStyle],
    ['Jersey number', p.jersey != null && `#${p.jersey}`],
    ['Status', [p.captain && 'Captain', p.overseas && 'Overseas player'].filter(Boolean).join(' · ') || null],
  ].filter(([, v]) => v);
  const s = p.kingsStats;

  return (
    <div className="page profile">
      <nav className="crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link> › <Link to="/#squad">Squad</Link> › <span>{p.fullName}</span></nav>
      <header className="profile__hero">
        <div>
          <p className="eyebrow">{p.group} · Biratnagar Kings</p>
          <h1>{p.firstName}<br />{p.lastName}</h1>
          <p className="muted">{p.role}{p.captain && <span className="cap cap--inline">C</span>}</p>
        </div>
        <div className="profile__photo">
          {p.jersey != null && <span className="profile__no">{String(p.jersey).padStart(2, '0')}</span>}
          <PlayerImg p={p} loading="eager" />
        </div>
      </header>

      <div className="profile__grid">
        <section className="card">
          <h2>Personal information</h2>
          <dl className="info">
            {rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            {p.teams?.length > 0 && <div><dt>Teams</dt><dd className="chips">{p.teams.map(t => <span key={t}>{t}</span>)}</dd></div>}
          </dl>
        </section>

        <section className="card">
          <h2>Profile</h2>
          <p>{p.bio}</p>
          {p.highlights?.length > 0 && <ul className="features">{p.highlights.map(h => <li key={h}>{h}</li>)}</ul>}
        </section>

        {s && (
          <section className="card card--wide">
            <h2>Biratnagar Kings · NPL career</h2>
            <div className="tablewrap">
              <table className="pt"><thead><tr><th>Format</th><th>Mat</th><th>Runs</th><th>Wkts</th><th>SR</th></tr></thead>
                <tbody><tr><td>T20 · NPL (Kings)</td><td>{s.matches}</td><td>{s.runs}</td><td>{s.wickets}</td><td>{s.strikeRate.toFixed(2)}</td></tr></tbody></table>
            </div>
          </section>
        )}
      </div>

      <p className="muted caption">Full international and franchise career statistics:{' '}
        <a className="link" href={`https://www.google.com/search?q=${encodeURIComponent(p.fullName + ' espncricinfo')}`} target="_blank" rel="noreferrer">find {p.fullName} on ESPNcricinfo →</a></p>

      <div className="profile__nav">
        {prev ? <Link to={`/players/${prev.id}`} className="btn btn--ghost">← {prev.firstName} {prev.lastName}</Link> : <span />}
        {next ? <Link to={`/players/${next.id}`} className="btn btn--ghost">{next.firstName} {next.lastName} →</Link> : <span />}
      </div>
    </div>
  );
}
