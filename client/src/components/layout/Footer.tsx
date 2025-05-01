import { Link } from "wouter";
import { 
  Twitter, 
  Linkedin, 
  Youtube, 
  Instagram 
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-neutral-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <span className="text-white text-xl font-bold">
              PROP<span className="text-primary-500">KOREA</span>
            </span>
            <p className="text-neutral-300 text-base">
              The most comprehensive resource for prop trading firms comparison, reviews, and educational content.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-neutral-400 hover:text-neutral-300">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-neutral-300">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-neutral-300">
                <span className="sr-only">YouTube</span>
                <Youtube className="h-6 w-6" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-neutral-300">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-neutral-200 tracking-wider uppercase">
                  Prop Firms
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <Link href="/firms" className="text-base text-neutral-300 hover:text-white">
                      Directory
                    </Link>
                  </li>
                  <li>
                    <Link href="/reviews" className="text-base text-neutral-300 hover:text-white">
                      Reviews
                    </Link>
                  </li>
                  <li>
                    <Link href="/compare" className="text-base text-neutral-300 hover:text-white">
                      Comparison Tool
                    </Link>
                  </li>
                  <li>
                    <Link href="/firms" className="text-base text-neutral-300 hover:text-white">
                      Ratings
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-neutral-200 tracking-wider uppercase">
                  Resources
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <Link href="/resources" className="text-base text-neutral-300 hover:text-white">
                      Guides
                    </Link>
                  </li>
                  <li>
                    <Link href="/resources" className="text-base text-neutral-300 hover:text-white">
                      Tutorials
                    </Link>
                  </li>
                  <li>
                    <Link href="/resources" className="text-base text-neutral-300 hover:text-white">
                      Trading Strategies
                    </Link>
                  </li>
                  <li>
                    <Link href="/resources" className="text-base text-neutral-300 hover:text-white">
                      Glossary
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-neutral-200 tracking-wider uppercase">
                  Company
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-neutral-300 hover:text-white">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-neutral-300 hover:text-white">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-neutral-300 hover:text-white">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-neutral-300 hover:text-white">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-neutral-200 tracking-wider uppercase">
                  Legal
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-neutral-300 hover:text-white">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-neutral-300 hover:text-white">
                      Terms
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-neutral-300 hover:text-white">
                      Disclosure
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-neutral-300 hover:text-white">
                      Cookies
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-neutral-700 pt-8">
          <p className="text-base text-neutral-400 xl:text-center">
            &copy; {new Date().getFullYear()} propkorea.com. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
