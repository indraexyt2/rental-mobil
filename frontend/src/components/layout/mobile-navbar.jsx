import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Car, Briefcase, Info, ChevronDown, ChevronRight, PhoneCall } from "lucide-react";
import { cn } from "@/lib/utils";

export const menuItems = [
    {
        title: "Armada",
        icon: <Car className="h-5 w-5 mr-2" />,
        subItems: [
            {
                name: "Sedan",
                path: "/armada/sedan",
                description: "Kenyamanan optimal untuk perjalanan bisnis dan keluarga",
            },
            {
                name: "SUV",
                path: "/armada/suv",
                description: "Performa tangguh di segala medan dan kondisi",
            },
            {
                name: "Mobil Mewah",
                path: "/armada/mewah",
                description: "Pengalaman berkendara premium dengan gaya elit",
            },
            {
                name: "Van",
                path: "/armada/van",
                description: "Solusi transportasi ideal untuk kelompok besar",
            },
        ],
    },
    {
        title: "Layanan",
        icon: <Briefcase className="h-5 w-5 mr-2" />,
        subItems: [
            {
                name: "Sewa Harian",
                path: "/layanan/sewa-harian",
                description: "Fleksibilitas sewa mobil sesuai kebutuan harian",
            },
            {
                name: "Sewa Bulanan",
                path: "/layanan/sewa-bulanan",
                description: "Hemat dan praktis untuk kebutuhan jangka panjang",
            },
            {
                name: "Antar Jemput",
                path: "/layanan/antar-jemput",
                description: "Layanan antar jemput mudah dan nyaman",
            },
        ],
    },
    {
        name: "Tentang",
        icon: <Info className="h-5 w-5 mr-2" />,
        path: "/tentang",
    },
];

const MobileNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState(null);

    const toggleSubmenu = (index) => {
        setOpenSubmenu(openSubmenu === index ? null : index);
    };

    return (
        <nav className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-gray-700 hover:bg-gray-100">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[320px] p-0">
                        <SheetHeader className="p-2 border-b">
                            <SheetTitle className="text-2xl font-bold text-left px-4 text-blue-600">
                                wheelGo
                            </SheetTitle>
                        </SheetHeader>

                        <div className="py-2 overflow-y-auto">
                            {menuItems.map((item, index) => (
                                <div key={index} className="border-b border-gray-100 last:border-0">
                                    {item.subItems ? (
                                        <div>
                                            <button
                                                onClick={() => toggleSubmenu(index)}
                                                className="w-full py-4 px-6 flex justify-between items-center hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-center">
                                                    {item.icon}
                                                    <span className="font-medium">{item.title}</span>
                                                </div>
                                                {openSubmenu === index ? (
                                                    <ChevronDown className="h-5 w-5 text-gray-500" />
                                                ) : (
                                                    <ChevronRight className="h-5 w-5 text-gray-500" />
                                                )}
                                            </button>
                                            <div
                                                className={cn(
                                                    "bg-gray-50 overflow-hidden transition-all duration-300",
                                                    openSubmenu === index ? "max-h-96" : "max-h-0"
                                                )}
                                            >
                                                {item.subItems.map((subItem, subIndex) => (
                                                    <Link
                                                        key={subIndex}
                                                        to={subItem.path}
                                                        className="block py-3 px-6 pl-12 hover:bg-gray-100 transition-colors border-l-4 border-transparent hover:border-blue-500"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        <div className="font-medium">{subItem.name}</div>
                                                        <div className="text-sm text-gray-500 mt-1">
                                                            {subItem.description}
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <Link
                                            to={item.path}
                                            className="block py-4 px-6 hover:bg-gray-50 transition-colors flex items-center"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {item.icon}
                                            <span className="font-medium">{item.name}</span>
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>

                        <SheetFooter className="flex flex-col gap-3 p-6 border-t mt-auto">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                Booking Sekarang
                            </Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>

                <Link to="/" className="text-xl font-bold text-blue-600">
                    wheelGo
                </Link>
            </div>

            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 hidden sm:block">
                Booking Sekarang
            </Button>
        </nav>
    );
};

export default MobileNavbar;