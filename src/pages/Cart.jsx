import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../api.js';
import { useCart } from '../cart.jsx';
import { asset } from '../config.js';
import CheckoutForm from '../components/CheckoutForm.jsx';

export default function Cart() {
  const { items, dispatch, count } = useCart();
  const { data: products } = useApi('/store/products');
  const [done, setDone] = useState(null);
  const prod = id => products?.find(p => p.id === id);

  if (done) return (
    <div className="page narrow cartpage">
      <h1 className="h1s">Order placed 🎉</h1>
      <p role="status">{done.message}</p>
      {!done.adminNotified && <p className="muted">Tip: note your order number <b>{done.orderId}</b> and show it at the store.</p>}
      <Link to="/store" className="btn btn--gold">Continue shopping</Link>
    </div>
  );

  if (!items.length) return (
    <div className="page narrow cartpage">
      <h1 className="h1s">Your cart</h1>
      <p className="lead">Your cart is empty. Grab the 2026 home jersey and wear the crown.</p>
      <Link to="/store" className="btn btn--gold">Shop Kings</Link>
    </div>
  );

  return (
    <div className="page cartpage">
      <h1 className="h1s">Your cart <small className="muted">({count} {count === 1 ? 'item' : 'items'})</small></h1>
      <div className="cart">
        <ul className="cart__list">
          {items.map(i => {
            const p = prod(i.productId);
            return (
              <li key={i.key} className="cart__item">
                <img src={asset(i.image || p?.images[0])} alt="" width="84" height="84" loading="lazy" />
                <div className="cart__meta">
                  <strong>{i.name}</strong>
                  <span className="muted">Size {i.size}{i.customName ? ` · Name: ${i.customName.toUpperCase()}` : ''}{i.customNumber != null ? ` · No. ${i.customNumber}` : ''}</span>
                  <div className="qty">
                    <button onClick={() => dispatch({ type: 'qty', key: i.key, quantity: i.quantity - 1 })} aria-label="Decrease quantity">−</button>
                    <span>{i.quantity}</span>
                    <button onClick={() => dispatch({ type: 'qty', key: i.key, quantity: i.quantity + 1 })} aria-label="Increase quantity">+</button>
                  </div>
                </div>
                <button className="link cart__rm" onClick={() => dispatch({ type: 'remove', key: i.key })}>Remove</button>
              </li>
            );
          })}
          <li><button className="link" onClick={() => dispatch({ type: 'clear' })}>Clear cart</button></li>
        </ul>
        <aside className="card cart__side">
          <h2>Checkout</h2>
          <p className="muted">{count} item(s). Prices are confirmed by the store team{prod(items[0].productId)?.retailers ? ` (${prod(items[0].productId).retailers})` : ''} when they contact you.</p>
          <CheckoutForm items={items} label="Place order" onSuccess={res => { setDone(res); dispatch({ type: 'clear' }); }} />
        </aside>
      </div>
    </div>
  );
}
