import { useLive } from '../api.js';
import { useCountUp } from '../hooks.js';

function Stat({ label, to, decimals = 0, suffix = '' }) {
  const [ref, v] = useCountUp(to, { decimals });
  return <div className="stat" ref={ref}><span>{label}</span><b>{v}{suffix}</b></div>;
}

export default function KingsStats() {
  const { data: s } = useLive('/stats', 60000);
  if (!s) return <section className="section" />;
  return (
    <section className="section stats">
      <p className="eyebrow">By The Numbers</p>
      <h2>Kings Statistics.</h2>
      <p className="lead">Two seasons of Kings cricket, distilled. Every run, every wicket, every roar — Biratnagar by the numbers.</p>
      <div className="grid grid--stats">
        <Stat key={"a"+s.totalRuns} label="Total Runs Scored" to={s.totalRuns} />
        <Stat label="Runs In Power Play (1–6)" to={s.powerPlayRuns} />
        <Stat label="Total Wickets Taken" to={s.totalWickets} />
        <Stat label="Maiden Overs" to={s.maidens} />
        <div className="stat stat--bar">
          <span>Bowling Types</span>
          <div className="bar"><i style={{ width: s.pacePct + '%' }} /></div>
          <div className="bar__legend"><em>Pace {s.pacePct.toFixed(2)}%</em><em>Spin {s.spinPct.toFixed(2)}%</em></div>
        </div>
        <Stat label="Total Number Of Free Hits" to={s.freeHits} />
        <Stat label="Dot Balls" to={s.dotBalls} />
        <div className="stat"><span>Fours / Sixes</span><b>{s.fours}/{s.sixes}</b></div>
      </div>
    </section>
  );
}
