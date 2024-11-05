import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
// import provided css styling from swiper
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import type SwiperType from "swiper";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const ImageSlider = ({ urls }: { urls: string[] }) => {
  // state variable that stores a 'swiper' instance
  const [swiper, setSwiper] = useState<null | SwiperType>(null);
  // state variable keeps track of which image-slide the user is currently on
  const [activeIndex, setActiveIndex] = useState(0);
  // state variable keeps track of if user is currently on first or last image-slide
  const [slideConfig, setSlideConfig] = useState({
    isBeginning: true,
    isEnd: activeIndex === (urls.length ?? 0) - 1,
  });

  useEffect(() => {
    // callback function updates state variable to keep track if user is currently on first or last image-slide
    const onSlideChange = (activeIndex: number) => {
      setActiveIndex(activeIndex);
      setSlideConfig({
        isBeginning: activeIndex === 0,
        isEnd: activeIndex === (urls.length ?? 0) - 1,
      });
    };

    // event fires when user swipes between images
    swiper?.on("slideChange", ({ activeIndex }) => {
      onSlideChange(activeIndex);
    });

    return () => {
      swiper?.off("slideChange", ({ activeIndex }) => {
        onSlideChange(activeIndex);
      });
    };
  }, [swiper, urls]);

  // styling for buttons depending on their state
  const activeStyles =
    "absolute top-1/2 z-50 grid aspect-square h-8 w-8 -translate-y-1/2 place-items-center rounded-full border-2 border-zinc-300 bg-white opacity-100 hover:scale-105 active:scale-[0.97]";
  const inactiveStyles = "hidden text-gray-400";

  return (
    <div className="relative aspect-square overflow-hidden rounded-xl bg-zinc-100">
      {/* buttons to slide between images */}
      <div className="absolute inset-0 z-10 opacity-0 transition hover:opacity-100">
        <button
          onClick={(e) => {
            e.preventDefault();
            // swipe to next image
            swiper?.slideNext();
          }}
          className={cn(activeStyles, "right-3 transition", {
            [inactiveStyles]: slideConfig.isEnd, // inactive styling
            "hover:bg-primary-300 text-primary-800 opacity-100":
              !slideConfig.isEnd, // active styling
          })}
          aria-label="next image"
        >
          <ChevronRight className="h-4 w-4 text-zinc-700" />
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            // swipe to previous image
            swiper?.slidePrev();
          }}
          className={cn(activeStyles, "left-3 transition", {
            [inactiveStyles]: slideConfig.isBeginning, // inactive styling
            "hover:bg-primary-300 text-primary-800 opacity-100":
              !slideConfig.isBeginning, // active styling
          })}
          aria-label="previous image"
        >
          <ChevronLeft className="h-4 w-4 text-zinc-700" />
        </button>
      </div>

      <Swiper
        pagination={{
          renderBullet: (_, className) => {
            return `<span class="rounded-full transition ${className}"></span>`;
          },
        }}
        // save the swiper instance in state when it has initialized
        onSwiper={(swiper) => setSwiper(swiper)}
        spaceBetween={50}
        slidesPerView={1}
        // allows for swiping between images from left to right
        modules={[Pagination]}
        className="h-full w-full"
      >
        {urls.map((url, i) => (
          <SwiperSlide key={i} className="relative -z-10 h-full w-full">
            <Image
              src={url}
              alt="Product image"
              fill
              loading="eager"
              className="-z-10 h-full w-full object-contain object-center"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageSlider;
