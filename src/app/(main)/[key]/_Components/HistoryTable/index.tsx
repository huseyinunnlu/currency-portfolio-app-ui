"use client"

import { CurrencyHistoryResponse } from '@/queries/currency'
import React, { useMemo, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PaginationWrapper } from "@/components/ui/pagination"
import { formatNumber } from '@/lib/utils'

const ITEMS_PER_PAGE = 20;

export default function HistoryTable({ currencyHistoryData, activeTab }: { currencyHistoryData: CurrencyHistoryResponse[], activeTab: string }) {
    const [currentPage, setCurrentPage] = useState(1);

    const formattedData = useMemo(() => {
        return currencyHistoryData.map(item => {
            const date = new Date(item.d);
            const formattedDate = date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
            const formattedTime = ["1d", "1w"].includes(activeTab) ? date.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }) : "";

            return {
                date: `${formattedDate} ${formattedTime}`,
                open: formatNumber(item.o),
                high: formatNumber(item.h),
                low: formatNumber(item.l),
                close: formatNumber(item.c),
                change: formatNumber((item.c - item.o) / item.o * 100)
            }
        });
    }, [currencyHistoryData]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return formattedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [formattedData, currentPage]);

    const totalItems = formattedData.length;

    if (formattedData.length === 0) {
        return <p>No historical data available.</p>;
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="w-full">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Open</TableHead>
                        <TableHead className="text-right">High</TableHead>
                        <TableHead className="text-right">Low</TableHead>
                        <TableHead className="text-right">Close</TableHead>
                        <TableHead className="text-right">Change %</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedData.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{row.date}</TableCell>
                            <TableCell className="text-right">{row.open}</TableCell>
                            <TableCell className="text-right">{row.high}</TableCell>
                            <TableCell className="text-right">{row.low}</TableCell>
                            <TableCell className="text-right">{row.close}</TableCell>
                            <TableCell className={`text-right ${parseFloat(row.change) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {parseFloat(row.change) >= 0 ? '+' : ''}{row.change}%
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <PaginationWrapper
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={handlePageChange}
                className="mt-4"
            />
        </div>
    )
}
