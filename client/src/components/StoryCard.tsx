import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, BookOpen, Edit, Trash2, Eye } from "lucide-react";
import { Link } from "wouter";

interface Story {
  id: number;
  title: string;
  genre: string;
  storyType: 'template' | 'custom' | 'premade';
  createdAt: string;
  rating: string;
  pageCount: number;
  description?: string;
  illustrations?: string[];
  ageGroup?: string;
}

interface StoryCardProps {
  story: Story;
  showActions?: boolean;
  onEdit?: (story: Story) => void;
  onDelete?: (story: Story) => void;
}

export default function StoryCard({ 
  story, 
  showActions = true, 
  onEdit, 
  onDelete 
}: StoryCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const getStoryTypeColor = (type: string) => {
    switch (type) {
      case 'template':
        return 'bg-secondary text-white';
      case 'custom':
        return 'bg-magic text-white';
      case 'premade':
        return 'bg-primary text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStoryTypeLabel = (type: string) => {
    switch (type) {
      case 'template':
        return 'From Template';
      case 'custom':
        return 'AI Generated';
      case 'premade':
        return 'Ready-Made';
      default:
        return type;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 bg-white group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge className={getStoryTypeColor(story.storyType)}>
              {getStoryTypeLabel(story.storyType)}
            </Badge>
            <Badge variant="outline">
              {story.genre}
            </Badge>
            <div className="flex items-center text-accent">
              <Star className="w-4 h-4 fill-current" />
              <span className="ml-1 text-sm font-medium">{story.rating || '4.5'}</span>
            </div>
          </div>
          
          {showActions && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex gap-1">
                <Link href={`/story/${story.id}`}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>
                {onEdit && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => onEdit(story)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    onClick={() => onDelete(story)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
        
        <CardTitle className="text-xl font-heading text-gray-800 line-clamp-2">
          {story.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Story Illustration */}
        {story.illustrations && story.illustrations[0] && (
          <div className="h-32 bg-gradient-to-br from-warm to-yellow-50 rounded-lg overflow-hidden">
            <img
              src={story.illustrations[0]}
              alt={story.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.className = 'w-full h-full bg-gradient-to-br from-warm to-yellow-50 flex items-center justify-center';
                placeholder.innerHTML = '<i class="fas fa-book text-4xl text-gray-300"></i>';
                e.currentTarget.parentElement?.appendChild(placeholder);
              }}
            />
          </div>
        )}

        {/* Story Description */}
        {story.description && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {story.description}
          </p>
        )}
        
        {/* Story Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <BookOpen className="w-4 h-4 mr-1" />
              <span>{story.pageCount} pages</span>
            </div>
            {story.ageGroup && (
              <span>{story.ageGroup}</span>
            )}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{formatDate(story.createdAt)}</span>
          </div>
        </div>

        {/* Action Button */}
        <Link href={`/story/${story.id}`}>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Story
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
