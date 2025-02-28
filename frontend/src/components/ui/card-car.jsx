import {TypographyH2, TypographyH3} from "@/components/ui/typography.jsx";
import {Fuel, Gauge, Pocket} from "lucide-react";
import {Link} from "react-router-dom";

const CardCar = () => {
    const formatRupiah = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="group flex flex-col space-y-2 w-full h-full bg-white rounded-lg shadow-sm hover:shadow-md hover:shadow-blue-500/40 hover:border-blue-500/40 transition-shadow duration-300 border">
            <div className="w-full h-56 sm:h-48 overflow-hidden rounded-t-lg">
                <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                    src="https://carvan.wpengine.com/wp-content/uploads/2024/12/directory-listing-12.jpg"
                    alt=""
                />
            </div>

            <div className="flex flex-col px-4 py-4 space-y-4 flex-grow">
                <div>
                    <span className="font-semibold text-slate-700 text-sm">
                    Sport Cars / SUV Cars
                    </span>
                    <TypographyH2 className="text-xl sm:text-xl md:text-2xl font-bold text-slate-600 line-clamp-1 mt-2">
                        <Link className="hover:text-blue-500 transition-colors duration-500" to="/">
                            Rapid Falcon Drift Max
                        </Link>
                    </TypographyH2>
                </div>

                <div className="flex items-center space-x-3 border-b pb-3">
                    <Fuel className="text-slate-700 shrink-0" size={24}/>
                    <TypographyH3 className="text-base sm:text-lg text-slate-700">
                        Bahan Bakar:
                    </TypographyH3>
                </div>

                <div className="flex items-center space-x-3 border-b pb-3">
                    <Gauge className="text-slate-700 shrink-0" size={24}/>
                    <TypographyH3 className="text-base sm:text-lg text-slate-700">
                        Kilometer:
                    </TypographyH3>
                </div>

                <div className="flex items-center space-x-3 border-b pb-3">
                    <Pocket className="text-slate-700 shrink-0" size={24}/>
                    <TypographyH3 className="text-base sm:text-lg text-slate-700">
                        Merk:
                    </TypographyH3>
                </div>

                <div className="flex items-center space-x-2 pb-1">
                    <span className="text-base sm:text-lg text-slate-600">
                        Harga:
                    </span>
                    <span className="text-slate-700 font-bold leading-6 text-xl">
                        {formatRupiah(350000)}
                    </span>
                    <span className="">
                        / hari
                    </span>
                </div>
            </div>
        </div>
    )
}

export default CardCar;