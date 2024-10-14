'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function SneakerImages({ images }: { images: string[] }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reorder images to have side profile (index 1) first
  const sortedImages = [images[1], images[0], images[2], images[3]];

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === sortedImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? sortedImages.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative">
      {/* Image Container */}
      <div className="w-full h-96 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 flex justify-center items-center">
        <Image
          src={sortedImages[currentImageIndex]}
          alt={`Sneaker image ${currentImageIndex + 1}`}
          layout="intrinsic"
          width={500}
          height={500}
          objectFit="contain"
          className="max-h-full max-w-full"
        />
      </div>

      {/* Left Navigation Button */}
      <button
        onClick={goToPreviousImage}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 bg-opacity-50 rounded-full p-2"
      >
        <ChevronLeft className="h-6 w-6 dark:text-white text-gray-800" />
      </button>

      {/* Right Navigation Button */}
      <button
        onClick={goToNextImage}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 bg-opacity-50 rounded-full p-2"
      >
        <ChevronRight className="h-6 w-6 dark:text-white text-gray-800" />
      </button>

      {/* Thumbnails */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {sortedImages.map((image, index) => (
          <button
            key={index}
            className={`w-full h-24 overflow-hidden rounded-lg ${
              index === currentImageIndex ? 'ring-2 ring-indigo-500' : ''
            }`}
            onClick={() => setCurrentImageIndex(index)}
          >
            <Image
              src={image}
              alt={`Sneaker thumbnail ${index + 1}`}
              layout="intrinsic"
              width={100}
              height={100}
              objectFit="contain"
              className="max-h-full max-w-full"
            />
          </button>
        ))}
      </div>
    </div>


  );
}