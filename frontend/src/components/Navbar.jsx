import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, LogOut, LayoutDashboard, Package, ClipboardList, Store } from 'lucide-react';
import { useState, useEffect } from 'react';

function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  // Track cart count
  useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    };
    updateCount();
    window.addEventListener('cart-updated', updateCount);
    return () => window.removeEventListener('cart-updated', updateCount);
  }, []);

  // Track scroll for navbar style
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-200/60'
          : 'bg-white border-b border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-slate-900 hover:text-primary-600 transition-colors"
          >
            <Store className="w-6 h-6 text-primary-600" />
            <span>ShopHub</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            <Link
              to="/"
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
            >
              <span className="flex items-center gap-1.5">
                <Package className="w-4 h-4" />
                Products
              </span>
            </Link>

            {isAuthenticated && !isAdmin && (
              <>
                <Link
                  to="/cart"
                  className="relative px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                >
                  <span className="flex items-center gap-1.5">
                    <ShoppingCart className="w-4 h-4" />
                    Cart
                  </span>
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-fade-in">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/orders"
                  className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                >
                  <span className="flex items-center gap-1.5">
                    <ClipboardList className="w-4 h-4" />
                    Orders
                  </span>
                </Link>
              </>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
              >
                <span className="flex items-center gap-1.5">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </span>
              </Link>
            )}

            {/* Separator */}
            <div className="w-px h-6 bg-slate-200 mx-2"></div>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 bg-slate-100 rounded-lg">
                  <p className="text-xs text-slate-500">Signed in as</p>
                  <p className="text-sm font-semibold text-slate-800 leading-tight">
                    {user.username}
                    {isAdmin && (
                      <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold bg-primary-100 text-primary-700 rounded-full uppercase">
                        Admin
                      </span>
                    )}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-100 rounded-lg transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-all shadow-sm hover:shadow"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
