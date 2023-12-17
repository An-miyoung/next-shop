"use client";

import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Props {
  images: string[];
}

const settings: Settings = {
  dots: false,
  lazyLoad: "anticipated",
  infinite: true,
  speed: 100,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  autoplay: false,
  className: "w-[500px]",
  responsive: [
    {
      breakpoint: 480,
      settings: {
        dots: true,
        adaptiveHeight: true,
        className: "w-[300px]",
      },
    },
  ],
};

export default function ProductImageGallery(props: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { images } = props;
  const slider = useRef<Slider>(null);

  return (
    <div className=" pb-8">
      <Slider
        {...settings}
        afterChange={(currentSlide) => {
          setCurrentSlide(currentSlide);
        }}
        ref={slider}
      >
        {images.map((img, index) => {
          return (
            <Image
              key={index}
              src={img}
              alt="testing"
              width={500}
              height={500}
              priority={false}
              style={{ width: "auto", height: "auto" }}
            />
          );
        })}
      </Slider>
      <div className="hidden md:flex md:pt-2 md:space-x-2">
        {images.map((img, index) => {
          return (
            <Image
              onClick={() => slider.current?.slickGoTo(index)}
              className={index === currentSlide ? "ring ring-blue-500" : ""}
              key={index}
              src={img}
              alt="testing"
              width={80}
              height={80}
              priority={false}
              style={{ width: "auto", height: "auto" }}
            />
          );
        })}
      </div>
    </div>
  );
}
