'use client';

import { motion } from 'framer-motion';
import type { WidgetConfig } from '@/types';

interface WidgetPreviewProps {
  config: WidgetConfig;
}

// Mock product data
const mockProducts = [
  { id: 1, name: 'Premium Leather Jacket', price: '$299.00', image: '🧥', rating: 4.8 },
  { id: 2, name: 'Vintage Denim Jeans', price: '$89.00', image: '👖', rating: 4.5 },
  { id: 3, name: 'Cotton Blend Shirt', price: '$65.00', image: '👔', rating: 4.7 },
  { id: 4, name: 'Wool Blend Sweater', price: '$125.00', image: '🧶', rating: 4.9 },
  { id: 5, name: 'Canvas Sneakers', price: '$79.00', image: '👟', rating: 4.6 },
];

export function WidgetPreview({ config }: WidgetPreviewProps) {
  const products = mockProducts.slice(0, config.itemsToShow);

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: config.backgroundColor,
        padding: `${config.padding}px`,
        borderRadius: `${config.borderRadius}px`,
      }}
    >
      {/* Header */}
      <div className="mb-6">
        <h3
          className="text-2xl font-bold mb-1"
          style={{ color: config.textColor }}
        >
          {config.title || 'Widget Title'}
        </h3>
        {config.subtitle && (
          <p
            className="text-sm opacity-70"
            style={{ color: config.textColor }}
          >
            {config.subtitle}
          </p>
        )}
      </div>
      
      {/* Products Grid/Slider */}
      <div className="relative">
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${Math.min(config.itemsToShow, 4)}, 1fr)`,
          }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              {config.cardStyle === 'minimal' && (
                <div
                  className="rounded-xl overflow-hidden border transition-all duration-200 group-hover:shadow-lg"
                  style={{
                    borderColor: `${config.textColor}15`,
                    borderRadius: `${config.borderRadius * 0.6}px`,
                  }}
                >
                  <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-5xl">
                    {product.image}
                  </div>
                  <div className="p-3" style={{ backgroundColor: config.backgroundColor }}>
                    <h4
                      className="text-sm font-medium truncate"
                      style={{ color: config.textColor }}
                    >
                      {product.name}
                    </h4>
                    <p
                      className="text-sm font-bold mt-1"
                      style={{ color: config.accentColor }}
                    >
                      {product.price}
                    </p>
                  </div>
                </div>
              )}
              
              {config.cardStyle === 'detailed' && (
                <div
                  className="rounded-xl overflow-hidden border transition-all duration-200 group-hover:shadow-lg"
                  style={{
                    borderColor: `${config.textColor}15`,
                    borderRadius: `${config.borderRadius * 0.6}px`,
                  }}
                >
                  <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-5xl relative">
                    {product.image}
                    <div
                      className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: config.accentColor }}
                    >
                      ★ {product.rating}
                    </div>
                  </div>
                  <div className="p-4" style={{ backgroundColor: config.backgroundColor }}>
                    <h4
                      className="text-sm font-medium truncate"
                      style={{ color: config.textColor }}
                    >
                      {product.name}
                    </h4>
                    <div className="flex items-center justify-between mt-2">
                      <p
                        className="text-lg font-bold"
                        style={{ color: config.accentColor }}
                      >
                        {product.price}
                      </p>
                      <button
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: config.accentColor }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {config.cardStyle === 'overlay' && (
                <div
                  className="aspect-square rounded-xl overflow-hidden relative group cursor-pointer"
                  style={{ borderRadius: `${config.borderRadius * 0.6}px` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-6xl">
                    {product.image}
                  </div>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(to top, ${config.accentColor}ee, ${config.accentColor}00)`,
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <h4 className="text-sm font-medium truncate">{product.name}</h4>
                    <p className="text-lg font-bold">{product.price}</p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        {/* Navigation Arrows */}
        {config.showArrows && (
          <>
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-700 hover:scale-110 transition-transform"
              style={{ borderColor: `${config.textColor}15` }}
            >
              ‹
            </button>
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-700 hover:scale-110 transition-transform"
              style={{ borderColor: `${config.textColor}15` }}
            >
              ›
            </button>
          </>
        )}
      </div>
      
      {/* Dots */}
      {config.showDots && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {[1, 2, 3].map((dot) => (
            <div
              key={dot}
              className={`w-2 h-2 rounded-full transition-all ${
                dot === 1 ? 'w-6' : ''
              }`}
              style={{
                backgroundColor: dot === 1 ? config.accentColor : `${config.textColor}30`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

