import React from 'react';
import Header from './Header';
import Footer from './Footer';
import FAQSection from './FAQ';
import AboutSection from './About';
import ConnectSection from './ConnectSection';

const HomePage = () => {
  return (
    <div className="bg-gray-100 min-h-screen text-gray-800">
      <Header />
      <ConnectSection />
      <AboutSection/>
      <FAQSection/>
      <Footer/>
    </div>
  );
};

export default HomePage;
