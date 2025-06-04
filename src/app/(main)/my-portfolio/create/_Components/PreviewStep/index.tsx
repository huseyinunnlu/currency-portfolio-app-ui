import Image from 'next/image'
import React, { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { CurrencyData, useCurrencyStore } from '@/store/currencyStore'
import { useShallow } from 'zustand/react/shallow'
import { formatNumber } from '@/lib/utils'
import { format } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'


export default function PreviewStep() {
    const form = useFormContext()
    const [formatCurrencyData] = useCurrencyStore(useShallow(state => [state.formatCurrencyData]))
    const assetData = useQueryClient().getQueryData<{ data: CurrencyData[] }>(['GET_CURRENT_PRICES_BY_KEYS'])

    const formValues = form.getValues()

    const selectedAsset = useMemo(() => {
        if (!assetData?.data?.length) {
            return null
        }
        const selectedCurrency = assetData.data.find(asset => asset._i === formValues.assetId || asset._id === formValues.assetId)
        if (!selectedCurrency) {
            return null
        }
        return {
            ...selectedCurrency,
            ...formatCurrencyData([selectedCurrency])[0]
        }
    }, [assetData, formValues.assetId])

    if (!selectedAsset) {
        return <div>Error: Asset not found</div>
    }

    const totalValue = formValues.assetPrice * formValues.amount

    return (
        <div className="flex flex-col gap-y-6">
            <div className="flex flex-col">
                <h2 className="text-xl font-semibold">Preview Your Portfolio</h2>
                <p className="text-sm text-muted-foreground">Review the details before submission</p>
            </div>

            <Card className="overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex flex-col gap-y-4">
                        <div className="flex items-center gap-x-3">
                            <Image
                                src={`https://web-api.forinvestcdn.com/definitions/icon?code=${selectedAsset.code}`}
                                alt="icon"
                                width={48}
                                height={48}
                            />
                            <div>
                                <h3 className="text-lg font-semibold">{selectedAsset.title}</h3>
                                <p className="text-sm text-muted-foreground">{selectedAsset.securityDescEn}</p>
                            </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-y-1">
                                <p className="text-sm text-muted-foreground">Portfolio Type</p>
                                <p className="font-medium capitalize">{formValues.portfolioType}</p>
                            </div>

                            <div className="flex flex-col gap-y-1">
                                <p className="text-sm text-muted-foreground">Asset Price</p>
                                <p className="font-medium">{formatNumber(formValues.assetPrice)} ({selectedAsset.currency})</p>
                            </div>

                            <div className="flex flex-col gap-y-1">
                                <p className="text-sm text-muted-foreground">Amount</p>
                                <p className="font-medium">{formatNumber(formValues.amount)}</p>
                            </div>

                            <div className="flex flex-col gap-y-1">
                                <p className="text-sm text-muted-foreground">Date Added</p>
                                <p className="font-medium">{format(formValues.date, "PPP")}</p>
                            </div>
                        </div>

                        <Separator />

                        <div className="flex flex-col gap-y-1">
                            <p className="text-sm text-muted-foreground">Total Value</p>
                            <p className="text-lg font-bold">{formatNumber(totalValue)} ({selectedAsset.currency})</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 