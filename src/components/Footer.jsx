const LOGO = '/images/logo/logo.png';
export default function Footer() {
  return (
    <footer className="footer">
      <img src={LOGO} alt="Biratnagar Kings crest" width="64" height="64" loading="lazy" />
      <div className="footer__name">BIRATNAGAR KINGS</div>
      <div className="footer__sub">Nepal Premier League</div>
      <div className="footer__social">
        <a href="https://www.instagram.com/biratnagar_kings_official/?hl=en" target="_blank" rel="noreferrer">Instagram</a>
        <a href="https://www.facebook.com/biratnagarkingsofficial/" target="_blank" rel="noreferrer">Facebook</a>
        <a href="https://www.tiktok.com/@biratnagarkingsoffical" target="_blank" rel="noreferrer">TikTok</a>
      </div>
      <div className="footer__copy">© Biratnagar Kings</div>
    </footer>
  );
}
