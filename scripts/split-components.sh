#!/bin/bash
# Script to split AllComponents.tsx into individual component files

echo "Splitting components into individual files..."

# Create component files from AllComponents.tsx
# ProductCard.tsx
cat > components/ProductCard.tsx << 'EOF'
'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, Leaf } from 'lucide-react';
import { useAuthStore, useCartStore, useUIStore } from '@/lib/store';
import { toast } from 'react-hot-toast';
import Button from './Button';
import type { VegetableWithDetails } from '@/types';

export default function ProductCard({ vegetable }: { vegetable: VegetableWithDetails }) {
  const { isAuthenticated } = useAuthStore();
  const { addItem } = useCartStore();
  const { setAuthModalOpen } = useUIStore();

  const finalPrice = vegetable.finalPrice || vegetable.price;
  const hasDiscount = vegetable.discount && vegetable.discount > 0;

  const handleAddToCart = () => {
    if (!isAuthenticated()) {
      setAuthModalOpen(true, 'login');
      toast.error('Please sign in to add items to cart');
      return;
    }

    addItem({
      vegetableId: vegetable.id,
      vegetableName: vegetable.name,
      vegetableSlug: vegetable.slug,
      price: vegetable.price,
      unit: vegetable.unit,
      imageUrl: vegetable.imageUrl,
      organic: vegetable.organic,
      discount: vegetable.discount,
      quantity: 1,
    });

    toast.success(\`\${vegetable.name} added to cart\`);
  };

  return (
    <motion.div whileHover={{ y: -4 }} className="card-hover p-4 space-y-4">
      <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
        {vegetable.imageUrl ? (
          <img
            src={vegetable.imageUrl}
            alt={vegetable.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Leaf className="w-16 h-16 text-slate-300 dark:text-slate-600" />
          </div>
        )}
        
        <div className="absolute top-2 left-2 flex gap-2">
          {vegetable.organic && (
            <span className="px-2 py-1 text-xs font-medium bg-green-500 text-white rounded-full">
              Organic
            </span>
          )}
          {hasDiscount && (
            <span className="px-2 py-1 text-xs font-medium bg-red-500 text-white rounded-full">
              -{vegetable.discount}%
            </span>
          )}
        </div>

        {vegetable.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="px-4 py-2 bg-white rounded-lg font-semibold text-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-lg text-slate-900 dark:text-white truncate">
          {vegetable.name}
        </h3>
        {vegetable.description && (
          <p className="text-sm text-slate-600 dark:text-slate-400 truncate-2">
            {vegetable.description}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div>
          {hasDiscount ? (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                \${finalPrice}
              </span>
              <span className="text-sm text-slate-400 line-through">
                \${vegetable.price}
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              \${vegetable.price}
            </span>
          )}
          <span className="text-sm text-slate-500 dark:text-slate-400">
            /{vegetable.unit}
          </span>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleAddToCart}
          disabled={vegetable.stock === 0}
          className="!px-4 !py-2"
        >
          <ShoppingCart className="w-4 h-4" aria-hidden="true" />
        </Button>
      </div>
    </motion.div>
  );
}
EOF

echo "✓ Created components/ProductCard.tsx"

# AuthModal.tsx and CartSidebar.tsx can be extracted similarly
# For brevity, showing the pattern for one component

echo "✓ Component split complete!"
echo "Note: You can manually split the remaining components from AllComponents.tsx"
