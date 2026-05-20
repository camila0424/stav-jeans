import HeroSection from '../sections/home/HeroSection'
import InfoStrip from '../components/common/InfoStrip'
import FeaturedProducts from '../sections/home/FeaturedProducts'
import ReviewsSection from '../sections/home/ReviewsSection'
import SizeGuide from '../sections/home/SizeGuide'
import InstagramFeed from '../sections/home/InstagramFeed'

function HomePage() {
  return (
    <>
      <HeroSection />
      <InfoStrip />
      <FeaturedProducts />
      <ReviewsSection />
      <SizeGuide />
      <InstagramFeed />
    </>
  )
}

export default HomePage
