import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../cart.jsx';
// import { asset } from '../config.js';

const LOGO = '/images/logo/logo.png';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const { count } = useCart();
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const on = () => setSolid(scrollY > 40);
    on(); addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, []);
  useEffect(() => { setOpen(false); }, [pathname, hash]);
  useEffect(() => { // lock page scroll behind the open mobile menu; Escape closes it
    document.body.classList.toggle('noscroll', open);
    const k = e => e.key === 'Escape' && setOpen(false);
    addEventListener('keydown', k);
    return () => { document.body.classList.remove('noscroll'); removeEventListener('keydown', k); };
  }, [open]);

  const close = () => setOpen(false);
  return (
    <header className={'nav' + (solid || open ? ' nav--solid' : '')}>
      <Link to="/" className="nav__brand" onClick={close}>
        <img src={LOGO} alt="Biratnagar Kings crest" width="40" height="40" /> <span>BIRATNAGAR KINGS</span>
      </Link>
      <Link to="/cart" className="cartlink nav__cart" aria-label={`Cart, ${count} items`} onClick={close}>🛒<b>{count}</b></Link>
      <button className="nav__toggle" aria-label="Toggle menu" aria-expanded={open} aria-controls="mainnav" onClick={() => setOpen(!open)}>
        <span /><span /><span />
      </button>
      <nav id="mainnav" className={'nav__links' + (open ? ' is-open' : '')}>
        <Link to="/squad" onClick={close}>Squad</Link>
        <Link to="/#fixtures" onClick={close}>Fixtures</Link>
        <Link to="/#standings" onClick={close}>Standings</Link>
        <Link to="/#legacy" onClick={close}>Legacy</Link>
        <Link to="/store" onClick={close}>Store</Link>
        <Link to="/store" className="btn btn--gold nav__cta" onClick={close}>Shop Kings</Link>
      </nav>
    </header>
  );
}
