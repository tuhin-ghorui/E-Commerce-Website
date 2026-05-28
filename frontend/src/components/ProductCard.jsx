import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { _id, name, price, category, image, rating = 4.5, stock } = product;

  // Rating Stars Renderer
  const renderStars = (ratingVal) => {
    const stars = [];
    const floor = Math.floor(ratingVal);
    for (let i = 1; i <= 5; i++) {
      if (i <= floor) {
        stars.push(<Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />);
      } else if (i - 0.5 <= ratingVal) {
        // Half star simulation using fill on parts or just light color
        stars.push(<Star key={i} className="w-3.5 h-3.5 fill-amber-400/50 text-amber-400" />);
      } else {
        stars.push(<Star key={i} className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />);
      }
    }
    return stars;
  };

  const isOutOfStock = stock <= 0;

  return (
    <div className="group rounded-2xl border border-slate-200/40 dark:border-slate-800/40 bg-white/80 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900 hover:border-primary-500/30 dark:hover:border-primary-500/30 p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full relative overflow-hidden">
      {/* Category Tag & Stock Status */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-1.5 items-start">
        <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-slate-100/90 text-slate-600 dark:bg-slate-800/90 dark:text-slate-300 border border-slate-200/20">
          {category}
        </span>
        {isOutOfStock ? (
          <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-500 text-white">
            Sold Out
          </span>
        ) : stock <= 5 ? (
          <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500 text-white animate-pulse">
            Only {stock} Left
          </span>
        ) : null}
      </div>

      {/* Product Image Link */}
      <Link to={`/products/${_id}`} className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <img
          src={image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60'}
          alt={name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Link>

      {/* Details info */}
      <div className="flex flex-col flex-grow mt-4">
        {/* Ratings */}
        <div className="flex items-center gap-1 mb-1.5">
          <div className="flex">{renderStars(rating)}</div>
          <span className="text-xs text-slate-400 font-medium">({rating})</span>
        </div>

        {/* Title */}
        <Link to={`/products/${_id}`} className="hover:text-primary-500 transition-colors flex-grow">
          <h3 className="font-display font-bold text-slate-800 dark:text-slate-100 line-clamp-2 text-base">
            {name}
          </h3>
        </Link>

        {/* Price & Cart button */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 font-medium">Price</span>
            <span className="font-display font-extrabold text-lg text-slate-900 dark:text-white">
              ${price.toFixed(2)}
            </span>
          </div>

          {isOutOfStock ? (
            <button
              disabled
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
              title="Out of stock"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => addToCart(product, 1)}
              className="p-2.5 rounded-xl bg-primary-600 dark:bg-primary-500 text-white hover:bg-primary-700 dark:hover:bg-primary-600 hover:scale-105 active:scale-95 shadow-md shadow-primary-500/10 hover:shadow-primary-500/25 transition-all duration-200"
              title="Add to Cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
