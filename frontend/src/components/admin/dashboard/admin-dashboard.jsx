import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

import SidebarNav from './sidebar-nav.jsx';
import DashboardHeader from './dashboard-header.jsx';
import MainDashboardContent from './main-dashboard.jsx';
import { CarsTable, AddCarForm } from '../mobil';
import ModelContent from '../car-model/model.jsx';
import FeatureContent from '../feature/feature.jsx';
import ReservationContent from '../reservation/reservation.jsx';
import CustomerContent from '../customer/customer.jsx';
import PaymentContent from '../payment/payment.jsx';
import IncomeReportContent from '../reports/income-report.jsx';
import OrderReportContent from '../reports/order-report.jsx';
import CarContent from "@/components/admin/mobil/cars.jsx";

const AdminDashboard = () => {
    const [activeView, setActiveView] = useState('main-dashboard');
    const handleMenuClick = (menuItem) => {
        setActiveView(menuItem);
    };


    const renderContent = () => {
        switch (activeView) {
            case 'main-dashboard':
                return <MainDashboardContent onMenuClick={handleMenuClick} />;
            case 'cars':
                return <CarContent />
            case 'reservation':
                return <ReservationContent />;
            case 'customer':
                return <CustomerContent />;
            case 'payment':
                return <PaymentContent />;
            case 'income-report':
                return <IncomeReportContent />;
            case 'order-report':
                return <OrderReportContent />;
            case 'features':
                return <FeatureContent />
            case 'models':
                return <ModelContent />
            default:
                return (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-lg text-gray-500">Halaman belum tersedia</p>
                    </div>
                );
        }
    };

    return (
        <SidebarProvider defaultOpen={true}>
            <div className="flex h-screen w-full">
                <SidebarNav onMenuClick={handleMenuClick} activeView={activeView} />

                <SidebarInset className="bg-background">
                    <DashboardHeader />

                    <main className="flex-1 overflow-y-auto p-4 md:p-6">
                        {renderContent()}
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
};

export default AdminDashboard;