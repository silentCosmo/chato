import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-slate-200 dark:text-slate-300 text-center py-6">
      <p>&copy; 2024 Helbeku. All rights reserved.</p>
      <div className="flex justify-center mt-2 space-x-4">
        <a href="#" className="hover:underline">Privacy Policy</a>
        <a href="#" className="hover:underline">Terms of Service</a>
      </div>
    </footer>
  );
};

export default Footer;
