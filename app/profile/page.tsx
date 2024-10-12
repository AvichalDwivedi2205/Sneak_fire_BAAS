"use client";
import React from 'react';
import { useEffect, useState } from "react";
import Image from "next/image";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = localStorage.getItem("userProfile");
    if (fetchProfile) {
      setProfile(JSON.parse(fetchProfile));
    } else {
      console.log("No profile found");
    }
  }, []);

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

        {/* Personal Information Section */}
        <div className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 dark:bg-gradient-to-r dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 p-4 rounded-lg shadow-inner mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200">
              Personal Information
            </h2>
            <button className="bg-primary-500 text-white px-4 py-1 rounded-md hover:bg-primary-600 focus:ring focus:ring-primary-400">
              Edit
            </button>
          </div>

          {/* Information Fields */}
          <div className="text-gray-800 dark:text-gray-300">
          <div className="mb-2">
              <label className="font-semibold">Name:</label>
              <p>{profile?.name || "Not Provided"}</p>
            </div>
            <div className="mb-2">
              <label className="font-semibold">Phone:</label>
              <p>{profile?.phone || "Not Provided"}</p>
            </div>
            <div className="mb-2">
              <label className="font-semibold">Shoe Size:</label>
              <p>{profile?.shoeSize || "Not Provided"}</p>
            </div>
            <div className="mb-2">
              <label className="font-semibold">Seller Status:</label>
              <p>{profile?.isSeller ? "Seller" : "Buyer"}</p>
            </div>
            {profile?.isSeller && (
              <div className="mb-2">
                <label className="font-semibold">Verification:</label>
                <p>{profile?.sellerVerification || "Pending"}</p>
              </div>
            )}
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

          {/* Shipping Fields */}
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
        {/* Profile Footer */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 SneakBid. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
