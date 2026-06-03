import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ServicesSection from '../components/ServicesSection'
import WhyUsSection from '../components/WhyUsSection'
import DTFSection from '../components/DTFSection'
import TestimonialsSection from '../components/TestimonialsSection'
import ContactSection from '../components/ContactSection'
import Footer from '../components/Footer'
import BackToTop from '../components/BackToTop'

export default function Storefront() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Hero />
      <ServicesSection />
      <WhyUsSection />
      <DTFSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
      <BackToTop />
    </div>
  )
}
