import React from 'react';
import Header from './Header';
import Footer from './Footer';
import FAQSection from './FAQ';
import AboutSection from './About';
import ConnectSection from './ConnectSection';
import FeedbackSection from './FeedBack';

const HomePage = () => {
  return (
    <div className="bg-gray-100 min-h-screen text-gray-800">
      <Header />
      <ConnectSection />
      <AboutSection />
      <FAQSection />
      <FeedbackSection />
      <Footer />
    </div>
  );
};

export default HomePage;
