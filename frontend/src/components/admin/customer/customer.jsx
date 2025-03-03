import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { PlusCircle } from 'lucide-react';

const CustomerContent = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const customersPerPage = 5;

    const customers = [
        { id: 1, name: 'Budi Santoso', phone: '081234567890', email: 'budi.s@example.com', address: 'Jl. Sudirman No. 123, Jakarta', status: 'Aktif', memberSince: '2023-01-15' },
        { id: 2, name: 'Dewi Lestari', phone: '082345678901', email: 'dewi.l@example.com', address: 'Jl. Gatot Subroto No. 45, Jakarta', status: 'Aktif', memberSince: '2023-02-20' },
        { id: 3, name: 'Andi Wijaya', phone: '083456789012', email: 'andi.w@example.com', address: 'Jl. Pahlawan No. 67, Bandung', status: 'Tidak Aktif', memberSince: '2023-03-10' },
        { id: 4, name: 'Siti Rahayu', phone: '084567890123', email: 'siti.r@example.com', address: 'Jl. Diponegoro No. 89, Surabaya', status: 'Aktif', memberSince: '2023-04-05' },
        { id: 5, name: 'Rudi Hermawan', phone: '085678901234', email: 'rudi.h@example.com', address: 'Jl. Ahmad Yani No. 12, Semarang', status: 'Tidak Aktif', memberSince: '2023-05-15' },
    ];

    const indexOfLastCustomer = currentPage * customersPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
    const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);
    const totalPages = Math.ceil(customers.length / customersPerPage);

    return (
        <>
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Pelanggan</h1>
                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Tambah Pelanggan
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Daftar Pelanggan</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto w-full">
                        <div className="inline-block min-w-full align-middle">
                            <div className="overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead>
                                    <tr className="border-b">
                                        <th className="py-3 px-4 text-left font-medium">Nama</th>
                                        <th className="py-3 px-4 text-left font-medium">Telepon</th>
                                        <th className="py-3 px-4 text-left font-medium">Email</th>
                                        <th className="py-3 px-4 text-left font-medium">Alamat</th>
                                        <th className="py-3 px-4 text-left font-medium">Status</th>
                                        <th className="py-3 px-4 text-left font-medium">Member Sejak</th>
                                        <th className="py-3 px-4 text-left font-medium">Aksi</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                    {currentCustomers.map((customer) => (
                                        <tr key={customer.id} className="hover:bg-gray-50">
                                            <td className="whitespace-nowrap py-3 px-4">{customer.name}</td>
                                            <td className="whitespace-nowrap py-3 px-4">{customer.phone}</td>
                                            <td className="whitespace-nowrap py-3 px-4">{customer.email}</td>
                                            <td className="whitespace-nowrap py-3 px-4">{customer.address}</td>
                                            <td className="whitespace-nowrap py-3 px-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${customer.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {customer.status}
                                                    </span>
                                            </td>
                                            <td className="whitespace-nowrap py-3 px-4">{customer.memberSince}</td>
                                            <td className="whitespace-nowrap py-3 px-4">
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">Edit</Button>
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

                    <div className="mt-4 flex items-center justify-between border-t pt-4">
                        <div className="text-sm text-gray-500">
                            Menampilkan {indexOfFirstCustomer + 1}-{Math.min(indexOfLastCustomer, customers.length)} dari {customers.length} pelanggan
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

export default CustomerContent;