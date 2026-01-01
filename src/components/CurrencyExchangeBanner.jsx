import React from 'react';

function CurrencyExchangeBanner() {
  const currencies = [
    { country: 'Chinese Yuan (RMB)', buy: '41.50', sell: '43.00', color: 'bg-red-600' },
    { country: 'US Dollar (USD)', buy: '281.00', sell: '281.45', color: 'bg-yellow-600' },
    { country: 'British Pound (GBP)', buy: '374.20', sell: '378.00', color: 'bg-red-700' },
    { country: 'Saudi Riyal (SAR)', buy: '74.80', sell: '75.50', color: 'bg-green-600' },
    { country: 'Emirates Dirham (AED)', buy: '76.45', sell: '77.50', color: 'bg-green-700' },
    { country: 'Turkish Lira (TRY)', buy: '6.50', sell: '7.50', color: 'bg-red-800' },
  ];

  const CurrencyTile = ({ country, buy, sell, color }) => (
    <div className="flex items-center p-3 border-r border-gray-200">
      <div className={`h-6 w-6 rounded-full ${color} mr-2 flex-shrink-0`}>
        {/* Flag Icon Placeholder */}
      </div>
      <div className="text-xs flex-grow">
        <p className="font-semibold">{country}</p>
        <div className="flex space-x-2 mt-0.5">
          <span className="text-red-600">Buy: {buy}</span>
          <span className="text-gray-600">Sell: {sell}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 mt-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden shadow-lg">
        
        {/* Left Section: Currency Tiles */}
        <div className="lg:col-span-8 bg-white flex flex-wrap border-r border-gray-200">
          {currencies.map((currency, index) => (
            <div key={index} className="w-1/3 border-b border-r last:border-r-0 lg:border-b-0 lg:w-1/6">
              <CurrencyTile {...currency} />
            </div>
          ))}
          
          {/* Link Exchange Ad */}
          <div className="w-full p-4 flex items-center justify-center bg-yellow-400 font-bold text-2xl text-center flex-col">
              <img 
                  src="https://via.placeholder.com/150x50?text=Link+X" 
                  alt="Link Exchange Logo" 
                  className="h-10 mb-2"
              />
              <span className="text-2xl font-extrabold text-blue-900">CURRENCY EXCHANGE</span>
              <span className="text-sm font-normal text-gray-800">Send & Receive Money across borders with Link Exchange</span>
          </div>

        </div>

        {/* Right Section: Western Union Ad */}
        <div className="lg:col-span-4 bg-yellow-500 flex items-center justify-center p-4">
            <div className="text-center">
                <span className="text-2xl font-extrabold text-blue-900">W Western Union</span>
                <p className="text-xs mt-2 text-gray-800">MoneyGram, Ria, etc.</p>
            </div>
        </div>
      </div>
    </div>
  );
}

export default CurrencyExchangeBanner;