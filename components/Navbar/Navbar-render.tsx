// components/ClientNavbar.tsx
"use client"; // Make this component client-side

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";

export default function NavbarRender() {
  const pathname = usePathname();

  // Conditionally show the Navbar
  const showNavbar = !['/signup', '/signin'].includes(pathname);

  return showNavbar ? <Navbar /> : null;
}
