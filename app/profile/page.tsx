"use client"

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/firebase";

export default function Profile() {
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user); // Log the entire user object to the console
        setUserInfo(user);
      } else {
        setUserInfo(null);
      }
    });

    return () => unsubscribe();
  }, []);

  if (userInfo === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {userInfo ? (
        <div>
          <h1>Profile</h1>
          <pre>{JSON.stringify(userInfo, null, 2)}</pre> {/* Display the entire object in JSON format */}
        </div>
      ) : (
        <div>No user signed in</div>
      )}
    </div>
  );
}
