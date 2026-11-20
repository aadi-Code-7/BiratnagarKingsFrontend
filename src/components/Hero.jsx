import { useApi } from '../api.js';
import { asset } from '../config.js';

const BG = '/images/home/stadium-hero.jpg';
const SQUAD = '/images/home/group.png';

export default function Hero() {
  const { data } = useApi('/franchise');
  const words = data?.tickerWords ?? ['Biratnagar Kings', 'कीर्ति', 'Roar', 'Reign', 'Repeat', '#letsgokings'];
  const loop = [...words, ...words, ...words, ...words];
  return (
    <section id="top" className="hero">
      <img className="hero__bg" src={asset(BG)} alt="" fetchPriority="high" decoding="async" />
      <div className="hero__shade" />
      <div className="hero__grid">
        <div className="hero__inner">
          <p className="eyebrow">Nepal Premier League · Season 2026</p>
          <h1 className="hero__title">KINGS OF<br />THE EAST.</h1>
          <p className="hero__lead"><strong>Biratnagar's crown. Nepal's pitch. One roar.</strong> From the roaring stands of Biratnagar to the summit of Nepali cricket — the Kings play with the crown, the mountains, and a whole city on their chest.</p>
          <div className="hero__cta">
            <a href="#squad" className="btn btn--gold">Meet the Squad →</a>
            <a href="#fixtures" className="btn btn--ghost">Fixtures</a>
          </div>
        </div>
        <img className="hero__squad" src={asset(SQUAD)} alt="Biratnagar Kings squad — Class of 2026" fetchPriority="high" decoding="async" />
      </div>
      <div className="ticker" aria-hidden="true">
        <div className="ticker__track">{loop.map((w, i) => <span key={i}>{w} <i>·</i> </span>)}</div>
      </div>
    </section>
  );
}
