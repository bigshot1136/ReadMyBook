import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BookOpen, Edit, Bot, ShoppingCart, Star, Shield, Eye, Play, CheckCircle } from "lucide-react";

export default function Landing() {
  const handleGetStarted = () => {
    window.location.href = "/api/login";
  };

  const handleSignIn = () => {
    window.location.href = "/api/login";
  };

  const sampleStories = [
    {
      id: 1,
      title: "Emma's Magical Garden",
      genre: "Adventure",
      description: "Join Emma as she discovers a secret garden where flowers sing and butterflies paint rainbows in the sky.",
      rating: 4.9,
      ageGroup: "Ages 4-8",
      pages: "16 pages",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
    },
    {
      id: 2,
      title: "Max's Space Adventure",
      genre: "Space",
      description: "Follow Max as he builds a rocket ship and travels through the galaxy, meeting friendly aliens along the way.",
      rating: 4.8,
      ageGroup: "Ages 5-9",
      pages: "20 pages",
      image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
    },
    {
      id: 3,
      title: "Sofia's Ocean Quest",
      genre: "Ocean",
      description: "Dive deep with Sofia as she explores coral reefs and makes friends with dolphins and sea turtles.",
      rating: 4.7,
      ageGroup: "Ages 3-7",
      pages: "12 pages",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
    }
  ];

  const testimonials = [
    {
      author: "Sarah M.",
      location: "Mom of 2, Chicago",
      content: "My daughter absolutely loves seeing herself as the main character! The stories are beautifully written and the illustrations are amazing. ReadMyBook has become our favorite bedtime activity.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
    },
    {
      author: "Michael R.",
      location: "Dad of 1, Austin",
      content: "The AI-generated stories are incredible! My son was so excited to see himself as a space explorer. The quality of the printed books is outstanding too. Highly recommend!",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
    },
    {
      author: "Emma L.",
      location: "Teacher, Portland",
      content: "As a teacher, I love how ReadMyBook encourages reading and creativity. The ready-made collection is perfect for classroom use, and parents love the personalized options!",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
    }
  ];

  return (
    <div className="min-h-screen bg-warm">
      <Header onSignIn={handleSignIn} onGetStarted={handleGetStarted} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-warm via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-display text-gray-800 leading-tight">
                  Create <span className="text-primary">Magical</span> Stories
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Bring your child's imagination to life with personalized storybooks that feature them as the hero of their own adventure.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-accent hover:from-orange-600 hover:to-orange-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                  onClick={handleGetStarted}
                >
                  <i className="fas fa-magic mr-2"></i>
                  Start Creating
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200"
                >
                  <Eye className="mr-2" />
                  View Samples
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-accent" />
                  <span>50,000+ Happy Families</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-success" />
                  <span>Kid-Safe Content</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Children reading magical storybooks together" 
                className="rounded-2xl shadow-2xl w-full" 
              />
              
              <div className="absolute -top-4 -left-4 bg-white rounded-xl shadow-lg p-4 transform rotate-6 hover:rotate-3 transition-transform">
                <div className="w-16 h-16 bg-gradient-to-br from-magic to-secondary rounded-lg mb-2"></div>
                <p className="text-xs font-medium text-gray-700">Adventure Story</p>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4 transform -rotate-6 hover:-rotate-3 transition-transform">
                <div className="w-16 h-16 bg-gradient-to-br from-success to-accent rounded-lg mb-2"></div>
                <p className="text-xs font-medium text-gray-700">Fairy Tale</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-gray-800 mb-4">Three Ways to Create Amazing Stories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Whether you want quick customization or full creative control, we have the perfect solution for every family.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Minor Tweaks Section */}
            <Card className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0">
              <div className="absolute top-6 right-6">
                <div className="bg-secondary text-white px-3 py-1 rounded-full text-sm font-medium">Quick & Easy</div>
              </div>
              
              <CardContent className="p-0">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary to-blue-600 rounded-2xl flex items-center justify-center mb-4">
                    <Edit className="text-white text-2xl" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-gray-800 mb-3">Minor Tweaks</h3>
                  <p className="text-gray-600 leading-relaxed">Personalize our pre-written stories by changing character names and simple details. Perfect for quick customization!</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="bg-white rounded-lg p-3 flex items-center space-x-3 shadow-sm">
                    <img 
                      src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
                      alt="Knight adventure story illustration" 
                      className="w-12 h-12 rounded-lg object-cover" 
                    />
                    <div>
                      <h4 className="font-medium text-gray-800">The Brave Knight</h4>
                      <p className="text-sm text-gray-500">Adventure • Ages 4-8</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-center space-x-3 shadow-sm">
                    <img 
                      src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
                      alt="Magical forest fairy tale illustration" 
                      className="w-12 h-12 rounded-lg object-cover" 
                    />
                    <div>
                      <h4 className="font-medium text-gray-800">Forest Friends</h4>
                      <p className="text-sm text-gray-500">Fantasy • Ages 3-7</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-secondary hover:bg-blue-600 text-white py-3 rounded-xl font-medium">
                  Browse Templates
                </Button>
              </CardContent>
            </Card>

            {/* Custom Stories Section */}
            <Card className="group relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0">
              <div className="absolute top-6 right-6">
                <div className="bg-magic text-white px-3 py-1 rounded-full text-sm font-medium">AI-Powered</div>
              </div>
              
              <CardContent className="p-0">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-magic to-pink-500 rounded-2xl flex items-center justify-center mb-4">
                    <Bot className="text-white text-2xl" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-gray-800 mb-3">Custom Stories</h3>
                  <p className="text-gray-600 leading-relaxed">Create completely unique stories with AI. Upload photos, choose themes, and watch as your personalized tale comes to life.</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-magic text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <span className="text-gray-700">Upload character photos</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-magic text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <span className="text-gray-700">Choose story theme</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-magic text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <span className="text-gray-700">AI generates your story</span>
                  </div>
                </div>

                <Button className="w-full bg-magic hover:bg-purple-700 text-white py-3 rounded-xl font-medium">
                  Create Custom Story
                </Button>
              </CardContent>
            </Card>

            {/* Ready-Made Section */}
            <Card className="group relative bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0">
              <div className="absolute top-6 right-6">
                <div className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">Ready Now</div>
              </div>
              
              <CardContent className="p-0">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-red-500 rounded-2xl flex items-center justify-center mb-4">
                    <ShoppingCart className="text-white text-2xl" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-gray-800 mb-3">Ready-Made Shop</h3>
                  <p className="text-gray-600 leading-relaxed">Browse our collection of professionally crafted storybooks. Available in digital format or beautifully printed hardcover.</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="bg-white rounded-lg p-3 flex items-center justify-between shadow-sm">
                    <div className="flex items-center space-x-3">
                      <img 
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
                        alt="Magical adventure storybook cover" 
                        className="w-12 h-12 rounded-lg object-cover" 
                      />
                      <div>
                        <h4 className="font-medium text-gray-800">Ocean Adventures</h4>
                        <p className="text-sm text-gray-500">Digital + Print</p>
                      </div>
                    </div>
                    <span className="text-primary font-bold">$12.99</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-center justify-between shadow-sm">
                    <div className="flex items-center space-x-3">
                      <img 
                        src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
                        alt="Enchanting fairy tale storybook cover" 
                        className="w-12 h-12 rounded-lg object-cover" 
                      />
                      <div>
                        <h4 className="font-medium text-gray-800">Space Explorer</h4>
                        <p className="text-sm text-gray-500">Digital + Print</p>
                      </div>
                    </div>
                    <span className="text-primary font-bold">$14.99</span>
                  </div>
                </div>

                <Button className="w-full bg-primary hover:bg-orange-600 text-white py-3 rounded-xl font-medium">
                  Browse Shop
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-soft via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-gray-800 mb-4">How ReadMyBook Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Creating personalized stories for your children has never been easier. Follow these simple steps to get started.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: "fas fa-user-plus", title: "Sign Up", desc: "Create your free account to get started with ReadMyBook", color: "from-primary to-accent" },
              { icon: "fas fa-palette", title: "Choose Style", desc: "Select from templates, create custom, or browse ready-made stories", color: "from-secondary to-blue-600" },
              { icon: "fas fa-magic", title: "Personalize", desc: "Add names, photos, and preferences to make the story uniquely yours", color: "from-magic to-pink-500" },
              { icon: "fas fa-book", title: "Enjoy", desc: "Read together, download, or order a beautiful printed version", color: "from-success to-emerald-500" }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <i className={`${step.icon} text-white text-2xl`}></i>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-success text-white rounded-full flex items-center justify-center text-sm font-bold">{index + 1}</div>
                </div>
                <h3 className="text-xl font-heading font-bold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Stories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-gray-800 mb-4">Sample Stories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Take a peek at some of the magical stories created by families just like yours.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {sampleStories.map((story) => (
              <Card key={story.id} className="bg-gradient-to-br from-warm to-yellow-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0">
                <img 
                  src={story.image} 
                  alt={`${story.title} illustration`} 
                  className="w-full h-48 object-cover" 
                />
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">{story.genre}</span>
                    <div className="flex items-center text-accent">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="ml-1 text-sm font-medium">{story.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-heading font-bold text-gray-800 mb-2">{story.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{story.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{story.ageGroup} • {story.pages}</span>
                    <Button variant="ghost" className="text-secondary hover:text-blue-600 font-medium text-sm p-0">
                      Preview <i className="fas fa-arrow-right ml-1"></i>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:from-orange-600 hover:to-orange-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              View All Sample Stories
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-secondary via-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold mb-4">What Families Are Saying</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">Join thousands of happy families who have created magical memories with ReadMyBook.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-6 shadow-xl border-0">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <div className="flex text-accent text-sm">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-blue-50 mb-6 leading-relaxed">{testimonial.content}</p>
                  <div className="flex items-center">
                    <img 
                      src={testimonial.image} 
                      alt={`${testimonial.author} testimonial`} 
                      className="w-12 h-12 rounded-full object-cover mr-4" 
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.author}</h4>
                      <p className="text-blue-200 text-sm">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-warm via-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-display text-gray-800 mb-6">Ready to Create Magic?</h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">Join thousands of families who have already discovered the joy of personalized storytelling. Start your first story today – it's free to try!</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:from-orange-600 hover:to-orange-500 text-white px-10 py-4 rounded-full font-bold text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                onClick={handleGetStarted}
              >
                <i className="fas fa-magic mr-3"></i>
                Start Creating Free
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white px-10 py-4 rounded-full font-bold text-xl transition-all duration-200"
              >
                <Play className="mr-3" />
                Watch Demo
              </Button>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 max-w-2xl mx-auto text-sm text-gray-600">
              {[
                "Free to start",
                "No credit card required", 
                "Cancel anytime"
              ].map((benefit, index) => (
                <div key={index} className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
