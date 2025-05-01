import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// Sample data for the chart
const chartData = [
  { name: 'FTMO', passRate: 42 },
  { name: 'The Funded Trader', passRate: 38 },
  { name: 'Funded Next', passRate: 45 },
  { name: 'E8 Funding', passRate: 40 },
  { name: 'True Forex Funds', passRate: 36 },
];

const ChartSection = () => {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div>
            <h2 className="text-base text-primary-500 font-semibold tracking-wide uppercase">Performance Analysis</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
              Make Data-Driven Decisions
            </p>
            <p className="mt-4 text-lg text-neutral-500">
              Our platform provides comprehensive data on prop firm performance, challenge pass rates, and trader success metrics to help you choose the right firm for your trading style.
            </p>
            <div className="mt-6">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  </div>
                  <p className="ml-3 text-base text-neutral-600">
                    <strong className="font-medium text-neutral-800">Challenge Pass Rates</strong> - See real statistics on trader success
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  </div>
                  <p className="ml-3 text-base text-neutral-600">
                    <strong className="font-medium text-neutral-800">Payout Reliability</strong> - Track firms with consistent and timely payouts
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  </div>
                  <p className="ml-3 text-base text-neutral-600">
                    <strong className="font-medium text-neutral-800">Trading Conditions</strong> - Compare spreads, commissions, and execution quality
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 lg:mt-0">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-8">
                <h3 className="text-lg font-medium text-neutral-900 mb-4">Challenge Pass Rates by Firm (2023)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="passRate" name="Pass Rate (%)" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6 flex justify-center">
                  <div className="inline-flex shadow-sm rounded-md">
                    <Button variant="outline" className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-neutral-300 bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                      Monthly
                    </Button>
                    <Button variant="outline" className="relative -ml-px inline-flex items-center px-4 py-2 border border-neutral-300 bg-primary-50 text-sm font-medium text-primary-700 hover:bg-primary-100">
                      Quarterly
                    </Button>
                    <Button variant="outline" className="relative -ml-px inline-flex items-center px-4 py-2 rounded-r-md border border-neutral-300 bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                      Yearly
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
