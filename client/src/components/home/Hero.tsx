import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Hero = () => {
  const [search, setSearch] = useState('');
  const [_, navigate] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/firms?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <div className="relative bg-primary-800 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-primary-800 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
          <div className="pt-10 sm:pt-16 lg:pt-8 lg:pb-14 lg:overflow-hidden">
            <div className="mx-auto max-w-7xl lg:px-8">
              <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:px-0 lg:text-left lg:flex lg:items-center">
                  <div className="lg:py-24">
                    <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-white sm:mt-5 sm:text-5xl lg:mt-6">
                      Find the Best <span className="text-primary-500">Prop Trading</span> Firms
                    </h1>
                    <p className="mt-3 text-base text-neutral-300 sm:mt-5 sm:text-xl lg:text-lg">
                      Compare trading conditions, leverage, profit splits, and more across the top proprietary trading firms in the industry.
                    </p>
                    <div className="mt-10 sm:mt-12">
                      <form onSubmit={handleSearch} className="sm:max-w-xl sm:mx-auto lg:mx-0">
                        <div className="sm:flex">
                          <div className="min-w-0 flex-1">
                            <Input
                              type="text"
                              placeholder="Search for prop firms..."
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              className="block w-full px-4 py-3 rounded-md border-0 text-base text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                          <div className="mt-3 sm:mt-0 sm:ml-3">
                            <Button 
                              type="submit" 
                              className="block w-full py-3 px-4 rounded-md shadow bg-primary-500 text-white font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                              Search
                            </Button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="mt-12 lg:relative lg:mt-0">
                  <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0">
                    <img
                      className="w-full lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-auto lg:max-w-none rounded-lg shadow-lg"
                      src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=800&h=600"
                      alt="Professional trading workspace"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
