import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import CurrencyInput from '@/components/ui/currency-input';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Dialog } from '@/components/ui/dialog';
import { FormControl, FormMessage } from '@/components/ui/form';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatNumber } from '@/lib/utils';
import { CurrencyHistoryFilters, CurrencyHistoryResponse, useGetCurrencyHistory } from '@/queries/currency';
import { Currency, useCurrencyStore } from '@/store/currencyStore';
import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form';

interface ManualPriceEnterModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedAsset: Currency;
}

const tabs = [
    {
        label: 'Enter Price Manually',
        value: 'manual',
    },
    {
        label: 'Select price from calendar',
        value: 'calendar',
    },
]

function EnterPriceManually({ onOpenChange, selectedAsset }: ManualPriceEnterModalProps) {
    const form = useFormContext()

    return (
        <div className="flex flex-col justify-between h-full">
            <FormField
                control={form.control}
                name="assetPrice"
                render={({ field }) => (
                    <FormItem className="w-full mt-4">
                        <FormLabel>Price ({selectedAsset.currency})</FormLabel>
                        <FormControl>
                            <CurrencyInput
                                placeholder="0.00"
                                defaultValue={field.value}
                                onValueChange={(value) => field.onChange(parseFloat(value || '0'))}
                                prefix={`${selectedAsset.currency} `}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <Button className="ml-auto mt-auto" disabled={!form.getValues('assetPrice')} onClick={() => {
                onOpenChange(false)
            }}>Set Price</Button>
        </div>
    )
}

function SelectPriceFromCalendar({ onOpenChange, selectedAsset }: ManualPriceEnterModalProps) {
    const { definitions } = useCurrencyStore()
    const form = useFormContext()
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    const [filters, setFilters] = React.useState<CurrencyHistoryFilters>({
        period: "1440",
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime(),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getTime(),
        legacyCode: definitions?.find((definition) => definition.code === selectedAsset.code)?.legacyCode || null,
    })
    const [selectedCurrencyData, setSelectedCurrencyData] = React.useState<CurrencyHistoryResponse | null>(null)
    const { data: currencyHistory } = useGetCurrencyHistory(true, filters)
    const handleMonthChange = (month: Date) => {
        setFilters({
            ...filters,
            startDate: new Date(month.getFullYear(), month.getMonth(), 1).getTime(),
            endDate: new Date(month.getFullYear(), month.getMonth() + 1, 0).getTime(),
        })
    }
    const getCurrencyDataByDate = (date: Date) => {
        if (!currencyHistory?.data) {
            return false
        }

        let selectedDate = date

        if (selectedDate.getDay() === 0 || selectedDate.getDay() === 6) {
            //if date is weekend get previous friday date
            selectedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - (selectedDate.getDay() === 0 ? 2 : 1))
        }

        const selectedPrice = currencyHistory?.data.find((price) => {
            return new Date(price.d).getDate() === selectedDate.getDate()
        })

        //if selected price is not found, get the closest price
        if (!selectedPrice) {
            const closestPrice = currencyHistory?.data.reduce((prev, curr) => {
                return (Math.abs(curr.d - selectedDate.getTime()) < Math.abs(prev.d - selectedDate.getTime()) ? curr : prev)
            })
            setSelectedCurrencyData(closestPrice || null)
        } else {
            setSelectedCurrencyData(selectedPrice || null)
        }
    }

    const setPriceToForm = () => {
        form.setValue('assetPrice', selectedCurrencyData?.l)
        onOpenChange(false)
    }

    useEffect(() => {
        if (!selectedCurrencyData) {
            getCurrencyDataByDate(date || new Date())
        }
    }, [currencyHistory])

    return (
        <>
            <Calendar
                showOutsideDays={false}
                mode="single"
                selected={date}
                onSelect={(day) => {
                    setDate(day)
                    getCurrencyDataByDate(day || new Date())
                }}
                disabled={[{ after: new Date() }]}
                onMonthChange={handleMonthChange}
                toMonth={new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)}
                fromMonth={new Date(new Date().getFullYear() - 20, new Date().getMonth() - 1, 0)}
                className="w-full flex items-center justify-center"
                onDayMouseEnter={getCurrencyDataByDate}
                onDayMouseLeave={() => getCurrencyDataByDate(date || new Date())}
            />

            <div className='flex items-center justify-between mt-4'>
                <h1 className='font-bold'>Selected Price: {`${formatNumber(selectedCurrencyData?.l || form.getValues('assetPrice'))} (${selectedAsset.currency})`}</h1>
                <Button className="ml-auto" disabled={!selectedCurrencyData?.l} onClick={setPriceToForm}>Set Price</Button>
            </div>
        </>
    )
}



export default function ManualPriceEnterModal({ open, onOpenChange, selectedAsset }: ManualPriceEnterModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='min-h-[460px]'>
                <DialogHeader>
                    <DialogTitle>Enter Price Manually</DialogTitle>
                    <Tabs defaultValue="account" className="h-full">
                        <TabsList className="w-full" variant='line'>
                            {
                                tabs.map((tab) => (
                                    <TabsTrigger key={tab.value} variant='line' className="w-full" value={tab.value}>{tab.label}</TabsTrigger>
                                ))
                            }
                        </TabsList>
                        <TabsContent value="manual">
                            <EnterPriceManually open={open} onOpenChange={onOpenChange} selectedAsset={selectedAsset} />
                        </TabsContent>
                        <TabsContent value="calendar">
                            <SelectPriceFromCalendar open={open} onOpenChange={onOpenChange} selectedAsset={selectedAsset} />
                        </TabsContent>
                    </Tabs>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
