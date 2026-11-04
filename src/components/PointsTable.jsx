import { useState } from 'react';
import { useLive } from '../api.js';

export default function PointsTable() {
  const { data: seasons, error: err } = useLive('/standings', 60000);
  const [season, setSeason] = useState(3);

  const cur = seasons?.find(s => s.season === season);
  const time = cur?.updatedAt ? new Date(cur.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;
  return (
    <section id="standings" className="section">
      <p className="eyebrow">Where We Stand</p>
      <h2>Points Table.</h2>
      <div className="tabs" role="tablist">
        {[3, 2, 1].map(n => (
          <button key={n} role="tab" aria-selected={season === n} className={season === n ? 'is-active' : ''} onClick={() => setSeason(n)}>
            Season {n}{n === 3 && <i className="livedot" aria-label="live" />}
          </button>
        ))}
      </div>
      {err && !seasons && <p className="error">Couldn't load standings.</p>}
      <div className="tablewrap">
        <table className="pt">
          <thead><tr><th>Team</th><th>M</th><th>W</th><th>L</th><th>NR</th><th>NRR</th><th>Pts</th></tr></thead>
          <tbody>
            {cur?.table.map(r => (
              <tr key={r.team} className={(r.team.includes('Biratnagar') ? 'is-us ' : '') + (r.position <= 4 ? 'is-q' : '')}>
                <td><span className="pos">{r.position}</span>{r.team}</td>
                <td>{r.played}</td><td>{r.won}</td><td>{r.lost}</td><td>{r.noResult}</td><td>{r.nrr}</td><td><b>{r.points}</b></td>
              </tr>
            ))}
            {cur && cur.table.length === 0 && <tr><td colSpan="7" className="muted">Standings aren't available yet.</td></tr>}
          </tbody>
        </table>
      </div>
      {cur && (
        <p className="muted caption">
          {cur.title}{cur.live && time && <> · <span className="live">Live · updated {time}</span></>}
          <br />Top 4 (highlighted edge) advance to the playoffs. Source: {cur.source}.
        </p>
      )}
    </section>
  );
}
