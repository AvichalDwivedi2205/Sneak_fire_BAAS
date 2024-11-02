"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/config/firebase";
import { FiMenu, FiX } from "react-icons/fi";
import { usePathname } from "next/navigation"; // Import for path detection
import { signOut } from "firebase/auth"; // Import signOut function
import {firestore} from "@/config/firebase"
import {doc, getDoc} from "firebase/firestore"

const Navbar = () => {
  const [sellerVerification, setSellerVerification] = useState('');
  const [active, setActive] = useState("Home");
  const [user, loading, error] = useAuthState(auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSeller, setIsSeller] = useState(false); // State to track if the user is a seller
  const pathname = usePathname(); // Detect the current path

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Collections", href: "/collections" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userRef = doc(firestore, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Directly check the boolean value and string from Firebase
            setIsSeller(userData.isSeller === true); // Explicitly check for true
            setSellerVerification(userData.sellerVerification || '');
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  // useEffect to check localStorage for isSeller and update the state
  useEffect(() => {
    const checkSellerStatus = async () => {
      if (user) {
        try {
          const userRef = doc(firestore, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setIsSeller(userData.isSeller || false);
            setSellerVerification(userData.sellerVerification || 'N/A');
          }
        } catch (error) {
          console.error("Error checking seller status:", error);
        }
      }
    };
  
    checkSellerStatus();
  }, [user]);

  // useEffect to track changes in pathname and update the active state
  useEffect(() => {
    if (pathname === "/") {
      setActive("Home");
    } else if (pathname === "/profile") {
      setActive("Profile");
    } else if (pathname === "/sellerDashboard") {
      setActive("Sell"); // Add "Sell" as the active state for Seller Dashboard
    } else {
      const current = navigation.find((item) => item.href === pathname);
      if (current) setActive(current.name);
    }
  }, [pathname]);

  const handleSetActive = (name: string) => {
    setActive(name);
    setIsMobileMenuOpen(false); // Close mobile menu on selection
  };

  // Firebase SignOut handler
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("isSeller"); // Remove isSeller from localStorage after signout
    } catch (error) {
      console.error("Sign Out Error:", error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-50 dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left Section: Logo and Brand Name */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center" onClick={() => handleSetActive("Home")}>
              <img
                src="/path-to-logo.png"
                alt="SneakBid Logo"
                className="h-8 w-8 mr-2"
              />
              <span className="font-bold text-xl text-gray-800 dark:text-white">
                SneakBid
              </span>
            </Link>
          </div>

          {/* Middle Section: Navigation Links */}
          <div className="hidden md:flex md:items-center">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => handleSetActive(item.name)}
                className={`ml-4 px-3 py-2 rounded-md text-sm font-medium ${
                  active === item.name
                    ? "border-b-2 border-blue-500 dark:border-gray-400 text-gray-800 dark:text-gray-200"
                    : "text-gray-600 dark:text-gray-300 hover:border-b-2 hover:border-gray-400"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Section: Auth Buttons, Profile, and Sell Button */}
          <div className="flex items-center">
            {!user ? (
              <>
                <div className="hidden md:flex space-x-4">
                  <Link
                    href="/signin"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-3 py-2 rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition"
                  >
                    Sign Up
                  </Link>
                </div>
                {/* Mobile Auth Buttons */}
                <div className="md:hidden flex space-x-2">
                  <Link
                    href="/signin"
                    className="px-2 py-1 rounded-md text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-2 py-1 rounded-md text-xs font-medium bg-blue-500 text-white hover:bg-blue-600 transition"
                  >
                    Sign Up
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Link href="/profile" onClick={() => handleSetActive("Profile")}>
                  <img
                    src={user.photoURL || "/default-profile.png"}
                    alt="Profile"
                    className="h-8 w-8 rounded-full"
                  />
                </Link>
                {/* Sell Button - Visible when user is authenticated and isSeller is true */}
                {isSeller && sellerVerification === 'verified' ? (
                    <Link
                      href="/sellerDashboard"
                      onClick={() => handleSetActive("Sell")}
                      className="ml-4 px-2 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 text-white py-1 rounded-lg shadow-md hover:from-gray-500 hover:via-gray-600 hover:to-gray-700 transform hover:scale-105 transition-transform duration-300 ease-in-out dark:from-gray-600 dark:via-gray-700 dark:to-gray-800 dark:hover:from-gray-700 dark:hover:via-gray-800 dark:hover:to-gray-900"
                    >
                      Sell
                    </Link>
                  ) : (
                    <Link
                      href="/contact"
                      onClick={() => handleSetActive("Contact")}
                      className="ml-4 px-2 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 text-white py-1 rounded-lg shadow-md hover:from-gray-500 hover:via-gray-600 hover:to-gray-700 transform hover:scale-105 transition-transform duration-300 ease-in-out dark:from-gray-600 dark:via-gray-700 dark:to-gray-800 dark:hover:from-gray-700 dark:hover:via-gray-800 dark:hover:to-gray-900"
                    >
                      Become Seller
                    </Link>
                  )}
                {/* Sign Out Button */}
                <button
                  onClick={handleSignOut}
                 className="bg-red-500 ml-4 text-white p-1 rounded-md hover:bg-red-600 focus:ring focus:ring-red-400"
                >
                  Sign Out
                </button>
              </>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden ml-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <FiX className="h-6 w-6" />
                ) : (
                  <FiMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => handleSetActive(item.name)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  active === item.name
                    ? "border-l-4 border-blue-500 dark:border-gray-400 bg-gray-100 dark:bg-gray-700"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
