import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../api.js';
import { useCart } from '../cart.jsx';
import { asset } from '../config.js';
import CheckoutForm from '../components/CheckoutForm.jsx';

const LOGO = asset('https://biratkings.com/assets/biratnagar-kings-logo-transparent-ByYqYoTH.png');
const LABELS = ['SANDEEP · #25', 'BASIR · #11', 'LOKESH · #07'];

function BuyNowModal({ item, onClose }) {
  const [done, setDone] = useState(null);
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Buy now" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>{done ? 'Order placed 🎉' : 'Buy now'}</h3>
        {done ? <p role="status">{done.message}</p> : <>
          <p className="muted">{item.name} · Size {item.size} · Qty {item.quantity}{item.customName ? ` · ${item.customName.toUpperCase()}` : ''}{item.customNumber != null ? ` #${item.customNumber}` : ''}</p>
          <CheckoutForm items={[item]} onSuccess={setDone} />
        </>}
        <div className="modal__actions"><button type="button" className="btn btn--ghost" onClick={onClose}>Close</button></div>
      </div>
    </div>
  );
}

export default function Store() {
  const { data } = useApi('/store/products');
  const { dispatch, count } = useCart();
  const [img, setImg] = useState(0);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [custom, setCustom] = useState(false);
  const [cName, setCName] = useState('');
  const [cNum, setCNum] = useState('');
  const [err, setErr] = useState(null);
  const [toast, setToast] = useState(null);
  const [buy, setBuy] = useState(null);
  const p = data?.[0];

  const flash = m => { setToast(m); setTimeout(() => setToast(null), 2600); };
  const build = () => {
    if (!size) { setErr('Select a size first.'); return null; }
    if (custom) {
      if (cName && !/^[A-Za-z ]{1,12}$/.test(cName)) { setErr('Jersey name: letters only, up to 12.'); return null; }
      if (cNum !== '' && !/^\d{1,2}$/.test(cNum)) { setErr('Jersey number must be 0–99.'); return null; }
      if (!cName && cNum === '') { setErr('Enter a name and/or number, or turn personalization off.'); return null; }
    }
    setErr(null);
    return { productId: p.id, name: p.name, image: p.images[0], size, quantity: qty,
      customName: custom && cName.trim() ? cName.trim() : null, customNumber: custom && cNum !== '' ? Number(cNum) : null };
  };
  const add = () => { const it = build(); if (!it) return; dispatch({ type: 'add', item: it }); flash(`Added ${qty} × ${p.name} (${size}) to cart.`); };

  return (
    <div className="store">
      <header className="store__nav">
        <Link to="/" className="nav__brand"><img src={LOGO} alt="Biratnagar Kings" width="40" height="40" /><span>KINGS · STORE</span></Link>
        <div className="store__right">
          <Link to="/cart" className="cartlink" aria-label={`Cart, ${count} items`}>🛒<b>{count}</b></Link>
          <Link to="/" className="link">← HOME</Link>
        </div>
      </header>
      <section className="store__hero">
        <p className="eyebrow">KINGS OFFICIAL STORE</p>
        <h1>Wear the Crown.</h1>
        <p className="lead">Official on-field replica. Same fabric. Same crest. Made for the roar.</p>
      </section>
      {!p ? <div className="loading">Loading…</div> : (
        <section className="product">
          <div className="product__gallery">
            <div className="product__main">
              <span className="tag tag--gold">NEW · 2026</span>
              <img src={asset(p.images[img])} alt={`${p.name} — ${LABELS[img]}`} fetchPriority="high" decoding="async" />
              <span className="product__label">{custom && (cName || cNum !== '') ? `${cName.toUpperCase()} ${cNum !== '' ? '#' + cNum : ''}` : LABELS[img]}</span>
            </div>
            <div className="product__thumbs">
              {p.images.map((s, i) => <button key={s} className={i === img ? 'is-active' : ''} onClick={() => setImg(i)} aria-label={`View ${i + 1}`}><img src={asset(s)} alt="" loading="lazy" decoding="async" /></button>)}
            </div>
          </div>
          <div className="product__info">
            <p className="eyebrow">{p.tag}</p>
            <h2>{p.name}</h2>
            <p>{p.description}</p>
            <ul className="features">{p.features.map(f => <li key={f}>{f}</li>)}</ul>
            <p className="eyebrow">SIZE <span className="muted">Select your fit</span></p>
            <div className="sizes" role="radiogroup" aria-label="Size">
              {p.sizes.map(s => <button key={s} role="radio" aria-checked={size === s} className={size === s ? 'is-active' : ''} onClick={() => { setSize(s); setErr(null); }}>{s}</button>)}
            </div>

            {p.personalizable && (
              <div className="custom">
                <label className="check"><input type="checkbox" checked={custom} onChange={e => { setCustom(e.target.checked); setErr(null); }} /> Personalize my jersey (name &amp; number)</label>
                {custom && (
                  <div className="custom__fields">
                    <label className="field">Name on back<input value={cName} maxLength={12} placeholder="KINGS FAN" onChange={e => setCName(e.target.value.replace(/[^A-Za-z ]/g, ''))} /></label>
                    <label className="field">Number<input value={cNum} inputMode="numeric" maxLength={2} placeholder="00–99" onChange={e => setCNum(e.target.value.replace(/\D/g, '').slice(0, 2))} /></label>
                  </div>
                )}
              </div>
            )}

            <div className="qty">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => Math.min(10, q + 1))} aria-label="Increase quantity">+</button>
              <small>Qty {qty}</small>
            </div>
            {err && <p className="error" role="alert">{err}</p>}
            <div className="hero__cta">
              <button className="btn btn--gold" onClick={add}>Add to Cart</button>
              <button className="btn btn--ghost" onClick={() => { const it = build(); if (it) setBuy(it); }}>Buy Now</button>
              {count > 0 && <Link to="/cart" className="btn btn--ghost">View cart ({count})</Link>}
            </div>
            <p className="muted">AVAILABLE AT {p.retailers.toUpperCase()} · APPAREL PARTNER {p.partner.toUpperCase()}</p>
          </div>
        </section>
      )}
      <footer className="store__foot">© 2026 Biratnagar Kings<span>APPAREL PARTNER · DOLPO</span></footer>
      {toast && <div className="toast" role="status">{toast} <Link to="/cart" className="toast__link">View cart</Link></div>}
      {buy && <BuyNowModal item={buy} onClose={() => setBuy(null)} />}
    </div>
  );
}
