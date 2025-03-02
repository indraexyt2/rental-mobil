import React, { useState } from 'react';
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
import { PlusCircle, Search, Edit, Trash2, Eye } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import AddMobilForm from './add-car-form.jsx';

const MobilContent = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const mobilPerPage = 5;

    const mobils = [
        { id: 1, name: 'Toyota Avanza', model: 'MPV', year: 2022, price: 300000, status: 'Tersedia' },
        { id: 2, name: 'Honda Brio', model: 'Hatchback', year: 2021, price: 250000, status: 'Tersedia' },
        { id: 3, name: 'Suzuki Ertiga', model: 'MPV', year: 2022, price: 280000, status: 'Disewa' },
        { id: 4, name: 'Toyota Innova', model: 'MPV', year: 2023, price: 450000, status: 'Tersedia' },
        { id: 5, name: 'Honda HR-V', model: 'SUV', year: 2022, price: 400000, status: 'Disewa' },
        { id: 6, name: 'Toyota Avanza', model: 'MPV', year: 2022, price: 300000, status: 'Tersedia' },
        { id: 7, name: 'Honda Brio', model: 'Hatchback', year: 2021, price: 250000, status: 'Tersedia' },
        { id: 8, name: 'Suzuki Ertiga', model: 'MPV', year: 2022, price: 280000, status: 'Disewa' },
        { id: 9, name: 'Toyota Innova', model: 'MPV', year: 2023, price: 450000, status: 'Tersedia' },
        { id: 10, name: 'Honda HR-V', model: 'SUV', year: 2022, price: 400000, status: 'Disewa' },
    ];

    const filteredMobils = searchTerm
        ? mobils.filter(mobil =>
            mobil.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mobil.model.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : mobils;

    const indexOfLastMobil = currentPage * mobilPerPage;
    const indexOfFirstMobil = indexOfLastMobil - mobilPerPage;
    const currentMobils = filteredMobils.slice(indexOfFirstMobil, indexOfLastMobil);
    const totalPages = Math.ceil(filteredMobils.length / mobilPerPage);

    const handleShowAddForm = () => {
        setShowAddForm(true);
    };

    const handleBackToTable = () => {
        setShowAddForm(false);
    };

    const getRandomColor = (id) => {
        const colors = ['bg-blue-100 text-blue-800', 'bg-green-100 text-green-800',
            'bg-purple-100 text-purple-800', 'bg-orange-100 text-orange-800',
            'bg-teal-100 text-teal-800'];
        return colors[id % colors.length];
    };

    return (
        <>
            <Toaster position="top-center" richColors closeButton />

            {showAddForm ? (
                <AddMobilForm onBack={handleBackToTable} />
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

                    <Card className="shadow-sm border-gray-200">
                        <CardHeader className="pb-2">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <CardTitle>Daftar Mobil</CardTitle>
                                <div className="relative w-full sm:w-72">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Cari mobil..."
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
                                                <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider">#</th>
                                                <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                                <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider">Model</th>
                                                <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider">Tahun</th>
                                                <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider">Harga/Hari</th>
                                                <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="py-3 px-4 text-right font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                            </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                            {currentMobils.length > 0 ? (
                                                currentMobils.map((mobil, index) => (
                                                    <tr key={mobil.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="py-4 px-4">
                                                            <Badge className={`${getRandomColor(mobil.id)}`}>
                                                                {indexOfFirstMobil + index + 1}
                                                            </Badge>
                                                        </td>
                                                        <td className="py-4 px-4 font-medium">{mobil.name}</td>
                                                        <td className="py-4 px-4">
                                                            <Badge variant="outline" className="font-normal">
                                                                {mobil.model}
                                                            </Badge>
                                                        </td>
                                                        <td className="py-4 px-4">{mobil.year}</td>
                                                        <td className="py-4 px-4 font-medium">Rp {mobil.price.toLocaleString()}</td>
                                                        <td className="py-4 px-4">
                                                            <Badge className={mobil.status === 'Tersedia'
                                                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                                : 'bg-red-100 text-red-800 hover:bg-red-200'}>
                                                                {mobil.status}
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
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="7" className="py-8 text-center text-gray-500">
                                                        {searchTerm ? 'Tidak ada mobil yang sesuai dengan pencarian.' : 'Belum ada data mobil.'}
                                                    </td>
                                                </tr>
                                            )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {filteredMobils.length > 0 && (
                                <div className="mt-4 flex flex-col sm:flex-row gap-4 sm:gap-0 items-center justify-between border-t pt-4">
                                    <div className="text-sm text-gray-500">
                                        Menampilkan {indexOfFirstMobil + 1}-{Math.min(indexOfLastMobil, filteredMobils.length)} dari {filteredMobils.length} mobil
                                    </div>
                                    <Pagination>
                                        <PaginationContent>
                                            {currentPage > 1 && (
                                                <PaginationItem>
                                                    <PaginationPrevious
                                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                    />
                                                </PaginationItem>
                                            )}

                                            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                                                // Logic to show pages around the current page
                                                let pageNum;
                                                if (totalPages <= 5) {
                                                    // Show all pages if there are 5 or fewer
                                                    pageNum = i + 1;
                                                } else if (currentPage <= 3) {
                                                    // At the start, show first 5 pages
                                                    pageNum = i + 1;
                                                } else if (currentPage >= totalPages - 2) {
                                                    // At the end, show last 5 pages
                                                    pageNum = totalPages - 4 + i;
                                                } else {
                                                    // In the middle, show current page and 2 pages on each side
                                                    pageNum = currentPage - 2 + i;
                                                }

                                                return (
                                                    <PaginationItem key={pageNum}>
                                                        <PaginationLink
                                                            isActive={pageNum === currentPage}
                                                            onClick={() => setCurrentPage(pageNum)}
                                                        >
                                                            {pageNum}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                );
                                            })}

                                            {currentPage < totalPages && (
                                                <PaginationItem>
                                                    <PaginationNext
                                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
        </>
    );
};

export default MobilContent;