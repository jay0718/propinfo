import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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

// Schema for one account offering
const accountTypeSchema = z.object({
  accountSize: z.coerce.number().int().positive(),
  drawdownType: z.enum(['EOD', 'EOT', 'TMDD']),
  price: z.coerce.number().nonnegative(),
  currentDiscountRate: z.coerce.number().min(0).max(100),
  discountedPrice: z.coerce.number().nonnegative(),
  activationFee: z.coerce.number().nonnegative(),
  targetProfit: z.coerce.number().nonnegative(),
  MLL: z.coerce.number().nonnegative(),
  DLL: z.coerce.number().nonnegative(),
  minEvaluationDays: z.coerce.number().int().nonnegative(),
  minFundedDays: z.coerce.number().int().nonnegative(),
  payoutRatio: z.coerce.number().min(0).max(100),
  payoutFrequency: z.string(),
});

type AccountType = z.infer<typeof accountTypeSchema>;

// Schema for extra fields
const extraFieldSchema = z
  .array(z.object({ key: z.string().min(1), value: z.string().min(1) }))
  .optional();

// Main form schema
const firmSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  logo: z.string().optional(),
  description: z.string().min(20),
  websiteUrl: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal('')),
  profitSplit: z.coerce.number().int().min(1).max(100, { message: "Must be between 1 and 100" }),
  challengeFeeMin: z.coerce.number().nonnegative(),
  challengeFeeMax: z.coerce.number().nonnegative(),
  payoutTime: z.coerce.number().int().nonnegative(),
  maxDailyDrawdown: z.coerce.number().int().nonnegative(),
  maxTotalDrawdown: z.coerce.number().int().nonnegative(),
  minTradingDays: z.coerce.number().int().nonnegative(),
  scalingPlan: z.boolean(),
  featured: z.boolean().default(false),

  accountTypes: z.array(accountTypeSchema).min(1),
  tradingPlatforms: z.array(z.string()).min(1, { message: "Select at least one trading platform" }),
  tradableAssets: z.array(z.string()).min(1, { message: "Select at least one tradable asset" }),
  evaluationStages: z.array(z.string()).optional(),
  newsTradingAllowed: z.boolean(),
  DCAAllowed: z.boolean(),
  maxTrailingAllowed: z.boolean(),
  microScalpingAllowed: z.boolean(),
  maxAccountsPerTrader: z.coerce.number().int().nonnegative(),
  maxContractsPerTrade: z.coerce.number().int().nonnegative(),
  copyTradingAllowed: z.boolean(),
  consistencyEval: z.coerce.number().min(0).max(100),
  consistencyFunded: z.coerce.number().min(0).max(100),
  extraFields: extraFieldSchema,
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
      description: firm?.description || '',
      websiteUrl: firm?.websiteUrl || '',
      profitSplit: firm?.profitSplit || 80,
      challengeFeeMin: firm?.challengeFeeMin || 0,
      challengeFeeMax: firm?.challengeFeeMax || 0,
      payoutTime: firm?.payoutTime || 0,
      maxDailyDrawdown: firm?.maxDailyDrawdown || 0,
      maxTotalDrawdown: firm?.maxTotalDrawdown || 0,
      minTradingDays: firm?.minTradingDays || 0,
      scalingPlan: firm?.scalingPlan || false,
      featured: firm?.featured || false,
      accountTypes:
        firm?.accountTypes || [
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
          },
        ],
      tradingPlatforms: firm?.tradingPlatforms || [],
      tradableAssets: firm?.tradableAssets || [],
      evaluationStages: firm?.evaluationStages || [''],
      newsTradingAllowed: firm?.newsTradingAllowed || false,
      DCAAllowed: firm?.DCAAllowed || false,
      maxTrailingAllowed: firm?.maxTrailingAllowed || false,
      microScalpingAllowed: firm?.microScalpingAllowed || false,
      maxAccountsPerTrader: firm?.maxAccountsPerTrader || 1,
      maxContractsPerTrade: firm?.maxContractsPerTrade || 1,
      copyTradingAllowed: firm?.copyTradingAllowed || false,
      consistencyEval: firm?.consistencyEval || 40,
      consistencyFunded: firm?.consistencyFunded || 40,
      extraFields: normalizedExtra,
    },
  });

  const { control, watch, setValue } = form
  const {
    fields: accountFields,
    append: appendAccount,
    remove: removeAccount,
  } = useFieldArray({ control: form.control, name: 'accountTypes' });

  // For each account row we’ll watch price & rate and update discountedPrice:
  accountFields.forEach((_, idx) => {
    const price = watch(`accountTypes.${idx}.price`)
    const rate  = watch(`accountTypes.${idx}.currentDiscountRate`)
    useEffect(() => {
      const computed = +(price * (1 - rate/100)).toFixed(2)
      // only call setValue if it actually changed:
      setValue(`accountTypes.${idx}.discountedPrice`, computed, { shouldValidate: true })
    }, [price, rate, idx])
  })


  const {
    fields: stageFields,
    append: appendStage,
    remove: removeStage,
  } = useFieldArray({ control: form.control, name: 'evaluationStages' });

  const {
    fields: extraFields,
    append: appendExtra,
    remove: removeExtra,
  } = useFieldArray({ control: form.control, name: 'extraFields' });

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
                  {/* Activation Fee */}
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
                  {/* Target Profit */}
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
                  {/* Min Evaluation Days */}
                  <FormField
                    control={form.control}
                    name={`accountTypes.${idx}.minEvaluationDays`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Eval Days</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Min Funded Days */}
                  <FormField
                    control={form.control}
                    name={`accountTypes.${idx}.minFundedDays`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Funded Days</FormLabel>
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
                  accountSize: 0,
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

        {/* Evaluation Stages */}
        <section>
          <h3 className="text-lg font-medium">Evaluation Stages</h3>
          <div className="space-y-2">
            {stageFields.map((st, idx) => (
              <div key={st.id} className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name={`evaluationStages.${idx}`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input {...field} placeholder="Stage name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button variant="ghost" onClick={() => removeStage(idx)}>Remove</Button>
              </div>
            ))}
            <Button type="button" onClick={() => appendStage('')}>+ Add Stage</Button>
          </div>
        </section>

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
        </div>

        {/* Numeric Limits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="maxAccountsPerTrader"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Accounts/Trader</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxContractsPerTrade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Contracts/Trade</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Consistency Rules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="consistencyEval"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consistency (Eval) %</FormLabel>
                <FormControl>
                  <Input type="number" {...field} step={0.01} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="consistencyFunded"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consistency (Funded) %</FormLabel>
                <FormControl>
                  <Input type="number" {...field} step={0.01} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Extra Key-Value Rules */}
        <section>
          <h3 className="text-lg font-medium">Extra Rules</h3>
          <div className="space-y-2">
            {extraFields.map((ef, idx) => (
              <div key={ef.id} className="flex gap-2 items-center">
                <FormField
                  control={form.control}
                  name={`extraFields.${idx}.key`}
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
                  name={`extraFields.${idx}.value`}
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
