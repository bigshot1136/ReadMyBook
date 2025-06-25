import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Users, BookOpen, ShoppingCart, Plus, Edit, Trash2 } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

interface StoryTemplate {
  id: number;
  title: string;
  content: string;
  genre: string;
  ageGroup: string;
  pageCount: number;
  description: string;
  rating: string;
  placeholderNames: string[];
  previewImages: string[];
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

interface Story {
  id: number;
  title: string;
  storyType: string;
  userId: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<StoryTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Check admin access
  const { data: currentUser } = useQuery({
    queryKey: ['/api/auth/user'],
  });

  if (currentUser && currentUser.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  // Fetch admin stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/admin/stats'],
  });

  // Fetch users
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['/api/admin/users'],
  });

  // Fetch stories
  const { data: stories, isLoading: storiesLoading } = useQuery({
    queryKey: ['/api/admin/stories'],
  });

  // Fetch templates
  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ['/api/story-templates'],
  });

  // Create/update template mutation
  const templateMutation = useMutation({
    mutationFn: async (templateData: Partial<StoryTemplate>) => {
      const url = selectedTemplate ? `/api/story-templates/${selectedTemplate.id}` : '/api/story-templates';
      const method = selectedTemplate ? 'PATCH' : 'POST';
      return await apiRequest(url, { method, body: templateData });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Template ${selectedTemplate ? 'updated' : 'created'} successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/story-templates'] });
      setSelectedTemplate(null);
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete template mutation
  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/story-templates/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Template deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/story-templates'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const templateData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      genre: formData.get('genre') as string,
      ageGroup: formData.get('ageGroup') as string,
      pageCount: parseInt(formData.get('pageCount') as string),
      description: formData.get('description') as string,
      rating: formData.get('rating') as string,
      placeholderNames: [formData.get('character1') as string, formData.get('character2') as string],
      previewImages: [(formData.get('image1') as string) || '', (formData.get('image2') as string) || ''],
    };

    templateMutation.mutate(templateData);
  };

  if (statsLoading || usersLoading || storiesLoading || templatesLoading) {
    return <LoadingSpinner size="lg" text="Loading admin dashboard..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your ReadMyBook platform</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Active registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stories</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stories?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Stories created by users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Story Templates</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templates?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Available templates</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates">Story Templates</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="stories">User Stories</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Story Templates</h2>
            <Button 
              onClick={() => {
                setSelectedTemplate(null);
                setIsEditing(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Template
            </Button>
          </div>

          {isEditing && (
            <Card>
              <CardHeader>
                <CardTitle>{selectedTemplate ? 'Edit Template' : 'Create New Template'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input 
                        id="title" 
                        name="title" 
                        defaultValue={selectedTemplate?.title}
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="genre">Genre</Label>
                      <Select name="genre" defaultValue={selectedTemplate?.genre}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select genre" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Fantasy">Fantasy</SelectItem>
                          <SelectItem value="Adventure">Adventure</SelectItem>
                          <SelectItem value="Science Fiction">Science Fiction</SelectItem>
                          <SelectItem value="Mystery">Mystery</SelectItem>
                          <SelectItem value="Educational">Educational</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="ageGroup">Age Group</Label>
                      <Select name="ageGroup" defaultValue={selectedTemplate?.ageGroup}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select age group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="4-8">4-8 years</SelectItem>
                          <SelectItem value="6-10">6-10 years</SelectItem>
                          <SelectItem value="8-12">8-12 years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="pageCount">Page Count</Label>
                      <Input 
                        id="pageCount" 
                        name="pageCount" 
                        type="number" 
                        min="1" 
                        max="50"
                        defaultValue={selectedTemplate?.pageCount}
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="rating">Rating</Label>
                      <Input 
                        id="rating" 
                        name="rating" 
                        defaultValue={selectedTemplate?.rating}
                        placeholder="4.8"
                        required 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      defaultValue={selectedTemplate?.description}
                      required 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="content">Story Content</Label>
                    <Textarea 
                      id="content" 
                      name="content" 
                      defaultValue={selectedTemplate?.content}
                      rows={6}
                      placeholder="Use [CHARACTER1] and [CHARACTER2] as placeholders for character names"
                      required 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="character1">Character 1 Placeholder</Label>
                      <Input 
                        id="character1" 
                        name="character1" 
                        defaultValue={selectedTemplate?.placeholderNames?.[0]}
                        placeholder="[CHARACTER1]"
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="character2">Character 2 Placeholder</Label>
                      <Input 
                        id="character2" 
                        name="character2" 
                        defaultValue={selectedTemplate?.placeholderNames?.[1]}
                        placeholder="[CHARACTER2]"
                        required 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="image1">Preview Image 1 URL</Label>
                      <Input 
                        id="image1" 
                        name="image1" 
                        type="url"
                        defaultValue={selectedTemplate?.previewImages?.[0]}
                        placeholder="https://example.com/image1.jpg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="image2">Preview Image 2 URL</Label>
                      <Input 
                        id="image2" 
                        name="image2" 
                        type="url"
                        defaultValue={selectedTemplate?.previewImages?.[1]}
                        placeholder="https://example.com/image2.jpg"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={templateMutation.isPending}>
                      {templateMutation.isPending ? 'Saving...' : 'Save Template'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsEditing(false);
                        setSelectedTemplate(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates?.map((template: StoryTemplate) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{template.title}</CardTitle>
                      <CardDescription className="mt-1">
                        <Badge variant="secondary" className="mr-2">{template.genre}</Badge>
                        <Badge variant="outline">{template.ageGroup}</Badge>
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedTemplate(template);
                          setIsEditing(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteTemplateMutation.mutate(template.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{template.pageCount} pages</span>
                    <span>⭐ {template.rating}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <h2 className="text-xl font-semibold">Users</h2>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users?.map((user: User) => (
                    <tr key={user.id}>
                      <td className="px-4 py-3 text-sm">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stories" className="space-y-6">
          <h2 className="text-xl font-semibold">User Stories</h2>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Title</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">User ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stories?.map((story: Story) => (
                    <tr key={story.id}>
                      <td className="px-4 py-3 text-sm font-medium">{story.title}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant="outline">{story.storyType}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{story.userId}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(story.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}