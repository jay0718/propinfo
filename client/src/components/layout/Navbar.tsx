import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-mobile";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Prop Firms', href: '/firms' },
  { name: 'Compare', href: '/compare' },
  { name: 'Resources', href: '/resources' },
  { name: 'Reviews', href: '/reviews' },
];

const Navbar = () => {
  const [location] = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <span className="text-primary-700 text-xl font-bold cursor-pointer">
                  PROP<span className="text-primary-500">KOREA</span>
                </span>
              </Link>
            </div>
            
            {!isMobile && (
              <nav className="ml-6 flex space-x-8" aria-label="Main Navigation">
                {navigation.map((item) => (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location === item.href
                        ? 'border-primary-500 text-neutral-900'
                        : 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            )}
          </div>
          
          {!isMobile ? (
            <div className="ml-6 flex items-center">
              <Link href="/login">
                <Button variant="default" className="bg-primary-500 hover:bg-primary-600">
                  Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[250px] sm:w-[300px]">
                  <nav className="flex flex-col mt-6">
                    {navigation.map((item) => (
                      <Link 
                        key={item.name} 
                        href={item.href}
                        className={`px-3 py-2 rounded-md text-base font-medium ${
                          location === item.href
                            ? 'bg-primary-500 text-white'
                            : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                    <div className="mt-6 pt-6 border-t border-neutral-200">
                      <Link href="/login">
                        <Button onClick={() => setIsOpen(false)} className="w-full bg-primary-500 hover:bg-primary-600">
                          Sign In
                        </Button>
                      </Link>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
