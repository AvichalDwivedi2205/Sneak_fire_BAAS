"use client";

import Image from "next/image";
import { StaticImageData } from 'next/image';
import React from "react";
import { CardBody, CardContainer, CardItem } from "../ui/3d-card";
import Test_Image from "@/assets/Image-pexels.jpg"

interface CardProps {
  image: StaticImageData;
  SneakerName: string;
  LowestAsk: string;
}

export function ThreeDCard({image, SneakerName,  LowestAsk}: CardProps) {
  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
        <CardItem
          translateZ="100"
          rotateX={20}
          rotateZ={-10}
          className="w-full mt-4"
        >
          <Image
            src={image}
            height="1000"
            width="1000"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>
        <CardItem
          translateZ="50"
          className="text-xl mt-10 font-bold text-neutral-600 dark:text-white"
        >
          {SneakerName}
        </CardItem>
        <div className="flex justify-between items-center">
          <CardItem
            translateZ={20}
            translateX={-40}
            as="button"
            className="font-bold py-2 rounded-xl text-xs dark:text-white"
          >
            Opening Bid - {LowestAsk}
          </CardItem>
        </div>
        <CardItem
            translateZ={20}
            translateX={40}
            as="button"
            className="mt-2 px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
          >
            Bid Now
          </CardItem>
      </CardBody>
    </CardContainer>
  );
}
