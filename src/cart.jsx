import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

const KEY = 'bk_cart_v1';
const Ctx = createContext(null);
export const lineKey = i => [i.productId, i.size, i.customName || '', i.customNumber ?? ''].join('|');

function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } }

function reducer(items, a) {
  switch (a.type) {
    case 'add': {
      const key = lineKey(a.item), i = items.findIndex(x => x.key === key);
      if (i >= 0) { const c = [...items]; c[i] = { ...c[i], quantity: Math.min(10, c[i].quantity + a.item.quantity) }; return c; }
      return [...items, { ...a.item, key }];
    }
    case 'qty': return items.map(x => x.key === a.key ? { ...x, quantity: Math.min(10, Math.max(1, a.quantity)) } : x);
    case 'remove': return items.filter(x => x.key !== a.key);
    case 'clear': return [];
    default: return items;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, null, load);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* private mode */ } }, [items]);
  const value = useMemo(() => ({ items, dispatch, count: items.reduce((n, i) => n + i.quantity, 0) }), [items]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useCart = () => useContext(Ctx);
