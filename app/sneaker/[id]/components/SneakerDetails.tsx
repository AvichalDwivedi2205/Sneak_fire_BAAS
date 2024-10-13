import { Sneaker } from '@/schema/schema';

export default function SneakerDetails({ sneaker }: { sneaker: Sneaker }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">{sneaker.name}</h1>
      <p className="text-gray-600 mb-4">{sneaker.type}</p>
      <p className="mb-4">{sneaker.description}</p>
      <p className="font-semibold mb-2">Sizes Available:</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {sneaker.sizesAvailable.map((size) => (
          <span key={size} className="px-3 py-1 bg-gray-200 rounded-full">
            {size}
          </span>
        ))}
      </div>
      <p className="font-semibold">Opening Bid: ₹{sneaker.openingBid}</p>
    </div>
  );
}