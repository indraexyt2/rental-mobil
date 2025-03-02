import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const OrderReportContent = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const reportsPerPage = 5;

    const orderReports = [
        { id: 1, month: 'Januari 2024', totalOrders: 25, completionRate: 96, cancelRate: 4, popularCar: 'Toyota Avanza', newCustomers: 8 },
        { id: 2, month: 'Februari 2024', totalOrders: 27, completionRate: 97, cancelRate: 3, popularCar: 'Honda HR-V', newCustomers: 11 },
        { id: 3, month: 'Maret 2024', totalOrders: 30, completionRate: 94, cancelRate: 6, popularCar: 'Toyota Innova', newCustomers: 13 },
        { id: 4, month: 'April 2024', totalOrders: 28, completionRate: 97, cancelRate: 3, popularCar: 'Honda Brio', newCustomers: 9 },
        { id: 5, month: 'Mei 2024', totalOrders: 32, completionRate: 98, cancelRate: 2, popularCar: 'Toyota Fortuner', newCustomers: 15 },
    ];

    const indexOfLastReport = currentPage * reportsPerPage;
    const indexOfFirstReport = indexOfLastReport - reportsPerPage;
    const currentReports = orderReports.slice(indexOfFirstReport, indexOfLastReport);
    const totalPages = Math.ceil(orderReports.length / reportsPerPage);

    const getCompletionRateStyle = (rate) => {
        if (rate >= 95) return 'bg-green-100 text-green-800';
        if (rate >= 90) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    const getCancelRateStyle = (rate) => {
        if (rate <= 3) return 'bg-green-100 text-green-800';
        if (rate <= 6) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    return (
        <>
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <h1 className="text-2xl font-bold text-gray-800">Laporan Orderan</h1>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Unduh Excel
                    </Button>
                    <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                            <path d="M6 9 2 12l4 3" />
                            <path d="M18 9l4 3-4 3" />
                            <path d="m8 7 8 10" />
                        </svg>
                        Ekspor PDF
                    </Button>
                </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-white">
                    <CardContent className="p-4">
                        <div className="text-sm font-medium text-gray-500">Total Orderan (YTD)</div>
                        <div className="mt-1 text-2xl font-bold">142</div>
                        <div className="mt-1 text-sm text-green-600">+12% dari tahun lalu</div>
                    </CardContent>
                </Card>
                <Card className="bg-white">
                    <CardContent className="p-4">
                        <div className="text-sm font-medium text-gray-500">Durasi Rata-rata</div>
                        <div className="mt-1 text-2xl font-bold">3.6 hari</div>
                        <div className="mt-1 text-sm text-green-600">+0.3 hari dari tahun lalu</div>
                    </CardContent>
                </Card>
                <Card className="bg-white">
                    <CardContent className="p-4">
                        <div className="text-sm font-medium text-gray-500">Tingkat Penyelesaian</div>
                        <div className="mt-1 text-2xl font-bold">96.5%</div>
                        <div className="mt-1 text-sm text-green-600">+1.2% dari tahun lalu</div>
                    </CardContent>
                </Card>
                <Card className="bg-white">
                    <CardContent className="p-4">
                        <div className="text-sm font-medium text-gray-500">Pelanggan Baru (YTD)</div>
                        <div className="mt-1 text-2xl font-bold">56</div>
                        <div className="mt-1 text-sm text-green-600">+21% dari tahun lalu</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Laporan Orderan Bulanan</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto w-full">
                        <div className="inline-block min-w-full align-middle">
                            <div className="overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead>
                                    <tr className="border-b">
                                        <th className="py-3 px-4 text-left font-medium">Bulan</th>
                                        <th className="py-3 px-4 text-left font-medium">Total Order</th>
                                        <th className="py-3 px-4 text-left font-medium">Tingkat Penyelesaian</th>
                                        <th className="py-3 px-4 text-left font-medium">Tingkat Pembatalan</th>
                                        <th className="py-3 px-4 text-left font-medium">Mobil Populer</th>
                                        <th className="py-3 px-4 text-left font-medium">Pelanggan Baru</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                    {currentReports.map((report) => (
                                        <tr key={report.id} className="hover:bg-gray-50">
                                            <td className="whitespace-nowrap py-3 px-4">{report.month}</td>
                                            <td className="whitespace-nowrap py-3 px-4">{report.totalOrders}</td>
                                            <td className="whitespace-nowrap py-3 px-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getCompletionRateStyle(report.completionRate)}`}>
                                                        {report.completionRate}%
                                                    </span>
                                            </td>
                                            <td className="whitespace-nowrap py-3 px-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getCancelRateStyle(report.cancelRate)}`}>
                                                        {report.cancelRate}%
                                                    </span>
                                            </td>
                                            <td className="whitespace-nowrap py-3 px-4">{report.popularCar}</td>
                                            <td className="whitespace-nowrap py-3 px-4">{report.newCustomers}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t pt-4">
                        <div className="text-sm text-gray-500">
                            Menampilkan {indexOfFirstReport + 1}-{Math.min(indexOfLastReport, orderReports.length)} dari {orderReports.length} laporan
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

export default OrderReportContent;