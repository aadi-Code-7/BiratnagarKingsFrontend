import { useRef, useState } from 'react';

// Official anthem: "Biratnagar Kings Anthem" — Kushal Grumpy ft. K-pass (Kpass Records, 20 Nov 2024).
const VIDEO = 'No_8lfwbm9A';
// Optional: put your own file in frontend/public and set VITE_ANTHEM_URL=/anthem.mp3 to use a native audio player instead.
const LOCAL = import.meta.env.VITE_ANTHEM_URL;

export default function Anthem() {
  const [playing, setPlaying] = useState(false);
  const audio = useRef(null);
  return (
    <section className="section anthem">
      <p className="eyebrow">The Sound of the Kingdom</p>
      <h2>Our Anthem</h2>
      <p className="lead">Turn it up. This is the roar that carries Biratnagar onto every pitch.</p>
      {LOCAL ? (
        <div className="player">
          <button className="player__btn" onClick={() => (playing ? audio.current.pause() : audio.current.play())} aria-label={playing ? 'Pause anthem' : 'Play anthem'}>{playing ? '❚❚' : '▶'}</button>
          <div><strong>Biratnagar Kings Anthem</strong><span>Roar · Reign · Repeat</span></div>
          <audio ref={audio} src={LOCAL} preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} />
        </div>
      ) : (
        <div className="yt">
          {playing ? (
            <iframe title="Biratnagar Kings Anthem" src={`https://www.youtube-nocookie.com/embed/${VIDEO}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
          ) : (
            <button className="yt__poster" onClick={() => setPlaying(true)} aria-label="Play the Biratnagar Kings anthem">
              <img src={`https://i.ytimg.com/vi/${VIDEO}/hqdefault.jpg`} alt="" loading="lazy" />
              <span className="yt__play">▶</span>
              <span className="yt__cap"><strong>Biratnagar Kings Anthem</strong> Kushal Grumpy ft. K-pass</span>
            </button>
          )}
          <a className="link yt__open" href={`https://www.youtube.com/watch?v=${VIDEO}`} target="_blank" rel="noreferrer">Not playing? Open on YouTube →</a>
        </div>
      )}
    </section>
  );
}
