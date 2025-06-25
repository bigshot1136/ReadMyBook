import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Search, Star, Users, BookOpen, Edit, Wand2 } from "lucide-react";

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

export default function MinorTweaks() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<StoryTemplate | null>(null);
  const [characterNames, setCharacterNames] = useState<string[]>([]);
  const [isCustomizing, setIsCustomizing] = useState(false);

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['/api/story-templates'],
  });

  const createStoryMutation = useMutation({
    mutationFn: async (data: { templateId: number; characterNames: string[] }) => {
      const response = await apiRequest('POST', '/api/stories/from-template', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your personalized story has been created.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/stories/user'] });
      setIsCustomizing(false);
      setSelectedTemplate(null);
      setCharacterNames([]);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create story. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSignOut = () => {
    window.location.href = "/api/logout";
  };

  const filteredTemplates = templates.filter((template: StoryTemplate) => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === "all" || template.genre.toLowerCase() === selectedGenre.toLowerCase();
    return matchesSearch && matchesGenre;
  });

  const genres = [...new Set(templates.map((t: StoryTemplate) => t.genre))];

  const handleCustomizeStory = (template: StoryTemplate) => {
    setSelectedTemplate(template);
    setCharacterNames(template.placeholderNames || []);
    setIsCustomizing(true);
  };

  const handleCreateStory = () => {
    if (!selectedTemplate) return;
    
    createStoryMutation.mutate({
      templateId: selectedTemplate.id,
      characterNames: characterNames.filter(name => name.trim() !== ''),
    });
  };

  return (
    <div className="min-h-screen bg-warm">
      <Header 
        isAuthenticated={true} 
        user={user} 
        onSignOut={handleSignOut}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-secondary to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Edit className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl font-display text-gray-800 mb-4">Minor Tweaks</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Personalize our professionally crafted stories by changing character names and details. 
            Perfect for quick customization with beautiful results!
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search stories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <option value="all">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Story Templates Grid */}
        {isLoading ? (
          <LoadingSpinner />
        ) : filteredTemplates.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-heading font-semibold text-gray-600 mb-2">No templates found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template: StoryTemplate) => (
              <Card key={template.id} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="bg-secondary text-white">
                      {template.genre}
                    </Badge>
                    <div className="flex items-center text-accent">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="ml-1 text-sm font-medium">{template.rating || '4.5'}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-heading text-gray-800">{template.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm leading-relaxed">{template.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{template.ageGroup}</span>
                    <span>{template.pageCount} pages</span>
                  </div>

                  {template.placeholderNames && template.placeholderNames.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Characters to customize:</div>
                      <div className="flex flex-wrap gap-2">
                        {template.placeholderNames.map((name, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{template.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex gap-4 text-sm text-gray-600">
                            <span>Genre: {template.genre}</span>
                            <span>Age: {template.ageGroup}</span>
                            <span>Pages: {template.pageCount}</span>
                          </div>
                          <div className="prose prose-sm max-w-none">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                              {template.content.substring(0, 500)}...
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      size="sm" 
                      className="flex-1 bg-secondary hover:bg-blue-600"
                      onClick={() => handleCustomizeStory(template)}
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      Customize
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Customization Dialog */}
        <Dialog open={isCustomizing} onOpenChange={setIsCustomizing}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-heading">Customize Your Story</DialogTitle>
            </DialogHeader>
            
            {selectedTemplate && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                  <h3 className="font-heading font-semibold text-gray-800 mb-2">{selectedTemplate.title}</h3>
                  <p className="text-gray-600 text-sm">{selectedTemplate.description}</p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-heading font-semibold text-gray-800">Character Names</h4>
                  <p className="text-sm text-gray-600">
                    Personalize the story by giving names to the characters. Leave blank to keep original names.
                  </p>
                  
                  {selectedTemplate.placeholderNames?.map((placeholder, index) => (
                    <div key={index} className="space-y-2">
                      <Label htmlFor={`character-${index}`} className="text-sm font-medium">
                        Character {index + 1} ({placeholder})
                      </Label>
                      <Input
                        id={`character-${index}`}
                        value={characterNames[index] || ''}
                        onChange={(e) => {
                          const newNames = [...characterNames];
                          newNames[index] = e.target.value;
                          setCharacterNames(newNames);
                        }}
                        placeholder={`Enter name for ${placeholder}`}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsCustomizing(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateStory}
                    disabled={createStoryMutation.isPending}
                    className="flex-1 bg-secondary hover:bg-blue-600"
                  >
                    {createStoryMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Create Story
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Footer />
    </div>
  );
}
