import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PlusCircle, Search, ArrowUpDown, Edit, Trash2, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast, Toaster } from 'sonner';
import {useCarStore} from "@/store/car-store.js";

const FeatureContent = () => {
    const {
        features,
        feature,
        isLoading,
        error,
        getFeatures,
        addFeature,
        updateFeature,
        deleteFeature,
        resetError
    } = useCarStore();

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [featureName, setFeatureName] = useState('');
    const [editingFeature, setEditingFeature] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [featureToDelete, setFeatureToDelete] = useState(null);
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const featuresPerPage = 5;

    useEffect(() => {
        const fetchFeatures = async () => {
            try {
                await getFeatures();
            } catch (error) {
                toast.error('Gagal memuat daftar fitur');
            }
        };

        fetchFeatures();
    }, []);

    useEffect(() => {
        if (error) {
            toast.error(Array.isArray(error) ? error[0] : error);
            resetError();
        }
    }, [error, resetError]);

    const filteredFeatures = Array.isArray(features)
        ? features.filter(feature =>
            feature && feature.feature &&
            feature.feature.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    const sortedFeatures = filteredFeatures.length > 0
        ? [...filteredFeatures].sort((a, b) => {
            if (sortDirection === 'asc') {
                return a.feature.localeCompare(b.feature);
            } else {
                return b.feature.localeCompare(a.feature);
            }
        })
        : [];

    const indexOfLastFeature = currentPage * featuresPerPage;
    const indexOfFirstFeature = indexOfLastFeature - featuresPerPage;
    const currentFeatures = sortedFeatures.slice(indexOfFirstFeature, indexOfLastFeature);
    const totalPages = Math.ceil(sortedFeatures.length / featuresPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleToggleSort = () => {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    const handleAddClick = () => {
        setEditingFeature(null);
        setFeatureName('');
        setIsModalOpen(true);
    };

    const handleEditClick = (feature) => {
        setEditingFeature(feature);
        setFeatureName(feature.feature);
        setIsModalOpen(true);
    };

    const handleDetailClick = (feature) => {
        setSelectedFeature(feature);
        setIsDetailModalOpen(true);
    };

    const handleDeleteClick = (feature) => {
        setFeatureToDelete(feature);
        setIsDeleteModalOpen(true);
    };

    const handleSaveFeature = async (e) => {
        e.preventDefault();

        if (!featureName.trim()) {
            toast.error('Nama fitur tidak boleh kosong');
            return;
        }

        try {
            if (editingFeature) {
                await updateFeature(featureName, editingFeature.id);
                setIsModalOpen(false);
                setFeatureName('');
                setEditingFeature(null);
                toast.success('Fitur berhasil diperbarui');

                await getFeatures();
            } else {
                await addFeature(featureName);
                setIsModalOpen(false);
                setFeatureName('');
                toast.success('Fitur berhasil ditambahkan');

                await getFeatures();
            }
        } catch (error) {
        }
    };

    const handleDeleteFeature = async () => {
        try {
            await deleteFeature(featureToDelete.id);
            setIsDeleteModalOpen(false);
            setFeatureToDelete(null);
            toast.success('Fitur berhasil dihapus');
            await getFeatures();
        } catch (error) {
        }
    };

    const getRandomColor = (id) => {
        const colors = ['bg-blue-100 text-blue-800', 'bg-green-100 text-green-800',
            'bg-purple-100 text-purple-800', 'bg-orange-100 text-orange-800',
            'bg-teal-100 text-teal-800'];
        return colors[id % colors.length];
    };

    const getDisplayNumber = (feature, index) => {
        return indexOfFirstFeature + index + 1;
    };

    return (
        <>
            <Toaster position="top-center" richColors closeButton />

            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Fitur</h1>
                <Button
                    className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                    onClick={handleAddClick}
                    disabled={isLoading}
                >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Tambah Fitur
                </Button>
            </div>

            <Card className="shadow-sm border-gray-200">
                <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <CardTitle>Daftar Fitur</CardTitle>
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Cari fitur..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8 w-full"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto w-full">
                        <div className="inline-block min-w-full align-middle">
                            <div className="overflow-hidden rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={handleToggleSort}
                                        >
                                            <div className="flex items-center space-x-1">
                                                <span>Nama Fitur</span>
                                                <ArrowUpDown className="h-4 w-4" />
                                            </div>
                                        </th>
                                        <th className="py-3 px-4 text-right font-medium text-gray-500 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="2" className="py-8 text-center">
                                                <div className="flex justify-center">
                                                    <svg className="h-6 w-6 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : currentFeatures.length > 0 ? (
                                        currentFeatures.map((feature, index) => (
                                            <tr
                                                key={feature.id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center">
                                                        <Badge className={`mr-2 ${getRandomColor(feature.id)}`}>
                                                            {getDisplayNumber(feature, index)}
                                                        </Badge>
                                                        <span className="font-medium">{feature.feature}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex gap-2 justify-end">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                                            onClick={() => handleDetailClick(feature)}
                                                        >
                                                            <Info className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                                            onClick={() => handleEditClick(feature)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => handleDeleteClick(feature)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="2" className="py-8 text-center text-gray-500">
                                                {searchTerm ? 'Tidak ada fitur yang sesuai dengan pencarian.' : 'Belum ada data fitur.'}
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {sortedFeatures.length > 0 && (
                        <div className="mt-4 flex flex-col sm:flex-row gap-4 sm:gap-0 items-center justify-between border-t pt-4">
                            <div className="text-sm text-gray-500">
                                Menampilkan {indexOfFirstFeature + 1}-{Math.min(indexOfLastFeature, sortedFeatures.length)} dari {sortedFeatures.length} fitur
                            </div>
                            <Pagination className="justify-end">
                                <PaginationContent className="flex-nowrap">
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}
                                        />
                                    </PaginationItem>

                                    {totalPages <= 5 ? (
                                        [...Array(totalPages)].map((_, index) => {
                                            const pageNumber = index + 1;
                                            return (
                                                <PaginationItem key={pageNumber}>
                                                    <PaginationLink
                                                        isActive={pageNumber === currentPage}
                                                        onClick={() => setCurrentPage(pageNumber)}
                                                    >
                                                        {pageNumber}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        })
                                    ) : (
                                        <>
                                            <PaginationItem>
                                                <PaginationLink
                                                    isActive={currentPage === 1}
                                                    onClick={() => setCurrentPage(1)}
                                                >
                                                    1
                                                </PaginationLink>
                                            </PaginationItem>

                                            {currentPage > 3 && (
                                                <PaginationItem>
                                                    <span className="px-4">...</span>
                                                </PaginationItem>
                                            )}

                                            {currentPage !== 1 && currentPage !== totalPages && (
                                                <PaginationItem>
                                                    <PaginationLink
                                                        isActive={true}
                                                        onClick={() => setCurrentPage(currentPage)}
                                                    >
                                                        {currentPage}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            )}

                                            {currentPage < totalPages - 2 && (
                                                <PaginationItem>
                                                    <span className="px-4">...</span>
                                                </PaginationItem>
                                            )}

                                            <PaginationItem>
                                                <PaginationLink
                                                    isActive={currentPage === totalPages}
                                                    onClick={() => setCurrentPage(totalPages)}
                                                >
                                                    {totalPages}
                                                </PaginationLink>
                                            </PaginationItem>
                                        </>
                                    )}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingFeature ? 'Edit Fitur' : 'Tambah Fitur Baru'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingFeature
                                ? 'Ubah informasi fitur yang sudah ada'
                                : 'Tambahkan fitur baru ke daftar'
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveFeature}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label htmlFor="featureName" className="text-sm font-medium">
                                    Nama Fitur
                                </label>
                                <Input
                                    id="featureName"
                                    value={featureName}
                                    onChange={(e) => setFeatureName(e.target.value)}
                                    placeholder="Masukkan nama fitur"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsModalOpen(false)}
                                disabled={isLoading}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-blue-600 text-white hover:bg-blue-700"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Menyimpan...
                                    </>
                                ) : editingFeature ? 'Simpan Perubahan' : 'Tambah Fitur'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Hapus</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus fitur "{featureToDelete?.feature}"?
                            Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDeleteModalOpen(false)}
                            disabled={isLoading}
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDeleteFeature}
                            disabled={isLoading}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Menghapus...
                                </>
                            ) : 'Hapus Fitur'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Detail Fitur</DialogTitle>
                    </DialogHeader>
                    {selectedFeature && (
                        <div className="space-y-4 py-2">
                            <div className="p-4 rounded-lg bg-gray-50">
                                <div className="flex items-center gap-2 mb-4">
                                    <Badge className={`${getRandomColor(selectedFeature.id)}`}>
                                        {sortedFeatures.findIndex(f => f.id === selectedFeature.id) + 1}
                                    </Badge>
                                    <h3 className="text-lg font-semibold">{selectedFeature.feature}</h3>
                                </div>

                                <div className="mt-4 text-sm text-gray-500">
                                    <p>Fitur ini dapat diaktifkan pada kendaraan untuk memberikan pengalaman tambahan kepada pelanggan.</p>
                                </div>
                            </div>

                            <div className="flex space-x-2 justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => handleEditClick(selectedFeature)}
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => {
                                        setIsDetailModalOpen(false);
                                        setTimeout(() => handleDeleteClick(selectedFeature), 100);
                                    }}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Hapus
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default FeatureContent;