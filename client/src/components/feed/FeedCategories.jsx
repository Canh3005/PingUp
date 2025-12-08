import React, { useState } from 'react';
import { Star, Heart, Award, ChevronRight } from 'lucide-react';

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

const FeedCategories = () => {
  const [activeCategory, setActiveCategory] = useState('for-you');

  return (
    <div className="sticky top-[122px] z-20 bg-white border-b border-gray-200">
      <div className="w-full px-6">
        <div className="flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`relative overflow-hidden flex items-center gap-2 px-7 py-3 rounded-lg whitespace-nowrap transition-colors cursor-pointer text-white ${
                  isActive
                    ? ''
                    : 'hover:brightness-110'
                }`}
                style={
                  category.bgImage
                    ? isActive
                      ? {
                          backgroundImage: `linear-gradient(rgba(15, 79, 226, 0.7), rgba(13, 73, 211, 0.7)), url(${category.bgImage})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }
                      : {
                          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${category.bgImage})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }
                    : {}
                }
              >
                {Icon && <Icon className="w-4 h-4 relative z-10" />}
                <span className="text-sm font-medium relative z-10">{category.label}</span>
              </button>
            );
          })}
          <button className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
            <ChevronRight className="w-4 h-4" />
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedCategories;
