import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Search, Star, ShoppingCart, BookOpen, Download, Truck, Filter, Grid, List } from "lucide-react";
import { Link } from "wouter";

interface PublishedStory {
  id: number;
  title: string;
  content: string;
  genre: string;
  ageGroup: string;
  pageCount: number;
  price: string;
  description: string;
  rating: string;
  illustrations: string[];
}

export default function ReadyMadeShop() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedStory, setSelectedStory] = useState<PublishedStory | null>(null);

  const { data: stories = [], isLoading } = useQuery({
    queryKey: ['/api/stories/published', { search: searchTerm, genre: selectedGenre, ageGroup: selectedAgeGroup }],
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data: { storyId: number; orderType: 'digital' | 'physical'; totalAmount: number }) => {
      const response = await apiRequest('POST', '/api/orders', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Order Placed!",
        description: "Your order has been placed successfully. Check your email for confirmation.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/orders/user'] });
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
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSignOut = () => {
    window.location.href = "/api/logout";
  };

  const handlePurchase = (story: PublishedStory, orderType: 'digital' | 'physical') => {
    const basePrice = parseFloat(story.price) || 12.99;
    const totalAmount = orderType === 'physical' ? basePrice + 4.99 : basePrice; // Add shipping for physical
    
    createOrderMutation.mutate({
      storyId: story.id,
      orderType,
      totalAmount,
    });
  };

  const filteredAndSortedStories = stories
    .filter((story: PublishedStory) => {
      const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           story.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = selectedGenre === "all" || story.genre.toLowerCase() === selectedGenre.toLowerCase();
      const matchesAge = selectedAgeGroup === "all" || story.ageGroup === selectedAgeGroup;
      return matchesSearch && matchesGenre && matchesAge;
    })
    .sort((a: PublishedStory, b: PublishedStory) => {
      switch (sortBy) {
        case 'price-low':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price-high':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'rating':
          return parseFloat(b.rating) - parseFloat(a.rating);
        case 'title':
          return a.title.localeCompare(b.title);
        default: // newest
          return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
      }
    });

  const genres = [...new Set(stories.map((s: PublishedStory) => s.genre))];
  const ageGroups = [...new Set(stories.map((s: PublishedStory) => s.ageGroup))];

  return (
    <div className="min-h-screen bg-warm">
      <Header 
        isAuthenticated={!!user} 
        user={user} 
        onSignOut={handleSignOut}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl font-display text-gray-800 mb-4">Ready-Made Shop</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse our collection of professionally crafted storybooks. Available in digital format 
            or beautifully printed hardcover editions.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search stories by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedAgeGroup} onValueChange={setSelectedAgeGroup}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Age Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ages</SelectItem>
                  {ageGroups.map((age) => (
                    <SelectItem key={age} value={age}>{age}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {filteredAndSortedStories.length} stories found
            </p>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stories Grid/List */}
        {isLoading ? (
          <LoadingSpinner />
        ) : filteredAndSortedStories.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-heading font-semibold text-gray-600 mb-2">No stories found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
            {filteredAndSortedStories.map((story: PublishedStory) => (
              <Card key={story.id} className={`hover:shadow-xl transition-all duration-300 bg-white ${
                viewMode === 'grid' ? 'transform hover:-translate-y-1' : ''
              }`}>
                {viewMode === 'grid' ? (
                  <>
                    {story.illustrations && story.illustrations[0] && (
                      <div className="h-48 bg-gradient-to-br from-warm to-yellow-50 rounded-t-lg flex items-center justify-center overflow-hidden">
                        <img 
                          src={story.illustrations[0]} 
                          alt={story.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = `
                              <div class="w-full h-full bg-gradient-to-br from-warm to-yellow-50 flex items-center justify-center">
                                <i class="fas fa-book text-6xl text-gray-300"></i>
                              </div>
                            `;
                          }}
                        />
                      </div>
                    )}
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className="bg-primary text-white">
                          {story.genre}
                        </Badge>
                        <div className="flex items-center text-accent">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="ml-1 text-sm font-medium">{story.rating || '4.5'}</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl font-heading text-gray-800">{story.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{story.description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{story.ageGroup}</span>
                        <span>{story.pageCount} pages</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-primary">
                          ${story.price || '12.99'}
                        </div>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedStory(story)}
                              >
                                <BookOpen className="w-4 h-4 mr-2" />
                                Preview
                              </Button>
                            </DialogTrigger>
                          </Dialog>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          size="sm" 
                          className="bg-secondary hover:bg-blue-600"
                          onClick={() => handlePurchase(story, 'digital')}
                          disabled={createOrderMutation.isPending}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Digital
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handlePurchase(story, 'physical')}
                          disabled={createOrderMutation.isPending}
                        >
                          <Truck className="w-4 h-4 mr-2" />
                          Print
                        </Button>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <div className="flex gap-6 p-6">
                    <div className="w-32 h-40 bg-gradient-to-br from-warm to-yellow-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      {story.illustrations && story.illustrations[0] ? (
                        <img 
                          src={story.illustrations[0]} 
                          alt={story.title}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = `
                              <i class="fas fa-book text-4xl text-gray-300"></i>
                            `;
                          }}
                        />
                      ) : (
                        <i className="fas fa-book text-4xl text-gray-300"></i>
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className="bg-primary text-white">{story.genre}</Badge>
                            <div className="flex items-center text-accent">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="ml-1 text-sm font-medium">{story.rating || '4.5'}</span>
                            </div>
                          </div>
                          <h3 className="text-xl font-heading font-bold text-gray-800 mb-2">{story.title}</h3>
                          <p className="text-gray-600 text-sm mb-3">{story.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{story.ageGroup}</span>
                            <span>{story.pageCount} pages</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary mb-3">
                            ${story.price || '12.99'}
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button 
                              size="sm" 
                              className="bg-secondary hover:bg-blue-600"
                              onClick={() => handlePurchase(story, 'digital')}
                              disabled={createOrderMutation.isPending}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Digital
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handlePurchase(story, 'physical')}
                              disabled={createOrderMutation.isPending}
                            >
                              <Truck className="w-4 h-4 mr-2" />
                              Print (+$4.99)
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Story Preview Dialog */}
        <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            {selectedStory && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-heading">{selectedStory.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>Genre: {selectedStory.genre}</span>
                    <span>Age: {selectedStory.ageGroup}</span>
                    <span>Pages: {selectedStory.pageCount}</span>
                    <div className="flex items-center text-accent">
                      <Star className="w-4 h-4 fill-current mr-1" />
                      <span>{selectedStory.rating || '4.5'}</span>
                    </div>
                  </div>
                  
                  {selectedStory.illustrations && selectedStory.illustrations[0] && (
                    <img 
                      src={selectedStory.illustrations[0]} 
                      alt={selectedStory.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  )}
                  
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {selectedStory.description}
                    </p>
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Story Preview:</h4>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {selectedStory.content.substring(0, 800)}...
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-primary mb-1">
                          ${selectedStory.price || '12.99'}
                        </div>
                        <p className="text-sm text-gray-600">Digital version • Instant download</p>
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          className="bg-secondary hover:bg-blue-600"
                          onClick={() => {
                            handlePurchase(selectedStory, 'digital');
                            setSelectedStory(null);
                          }}
                          disabled={createOrderMutation.isPending}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Buy Digital
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            handlePurchase(selectedStory, 'physical');
                            setSelectedStory(null);
                          }}
                          disabled={createOrderMutation.isPending}
                        >
                          <Truck className="w-4 h-4 mr-2" />
                          Buy Print (+$4.99)
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Footer />
    </div>
  );
}
