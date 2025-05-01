import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReviewCard from '@/components/reviews/ReviewCard';
import { Review } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const Testimonials = () => {
  const { data: reviews, isLoading, error } = useQuery<Review[]>({
    queryKey: ['/api/reviews'],
  });

  // Get only 3 reviews for the homepage
  const featuredReviews = reviews?.slice(0, 3);

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-10">
          <h2 className="text-base text-primary-500 font-semibold tracking-wide uppercase">Testimonials</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            Trader Reviews
          </p>
          <p className="mt-4 max-w-2xl text-xl text-neutral-500 lg:mx-auto">
            Hear what traders say about their experiences with different prop firms.
          </p>
        </div>

        {isLoading ? (
          <div className="mt-10 grid gap-8 lg:grid-cols-3 md:grid-cols-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-neutral-50 rounded-lg shadow-sm p-6 border border-neutral-100">
                <div className="flex items-center mb-4">
                  <Skeleton className="h-4 w-32" />
                </div>
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
          <div className="text-center py-10">
            <p className="text-red-500">Error loading reviews. Please try again later.</p>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-3 md:grid-cols-2">
            {featuredReviews?.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/reviews">
            <Button variant="outline" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              Read More Reviews
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
