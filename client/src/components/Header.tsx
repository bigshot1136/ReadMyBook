import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BookOpen, Menu, User, LogOut, Settings, History } from "lucide-react";
import { Link } from "wouter";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  role: string;
}

interface HeaderProps {
  isAuthenticated?: boolean;
  user?: User;
  onSignIn?: () => void;
  onSignOut?: () => void;
  onGetStarted?: () => void;
}

export default function Header({ 
  isAuthenticated = false, 
  user, 
  onSignIn, 
  onSignOut, 
  onGetStarted 
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getUserInitials = (user: User) => {
    const firstInitial = user.firstName?.charAt(0) || user.email?.charAt(0) || 'U';
    const lastInitial = user.lastName?.charAt(0) || '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  const NavigationLinks = ({ mobile = false, onItemClick }: { mobile?: boolean; onItemClick?: () => void }) => (
    <>
      <Link href="/minor-tweaks">
        <a 
          className={`text-gray-700 hover:text-primary transition-colors font-medium ${
            mobile ? 'block py-2' : ''
          }`}
          onClick={onItemClick}
        >
          Minor Tweaks
        </a>
      </Link>
      <Link href="/custom-stories">
        <a 
          className={`text-gray-700 hover:text-primary transition-colors font-medium ${
            mobile ? 'block py-2' : ''
          }`}
          onClick={onItemClick}
        >
          Custom Stories
        </a>
      </Link>
      <Link href="/ready-made">
        <a 
          className={`text-gray-700 hover:text-primary transition-colors font-medium ${
            mobile ? 'block py-2' : ''
          }`}
          onClick={onItemClick}
        >
          Ready-Made
        </a>
      </Link>
    </>
  );

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <BookOpen className="text-white text-lg" />
              </div>
              <h1 className="text-2xl font-display text-primary">ReadMyBook</h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-8">
              <NavigationLinks />
            </nav>
          )}

          {/* Desktop Auth Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profileImageUrl} alt={user.firstName || user.email} />
                      <AvatarFallback className="bg-primary text-white text-sm">
                        {getUserInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm">
                        {user.firstName && user.lastName 
                          ? `${user.firstName} ${user.lastName}` 
                          : user.email}
                      </p>
                      <p className="w-[200px] truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {user.role} Role
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <Link href="/profile">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/orders">
                    <DropdownMenuItem>
                      <History className="mr-2 h-4 w-4" />
                      <span>Order History</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/settings">
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={onSignIn}
                  className="text-gray-700 hover:text-primary transition-colors font-medium !opacity-100"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={onGetStarted || onSignIn}
                  className="bg-primary hover:bg-orange-600 text-white px-6 py-2 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl !opacity-100"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {/* User Info (Mobile) */}
                  {isAuthenticated && user && (
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.profileImageUrl} alt={user.firstName || user.email} />
                        <AvatarFallback className="bg-primary text-white">
                          {getUserInitials(user)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="font-medium text-sm">
                          {user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}` 
                            : user.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {user.subscriptionTier} Plan
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Navigation Links (Mobile) */}
                  {isAuthenticated && (
                    <nav className="flex flex-col space-y-2">
                      <NavigationLinks 
                        mobile={true} 
                        onItemClick={() => setIsMobileMenuOpen(false)} 
                      />
                    </nav>
                  )}

                  {/* Account Links (Mobile) */}
                  {isAuthenticated && user ? (
                    <div className="flex flex-col space-y-2 border-t pt-4">
                      <Link href="/profile">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Button>
                      </Link>
                      <Link href="/orders">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <History className="mr-2 h-4 w-4" />
                          Order History
                        </Button>
                      </Link>
                      <Link href="/settings">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-destructive hover:text-destructive"
                        onClick={() => {
                          onSignOut?.();
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2 border-t pt-4">
                      <Button 
                        variant="ghost" 
                        className="w-full"
                        onClick={() => {
                          onSignIn?.();
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Sign In
                      </Button>
                      <Button 
                        className="w-full bg-primary hover:bg-orange-600"
                        onClick={() => {
                          (onGetStarted || onSignIn)?.();
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Get Started
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
