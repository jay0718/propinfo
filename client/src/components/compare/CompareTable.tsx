import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PropFirm } from '@/lib/types';
import { X } from 'lucide-react';

const CompareTable = () => {
  const [selectedFirms, setSelectedFirms] = useState<number[]>([]);
  const [maxCompare, setMaxCompare] = useState(3);
  
  const { data: firms, isLoading } = useQuery<PropFirm[]>({
    queryKey: ['/api/firms'],
  });
  
  // Update max firms to compare based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setMaxCompare(5);
      } else if (window.innerWidth >= 768) {
        setMaxCompare(3);
      } else {
        setMaxCompare(2);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Select initial firms when data loads
  useEffect(() => {
    if (firms && firms.length > 0 && selectedFirms.length === 0) {
      const initialFirms = firms.slice(0, maxCompare).map(firm => firm.id);
      setSelectedFirms(initialFirms);
    }
  }, [firms, selectedFirms.length, maxCompare]);
  
  const handleAddFirm = (firmId: string) => {
    const id = parseInt(firmId);
    if (!selectedFirms.includes(id) && selectedFirms.length < maxCompare) {
      setSelectedFirms([...selectedFirms, id]);
    }
  };
  
  const handleRemoveFirm = (firmId: number) => {
    setSelectedFirms(selectedFirms.filter(id => id !== firmId));
  };
  
  const comparisonFirms = firms?.filter(firm => selectedFirms.includes(firm.id)) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-center">
        <span className="text-neutral-700 font-medium">Add firm to compare:</span>
        <Select 
          onValueChange={handleAddFirm} 
          disabled={isLoading || selectedFirms.length >= maxCompare}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a firm" />
          </SelectTrigger>
          <SelectContent>
            {firms?.map(firm => (
              <SelectItem 
                key={firm.id} 
                value={firm.id.toString()}
                disabled={selectedFirms.includes(firm.id)}
              >
                {firm.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-neutral-500">
          {selectedFirms.length} of {maxCompare} firms selected
        </span>
      </div>
      
      {isLoading ? (
        <Skeleton className="h-[400px] w-full" />
      ) : (
        <div className="overflow-x-auto">
          <Table className="border rounded-lg">
            <TableHeader className="bg-neutral-50">
              <TableRow>
                <TableHead className="w-[200px] bg-neutral-100">Features</TableHead>
                {comparisonFirms.map(firm => (
                  <TableHead key={firm.id} className="min-w-[200px]">
                    <div className="flex items-center justify-between">
                      <span>{firm.name}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveFirm(firm.id)}
                        className="h-6 w-6 p-0 rounded-full"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium bg-neutral-50">Account Sizes</TableCell>
                {comparisonFirms.map(firm => (
                  <TableCell key={firm.id}>
                    ${firm.maxAccountSize.toLocaleString()}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium bg-neutral-50">Challenge Fee</TableCell>
                {comparisonFirms.map(firm => (
                  <TableCell key={firm.id}>
                    ${firm.challengeFeeMin} - ${firm.challengeFeeMax}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium bg-neutral-50">Profit Split</TableCell>
                {comparisonFirms.map(firm => (
                  <TableCell key={firm.id}>{firm.profitSplit}%</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium bg-neutral-50">Time to Payout</TableCell>
                {comparisonFirms.map(firm => (
                  <TableCell key={firm.id}>{firm.payoutTime} days</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium bg-neutral-50">Max Daily Drawdown</TableCell>
                {comparisonFirms.map(firm => (
                  <TableCell key={firm.id}>{firm.maxDailyDrawdown}%</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium bg-neutral-50">Max Total Drawdown</TableCell>
                {comparisonFirms.map(firm => (
                  <TableCell key={firm.id}>{firm.maxTotalDrawdown}%</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium bg-neutral-50">Minimum Trading Days</TableCell>
                {comparisonFirms.map(firm => (
                  <TableCell key={firm.id}>
                    {firm.minTradingDays > 0 ? firm.minTradingDays + ' days' : 'None'}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium bg-neutral-50">Scaling Plan</TableCell>
                {comparisonFirms.map(firm => (
                  <TableCell key={firm.id}>
                    {firm.scalingPlan ? 'Yes' : 'No'}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium bg-neutral-50">Trading Platforms</TableCell>
                {comparisonFirms.map(firm => (
                  <TableCell key={firm.id}>
                    {firm.tradingPlatforms?.join(', ')}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium bg-neutral-50">Tradable Assets</TableCell>
                {comparisonFirms.map(firm => (
                  <TableCell key={firm.id}>
                    {firm.tradableAssets?.join(', ')}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium bg-neutral-50">Rating</TableCell>
                {comparisonFirms.map(firm => (
                  <TableCell key={firm.id}>
                    {firm.avgRating ? firm.avgRating.toFixed(1) + '/5' : 'N/A'}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default CompareTable;
