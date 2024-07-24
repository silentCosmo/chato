import React from 'react';

const ConnectSection = () => {
  return (
    <section className="flex md:text-base text-sm flex-col items-center justify-center min-h-screen text-center py-20 md:px-0 px-2 bg-gray-50 dark:bg-slate-900">
      <h1 className="md:text-5xl text-3xl font-extrabold text-transparent bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-500 dark:to-blue-800 bg-clip-text mb-4">Connect with People</h1>
      <p className="md:text-xl text-sm text-gray-700 dark:text-gray-400 mb-6">Type your interests and select the mode of connection.</p>
      <div className="flex flex-col items-center space-y-4">
        <input
          type="text"
          placeholder="Enter your interests..."
          className="w-80 p-3 dark:placeholder-slate-500 dark:bg-slate-700 dark:text-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <div className="flex space-x-4">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors duration-300">
            Text
          </button>
          <button className="bg-slate-500 opacity-50 text-white px-6 py-3 rounded-md cursor-not-allowed">Video (Coming Soon)</button>
        </div>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors duration-300 mt-4">
          Connect
        </button>
      </div>
    </section>
  );
};

export default ConnectSection;
