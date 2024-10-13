// app/sneaker/[id]/components/BiddingSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { auth, realtimeDb, firestore } from '@/config/firebase';
import { ref, onValue, push } from 'firebase/database';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { User } from 'firebase/auth';

interface Bid {
  userId: string;
  amount: string;
}

export default function BiddingSection({ sneakerId, openingBid }: { sneakerId: string; openingBid: string }) {
  const [topBids, setTopBids] = useState<Bid[]>([]);
  const [newBid, setNewBid] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const bidsRef = ref(realtimeDb, `bids/${sneakerId}`);
    const unsubscribe = onValue(bidsRef, (snapshot) => {
      const bids = snapshot.val();
      if (bids) {
        const bidsArray: Bid[] = Object.values(bids);
        const sortedBids = bidsArray
          .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
          .slice(0, 3);
        setTopBids(sortedBids);
      } else {
        setTopBids([]);
      }
    });

    return () => unsubscribe();
  }, [sneakerId]);

  const handlePlaceBid = async () => {
    setError(null);
    setIsLoading(true);
  
    if (!user) {
      router.push('/signin');
      return;
    }
  
    if (!newBid || isNaN(parseFloat(newBid))) {
      setError('Please enter a valid bid amount.');
      setIsLoading(false);
      return;
    }
  
    if (parseFloat(newBid) <= parseFloat(openingBid.replace(',', ''))) {
      setError('Your bid must be higher than the opening bid.');
      setIsLoading(false);
      return;
    }

  
    try {
      console.log('Updating real time database')
      const bidRef = ref(realtimeDb, `bids/${sneakerId}`);
      await push(bidRef, { userId: user.email, amount: newBid });
      console.log("Bid successfully pushed to Realtime Database");
  
      const sneakerRef = doc(firestore, 'sneakers', sneakerId);
      await updateDoc(sneakerRef, {
        topBids: arrayUnion({ userId: user.email, amount: newBid })
      });
      console.log("Bid successfully updated in Firestore");
  
      setNewBid('');
      console.log('Bid placed successfully!');
    } catch (err) {
      console.error('Error placing bid:', err);
      setError('An error occurred while placing your bid. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Current Bids</h2>
      {topBids.length > 0 ? (
        <ul className="mb-4">
          {topBids.map((bid, index) => (
            <li key={index} className="mb-2">
              {bid.userId}: ₹{bid.amount}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-4">No bids placed yet.</p>
      )}
      <div className="flex flex-col gap-2">
        <input
          type="number"
          value={newBid}
          onChange={(e) => setNewBid(e.target.value)}
          placeholder="Enter your bid"
          className="border rounded px-3 py-2 w-full"
        />
        <button
          onClick={handlePlaceBid}
          disabled={isLoading}
          className={`bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Placing Bid...' : 'Place Bid'}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}