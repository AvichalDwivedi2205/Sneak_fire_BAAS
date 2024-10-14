import { Sneaker } from '@/schema/schema';

export default function SneakerDetails({ sneaker }: { sneaker: Sneaker }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2 dark:text-white text-gray-900">{sneaker.name}</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{sneaker.type}</p>
      <p className="mb-4 dark:text-gray-300 text-gray-700">{sneaker.description}</p>
      <p className="font-semibold mb-2 dark:text-white text-gray-900">Sizes Available:</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {sneaker.sizesAvailable.map((size) => (
          <span key={size} className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full">
            {size}
          </span>
        ))}
      </div>
      <p className="font-semibold dark:text-white text-gray-900">Opening Bid: ₹{sneaker.openingBid}</p>
    </div>
  );
  
}