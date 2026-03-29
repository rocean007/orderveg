'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Truck, Shield, Heart } from 'lucide-react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/Skeleton';
import Button from '@/components/Button';
import AuthModal from '@/components/AuthModal';
import CartSidebar from '@/components/CartSidebar';
import type { VegetableWithDetails } from '@/types';

export default function HomePage() {
  const [vegetables, setVegetables] = useState<VegetableWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVegetables();
  }, []);

  const fetchVegetables = async () => {
    try {
      const response = await fetch('/api/vegetables?featured=true&limit=8');
      const data = await response.json();
      
      if (data.success) {
        setVegetables(data.data.items);
      } else {
        setError(data.error || 'Failed to load vegetables');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark">
      <Header />
      <AuthModal />
      <CartSidebar />

      <main>
        {/* Hero Section */}
        <section className="pt-24 md:pt-32 pb-12 md:pb-20 bg-gradient-to-br from-primary-50 to-white dark:from-slate-900 dark:to-slate-800">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
                  Fresh Vegetables
                  <span className="text-primary-500 dark:text-primary-400"> Delivered </span>
                  to Your Door
                </h1>
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl">
                  Organic, locally-sourced vegetables delivered fresh daily. Support local farmers
                  while enjoying the best produce nature has to offer.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="primary" size="lg">
                    Shop Now
                  </Button>
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative aspect-square max-w-lg mx-auto"
              >
                <div className="absolute inset-0 bg-primary-200 dark:bg-primary-900/20 rounded-full blur-3xl opacity-50" />
                <img
                  src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800"
                  alt="Fresh vegetables basket"
                  className="relative z-10 w-full h-full object-cover rounded-2xl shadow-2xl"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-16 border-y border-slate-200 dark:border-slate-700">
          <div className="container-custom">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<Leaf className="w-8 h-8" />}
                title="100% Organic"
                description="All our vegetables are certified organic and pesticide-free"
              />
              <FeatureCard
                icon={<Truck className="w-8 h-8" />}
                title="Fast Delivery"
                description="Same-day delivery available for orders placed before noon"
              />
              <FeatureCard
                icon={<Shield className="w-8 h-8" />}
                title="Quality Guaranteed"
                description="Fresh produce or your money back, no questions asked"
              />
              <FeatureCard
                icon={<Heart className="w-8 h-8" />}
                title="Support Local"
                description="Every purchase supports local farmers and communities"
              />
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-12 md:py-20">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Featured Vegetables
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Handpicked selection of the freshest seasonal produce
              </p>
            </div>

            {isLoading ? (
              <ProductGridSkeleton count={8} />
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
                <Button onClick={fetchVegetables}>Try Again</Button>
              </div>
            ) : vegetables.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-600 dark:text-slate-400">No vegetables available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {vegetables.map((vegetable, index) => (
                  <motion.div
                    key={vegetable.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <ProductCard vegetable={vegetable} />
                  </motion.div>
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                View All Products
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container-custom">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Leaf className="w-6 h-6 text-primary-400" />
              <span className="text-xl font-bold">Fresh Veggies</span>
            </div>
            <p className="text-slate-400 mb-4">
              Fresh, organic vegetables delivered to your door
            </p>
            <p className="text-sm text-slate-500">
              © 2024 Fresh Veggies. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="text-center space-y-4 p-6"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400">{description}</p>
    </motion.div>
  );
}
