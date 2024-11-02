"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import { User, Sneaker } from "@/schema/schema";
import { auth, firestore, storage } from "@/config/firebase";
import { getDoc } from "firebase/firestore";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import SneakerCard from "@/components/Card/Card";

const SellerDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [sneakers, setSneakers] = useState<Sneaker[]>([]);
  const [loading, setLoading] = useState(true);
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
    sole: null,
  });

  const imageRefs = {
    front: useRef<HTMLInputElement>(null),
    side: useRef<HTMLInputElement>(null),
    back: useRef<HTMLInputElement>(null),
    sole: useRef<HTMLInputElement>(null),
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!user?.email) return;

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
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
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
          className="mt-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg shadow-md hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transform hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          Add Sneaker
        </button>
      </form>

      <h2 className="ml-5 underline underline-offset-4 font-bold text-gray-800 dark:text-gray-300 text-2xl">
        Active/Past Sales
      </h2>
      <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-4 lg:grid-cols-6">
        {sneakers.map((sneaker) => (
          <SneakerCard key={sneaker.id} sneaker={sneaker} />
        ))}
      </div>
    </div>
  );
};

export default SellerDashboard;