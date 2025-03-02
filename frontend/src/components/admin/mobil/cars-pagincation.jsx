import React from 'react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const CarPagination = ({
                           currentPage,
                           setCurrentPage,
                           totalPages,
                           totalItems,
                           itemsPerPage,
                           currentFirstItem,
                           currentLastItem
                       }) => {
    return (
        <div className="mt-4 flex items-center justify-between border-t pt-4">
            <div className="text-sm text-gray-500">
                Menampilkan {currentFirstItem}-{currentLastItem} dari {totalItems} mobil
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
    );
};

export default CarPagination;