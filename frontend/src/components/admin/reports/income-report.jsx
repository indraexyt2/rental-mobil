import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const IncomeReportContent = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const reportsPerPage = 5;

    const incomeReports = [
        { id: 1, month: 'Januari 2024', totalIncome: 12500000, totalBookings: 25, avgBookingValue: 500000, topCar: 'Toyota Avanza', growth: '+15%' },
        { id: 2, month: 'Februari 2024', totalIncome: 13750000, totalBookings: 27, avgBookingValue: 509259, topCar: 'Honda HR-V', growth: '+10%' },
        { id: 3, month: 'Maret 2024', totalIncome: 15250000, totalBookings: 30, avgBookingValue: 508333, topCar: 'Toyota Innova', growth: '+10.9%' },
        { id: 4, month: 'April 2024', totalIncome: 14500000, totalBookings: 28, avgBookingValue: 517857, topCar: 'Honda Brio', growth: '-4.9%' },
        { id: 5, month: 'Mei 2024', totalIncome: 16800000, totalBookings: 32, avgBookingValue: 525000, topCar: 'Toyota Fortuner', growth: '+15.9%' },
    ];

    const indexOfLastReport = currentPage * reportsPerPage;
    const indexOfFirstReport = indexOfLastReport - reportsPerPage;
    const currentReports = incomeReports.slice(indexOfFirstReport, indexOfLastReport);
    const totalPages = Math.ceil(incomeReports.length / reportsPerPage);

    const getGrowthStyle = (growth) => {
        return growth.startsWith('+') ? 'text-green-600' : 'text-red-600';
    };

    return (
        <>
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <h1 className="text-2xl font-bold text-gray-800">Laporan Pendapatan</h1>
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
                        <div className="text-sm font-medium text-gray-500">Total Pendapatan (YTD)</div>
                        <div className="mt-1 text-2xl font-bold">Rp 72.800.000</div>
                        <div className="mt-1 text-sm text-green-600">+8.5% dari tahun lalu</div>
                    </CardContent>
                </Card>
                <Card className="bg-white">
                    <CardContent className="p-4">
                        <div className="text-sm font-medium text-gray-500">Total Reservasi (YTD)</div>
                        <div className="mt-1 text-2xl font-bold">142</div>
                        <div className="mt-1 text-sm text-green-600">+12% dari tahun lalu</div>
                    </CardContent>
                </Card>
                <Card className="bg-white">
                    <CardContent className="p-4">
                        <div className="text-sm font-medium text-gray-500">Nilai Rata-rata Reservasi</div>
                        <div className="mt-1 text-2xl font-bold">Rp 512.676</div>
                        <div className="mt-1 text-sm text-red-600">-2.3% dari tahun lalu</div>
                    </CardContent>
                </Card>
                <Card className="bg-white">
                    <CardContent className="p-4">
                        <div className="text-sm font-medium text-gray-500">Mobil Terlaris</div>
                        <div className="mt-1 text-2xl font-bold">Toyota Avanza</div>
                        <div className="mt-1 text-sm text-gray-500">28% dari total reservasi</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Laporan Pendapatan Bulanan</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto w-full">
                        <div className="inline-block min-w-full align-middle">
                            <div className="overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead>
                                    <tr className="border-b">
                                        <th className="py-3 px-4 text-left font-medium">Bulan</th>
                                        <th className="py-3 px-4 text-left font-medium">Total Pendapatan</th>
                                        <th className="py-3 px-4 text-left font-medium">Jumlah Reservasi</th>
                                        <th className="py-3 px-4 text-left font-medium">Rata-rata Nilai</th>
                                        <th className="py-3 px-4 text-left font-medium">Mobil Terlaris</th>
                                        <th className="py-3 px-4 text-left font-medium">Pertumbuhan</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                    {currentReports.map((report) => (
                                        <tr key={report.id} className="hover:bg-gray-50">
                                            <td className="whitespace-nowrap py-3 px-4">{report.month}</td>
                                            <td className="whitespace-nowrap py-3 px-4">Rp {report.totalIncome.toLocaleString()}</td>
                                            <td className="whitespace-nowrap py-3 px-4">{report.totalBookings}</td>
                                            <td className="whitespace-nowrap py-3 px-4">Rp {Math.round(report.avgBookingValue).toLocaleString()}</td>
                                            <td className="whitespace-nowrap py-3 px-4">{report.topCar}</td>
                                            <td className={`whitespace-nowrap py-3 px-4 font-medium ${getGrowthStyle(report.growth)}`}>
                                                {report.growth}
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
                            Menampilkan {indexOfFirstReport + 1}-{Math.min(indexOfLastReport, incomeReports.length)} dari {incomeReports.length} laporan
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

export default IncomeReportContent;