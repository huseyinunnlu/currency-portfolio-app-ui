import Spinner from '@/components/Shared/Spinner'
import { currencyKeysByTab } from '@/constants'
import { useGetCurrentPricesByKeys } from '@/queries/currency'
import { Currency } from '@/store/currencyStore'
import React, { } from 'react'
import { useFormContext } from 'react-hook-form'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatNumber } from '@/lib/utils'
import Image from 'next/image'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface SelectAssetProps {
    nextStep: () => void
}


export default function SelectAssetStep({ }: SelectAssetProps) {
    const form = useFormContext()
    const { data: assets, isPending } = useGetCurrentPricesByKeys(currencyKeysByTab[form.getValues("portfolioType")])
    const [selectedAsset, setSelectedAsset] = React.useState<{
        assetId: string,
        assetPrice: number,
    }>({
        assetId: form.getValues('assetId') || '',
        assetPrice: form.getValues('assetPrice') || 0,
    })

    const handleRowClick = (asset: Currency) => {
        console.log(asset)
        setSelectedAsset({
            assetId: asset._id,
            assetPrice: asset.l,
        })
        form.setValue('assetId', asset._id)
        form.setValue('assetPrice', asset.l)
    };

    if (isPending) {
        return <div className="flex gap-6 w-full h-full justify-center items-center flex-wrap mt-4">
            <Spinner />
        </div>
    }

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex flex-col">
                <h2 className="text-xl font-semibold">Select Asset</h2>
                <p className="text-sm text-muted-foreground">Choose the asset you want to add to your portfolio</p>
            </div>

            <RadioGroup value={selectedAsset.assetId}>
                <Table>
                    <TableHeader>
                        <TableRow className="h-12">
                            <TableHead className="w-[180px]">Symbol</TableHead>
                            <TableHead>Buying</TableHead>
                            <TableHead>Selling</TableHead>
                            <TableHead className="w-12">Select</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {assets?.map((asset) => (
                            <TableRow
                                className={`h-16 hover:bg-gray-50 ${selectedAsset.assetId === asset._id ? 'bg-gray-50' : ''} cursor-pointer`}
                                key={asset._id}
                                onClick={() => handleRowClick(asset)}
                            >
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src={`https://web-api.forinvestcdn.com/definitions/icon?code=${asset.code}`}
                                            alt="icon"
                                            width={32}
                                            height={32}
                                        />
                                        <div className="flex flex-col gap-y-1">
                                            <p className="font-bold text-sm">{asset.title}</p>
                                            <p className="text-gray-700 text-xs truncate max-w-[100px]">
                                                {asset.securityDescEn}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm">{formatNumber(asset.b)}</TableCell>
                                <TableCell className="text-sm">{formatNumber(asset.l)}</TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                                        <RadioGroupItem
                                            value={asset._id}
                                            id={asset._id}
                                            className="cursor-pointer"
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </RadioGroup>
        </div>
    )
}
