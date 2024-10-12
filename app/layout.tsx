import localFont from "next/font/local";
import "./globals.css";
import NavbarRender from "@/components/Navbar/Navbar-render"; // Import the ClientNavbar component

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-100 dark:bg-gray-900">
        <NavbarRender />
        {children}
      </body>
    </html>
  );
}
