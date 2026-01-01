import React from 'react';
import { ChevronDownIcon }  from '@heroicons/react/24/solid'
;

function CategoryBar() {
    const categories = [
        "Mobile Phones", "Cars", "Motorcycles", "Houses", "Video-Audios", 
        "Tablets", "Land & Plots"
    ];

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 py-3">
            <div className="container mx-auto px-4 flex items-center overflow-x-auto whitespace-nowrap scrollbar-hide">
                
                {/* All Categories Dropdown (Jaisa screenshot mein hai) */}
                <div className="flex items-center text-black font-bold mr-6 cursor-pointer hover:text-blue-900 transition-colors">
                    <span className="text-sm">All Categories</span>
                    <ChevronDownIcon className="h-4 w-4 ml-1" />
                </div>
                
                {/* Main Category Links */}
                {categories.map((category, index) => (
                    <a
                        key={index}
                        href="#"
                        className="text-gray-800 hover:text-blue-900 text-sm font-medium py-1 px-3 mx-1 flex-shrink-0 transition-colors"
                    >
                        {category}
                    </a>
                ))}
            </div>
        </nav>
    );
}

export default CategoryBar;