import React from "react"
import { Link } from "react-router-dom"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"
import { Separator } from "@/components/ui/separator"
import { PhoneIncoming, Mail, Facebook, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button"
import MobileNavbar from "@/components/layout/mobile-navbar.jsx"
import { menuItems } from "@/components/layout/mobile-navbar.jsx";

const ListItem = React.forwardRef(({ title, description, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    ref={ref}
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {description}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"

const Navbar = () => {
    return (
        <div>
            <div className={`w-screen px-3 sm:px-5 md:px-16 py-3 hidden sm:flex justify-center md:justify-between border-b-2`}>
                <div className={`flex items-center space-x-5`}>
                    <div className={`flex items-center space-x-2`}>
                        <PhoneIncoming size={18}/>
                        <a href="tel:+12435678900"
                           className={`text-sm font-semibold hover:text-blue-500 transition-colors duration-300 ease-in-out`}>
                            +12 345-678-900
                        </a>
                    </div>
                    <Separator orientation="vertical" className="h-5 self-center"/>
                    <div className={`flex items-center space-x-2`}>
                        <Mail size={18}/>
                        <a href="mailto:wheelGo@support.com"
                           className={`text-sm font-semibold hover:text-blue-500 transition-colors duration-300 ease-in-out`}>
                            wheelGo@support.com
                        </a>
                    </div>
                </div>
                <div className={`hidden md:flex items-center space-x-3`}>
                    <Link to={'/bantuan'} className={'hover:text-blue-500'}>
                        <p className={'text-sm font-semibold'}>Bantuan</p>
                    </Link>
                    <Separator orientation="vertical" className="h-5 self-center"/>
                    <Link to={'/kontak'} className={'hover:text-blue-500'}>
                        <p className={'text-sm font-semibold'}>Kontak</p>
                    </Link>
                    <Separator orientation="vertical" className="h-5 self-center"/>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                        <div
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-black hover:bg-blue-500 transition-colors duration-300 ease-in-out cursor-pointer">
                            <Facebook size={18} color="white"/>
                        </div>
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                        <div
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-black hover:bg-blue-500 transition-colors duration-300 ease-in-out cursor-pointer">
                            <Instagram size={18} color="white"/>
                        </div>
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                        <div
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-black hover:bg-blue-500 transition-colors duration-300 ease-in-out cursor-pointer">
                            <Youtube size={18} color="white"/>
                        </div>
                    </a>
                </div>
            </div>
            <nav className={`w-screen px-3 sm:px-5 md:px-16 py-3 flex justify-between items-center border-b-2`}>
                <div className="hidden md:flex items-center space-x-4">
                    <Link to="/" className="text-2xl font-bold text-blue-600">wheelGo</Link>
                    <NavigationMenu>
                        <NavigationMenuList>
                        {menuItems.map((item, index) => (
                                <NavigationMenuItem key={index}>
                                    {item.subItems ? (
                                        <>
                                            <NavigationMenuTrigger className="text-md">{item.title}</NavigationMenuTrigger>
                                            <NavigationMenuContent>
                                                <ul className={`grid w-[400px] gap-3 p-4 ${item.title === 'Layanan' ? 'md:w-[300px]' : 'md:w-[500px] md:grid-cols-2'}`}>
                                                    {item.subItems.map((subItem, subIndex) => (
                                                        <ListItem
                                                            key={subIndex}
                                                            to={subItem.path}
                                                            title={subItem.name}
                                                            description={subItem.description}
                                                        />
                                                    ))}
                                                </ul>
                                            </NavigationMenuContent>
                                        </>
                                    ) : (
                                        <Link to={item.path} className={navigationMenuTriggerStyle()}>
                                            {item.name}
                                        </Link>
                                    )}
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <div className={"md:hidden"}>
                    <MobileNavbar/>
                </div>

                <div className={"space-x-3"}>
                    <Button variant='blue' className="rounded-full w-18 sm:w-24 shadow-sm text-md">
                        <Link to={'/auth'}>
                            Daftar
                        </Link>
                    </Button>
                    <Button variant='outline' className="rounded-full w-18 sm:w-24 shadow-sm text-md">
                        <Link to={'/auth'}>
                            Masuk
                        </Link>
                    </Button>
                </div>
            </nav>
        </div>
    )
}

export default Navbar