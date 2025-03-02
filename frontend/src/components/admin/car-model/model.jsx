import React, {useEffect, useState} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PlusCircle, Search, ArrowUpDown, Edit, Trash2, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast, Toaster } from 'sonner';
import { useCarStore } from "@/store/car-store.js";

const ModelContent = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modelName, setModelName] = useState('');
    const [editingModel, setEditingModel] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [modelToDelete, setModelToDelete] = useState(null);
    const [selectedModel, setSelectedModel] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const {
        model,
        models,
        isLoading,
        error,
        addModel,
        getModels,
        updateModel,
        deleteModel
    } = useCarStore();

    useEffect(() => {
        async function getModelsData() {
            await getModels();
        }
        getModelsData();
    }, []);

    const modelsPerPage = 5;

    // Filter models berdasarkan pencarian
    const filteredModels = models ? models.filter(model =>
        model.category_name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    // Sort models
    const sortedModels = [...filteredModels].sort((a, b) => {
        if (sortDirection === 'asc') {
            return a.category_name.localeCompare(b.category_name);
        } else {
            return b.category_name.localeCompare(a.category_name);
        }
    });

    // Pagination logic
    const indexOfLastModel = currentPage * modelsPerPage;
    const indexOfFirstModel = indexOfLastModel - modelsPerPage;
    const currentModels = sortedModels.slice(indexOfFirstModel, indexOfLastModel);
    const totalPages = Math.ceil(sortedModels.length / modelsPerPage);

    // Reset ke halaman pertama saat filter berubah
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleToggleSort = () => {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    const handleAddClick = () => {
        setEditingModel(null);
        setModelName('');
        setIsModalOpen(true);
    };

    const handleEditClick = (model) => {
        setEditingModel(model);
        setModelName(model.category_name);
        setIsModalOpen(true);
    };

    const handleDetailClick = (model) => {
        setSelectedModel(model);
        setIsDetailModalOpen(true);
    };

    const handleDeleteClick = (model) => {
        setModelToDelete(model);
        setIsDeleteModalOpen(true);
    };

    const handleSaveModel = async (e) => {
        e.preventDefault();

        if (!modelName.trim()) {
            toast.error('Nama model tidak boleh kosong');
            return;
        }

        try {
            if (editingModel) {
                await updateModel(modelName, editingModel.id);

                setIsModalOpen(false);
                setModelName('');
                setEditingModel(null);

                await getModels();

                toast.success('Model berhasil diperbarui');
            } else {
                await addModel(modelName);

                setIsModalOpen(false);
                setModelName('');

                await getModels();

                toast.success('Model berhasil ditambahkan', {duration: 2000});
            }
        } catch (e) {
            console.error('Error saving model:', e);
            toast.error(editingModel
                ? 'Gagal memperbarui model. Silakan coba lagi.'
                : 'Gagal menambahkan model. Silakan coba lagi.'
            );
        }
    };

    const handleDeleteModel = async () => {
        try {
            await deleteModel(modelToDelete.id);
            setIsDeleteModalOpen(false);
            setModelToDelete(null);
            toast.success('Model berhasil dihapus', {duration: 2000});
            await getModels();
        } catch (e) {
            console.error("Gagal menghapus model:", e);
            toast.error('Model gagal dihapus', {duration: 2000});
        }
    };

    const getRandomColor = (id) => {
        const colors = ['bg-red-100 text-red-800', 'bg-yellow-100 text-yellow-800',
            'bg-indigo-100 text-indigo-800', 'bg-pink-100 text-pink-800',
            'bg-emerald-100 text-emerald-800'];
        return colors[id % colors.length];
    };

    // Function to get the display number (sequential index + 1) for a model in the current view
    const getDisplayNumber = (model, index) => {
        return indexOfFirstModel + index + 1;
    };

    return (
        <>
            <Toaster position="top-center" richColors closeButton />

            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Model</h1>
                <Button
                    className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                    onClick={handleAddClick}
                >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Tambah Model
                </Button>
            </div>

            <Card className="shadow-sm border-gray-200">
                <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <CardTitle>Daftar Model</CardTitle>
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Cari model..."
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
                                                <span>Nama Model</span>
                                                <ArrowUpDown className="h-4 w-4" />
                                            </div>
                                        </th>
                                        <th className="py-3 px-4 text-right font-medium text-gray-500 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                    {currentModels && currentModels.length > 0 ? (
                                        currentModels.map((model, index) => (
                                            <tr
                                                key={model.id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center">
                                                        <Badge className={`mr-2 ${getRandomColor(model.id)}`}>
                                                            {getDisplayNumber(model, index)}
                                                        </Badge>
                                                        <span className="font-medium">{model.category_name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex gap-2 justify-end">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                                            onClick={() => handleDetailClick(model)}
                                                        >
                                                            <Info className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                                            onClick={() => handleEditClick(model)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => handleDeleteClick(model)}
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
                                                {searchTerm ? 'Tidak ada model yang sesuai dengan pencarian.' : 'Belum ada data model.'}
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {sortedModels.length > 0 && (
                        <div className="mt-4 flex flex-col sm:flex-row gap-4 sm:gap-0 items-center justify-between border-t pt-4">
                            <div className="text-sm text-gray-500">
                                Menampilkan {indexOfFirstModel + 1}-{Math.min(indexOfLastModel, sortedModels.length)} dari {sortedModels.length} model
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
                                        // Tampilkan semua halaman jika totalPages <= 5
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
                                        // Logika pagination untuk banyak halaman
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

            {/* Add/Edit Model Dialog */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingModel ? 'Edit Model' : 'Tambah Model Baru'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingModel
                                ? 'Ubah informasi model yang sudah ada'
                                : 'Tambahkan model baru ke daftar'
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveModel}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label htmlFor="modelName" className="text-sm font-medium">
                                    Nama Model
                                </label>
                                <Input
                                    id="modelName"
                                    value={modelName}
                                    onChange={(e) => setModelName(e.target.value)}
                                    placeholder="Contoh: SUV, MPV, Sedan"
                                    disabled={isLoading}
                                />
                                <p className="text-xs text-gray-500">
                                    Masukkan nama model mobil
                                </p>
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
                                ) : editingModel ? 'Simpan Perubahan' : 'Tambah Model'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Hapus</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus model "{modelToDelete?.category_name}"?
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
                            onClick={handleDeleteModel}
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
                            ) : 'Hapus Model'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Model Detail Modal */}
            <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Detail Model</DialogTitle>
                    </DialogHeader>
                    {selectedModel && (
                        <div className="space-y-4 py-2">
                            <div className="p-4 rounded-lg bg-gray-50">
                                <div className="flex items-center gap-2 mb-4">
                                    <Badge className={`${getRandomColor(selectedModel.id)}`}>
                                        {sortedModels.findIndex(m => m.id === selectedModel.id) + 1}
                                    </Badge>
                                    <h3 className="text-lg font-semibold">{selectedModel.category_name}</h3>
                                </div>

                                <div className="mt-4 text-sm text-gray-500">
                                    <p>Model kendaraan ini dapat digunakan untuk mengkategorikan kendaraan dalam sistem.</p>
                                </div>
                            </div>

                            <div className="flex space-x-2 justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => handleEditClick(selectedModel)}
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => {
                                        setIsDetailModalOpen(false);
                                        setTimeout(() => handleDeleteClick(selectedModel), 100);
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

export default ModelContent;