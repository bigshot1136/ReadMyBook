import { BookOpen } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <BookOpen className="text-white text-lg" />
              </div>
              <h3 className="text-2xl font-display text-primary">ReadMyBook</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Creating magical, personalized stories for children around the world. 
              Where every child is the hero of their own adventure.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/minor-tweaks" className="hover:text-white transition-colors">Minor Tweaks</Link>
              </li>
              <li>
                <Link href="/custom-stories" className="hover:text-white transition-colors">Custom Stories</Link>
              </li>
              <li>
                <Link href="/ready-made" className="hover:text-white transition-colors">Ready-Made Shop</Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition-colors">Careers</Link>
              </li>
              <li>
                <Link href="/press" className="hover:text-white transition-colors">Press</Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/help" className="hover:text-white transition-colors">Help Center</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2024 ReadMyBook. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Follow us on Twitter"
            >
              <i className="fab fa-twitter text-xl"></i>
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Follow us on Facebook"
            >
              <i className="fab fa-facebook text-xl"></i>
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Follow us on Instagram"
            >
              <i className="fab fa-instagram text-xl"></i>
            </a>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Subscribe to our YouTube channel"
            >
              <i className="fab fa-youtube text-xl"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
