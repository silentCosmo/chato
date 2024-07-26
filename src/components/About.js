import React from 'react';
import { FaCogs, FaBullhorn, FaUsers, FaShareAlt } from 'react-icons/fa'; // Import icons

const AboutSection = () => {
  return (
    <section id="about" className="py-16 px-4 bg-gray-100 dark:bg-slate-800 text-center">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-6">
          Discover the Heart of Helbeku
        </h2>
        <p className="text-sm sm:text-base text-justify text-gray-600 dark:text-gray-300 mb-12">
          Helbeku is a platform designed to connect people from all walks of life without requiring any sign-up. Whether you&apos;re looking to overcome boredom, reduce loneliness, explore new cultures, or simply have some fun, Helbeku is here for you. Our mission is to foster genuine connections and enrich your social experience while keeping our service completely free of charge.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          <div className="p-6 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 hover:scale-95 duration-300 group">
            <div className="flex items-center justify-center mb-4">
              <FaCogs className="text-3xl text-gray-700 dark:text-gray-300 mr-2" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Update
              </h3>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              We&apos;re continuously working to enhance Helbeku. During scheduled maintenance periods, you might experience temporary issues. We appreciate your patience and welcome any feedback or suggestions through Discord or our feedback button.
            </p>
          </div>
          <div className="p-6 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 hover:scale-95 duration-300 group">
            <div className="flex items-center justify-center mb-4">
              <FaBullhorn className="text-3xl text-gray-700 dark:text-gray-300 mr-2" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Our Mission
              </h3>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              We aim to provide a platform that fosters meaningful conversations, reduces social anxiety, and promotes authentic connections. Explore, chat, and be yourself with Helbeku all for free and without needing to sign up.
            </p>
          </div>
          <div className="p-6 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 hover:scale-95 duration-300 group">
            <div className="flex items-center justify-center mb-4">
              <FaUsers className="text-3xl text-gray-700 dark:text-gray-300 mr-2" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Get Involved
              </h3>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Your feedback helps us grow. Share your ideas and suggestions with us via Discord or the feedback button on our site. Together, we can make Helbeku better for everyone.
            </p>
          </div>
          <div className="p-6 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 hover:scale-95 duration-300 group">
            <div className="flex items-center justify-center mb-4">
              <FaShareAlt className="text-3xl text-gray-700 dark:text-gray-300 mr-2" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Share the Love
              </h3>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Help us expand our community by sharing Helbeku with friends and on social media. Your support is invaluable and helps us bring more diverse interactions to the platform.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
