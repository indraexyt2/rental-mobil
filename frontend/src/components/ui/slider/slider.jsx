import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import HeroImage1 from '../../../assets/hero-image-1.jpg'
import HeroImage2 from '../../../assets/hero-image-2.jpg'
import HeroImage3 from '../../../assets/hero-image-3.jpg'

import 'swiper/css';

import './CustomSlider.css';
import {TypographyH1, TypographyH2, TypographyP} from "@/components/ui/typography.jsx";

const CustomSlider = () => {
    const swiperRef = useRef(null);

    const slides = [
        {
            id: 1,
            image: HeroImage1,
            title: 'Explore in Style',
            header: 'Kenyamanan dalam Setiap Perjalanan',
            description: 'Jadikan liburan Anda lebih bermakna dengan layanan rental mobil premium kami. Armada berkualitas tinggi dan terawat untuk memastikan perjalanan Anda berkesan dan tanpa hambatan.'
        },
        {
            id: 2,
            image: HeroImage2,
            title: 'Reliable Transportation',
            header: 'Solusi Transportasi Terbaik Anda',
            description: 'Kami hadir untuk memberikan pengalaman berkendara terbaik dengan pilihan kendaraan yang sesuai dengan kebutuhan Anda. Keamanan dan kenyamanan menjadi prioritas utama kami.'
        },
        {
            id: 3,
            image: HeroImage3,
            title: 'Your Journey Partner',
            header: 'Partner Perjalanan Tepercaya',
            description: 'Temukan kemudahan bepergian dengan layanan rental mobil kami. Dengan harga bersaing dan pelayanan prima, kami siap mendampingi setiap momen penting dalam perjalanan Anda.'
        }
    ];

    return (
        <div className="custom-slider-container">
            <Swiper
                modules={[Navigation, Autoplay]}
                slidesPerView={1}
                loop={true}
                autoplay={{
                    delay: 10000,
                    disableOnInteraction: false,
                }}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
                className="custom-swiper"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="slide-image"
                        />
                        <div
                            className="absolute z-10 inset-0 bg-gradient-to-l from-black/80 via-black/50 to-black/70"></div>

                        <div
                            className="absolute inset-0 z-10 flex flex-col justify-center items-center text-white text-center px-4 md:px-24 -mt-10 md:mt-0 space-y-1">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <TypographyH2 className="border-b ">{slide.title}</TypographyH2>
                            </div>
                            <TypographyH1 className="text-4xl md:text-5xl font-bold mb-4">
                                {slide.header}
                            </TypographyH1>
                            <div className="md:px-32">
                                <TypographyP >
                                    {slide.description}
                                </TypographyP>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <button
                onClick={() => swiperRef.current?.slidePrev()}
                className="nav-button prev-button"
                aria-label="Previous slide"
            >
                <ChevronLeft size={24}/>
            </button>
            <button
                onClick={() => swiperRef.current?.slideNext()}
                className="nav-button next-button"
                aria-label="Next slide"
            >
                <ChevronRight size={24}/>
            </button>
        </div>
    );
};

export default CustomSlider;