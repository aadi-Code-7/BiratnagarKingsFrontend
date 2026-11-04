import { Link } from 'react-router-dom';
import PlayerImg from './PlayerImg.jsx';

export default function PlayerCard({ p }) {
  return (
    <Link to={`/players/${p.id}`} className="pcard" aria-label={`${p.fullName} — view profile`}>
      {p.jersey != null && <span className="pcard__no">{String(p.jersey).padStart(2, '0')}</span>}
      {p.captain && <span className="cap pcard__cap" title="Captain">C</span>}
      {p.overseas && <span className="tag pcard__os">Overseas</span>}
      <PlayerImg p={p} />
      <h3>{p.firstName} {p.lastName}</h3>
      <p>{p.role}</p>
      <span className="pcard__more">View Profile →</span>
    </Link>
  );
}
