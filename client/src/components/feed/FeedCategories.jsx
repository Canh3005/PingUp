import React, { useState, useRef, useEffect } from 'react';
import { Star, Heart, Award, ChevronRight, ChevronLeft } from 'lucide-react';

const categories = [
  { 
    id: 'for-you', 
    label: 'For You', 
    icon: Star, 
    active: true,
    bgImage: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=300&h=100&fit=crop'
  },
  { 
    id: 'following', 
    label: 'Following', 
    icon: Heart,
    bgImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=100&fit=crop'
  },
  { 
    id: 'best', 
    label: 'Best of Pingup', 
    icon: Award,
    bgImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=100&fit=crop'
  },
  { 
    id: 'graphic-design', 
    label: 'Graphic Design',
    bgImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=300&h=100&fit=crop'
  },
  { 
    id: 'photography', 
    label: 'Photography',
    bgImage: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=300&h=100&fit=crop'
  },
  { 
    id: 'illustration', 
    label: 'Illustration',
    bgImage: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=300&h=100&fit=crop'
  },
  { 
    id: '3d-art', 
    label: '3D Art',
    bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=100&fit=crop'
  },
  { 
    id: 'ui-ux', 
    label: 'UI/UX',
    bgImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=100&fit=crop'
  },
  { 
    id: 'motion', 
    label: 'Motion',
    bgImage: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=300&h=100&fit=crop'
  },
  { 
    id: 'architecture', 
    label: 'Architecture',
    bgImage: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=300&h=100&fit=crop'
  },
  { 
    id: 'product-design', 
    label: 'Product Design',
    bgImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=100&fit=crop'
  },
  { 
    id: 'fashion', 
    label: 'Fashion',
    bgImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&h=100&fit=crop'
  },
  { 
    id: 'advertising', 
    label: 'Advertising',
    bgImage: 'https://images.unsplash.com/photo-1557838923-2985c318be48?w=300&h=100&fit=crop'
  },
];

const FeedCategories = ({ selectedCategory, onCategoryChange }) => {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  useEffect(() => {
    checkScrollPosition();
    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, []);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScrollPosition, 300);
    }
  };

  return (
    <div className="sticky top-[141px] z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="w-full px-6 relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
        )}

        {/* Categories Container */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollPosition}
          className="overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex items-center gap-3 py-4 px-1">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={`relative overflow-hidden flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl whitespace-nowrap transition-all duration-300 min-w-[140px] ${
                    isActive
                      ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg scale-105'
                      : 'hover:scale-105 hover:shadow-md'
                  }`}
                  style={{
                    backgroundImage: isActive
                      ? `linear-gradient(135deg, rgba(59, 130, 246, 0.85), rgba(99, 102, 241, 0.85)), url(${category.bgImage})`
                      : `linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url(${category.bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {Icon && <Icon className="w-4 h-4 text-white relative z-10" />}
                  <span className="text-sm font-medium text-white relative z-10">{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-all"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        )}
      </div>
    </div>
  );
};

export default FeedCategories;
