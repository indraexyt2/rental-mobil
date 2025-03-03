import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { PlusCircle } from 'lucide-react';

const PaymentContent = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const paymentsPerPage = 5;

    const payments = [
        { id: 1, invoiceNumber: 'INV-2024001', customer: 'Budi Santoso', amount: 1500000, date: '2024-03-10', method: 'Transfer Bank', status: 'Lunas' },
        { id: 2, invoiceNumber: 'INV-2024002', customer: 'Dewi Lestari', amount: 750000, date: '2024-03-12', method: 'Kartu Kredit', status: 'Lunas' },
        { id: 3, invoiceNumber: 'INV-2024003', customer: 'Andi Wijaya', amount: 1200000, date: '2024-03-05', method: 'E-Wallet', status: 'Lunas' },
        { id: 4, invoiceNumber: 'INV-2024004', customer: 'Siti Rahayu', amount: 2250000, date: '2024-03-15', method: 'Transfer Bank', status: 'Menunggu' },
        { id: 5, invoiceNumber: 'INV-2024005', customer: 'Rudi Hermawan', amount: 1200000, date: '2024-03-08', method: 'Kartu Debit', status: 'Lunas' },
    ];

    const indexOfLastPayment = currentPage * paymentsPerPage;
    const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
    const currentPayments = payments.slice(indexOfFirstPayment, indexOfLastPayment);
    const totalPages = Math.ceil(payments.length / paymentsPerPage);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Lunas':
                return 'bg-green-100 text-green-800';
            case 'Menunggu':
                return 'bg-yellow-100 text-yellow-800';
            case 'Gagal':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Pembayaran</h1>
                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Tambah Pembayaran
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Daftar Pembayaran</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto w-full">
                        <div className="inline-block min-w-full align-middle">
                            <div className="overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead>
                                    <tr className="border-b">
                                        <th className="py-3 px-4 text-left font-medium">No. Invoice</th>
                                        <th className="py-3 px-4 text-left font-medium">Pelanggan</th>
                                        <th className="py-3 px-4 text-left font-medium">Jumlah</th>
                                        <th className="py-3 px-4 text-left font-medium">Tanggal</th>
                                        <th className="py-3 px-4 text-left font-medium">Metode</th>
                                        <th className="py-3 px-4 text-left font-medium">Status</th>
                                        <th className="py-3 px-4 text-left font-medium">Aksi</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                    {currentPayments.map((payment) => (
                                        <tr key={payment.id} className="hover:bg-gray-50">
                                            <td className="whitespace-nowrap py-3 px-4">{payment.invoiceNumber}</td>
                                            <td className="whitespace-nowrap py-3 px-4">{payment.customer}</td>
                                            <td className="whitespace-nowrap py-3 px-4">Rp {payment.amount.toLocaleString()}</td>
                                            <td className="whitespace-nowrap py-3 px-4">{payment.date}</td>
                                            <td className="whitespace-nowrap py-3 px-4">{payment.method}</td>
                                            <td className="whitespace-nowrap py-3 px-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusStyle(payment.status)}`}>
                                                        {payment.status}
                                                    </span>
                                            </td>
                                            <td className="whitespace-nowrap py-3 px-4">
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">Detail</Button>
                                                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">Cetak</Button>
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
                            Menampilkan {indexOfFirstPayment + 1}-{Math.min(indexOfLastPayment, payments.length)} dari {payments.length} pembayaran
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

export default PaymentContent;