"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { signOut } from "firebase/auth";
import { auth, firestore } from "@/config/firebase"; // Firebase imports
import { doc, getDoc } from "firebase/firestore"; // Firestore imports
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();

  // Fetch user profile from Firestore on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser; // Get the currently authenticated user
      if (user) {
        try {
          const userDoc = await getDoc(doc(firestore, "users", user.uid)); // Fetch user data from Firestore
          if (userDoc.exists()) {
            setProfile(userDoc.data()); // Set the profile state
          } else {
            console.error("User profile not found.");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        console.log("No authenticated user found.");
        router.push("/"); // Redirect to home if no user
      }
    };

    fetchProfile(); // Call the fetch function
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Sign out the user
      router.push("/"); // Redirect to home page
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 md:px-0">
      <div className="max-w-md w-full mx-auto rounded-md md:rounded-2xl p-4 md:p-8 shadow-md bg-white dark:bg-gray-800">
        {/* Profile Header */}
        <div className="flex items-center justify-center flex-col mb-6">
          <Image
            src={profile?.profilePicture || "/default-avatar.png"}
            alt="Profile Picture"
            width={100}
            height={100}
            className="rounded-full border-4 border-primary-500 shadow-md mb-4"
          />
          <p className="text-center text-gray-500 dark:text-gray-400">
            {profile?.email || "user@example.com"}
          </p>
        </div>

        {/* Name and Shoe Size Section */}
<div className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 dark:bg-gradient-to-r dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 p-4 rounded-lg shadow-inner mb-6">
  <div className="flex justify-between items-center mb-4">
    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200">
      Name & Shoe Size
    </h2>
    <button className="bg-primary-500 text-white px-4 py-1 rounded-md hover:bg-primary-600 focus:ring focus:ring-primary-400">
      Edit
    </button>
  </div>

  <div className="text-gray-800 dark:text-gray-300">
    <div className="mb-2">
      <label className="font-semibold">Name:</label>
      <p>{profile?.name || "Not Provided"}</p>
    </div>
    <div className="mb-2">
      <label className="font-semibold">Shoe Size:</label>
      <p>{profile?.shoeSize || "Not Provided"}</p>
    </div>
  </div>
</div>

{/* Phone Section */}
<div className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 dark:bg-gradient-to-r dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 p-4 rounded-lg shadow-inner mb-6">
  <div className="flex justify-between items-center mb-4">
    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200">
      Phone
    </h2>
    <button className="bg-primary-500 text-white px-4 py-1 rounded-md hover:bg-primary-600 focus:ring focus:ring-primary-400">
      Edit
    </button>
  </div>

  <div className="text-gray-800 dark:text-gray-300">
    <div className="mb-2">
      <label className="font-semibold">Phone:</label>
      <p>{profile?.phone || "Not Provided"}</p>
    </div>
  </div>
</div>


        {/* Phone  number*/}


        {/* Seller/Buyer Information Section */}
        <div className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 dark:bg-gradient-to-r dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 p-4 rounded-lg shadow-inner mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200">
              Seller/Buyer Information
            </h2>
            <button className="bg-primary-500 text-white px-4 py-1 rounded-md hover:bg-primary-600 focus:ring focus:ring-primary-400">
              Contact Us
            </button>
          </div>

          <div className="text-gray-800 dark:text-gray-300">
            <div className="mb-2">
              <label className="font-semibold">Status:</label>
              <p>{profile?.isSeller ? "Seller" : "Buyer"}</p>
            </div>
              <div className="mb-2">
                <label className="font-semibold">Seller Verification:</label>
                <p>{profile?.sellerVerification || "Pending"}</p>
              </div>
          </div>
        </div>
        {/* Shipping Information Section */}
        <div className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 dark:bg-gradient-to-r dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 p-4 rounded-lg shadow-inner mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200">
              Shipping Information
            </h2>
            <button className="bg-primary-500 text-white px-4 py-1 rounded-md hover:bg-primary-600 focus:ring focus:ring-primary-400">
              Edit
            </button>
          </div>

          <div className="text-gray-800 dark:text-gray-300">
            {profile?.shippingInfo ? (
              <>
                <div className="mb-2">
                  <label className="font-semibold">Basic Address:</label>
                  <p>{profile.shippingInfo.basicAddress}</p>
                </div>
                <div className="mb-2">
                  <label className="font-semibold">Area:</label>
                  <p>{profile.shippingInfo.Area}</p>
                </div>
                <div className="mb-2">
                  <label className="font-semibold">Landmark:</label>
                  <p>{profile.shippingInfo.Landmark}</p>
                </div>
                <div className="mb-2">
                  <label className="font-semibold">Pin Code:</label>
                  <p>{profile.shippingInfo.pinCode}</p>
                </div>
                <div className="mb-2">
                  <label className="font-semibold">City:</label>
                  <p>{profile.shippingInfo.city}</p>
                </div>
                <div className="mb-2">
                  <label className="font-semibold">State:</label>
                  <p>{profile.shippingInfo.state}</p>
                </div>
              </>
            ) : (
              <p>No shipping details available</p>
            )}
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="text-center mb-6">
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:ring focus:ring-red-400"
          >
            Sign Out
          </button>
        </div>

        {/* Profile Footer */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 SneakBid. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
