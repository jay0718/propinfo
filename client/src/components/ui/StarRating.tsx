import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  editable?: boolean;
  hoveredRating?: number;
  onChange?: (rating: number) => void;
  onHoverChange?: (rating: number) => void;
}

const StarRating = ({ 
  rating, 
  size = 'md', 
  editable = false,
  hoveredRating = 0,
  onChange,
  onHoverChange
}: StarRatingProps) => {
  const totalStars = 5;
  
  // Determine size of stars
  const getStarSize = () => {
    switch (size) {
      case 'sm': return 'h-3 w-3';
      case 'lg': return 'h-5 w-5';
      default: return 'h-4 w-4';
    }
  };
  
  const handleClick = (index: number) => {
    if (editable && onChange) {
      onChange(index + 1);
    }
  };
  
  const handleMouseEnter = (index: number) => {
    if (editable && onHoverChange) {
      onHoverChange(index + 1);
    }
  };
  
  const handleMouseLeave = () => {
    if (editable && onHoverChange) {
      onHoverChange(0);
    }
  };
  
  const starSize = getStarSize();
  const displayRating = hoveredRating > 0 ? hoveredRating : rating;
  
  return (
    <div 
      className="flex items-center" 
      onMouseLeave={handleMouseLeave}
    >
      {[...Array(totalStars)].map((_, index) => {
        const filled = index < displayRating;
        return (
          <Star
            key={index}
            className={`${starSize} ${
              filled ? 'text-yellow-400 fill-yellow-400' : 'text-yellow-400 fill-transparent'
            } ${editable ? 'cursor-pointer' : ''}`}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
