import { Link } from 'react-router-dom';
import { useApi, useMedia } from '../api.js';
import PlayerCard from './PlayerCard.jsx';

/** Home page: only a few players up front; "View all" opens the full squad page. */
export default function SquadPreview() {
  const { data, error } = useApi('/players');
  const wide = useMedia('(min-width: 1100px)');
  const n = wide ? 5 : 4;
  return (
    <section id="squad" className="section">
      <p className="eyebrow">The Squad</p>
      <h2>Meet the Kings.</h2>
      <p className="lead">{data ? data.length : 'Nineteen'} names, one crest. The men who wear navy &amp; gold and answer every Kal Bhairav chant from the terraces.</p>
      {error && <p className="error">Couldn't load the squad. Please refresh.</p>}
      <div className="grid grid--squad">
        {(data ?? []).slice(0, n).map(p => <PlayerCard key={p.id} p={p} />)}
      </div>
      {data && <div className="center"><Link to="/squad" className="btn btn--gold">View all {data.length} players →</Link></div>}
    </section>
  );
}
