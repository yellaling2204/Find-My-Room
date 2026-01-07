import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { AvailableLocations } from '@/components/home/AvailableLocations';
import { FeaturedRooms } from '@/components/home/FeaturedRooms';
import { HowItWorks } from '@/components/home/HowItWorks';
import { CTASection } from '@/components/home/CTASection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <AvailableLocations />
      <FeaturedRooms />
      <HowItWorks />
      <CTASection />
    </Layout>
  );
};

export default Index;
