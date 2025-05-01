import { useQuery } from '@tanstack/react-query';
import StarRating from '@/components/ui/StarRating';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Review, PropFirm } from '@/lib/types';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const { firmId, username, rating, title, content, tradingExperience, createdAt } = review;
  
  const { data: firm, isLoading: isFirmLoading } = useQuery<PropFirm>({
    queryKey: [`/api/firms/${firmId}`],
    enabled: !!firmId,
  });
  
  const formattedDate = createdAt ? format(new Date(createdAt), 'MMM d, yyyy') : '';

  return (
    <div className="bg-neutral-50 rounded-lg shadow-sm p-6 border border-neutral-100">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <StarRating rating={rating} />
          <span className="ml-2 text-sm font-medium text-neutral-500">{rating.toFixed(1)}</span>
        </div>
        {isFirmLoading ? (
          <Skeleton className="h-5 w-24" />
        ) : (
          <span className="text-sm text-primary-600 font-medium">{firm?.name}</span>
        )}
      </div>
      
      <h3 className="text-lg font-medium text-neutral-900 mb-2">{title}</h3>
      <p className="text-base text-neutral-600 mb-6">{content}</p>
      
      <div className="flex items-center mt-auto justify-between">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-neutral-300 flex items-center justify-center text-neutral-700 font-bold">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-neutral-900">{username}</h4>
            <p className="text-sm text-neutral-500">{tradingExperience}</p>
          </div>
        </div>
        <span className="text-xs text-neutral-400">{formattedDate}</span>
      </div>
    </div>
  );
};

export default ReviewCard;
