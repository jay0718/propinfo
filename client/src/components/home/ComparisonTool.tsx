import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
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
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const ComparisonTool = () => {
  const { data: firms, isLoading } = useQuery<PropFirm[]>({
    queryKey: ['/api/firms'],
  });

  const [selectedFirms, setSelectedFirms] = useState<number[]>([1, 2, 3]); // Default to first 3 firms

  const handleAddFirm = (firmId: string) => {
    const id = parseInt(firmId);
    if (!selectedFirms.includes(id)) {
      setSelectedFirms([...selectedFirms, id]);
    }
  };

  const comparisonFirms = firms?.filter(firm => selectedFirms.includes(firm.id)) || [];

  return (
    <div className="py-12 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-10">
          <h2 className="text-base text-primary-500 font-semibold tracking-wide uppercase">Comparison Tool</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            Compare Prop Trading Firms
          </p>
          <p className="mt-4 max-w-2xl text-xl text-neutral-500 lg:mx-auto">
            Easily compare trading conditions, fees, and features to find the best match for your trading style.
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-neutral-200 mt-10">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-neutral-900">Comparison Chart</h3>
            <div className="relative">
              <Select onValueChange={handleAddFirm} disabled={isLoading}>
                <SelectTrigger className="w-full rounded-md border border-neutral-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  <div className="flex items-center">
                    <span>Add Firms to Compare</span>
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {firms?.map(firm => (
                    <SelectItem key={firm.id} value={firm.id.toString()}>
                      {firm.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="p-6">
              <Skeleton className="h-64 w-full" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-neutral-50">
                  <TableRow>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Features
                    </TableHead>
                    {comparisonFirms.map(firm => (
                      <TableHead key={firm.id} className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        {firm.name}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-neutral-200">
                  <TableRow>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                      Challenge Fee
                    </TableCell>
                    {comparisonFirms.map(firm => (
                      <TableCell key={firm.id} className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        ${firm.challengeFeeMin} - ${firm.challengeFeeMax}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                      Profit Split
                    </TableCell>
                    {comparisonFirms.map(firm => (
                      <TableCell key={firm.id} className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {firm.profitSplit}%
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                      Time to Payout
                    </TableCell>
                    {comparisonFirms.map(firm => (
                      <TableCell key={firm.id} className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {firm.payoutTime} days
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                      Max Daily Drawdown
                    </TableCell>
                    {comparisonFirms.map(firm => (
                      <TableCell key={firm.id} className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {firm.maxDailyDrawdown}%
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                      Max Total Drawdown
                    </TableCell>
                    {comparisonFirms.map(firm => (
                      <TableCell key={firm.id} className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {firm.maxTotalDrawdown}%
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                      Minimum Trading Days
                    </TableCell>
                    {comparisonFirms.map(firm => (
                      <TableCell key={firm.id} className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {firm.minTradingDays > 0 ? firm.minTradingDays + ' days' : 'None'}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                      Scaling Plan
                    </TableCell>
                    {comparisonFirms.map(firm => (
                      <TableCell key={firm.id} className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {firm.scalingPlan ? 'Yes' : 'No'}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link href="/compare">
            <Button variant="outline" className="inline-flex items-center px-6 py-3 text-primary-700 bg-primary-50 hover:bg-primary-100">
              Full Comparison Tool
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTool;
