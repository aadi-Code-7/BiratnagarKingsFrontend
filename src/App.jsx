import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';

const Store = lazy(() => import('./pages/Store.jsx'));
const Cart = lazy(() => import('./pages/Cart.jsx'));
const PlayerProfile = lazy(() => import('./pages/PlayerProfile.jsx'));
const Squad = lazy(() => import('./pages/Squad.jsx'));
const Admin = lazy(() => import('./pages/Admin.jsx'));

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 50);
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const store = pathname === '/store';
  return (
    <>
      <ScrollManager />
      {!store && <Navbar />}
      <main>
        <Suspense fallback={<div className="loading">Loading…</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/store" element={<Store />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/players/:id" element={<PlayerProfile />} />
            <Route path="/squad" element={<Squad />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<div className="loading">Page not found. <Link to="/" className="link">Back home</Link></div>} />
          </Routes>
        </Suspense>
      </main>
      {!store && <Footer />}
    </>
  );
}
