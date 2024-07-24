import React from 'react';

const WelcomeSection = () => {
  return (
    <section id="welcome" className="py-20 px-4 bg-gradient-to-b from-gray-50 to-indigo-500 text-center text-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold mb-6">Welcome to Helbeku – Where Connections Begin!</h2>
        <p className="text-lg mb-8">
          Dive into Helbeku, the platform designed for those who seek meaningful connections and exciting conversations. Whether you're here out of boredom, loneliness, curiosity about different cultures, or just for fun, we offer a space for authentic interactions. Connect with people who share your interests and start chatting today!
        </p>
        <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">Start Connecting</button>
      </div>
    </section>
  );
};

export default WelcomeSection;
