import { useLive } from '../api.js';
import { asset } from '../config.js';

const LOGO = asset('https://biratkings.com/assets/biratnagar-kings-logo-transparent-ByYqYoTH.png');

export default function Fixtures() {
  const { data, error } = useLive('/fixtures', 60000);
  return (
    <section id="fixtures" className="section fixtures">
      <img className="fixtures__ball" src={asset('https://biratkings.com/assets/cricket-ball-BAZ5PK7v.jpg')} alt="" loading="lazy" />
      <p className="eyebrow">Next Roars</p>
      <h2>The Fixtures.</h2>
      {error && <p className="error">Couldn't load fixtures.</p>}
      <ul className="fx">
        {(data ?? []).map(f => {
          const [mon, day] = f.date.split(' ');
          return (
            <li key={f.id} className={'fx__row' + (f.result ? ' is-played' : '')}>
              <div className="fx__date"><b>{mon}</b><span>{day}</span><small>{f.time}</small></div>
              <img src={LOGO} alt="" width="44" height="44" loading="lazy" />
              <div className="fx__match"><strong>vs {f.opponent}</strong><span>{f.venue}</span></div>
              <div className="fx__tags">
                {f.result && <em className={'tag ' + (/^Won/.test(f.result) ? 'tag--won' : /^Lost/.test(f.result) ? 'tag--lost' : '')}>{f.result}</em>}
                <em className="tag">{f.home ? 'Home' : 'Away'}</em>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
