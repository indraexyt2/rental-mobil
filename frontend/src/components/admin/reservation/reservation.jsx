import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { PlusCircle } from 'lucide-react';

const ReservationContent = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const reservationsPerPage = 5;

    const reservations = [
        { id: 1, customer: 'Budi Santoso', carName: 'Toyota Avanza', startDate: '2024-03-10', endDate: '2024-03-15', status: 'Aktif', totalCost: 1500000 },
        { id: 2, customer: 'Dewi Lestari', carName: 'Honda Brio', startDate: '2024-03-12', endDate: '2024-03-14', status: 'Aktif', totalCost: 750000 },
        { id: 3, customer: 'Andi Wijaya', carName: 'Suzuki Ertiga', startDate: '2024-03-05', endDate: '2024-03-08', status: 'Selesai', totalCost: 1200000 },
        { id: 4, customer: 'Siti Rahayu', carName: 'Toyota Innova', startDate: '2024-03-15', endDate: '2024-03-20', status: 'Menunggu', totalCost: 2250000 },
        { id: 5, customer: 'Rudi Hermawan', carName: 'Honda HR-V', startDate: '2024-03-08', endDate: '2024-03-11', status: 'Selesai', totalCost: 1200000 },
    ];

    const indexOfLastReservation = currentPage * reservationsPerPage;
    const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
    const currentReservations = reservations.slice(indexOfFirstReservation, indexOfLastReservation);
    const totalPages = Math.ceil(reservations.length / reservationsPerPage);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Aktif':
                return 'bg-green-100 text-green-800';
            case 'Selesai':
                return 'bg-blue-100 text-blue-800';
            case 'Menunggu':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Reservasi</h1>
                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Tambah Reservasi
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Daftar Reservasi</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto w-full">
                        <div className="inline-block min-w-full align-middle">
                            <div className="overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead>
                                    <tr className="border-b">
                                        <th className="py-3 px-4 text-left font-medium">Customer</th>
                                        <th className="py-3 px-4 text-left font-medium">Mobil</th>
                                        <th className="py-3 px-4 text-left font-medium">Tanggal Mulai</th>
                                        <th className="py-3 px-4 text-left font-medium">Tanggal Selesai</th>
                                        <th className="py-3 px-4 text-left font-medium">Total Biaya</th>
                                        <th className="py-3 px-4 text-left font-medium">Status</th>
                                        <th className="py-3 px-4 text-left font-medium">Aksi</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                    {currentReservations.map((reservation) => (
                                        <tr key={reservation.id} className="hover:bg-gray-50">
                                            <td className="whitespace-nowrap py-3 px-4">{reservation.customer}</td>
                                            <td className="whitespace-nowrap py-3 px-4">{reservation.carName}</td>
                                            <td className="whitespace-nowrap py-3 px-4">{reservation.startDate}</td>
                                            <td className="whitespace-nowrap py-3 px-4">{reservation.endDate}</td>
                                            <td className="whitespace-nowrap py-3 px-4">Rp {reservation.totalCost.toLocaleString()}</td>
                                            <td className="whitespace-nowrap py-3 px-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusStyle(reservation.status)}`}>
                                                        {reservation.status}
                                                    </span>
                                            </td>
                                            <td className="whitespace-nowrap py-3 px-4">
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">Detail</Button>
                                                    <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">Hapus</Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="mt-4 flex items-center justify-between border-t pt-4">
                        <div className="text-sm text-gray-500">
                            Menampilkan {indexOfFirstReservation + 1}-{Math.min(indexOfLastReservation, reservations.length)} dari {reservations.length} reservasi
                        </div>
                        <Pagination className="justify-end">
                            <PaginationContent className="flex-nowrap">
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                    />
                                </PaginationItem>

                                {[...Array(totalPages)].map((_, index) => {
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
                                })}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </CardContent>
            </Card>
        </>
    );
};

export default ReservationContent;