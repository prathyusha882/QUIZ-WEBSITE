import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-indigo-700 text-white p-4 mt-auto">
      <div className="container mx-auto text-center text-sm">
        &copy; {new Date().getFullYear()} Quiz Website. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
