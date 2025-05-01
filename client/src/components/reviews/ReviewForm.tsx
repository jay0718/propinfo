import { useState } from 'react';
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
import StarRating from '@/components/ui/StarRating';

interface ReviewFormProps {
  firmId: number;
  onReviewSubmitted: () => void;
}

const reviewSchema = z.object({
  firmId: z.number(),
  username: z.string().min(2, { message: "Username must be at least 2 characters" }),
  rating: z.number().min(1, { message: "Please select a rating" }).max(5),
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  content: z.string().min(20, { message: "Review must be at least 20 characters" }),
  tradingExperience: z.string().optional(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

const ReviewForm = ({ firmId, onReviewSubmitted }: ReviewFormProps) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const { toast } = useToast();
  
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      firmId,
      username: '',
      rating: 0,
      title: '',
      content: '',
      tradingExperience: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ReviewFormValues) => {
      return apiRequest('POST', '/api/reviews', data);
    },
    onSuccess: () => {
      toast({
        title: "Review Submitted",
        description: "Thank you for sharing your experience!",
      });
      onReviewSubmitted();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ReviewFormValues) => {
    mutate(data);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
      <h3 className="text-lg font-medium text-neutral-900 mb-4">Write Your Review</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tradingExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trading Experience (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Forex Trader, 2 years" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Rating</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <StarRating 
                      rating={field.value} 
                      editable 
                      hoveredRating={hoveredRating}
                      onHoverChange={setHoveredRating}
                      onChange={field.onChange}
                    />
                    <span className="ml-2 text-sm text-neutral-500">
                      {field.value > 0 ? field.value : 'Select a rating'}
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Review Title</FormLabel>
                <FormControl>
                  <Input placeholder="Summarize your experience" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Review</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Share your experience with this prop firm..." 
                    className="min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full md:w-auto"
            disabled={isPending}
          >
            {isPending ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ReviewForm;
