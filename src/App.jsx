import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import useLenis from './hooks/useLenis';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import MenuPage from './pages/MenuPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import BookingEnquiryPage from './pages/BookingEnquiryPage';
import GiftsPage from './pages/GiftsPage';
import BookingModal from './components/BookingModal';
import EnquiryModal from './components/EnquiryModal';
import Chatbot from './components/Chatbot';

export default function App() {
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  // Initialize Lenis Smooth Scroll with GSAP ScrollTrigger
  useLenis();

  const handleOpenBook = () => {
    window.open('https://booking.resdiary.com/widget/Standard/BaskkItalian/11276', '_blank', 'noopener,noreferrer');
  };

  return (
    <BrowserRouter>
      <div className="baskk-app-root">
        <ScrollToTop />

        {/* Multi-Page Routes */}
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                onOpenBook={handleOpenBook} 
                onOpenEnquiry={() => setIsEnquiryOpen(true)} 
              />
            } 
          />
          <Route 
            path="/about" 
            element={
              <AboutPage 
                onOpenBook={handleOpenBook} 
                onOpenEnquiry={() => setIsEnquiryOpen(true)} 
              />
            } 
          />
          <Route 
            path="/menu" 
            element={
              <MenuPage 
                onOpenBook={handleOpenBook} 
              />
            } 
          />
          <Route 
            path="/blog" 
            element={
              <BlogPage 
                onOpenBook={handleOpenBook} 
                onOpenEnquiry={() => setIsEnquiryOpen(true)} 
              />
            } 
          />
          <Route 
            path="/contact" 
            element={
              <ContactPage 
                onOpenBook={handleOpenBook} 
              />
            } 
          />
          <Route 
            path="/booking-enquiry" 
            element={
              <BookingEnquiryPage 
                onOpenBook={handleOpenBook} 
              />
            } 
          />
          <Route 
            path="/enquiry" 
            element={
              <BookingEnquiryPage 
                onOpenBook={handleOpenBook} 
              />
            } 
          />
          <Route 
            path="/functions" 
            element={
              <BookingEnquiryPage 
                onOpenBook={handleOpenBook} 
              />
            } 
          />
          <Route 
            path="/gifts" 
            element={
              <GiftsPage 
                onOpenBook={handleOpenBook} 
              />
            } 
          />
          <Route 
            path="/gift-vouchers" 
            element={
              <GiftsPage 
                onOpenBook={handleOpenBook} 
              />
            } 
          />
        </Routes>

        {/* Interactive Reservation Drawer */}
        <BookingModal 
          isOpen={isBookOpen} 
          onClose={() => setIsBookOpen(false)} 
        />

        {/* Interactive Functions Enquiry Modal */}
        {EnquiryModal && (
          <EnquiryModal 
            isOpen={isEnquiryOpen} 
            onClose={() => setIsEnquiryOpen(false)} 
          />
        )}

        {/* Floating Baskk Concierge Chatbot */}
        <Chatbot onOpenBook={handleOpenBook} />
      </div>
    </BrowserRouter>
  );
}
