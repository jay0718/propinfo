import { PropFirm } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import StarRating from '@/components/ui/StarRating';
import FirmReviews from './FirmReviews';
import { ExternalLink, Info, DollarSign, BarChart, Clock, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FirmDetailProps {
  firm: PropFirm;
}

const FirmDetail = ({ firm }: FirmDetailProps) => {
  const {
    name,
    description,
    websiteUrl,
    profitSplit,
    challengeFeeMin,
    challengeFeeMax,
    payoutTime,
    maxDailyDrawdown,
    maxTotalDrawdown,
    minTradingDays,
    scalingPlan,
    tradingPlatforms,
    tradableAssets,
    avgRating
  } = firm;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl leading-6 font-bold text-neutral-900">{name}</h1>
            <div className="mt-2 flex items-center">
              <StarRating rating={avgRating || 0} size="lg" />
              <span className="ml-2 text-neutral-500">
                {avgRating ? avgRating.toFixed(1) : 'No ratings yet'}
              </span>
            </div>
          </div>
          <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
            <Button className="flex items-center gap-1">
              Visit Website <ExternalLink className="ml-1 h-4 w-4" />
            </Button>
          </a>
        </div>
        
        <Tabs defaultValue="overview" className="px-4 sm:px-6">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trading-conditions">Trading Conditions</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 pb-6">
            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">About {name}</h3>
              <p className="text-neutral-600">{description}</p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-2">
                    <Percent className="h-5 w-5 text-primary-500 mr-2" />
                    <h4 className="text-lg font-medium">Profit Split</h4>
                  </div>
                  <p className="text-neutral-600">Traders receive {profitSplit}% of profits</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 text-primary-500 mr-2" />
                    <h4 className="text-lg font-medium">Payout Time</h4>
                  </div>
                  <p className="text-neutral-600">Receive your profits in {payoutTime} days</p>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">Trading Platforms</h3>
              <div className="flex flex-wrap gap-2">
                {tradingPlatforms?.map((platform, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                    {platform}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">Available Assets</h3>
              <div className="flex flex-wrap gap-2">
                {tradableAssets?.map((asset, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-neutral-100 text-neutral-800">
                    {asset}
                  </span>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="trading-conditions" className="space-y-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-2">
                    <Info className="h-5 w-5 text-primary-500 mr-2" />
                    <h4 className="text-lg font-medium">Challenge Fee</h4>
                  </div>
                  <p className="text-neutral-600">${challengeFeeMin} - ${challengeFeeMax} depending on account size</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-2">
                    <BarChart className="h-5 w-5 text-primary-500 mr-2" />
                    <h4 className="text-lg font-medium">Drawdown Limits</h4>
                  </div>
                  <p className="text-neutral-600">
                    {maxDailyDrawdown}% daily maximum, {maxTotalDrawdown}% total maximum
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 text-primary-500 mr-2" />
                    <h4 className="text-lg font-medium">Minimum Trading Days</h4>
                  </div>
                  <p className="text-neutral-600">
                    {minTradingDays > 0 ? `${minTradingDays} days minimum` : 'No minimum trading days required'}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-2">
                    <DollarSign className="h-5 w-5 text-primary-500 mr-2" />
                    <h4 className="text-lg font-medium">Scaling Plan</h4>
                  </div>
                  <p className="text-neutral-600">
                    {scalingPlan 
                      ? 'Account scaling opportunities available for consistent performers' 
                      : 'No scaling plan available'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="pb-6">
            <FirmReviews firmId={firm.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FirmDetail;
