import React from 'react';
import Image from 'next/image'; // Import the Image component from Next.js
import { Sneaker } from '@/schema/schema';

const SneakerCard = ({ sneaker }: { sneaker: Sneaker }) => {
  // Safely calculate the highest bid when bidding is closed
  const highestBid = sneaker.topBids.length > 0 ? Math.max(...sneaker.topBids.map(bid => bid.amount)) : null;

  return (
    <div className="w-full h-auto mx-auto">
      <div className="relative group cursor-pointer transition-transform transform hover:scale-105 duration-300">
        {/* Sneaker Image */}
        <div className="relative overflow-hidden rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-800 group-hover:border-blue-500 transition-all duration-500">
          <div className="w-full h-64"> {/* Fixed height for rectangular shape */}
            <Image
              src={sneaker.imageUrls.sideView}
              alt={sneaker.name}
              width={320} // Fixed width
              height={256} // Fixed height to create a rectangular frame
              className="w-full h-full object-cover" // Ensures the image fills the container while maintaining aspect ratio
              placeholder="blur"
              blurDataURL="/placeholder-sneaker.jpg"
            />
          </div>
        </div>

        {/* Card Details */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-b-lg border border-t-0 dark:border-gray-800">
          {/* Sneaker Name (Truncate with ellipsis and show tooltip on hover) */}
          <h3
            className="text-sm md:text-md font-bold text-gray-900 dark:text-white whitespace-nowrap overflow-hidden overflow-ellipsis"
            title={sneaker.name}  // Tooltip shows the full name on hover
          >
            {sneaker.name}
          </h3>

          {/* Opening or Closing Bid */}
          {sneaker.status === 'open' ? (
            <>
              <p className="mt-2 text-sm md:text-md text-gray-700 dark:text-gray-400">
                Opening Bid:
              </p>
              <p className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                ${sneaker.openingBid}
              </p>
            </>
          ) : (
            <>
              <p className="mt-2 text-sm md:text-md text-gray-700 dark:text-gray-400">
                Closing Bid:
              </p>
              <p>
                {highestBid !== null ? <p className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">${highestBid}</p> : 
                'No bids placed'}
              </p>
            </>
          )}

          {/* Bidding Status */}
          <p
            className={`mt-2 text-sm font-semibold ${
              sneaker.status === 'open' ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {sneaker.status === 'open' ? 'Bidding Open' : 'Bidding Closed'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SneakerCard;
