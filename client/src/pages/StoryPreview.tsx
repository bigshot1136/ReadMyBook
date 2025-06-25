import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ArrowLeft, Star, Calendar, User, BookOpen, Download, Share2, Edit, Trash2 } from "lucide-react";

interface Story {
  id: number;
  title: string;
  content: string;
  storyType: 'template' | 'custom' | 'premade';
  userId: string;
  characterNames: string[];
  pageCount: number;
  illustrations: string[];
  genre: string;
  ageGroup: string;
  description: string;
  rating: string;
  createdAt: string;
  updatedAt: string;
}

export default function StoryPreview() {
  const { id } = useParams();
  const { user } = useAuth();

  const { data: story, isLoading, error } = useQuery({
    queryKey: ['/api/stories', id],
    enabled: !!id,
  });

  const handleSignOut = () => {
    window.location.href = "/api/logout";
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: story?.title,
        text: story?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStoryContent = (content: string) => {
    // Split content into paragraphs and format for better readability
    const paragraphs = content.split('\n\n').filter(p => p.trim());
    return paragraphs.map((paragraph, index) => (
      <p key={index} className="mb-4 text-gray-700 leading-relaxed">
        {paragraph.trim()}
      </p>
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm">
        <Header 
          isAuthenticated={!!user} 
          user={user} 
          onSignOut={handleSignOut}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-warm">
        <Header 
          isAuthenticated={!!user} 
          user={user} 
          onSignOut={handleSignOut}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-heading font-semibold text-gray-600 mb-2">Story not found</h3>
              <p className="text-gray-500 mb-4">The story you're looking for doesn't exist or has been removed.</p>
              <Link href="/">
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const isOwner = user && story.userId === user.id;

  return (
    <div className="min-h-screen bg-warm">
      <Header 
        isAuthenticated={!!user} 
        user={user} 
        onSignOut={handleSignOut}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Story Header */}
        <Card className="bg-white shadow-lg mb-8">
          <CardHeader className="pb-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge className="bg-primary text-white">
                    {story.genre}
                  </Badge>
                  <Badge variant="outline">
                    {story.storyType === 'template' ? 'From Template' : 
                     story.storyType === 'custom' ? 'AI Generated' : 'Ready-Made'}
                  </Badge>
                  <div className="flex items-center text-accent">
                    <Star className="w-4 h-4 fill-current mr-1" />
                    <span className="text-sm font-medium">{story.rating || '4.5'}</span>
                  </div>
                </div>
                
                <CardTitle className="text-3xl font-display text-gray-800 mb-3">
                  {story.title}
                </CardTitle>
                
                {story.description && (
                  <p className="text-gray-600 text-lg leading-relaxed mb-4">
                    {story.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    <span>Age: {story.ageGroup}</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" />
                    <span>{story.pageCount} pages</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Created {formatDate(story.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 min-w-[140px]">
                <Button 
                  onClick={handleShare}
                  variant="outline"
                  size="sm"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                
                {isOwner && (
                  <>
                    <Button 
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link href={`/story/${story.id}/edit`}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </>
                )}
                
                <Button 
                  className="bg-secondary hover:bg-blue-600"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Character Names */}
        {story.characterNames && story.characterNames.length > 0 && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 mb-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-heading font-semibold text-gray-800 mb-3">
                Story Characters
              </h3>
              <div className="flex flex-wrap gap-2">
                {story.characterNames.map((name, index) => (
                  <Badge key={index} variant="secondary" className="bg-secondary text-white">
                    {name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Story Illustrations */}
        {story.illustrations && story.illustrations.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-heading">Story Illustrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {story.illustrations.map((illustration, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={illustration}
                      alt={`${story.title} illustration ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        Illustration {index + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Story Content */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-heading">Story Content</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <div className="bg-gradient-to-br from-warm to-yellow-50 rounded-lg p-8">
              <div className="text-gray-800 leading-relaxed">
                {renderStoryContent(story.content)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Story Metadata */}
        <Card className="mt-8 bg-gray-50">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Story Details</h4>
                <div className="space-y-1 text-gray-600">
                  <div>Type: {story.storyType === 'template' ? 'Customized Template' : 
                                story.storyType === 'custom' ? 'AI Generated Custom' : 'Ready-Made'}</div>
                  <div>Genre: {story.genre}</div>
                  <div>Target Age: {story.ageGroup}</div>
                  <div>Page Count: {story.pageCount}</div>
                  {story.characterNames && story.characterNames.length > 0 && (
                    <div>Characters: {story.characterNames.join(', ')}</div>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Timestamps</h4>
                <div className="space-y-1 text-gray-600">
                  <div>Created: {formatDate(story.createdAt)}</div>
                  {story.updatedAt && story.updatedAt !== story.createdAt && (
                    <div>Last Updated: {formatDate(story.updatedAt)}</div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Actions */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-heading font-bold text-gray-800 mb-6">Create More Stories</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/minor-tweaks">
              <Button variant="outline" size="lg">
                Browse Templates
              </Button>
            </Link>
            <Link href="/custom-stories">
              <Button size="lg" className="bg-magic hover:bg-purple-700">
                Create Custom Story
              </Button>
            </Link>
            <Link href="/ready-made">
              <Button variant="outline" size="lg">
                Shop Ready-Made
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
