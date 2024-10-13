'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function SneakerImages({ images }: { images: string[] }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const sortedImages = [images[1], images[0], images[2], images[3]];

  return (
    <div className="relative">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg">
        <Image
          src={sortedImages[currentImageIndex]}
          alt={`Sneaker image ${currentImageIndex + 1}`}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {sortedImages.map((image, index) => (
          <button
            key={index}
            className={`aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg ${
              index === currentImageIndex ? 'ring-2 ring-indigo-500' : ''
            }`}
            onClick={() => setCurrentImageIndex(index)}
          >
            <Image
              src={image}
              alt={`Sneaker thumbnail ${index + 1}`}
              layout="fill"
              objectFit="cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}