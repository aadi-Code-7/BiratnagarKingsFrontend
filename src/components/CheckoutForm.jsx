import { useRef, useState } from 'react';
import { post } from '../api.js';

export function validate(v) {
  const e = {};
  const name = v.name.trim();
  if (!name) e.name = 'Name is required';
  else if (!/^[\p{L}][\p{L} .'-]{1,59}$/u.test(name)) e.name = 'Enter a valid name (letters only)';
  if (!v.phone) e.phone = 'Phone number is required';
  else if (!/^\d{10}$/.test(v.phone)) e.phone = 'Phone must contain 10 digits';
  if (!v.address.trim()) e.address = 'Address is required';
  else if (v.address.trim().length < 5) e.address = 'Address must be at least 5 characters';
  return e;
}

/** Validated checkout: name, phone (digits only) and address are all required. */
export default function CheckoutForm({ items, onSuccess, label = 'Place order' }) {
  const [v, setV] = useState({ name: '', phone: '', address: '' });
  const [touched, setTouched] = useState({});
  const [server, setServer] = useState({});
  const [busy, setBusy] = useState(false);
  const [fail, setFail] = useState(null);
  const form = useRef(null);
  const errors = { ...server, ...validate(v) }; // client rules win; server errors fill the gaps
  const show = k => (touched[k] ? errors[k] : null);

  const change = k => e => {
    const val = k === 'phone' ? e.target.value.replace(/\D/g, '').slice(0, 10) : e.target.value; // digits only
    setV({ ...v, [k]: val }); setServer({});
  };
  const blur = k => () => setTouched(t => ({ ...t, [k]: true }));

  const submit = async e => {
    e.preventDefault(); setFail(null);
    const errs = validate(v);
    if (Object.keys(errs).length) {
      setTouched({ name: true, phone: true, address: true });
      form.current.querySelector(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }
    setBusy(true);
    try {
      const res = await post('/store/orders', {
        name: v.name.trim(), phone: v.phone, address: v.address.trim(),
        items: items.map(i => ({ productId: i.productId, size: i.size, quantity: i.quantity, customName: i.customName || null, customNumber: i.customNumber ?? null })),
      });
      onSuccess(res);
    } catch (err) {
      if (err.fields && Object.keys(err.fields).length) { setServer(err.fields); setTouched({ name: true, phone: true, address: true }); }
      setFail(err.message || 'Could not place the order. Please try again.');
    } finally { setBusy(false); }
  };

  const f = (k, label, props) => (
    <label className={'field' + (show(k) ? ' has-error' : '')}>{label}
      <input name={k} value={v[k]} onChange={change(k)} onBlur={blur(k)} aria-invalid={!!show(k)} aria-describedby={k + '-err'} {...props} />
      <small id={k + '-err'} className="field__err" role="alert">{show(k)}</small>
    </label>
  );

  return (
    <form ref={form} onSubmit={submit} noValidate className="checkout">
      {f('name', 'Full name', { autoComplete: 'name', placeholder: 'e.g. Sita Rai' })}
      {f('phone', 'Phone number', { type: 'tel', inputMode: 'numeric', autoComplete: 'tel', placeholder: '98XXXXXXXX', maxLength: 15 })}
      {f('address', 'Delivery address', { autoComplete: 'street-address', placeholder: 'Street, city, district' })}
      {fail && <p className="error" role="alert">{fail}</p>}
      <button className="btn btn--gold" disabled={busy || !items.length}>{busy ? 'Placing order…' : label}</button>
    </form>
  );
}
