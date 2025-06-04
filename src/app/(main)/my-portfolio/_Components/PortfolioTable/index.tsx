import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React from 'react'
import { PortfolioData } from '@/queries'
import { formatNumber } from '@/lib/utils'
import { Triangle } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Edit, Trash } from 'lucide-react'
import { DefinitionTypes } from '@/store/currencyStore'
import Spinner from '@/components/Shared/Spinner'

interface PortfolioTableProps {
    portfolios: Array<PortfolioData & DefinitionTypes & { title: string }>
    onPortfolioClick: (portfolioId: string) => void
    handleDeletePortfolio: (portfolioId: string) => void
    isDeleting: boolean
}

export default function PortfolioTable({ portfolios, onPortfolioClick, handleDeletePortfolio, isDeleting }: PortfolioTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow className="h-12">
                    <TableHead className="w-[220px]">Symbol</TableHead>
                    <TableHead className="hidden md:table-cell">Amount</TableHead>
                    <TableHead className="hidden lg:table-cell">Current Price</TableHead>
                    <TableHead className="hidden md:table-cell">Buy Price</TableHead>
                    <TableHead className="hidden lg:table-cell">Change %</TableHead>
                    <TableHead className="w-32 hidden sm:table-cell">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {portfolios.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center py-6">
                            No portfolio items found
                        </TableCell>
                    </TableRow>
                ) : (
                    portfolios.map((portfolio) => (
                        <TableRow key={portfolio._id} className="h-16">
                            <TableCell className="font-medium w-[210px]">
                                <div className="flex items-center gap-4">
                                    <Image
                                        src={`https://web-api.forinvestcdn.com/definitions/icon?code=${portfolio.code}`}
                                        alt="icon"
                                        width={32}
                                        height={32}
                                    />
                                    <div className="flex flex-col gap-y-1">
                                        <p className="font-bold">{portfolio.title}</p>
                                        <p className="text-gray-700 text-xs truncate max-w-[110px]">
                                            {portfolio.securityDescEn}
                                        </p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="font-medium hidden md:table-cell">
                                {portfolio.amount}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                                {formatNumber(portfolio.currentPrice)}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                {formatNumber(portfolio.assetPrice)}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                                <div className="flex items-center gap-x-1">
                                    <Triangle
                                        className={`!w-4 !h-4 ${portfolio.changePercentage > 0 ? '!fill-green-600 stroke-green-600' : '!fill-red-600 stroke-red-600 rotate-180'}`}
                                    />
                                    <span className={portfolio.changePercentage > 0 ? 'text-green-600' : 'text-red-600'}>
                                        {formatNumber(portfolio.changePercentage, {
                                            style: 'percent',
                                            maximumFractionDigits: 2
                                        })}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onPortfolioClick(portfolio._id)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button disabled={isDeleting} variant="outline" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => handleDeletePortfolio(portfolio._id)}>
                                        {
                                            isDeleting ? (
                                                <Spinner className="h-4 w-4" />
                                            ) : (
                                                <Trash className="h-4 w-4" />
                                            )
                                        }
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    )
}
