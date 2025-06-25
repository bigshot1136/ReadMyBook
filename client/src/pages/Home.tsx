import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StoryCard from "@/components/StoryCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { BookOpen, Edit, Bot, ShoppingCart, Plus, Clock, Star } from "lucide-react";
import { Link } from "wouter";

interface Story {
  id: number;
  title: string;
  genre: string;
  storyType: 'template' | 'custom' | 'premade';
  createdAt: string;
  rating: string;
  pageCount: number;
}

export default function Home() {
  const { user } = useAuth();

  const { data: userStories = [], isLoading: storiesLoading } = useQuery({
    queryKey: ['/api/stories/user'],
  });

  const { data: recentTemplates = [], isLoading: templatesLoading } = useQuery({
    queryKey: ['/api/story-templates'],
  });

  const handleSignOut = () => {
    window.location.href = "/api/logout";
  };

  const recentStories = userStories.slice(0, 3);
  const featuredTemplates = recentTemplates.slice(0, 3);

  return (
    <div className="min-h-screen bg-warm">
      <Header 
        isAuthenticated={true} 
        user={user} 
        onSignOut={handleSignOut}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-display text-gray-800 mb-4">
              Welcome back, {user?.firstName || 'Storyteller'}! 
            </h1>
            <p className="text-xl text-gray-600">
              Ready to create more magical adventures?
            </p>
          </div>

          {/* Quick Action Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Link href="/minor-tweaks">
              <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-50 border-0">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                    <Edit className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-gray-800 mb-2">Minor Tweaks</h3>
                  <p className="text-gray-600 text-sm">Customize pre-written stories</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/custom-stories">
              <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer bg-gradient-to-br from-purple-50 to-pink-50 border-0">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-magic to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                    <Bot className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-gray-800 mb-2">Custom Stories</h3>
                  <p className="text-gray-600 text-sm">AI-powered story creation</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/ready-made">
              <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer bg-gradient-to-br from-orange-50 to-red-50 border-0">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                    <ShoppingCart className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-gray-800 mb-2">Ready-Made Shop</h3>
                  <p className="text-gray-600 text-sm">Browse professional stories</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Recent Stories Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-heading font-bold text-gray-800">Your Recent Stories</h2>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Story
            </Button>
          </div>

          {storiesLoading ? (
            <LoadingSpinner />
          ) : recentStories.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {recentStories.map((story: Story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-heading font-semibold text-gray-600 mb-2">No stories yet</h3>
                <p className="text-gray-500 mb-4">Start creating your first magical story!</p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Link href="/minor-tweaks">
                    <Button size="sm">Browse Templates</Button>
                  </Link>
                  <Link href="/custom-stories">
                    <Button variant="outline" size="sm">Create Custom</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Featured Templates Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-heading font-bold text-gray-800">Featured Templates</h2>
            <Link href="/minor-tweaks">
              <Button variant="outline" size="sm">
                View All Templates
              </Button>
            </Link>
          </div>

          {templatesLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {featuredTemplates.map((template: any) => (
                <Card key={template.id} className="hover:shadow-lg transition-all duration-200 bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-secondary text-white px-3 py-1 rounded-full text-sm font-medium">
                        {template.genre}
                      </span>
                      <div className="flex items-center text-accent">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="ml-1 text-sm font-medium">{template.rating || '4.5'}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-heading font-bold text-gray-800 mb-2">{template.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{template.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{template.ageGroup} • {template.pageCount} pages</span>
                      <Link href={`/minor-tweaks?template=${template.id}`}>
                        <Button size="sm" variant="outline">
                          Customize
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-primary mb-2">{userStories.length}</div>
              <div className="text-sm text-gray-600">Stories Created</div>
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-secondary mb-2">
                {userStories.filter((s: Story) => s.storyType === 'template').length}
              </div>
              <div className="text-sm text-gray-600">From Templates</div>
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-magic mb-2">
                {userStories.filter((s: Story) => s.storyType === 'custom').length}
              </div>
              <div className="text-sm text-gray-600">Custom Stories</div>
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-success mb-2">
                {user?.subscriptionTier === 'premium' ? 'Premium' : 'Free'}
              </div>
              <div className="text-sm text-gray-600">Plan</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
