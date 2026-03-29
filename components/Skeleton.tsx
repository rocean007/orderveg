'use client';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
}

// UI/UX Pro Max compliance:
// - loading-states: show skeleton when loading exceeds 300ms
// - animation: smooth skeleton shimmer effect

export default function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
}: SkeletonProps) {
  const baseStyles = 'skeleton';
  
  const variants = {
    text: 'h-4',
    circular: 'rounded-full',
    rectangular: '',
  };

  const style = {
    width: width || undefined,
    height: height || undefined,
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={style}
      aria-live="polite"
      aria-busy="true"
    />
  );
}

// Preset skeleton components for common use cases
export function ProductCardSkeleton() {
  return (
    <div className="card p-4 space-y-4">
      <Skeleton variant="rectangular" className="w-full aspect-square rounded-lg" />
      <div className="space-y-2">
        <Skeleton variant="text" className="w-3/4" />
        <Skeleton variant="text" className="w-1/2" />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton variant="text" className="w-1/4 h-6" />
        <Skeleton variant="rectangular" className="w-24 h-10 rounded-lg" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
