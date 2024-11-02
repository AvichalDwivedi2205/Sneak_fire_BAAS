import { getSneakers } from "@/config/firebase";
import { Sneaker } from "@/schema/schema";
import Link from "next/link";
import SneakerCard from "@/components/Card/Card";

export const revalidate = 0; // Disable caching for this page

export default async function Home() {
  try {
    const sneakers: Sneaker[] = await getSneakers();
    
    const activeBids = sneakers.filter((sneaker) => sneaker.status === "open");
    const closedBids = sneakers.filter((sneaker) => sneaker.status === "closed");
    
    console.log('Active bids:', activeBids.length);
    console.log('Closed bids:', closedBids.length);

    return (
      <div className="p-4">
        {/* Active Bids Section */}
        <section>
          <h2 className="text-center font-bold text-3xl sm:text-5xl lg:text-6xl text-neutral-800 dark:text-neutral-200 p-4">
            Active Bids ({activeBids.length})
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {activeBids.map((sneaker) => (
              <Link href={`/sneaker/${sneaker.id}`} key={sneaker.id} className="block">
                <SneakerCard sneaker={sneaker} />
              </Link>
            ))}
          </div>
        </section>

        {/* Closed Bids Section */}
        <section className="mt-8">
          <h2 className="text-center font-bold text-neutral-800 dark:text-neutral-200 text-3xl sm:text-5xl lg:text-6xl">
            Closed Bids ({closedBids.length})
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {closedBids.map((sneaker) => (
              <Link href={`/sneaker/${sneaker.id}`} key={sneaker.id} className="block">
                <SneakerCard sneaker={sneaker} />
              </Link>
            ))}
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('Error in Home page:', error);
    return <div>Error loading sneakers. Please try again later.</div>;
  }
}