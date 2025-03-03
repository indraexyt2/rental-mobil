import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { PlusCircle, Search, Edit, Trash2, Eye, FilterX } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import AddMobilForm from './add-car-form.jsx';
import { useCarStore } from "@/store/car-store.js";

const MobilContent = () => {
    const { getCars, deleteCar, cars, pagination, isLoading, error, resetError } = useCarStore();
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCar, setSelectedCar] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [carToDelete, setCarToDelete] = useState(null);
    const [filters, setFilters] = useState({
        brand: '',
        transmission: 'all',
        fuel_type: 'all'
    });

    // Fetch cars on component mount
    useEffect(() => {
        loadCars();
    }, []);

    // Apply search
    const handleSearch = () => {
        loadCars();
    };

    // Load cars with pagination and filters
    const loadCars = async (page = 1) => {
        try {
            // Build query params
            const params = new URLSearchParams();

            // Add pagination
            params.append('page', page);
            params.append('limit', 10);

            // Add search term if present
            if (searchTerm) {
                params.append('brand', searchTerm);
            }

            // Add other filters if present
            if (filters.brand) params.append('brand', filters.brand);
            if (filters.transmission && filters.transmission !== 'all') params.append('transmission', filters.transmission);
            if (filters.fuel_type && filters.fuel_type !== 'all') params.append('fuel_type', filters.fuel_type);

            await getCars(params.toString());
        } catch (err) {
            console.error("Failed to load cars:", err);
            toast.error("Gagal memuat data mobil");
        }
    };

    // Handle page change
    const handlePageChange = (page) => {
        loadCars(page);
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setFilters({
            brand: '',
            transmission: 'all',
            fuel_type: 'all'
        });
        loadCars(1);
    };

    // Handle error notifications
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

    const handleShowAddForm = () => {
        setSelectedCar(null);
        setIsEditing(false);
        setShowAddForm(true);
    };

    const handleEditCar = (car) => {
        setSelectedCar(car);
        setIsEditing(true);
        setShowAddForm(true);
    };

    const handleDeleteCar = async () => {
        if (!carToDelete) return;

        try {
            await deleteCar(carToDelete.id);
            toast.success("Mobil berhasil dihapus");
            setDeleteDialogOpen(false);
            setCarToDelete(null);
            // Refresh cars list
            loadCars(pagination?.page || 1);
        } catch (err) {
            console.error("Failed to delete car:", err);
            toast.error("Gagal menghapus mobil");
        }
    };

    const handleConfirmDelete = (car) => {
        setCarToDelete(car);
        setDeleteDialogOpen(true);
    };

    const handleBackToTable = async () => {
        setShowAddForm(false);
        setSelectedCar(null);
        setIsEditing(false);
        // Refresh cars list if editing or adding was done
        loadCars(pagination?.page || 1);
    };

    const getRandomColor = (id) => {
        const colors = ['bg-blue-100 text-blue-800', 'bg-green-100 text-green-800',
            'bg-purple-100 text-purple-800', 'bg-orange-100 text-orange-800',
            'bg-teal-100 text-teal-800'];
        return colors[id % colors.length];
    };

    // Format price to rupiah
    const formatToRupiah = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    return (
        <>
            <Toaster position="top-center" richColors closeButton />

            {showAddForm ? (
                <AddMobilForm
                    onBack={handleBackToTable}
                    carData={selectedCar}
                    isEditing={isEditing}
                />
            ) : (
                <>
                    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <h1 className="text-2xl font-bold text-gray-800">Mobil</h1>
                        <Button
                            className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                            onClick={handleShowAddForm}
                        >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Tambah Mobil
                        </Button>
                    </div>

                    <Card className="shadow-sm border-gray-200 mb-6 w-full">
                        <CardHeader className="pb-2">
                            <CardTitle>Filter</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                                <div className="w-full">
                                    <label className="text-sm font-medium mb-1 block">Brand</label>
                                    <Input
                                        placeholder="Masukkan brand..."
                                        value={filters.brand}
                                        onChange={(e) => setFilters({...filters, brand: e.target.value})}
                                        className="w-full"
                                    />
                                </div>
                                <div className="w-full">
                                    <label className="text-sm font-medium mb-1 block">Transmisi</label>
                                    <Select
                                        value={filters.transmission}
                                        onValueChange={(value) => setFilters({...filters, transmission: value})}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih transmisi" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua</SelectItem>
                                            <SelectItem value="Manual">Manual</SelectItem>
                                            <SelectItem value="Automatic">Automatic</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="w-full">
                                    <label className="text-sm font-medium mb-1 block">Bahan Bakar</label>
                                    <Select
                                        value={filters.fuel_type}
                                        onValueChange={(value) => setFilters({...filters, fuel_type: value})}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih bahan bakar" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua</SelectItem>
                                            <SelectItem value="Bensin">Bensin</SelectItem>
                                            <SelectItem value="Solar">Solar</SelectItem>
                                            <SelectItem value="Listrik">Listrik</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-end gap-2 w-full">
                                    <Button
                                        onClick={() => loadCars(1)}
                                        className="bg-blue-600 text-white hover:bg-blue-700 flex-1"
                                    >
                                        <Search className="h-4 w-4 mr-2" />
                                        Filter
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={clearFilters}
                                        className="flex-1"
                                    >
                                        <FilterX className="h-4 w-4 mr-2" />
                                        Reset
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-gray-200 w-full">
                        <CardHeader className="pb-2">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
                                <CardTitle>Daftar Mobil</CardTitle>
                                <div className="relative w-full sm:w-72">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Cari berdasarkan brand..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-8 w-full"
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="py-8 text-center text-gray-500">
                                    Memuat data mobil...
                                </div>
                            ) : (
                                <div className="overflow-x-auto w-full">
                                    <div className="inline-block min-w-full align-middle">
                                        <div className="overflow-hidden rounded-lg">
                                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                                <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider">#</th>
                                                    <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                                    <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider">Tahun</th>
                                                    <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider">Transmisi</th>
                                                    <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider">Harga/Hari</th>
                                                    <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th className="py-3 px-4 text-right font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                                </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 bg-white">
                                                {cars && cars.length > 0 ? (
                                                    cars.map((car, index) => {
                                                        // Calculate the actual index based on pagination
                                                        const actualIndex = ((pagination?.page || 1) - 1) * (pagination?.limit || 10) + index + 1;

                                                        return (
                                                            <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                                                                <td className="py-4 px-4">
                                                                    <Badge className={`${getRandomColor(car.id)}`}>
                                                                        {actualIndex}
                                                                    </Badge>
                                                                </td>
                                                                <td className="py-4 px-4 font-medium">{car.brand} {car.model}</td>
                                                                <td className="py-4 px-4">{car.year}</td>
                                                                <td className="py-4 px-4">{car.transmission}</td>
                                                                <td className="py-4 px-4 font-medium">{formatToRupiah(car.price_per_day)}</td>
                                                                <td className="py-4 px-4">
                                                                    <Badge className={car.is_active
                                                                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                                        : 'bg-red-100 text-red-800 hover:bg-red-200'}>
                                                                        {car.is_active ? 'Aktif' : 'Tidak Aktif'}
                                                                    </Badge>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <div className="flex gap-2 justify-end">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                                                        >
                                                                            <Eye className="h-4 w-4" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                                                            onClick={() => handleEditCar(car)}
                                                                        >
                                                                            <Edit className="h-4 w-4" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                                            onClick={() => handleConfirmDelete(car)}
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                ) : (
                                                    <tr>
                                                        <td colSpan="7" className="py-8 text-center text-gray-500">
                                                            {searchTerm || (filters.brand || filters.transmission !== 'all' || filters.fuel_type !== 'all')
                                                                ? 'Tidak ada mobil yang sesuai dengan pencarian/filter.'
                                                                : 'Belum ada data mobil.'}
                                                        </td>
                                                    </tr>
                                                )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {pagination && pagination.total_page > 1 && (
                                <div className="mt-4 flex flex-col sm:flex-row gap-4 sm:gap-0 items-center justify-between border-t pt-4">
                                    <div className="text-sm text-gray-500">
                                        Menampilkan {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total_data)} dari {pagination.total_data} mobil
                                    </div>
                                    <Pagination>
                                        <PaginationContent>
                                            {pagination.page > 1 && (
                                                <PaginationItem>
                                                    <PaginationPrevious
                                                        onClick={() => handlePageChange(pagination.page - 1)}
                                                    />
                                                </PaginationItem>
                                            )}

                                            {Array.from({ length: Math.min(pagination.total_page, 5) }).map((_, i) => {
                                                // Logic to show pages around the current page
                                                let pageNum;
                                                if (pagination.total_page <= 5) {
                                                    // Show all pages if there are 5 or fewer
                                                    pageNum = i + 1;
                                                } else if (pagination.page <= 3) {
                                                    // At the start, show first 5 pages
                                                    pageNum = i + 1;
                                                } else if (pagination.page >= pagination.total_page - 2) {
                                                    // At the end, show last 5 pages
                                                    pageNum = pagination.total_page - 4 + i;
                                                } else {
                                                    // In the middle, show current page and 2 pages on each side
                                                    pageNum = pagination.page - 2 + i;
                                                }

                                                return (
                                                    <PaginationItem key={pageNum}>
                                                        <PaginationLink
                                                            isActive={pageNum === pagination.page}
                                                            onClick={() => handlePageChange(pageNum)}
                                                        >
                                                            {pageNum}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                );
                                            })}

                                            {pagination.page < pagination.total_page && (
                                                <PaginationItem>
                                                    <PaginationNext
                                                        onClick={() => handlePageChange(pagination.page + 1)}
                                                    />
                                                </PaginationItem>
                                            )}
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus mobil "{carToDelete?.brand} {carToDelete?.model}"?
                            Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteCar}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default MobilContent;