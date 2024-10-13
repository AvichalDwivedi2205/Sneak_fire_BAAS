import React from 'react';
import Image from 'next/image';
import { Sneaker } from '@/schema/schema';

const SneakerCard = ({ sneaker }: { sneaker: Sneaker }) => {
  const highestBid = 
    sneaker.topBids.length > 0 
      ? Math.max(...sneaker.topBids.map(bid => parseFloat(bid.amount))) 
      : null;

  return (
    <div className="w-full h-auto mx-auto">
      <div className="relative group cursor-pointer transition-transform transform hover:scale-105 duration-300">
        <div className="relative overflow-hidden rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-800 group-hover:border-blue-500 transition-all duration-500">
          <div className="w-full h-32">
            <Image
              src={sneaker.imageUrls[1]}
              alt={sneaker.name}
              width={320}
              height={256}
              className="w-full h-full object-contain"
              placeholder="blur"
              blurDataURL="/placeholder-sneaker.jpg"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-b-lg border border-t-0 dark:border-gray-800">
          <h3
            className="text-sm md:text-md font-bold text-gray-900 dark:text-white whitespace-nowrap overflow-hidden overflow-ellipsis"
            title={sneaker.name}
          >
            {sneaker.name}
          </h3>

          {sneaker.status === 'open' ? (
            <>
              <p className="mt-2 text-sm md:text-md text-gray-700 dark:text-gray-400">
                Opening Bid:
              </p>
              <p className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
              &#8377;{sneaker.openingBid}
              </p>
            </>
          ) : (
            <>
              <p className="mt-2 text-sm md:text-md text-gray-700 dark:text-gray-400">
                Closing Bid:
              </p>
              <p className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                {highestBid !== null ? `$${highestBid}` : 'No bids placed'}
              </p>
            </>
          )}

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
