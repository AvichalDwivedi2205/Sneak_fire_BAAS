import Link from 'next/link';
import SneakerCard from '@/components/Card/Card';
import { Sneaker } from '@/schema/schema';
import { getSneakers } from '@/config/firebase';

export const revalidate = 0; // Disable caching for this page

export default async function Collections() {
  try {
    const sneakers: Sneaker[] = await getSneakers();

    return (
      <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-4 lg:grid-cols-6">
        {sneakers.map((sneaker) => (
          <Link href={`/sneaker/${sneaker.id}`} key={sneaker.id} className="block">
            <SneakerCard sneaker={sneaker} />
          </Link>
        ))}
      </div>
    );
  } catch (error) {
    console.error('Error in Collections page:', error);
    return <div>Error loading sneakers. Please try again later.</div>;
  }
}