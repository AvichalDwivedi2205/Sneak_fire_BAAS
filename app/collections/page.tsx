import SneakerCard from '@/components/Card/Card';

const sneakers = [
  {
    name: 'Air Jordan 1',
    description: 'A classic sneaker for all sneakerheads.',
    openingBid: 200,
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/sneakbid-e571f.appspot.com/o/sneakerImages%2FAir_Jordans_1.jpeg?alt=media&token=76d93380-dcb2-4ae1-8a80-2a75c23aa777',
    sellerId: 'seller123',
    sizesAvailable: [8, 9, 10],
    status: 'open' as 'open',
    topBids: [{ userId: 'user1', amount: 250 }, { userId: 'user2', amount: 300 }],
  },
  {
    name: 'Yeezy Boost 350 ',
    description: 'The Yeezy Boost 350 is a trendy and comfortable sneaker.',
    openingBid: 150,
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/sneakbid-e571f.appspot.com/o/sneakerImages%2FAir_Jordans_1.jpeg?alt=media&token=76d93380-dcb2-4ae1-8a80-2a75c23aa777', // Using same image for testing
    sellerId: 'seller456',
    sizesAvailable: [8, 9, 10],
    status: 'closed' as 'closed',
    topBids: [{ userId: 'user1', amount: 250 }, { userId: 'user2', amount: 300 }],
  },
  {
    name: 'Yeezy Boost 350 ',
    description: 'The Yeezy Boost 350 is a trendy and comfortable sneaker.',
    openingBid: 150,
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/sneakbid-e571f.appspot.com/o/sneakerImages%2FAir_Jordans_1.jpeg?alt=media&token=76d93380-dcb2-4ae1-8a80-2a75c23aa777', // Using same image for testing
    sellerId: 'seller456',
    sizesAvailable: [8, 9, 10],
    status: 'closed' as 'closed',
    topBids: [{ userId: 'user1', amount: 250 }, { userId: 'user2', amount: 300 }],
  },
  {
    name: 'Yeezy Boost 350 ',
    description: 'The Yeezy Boost 350 is a trendy and comfortable sneaker.',
    openingBid: 150,
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/sneakbid-e571f.appspot.com/o/sneakerImages%2FAir_Jordans_1.jpeg?alt=media&token=76d93380-dcb2-4ae1-8a80-2a75c23aa777', // Using same image for testing
    sellerId: 'seller456',
    sizesAvailable: [8, 9, 10],
    status: 'closed' as 'closed',
    topBids: [{ userId: 'user1', amount: 250 }, { userId: 'user2', amount: 300 }],
  },
  {
    name: 'Yeezy Boost 350 ',
    description: 'The Yeezy Boost 350 is a trendy and comfortable sneaker.',
    openingBid: 150,
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/sneakbid-e571f.appspot.com/o/sneakerImages%2FAir_Jordans_1.jpeg?alt=media&token=76d93380-dcb2-4ae1-8a80-2a75c23aa777', // Using same image for testing
    sellerId: 'seller456',
    sizesAvailable: [8, 9, 10],
    status: 'closed' as 'closed',
    topBids: [{ userId: 'user1', amount: 250 }, { userId: 'user2', amount: 300 }],
  },
  {
    name: 'Yeezy Boost 350 ',
    description: 'The Yeezy Boost 350 is a trendy and comfortable sneaker.',
    openingBid: 150,
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/sneakbid-e571f.appspot.com/o/sneakerImages%2FAir_Jordans_1.jpeg?alt=media&token=76d93380-dcb2-4ae1-8a80-2a75c23aa777', // Using same image for testing
    sellerId: 'seller456',
    sizesAvailable: [8, 9, 10],
    status: 'closed' as 'closed',
    topBids: [{ userId: 'user1', amount: 250 }, { userId: 'user2', amount: 300 }],
  },
  // Add more sneakers for testing
];

export default function Collections() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-4 lg:grid-cols-6">
      {sneakers.map((sneaker, index) => (
        <SneakerCard key={index} sneaker={sneaker} />
      ))}
    </div>
  );
}
