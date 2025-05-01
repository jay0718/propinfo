import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { PropFirm, Resource } from '@/lib/types';
import FirmForm from './FirmForm';
import ResourceForm from './ResourceForm';
import { useAuth } from '@/lib/auth';
import { Skeleton } from '@/components/ui/skeleton';

const AdminPanel = () => {
  const { isAuthenticated } = useAuth();
  const [addingFirm, setAddingFirm] = useState(false);
  const [addingResource, setAddingResource] = useState(false);
  const [editingFirm, setEditingFirm] = useState<PropFirm | null>(null);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  
  const { 
    data: firms,
    isLoading: isLoadingFirms,
    refetch: refetchFirms
  } = useQuery<PropFirm[]>({
    queryKey: ['/api/firms'],
    enabled: isAuthenticated,
  });
  
  const { 
    data: resources, 
    isLoading: isLoadingResources,
    refetch: refetchResources
  } = useQuery<Resource[]>({
    queryKey: ['/api/resources'],
    enabled: isAuthenticated,
  });

  const handleFirmSaved = () => {
    setAddingFirm(false);
    setEditingFirm(null);
    refetchFirms();
  };

  const handleResourceSaved = () => {
    setAddingResource(false);
    setEditingResource(null);
    refetchResources();
  };

  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue="firms" className="space-y-6">
        <TabsList>
          <TabsTrigger value="firms">Manage Prop Firms</TabsTrigger>
          <TabsTrigger value="resources">Manage Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="firms" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Prop Firms</h2>
            <Button 
              onClick={() => {
                setEditingFirm(null);
                setAddingFirm(true);
              }}
              disabled={addingFirm || !!editingFirm}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Firm
            </Button>
          </div>

          {(addingFirm || editingFirm) && (
            <Card>
              <CardHeader>
                <CardTitle>{editingFirm ? 'Edit Firm' : 'Add New Firm'}</CardTitle>
                <CardDescription>
                  {editingFirm 
                    ? `Editing details for ${editingFirm.name}`
                    : 'Fill in the details to add a new prop trading firm'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FirmForm 
                  firm={editingFirm} 
                  onSaved={handleFirmSaved} 
                  onCancel={() => {
                    setAddingFirm(false);
                    setEditingFirm(null);
                  }}
                />
              </CardContent>
            </Card>
          )}

          {isLoadingFirms ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : firms && firms.length > 0 ? (
            <div className="space-y-4">
              {firms.map(firm => (
                <Card key={firm.id}>
                  <CardHeader className="py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{firm.name}</CardTitle>
                        <CardDescription>
                          Max Account: ${firm.maxAccountSize?.toLocaleString()} | 
                          Profit Split: {firm.profitSplit}%
                        </CardDescription>
                      </div>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setAddingFirm(false);
                          setEditingFirm(firm);
                        }}
                        disabled={addingFirm || !!editingFirm}
                      >
                        Edit
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-neutral-500">No prop firms found. Add your first one!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Educational Resources</h2>
            <Button 
              onClick={() => {
                setEditingResource(null);
                setAddingResource(true);
              }}
              disabled={addingResource || !!editingResource}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Resource
            </Button>
          </div>

          {(addingResource || editingResource) && (
            <Card>
              <CardHeader>
                <CardTitle>{editingResource ? 'Edit Resource' : 'Add New Resource'}</CardTitle>
                <CardDescription>
                  {editingResource 
                    ? `Editing article "${editingResource.title}"`
                    : 'Create a new educational resource or article'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResourceForm 
                  resource={editingResource} 
                  onSaved={handleResourceSaved} 
                  onCancel={() => {
                    setAddingResource(false);
                    setEditingResource(null);
                  }}
                />
              </CardContent>
            </Card>
          )}

          {isLoadingResources ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : resources && resources.length > 0 ? (
            <div className="space-y-4">
              {resources.map(resource => (
                <Card key={resource.id}>
                  <CardHeader className="py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{resource.title}</CardTitle>
                        <CardDescription>
                          Category: {resource.category} | 
                          Author: {resource.authorName}
                        </CardDescription>
                      </div>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setAddingResource(false);
                          setEditingResource(resource);
                        }}
                        disabled={addingResource || !!editingResource}
                      >
                        Edit
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-neutral-500">No resources found. Add your first one!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
