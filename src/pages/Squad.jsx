import { Link } from 'react-router-dom';
import { useApi } from '../api.js';
import PlayerCard from '../components/PlayerCard.jsx';

// Order follows how a team sheet reads. Roles come from ESPNcricinfo's classification.
const GROUPS = [
  ['Batter', 'Batters', 'Specialist run-scorers.'],
  ['Wicketkeeper', 'Wicketkeepers', 'Behind the stumps.'],
  ['All-rounder', 'All-rounders', 'Bat and bowl — the balance of the side.'],
  ['Bowler', 'Bowlers', 'Spin and pace attack.'],
];

export default function Squad() {
  const { data, error } = useApi('/players');
  const by = g => (data ?? []).filter(p => p.group === g);
  return (
    <div className="page squadpage">
      <nav className="crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link> › <span>Squad</span></nav>
      <p className="eyebrow">Biratnagar Kings · NPL 2026</p>
      <h1 className="h1s">The Full Squad</h1>
      <p className="lead">{data ? `${data.length} players` : 'Loading…'}, organised by role. Tap a player for the full profile.</p>
      {error && <p className="error">Couldn't load the squad. Please refresh.</p>}
      {data && (
        <div className="chipnav" role="navigation" aria-label="Jump to role">
          {GROUPS.map(([k, label]) => <a key={k} href={`#grp-${k}`} className="chipnav__a">{label} <b>{by(k).length}</b></a>)}
        </div>
      )}
      {data && GROUPS.map(([k, label, sub]) => by(k).length > 0 && (
        <section key={k} id={`grp-${k}`} className="group">
          <h2>{label} <small>{by(k).length}</small></h2>
          <p className="muted">{sub}</p>
          <div className="grid grid--squad">{by(k).map(p => <PlayerCard key={p.id} p={p} />)}</div>
        </section>
      ))}
    </div>
  );
}
