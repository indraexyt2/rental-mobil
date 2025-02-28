"use client"

import React, { useState } from "react"
import { Search, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { InputCar } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export default function CarSearchBar() {
    const [formData, setFormData] = useState({
        carName: "",
        modelName: "",
        transmission: ""
    });

    const [modelOpen, setModelOpen] = useState(false)
    const [transmissionOpen, setTransmissionOpen] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    }

    const modelOptions = [
        { value: "sedan", label: "Sedan" },
        { value: "mpv", label: "MPV" },
        { value: "sport", label: "Sport" },
        { value: "van", label: "Van" },
        { value: "suv", label: "SUV" }
    ]

    const transmissionOptions = [
        { value: "automatic", label: "Automatic" },
        { value: "manual", label: "Manual" }
    ]

    const noHoverButtonClass = "w-full justify-between border-b md:border-none shadow-none text-slate-500 hover:bg-transparent hover:text-current active:scale-100"

    return (
        <form onSubmit={handleSubmit}
              className="w-full md:w-[40rem] lg:w-[60rem] md:flex space-y-5 md:space-y-0 items-center justify-evenly">
            <div className="w-full md:w-[40%]">
                <InputCar
                    name="carName"
                    placeholder="Nama mobil"
                    className="w-full text-sm font-semibold placeholder:font-semibold placeholder:text-slate-500 text-slate-500"
                    value={formData.carName}
                    onChange={handleChange}
                />
            </div>

            <Separator
                orientation="vertical"
                className="hidden md:flex h-12"
            />

            <div className="md:w-[40%]">
                <Popover open={modelOpen} onOpenChange={setModelOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            role="combobox"
                            aria-expanded={modelOpen}
                            className={noHoverButtonClass}
                        >
                            {formData.modelName
                                ? modelOptions.find((model) => model.value === formData.modelName)?.label
                                : "Pilih model"}
                            <ChevronsUpDown className="opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                        <Command>
                            <CommandInput placeholder="Cari model..." />
                            <CommandList>
                                <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                                <CommandGroup>
                                    {modelOptions.map((model) => (
                                        <CommandItem
                                            key={model.value}
                                            value={model.value}
                                            onSelect={(currentValue) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    modelName: currentValue === formData.modelName ? "" : currentValue
                                                }))
                                                setModelOpen(false)
                                            }}
                                        >
                                            {model.label}
                                            <Check
                                                className={cn(
                                                    "ml-auto",
                                                    formData.modelName === model.value ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            <Separator
                orientation="vertical"
                className="hidden md:flex h-12"
            />

            <div className="w-full md:w-[40%]">
                <Popover open={transmissionOpen} onOpenChange={setTransmissionOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            role="combobox"
                            aria-expanded={transmissionOpen}
                            className={noHoverButtonClass}
                        >
                            {formData.transmission
                                ? transmissionOptions.find((t) => t.value === formData.transmission)?.label
                                : "Pilih transmission"}
                            <ChevronsUpDown className="opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                        <Command>
                            <CommandInput placeholder="Cari transmission..." />
                            <CommandList>
                                <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                                <CommandGroup>
                                    {transmissionOptions.map((transmission) => (
                                        <CommandItem
                                            key={transmission.value}
                                            value={transmission.value}
                                            onSelect={(currentValue) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    transmission: currentValue === formData.transmission ? "" : currentValue
                                                }))
                                                setTransmissionOpen(false)
                                            }}
                                        >
                                            {transmission.label}
                                            <Check
                                                className={cn(
                                                    "ml-auto",
                                                    formData.transmission === transmission.value ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            <Separator
                orientation="vertical"
                className="hidden md:flex h-12"
            />

            <div className='md:w-[40%] flex justify-center'>
                <Button
                    type="submit"
                    variant="blue"
                    className="rounded-full w-full md:w-3/4 h-12 relative pl-8"
                >
                    <Search className="absolute left-4 h-4 w-4"/>
                    <span className="font-semibold text-base">Cari</span>
                </Button>
            </div>
        </form>
    )
}