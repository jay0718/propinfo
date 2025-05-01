import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Resource } from '@/lib/types';
import ResourceCard from '@/components/resources/ResourceCard';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';

const categoryOptions = [
  "All Categories",
  "Beginner Guide",
  "Risk Management",
  "Trading Psychology",
  "Technical Analysis",
  "Fundamental Analysis",
  "Compare & Review",
  "Trading Strategy",
];

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  
  const { data: resources, isLoading } = useQuery<Resource[]>({
    queryKey: ['/api/resources'],
  });
  
  // Filter resources
  const filteredResources = resources?.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      resource.summary.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = categoryFilter === 'All Categories' || 
      resource.category === categoryFilter;
      
    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="lg:text-center mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
          Educational Resources
        </h1>
        <p className="mt-4 max-w-2xl text-xl text-neutral-500 lg:mx-auto">
          Learn everything you need to know about prop trading and improve your trading skills.
        </p>
      </div>
      
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="sm:w-64">
            <Select
              value={categoryFilter}
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white">
              <div className="flex-shrink-0">
                <Skeleton className="h-48 w-full" />
              </div>
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-full mb-3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full mt-1" />
                  <Skeleton className="h-4 w-2/3 mt-1" />
                </div>
                <div className="mt-6 flex items-center">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="ml-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32 mt-1" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredResources.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No resources found</h3>
          <p className="text-neutral-500">
            Try adjusting your search or category filter.
          </p>
        </div>
      )}
    </div>
  );
};

export default Resources;
