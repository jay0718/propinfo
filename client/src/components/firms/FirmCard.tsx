import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import StarRating from '@/components/ui/StarRating';
import { PropFirm } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

interface FirmCardProps {
  firm: PropFirm;
}

const FirmCard = ({ firm }: FirmCardProps) => {
  const { id, name, profitSplit, challengeFeeMin, challengeFeeMax, payoutTime, avgRating } = firm;
  
  // Fetch firm reviews to get count
  const { data: reviews } = useQuery({
    queryKey: [`/api/firms/${id}/reviews`],
    enabled: !!id,
  });

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg border border-neutral-200 hover:shadow-md transition-shadow duration-300">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-neutral-900">{name}</h3>
          <div className="flex items-center">
            <StarRating rating={avgRating || 0} />
            <span className="ml-1 text-sm text-neutral-500">{avgRating?.toFixed(1) || 'N/A'}</span>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between py-2 border-b border-neutral-100">
            <span className="text-sm text-neutral-500">Profit Split</span>
            <span className="font-medium">{profitSplit}%</span>
          </div>
          <div className="flex justify-between py-2 border-b border-neutral-100">
            <span className="text-sm text-neutral-500">Challenge Fee</span>
            <span className="font-medium">${challengeFeeMin} - ${challengeFeeMax}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-sm text-neutral-500">Time to Payout</span>
            <span className="font-medium">{payoutTime} days</span>
          </div>
        </div>
        <div className="mt-6">
          <Link href={`/firms/${id}`}>
            <Button variant="default" className="block text-center w-full">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FirmCard;
