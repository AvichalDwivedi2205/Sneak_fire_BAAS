// app/sneaker/[id]/components/BiddingSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { auth, realtimeDb, firestore } from '@/config/firebase';
import { ref, onValue, set, get } from 'firebase/database';
import { doc, getDoc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { User } from 'firebase/auth';
import { Sneaker, Bid } from '@/schema/schema'; // Assuming you have these types defined in a separate file

export default function BiddingSection({ sneakerId, openingBid }: { sneakerId: string; openingBid: string }) {
  const [topBids, setTopBids] = useState<Bid[]>([]);
  const [newBid, setNewBid] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sneakerData, setSneakerData] = useState<Sneaker | null>(null);
  const [lastBidTime, setLastBidTime] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchSneakerData = async () => {
      const sneakerRef = doc(firestore, 'sneakers', sneakerId);
      const sneakerSnap = await getDoc(sneakerRef);
      if (sneakerSnap.exists()) {
        setSneakerData(sneakerSnap.data() as Sneaker);
      }
    };

    fetchSneakerData();
  }, [sneakerId]);

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

    if (!sneakerData) {
      setError('Unable to retrieve sneaker data.');
      setIsLoading(false);
      return;
    }

    if (sneakerData.status !== 'open') {
      setError('Bidding is closed for this item.');
      setIsLoading(false);
      return;
    }

    if (user.email === sneakerData.sellerId) {
      setError('Sellers cannot bid on their own items.');
      setIsLoading(false);
      return;
    }

    const bidAmount = parseFloat(newBid);
    if (!bidAmount || isNaN(bidAmount)) {
      setError('Please enter a valid bid amount.');
      setIsLoading(false);
      return;
    }

    if (bidAmount <= parseFloat(openingBid.replace(',', ''))) {
      setError('Your bid must be higher than the opening bid.');
      setIsLoading(false);
      return;
    }

    const now = Date.now();
    if (now - lastBidTime < 120000) { // 2 minutes in milliseconds
      setError('Please wait 2 minutes before placing another bid.');
      setIsLoading(false);
      return;
    }

    try {
      const bidRef = ref(realtimeDb, `bids/${sneakerId}/${user.uid}`);
      const currentBid = await get(bidRef);

      if (currentBid.exists()) {
        const existingBid = parseFloat(currentBid.val().amount);
        if (bidAmount <= existingBid) {
          setError('Your new bid must be higher than your previous bid.');
          setIsLoading(false);
          return;
        }
      }

      await set(bidRef, { userId: user.uid, amount: bidAmount.toString() });

      const sneakerRef = doc(firestore, 'sneakers', sneakerId);
      await updateDoc(sneakerRef, {
        topBids: arrayUnion({ userId: user.uid, amount: bidAmount.toString() })
      });

      const userRef = doc(firestore, 'users', user.uid);
      await setDoc(userRef, { lastBidTime: now }, { merge: true });

      setNewBid('');
      setLastBidTime(now);
      console.log('Bid placed successfully!');
    } catch (err) {
      console.error('Error placing bid:', err);
      setError('An error occurred while placing your bid. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderBids = () => {
    const bidLabels = ['Highest Bid', 'Second Highest Bid', 'Third Highest Bid'];
    return topBids.map((bid, index) => (
      <li key={index} className="mb-2">
        {bidLabels[index]} - ₹{parseFloat(bid.amount).toLocaleString()}
      </li>
    ));
  };

  if (!sneakerData) {
    return <div>Loading...</div>;
  }

  const canBid = user && user.email !== sneakerData.sellerId && sneakerData.status === 'open';

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 dark:text-white text-gray-900 animate-bounce">Top Bids</h2>
      {topBids.length > 0 ? (
        <ul className="mb-4 font-semibold">{renderBids()}</ul>
      ) : (
        <p className="mb-4 dark:text-gray-300 text-gray-700 font-semibold">No bids placed yet.</p>
      )}
      {sneakerData.status === 'open' ? (
        canBid ? (
          <div className="flex flex-col gap-2">
            <input
              type="number"
              value={newBid}
              onChange={(e) => setNewBid(e.target.value)}
              placeholder="Enter your bid"
              className="border rounded px-3 py-2 w-full dark:bg-gray-800 bg-gray-200 dark:text-white text-gray-900"
            />
            <button
              onClick={handlePlaceBid}
              disabled={isLoading}
              className={`bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-all ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Placing Bid...' : 'Place Bid'}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        ) : (
          <p className="dark:text-gray-300 text-gray-700">Seller cannot place a bid on their own item.</p>
        )
      ) : (
        <p className="text-red-500 font-bold">Bidding Closed</p>
      )}
    </div>
  );
  
}