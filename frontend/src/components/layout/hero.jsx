import React from 'react';
import CustomSlider from "@/components/ui/slider/slider.jsx";
import CarSearchBar from "@/components/ui/form-search-car.jsx";

const Hero = () => {
    return (
        <div>
            <div className="relative">
                <CustomSlider/>
            </div>

            <div className="w-full flex justify-center">
                <div className="w-full md:w-max mx-7 -mt-24 md:-mt-8 z-20 bg-white p-4 rounded-3xl md:rounded-full shadow-md">
                    <div>
                        <CarSearchBar/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;