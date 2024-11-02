'use client';

import { useEffect, useState } from "react";
import { auth } from "@/config/firebase";
import { useRouter } from "next/navigation";

export default function withPublicRoute(Component: React.ComponentType<any>) {
  return function ProtectedRoute(props: any) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          router.push('/');
        } else {
          setIsLoading(false);
        }
      });

      return () => unsubscribe();
    }, [router]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}