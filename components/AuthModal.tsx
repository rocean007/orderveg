'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAuthStore, useUIStore } from '@/lib/store';
import { toast } from 'react-hot-toast';
import Button from './Button';

export default function AuthModal() {
  const { isAuthModalOpen, authModalMode, setAuthModalOpen } = useUIStore();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
  });

  const isLogin = authModalMode === 'login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setAuth(data.data.token, data.data.user);
        toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
        setAuthModalOpen(false);
        setFormData({ email: '', password: '', name: '', phone: '' });
      } else {
        toast.error(data.error || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-modal"
            onClick={() => setAuthModalOpen(false)}
          />

          <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="card w-full max-w-md p-6 md:p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setAuthModalOpen(false)}
                className="absolute top-4 right-4 touch-target w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 focus-ring"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  {isLogin
                    ? 'Sign in to your account to continue'
                    : 'Join us to start ordering fresh vegetables'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label htmlFor="name" className="label">
                      Full Name <span className="text-error-light">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      required={!isLogin}
                      className="input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="label">
                    Email <span className="text-error-light">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    className="input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="label">
                    Password <span className="text-error-light">*</span>
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    className="input"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                  />
                  {!isLogin && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Min. 8 characters with uppercase, lowercase, and number
                    </p>
                  )}
                </div>

                {!isLogin && (
                  <div>
                    <label htmlFor="phone" className="label">
                      Phone (Optional)
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      className="input"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={isLoading}
                >
                  {isLogin ? 'Sign In' : 'Create Account'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setAuthModalOpen(true, isLogin ? 'register' : 'login')}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:underline focus-ring rounded"
                >
                  {isLogin
                    ? "Don't have an account? Sign up"
                    : 'Already have an account? Sign in'}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
