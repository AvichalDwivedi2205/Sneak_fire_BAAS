"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Sneaker } from "@/schema/schema";
import { auth, firestore, storage, realtimeDb } from "@/config/firebase";
import { getDoc } from "firebase/firestore";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from "firebase/storage";
import { ref as databaseRef, remove } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import SneakerCard from "@/components/Card/Card";

const SellerDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [sneakers, setSneakers] = useState<Sneaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [newSneaker, setNewSneaker] = useState<Partial<Sneaker>>({
    name: "",
    type: "",
    description: "",
    openingBid: "",
    sizesAvailable: [],
  });
  const [images, setImages] = useState<Record<string, File | null>>({
    front: null,
    side: null,
    back: null,
    other_side: null,
  });

  const imageRefs = {
    front: useRef<HTMLInputElement>(null),
    side: useRef<HTMLInputElement>(null),
    back: useRef<HTMLInputElement>(null),
    other_side: useRef<HTMLInputElement>(null),
  };

  const router = useRouter();

  useEffect(() => {
    const checkSellerStatus = async (currentUser: any) => {
      try {
        const userDocRef = doc(firestore, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          console.log("No user document exists");
          router.push("/signin");
          return false;
        }

        const userData = userDocSnap.data();
        
        // Only redirect if both conditions are false
        if (!userData.isSeller || userData.sellerVerification !== 'verified') {
          console.log("User is not a verified seller");
          router.push("/contact");
          return false;
        }

        return true;
      } catch (error) {
        console.error("Error checking seller status:", error);
        return false;
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        console.log("No current user");
        router.push("/signin");
        return;
      }

      const isVerifiedSeller = await checkSellerStatus(currentUser);
      
      if (isVerifiedSeller) {
        await fetchUserAndSneakers(currentUser);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchUserAndSneakers = async (currentUser: any): Promise<void> => {
    try {
      // Get user data
      const userDocRef = doc(firestore, "users", currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data() as User;
        setUser(userData);
      }

      // Get sneakers data
      const sneakersQuery = query(
        collection(firestore, "sneakers"),
        where("sellerId", "==", currentUser.email)
      );
      const sneakerDocs = await getDocs(sneakersQuery);

      const sneakersData = sneakerDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Sneaker[];

      setSneakers(sneakersData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setNewSneaker((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizesChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const sizes = e.target.value.split(",").map((size) => size.trim());
    setNewSneaker((prev) => ({ ...prev, sizesAvailable: sizes }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>, type: string): void => {
    if (e.target.files?.[0]) {
      setImages((prev) => ({ ...prev, [type]: e.target.files?.[0] || null }));
    }
  };

  const uploadImages = async (sneakerId: string): Promise<string[]> => {
    const imageUrls: string[] = [];
    const imageTypes = Object.keys(images);

    for (const type of imageTypes) {
      const imageFile = images[type];
      if (imageFile) {
        const imageRef = ref(storage, `sneakers/${sneakerId}/${type}.jpg`);
        await uploadBytes(imageRef, imageFile);
        const url = await getDownloadURL(imageRef);
        imageUrls.push(url);
      }
    }

    return imageUrls;
  };

  const resetForm = () => {
    setNewSneaker({
      name: "",
      type: "",
      description: "",
      openingBid: "",
      sizesAvailable: [],
    });
    setImages({
      front: null,
      side: null,
      back: null,
      sole: null,
    });
    Object.values(imageRefs).forEach(ref => {
      if (ref.current) ref.current.value = "";
    });
  };

  const handleCloseBid = async (sneakerId: string) => {
    try {
      setActionLoading(sneakerId);
      const sneakerRef = doc(firestore, "sneakers", sneakerId);
      await updateDoc(sneakerRef, {
        status: "closed"
      });

      setSneakers(prevSneakers =>
        prevSneakers.map(sneaker =>
          sneaker.id === sneakerId
            ? { ...sneaker, status: "closed" }
            : sneaker
        )
      );
    } catch (error) {
      console.error("Error closing bid:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteSneaker = async (sneakerId: string) => {
    if (!window.confirm("Are you sure you want to delete this sneaker? This action cannot be undone.")) {
      return;
    }

    try {
      setActionLoading(sneakerId);
      
      // 1. Delete from Firestore
      await deleteDoc(doc(firestore, "sneakers", sneakerId));

      // 2. Delete all images from Storage
      const storageRef = ref(storage, `sneakers/${sneakerId}`);
      const imagesList = await listAll(storageRef);
      const deletePromises = imagesList.items.map(item => deleteObject(item));
      await Promise.all(deletePromises);

      // 3. Delete bids from Realtime Database
      const bidsRef = databaseRef(realtimeDb, sneakerId);
      await remove(bidsRef);

      // 4. Update local state
      setSneakers(prevSneakers =>
        prevSneakers.filter(sneaker => sneaker.id !== sneakerId)
      );
    } catch (error) {
      console.error("Error deleting sneaker:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!user?.email) return;
    
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const sneakerData: Omit<Sneaker, "id"> = {
        ...newSneaker,
        sellerId: user.email,
        status: "open",
        topBids: [],
        imageUrls: [],
      } as Sneaker;

      const docRef = await addDoc(collection(firestore, "sneakers"), sneakerData);
      const imageUrls = await uploadImages(docRef.id);
      await updateDoc(doc(firestore, "sneakers", docRef.id), { imageUrls });
      
      setSneakers((prev) => [...prev, { ...sneakerData, id: docRef.id, imageUrls }]);
      resetForm();
    } catch (error) {
      console.error("Error adding sneaker:", error);
      setSubmitError("Failed to add sneaker. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Seller Dashboard - {user.email}
      </h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-300">
          Add New Sneaker
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={newSneaker.name}
            onChange={handleInputChange}
            placeholder="Sneaker Name"
            className="border p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            required
          />
          <input
            type="text"
            name="type"
            value={newSneaker.type}
            onChange={handleInputChange}
            placeholder="Sneaker Type"
            className="border p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            required
          />
          <textarea
            name="description"
            value={newSneaker.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="border p-2 rounded col-span-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            required
          />
          <input
            type="text"
            name="openingBid"
            value={newSneaker.openingBid}
            onChange={handleInputChange}
            placeholder="Opening Bid"
            className="border p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            required
          />
          <input
            type="text"
            name="sizesAvailable"
            value={newSneaker.sizesAvailable?.join(", ")}
            onChange={handleSizesChange}
            placeholder="Sizes Available (eg: 2, 3, 4)"
            className="border p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            required
          />

          <div className="col-span-2 grid grid-cols-2 gap-4">
            {Object.entries(imageRefs).map(([type, ref]) => (
              <div key={type}>
                <label className="block mb-2 text-gray-800 dark:text-gray-300">
                  Upload {type.charAt(0).toUpperCase() + type.slice(1)} Image
                </label>
                <input
                  type="file"
                  ref={ref}
                  onChange={(e) => handleImageChange(e, type)}
                  accept="image/*"
                  className="border p-2 rounded w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`mt-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg shadow-md hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transform hover:scale-105 transition-transform duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed ${
            isSubmitting ? 'cursor-not-allowed opacity-75' : ''
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Adding Sneaker...
            </div>
          ) : (
            'Add Sneaker'
          )}
        </button>
      </form>

      <h2 className="ml-5 underline underline-offset-4 font-bold text-gray-800 dark:text-gray-300 text-2xl">
        Active/Past Sales
      </h2>
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sneakers.map((sneaker) => (
          <div key={sneaker.id} className="flex flex-col">
            <Link href={`/sneaker/${sneaker.id}`} className="block flex-grow">
              <SneakerCard sneaker={sneaker} />
            </Link>
            <div className="mt-2 flex gap-2">
              {sneaker.status === "open" && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleCloseBid(sneaker.id || "");
                  }}
                  disabled={actionLoading === sneaker.id}
                  className={`flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg shadow-md transition-colors duration-300 ${
                    actionLoading === sneaker.id ? 'cursor-not-allowed opacity-75' : ''
                  }`}
                >
                  {actionLoading === sneaker.id ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Closing...
                    </div>
                  ) : (
                    'Close Bid'
                  )}
                </button>
              )}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteSneaker(sneaker.id || "");
                }}
                disabled={actionLoading === sneaker.id}
                className={`flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-md transition-colors duration-300 ${
                  actionLoading === sneaker.id ? 'cursor-not-allowed opacity-75' : ''
                }`}
              >
                {actionLoading === sneaker.id ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </div>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerDashboard;