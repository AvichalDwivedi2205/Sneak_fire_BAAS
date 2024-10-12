"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { User, Sneaker } from "@/schema/schema";
import { auth, firestore, storage } from "@/config/firebase";
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
  const [newSneaker, setNewSneaker] = useState<Partial<Sneaker>>({
    name: "",
    type: "",
    description: "",
    openingBid: "",
    sizesAvailable: [],
  });
  const [images, setImages] = useState<File[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/signin");
        return;
      }

      const isSeller = localStorage.getItem("isSeller") === "true";
      if (!isSeller) {
        router.push("/contact");
        return;
      }

      fetchUserAndSneakers(currentUser);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchUserAndSneakers = async (currentUser: any): Promise<void> => {
    try {
      // Fetch the user details
      const userQuery = query(
        collection(firestore, "users"),
        where("email", "==", currentUser.email)
      );
      const userDocs = await getDocs(userQuery);
      if (!userDocs.empty) {
        setUser(userDocs.docs[0].data() as User);
      }

      // Fetch sneakers from Firestore where sellerId matches current user email
      const sneakersQuery = query(
        collection(firestore, "sneakers"),
        where("sellerId", "==", currentUser.email)
      );
      const sneakerDocs = await getDocs(sneakersQuery);

      // Map sneaker data directly (no need to fetch images separately)
      const sneakersData = sneakerDocs.docs.map(
        (doc: QueryDocumentSnapshot<DocumentData>) => {
          const sneaker = { id: doc.id, ...doc.data() } as Sneaker;
          return sneaker;
        }
      );

      setSneakers(sneakersData);
    } catch (error) {
      console.error("Error fetching user or sneakers data:", error);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setNewSneaker((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSizesChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const sizes = e.target.value.split(",").map((size) => size.trim());
    setNewSneaker((prev) => ({ ...prev, sizesAvailable: sizes }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const uploadImages = async (sneakerId: string): Promise<string[]> => {
    const imageUrls: string[] = [];
    for (const image of images) {
      const imageRef = ref(storage, `sneakers/${sneakerId}/${image.name}`);
      await uploadBytes(imageRef, image);
      const url = await getDownloadURL(imageRef);
      imageUrls.push(url);
    }
    return imageUrls;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!user) return;

    const sneakerData: Omit<Sneaker, "id"> = {
      ...newSneaker,
      sellerId: user.email!,
      status: "open",
      topBids: [],
      imageUrls: [],
    } as Sneaker;

    try {
      const docRef = await addDoc(collection(firestore, "sneakers"), sneakerData);
      const imageUrls = await uploadImages(docRef.id);
      await updateDoc(doc(firestore, "sneakers", docRef.id), { imageUrls });
      const updatedSneaker: Sneaker = { ...sneakerData, id: docRef.id, imageUrls };
      setSneakers((prev) => [...prev, updatedSneaker]);
      setNewSneaker({
        name: "",
        type: "",
        description: "",
        openingBid: "",
        sizesAvailable: [],
      });
      setImages([]);
    } catch (error) {
      console.error("Error adding sneaker: ", error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Seller Dashboard</h1>

      {/* Form for adding a new sneaker */}
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
            placeholder="Sizes Available (comma-separated)"
            className="border p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            required
          />

          <div className="col-span-2">
            <label className="block mb-2 text-gray-800 dark:text-gray-300">
              Upload Sneaker Images (Front, Side, Back, Sole)
            </label>
            <input
              type="file"
              onChange={handleImageChange}
              multiple
              accept="image/*"
              className="border p-2 rounded w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white p-2 rounded col-span-2 transition-transform transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Add Sneaker
          </button>
        </div>
      </form>

      {/* Display the list of sneakers */}
      <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-300">Your Sneakers</h2>
      <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-4 lg:grid-cols-6">
        {sneakers.map((sneaker) => (
          <SneakerCard key={sneaker.id} sneaker={sneaker} />
        ))}
      </div>
    </div>
  );
};

export default SellerDashboard;
