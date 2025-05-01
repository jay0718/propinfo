import Hero from '@/components/home/Hero';
import FeaturedFirms from '@/components/home/FeaturedFirms';
import ComparisonTool from '@/components/home/ComparisonTool';
import ChartSection from '@/components/home/ChartSection';
import ResourcesSection from '@/components/home/ResourcesSection';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';

const Home = () => {
  return (
    <main className="flex-grow">
      <Hero />
      <FeaturedFirms />
      <ComparisonTool />
      {/* <ChartSection /> */}
      <ResourcesSection />
      {/* <Testimonials /> */}
      <Newsletter />
    </main>
  );
};

export default Home;
