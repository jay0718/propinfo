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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Resource } from '@/lib/types';

interface ResourceFormProps {
  resource?: Resource | null;
  onSaved: () => void;
  onCancel: () => void;
}

const categoryOptions = [
  "Beginner Guide",
  "Risk Management",
  "Trading Psychology",
  "Technical Analysis",
  "Fundamental Analysis",
  "Compare & Review",
  "Trading Strategy",
];

const resourceSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  content: z.string().min(20, { message: "Content must be at least 20 characters" }),
  summary: z.string().min(10, { message: "Summary must be at least 10 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  authorName: z.string().min(2, { message: "Author name is required" }),
  authorImage: z.string().optional(),
  image: z.string().optional(),
  readTime: z.coerce.number().int().min(1, { message: "Reading time must be at least 1 minute" }),
});

type ResourceFormValues = z.infer<typeof resourceSchema>;

const ResourceForm = ({ resource, onSaved, onCancel }: ResourceFormProps) => {
  const isEditing = !!resource;
  const { toast } = useToast();
  
  const defaultValues: Partial<ResourceFormValues> = {
    title: resource?.title || '',
    content: resource?.content || '',
    summary: resource?.summary || '',
    category: resource?.category || '',
    authorName: resource?.authorName || '',
    authorImage: resource?.authorImage || '',
    image: resource?.image || '',
    readTime: resource?.readTime || 5,
  };
  
  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues,
  });

  const { mutate: createResource, isPending: isCreating } = useMutation({
    mutationFn: (data: ResourceFormValues) => {
      return apiRequest('POST', '/api/resources', data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Resource added successfully",
      });
      onSaved();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add resource",
        variant: "destructive",
      });
    },
  });

  const { mutate: updateResource, isPending: isUpdating } = useMutation({
    mutationFn: (data: ResourceFormValues) => {
      return apiRequest('PUT', `/api/resources/${resource?.id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Resource updated successfully",
      });
      onSaved();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update resource",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ResourceFormValues) => {
    if (isEditing) {
      updateResource(data);
    } else {
      createResource(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="How to Pass a Prop Firm Challenge" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categoryOptions.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="readTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reading Time (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Summary</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Brief summary of the article..."
                  className="min-h-[80px]"
                  {...field} 
                />
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
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Full article content..."
                  className="min-h-[200px]"
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
            name="authorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="authorImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author Image URL (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/author.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Featured Image URL (optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
              ? (isUpdating ? 'Updating...' : 'Update Resource') 
              : (isCreating ? 'Creating...' : 'Create Resource')
            }
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ResourceForm;
