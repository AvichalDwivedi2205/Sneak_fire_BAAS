"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { auth, googleProvider } from "@/config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import Link from "next/link";
import { getDoc, doc, setDoc, query, collection, where, getDocs } from "firebase/firestore";
import { firestore } from "@/config/firebase";

const AuthForm = ({ isSignUp }: { isSignUp: boolean }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Function to check if a user exists in Firestore
  const checkUserExistsInFirestore = async (uid: string) => {
    const userDoc = await getDoc(doc(firestore, "users", uid));
    return userDoc.exists();
  };

  // Function to check if email exists in Firestore
  const checkEmailExistsInFirestore = async (email: string) => {
    const usersRef = collection(firestore, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  // Function to save user in Firestore only if they don't already exist
  const saveUserInFirestore = async (user: any) => {
    const userExists = await checkUserExistsInFirestore(user.uid);
    console.log(user.uid);

    if (!userExists) {
      const userData = {
        name: user.displayName || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
        isSeller: false,
        shoeSize: 0,
        sellerVerification: "N/A",
        createdAt: new Date(),
        profilePicture: user.photoURL || "",
        shippingInfo: null,
      };
      await setDoc(doc(firestore, "users", user.uid), userData);

      // Save user shoeSize and isSeller to local storage
      localStorage.setItem("shoeSize", JSON.stringify(userData.shoeSize));
    } else {
      console.log("User already exists in Firestore");
      // Fetch shoeSize and isSeller and store in local storage
      const existingUser = (await getDoc(doc(firestore, "users", user.uid))).data();
      if (existingUser) {
        localStorage.setItem("shoeSize", JSON.stringify(existingUser.shoeSize));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isSignUp) {
        // Check if a user with this email already exists
        const userDocRef = doc(firestore, "users", email);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setError("This email is already in use. Please use a different one.");
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        alert("A verification email has been sent. Please check your inbox.");

        // Save user to Firestore
        await saveUserInFirestore(userCredential.user);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        // Save user to Firestore
        await saveUserInFirestore(userCredential.user);
      }

      // Redirect to profile page after successful authentication
      router.push("/profile");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleProvider = async () => {
    try {
      // Get the Google user's email before signing in
      const result = await signInWithPopup(auth, googleProvider);
      const userEmail = result.user.email;

      if (!userEmail) {
        setError("Unable to get email from Google account");
        return;
      }

      // Check if the email is already registered with email/password
      const signInMethods = await fetchSignInMethodsForEmail(auth, userEmail);
      const emailExists = await checkEmailExistsInFirestore(userEmail);

      if (signInMethods.length > 0 && signInMethods.includes('password') && emailExists) {
        setError("An account with this email already exists. Please sign in with email and password instead.");
        return;
      }

      // If no existing account found, proceed with Google sign-in
      await saveUserInFirestore(result.user);
      router.push("/profile");
    } catch (err: any) {
      if (err.code === 'auth/account-exists-with-different-credential') {
        setError("An account already exists with this email. Please sign in using your original sign-in method.");
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <h2 className="text-center font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Welcome to SneakBid
        </h2>
        <p className="text-center text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Step Into The Bidding Game
        </p>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="py-8">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="avichaldwivedi@gmail.com"
              required
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </LabelInputContainer>
          <button
            className="mt-8 bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
            <BottomGradient />
          </button>
          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
          <button
            className="mt-8 bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="button"
            onClick={handleGoogleProvider}
          >
            {isSignUp ? "Sign Up" : "Sign In"} with Google
            <BottomGradient />
          </button>
          {isSignUp ? (
            <div className="flex justify-center pt-4">
              Already have an account? &nbsp;<span className="text-blue-500"><Link href="/signin">SignIn</Link></span>
            </div>
          ) : (
            <div className="flex justify-center pt-4">
              Do not have an account? &nbsp;<span className="text-blue-500"><Link href="/signup">SignUp</Link></span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default AuthForm;