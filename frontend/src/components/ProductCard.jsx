import { ShoppingCart, Package } from 'lucide-react';
import { getImageUrl } from '../utils/image';

function ProductCard({ product, onAddToCart }) {
  const inStock = product.stock > 0;

  return (
    <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300 hover:-translate-y-0.5">
      {/* Image */}
      <div className="aspect-square bg-slate-100 relative overflow-hidden">
        {product.image_url ? (
          <img
            src={getImageUrl(product.image_url)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-slate-300" />
          </div>
        )}
        {/* Category badge */}
        {product.category && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-medium bg-white/90 backdrop-blur-sm text-slate-600 rounded-full border border-slate-200/60">
            {product.category}
          </span>
        )}
        {/* Out of stock overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
            <span className="px-3 py-1.5 bg-slate-900/80 text-white text-xs font-semibold rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 text-sm leading-tight mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-xs text-slate-500 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-lg font-bold text-slate-900">
              ${product.price.toFixed(2)}
            </span>
            {inStock && (
              <p className="text-xs text-slate-400 mt-0.5">
                {product.stock} in stock
              </p>
            )}
          </div>

          {onAddToCart && (
            <button
              onClick={() => onAddToCart(product)}
              disabled={!inStock}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                inStock
                  ? 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-md active:scale-95'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
