import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import KineticMarquee from '../components/KineticMarquee';
import AboutBaskk from '../components/AboutBaskk';
import Experience from '../components/Experience';
import MenuPreview from '../components/MenuPreview';
import SignatureDish from '../components/SignatureDish';
import Story from '../components/Story';
import Events from '../components/Events';
import GiftVoucher from '../components/GiftVoucher';
import Gallery from '../components/Gallery';
import Reviews from '../components/Reviews';
import Location from '../components/Location';
import ReservationCTA from '../components/ReservationCTA';
import Footer from '../components/Footer';

export default function Home({ onOpenBook, onOpenEnquiry }) {
  return (
    <div className="home-page-wrap">
      <Navbar onOpenBook={onOpenBook} />
      <main>
        {/* Cinematic Hero */}
        <Hero onOpenBook={onOpenBook} />

        {/* Kinetic Moving Ribbon */}
        <KineticMarquee variant="terracotta" />

        {/* Section 1: About Baskk (matching http://baskk.co/#About) */}
        <AboutBaskk onOpenBook={onOpenBook} onOpenEnquiry={onOpenEnquiry} />

        {/* Section 2: Pinned Horizontal Experience */}
        <Experience />

        {/* Section 3: Signature Menu */}
        <MenuPreview />

        {/* Section 4: Signature Dish Feature */}
        <SignatureDish onOpenBook={onOpenBook} />

        {/* Section 5: Brand Story */}
        <Story />

        {/* Private Events & Celebrations Banner */}
        <Events onOpenEnquiry={onOpenEnquiry} />

        {/* Section: Gift Vouchers ($50, $100, $200 via Stripe) */}
        <GiftVoucher />

        {/* Section 6: Asymmetric Masonry Gallery & Lightbox */}
        <Gallery />

        {/* Guest Praise & Reviews Ticker */}
        <Reviews />

        {/* Section 7: Location & Hours */}
        <Location onOpenBook={onOpenBook} />

        {/* Section 8: Reservation CTA */}
        <ReservationCTA onOpenBook={onOpenBook} />
      </main>
      
      {/* Footer with Kaushalam Technology credit */}
      <Footer onOpenBook={onOpenBook} />
    </div>
  );
}
