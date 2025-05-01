import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { PropFirm } from '@/lib/types';
import FirmCard from '@/components/firms/FirmCard';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, SlidersHorizontal } from 'lucide-react';

const PropFirms = () => {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [assetFilter, setAssetFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Get search param from URL if any
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const search = params.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, [location]);
  
  const { data: firms, isLoading } = useQuery<PropFirm[]>({
    queryKey: ['/api/firms'],
  });
  
  // Filter and sort firms
  const filteredFirms = firms?.filter(firm => {
    const matchesSearch = firm.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      firm.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesAsset = assetFilter === 'all' || 
      (firm.tradableAssets && firm.tradableAssets.includes(assetFilter));
      
    return matchesSearch && matchesAsset;
  }) || [];
  
  // Sort firms based on selected option
  const sortedFirms = [...filteredFirms].sort((a, b) => {
    switch(sortBy) {
      case 'profit_high':
        return (b.profitSplit || 0) - (a.profitSplit || 0);
      case 'profit_low':
        return (a.profitSplit || 0) - (b.profitSplit || 0);
      case 'fee_low':
        return (a.challengeFeeMin || 0) - (b.challengeFeeMin || 0);
      case 'fee_high':
        return (b.challengeFeeMin || 0) - (a.challengeFeeMin || 0);
      case 'rating_high':
        return (b.avgRating || 0) - (a.avgRating || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="lg:text-center mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
          Prop Trading Firms Directory
        </h1>
        <p className="mt-4 max-w-2xl text-xl text-neutral-500 lg:mx-auto">
          Browse and compare the top proprietary trading firms in the industry.
        </p>
      </div>
      
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search firms by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="sm:w-auto flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>
        
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Sort By
              </label>
              <Select
                value={sortBy}
                onValueChange={setSortBy}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="profit_high">Highest Profit Split</SelectItem>
                  <SelectItem value="profit_low">Lowest Profit Split</SelectItem>
                  <SelectItem value="fee_low">Lowest Fees</SelectItem>
                  <SelectItem value="fee_high">Highest Fees</SelectItem>
                  <SelectItem value="rating_high">Highest Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Asset Class
              </label>
              <Select
                value={assetFilter}
                onValueChange={setAssetFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by asset..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assets</SelectItem>
                  <SelectItem value="Forex">Forex</SelectItem>
                  <SelectItem value="Futures">Futures</SelectItem>
                  <SelectItem value="Cryptos">Crypto</SelectItem>
                  <SelectItem value="Stocks">Stocks</SelectItem>
                  <SelectItem value="Indices">Indices</SelectItem>
                  <SelectItem value="Commodities">Commodities</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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
      ) : sortedFirms.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {sortedFirms.map((firm) => (
            <FirmCard key={firm.id} firm={firm} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No firms found</h3>
          <p className="text-neutral-500">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default PropFirms;
