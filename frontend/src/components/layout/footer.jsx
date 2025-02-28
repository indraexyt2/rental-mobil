import React from "react";
import { Link } from "react-router-dom";
import {
    Facebook,
    Instagram,
    Twitter,
    Mail,
    Phone,
    MapPin,
    Car,
    Clock,
    CalendarDays,
    Users,
    Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";

const Footer = () => {
    const footerLinks = [
        {
            title: "Layanan",
            links: [
                { name: "Sewa Harian", path: "/layanan/sewa-harian" },
                { name: "Sewa Bulanan", path: "/layanan/sewa-bulanan" },
                { name: "Sewa dengan Sopir", path: "/layanan/dengan-sopir" },
                { name: "Antar Jemput", path: "/layanan/antar-jemput" },
            ]
        },
        {
            title: "Armada",
            links: [
                { name: "Sedan", path: "/armada/sedan" },
                { name: "SUV", path: "/armada/suv" },
                { name: "MPV", path: "/armada/mpv" },
                { name: "Van", path: "/armada/van" },
                { name: "Mobil Mewah", path: "/armada/mewah" }
            ]
        },
        {
            title: "Informasi",
            links: [
                { name: "Tentang Kami", path: "/tentang" },
                { name: "Cara Booking", path: "/cara-booking" },
                { name: "Blog", path: "/blog" },
                { name: "FAQ", path: "/faq" },
                { name: "Kebijakan Privasi", path: "/kebijakan-privasi" }
            ]
        }
    ];

    const features = [
        {
            icon: <CalendarDays size={20} />,
            title: "Fleksibel",
            description: "Pilihan sewa harian, mingguan, hingga bulanan"
        },
        {
            icon: <Car size={20} />,
            title: "Berkualitas",
            description: "Armada terawat dengan kondisi prima"
        },
        {
            icon: <Clock size={20} />,
            title: "Tepat Waktu",
            description: "Pengantaran dan penjemputan selalu on time"
        },
        {
            icon: <Shield size={20} />,
            title: "Terpercaya",
            description: "Perlindungan asuransi untuk keamanan Anda"
        }
    ];

    return (
        <footer className="bg-slate-50 border-t border-slate-200 mt-10 w-full">
            <div className="px-4 sm:px-6 md:px-8 lg:px-16 w-full py-10 mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    <div className="lg:col-span-1 space-y-6">
                        <Link to="/" className="inline-block">
                            <h2 className="text-3xl font-bold text-blue-600">wheelGo</h2>
                        </Link>

                        <p className="text-slate-600 max-w-md">
                            Solusi rental mobil berkualitas dengan layanan terbaik. Nikmati perjalanan nyaman dengan armada terawat dan pelayanan profesional.
                        </p>

                        <div className="flex items-center gap-2 mt-6">
                            <Button variant="outline" size="icon" className="rounded-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
                                <Facebook size={18} />
                            </Button>
                            <Button variant="outline" size="icon" className="rounded-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
                                <Instagram size={18} />
                            </Button>
                            <Button variant="outline" size="icon" className="rounded-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
                                <Twitter size={18} />
                            </Button>
                        </div>
                    </div>

                    <div className="lg:col-span-2 hidden lg:grid grid-cols-3 gap-8">
                        {footerLinks.map((section, index) => (
                            <div key={index}>
                                <h3 className="font-semibold text-lg text-slate-800 mb-6">{section.title}</h3>
                                <ul className="space-y-2">
                                    {section.links.map((link, linkIndex) => (
                                        <li key={linkIndex}>
                                            <Link
                                                to={link.path}
                                                className="text-slate-600 hover:text-blue-600 transition inline-block"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <h3 className="font-semibold text-lg text-slate-800 mb-6">Hubungi Kami</h3>
                        <div className="space-y-2">
                            <a href="tel:+6281234567890" className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition group">
                                <div className="bg-slate-100 p-2 rounded-full group-hover:bg-blue-100 transition">
                                    <Phone size={18} className="text-slate-500 group-hover:text-blue-600" />
                                </div>
                                <span>+62 812-3456-7890</span>
                            </a>

                            <a href="mailto:info@wheelgo.id" className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition group">
                                <div className="bg-slate-100 p-2 rounded-full group-hover:bg-blue-100 transition">
                                    <Mail size={18} className="text-slate-500 group-hover:text-blue-600" />
                                </div>
                                <span>info@wheelgo.id</span>
                            </a>

                            <div className="flex items-start gap-3 text-slate-600 group">
                                <div className="bg-slate-100 p-2 rounded-full mt-0.5">
                                    <MapPin size={18} className="text-slate-500" />
                                </div>
                                <span>Jl. Raya Mobil No. 123, Jakarta Selatan, DKI Jakarta</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:hidden col-span-full border-t border-slate-200 pt-6">
                        <Accordion type="single" collapsible className="w-full">
                            {footerLinks.map((section, index) => (
                                <AccordionItem key={index} value={`section-${index}`} className="border-b border-slate-200">
                                    <AccordionTrigger className="text-slate-800 hover:text-blue-600 hover:no-underline">
                                        {section.title}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="space-y-3 pt-2 pb-4">
                                            {section.links.map((link, linkIndex) => (
                                                <li key={linkIndex}>
                                                    <Link
                                                        to={link.path}
                                                        className="text-slate-600 hover:text-blue-600 transition inline-block"
                                                    >
                                                        {link.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>

            <div className="border-t border-slate-200 bg-slate-100 w-full">
                <div className="px-4 sm:px-6 md:px-8 lg:px-16 w-full py-6 mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-500 text-sm">
                            &copy; {new Date().getFullYear()} wheelGo. Hak Cipta Dilindungi.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <Link to="/kebijakan-privasi" className="text-slate-500 hover:text-blue-600 text-sm transition">
                                Kebijakan Privasi
                            </Link>
                            <Link to="/syarat-ketentuan" className="text-slate-500 hover:text-blue-600 text-sm transition">
                                Syarat & Ketentuan
                            </Link>
                            <Link to="/sitemap" className="text-slate-500 hover:text-blue-600 text-sm transition">
                                Peta Situs
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;