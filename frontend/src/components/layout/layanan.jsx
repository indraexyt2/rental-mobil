import { Card, CardContent } from "@/components/ui/card";
import { Clock, Wrench, Car, Fan, Dam, Thermometer } from "lucide-react";

const LayananRental = () => {
    const layananList = [
        {
            icon: Clock,
            title: "Siap Sedia 24 Jam",
            description: "Bantuan Kapan Saja"
        },
        {
            icon: Wrench,
            title: "Servis Berkala",
            description: "Perawatan Rutin Mesin"
        },
        {
            icon: Car,
            title: "Rawat Mesin Mobil",
            description: "Performa Tetap Prima"
        },
        {
            icon: Fan,
            title: "Perbaikan Knalpot",
            description: "Atasi Kebocoran"
        },
        {
            icon: Dam,
            title: "Ganti Oli Rutin",
            description: "Termasuk Filter Baru"
        },
        {
            icon: Thermometer,
            title: "Rawat Radiator",
            description: "Cegah Mesin Panas"
        }
    ];

    return (
        <div className="w-full px-3 sm:px-5 md:px-16 mt-7">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {layananList.map((layanan, index) => {
                    const IconComponent = layanan.icon;
                    return (
                        <Card key={index} className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6 flex">
                                <div className="bg-slate-100 p-4 rounded-lg mr-4">
                                    <IconComponent className="h-10 w-10 text-slate-700" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">{layanan.description}</p>
                                    <h3 className="text-xl font-bold text-slate-800 mt-1">{layanan.title}</h3>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default LayananRental;