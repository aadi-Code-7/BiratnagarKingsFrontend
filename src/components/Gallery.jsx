import { useEffect, useState } from 'react';
import { useApi } from '../api.js';
import { asset } from '../config.js';

export default function Gallery() {
  const { data } = useApi('/gallery');
  const [open, setOpen] = useState(null);
  useEffect(() => {
    if (open === null) return;
    const k = e => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') setOpen(o => (o + 1) % data.length);
      if (e.key === 'ArrowLeft') setOpen(o => (o - 1 + data.length) % data.length);
    };
    addEventListener('keydown', k); return () => removeEventListener('keydown', k);
  }, [open, data]);
  return (
    <section className="section">
      <p className="eyebrow">Moments</p>
      <h2>From The Kingdom.</h2>
      <p className="lead">Snapshots from the dressing room, the auction floor, and every roar in between — a scrapbook of our season so far.</p>
      <div className="gallery">
        {(data ?? []).map((g, i) => (
          <figure key={g.no} className="gallery__item" onClick={() => setOpen(i)} tabIndex={0} onKeyDown={e => e.key === 'Enter' && setOpen(i)}>
            <img src={asset(g.image)} alt={g.title} loading="lazy" decoding="async" />
            <figcaption>{g.title}<span>#{String(g.no).padStart(2, '0')}</span></figcaption>
          </figure>
        ))}
      </div>
      {open !== null && data && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setOpen(null)}>
          <button className="lightbox__x" aria-label="Close">×</button>
          <img src={asset(data[open].image)} alt={data[open].title} onClick={e => e.stopPropagation()} />
          <p>{data[open].title}</p>
        </div>
      )}
    </section>
  );
}
