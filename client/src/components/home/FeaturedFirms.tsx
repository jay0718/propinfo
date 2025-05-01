import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FirmCard from '@/components/firms/FirmCard';
import { PropFirm } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const FeaturedFirms = () => {
  const { data: firms, isLoading, error } = useQuery<PropFirm[]>({
    queryKey: ['/api/firms/featured'],
  });

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-10">
          <h2 className="text-base text-primary-500 font-semibold tracking-wide uppercase">Featured Prop Firms</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            Top-Rated Trading Firms
          </p>
          <p className="mt-4 max-w-2xl text-xl text-neutral-500 lg:mx-auto">
            Compare the best proprietary trading firms with competitive profit splits, low fees, and favorable trading conditions.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white overflow-hidden shadow rounded-lg border border-neutral-200 p-5">
                <Skeleton className="h-6 w-1/3 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <Skeleton className="h-10 w-full mt-6" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">Error loading featured firms. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-10">
            {firms?.map((firm) => (
              <FirmCard key={firm.id} firm={firm} />
            ))}
          </div>
        )}
        
        <div className="mt-12 text-center">
          <Link href="/firms">
            <Button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              View All Prop Firms
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedFirms;
