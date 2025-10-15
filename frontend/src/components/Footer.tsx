import { Facebook, Twitter, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/assets/namssn-logo.png" 
                alt="NAMSSN Logo" 
                className="h-8 w-8 object-contain"
              />
              <div>
                <h3 className="text-lg font-bold">NAMSSN OAU</h3>
                <p className="text-sm text-gray-300">Mathematical Science Students</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              Empowering mathematical science students through excellence in education, 
              research, and community engagement at Obafemi Awolowo University.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
              <li><a href="/academics" className="text-gray-300 hover:text-white transition-colors">Academic Resources</a></li>
              <li><a href="/editorial" className="text-gray-300 hover:text-white transition-colors">Editorial</a></li>
              <li><a href="/events" className="text-gray-300 hover:text-white transition-colors">Events & Gallery</a></li>
              <li><a href="/newsletter" className="text-gray-300 hover:text-white transition-colors">Newsletter</a></li>
            </ul>
          </div>

          {/* Student Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Student Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/academics" className="text-gray-300 hover:text-white transition-colors">Study Materials</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-1 text-gray-300" />
                <span className="text-gray-300">
                  Department of Mathematics<br />
                  Obafemi Awolowo University<br />
                  Ile-Ife, Osun State, Nigeria
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-300" />
                <span className="text-gray-300">namssn@oauife.edu.ng</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-300" />
                <span className="text-gray-300">+234 XXX XXX XXXX</span>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-6">
              <h5 className="text-sm font-semibold mb-3">Follow Us</h5>
              <div className="flex space-x-3">
                <a 
                  href="https://facebook.com/namssnoau" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-blue-600 p-2 rounded-full transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a 
                  href="https://x.com/namssnoau" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a 
                  href="mailto:namssn@oauife.edu.ng"
                  className="bg-gray-800 hover:bg-red-600 p-2 rounded-full transition-colors"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-300">
            <p>&copy; 2024 NAMSSN OAU Chapter. All rights reserved.</p>
            <div className="mt-2 md:mt-0 space-x-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}