import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Review, PropFirm } from '@/lib/types';
import ReviewCard from '@/components/reviews/ReviewCard';
import ReviewForm from '@/components/reviews/ReviewForm';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle } from 'lucide-react';

interface FirmReviewsProps {
  firmId: number;
}

const FirmReviews = ({ firmId }: FirmReviewsProps) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const { data: firm } = useQuery<PropFirm>({
    queryKey: [`/api/firms/${firmId}`],
  });
  
  const { 
    data: reviews, 
    isLoading, 
    error,
    refetch
  } = useQuery<Review[]>({
    queryKey: [`/api/firms/${firmId}/reviews`],
  });

  const handleReviewSubmitted = () => {
    refetch();
    setShowReviewForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-neutral-900">Trader Reviews for {firm?.name}</h3>
        <Button 
          onClick={() => setShowReviewForm(!showReviewForm)}
          variant={showReviewForm ? "outline" : "default"}
          className="flex items-center gap-1"
        >
          {showReviewForm ? 'Cancel' : (
            <>
              <PlusCircle className="h-4 w-4 mr-1" />
              Write a Review
            </>
          )}
        </Button>
      </div>

      {showReviewForm && (
        <div className="mb-8">
          <ReviewForm firmId={firmId} onReviewSubmitted={handleReviewSubmitted} />
        </div>
      )}

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-neutral-50 rounded-lg shadow-sm p-6 border border-neutral-100">
              <div className="flex items-center mb-4">
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-24 w-full mb-6" />
              <div className="flex items-center mt-auto">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="ml-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40 mt-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-800">
          Error loading reviews. Please try again later.
        </div>
      ) : reviews && reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="bg-neutral-50 p-8 rounded-lg text-center">
          <p className="text-neutral-600">No reviews yet for {firm?.name}.</p>
          <p className="text-neutral-500 mt-2">Be the first to share your experience!</p>
        </div>
      )}
    </div>
  );
};

export default FirmReviews;
