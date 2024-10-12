"use client"
import React, { useState } from "react";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/config/firebase"; // Firebase configuration (adjust the path as needed)
import { FiMenu, FiX } from "react-icons/fi"; // Replacing Heroicons with React Icons

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [user, loading, error] = useAuthState(auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Collections", href: "/collections" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const handleSetActive = (name: any) => {
    setActive(name);
    setIsMobileMenuOpen(false); // Close mobile menu on selection
  };

  return (
    <nav className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-50 dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left Section: Logo and Brand Name */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              
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
              <Link key={item.name} href={item.href}
              onClick={() => handleSetActive(item.name)}
                  className={`ml-4 px-3 py-2 rounded-md text-sm font-medium ${
                    active === item.name
                      ? "border-b-2 border-blue-500 dark:border-gray-400"
                      : "text-gray-600 dark:text-gray-300 hover:border-b-2 hover:border-gray-400"
                  }`}>
                
                  {item.name}
              </Link>
            ))}
          </div>

          {/* Right Section: Auth Buttons or Profile */}
          <div className="flex items-center">
            {!user ? (
              <>
                <div className="hidden md:flex space-x-4">
                  <Link href="/signin" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                    Sign In  
                  </Link>
                  <Link href="/signup" className="px-3 py-2 rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition">
                    Sign Up
                  </Link>
                </div>
                {/* Mobile Auth Buttons */}
                <div className="md:hidden flex space-x-2">
                  <Link href="/signin" className="px-2 py-1 rounded-md text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                    Sign In
                  </Link>
                  <Link href="/signup" className="px-2 py-1 rounded-md text-xs font-medium bg-blue-500 text-white hover:bg-blue-600 transition">
                    Sign Up
                  </Link>
                </div>
              </>
            ) : (
              <Link href="/profile">
                  <img
                    src={user.photoURL || "/default-profile.png"} 
                    alt="Profile"
                    className="h-8 w-8 rounded-full"
                  />
              </Link>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden ml-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <FiX className="h-6 w-6" /> // Close Icon
                ) : (
                  <FiMenu className="h-6 w-6" /> // Menu Icon
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
              <Link key={item.name} href={item.href}
              onClick={() => handleSetActive(item.name)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    active === item.name
                      ? "border-l-4 border-blue-500 dark:border-gray-400 bg-gray-100 dark:bg-gray-700"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                  }`}>
                
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
