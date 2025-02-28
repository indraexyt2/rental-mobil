import Hero from "@/components/layout/hero.jsx";
import {TypographyH2, TypographyH3} from "@/components/ui/typography.jsx";
import { Car, CornerDownRight } from 'lucide-react';
import CardCar from "@/components/ui/card-car.jsx";
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import {Link} from 'react-router-dom'
import LayananRental from "@/components/layout/layanan.jsx";

const HomePage = () => {
    return (
        <div className="flex flex-col w-full">
            {/* SECTION 1: HERO */}
            <section className="w-full">
                <Hero/>
            </section>

            {/* SECTION 2: JELAJAHI PILIHAN MOBIL */}
            <section className="w-full">
                <div className="px-3 sm:px-5 md:px-10 lg:px-16 mt-8">
                    <div className="flex space-x-2 items-center border-b-2 border-slate-800 w-max">
                        <TypographyH3 className="text-slate-800">
                            Rental Mobil Gak Pake Lama
                        </TypographyH3>
                        <Car/>
                    </div>
                </div>

                <div className="px-3 sm:px-5 md:px-10 lg:px-16 mt-5 w-full">
                    <div className="flex justify-between items-center w-full">
                        <TypographyH2 className="text-slate-800">
                            Jelajahi Pilihan Mobil Kami
                        </TypographyH2>
                        <Link className="flex space-x-2 group border-b-2 border-blue-500 pb-1">
                            <CornerDownRight className="group-hover:text-blue-500 transition-colors duration-300"/>
                            <span className="group-hover:text-blue-500 transition-colors duration-300">
                                Lihat lainnya
                            </span>
                        </Link>
                    </div>
                </div>

                <div className="px-4 sm:px-6 md:px-8 lg:px-16 w-full mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        <CardCar/>
                        <CardCar/>
                        <CardCar/>
                        <CardCar/>
                    </div>
                </div>
            </section>

            {/* SECTION 3: JELAJAHI BERDASARKAN MERK */}
            <section className="w-full mt-8">
                <div className="px-3 sm:px-5 md:px-10 lg:px-16 flex justify-center md:justify-start">
                    <div className="flex space-x-2 items-center border-b-2 border-slate-800 w-max">
                        <TypographyH3 className="text-slate-800">
                            Jelajahi berdasarkan merk
                        </TypographyH3>
                        <Car/>
                    </div>
                </div>

                <div className="px-3 sm:px-5 md:px-10 lg:px-16 mt-5 flex justify-center md:justify-start">
                    <TypographyH2 className="text-slate-800">
                        Pilihan Mobil Terbaik Kami
                    </TypographyH2>
                </div>

                <div className="px-4 sm:px-6 md:px-8 lg:px-16 w-full mt-5">
                    <Carousel
                        opts={{
                            align: "start",
                        }}
                        className="w-full"
                    >
                        <CarouselContent>
                            {Array.from({length: 8}).map((_, index) => (
                                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4 hover:cursor-grab">
                                    <div className="p-1">
                                        <Card>
                                            <CardContent className="p-0 aspect-square overflow-hidden rounded-2xl relative group">
                                                <img
                                                    src="https://imgcdnblog.carmudi.com.ph/wp-content/uploads/2022/09/09100613/2023-toyota-gr-supra-mt-500x333.png"
                                                    alt="Car image"
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />

                                                <div className="absolute inset-0 bg-black bg-opacity-30">
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center transition-all duration-300 group-hover:w-14 group-hover:h-14 group-hover:translate-y-2">
                                                            <svg viewBox="0 0 100 100" className="w-12 h-12 transition-all duration-500 group-hover:w-10 group-hover:h-10">
                                                                <path
                                                                    d="M50,16 C73.196,16 92,34.804 92,58 C92,81.196 73.196,100 50,100 C26.804,100 8,81.196 8,58 C8,34.804 26.804,16 50,16 Z M50,32 C35.641,32 24,43.641 24,58 C24,72.359 35.641,84 50,84 C64.359,84 76,72.359 76,58 C76,43.641 64.359,32 50,32 Z M84,8 C88.418,8 92,11.582 92,16 C92,20.418 88.418,24 84,24 C79.582,24 76,20.418 76,16 C76,11.582 79.582,8 84,8 Z M16,8 C20.418,8 24,11.582 24,16 C24,20.418 20.418,24 16,24 C11.582,24 8,20.418 8,16 C8,11.582 11.582,8 16,8 Z"
                                                                    fill="#DB0A30"
                                                                />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious/>
                        <CarouselNext/>
                    </Carousel>
                </div>
            </section>

            {/* SECTION 4: LAYANAN */}
            <section className="w-full mt-8">
                <div className="px-3 sm:px-5 md:px-16 flex justify-center">
                    <div className="flex space-x-2 items-center border-b-2 border-slate-800 w-max">
                        <TypographyH3 className="text-slate-800">
                            Reliable Service For Every Ride
                        </TypographyH3>
                        <Car/>
                    </div>
                </div>

                <div className="px-3 sm:px-5 md:px-16 mt-5 flex justify-center">
                    <TypographyH2 className="text-slate-800">
                        Mobil Terawat untuk Perjalanan Nyaman
                    </TypographyH2>
                </div>

                <LayananRental/>
            </section>
        </div>
    )
}

export default HomePage;