// app/collections/page.tsx
import SneakerCard from '@/components/Card/Card';
import { Sneaker } from '@/schema/schema';
import { getSneakers } from '@/config/firebase';

export const dynamic = 'force-dynamic'; // Ensures the page regenerates on each request

export default async function Collections() {
  const sneakers: Sneaker[] = await getSneakers();

  return (
    <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-4 lg:grid-cols-6">
      {sneakers.map((sneaker) => (
        <SneakerCard key={sneaker.id} sneaker={sneaker} />
      ))}
    </div>
  );
}
