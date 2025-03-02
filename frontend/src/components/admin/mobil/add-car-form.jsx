import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, X, Image, Check, ChevronsUpDown, Search } from 'lucide-react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { cn } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const mockCategories = [
    { id: 1, category_name: "SUV" },
    { id: 2, category_name: "Sedan" },
    { id: 3, category_name: "MPV" },
    { id: 4, category_name: "Hatchback" },
    { id: 5, category_name: "Sport" },
    { id: 6, category_name: "Luxury" },
    { id: 7, category_name: "Family" },
    { id: 8, category_name: "Electric" }
];

const mockFeatures = [
    { id: 1, feature_name: "AC" },
    { id: 2, feature_name: "Bluetooth" },
    { id: 3, feature_name: "Rear Camera" },
    { id: 4, feature_name: "Sunroof" },
    { id: 5, feature_name: "Leather Seats" },
    { id: 6, feature_name: "Navigation" },
    { id: 7, feature_name: "Power Windows" },
    { id: 8, feature_name: "Keyless Entry" },
    { id: 9, feature_name: "Cruise Control" },
    { id: 10, feature_name: "Airbags" }
];

const MultiSelect = ({ options, selected, onChange, placeholder, label, searchPlaceholder }) => {
    const [open, setOpen] = useState(false);

    const getItemName = (id) => {
        const option = options.find(option => option.id.toString() === id);
        return option ? (option.category_name || option.feature_name) : id;
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between bg-background hover:bg-background border border-input"
                >
                    <div className="flex flex-wrap gap-1">
                        {selected.length === 0 ? (
                            <span className="text-muted-foreground">{placeholder}</span>
                        ) : (
                            <div className="flex items-center">
                <span>
                  {selected.length} {label} dipilih
                </span>
                            </div>
                        )}
                    </div>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <div className="flex items-center border-b px-3 py-2">
                    <Search className="h-4 w-4 mr-2 opacity-50" />
                    <input
                        className="flex h-9 w-full rounded-md bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder={searchPlaceholder || "Cari..."}
                    />
                </div>
                <ScrollArea className="h-60">
                    <div className="p-1">
                        {options.map((option) => {
                            const id = option.id.toString();
                            const name = option.category_name || option.feature_name;
                            const isSelected = selected.includes(id);

                            return (
                                <div
                                    key={id}
                                    className={cn(
                                        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                                        isSelected && "bg-accent/50"
                                    )}
                                    onClick={() => {
                                        onChange(
                                            isSelected
                                                ? selected.filter((i) => i !== id)
                                                : [...selected, id]
                                        );
                                    }}
                                >
                                    <div className={cn(
                                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                        isSelected ? "bg-primary text-primary-foreground" : "opacity-50"
                                    )}>
                                        {isSelected && <Check className="h-3 w-3" />}
                                    </div>
                                    <span>{name}</span>
                                </div>
                            );
                        })}
                        {options.length === 0 && (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                                Tidak ada data yang tersedia
                            </div>
                        )}
                    </div>
                </ScrollArea>
                {selected.length > 0 && (
                    <div className="border-t p-2">
                        <div className="flex flex-wrap gap-1 py-1">
                            {selected.map((item) => (
                                <Badge
                                    key={item}
                                    variant="secondary"
                                    className="rounded-sm px-1 py-0 text-xs"
                                >
                                    {getItemName(item)}
                                    <button
                                        className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onChange(selected.filter((i) => i !== item));
                                        }}
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                        <div className="flex justify-between mt-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange([]);
                                }}
                            >
                                Hapus Semua
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => setOpen(false)}
                            >
                                Selesai
                            </Button>
                        </div>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
};

const AddMobilForm = ({ onBack }) => {
    const [uploadedImages, setUploadedImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const formSchema = z.object({
        brand: z.string().min(1, { message: "Brand mobil wajib diisi" }),
        model: z.string().min(1, { message: "Model mobil wajib diisi" }),
        year: z.string().min(4, { message: "Tahun mobil wajib diisi" }),
        transmission: z.string().min(1, { message: "Transmisi mobil wajib diisi" }),
        capacity: z.string().min(1, { message: "Kapasitas mobil wajib diisi" }),
        fuel_type: z.string().min(1, { message: "Jenis bahan bakar wajib diisi" }),
        price_per_day: z.string().min(1, { message: "Harga per hari wajib diisi" }),
        description: z.string().min(1, { message: "Deskripsi mobil wajib diisi" }),
        mileage: z.string().min(1, { message: "Kilometer mobil wajib diisi" }),
        categories: z.array(z.string()).min(1, { message: "Minimal pilih satu kategori" }),
        features: z.array(z.string()).min(1, { message: "Minimal pilih satu fitur" }),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            brand: "",
            model: "",
            year: "",
            transmission: "",
            capacity: "",
            fuel_type: "",
            price_per_day: "",
            description: "",
            mileage: "",
            categories: [],
            features: []
        }
    });

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        if (files.length === 0) return;

        const newImages = files.map(file => ({
            id: Date.now() + Math.random().toString(36).substring(2, 9),
            file: file,
            preview: URL.createObjectURL(file),
            name: file.name
        }));

        setUploadedImages(prev => [...prev, ...newImages]);
    };

    const removeImage = (id) => {
        setUploadedImages(uploadedImages.filter(image => image.id !== id));
    };

    const onSubmit = (data) => {
        setIsLoading(true);

        if (uploadedImages.length === 0) {
            toast.error("Minimal satu gambar mobil harus diunggah");
            setIsLoading(false);
            return;
        }

        const formData = new FormData();

        Object.keys(data).forEach(key => {
            if (key === 'categories' || key === 'features') {
                formData.append(key, JSON.stringify(data[key]));
            } else {
                formData.append(key, data[key]);
            }
        });

        uploadedImages.forEach((image) => {
            formData.append(`car`, image.file);
        });

        setTimeout(() => {
            console.log("Form Data:", data);
            console.log("Uploaded Images:", uploadedImages);

            toast.success("Mobil berhasil ditambahkan!");
            setIsLoading(false);

            form.reset();
            setUploadedImages([]);

        }, 1500);
    };

    return (
        <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
                <div className="flex items-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="mr-2 h-8 w-8 p-0"
                        onClick={onBack}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <CardTitle>Tambah Mobil Baru</CardTitle>
                </div>
            </CardHeader>

            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <Label htmlFor="image-upload" className="text-base font-medium">Foto Mobil</Label>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {uploadedImages.map((image) => (
                                    <div
                                        key={image.id}
                                        className="relative group border rounded-md overflow-hidden aspect-square"
                                    >
                                        <img
                                            src={image.preview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => removeImage(image.id)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                        <div className="absolute bottom-0 w-full bg-black/60 text-white text-xs p-1 truncate">
                                            {image.name}
                                        </div>
                                    </div>
                                ))}

                                <label
                                    htmlFor="image-upload"
                                    className="border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer h-full aspect-square hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex flex-col items-center justify-center p-6 text-center">
                                        <Image className="h-8 w-8 text-gray-400 mb-2" />
                                        <div className="text-sm font-medium text-gray-900">Tambah Foto</div>
                                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP</p>
                                    </div>
                                    <input
                                        id="image-upload"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                </label>
                            </div>

                            {uploadedImages.length === 0 && (
                                <p className="text-sm text-red-500">
                                    * Minimal satu foto mobil wajib diunggah
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="brand"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Brand</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Contoh: Toyota, Honda, dll" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="model"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Model</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Contoh: Civic, Avanza, dll" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="year"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tahun</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Contoh: 2022" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="transmission"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Transmisi</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih transmisi" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Automatic">Automatic</SelectItem>
                                                <SelectItem value="Manual">Manual</SelectItem>
                                                <SelectItem value="CVT">CVT</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="capacity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kapasitas (Orang)</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih kapasitas" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {[2, 4, 5, 6, 7, 8].map(num => (
                                                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="fuel_type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Jenis Bahan Bakar</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih jenis bahan bakar" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Bensin">Bensin</SelectItem>
                                                <SelectItem value="Solar">Solar</SelectItem>
                                                <SelectItem value="Listrik">Listrik</SelectItem>
                                                <SelectItem value="Hybrid">Hybrid</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="price_per_day"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Harga per Hari (Rp)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Contoh: 300000" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="mileage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kilometer</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Contoh: 15000" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Deskripsi</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Deskripsi mobil"
                                            className="min-h-24"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="categories"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kategori</FormLabel>
                                    <FormControl>
                                        <MultiSelect
                                            options={mockCategories}
                                            selected={field.value}
                                            onChange={field.onChange}
                                            placeholder="Pilih kategori..."
                                            label="kategori"
                                            searchPlaceholder="Cari kategori..."
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="features"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fitur</FormLabel>
                                    <FormControl>
                                        <MultiSelect
                                            options={mockFeatures}
                                            selected={field.value}
                                            onChange={field.onChange}
                                            placeholder="Pilih fitur..."
                                            label="fitur"
                                            searchPlaceholder="Cari fitur..."
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-4 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onBack}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="bg-blue-600 text-white hover:bg-blue-700"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Menyimpan...' : 'Simpan Mobil'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default AddMobilForm;