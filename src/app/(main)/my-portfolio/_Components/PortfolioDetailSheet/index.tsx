'use client'

import React from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { PortfolioDetails, useGetPortfolioDetails, useDeletePortfolioItem } from '@/queries'
import Spinner from '@/components/Shared/Spinner'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Eye, Trash, Triangle } from 'lucide-react'
import Image from 'next/image'
import { DefinitionTypes, useCurrencyStore } from '@/store/currencyStore'
import { useShallow } from 'zustand/react/shallow'
import { TITLES_BY_ID } from '@/constants'
import { Button } from '@/components/ui/button'
import { formatNumber } from '@/lib/utils'
import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table'
import { formatDate } from 'date-fns'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

interface PortfolioDetailSheetProps {
    isSheetOpen: boolean
    setIsSheetOpen: (isOpen: boolean) => void
    selectedPortfolioId: string | null
}

interface PortfolioHeaderProps {
    portfolioDetails: FormattedPortfolioDetails
}

interface InfoCardProps {
    label: string
    value: React.ReactNode
    className?: string
}

interface PortfolioSummaryProps {
    portfolioDetails: FormattedPortfolioDetails
}

interface LivePriceSectionProps {
    portfolioDetails: FormattedPortfolioDetails
}


interface PortfolioHistorySectionProps {
    portfolioDetails: FormattedPortfolioDetails
    handleDeletePortfolioItem: (portfolioItemId: string) => void
}

type FormattedPortfolioDetails = PortfolioDetails & DefinitionTypes & { title: string }

export default function PortfolioDetailSheet({
    isSheetOpen,
    setIsSheetOpen,
    selectedPortfolioId
}: PortfolioDetailSheetProps) {
    const { data: portfolioDetails, isPending, refetch } = useGetPortfolioDetails(selectedPortfolioId)
    const { mutate: deletePortfolioItem } = useDeletePortfolioItem()
    const [definitions] = useCurrencyStore(useShallow((state) => [state.definitions]))
    const queryClient = useQueryClient()

    const formattedPortfolioDetails = React.useMemo(() => {
        if (!portfolioDetails?.data) return null

        return {
            ...portfolioDetails.data,
            ...definitions?.find((definition) => definition._id === portfolioDetails.data?.portfolio.assetId),
            _id: portfolioDetails.data?.portfolio._id,
            title: TITLES_BY_ID[portfolioDetails.data?.portfolio.assetId] || "",
        }
    }, [portfolioDetails, definitions]) as FormattedPortfolioDetails

    const handleDeletePortfolioItem = (portfolioItemId: string) => {
        deletePortfolioItem({ portfolioId: formattedPortfolioDetails._id, portfolioItemId }, {
            onSuccess: () => {
                toast.success('Portfolio item deleted successfully')
                if (portfolioDetails?.data?.history.length === 1) {
                    setIsSheetOpen(false)
                    queryClient.invalidateQueries({ queryKey: ['GET_MY_PORTFOLIOS'] })
                } else {
                    refetch()
                }
            },
            onError: (error) => {
                toast.error(error?.message || 'Failed to delete portfolio item')
            }
        })
    }
    return (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetContent className='!max-w-[612px] w-full md:px-4 overflow-y-auto'>
                <SheetHeader>
                    <SheetTitle className='text-2xl'>Portfolio Details</SheetTitle>
                    <Separator className="my-4" />
                    <div className="flex flex-col w-full h-full">
                        {isPending ? (
                            <div className="w-full h-[calc(100vh-100px)] flex items-center justify-center">
                                <Spinner className="w-10 h-10 animate-spin" />
                            </div>
                        ) : (
                            <div className="flex flex-col gap-y-4">
                                <PortfolioHeader portfolioDetails={formattedPortfolioDetails} />
                                <PortfolioSummary portfolioDetails={formattedPortfolioDetails} />
                                <Separator />
                                <LivePriceSection portfolioDetails={formattedPortfolioDetails} />
                                <Separator />
                                <PortfolioHistorySection portfolioDetails={formattedPortfolioDetails} handleDeletePortfolioItem={handleDeletePortfolioItem} />
                            </div>
                        )}
                    </div>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}




function PortfolioHeader({ portfolioDetails }: PortfolioHeaderProps) {
    return (
        <div className="flex items-start gap-x-4">
            <Image
                src={`https://web-api.forinvestcdn.com/definitions/icon?code=${portfolioDetails?.code || ''}`}
                alt="icon"
                width={42}
                height={42}
            />
            <div className="flex flex-col">
                <h3 className="text-xl text-foreground font-semibold">{portfolioDetails?.securityDescEn || 'N/A'}</h3>
                <p className="text-sm text-muted-foreground">{portfolioDetails?.title || 'N/A'}</p>
            </div>
            <Tooltip>
                <TooltipTrigger>
                    <Button
                        size="icon"
                        variant="ghost"
                        asChild
                    >
                        <Eye className="!w-6 !h-6 text-primary" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    Go to currency page
                </TooltipContent>
            </Tooltip>
        </div>
    )
}

function InfoCard({ label, value, className = "" }: InfoCardProps) {
    return (
        <div className={`bg-gray-50 p-3 rounded-lg sm:col-span-1 col-span-2 ${className}`}>
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <div className="font-semibold">{value}</div>
        </div>
    )
}


function PortfolioSummary({ portfolioDetails }: PortfolioSummaryProps) {

    return (
        <div className="grid grid-cols-2 gap-4">
            <InfoCard
                label="Amount"
                value={portfolioDetails?.amount}
            />
            <InfoCard
                label="Buy Price"
                value={formatNumber(portfolioDetails?.assetPrice)}
            />
            <InfoCard
                label="Current Price"
                value={`${formatNumber(portfolioDetails?.currentPrice)} (${portfolioDetails?.currency})`}
            />
            <InfoCard
                label="Profit/Loss"
                value={(
                    <div className="flex items-center gap-x-1">
                        <Triangle
                            className={`!w-4 !h-4 ${portfolioDetails?.changePercentage > 0 ? '!fill-green-600 stroke-green-600' : '!fill-red-600 stroke-red-600 rotate-180'}`}
                        />
                        <p className={portfolioDetails?.changePercentage > 0 ? 'text-green-600' : 'text-red-600'}>
                            {formatNumber(portfolioDetails?.changePercentage)}
                        </p>
                    </div>
                )}
            />
        </div>
    )
}


function LivePriceSection({ portfolioDetails }: LivePriceSectionProps) {
    const { livePriceData } = portfolioDetails
    const isPositiveChange = livePriceData.c > 0
    const changePercentage = formatNumber(livePriceData.c / livePriceData.l, {
        style: 'percent',
        maximumFractionDigits: 2,
    })

    return (
        <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-foreground">Live Price</h3>
            <div className="grid grid-cols-2 gap-4 mt-4">
                <InfoCard
                    label="Last Price"
                    value={formatNumber(livePriceData?.l ?? 0)}
                />
                <InfoCard
                    label="Change"
                    value={formatNumber(livePriceData?.c ?? 0)}
                />
                <InfoCard
                    label="Change Percentage"
                    value={(
                        <div className="flex items-center gap-x-1">
                            <Triangle
                                className={`!w - 4!h - 4 ${isPositiveChange ? '!fill-green-600 stroke-green-600' : '!fill-red-600 stroke-red-600 rotate-180'} `}
                            />
                            <span className={isPositiveChange ? 'text-green-600' : 'text-red-600'}>
                                {changePercentage}
                            </span>
                        </div>
                    )}

                />
            </div>
        </div>
    )
}

function PortfolioHistorySection({ portfolioDetails, handleDeletePortfolioItem }: PortfolioHistorySectionProps) {
    const { history, livePriceData } = portfolioDetails

    return (
        <>
            <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-foreground">Portfolio History</h3>
                <p className="text-sm text-muted-foreground">
                    {history.length} transactions
                </p>
            </div>

            <div className="mt-4">
                <Table>
                    <TableHeader>
                        <TableRow className="h-10">
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Buy</TableHead>
                            <TableHead>Current</TableHead>
                            <TableHead>Tot. Buy</TableHead>
                            <TableHead>Tot. C.</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {history.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-4">
                                    No transaction history found
                                </TableCell>
                            </TableRow>
                        ) : (
                            history.map((item) => (
                                <TableRow key={item._id} className="h-12">
                                    <TableCell>{formatDate(item.date, 'dd MMM yyyy')}</TableCell>
                                    <TableCell>{item.amount}</TableCell>
                                    <TableCell>{formatNumber(item.assetPrice)}</TableCell>
                                    <TableCell>{formatNumber(livePriceData.l)}</TableCell>
                                    <TableCell>{formatNumber(item.assetPrice * item.amount)}</TableCell>
                                    <TableCell>{formatNumber(livePriceData.l * item.amount)}</TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="icon" onClick={() => handleDeletePortfolioItem(item._id)}>
                                            <Trash className="h-4 w-4 stroke-red-600" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}
