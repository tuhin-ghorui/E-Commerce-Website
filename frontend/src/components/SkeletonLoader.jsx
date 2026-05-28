import React from 'react';

export const ProductCardSkeleton = () => {
  return (
    <div className="rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-900/50 p-4 shadow-sm relative overflow-hidden flex flex-col gap-3">
      {/* Image Skeleton */}
      <div className="relative aspect-square w-full rounded-xl bg-slate-200 dark:bg-slate-800 shimmer overflow-hidden"></div>
      
      {/* Title & Category Skeletons */}
      <div className="space-y-2 flex-grow mt-2">
        <div className="h-3 w-1/3 rounded-lg bg-slate-200 dark:bg-slate-800 shimmer overflow-hidden"></div>
        <div className="h-5 w-5/6 rounded-lg bg-slate-200 dark:bg-slate-800 shimmer overflow-hidden"></div>
      </div>
      
      {/* Price & Rating Skeletons */}
      <div className="flex items-center justify-between mt-4">
        <div className="h-6 w-1/4 rounded-lg bg-slate-200 dark:bg-slate-800 shimmer overflow-hidden"></div>
        <div className="h-8 w-1/3 rounded-xl bg-slate-200 dark:bg-slate-800 shimmer overflow-hidden"></div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

export const ProductDetailSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 animate-pulse">
      {/* Left Image Area */}
      <div className="aspect-square w-full rounded-2xl bg-slate-200 dark:bg-slate-800 shimmer overflow-hidden"></div>
      
      {/* Right Details Area */}
      <div className="flex flex-col space-y-5">
        <div className="h-4 w-20 rounded-md bg-slate-200 dark:bg-slate-800 shimmer overflow-hidden"></div>
        <div className="h-10 w-3/4 rounded-lg bg-slate-200 dark:bg-slate-800 shimmer overflow-hidden"></div>
        <div className="h-5 w-1/3 rounded-md bg-slate-200 dark:bg-slate-800 shimmer overflow-hidden"></div>
        <div className="h-8 w-1/4 rounded-lg bg-slate-200 dark:bg-slate-800 shimmer overflow-hidden"></div>
        
        <div className="border-t border-slate-200 dark:border-slate-800 my-4"></div>
        
        <div className="space-y-2">
          <div className="h-3 w-full rounded-md bg-slate-200 dark:bg-slate-800 shimmer overflow-hidden"></div>
          <div className="h-3 w-full rounded-md bg-slate-200 dark:bg-slate-800 shimmer overflow-hidden"></div>
          <div className="h-3.5 w-4/5 rounded-md bg-slate-200 dark:bg-slate-800 shimmer overflow-hidden"></div>
        </div>

        <div className="flex gap-4 pt-4">
          <div className="h-12 w-28 rounded-xl bg-slate-200 dark:bg-slate-800 shimmer overflow-hidden"></div>
          <div className="h-12 w-full rounded-xl bg-slate-200 dark:bg-slate-800 shimmer overflow-hidden"></div>
        </div>
      </div>
    </div>
  );
};
