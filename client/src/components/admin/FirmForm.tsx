import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PropFirm } from '@/lib/types';

interface FirmFormProps {
  firm?: PropFirm | null;
  onSaved: () => void;
  onCancel: () => void;
}

const tradingPlatformOptions = [
  "MetaTrader 4",
  "MetaTrader 5",
  "cTrader",
  "DXtrade",
  "TradingView",
  "NinjaTrader",
  "Tradovate",
];

const tradableAssetOptions = [
  "Forex",
  "Indices",
  "Commodities",
  "Stocks",
  "Cryptos",
  "Futures",
  "Options",
];

const firmSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  logo: z.string().optional(),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  websiteUrl: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal('')),
  maxAccountSize: z.coerce.number().int().positive({ message: "Must be a positive number" }),
  profitSplit: z.coerce.number().int().min(1).max(100, { message: "Must be between 1 and 100" }),
  challengeFeeMin: z.coerce.number().int().nonnegative(),
  challengeFeeMax: z.coerce.number().int().nonnegative(),
  payoutTime: z.coerce.number().int().nonnegative(),
  maxDailyDrawdown: z.coerce.number().int().nonnegative(),
  maxTotalDrawdown: z.coerce.number().int().nonnegative(),
  minTradingDays: z.coerce.number().int().nonnegative(),
  scalingPlan: z.boolean().default(false),
  tradingPlatforms: z.array(z.string()).min(1, { message: "Select at least one trading platform" }),
  tradableAssets: z.array(z.string()).min(1, { message: "Select at least one tradable asset" }),
  featured: z.boolean().default(false),
});

type FirmFormValues = z.infer<typeof firmSchema>;

const FirmForm = ({ firm, onSaved, onCancel }: FirmFormProps) => {
  const isEditing = !!firm;
  const { toast } = useToast();
  
  const defaultValues: Partial<FirmFormValues> = {
    name: firm?.name || '',
    logo: firm?.logo || '',
    description: firm?.description || '',
    websiteUrl: firm?.websiteUrl || '',
    maxAccountSize: firm?.maxAccountSize || 0,
    profitSplit: firm?.profitSplit || 80,
    challengeFeeMin: firm?.challengeFeeMin || 0,
    challengeFeeMax: firm?.challengeFeeMax || 0,
    payoutTime: firm?.payoutTime || 0,
    maxDailyDrawdown: firm?.maxDailyDrawdown || 0,
    maxTotalDrawdown: firm?.maxTotalDrawdown || 0,
    minTradingDays: firm?.minTradingDays || 0,
    scalingPlan: firm?.scalingPlan || false,
    tradingPlatforms: firm?.tradingPlatforms || [],
    tradableAssets: firm?.tradableAssets || [],
    featured: firm?.featured || false,
  };
  
  const form = useForm<FirmFormValues>({
    resolver: zodResolver(firmSchema),
    defaultValues,
  });

  const { mutate: createFirm, isPending: isCreating } = useMutation({
    mutationFn: (data: FirmFormValues) => {
      return apiRequest('POST', '/api/firms', data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Prop firm added successfully",
      });
      onSaved();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add prop firm",
        variant: "destructive",
      });
    },
  });

  const { mutate: updateFirm, isPending: isUpdating } = useMutation({
    mutationFn: (data: FirmFormValues) => {
      return apiRequest('PUT', `/api/firms/${firm?.id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Prop firm updated successfully",
      });
      onSaved();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update prop firm",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FirmFormValues) => {
    if (isEditing) {
      updateFirm(data);
    } else {
      createFirm(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Firm Name</FormLabel>
                <FormControl>
                  <Input placeholder="FTMO" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="websiteUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the prop firm..." 
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="maxAccountSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Account Size ($)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="profitSplit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profit Split (%)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="challengeFeeMin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Challenge Fee Min ($)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="challengeFeeMax"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Challenge Fee Max ($)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <FormField
            control={form.control}
            name="payoutTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payout Time (days)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="maxDailyDrawdown"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Daily Drawdown (%)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="maxTotalDrawdown"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Total Drawdown (%)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="minTradingDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Trading Days</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex items-end space-x-4">
            <FormField
              control={form.control}
              name="scalingPlan"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">Has Scaling Plan</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">Featured Firm</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="tradingPlatforms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trading Platforms</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {tradingPlatformOptions.map((platform) => (
                    <FormField
                      key={platform}
                      control={form.control}
                      name="tradingPlatforms"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={platform}
                            className="flex flex-row items-start space-x-2 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(platform)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, platform])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== platform
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {platform}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tradableAssets"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tradable Assets</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {tradableAssetOptions.map((asset) => (
                    <FormField
                      key={asset}
                      control={form.control}
                      name="tradableAssets"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={asset}
                            className="flex flex-row items-start space-x-2 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(asset)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, asset])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== asset
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {asset}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isCreating || isUpdating}
          >
            {isEditing 
              ? (isUpdating ? 'Updating...' : 'Update Firm') 
              : (isCreating ? 'Creating...' : 'Create Firm')
            }
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FirmForm;
