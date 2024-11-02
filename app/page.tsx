import { getSneakers } from "@/config/firebase";
import { Sneaker } from "@/schema/schema";
import Link from "next/link";
import SneakerCard from "@/components/Card/Card";

export default async function Home() {
  const sneakers: Sneaker[] = await getSneakers();

  // Split sneakers into open and closed bids
  const activeBids = sneakers.filter((sneaker) => sneaker.status === "open");
  const closedBids = sneakers.filter((sneaker) => sneaker.status === "closed");

  return (
    <div className="p-4">
      {/* Active Bids Section */}
      <section>
        <h2 className="text-center font-bold text-3xl sm:text-5xl lg:text-6xl text-neutral-800 dark:text-neutral-200 p-4">Active Bids</h2>
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
        <h2 className="text-center font-bold text-neutral-800 dark:text-neutral-200 text-3xl sm:text-5xl lg:text-6xl" >Closed Bids</h2>
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
}
