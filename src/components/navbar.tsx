import React from 'react';
import { categories } from '../models/categories';


const Navbar: React.FC = () => {
  return (
    <header className="radial-gradient-bg">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="text-[#F9F8FC] text-xl font-semibold">
        </div>
        <div className="scrolling-container relative overflow-hidden">
            <div className="flex space-x-4 scrolling-banner">
                {categories.map((category, index) => (
                    <a
                    key={`category-${index}`}
                    href="#"
                    className="text-[#F9F8FC] hover:text-[#97B1FA] whitespace-nowrap"
                    >
                    {category.name}
                    </a>
                ))}
                {categories.map((category, index) => (
                    <a
                    key={`category-clone-${index}`}
                    href="#"
                    className="text-[#F9F8FC] hover:text-[#97B1FA] whitespace-nowrap"
                    >
                    {category.name}
                    </a>
                ))}
            </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
