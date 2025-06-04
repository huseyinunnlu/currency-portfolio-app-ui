import React from 'react'
import { PortfolioData } from '@/queries'
import { DefinitionTypes } from '@/store/currencyStore'
import { Card, CardContent } from '@/components/ui/card'
import { formatNumber } from '@/lib/utils'
import { Triangle, Edit, Trash2, MoreHorizontal } from 'lucide-react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import Spinner from '@/components/Shared/Spinner'

interface PortfolioCardProps {
    portfolios: Array<PortfolioData & DefinitionTypes & { title: string }>
    onPortfolioClick: (portfolioId: string) => void
    handleDeletePortfolio: (portfolioId: string) => void
    isDeleting: boolean
}

export default function PortfolioCard({ portfolios, onPortfolioClick, handleDeletePortfolio, isDeleting }: PortfolioCardProps) {
    if (portfolios.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                <p className="text-lg">No portfolio items found</p>
                <p className="text-sm mt-1">Add assets to your portfolio to see them here</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {portfolios.map((portfolio) => (
                <Card
                    key={portfolio._id}
                    className="hover:scale-105 transition-all cursor-pointer relative"
                >
                    <div className="absolute top-2 right-2 z-10">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem className="cursor-pointer" onClick={() => onPortfolioClick(portfolio._id)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    <span>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled={isDeleting} className="cursor-pointer text-red-600" onClick={() => handleDeletePortfolio(portfolio._id)}>
                                    {
                                        isDeleting ? (
                                            <Spinner className="mr-2 h-4 w-4" />
                                        ) : (
                                            <Trash2 className="mr-2 h-4 w-4" />
                                        )
                                    }
                                    <span>Delete</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <CardContent>
                        <div className="flex flex-col items-center gap-4 pb-4">
                            <Image
                                src={`https://web-api.forinvestcdn.com/definitions/icon?code=${portfolio.code}`}
                                alt="icon"
                                width={38}
                                className="rounded-full"
                                height={38}
                            />
                            <div className="flex flex-col text-center">
                                <p className="font-bold text-lg">{portfolio.title}</p>
                                <p className="text-gray-500 text-xs truncate">
                                    {portfolio.securityDescEn}
                                </p>
                            </div>

                            <Badge variant="secondary" className={`${portfolio.changePercentage > 0 ? 'fill-green-600 text-green-600' : 'fill-red-600 text-red-600'}`}>
                                <Triangle className={`h-3 w-3 mr-1 ${portfolio.changePercentage > 0 ? 'fill-green-600 rotate-180' : 'fill-red-600'}`} />
                                {formatNumber(portfolio.changePercentage, {
                                    style: 'percent',
                                    maximumFractionDigits: 2
                                })}
                            </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">Amount</p>
                                <p className="font-semibold">{portfolio.amount}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">Buy Price</p>
                                <p className="font-semibold">{formatNumber(portfolio.assetPrice)}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                                <p className="text-xs text-gray-500 mb-1">Current Price</p>
                                <p className="font-semibold">{`${formatNumber(portfolio.currentPrice)} (${portfolio.currency})`}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                                <p className="text-xs text-gray-500 mb-1">Profit/Loss</p>
                                <p className={`font-semibold ${portfolio.changePercentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {`${formatNumber((portfolio.currentPrice - portfolio.assetPrice) * portfolio.amount)} (${portfolio.currency})`}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
} 