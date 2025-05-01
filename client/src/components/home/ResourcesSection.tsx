import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ResourceCard from '@/components/resources/ResourceCard';
import { Resource } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const ResourcesSection = () => {
  const { data: resources, isLoading, error } = useQuery<Resource[]>({
    queryKey: ['/api/resources'],
  });

  // Show only 3 resources
  const featuredResources = resources?.slice(0, 3);

  return (
    <div className="py-12 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-10">
          <h2 className="text-base text-primary-500 font-semibold tracking-wide uppercase">Educational Resources</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            Trading Guides & Insights
          </p>
          <p className="mt-4 max-w-2xl text-xl text-neutral-500 lg:mx-auto">
            Learn everything you need to know about prop trading and improve your trading skills.
          </p>
        </div>

        {isLoading ? (
          <div className="mt-10 grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white">
                <div className="flex-shrink-0">
                  <Skeleton className="h-48 w-full" />
                </div>
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-6 w-full mb-3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full mt-1" />
                    <Skeleton className="h-4 w-2/3 mt-1" />
                  </div>
                  <div className="mt-6 flex items-center">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="ml-3">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32 mt-1" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">Error loading resources. Please try again later.</p>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
            {featuredResources?.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/resources">
            <Button variant="outline" className="inline-flex items-center px-6 py-3 text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              View All Resources
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResourcesSection;
