import React from 'react';

// Category data with descriptions
const categoryInfo = {
  'for-you': {
    title: 'For You',
    description: 'Personalized recommendations based on your interests and activity. Discover projects tailored just for you.',
    bgImage: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=1200&h=300&fit=crop'
  },
  'following': {
    title: 'Following',
    description: 'Latest projects from creators you follow. Stay updated with your favorite artists and designers.',
    bgImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=300&fit=crop'
  },
  'best': {
    title: 'Best of Pingup',
    description: 'The most popular and trending projects on Pingup. Curated by our community and editors.',
    bgImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=300&fit=crop'
  },
  'graphic-design': {
    title: 'Graphic Design',
    description: 'The best graphic design work, including poster, logo, branding, music packaging and more. Featuring standout projects hand-picked by our curation team.',
    bgImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&h=300&fit=crop'
  },
  'photography': {
    title: 'Photography',
    description: 'Stunning photography from around the world. Explore landscapes, portraits, street photography and more.',
    bgImage: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&h=300&fit=crop'
  },
  'web-design': {
    title: 'Web Design',
    description: 'Modern web design projects showcasing innovative UI/UX, responsive layouts, and creative digital experiences.',
    bgImage: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=1200&h=300&fit=crop'
  },
  'music': {
    title: 'Music',
    description: 'Music production, album artwork, sound design and audio-visual projects from talented creators.',
    bgImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&h=300&fit=crop'
  },
  'illustration': {
    title: 'Illustration',
    description: 'Creative illustrations, digital art, character design and visual storytelling from talented artists.',
    bgImage: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1200&h=300&fit=crop'
  },
  '3d-art': {
    title: '3D Art',
    description: '3D modeling, rendering, animation and immersive digital sculptures from creative professionals.',
    bgImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=300&fit=crop'
  },
  'ui-ux': {
    title: 'UI/UX',
    description: 'User interface and experience design projects showcasing intuitive interactions and beautiful interfaces.',
    bgImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=300&fit=crop'
  },
  'motion': {
    title: 'Motion',
    description: 'Motion graphics, animation, video editing and dynamic visual content from motion designers.',
    bgImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&h=300&fit=crop'
  },
  'architecture': {
    title: 'Architecture',
    description: 'Architectural design, visualization, interior design and spatial planning projects.',
    bgImage: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&h=300&fit=crop'
  },
  'product-design': {
    title: 'Product Design',
    description: 'Industrial design, product development and innovative physical products from designers worldwide.',
    bgImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=300&fit=crop'
  },
  'fashion': {
    title: 'Fashion',
    description: 'Fashion design, styling, textile design and wearable art from creative fashion professionals.',
    bgImage: 'https://images.unsplash.com/photo-1558769132-cb1aea1f5e85?w=1200&h=300&fit=crop'
  },
  'advertising': {
    title: 'Advertising',
    description: 'Creative advertising campaigns, marketing materials and brand communications.',
    bgImage: 'https://images.unsplash.com/photo-1557838923-2985c318be48?w=1200&h=300&fit=crop'
  }
};

const CategoryBanner = ({ category }) => {
  // Don't show banner for default categories
  if (!category || category === 'for-you' || category === 'following') {
    return null;
  }

  const info = categoryInfo[category];
  
  if (!info) {
    return null;
  }

  return (
    <div className="w-full px-6 mb-6">
      <div 
        className="relative h-[320px] rounded-2xl overflow-hidden shadow-lg group"
        style={{
          backgroundImage: `url(${info.bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
        
        {/* Content */}
        <div className="relative h-full flex flex-col justify-center px-12 max-w-2xl">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            {info.title}
          </h1>
          <p className="text-lg text-white/90 leading-relaxed mb-6">
            {info.description}
          </p>
          {category !== 'best' && (
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all w-fit shadow-lg shadow-blue-600/30">
              Follow {info.title}
            </button>
          )}
        </div>

        {/* Decorative element */}
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-blue-600/20 to-transparent rounded-tl-full transform translate-x-32 translate-y-32"></div>
      </div>
    </div>
  );
};

export default CategoryBanner;
