'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, firestore } from '@/config/firebase';
import { User } from 'firebase/auth';
import { getDoc } from 'firebase/firestore';

interface FormState {
  name: string;
  email: string;
  phone: string;
}

const ContactPage: React.FC = () => {
  const [formState, setFormState] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
  });
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [canSubmit, setCanSubmit] = useState<boolean>(true);

  useEffect(() => {
    const lastSubmission = localStorage.getItem('lastSubmission');
    if (lastSubmission) {
      const lastDate = new Date(lastSubmission);
      const today = new Date();
      if (lastDate.toDateString() === today.toDateString()) {
        setCanSubmit(false);
        setError("You've already submitted a form today. Please try again tomorrow.");
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateEmail = (email: string): boolean => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const re = /^\+91 \d{5} \d{5}$/;
    return re.test(phone);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!canSubmit) {
      setError("You've already submitted a form today. Please try again tomorrow.");
      return;
    }

    if (!validateEmail(formState.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!validatePhone(formState.phone)) {
      setError("Please enter a valid phone number.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          from_name: formState.name,
          from_email: formState.email,
          phone: formState.phone,
          message: `Hi, my name is ${formState.name} and my email is ${formState.email}. My phone number is ${formState.phone} and I would like to register as a seller on your platform.`
        },
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID!
      );

      console.log('Email sent successfully:', result.text);

      const user: User | null = auth.currentUser;
      
      if (user) {
        const userRef = doc(firestore, 'users', user.uid);
        try {
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            const sellerVerification = userDoc.data().sellerVerification;
      
            if (sellerVerification === 'N/A') {
              await updateDoc(userRef, {
                sellerVerification: 'pending'
              });
              console.log('Seller verification updated to pending.');
            } else if (sellerVerification === 'verified' || sellerVerification === 'rejected') {
              console.log('Seller verification status is already set to verified or rejected. No changes made.');
            } else {
              console.log('Seller verification status is neither N/A, verified, nor rejected. No changes made.');
            }
          } else {
            console.log('User document does not exist.');
          }
        } catch (error) {
          console.error('Error updating seller verification:', error);
        }
      }

      setShowAlert(true);
      setFormState({ name: '', email: '', phone: '' });
      localStorage.setItem('lastSubmission', new Date().toISOString());
      setCanSubmit(false);

    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-5xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Contact Information Section */}
          <div className="md:w-1/2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 text-white">
            <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
            <div className="space-y-4">
              <p><strong>Developer:</strong> Avichal Dwivedi</p>
              <p><strong>Phone:</strong> +91 9279700314</p>
              <p><strong>Email:</strong>dwivediavichal926@gmail.com</p>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="md:w-1/2 p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Become A Seller</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  className="p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder='avichaldwivedi@gmail.com'
                  value={formState.email}
                  onChange={handleChange}
                  required
                  className="p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder='+91 92xxx 87xxx'
                  value={formState.phone}
                  onChange={handleChange}
                  required
                  className="p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !canSubmit}
                className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 dark:bg-indigo-700 dark:hover:bg-indigo-800 disabled:opacity-50"
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </button>
            </form>
            {showAlert && (
              <div className="mt-4 text-green-600 dark:text-green-400">
                <p>Thank you! We will get back to you soon.</p>
              </div>
            )}
            {error && (
              <div className="mt-4 text-red-600 dark:text-red-400">
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;