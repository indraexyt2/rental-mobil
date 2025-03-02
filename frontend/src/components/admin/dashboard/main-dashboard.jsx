import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, ArrowRight } from 'lucide-react';

const MainDashboardContent = ({ onMenuClick, onNavigate }) => {
    return (
        <>
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-white">
                    <CardContent className="p-4">
                        <div className="text-sm font-medium text-gray-500">Total Pendapatan</div>
                        <div className="mt-1 text-2xl font-bold">Rp 72.800.000</div>
                        <div className="mt-1 text-xs text-green-600">+8.5% dari bulan lalu</div>
                    </CardContent>
                </Card>
                <Card className="bg-white">
                    <CardContent className="p-4">
                        <div className="text-sm font-medium text-gray-500">Reservasi Aktif</div>
                        <div className="mt-1 text-2xl font-bold">24</div>
                        <div className="mt-1 text-xs text-green-600">3 reservasi baru hari ini</div>
                    </CardContent>
                </Card>
                <Card className="bg-white">
                    <CardContent className="p-4">
                        <div className="text-sm font-medium text-gray-500">Total Mobil</div>
                        <div className="mt-1 text-2xl font-bold">42</div>
                        <div className="mt-1 text-xs text-blue-600">35 tersedia, 7 disewa</div>
                    </CardContent>
                </Card>
                <Card className="bg-white">
                    <CardContent className="p-4">
                        <div className="text-sm font-medium text-gray-500">Total Pelanggan</div>
                        <div className="mt-1 text-2xl font-bold">156</div>
                        <div className="mt-1 text-xs text-green-600">12 pelanggan baru bulan ini</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Manajemen Mobil</CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onMenuClick('cars')}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <div>
                                    <h3 className="font-medium">Toyota Avanza</h3>
                                    <p className="text-xs text-gray-500">MPV, 2022</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="font-medium">Rp 300.000/hari</span>
                                    <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">Tersedia</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <div>
                                    <h3 className="font-medium">Honda HR-V</h3>
                                    <p className="text-xs text-gray-500">SUV, 2022</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="font-medium">Rp 400.000/hari</span>
                                    <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-800">Disewa</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <div>
                                    <h3 className="font-medium">Toyota Innova</h3>
                                    <p className="text-xs text-gray-500">MPV, 2023</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="font-medium">Rp 450.000/hari</span>
                                    <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">Tersedia</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Reservasi Terbaru</CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onMenuClick('reservation')}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <div>
                                    <h3 className="font-medium">Budi Santoso</h3>
                                    <p className="text-xs text-gray-500">Toyota Avanza, 10-15 Mar 2024</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="font-medium">Rp 1.500.000</span>
                                    <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">Aktif</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <div>
                                    <h3 className="font-medium">Dewi Lestari</h3>
                                    <p className="text-xs text-gray-500">Honda Brio, 12-14 Mar 2024</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="font-medium">Rp 750.000</span>
                                    <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">Aktif</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <div>
                                    <h3 className="font-medium">Siti Rahayu</h3>
                                    <p className="text-xs text-gray-500">Toyota Innova, 15-20 Mar 2024</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="font-medium">Rp 2.250.000</span>
                                    <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">Menunggu</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Pelanggan Teratas</CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onMenuClick('customer')}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 mr-3 flex items-center justify-center">
                                        <span className="text-blue-600 font-medium">BS</span>
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Budi Santoso</h3>
                                        <p className="text-xs text-gray-500">Member sejak 15 Jan 2023</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-medium">12 Orderan</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 mr-3 flex items-center justify-center">
                                        <span className="text-blue-600 font-medium">SR</span>
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Siti Rahayu</h3>
                                        <p className="text-xs text-gray-500">Member sejak 5 Apr 2023</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-medium">8 Orderan</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 mr-3 flex items-center justify-center">
                                        <span className="text-blue-600 font-medium">AW</span>
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Andi Wijaya</h3>
                                        <p className="text-xs text-gray-500">Member sejak 10 Mar 2023</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-medium">7 Orderan</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Pembayaran Terbaru</CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onMenuClick('payment')}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <div>
                                    <h3 className="font-medium">#INV-2024005</h3>
                                    <p className="text-xs text-gray-500">Rudi Hermawan, 8 Mar 2024</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="font-medium">Rp 1.200.000</span>
                                    <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">Lunas</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <div>
                                    <h3 className="font-medium">#INV-2024004</h3>
                                    <p className="text-xs text-gray-500">Siti Rahayu, 15 Mar 2024</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="font-medium">Rp 2.250.000</span>
                                    <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">Menunggu</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <div>
                                    <h3 className="font-medium">#INV-2024003</h3>
                                    <p className="text-xs text-gray-500">Andi Wijaya, 5 Mar 2024</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="font-medium">Rp 1.200.000</span>
                                    <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">Lunas</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Ringkasan Finansial</CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onMenuClick('income-report')}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                Lihat Laporan <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-4">
                                <div className="min-w-[240px] flex-1 rounded-lg border p-4">
                                    <h3 className="text-sm font-medium text-gray-500">Pendapatan Bulan Ini</h3>
                                    <p className="mt-1 text-2xl font-bold">Rp 16.800.000</p>
                                    <p className="mt-1 text-xs text-green-600">+15.9% dari bulan lalu</p>
                                </div>
                                <div className="min-w-[240px] flex-1 rounded-lg border p-4">
                                    <h3 className="text-sm font-medium text-gray-500">Total Orderan Bulan Ini</h3>
                                    <p className="mt-1 text-2xl font-bold">32</p>
                                    <p className="mt-1 text-xs text-green-600">+14.3% dari bulan lalu</p>
                                </div>
                                <div className="min-w-[240px] flex-1 rounded-lg border p-4">
                                    <h3 className="text-sm font-medium text-gray-500">Tingkat Penyelesaian</h3>
                                    <p className="mt-1 text-2xl font-bold">98%</p>
                                    <p className="mt-1 text-xs text-green-600">+1% dari bulan lalu</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default MainDashboardContent;