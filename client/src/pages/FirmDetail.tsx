import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { PropFirm } from '@/lib/types';
import FirmDetailComponent from '@/components/firms/FirmDetail';
import { Skeleton } from '@/components/ui/skeleton';

const FirmDetail = () => {
  const { id } = useParams();
  const firmId = parseInt(id);
  
  const { data: firm, isLoading, error } = useQuery<PropFirm>({
    queryKey: [`/api/firms/${firmId}`],
    enabled: !isNaN(firmId),
  });

  if (isNaN(firmId)) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Invalid Firm ID</h1>
        <p className="mt-2 text-neutral-600">The firm ID provided is not valid.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="px-4 py-5 sm:px-6">
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !firm) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Firm Not Found</h1>
        <p className="mt-2 text-neutral-600">
          We couldn't find the prop trading firm you're looking for.
        </p>
      </div>
    );
  }

  return <FirmDetailComponent firm={firm} />;
};

export default FirmDetail;
