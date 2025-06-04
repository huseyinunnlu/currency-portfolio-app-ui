import Image from 'next/image'
import React, { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import ManualPriceEnterModal from '../ManualPriceModal'
import { cn, formatNumber } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { CalendarIcon, Pencil } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { CurrencyData, useCurrencyStore } from '@/store/currencyStore'
import { useShallow } from 'zustand/react/shallow'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'

interface EnterPortfolioDetailsStepProps {
    nextStep: () => void
}

export default function EnterPortfolioDetailsStep({ }: EnterPortfolioDetailsStepProps) {
    const form = useFormContext()
    const [formatCurrencyData] = useCurrencyStore(useShallow(state => [state.formatCurrencyData]))
    const [manualPriceModalOpen, setManualPriceModalOpen] = React.useState<boolean>(false)
    const assetData = useQueryClient().getQueryData<{ data: CurrencyData[] }>(['GET_CURRENT_PRICES_BY_KEYS'])

    const selectedAsset = useMemo(() => {
        if (!assetData?.data?.length) {
            return null
        }
        const selectedCurrency = assetData.data.find(asset => asset._i === form.getValues('assetId'))
        if (!selectedCurrency) {
            return null
        }
        return {
            ...selectedCurrency,
            ...formatCurrencyData([selectedCurrency])[0]
        }
    }, [assetData, form.getValues('assetId')])

    if (!selectedAsset) {
        return <div>error. asset not found</div>
    }

    console.log(selectedAsset)

    return (
        <>
            <div className="flex flex-col gap-y-4">
                <div className="flex flex-col">
                    <h2 className="text-xl font-semibold">Enter Portfolio Details</h2>
                    <p className="text-sm text-muted-foreground">Enter the details of your portfolio</p>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-y-4">
                    <div className="flex flex-col gap-y-2 mt-4 w-full md:w-1/2">
                        <p className="font-medium">Asset Name:</p>
                        <div className="flex items-center gap-x-2">
                            <Image
                                src={`https://web-api.forinvestcdn.com/definitions/icon?code=${selectedAsset.code}`}
                                alt="icon"
                                width={48}
                                height={48}
                            />
                            <p className="text-sm font-medium">{selectedAsset?.title}</p>
                        </div>
                    </div>


                    <div className="flex flex-col gap-y-2 mt-4 w-full md:w-1/2">
                        <p className="font-medium">Price for per asset:</p>
                        <div className="flex items-center gap-x-2">
                            <p className="text-sm font-medium">{formatNumber(form.getValues('assetPrice'))} ({selectedAsset.currency})</p>
                            <Button size="sm" onClick={() => setManualPriceModalOpen(true)}>
                                <Pencil /> Enter price manually
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Enter amount"
                                        {...field}
                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || null)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={(day) => {
                                                field.onChange(day)
                                            }}
                                            disabled={{
                                                after: new Date()
                                            }}
                                            toMonth={new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
            <ManualPriceEnterModal open={manualPriceModalOpen} onOpenChange={setManualPriceModalOpen} selectedAsset={selectedAsset} />
        </>
    )
}
