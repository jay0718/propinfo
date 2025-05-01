import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Review, PropFirm } from '@/lib/types';
import ReviewCard from '@/components/reviews/ReviewCard';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';

const Reviews = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [firmFilter, setFirmFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  
  const { data: reviews, isLoading: isLoadingReviews } = useQuery<Review[]>({
    queryKey: ['/api/reviews'],
  });
  
  const { data: firms, isLoading: isLoadingFirms } = useQuery<PropFirm[]>({
    queryKey: ['/api/firms'],
  });
  
  // Filter reviews
  const filteredReviews = reviews?.filter(review => {
    const matchesSearch = 
      review.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.username.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesFirm = firmFilter === 'all' || review.firmId === parseInt(firmFilter);
    
    const matchesRating = ratingFilter === 'all' || review.rating === parseInt(ratingFilter);
      
    return matchesSearch && matchesFirm && matchesRating;
  }) || [];

  // Group reviews by firm for the "By Firm" tab
  const reviewsByFirm: Record<number, Review[]> = {};
  
  if (reviews) {
    reviews.forEach(review => {
      if (!reviewsByFirm[review.firmId]) {
        reviewsByFirm[review.firmId] = [];
      }
      reviewsByFirm[review.firmId].push(review);
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="lg:text-center mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
          Trader Reviews
        </h1>
        <p className="mt-4 max-w-2xl text-xl text-neutral-500 lg:mx-auto">
          Real feedback from traders about their experiences with prop trading firms.
        </p>
      </div>
      
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Reviews</TabsTrigger>
          <TabsTrigger value="by-firm">Reviews by Firm</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <Input
                type="text"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="sm:w-48">
              <Select
                value={firmFilter}
                onValueChange={setFirmFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by firm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Firms</SelectItem>
                  {firms?.map(firm => (
                    <SelectItem key={firm.id} value={firm.id.toString()}>
                      {firm.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:w-48">
              <Select
                value={ratingFilter}
                onValueChange={setRatingFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isLoadingReviews ? (
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
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
          ) : filteredReviews.length > 0 ? (
            <div className="space-y-6">
              {filteredReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No reviews found</h3>
              <p className="text-neutral-500">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="by-firm">
          {isLoadingFirms || isLoadingReviews ? (
            <div className="space-y-8">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-neutral-200">
                    <Skeleton className="h-6 w-48" />
                  </div>
                  <div className="p-6">
                    <Skeleton className="h-24 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : firms && firms.length > 0 ? (
            <div className="space-y-8">
              {firms.map(firm => {
                const firmReviews = reviewsByFirm[firm.id] || [];
                return (
                  <div key={firm.id} className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-neutral-200">
                      <h3 className="text-lg font-medium flex items-center justify-between">
                        <span>{firm.name}</span>
                        <span className="text-sm text-neutral-500">
                          {firmReviews.length} {firmReviews.length === 1 ? 'review' : 'reviews'}
                        </span>
                      </h3>
                    </div>
                    <div className="p-6">
                      {firmReviews.length > 0 ? (
                        <div className="space-y-6">
                          {firmReviews.map(review => (
                            <ReviewCard key={review.id} review={review} />
                          ))}
                        </div>
                      ) : (
                        <p className="text-center py-4 text-neutral-500">
                          No reviews yet for {firm.name}.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No firms found</h3>
              <p className="text-neutral-500">
                There are no prop firms to display.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reviews;
