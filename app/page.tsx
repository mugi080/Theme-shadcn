import AnnouncementSlideshow from "@/components/layout/landing-page/AnnouncementsSlideshow";
import CTASection from '@/components/layout/landing-page/CTASection';
import FeaturesSection from '@/components/layout/landing-page/FeaturesSection';
import Footer from '@/components/layout/landing-page/Footer';
import HeroSection from '@/components/layout/landing-page/HeroSection';

import Navbar from '@/components/layout/landing-page/Navbar';


const page = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <AnnouncementSlideshow />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  )
}

export default page