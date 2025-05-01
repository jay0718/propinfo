import { format } from 'date-fns';
import { Link } from 'wouter';
import { Resource } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ResourceCardProps {
  resource: Resource;
}

const ResourceCard = ({ resource }: ResourceCardProps) => {
  const {
    id,
    title,
    summary,
    category,
    authorName,
    authorImage,
    image,
    readTime,
    publishedAt
  } = resource;
  
  const formattedDate = publishedAt ? format(new Date(publishedAt), 'MMMM d, yyyy') : '';

  return (
    <Link href={`/resources/${id}`}>
      <Card className="flex flex-col rounded-lg shadow-lg overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer h-full">
        <div className="flex-shrink-0 h-48 bg-neutral-200 overflow-hidden">
          {image && (
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <CardContent className="flex-1 p-6 flex flex-col justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-primary-500 hover:underline">
              {category}
            </p>
            <div className="block mt-2">
              <h3 className="text-xl font-semibold text-neutral-900">{title}</h3>
              <p className="mt-3 text-base text-neutral-500 line-clamp-3">{summary}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <div className="flex items-center">
            <Avatar className="h-10 w-10">
              <AvatarImage src={authorImage} />
              <AvatarFallback className="bg-primary-100 text-primary-800">
                {authorName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium text-neutral-900">{authorName}</p>
              <div className="flex space-x-1 text-sm text-neutral-500">
                <time dateTime={publishedAt?.toString()}>{formattedDate}</time>
                <span aria-hidden="true">&middot;</span>
                <span>{readTime} min read</span>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ResourceCard;
