import React, { useState, useEffect } from 'react';
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
import {useCarStore} from "@/store/car-store.js";

const MultiSelect = ({ options, selected, onChange, placeholder, label, searchPlaceholder }) => {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const getItemName = (id) => {
        const option = options.find(option => option.id.toString() === id);
        return option ? (option.category_name || option.feature) : id;
    };

    const filteredOptions = options.filter(option => {
        // Make sure option exists and has a name property
        if (!option) return false;
        const name = option.category_name || option.feature || '';
        return name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Get names of all selected items for display
    const selectedNames = selected.map(id => getItemName(id));

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between bg-background hover:bg-background border border-input"
                >
                    <div className="flex flex-wrap gap-1 overflow-hidden">
                        {selected.length === 0 ? (
                            <span className="text-muted-foreground">{placeholder}</span>
                        ) : (
                            <div className="truncate">
                                {selectedNames.join(', ')}
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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <ScrollArea className="h-60">
                    <div className="p-1">
                        {filteredOptions.length > 0 ? filteredOptions.map((option) => {
                            const id = option.id.toString();
                            const name = option.category_name || option.feature;
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
                        }) : (
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
    const { addCar, getModels, getFeatures, models, features, isLoading, error, resetError } = useCarStore();

    // Load categories and features from the API when component mounts
    useEffect(() => {
        async function fetchData() {
            try {
                await getModels();
                await getFeatures();
            } catch (e) {
                console.log("Err", e)
            }
        }

        fetchData()

    }, [getModels, getFeatures]);

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
        categories: z.array(z.string()).min(1, { message: "Minimal pilih satu model" }),
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

    const onSubmit = async (data) => {
        if (uploadedImages.length === 0) {
            toast.error("Minimal satu gambar mobil harus diunggah");
            return;
        }

        // Extract just the file objects for submission
        const imageFiles = uploadedImages.map(image => image.file);

        try {
            // Prepare data for submission
            const carData = {
                ...data,
                car: imageFiles // Pass the file objects directly
            };

            // Submit to the API using our store
            await addCar(carData);

            toast.success("Mobil berhasil ditambahkan!");

            // Reset form and uploaded images
            form.reset();
            setUploadedImages([]);

            // Optionally, go back to the previous screen
            if (onBack) onBack();

        } catch (error) {
            // Error will be handled by the store and set in the error state
            if (Array.isArray(error)) {
                error.forEach(err => toast.error(err));
            } else {
                toast.error("Gagal menambahkan mobil. Silakan coba lagi.");
            }
        }
    };

    // Show error notifications when error state changes
    useEffect(() => {
        if (error) {
            if (Array.isArray(error)) {
                error.forEach(err => toast.error(err));
            } else if (typeof error === 'string') {
                toast.error(error);
            }
            resetError();
        }
    }, [error, resetError]);

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
                                                <SelectItem value="Manual">Manual</SelectItem>
                                                <SelectItem value="Automatic">Automatic</SelectItem>
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
                                    <FormLabel>Model</FormLabel>
                                    <FormControl>
                                        <MultiSelect
                                            options={models || []}
                                            selected={field.value}
                                            onChange={field.onChange}
                                            placeholder="Pilih model..."
                                            label="model"
                                            searchPlaceholder="Cari model..."
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
                                            options={features || []}
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
                                disabled={isLoading}
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