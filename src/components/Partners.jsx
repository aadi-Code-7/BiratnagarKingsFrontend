import { useApi } from '../api.js';
import { asset } from '../config.js';

export default function Partners() {
  const { data } = useApi('/sponsors');
  const tiers = [];
  (data ?? []).forEach(s => {
    let t = tiers.find(x => x.name === s.tier);
    if (!t) tiers.push(t = { name: s.tier, items: [] });
    t.items.push(s);
  });
  return (
    <section className="section partners">
      <p className="eyebrow">— Presenting —</p>
      <h2>OUR <em>Partners.</em></h2>
      <p className="lead">The brands that stand shoulder to shoulder with the Kings.</p>
      {tiers.map(t => (
        <div key={t.name} className="tier">
          <h4>{t.name}</h4>
          <div className="tier__logos">
            {t.items.map(s => <div key={s.name} className="logo"><img src={asset(s.logo)} alt={`${s.name} logo`} loading="lazy" decoding="async" /></div>)}
          </div>
        </div>
      ))}
    </section>
  );
}
