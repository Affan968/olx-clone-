import React from 'react'

import mobile from './logo/Mobiles.png'
import vechile from './logo/cars.png'
import property from './logo/property.png'
import property2 from './logo/propertytwo.png'
import electronics from './logo/electronics-home-appliances.png'
import bikes from './logo/bikes.png'
import buissness from './logo/business-industrial-agriculture.png'
import services from './logo/services.png'
import jobs from './logo/jobs.png'
import animal from './logo/animals.png'
import furniture from './logo/furniture-.png'
import fashion from './logo/fashion.png'
import books from './logo/books.png'
import kids from './logo/kids.png'
// import { FolderMinusIcon } from '@heroicons/react/24/solid';
function Products() {
  // Category Data List
  var categories = [
    { id: 1, name: 'Mobiles', icon: mobile },
    { id: 2, name: 'Vehicles', icon: vechile },
    { id: 3, name: 'Property For Sale', icon: property },
    { id: 4, name: 'Property For Rent', icon: property2 }, // Dummy
    { id: 5, name: 'Electronics & Home', icon: electronics },
    { id: 6, name: 'Bikes', icon: bikes }, // Dummy
    { id: 7, name: 'Business, Industrial &', icon: buissness }, // Dummy
    { id: 8, name: 'Services', icon: services },
    { id: 9, name: 'Jobs', icon: jobs },
    { id: 10, name: 'Animals', icon: animal },
    { id: 11, name: 'Furniture & Home Decor', icon: furniture }, // Dummy
    { id: 12, name: 'Fashion & Beauty', icon: fashion }, // Dummy icon
    { id: 13, name: 'Books,Sports & Hobbies',icon:books },
    {id:14, name:'Kids',icon:kids}
  ];
  


  return (
    <div className="container mx-auto px-18 py-8">

      {/* Category Grid Section */}
      <div className="flex justify-center mb-8">

        {/* Grid Container: Flex wrap use kar rahe hain taaki 
           ek row mein zaroorat ke mutabiq categories fit ho saken. */}
        <div className="flex flex-wrap justify-start gap-x-10 gap-y-7 max-w">

          {categories.map((category) => (
            <div
              key={category.id}
              className="w-[80px] sm:w-[90px] text-center cursor-pointer p-1 hover:bg-gray-100 rounded transition duration-200"
            >
              {/* Icon Container (White Box) */}
              <div className="bg-{#F2F4F5}  rounded-lg shadow-md w-16 h-20 sm:w-20 sm:h-24 flex items-center justify-center mx-auto mb-1">
                <img
                  src={category.icon}
                  alt={category.name}
                  className="w-40 h-40 object-contain font-text-2" // Icon size
                />
              </div>

              {/* Category Name */}
              <p className="text-xs font-medium text-gray-700 leading-tight">
                {category.name}
              </p>
            </div>
          ))}

        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-6 text-gray-800">Fresh Recommendations</h2>

      {/* Yahan aapka Purana Product Grid aayega (Recommendations) */}
      <div className="h-64 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500">
        Ad Grid (Products) will be mapped here.
      </div>
    </div>
  );
}

export default Products;