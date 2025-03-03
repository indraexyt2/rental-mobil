import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

const viewToPath = {
    'main-dashboard': '/admin/dashboard',
    'cars': '/admin/cars',
    'models': '/admin/models',
    'features': '/admin/features',
    'reservation': '/admin/reservations',
    'customer': '/admin/customers',
    'payment': '/admin/payments',
    'income-report': '/admin/reports/income',
    'order-report': '/admin/reports/orders'
};

const pathToView = Object.fromEntries(
    Object.entries(viewToPath).map(([view, path]) => [path, view])
);

const AdminDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const getInitialView = () => {
        const path = location.pathname;
        return pathToView[path] || 'main-dashboard';
    };

    const [activeView, setActiveView] = useState(getInitialView);

    useEffect(() => {
        const path = viewToPath[activeView] || '/admin/dashboard';
        if (location.pathname !== path) {
            navigate(path);
        }
    }, [activeView, navigate, location.pathname]);

    useEffect(() => {
        const newView = getInitialView();
        if (newView !== activeView) {
            setActiveView(newView);
        }
    }, [location.pathname]);

    const handleMenuClick = (menuItem) => {
        setActiveView(menuItem);
    };

    const renderContent = () => {
        switch (activeView) {
            case 'main-dashboard':
                return <MainDashboardContent onMenuClick={handleMenuClick} />;
            case 'cars':
                return <CarContent />;
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
                return <FeatureContent />;
            case 'models':
                return <ModelContent />;
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