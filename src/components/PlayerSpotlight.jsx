import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../api.js';
import PlayerImg from './PlayerImg.jsx';

export default function PlayerSpotlight() {
  const { data } = useApi('/players');
  const [i, setI] = useState(0);
  if (!data) return <section className="section spotlight" />;
  const p = data[i];
  const s = p.kingsStats;
  return (
    <section className="section spotlight">
      <div className="spotlight__head">
        <div><p className="eyebrow">Players</p><h2>MEET THE SQUAD.</h2></div>
        <Link to="/squad" className="link">View All →</Link>
      </div>
      <div className="spotlight__body">
        <div className="spotlight__info">
          <h3>{p.firstName} {p.lastName} {p.captain && <span className="cap">C</span>}</h3>
          <p className="muted">{p.role}{p.jersey != null && ` · #${String(p.jersey).padStart(2, '0')}`}</p>
          {s ? (
            <dl className="pstats">
              <div><dd>{s.matches}</dd><dt>Matches</dt></div>
              <div><dd>{s.runs}</dd><dt>Runs</dt></div>
              <div><dd>{s.wickets}</dd><dt>Wickets</dt></div>
              <div><dd>{s.strikeRate.toFixed(2)}</dd><dt>Strike Rate</dt></div>
            </dl>
          ) : (
            <dl className="pstats pstats--text">
              {p.battingStyle && <div><dd>{p.battingStyle}</dd><dt>Batting</dt></div>}
              {p.bowlingStyle && <div><dd>{p.bowlingStyle}</dd><dt>Bowling</dt></div>}
            </dl>
          )}
          <p>{p.bio}</p>
          <Link to={`/players/${p.id}`} className="btn btn--gold">View Profile</Link>
        </div>
        <PlayerImg p={p} className="spotlight__img" key={p.id} loading="eager" />
      </div>
      <ul className="thumbs">
        {data.map((x, idx) => (
          <li key={x.id}>
            <button className={idx === i ? 'is-active' : ''} onClick={() => setI(idx)} aria-label={x.fullName} aria-pressed={idx === i}>
              <PlayerImg p={x} className="thumbs__img" />
              <span>{x.firstName}<br />{x.lastName}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
