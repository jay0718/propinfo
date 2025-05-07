import React, { useEffect } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
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
import { PropFirm } from '@shared/schema';

// Schema for one account offering
const accountTypeSchema = z.object({
  accountType: z.enum(['Challenge','Funding','Live','InstantFunded']),
  stage: z.coerce.number().int().optional(),
  referralCode: z.string().default('PROPKOREA'),
  accountSize: z.coerce.number().int().positive(),
  startingBalance: z.coerce.number().optional(),
  drawdownType: z.enum(['EOD','EOT','TMDD','Static']),
  price: z.coerce.number().nonnegative().default(0),
  currentDiscountRate: z.coerce.number().min(0).max(100).default(0),
  discountedPrice: z.coerce.number().nonnegative().optional(),
  activationFee: z.coerce.number().nonnegative().optional(),
  targetProfit: z.coerce.number().int().nonnegative().optional(),
  MLL: z.coerce.number().nonnegative().optional(),
  DLLExists: z.boolean().optional(),
  DLL: z.coerce.number().nonnegative().optional(),
  payoutRatio: z.coerce.number().min(0).max(1).optional(),
  payoutFrequency: z.string().optional(),
  tradableAssets: z.array(z.string()).optional(),
  miniTradingFee: z.coerce.number().optional(),
  microTradingFee: z.coerce.number().optional(),
  positionClosureDueTime: z.string().optional(),

  // all the toggles and conditions
  newsTradingAllowed: z.boolean().optional(),
  newsTradingAllowedCondition: z.string().optional(),
  DCAAllowed: z.boolean().optional(),
  DCACondition: z.string().optional(),
  maxTrailingAllowed: z.boolean().optional(),
  maxTrailingCondition: z.string().optional(),
  microScalpingAllowed: z.boolean().optional(),
  microScalpingCondition: z.string().optional(),
  maxAccountsPerTrader: z.coerce.number().int().nonnegative().optional(),
  maxAccountsPerTraderCondition: z.string().optional(),
  maxContractsPerTrade: z.coerce.number().int().nonnegative().optional(),
  copyTradingAllowed: z.boolean().optional(),
  copyTradingCondition: z.string().optional(),
  scalingPlan: z.boolean().optional(),
  scalingPlanCondition: z.string().optional(),
  algoTradingAllowed: z.boolean().optional(),
  algoTradingCondition: z.string().optional(),
  resetAllowed: z.boolean().optional(),
  resetCondition: z.string().optional(),
  resetPrice: z.coerce.number().optional(),
  resetLimit: z.coerce.number().optional(),
  resetLimitCondition: z.string().optional(),
  resetDiscount: z.coerce.number().optional(),
  resetDiscountedPrice: z.coerce.number().optional(),
  maxWithdrawal: z.coerce.number().optional(),
  withdrawalPlatform: z.array(z.string()).optional(),
  bufferInsideWithdrawalAllowed: z.boolean().optional(),
  bufferAmount: z.coerce.number().optional(),
  bufferInsideCondition: z.string().optional(),
  consistencyRule: z.boolean().optional(),
  consistencyRatio: z.coerce.number().min(0).max(100).optional(),
  consistencyCondition: z.string().optional(),
  minTradingDays: z.coerce.number().int().nonnegative().optional(),
  minTradingDaysCondition: z.string().optional(),
  MaximumInactiveDays: z.coerce.number().int().nonnegative().optional(),
  liveAccountCondition: z.string().optional(),
  marketDepthData: z.boolean().optional(),
  marketDepthDataLevel: z.string().optional(),
  hasProfitSplitChange: z.boolean().optional(),
  initialProfitSplit: z.coerce.number().min(0).max(100).optional(),
  finalProfitSplit: z.coerce.number().min(0).max(100).optional(),
  profitSplitCondition: z.string().optional().optional(),
  discountEndAt: z.string().optional(),
});

// Schema for extra fields
const extraSchema = z
  .array(z.object({ key: z.string().min(1), value: z.string().min(1) }))
  .optional();

// Main form schema
const firmSchema = z.object({
  name: z.string().min(2),
  logo: z.string().optional(),
  backgroundImage: z.string().optional(),
  description: z.string().min(20),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  minPayoutTime: z.coerce.number().int().optional(),
  payoutWindow: z.string().optional(),
  tradingPlatforms: z.array(z.string()).min(1),
  tradableAssets: z.array(z.string()).min(1),
  featured: z.boolean().default(false),
  accountTypes: z.array(accountTypeSchema).min(1),
  extra: z
  .array(z.object({ key: z.string(), value: z.string() }))
  .default([]),
});

type FirmFormValues = z.infer<typeof firmSchema>;

interface FirmFormProps {
  firm?: PropFirm | null;
  onSaved: () => void;
  onCancel: () => void;
}

// Sample options
const tradingPlatformOptions = [
  'DXFeed',
  'Quantower',
  'TradingView',
  'NinjaTrader',
  'Rithmic',
  'Tradovate',
];
const tradableAssetOptions = [
  'Forex',
  'Indices',
  'Commodities',
  'Stocks',
  'Cryptos',
  'Futures',
  'Options',
];

const FirmForm = ({ firm, onSaved, onCancel }: FirmFormProps) => {
  const isEditing = !!firm;
  const { toast } = useToast();

  const normalizedExtra: { key: string; value: string }[] = React.useMemo(() => {
    // 1) If it's already an array of {key,value}, use it directly
    if (Array.isArray(firm?.extra)) {
      return (firm.extra as any[])
        .map(item => ({
          key: typeof item.key === 'string' ? item.key : '',
          value: typeof item.value === 'string' ? item.value : '',
        }));
    }
  
    // 2) If it's an object, turn its entries into key/value pairs
    if (firm?.extra && typeof firm.extra === 'object') {
      return Object.entries(firm.extra as Record<string, any>)
        .map(([k, v]) => ({
          key: k,
          value: v == null ? '' : String(v),
        }));
    }
  
    // 3) Fallback to one empty field
    return [{ key: '', value: '' }];
  }, [firm?.extra]);

  const form = useForm<FirmFormValues>({
    resolver: zodResolver(firmSchema),
    defaultValues: {
      name: firm?.name || '',
      logo: firm?.logo || '',
      backgroundImage: firm?.backgroundImage || '',
      description: firm?.description || '',
      websiteUrl: firm?.websiteUrl || '',
      minPayoutTime: firm?.minPayoutTime || 0,
      payoutWindow: firm?.payoutWindow || '',
      tradingPlatforms: firm?.tradingPlatforms || [],
      tradableAssets: firm?.tradableAssets || [],
      featured: firm?.featured || false,
      accountTypes: firm?.accountTypes || [
        {
          accountSize: 50000,
          drawdownType: 'EOD',
          price: 0,
          currentDiscountRate: 0,
          discountedPrice: 0,
          activationFee: 0,
          targetProfit: 0,
          MLL: 0,
          DLL: 0,
          minEvaluationDays: 0,
          minFundedDays: 0,
          payoutRatio: 0,
          payoutFrequency: '',
          referralCode: 'PROPKOREA',
          discountEndAt: '',
        },
      ],
      extra: normalizedExtra || {},
    },
  });

  const { control, watch, setValue } = form
  const {
    fields: accountFields,
    append: appendAccount,
    remove: removeAccount,
  } = useFieldArray({ control: form.control, name: 'accountTypes' });

  // 1) Watch the entire array at once
  const accountTypes = useWatch({
    control: form.control,
    name: 'accountTypes',
  }) as Array<{
    price?: number;
    currentDiscountRate?: number;
    discountedPrice?: number;
  }>;

  // 2) One effect to recalc *all* discountedPrice fields
  useEffect(() => {
    accountTypes.forEach((acct, idx) => {
      const price = acct.price ?? 0;
      const rate  = acct.currentDiscountRate ?? 0;
      const computed = +(price * (1 - rate/100)).toFixed(2);

      // avoid infinite loops
      if (computed !== acct.discountedPrice) {
        form.setValue(
          `accountTypes.${idx}.discountedPrice`,
          computed,
          { shouldValidate: true }
        );
      }
    });
  }, [accountTypes, form]);

  const accountTypesValues = watch('accountTypes') as Array<{ currentDiscountRate?: number }>;

  const {
    fields: extra,
    append: appendExtra,
    remove: removeExtra,
  } = useFieldArray({ control: form.control, name: 'extra' });

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
      console.log('Updating firm:', data);    
      updateFirm(data);
    } else {
      console.log('Creating firm:', data);    
      createFirm(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Firm Name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="backgroundImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Background Image Link" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo Image</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Logo Image Link" />
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
                  <Input {...field} placeholder="https://..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="payoutWindow"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payout Window</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Payout Window" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="minPayoutTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Payout Days</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Minimum Payout Days" />
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
                <Textarea {...field} className="min-h-[120px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Account Types */}
        <section>
          <h3 className="text-lg font-medium">Account Types</h3>
          <div className="space-y-4">
            {accountFields.map((acct, idx) => (
              <div key={acct.id} className="p-4 border rounded-lg relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => removeAccount(idx)}
                >
                  Remove
                </Button>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Size */}
                  <FormField
                    control={form.control}
                    name={`accountTypes.${idx}.accountType`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Type ($)</FormLabel>
                        <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Challenge">Challenge</SelectItem>
                              <SelectItem value="Funding">Funding</SelectItem>
                              <SelectItem value="Live">Live</SelectItem>
                              <SelectItem value="InstantFunded">Instant Funded</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`accountTypes.${idx}.accountSize`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Size ($)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Drawdown Type */}
                  <FormField
                    control={form.control}
                    name={`accountTypes.${idx}.drawdownType`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Drawdown Type</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="EOD">EOD</SelectItem>
                              <SelectItem value="EOT">EOT</SelectItem>
                              <SelectItem value="TMDD">TMDD</SelectItem>
                              <SelectItem value="Static">Static</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Price */}
                  <FormField
                    control={form.control}
                    name={`accountTypes.${idx}.price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Referral Code */}
                  <FormField
                    control={form.control}
                    name={`accountTypes.${idx}.referralCode`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Referral Code</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Referral Code" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Discount Rate */}
                  <FormField
                    control={form.control}
                    name={`accountTypes.${idx}.currentDiscountRate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Rate (0–100)</FormLabel>
                        <FormControl>
                          <Input step="1" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Discounted Price */}
                  <FormField
                    control={control}
                    name={`accountTypes.${idx}.discountedPrice`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discounted Price ($)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            readOnly
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Discount Ends At — only if rate ≠ 0 */}
                  {watch(`accountTypes.${idx}.currentDiscountRate`)! > 0 && (
                    <FormField
                      control={form.control}
                      name={`accountTypes.${idx}.discountEndAt`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Ends At</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" className="max-w-[140px]" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {/* Activation Fee */}
                  {watch(`accountTypes.${idx}.accountType`) === "Challenge" && (
                    <FormField
                      control={form.control}
                      name={`accountTypes.${idx}.activationFee`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Activation Fee ($)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {/* Target Profit */}
                  {watch(`accountTypes.${idx}.accountType`) === "Challenge" && (
                    <FormField
                      control={form.control}
                      name={`accountTypes.${idx}.targetProfit`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Profit ($)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {/* MLL */}
                  <FormField
                    control={form.control}
                    name={`accountTypes.${idx}.MLL`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Loss Limit ($)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* DLL */}
                  <FormField
                    control={form.control}
                    name={`accountTypes.${idx}.DLL`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Daily Loss Limit ($)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Payout Ratio */}
                  <FormField
                    control={form.control}
                    name={`accountTypes.${idx}.payoutRatio`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payout Ratio (0–100)</FormLabel>
                        <FormControl>
                          <Input step="0" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Payout Frequency */}
                  <FormField
                    control={form.control}
                    name={`accountTypes.${idx}.payoutFrequency`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payout Frequency</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. monthly" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              onClick={() =>
                appendAccount({
                  accountType: 'Challenge',
                  accountSize: 0,
                  drawdownType: 'EOD',
                  price: 0,
                  currentDiscountRate: 0,
                  discountedPrice: 0,
                  activationFee: 0,
                  targetProfit: 0,
                  MLL: 0,
                  DLL: 0,
                  payoutRatio: 0,
                  payoutFrequency: '',
                  referralCode: 'PROPKOREA',
                })
              }
            >
              + Add Account Type
            </Button>
          </div>
        </section>

        {/* Platforms & Assets */}
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
        </div>

        {/* Toggles & Flags */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'newsTradingAllowed', label: 'News Trading Allowed' },
            { name: 'DCAAllowed', label: 'DCA Allowed' },
            { name: 'maxTrailingAllowed', label: 'Max Trailing Allowed' },
            { name: 'microScalpingAllowed', label: 'Microscalping Allowed' },
            { name: 'copyTradingAllowed', label: 'Copy Trading Allowed' },
          ].map(({ name, label }) => (
            <FormField
              key={name}
              control={form.control}
              name={name as any}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">{label}</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
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

        {/* Extra Key-Value Rules */}
        <section>
          <h3 className="text-lg font-medium">Extra Rules</h3>
          <div className="space-y-2">
            {extra.map((ef, idx) => (
              <div key={ef.id} className="flex gap-2 items-center">
                <FormField
                  control={form.control}
                  name={`extra.${idx}.key`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input {...field} placeholder="Rule name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`extra.${idx}.value`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input {...field} placeholder="Value" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button variant="ghost" onClick={() => removeExtra(idx)}>Remove</Button>
              </div>
            ))}
            <Button type="button" onClick={() => appendExtra({ key: '', value: '' })}>
              + Add Rule
            </Button>
          </div>
        </section>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button
            type="submit"
            disabled={isCreating || isUpdating}
          >
            {isEditing
              ? (isUpdating ? 'Updating…' : 'Update Firm')
              : (isCreating ? 'Creating…' : 'Create Firm')}
        </Button>
        </div>
      </form>
    </Form>
  );
};

export default FirmForm;
