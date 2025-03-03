import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Home, ChevronRight } from 'lucide-react';

const Breadcrumbs = ({ showAddCar }) => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="#">
                        <Home className="h-4 w-4" />
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbLink href="#">Admin</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbLink href="#">Mobil</BreadcrumbLink>
                </BreadcrumbItem>
                {showAddCar && (
                    <>
                        <BreadcrumbSeparator>
                            <ChevronRight className="h-4 w-4" />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="#">Tambah Mobil</BreadcrumbLink>
                        </BreadcrumbItem>
                    </>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default Breadcrumbs;