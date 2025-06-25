import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Bot, Upload, Wand2, Plus, X, Camera, Sparkles } from "lucide-react";

interface CustomStoryForm {
  title: string;
  genre: string;
  ageGroup: string;
  pageCount: number;
  characterNames: string[];
  theme: string;
  characterPhotos: File[];
}

export default function CustomStories() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CustomStoryForm>({
    title: '',
    genre: '',
    ageGroup: '',
    pageCount: 12,
    characterNames: [''],
    theme: '',
    characterPhotos: [],
  });

  const createCustomStoryMutation = useMutation({
    mutationFn: async (data: CustomStoryForm) => {
      console.log("Creating custom story with data:", data);
      
      const formData = new FormData();
      
      // Add story data as JSON string
      const storyData = {
        title: data.title,
        genre: data.genre,
        ageGroup: data.ageGroup,
        pageCount: data.pageCount,
        characterNames: data.characterNames.filter(name => name.trim() !== ''),
        theme: data.theme,
      };
      
      console.log("Story data to send:", storyData);
      formData.append('data', JSON.stringify(storyData));
      
      // Add character photos
      data.characterPhotos.forEach((photo, index) => {
        formData.append('characterPhotos', photo);
        console.log(`Added character photo ${index + 1}`);
      });
      
      console.log("Sending request to /api/stories/custom");
      
      return await apiRequest('/api/stories/custom', {
        method: 'POST',
        body: formData,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your custom story has been created with AI magic!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/stories/user'] });
      // Reset form
      setFormData({
        title: '',
        genre: '',
        ageGroup: '',
        pageCount: 12,
        characterNames: [''],
        theme: '',
        characterPhotos: [],
      });
      setCurrentStep(1);
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
        description: "Failed to create custom story. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSignOut = () => {
    window.location.href = "/api/logout";
  };

  const addCharacterName = () => {
    setFormData(prev => ({
      ...prev,
      characterNames: [...prev.characterNames, '']
    }));
  };

  const removeCharacterName = (index: number) => {
    setFormData(prev => ({
      ...prev,
      characterNames: prev.characterNames.filter((_, i) => i !== index)
    }));
  };

  const updateCharacterName = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      characterNames: prev.characterNames.map((name, i) => i === index ? value : name)
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      characterPhotos: [...prev.characterPhotos, ...files].slice(0, 5) // Limit to 5 photos
    }));
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      characterPhotos: prev.characterPhotos.filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.genre && formData.ageGroup;
      case 2:
        return formData.characterNames.some(name => name.trim() !== '');
      case 3:
        return formData.theme.trim() !== '';
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    if (!canProceedToNextStep()) return;
    createCustomStoryMutation.mutate(formData);
  };

  const genres = [
    'Adventure', 'Fantasy', 'Science Fiction', 'Mystery', 'Friendship', 
    'Animal Stories', 'Fairy Tale', 'Educational', 'Comedy', 'Sports'
  ];

  const ageGroups = [
    '2-4 years', '3-5 years', '4-7 years', '5-8 years', 
    '6-9 years', '7-10 years', '8-12 years'
  ];

  return (
    <div className="min-h-screen bg-warm">
      <Header 
        isAuthenticated={true} 
        user={user} 
        onSignOut={handleSignOut}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-magic to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Bot className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl font-display text-gray-800 mb-4">Custom Stories</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create completely unique stories with the power of AI. Upload photos, choose themes, 
            and watch as your personalized tale comes to life!
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div 
                key={step}
                className={`flex-1 h-2 rounded-full mx-1 ${
                  step <= currentStep ? 'bg-magic' : 'bg-gray-200'
                }`}
              ></div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span className={currentStep >= 1 ? 'text-magic font-medium' : ''}>Story Details</span>
            <span className={currentStep >= 2 ? 'text-magic font-medium' : ''}>Characters</span>
            <span className={currentStep >= 3 ? 'text-magic font-medium' : ''}>Theme & Photos</span>
            <span className={currentStep >= 4 ? 'text-magic font-medium' : ''}>Review</span>
          </div>
        </div>

        {/* Form Steps */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-heading">
              {currentStep === 1 && "Step 1: Story Details"}
              {currentStep === 2 && "Step 2: Characters"}
              {currentStep === 3 && "Step 3: Theme & Photos"}
              {currentStep === 4 && "Step 4: Review & Create"}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Step 1: Story Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base font-medium">Story Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter a magical title for your story"
                    className="text-lg"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Genre</Label>
                    <Select value={formData.genre} onValueChange={(value) => setFormData(prev => ({ ...prev, genre: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a genre" />
                      </SelectTrigger>
                      <SelectContent>
                        {genres.map((genre) => (
                          <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-medium">Age Group</Label>
                    <Select value={formData.ageGroup} onValueChange={(value) => setFormData(prev => ({ ...prev, ageGroup: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select age group" />
                      </SelectTrigger>
                      <SelectContent>
                        {ageGroups.map((age) => (
                          <SelectItem key={age} value={age}>{age}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-medium">Story Length: {formData.pageCount} pages</Label>
                  <Slider
                    value={[formData.pageCount]}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, pageCount: value[0] }))}
                    max={30}
                    min={8}
                    step={2}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>8 pages</span>
                    <span>30 pages</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Characters */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-4 block">Character Names</Label>
                  <p className="text-sm text-gray-600 mb-4">
                    Add the names of characters you want to appear in your story. These will be the heroes of your tale!
                  </p>
                  
                  {formData.characterNames.map((name, index) => (
                    <div key={index} className="flex gap-2 mb-3">
                      <Input
                        value={name}
                        onChange={(e) => updateCharacterName(index, e.target.value)}
                        placeholder={`Character ${index + 1} name`}
                        className="flex-1"
                      />
                      {formData.characterNames.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeCharacterName(index)}
                          className="px-3"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  {formData.characterNames.length < 5 && (
                    <Button
                      variant="outline"
                      onClick={addCharacterName}
                      className="w-full border-dashed"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Another Character
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Theme & Photos */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="theme" className="text-base font-medium">Story Theme</Label>
                  <Textarea
                    id="theme"
                    value={formData.theme}
                    onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
                    placeholder="Describe the theme or adventure you want your story to be about. For example: 'A magical journey through an enchanted forest where the characters discover they have special powers and must save the forest from an evil wizard.'"
                    rows={4}
                    className="text-base"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium">Character Photos (Optional)</Label>
                  <p className="text-sm text-gray-600">
                    Upload photos of the characters to make them look like real people in your story. Our AI will create illustrations based on these photos.
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.characterPhotos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Character ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 h-6 w-6 p-0"
                          onClick={() => removePhoto(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    
                    {formData.characterPhotos.length < 5 && (
                      <label className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:border-magic transition-colors">
                        <Camera className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Add Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          multiple
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-magic/10 to-pink-50 rounded-lg p-6">
                  <h3 className="text-xl font-heading font-bold text-gray-800 mb-4">Story Summary</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Title:</strong> {formData.title}
                    </div>
                    <div>
                      <strong>Genre:</strong> {formData.genre}
                    </div>
                    <div>
                      <strong>Age Group:</strong> {formData.ageGroup}
                    </div>
                    <div>
                      <strong>Pages:</strong> {formData.pageCount}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <strong>Characters:</strong> {formData.characterNames.filter(name => name.trim()).join(', ')}
                  </div>
                  
                  <div className="mt-4">
                    <strong>Theme:</strong>
                    <p className="mt-1 text-gray-700">{formData.theme}</p>
                  </div>
                  
                  {formData.characterPhotos.length > 0 && (
                    <div className="mt-4">
                      <strong>Character Photos:</strong> {formData.characterPhotos.length} uploaded
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Sparkles className="w-5 h-5 text-magic mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-800">AI Magic in Progress</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Our AI will create a unique story with custom illustrations based on your preferences. 
                        This process may take a few minutes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < 4 ? (
                <Button
                  onClick={nextStep}
                  disabled={!canProceedToNextStep()}
                  className="bg-magic hover:bg-purple-700"
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={createCustomStoryMutation.isPending}
                  className="bg-magic hover:bg-purple-700"
                >
                  {createCustomStoryMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Story...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Create Story
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
