// app/sneaker/[id]/page.tsx
import { getSneakerById } from '@/config/firebase';
import { Sneaker } from '@/schema/schema';
import SneakerImages from './components/SneakerImages';
import SneakerDetails from './components/SneakerDetails';
import BiddingSection from './components/BiddingSection';

export default async function SneakerDetailPage({ params }: { params: { id: string } }) {
  const sneaker: Sneaker | null = await getSneakerById(params.id);

  if (!sneaker) {
    return <div className="text-center p-8">Sneaker not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SneakerImages images={sneaker.imageUrls} />
        <div>
          <SneakerDetails sneaker={sneaker} />
          <BiddingSection sneakerId={params.id} openingBid={sneaker.openingBid} />
        </div>
      </div>
    </div>
  );
}