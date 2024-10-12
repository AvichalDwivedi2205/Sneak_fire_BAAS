"use client"
import { firestore } from "@/config/firebase";
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { User, Sneaker, Bid } from "@/schema/schema";


