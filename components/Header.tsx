'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Menu, X, Search, Leaf } from 'lucide-react';
import { useAuthStore, useCartStore, useUIStore } from '@/lib/store';
import Button from './Button';

// UI/UX Pro Max compliance:
// - touch-target-size: all interactive elements >= 44px
// - safe-area-awareness: respects safe areas on mobile
// - z-index-management: proper stacking with defined z-indices
// - animation: smooth slide-in/fade animations

export default function Header() {
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const { items, getItemCount } = useCartStore();
  const { isMobileMenuOpen, toggleMobileMenu, setCartOpen, setAuthModalOpen } = useUIStore();
  const [scrolled, setScrolled] = useState(false);

  const itemCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    clearAuth();
    if (isMobileMenuOpen) toggleMobileMenu();
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 safe-top transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-md'
            : 'bg-white dark:bg-slate-900'
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 focus-ring rounded-lg">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="bg-primary-500 dark:bg-primary-600 p-2 rounded-lg"
              >
                <Leaf className="w-6 h-6 text-white" aria-hidden="true" />
              </motion.div>
              <span className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                Fresh Veggies
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6" aria-label="Main navigation">
              <Link href="/" className="link text-base">
                Home
              </Link>
              <Link href="/shop" className="link text-base">
                Shop
              </Link>
              <Link href="/about" className="link text-base">
                About
              </Link>
              {isAuthenticated && user?.role === 'admin' && (
                <Link href="/admin" className="link text-base">
                  Admin
                </Link>
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Search - Desktop */}
              <button
                className="hidden md:flex touch-target items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-ring"
                aria-label="Search vegetables"
              >
                <Search className="w-5 h-5" aria-hidden="true" />
              </button>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative touch-target flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-ring"
                aria-label={`Shopping cart with ${itemCount} items`}
              >
                <ShoppingCart className="w-5 h-5" aria-hidden="true" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {itemCount > 99 ? '99+' : itemCount}
                  </motion.span>
                )}
              </button>

              {/* User Menu - Desktop */}
              <div className="hidden md:block">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-2">
                    <Link href="/profile" className="link text-base">
                      {user?.name || 'Profile'}
                    </Link>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setAuthModalOpen(true, 'login')}
                  >
                    Sign In
                  </Button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden touch-target flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-ring"
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" aria-hidden="true" />
                ) : (
                  <Menu className="w-6 h-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={toggleMobileMenu}
              aria-hidden="true"
            />

            {/* Menu Content */}
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-slate-900 z-50 shadow-xl safe-top safe-bottom overflow-y-auto"
              aria-label="Mobile navigation"
            >
              <div className="p-6 space-y-6">
                {/* Close Button */}
                <div className="flex justify-end">
                  <button
                    onClick={toggleMobileMenu}
                    className="touch-target w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 focus-ring"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" aria-hidden="true" />
                  </button>
                </div>

                {/* User Section */}
                {isAuthenticated ? (
                  <div className="pb-6 border-b border-slate-200 dark:border-slate-700">
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {user?.name}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{user?.email}</p>
                  </div>
                ) : (
                  <div className="pb-6 border-b border-slate-200 dark:border-slate-700">
                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={() => {
                        setAuthModalOpen(true, 'login');
                        toggleMobileMenu();
                      }}
                    >
                      Sign In
                    </Button>
                  </div>
                )}

                {/* Navigation Links */}
                <div className="space-y-2">
                  <MobileNavLink href="/" onClick={toggleMobileMenu}>
                    Home
                  </MobileNavLink>
                  <MobileNavLink href="/shop" onClick={toggleMobileMenu}>
                    Shop
                  </MobileNavLink>
                  <MobileNavLink href="/about" onClick={toggleMobileMenu}>
                    About
                  </MobileNavLink>
                  {isAuthenticated && (
                    <>
                      <MobileNavLink href="/profile" onClick={toggleMobileMenu}>
                        Profile
                      </MobileNavLink>
                      <MobileNavLink href="/orders" onClick={toggleMobileMenu}>
                        My Orders
                      </MobileNavLink>
                      {user?.role === 'admin' && (
                        <MobileNavLink href="/admin" onClick={toggleMobileMenu}>
                          Admin Panel
                        </MobileNavLink>
                      )}
                    </>
                  )}
                </div>

                {/* Logout */}
                {isAuthenticated && (
                  <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                    <Button variant="outline" className="w-full" onClick={handleLogout}>
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function MobileNavLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block touch-target px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-base font-medium text-slate-900 dark:text-white transition-colors focus-ring"
    >
      {children}
    </Link>
  );
}
