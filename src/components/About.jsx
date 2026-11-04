import { useLive } from '../api.js';
import { asset } from '../config.js';
import { useCountUp } from '../hooks.js';

function Counter({ to, label }) {
  const [ref, v] = useCountUp(to);
  return <div className="counter" ref={ref}><b>{v}</b><span>{label}</span></div>;
}

export default function About() {
  const { data } = useLive('/franchise', 60000);
  const f = data ?? { established: 2024, matches: 16, runs: 2225, wickets: 96 };
  return (
    <section id="legacy" className="section about">
      <div className="about__media">
        <img src={asset('https://biratkings.com/__l5e/assets-v1/322184a6-a2ab-47c2-b0fb-ebcaf38f2da7/npl-crowd.png')} alt="Biratnagar Kings batter walking off under stadium lights as the crowd roars" loading="lazy" />
        <div className="about__badge"><span className="live">Live · Season 2026</span><h3>The Roar</h3><p>Biratnagar. Every night.</p></div>
      </div>
      <div className="about__copy">
        <img className="about__logo" src={asset('https://biratkings.com/assets/biratnagar-kings-logo-transparent-ByYqYoTH.png')} alt="" loading="lazy" />
        <p className="eyebrow">Est. {f.established}</p>
        <p className="muted">Biratnagar · Nepal</p>
        <h2>A city that refuses to lose.</h2>
        <p>Born from the industrial heart of the east, the Biratnagar Kings carry a simple promise into every match — play hard, play loud, and never surrender the crown. Our crest holds the Himalayas we come from and the crown we chase every innings.</p>
        <div className="counters">
          <Counter key={"m"+f.matches} to={f.matches} label="Matches Played" />
          <Counter key={"r"+f.runs} to={f.runs} label="Runs Scored" />
          <Counter key={"w"+f.wickets} to={f.wickets} label="Wickets Taken" />
        </div>
      </div>
    </section>
  );
}
