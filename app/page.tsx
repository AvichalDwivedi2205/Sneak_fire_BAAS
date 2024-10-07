import Image from "next/image";
import { ThreeDCard } from "../components/Card/Card";
import Test_Image from "../assets/Image-pexels.jpg"

export default function Home() {
  return (
  <div>
    <ThreeDCard image={Test_Image} SneakerName="Nike Air Jordan 1" LowestAsk="100" />
  </div>
  );
}
