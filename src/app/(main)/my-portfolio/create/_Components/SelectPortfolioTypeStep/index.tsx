import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DollarSign, Wallet } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { useFormContext } from 'react-hook-form';

const portfolioTypes = [
    {
        label: "Currency",
        value: "currency",
        icon: <DollarSign className='stroke-primary' size={86} />
    },
    {
        label: "Gold",
        value: "gold",
        icon: <Image
            src="https://web-api.forinvestcdn.com/definitions/icon?code=XAUUSD"
            alt="Gold"
            width={86}
            height={86}
        />
    },
    {
        label: "From My portfolio",
        value: "my-portfolio",
        icon: <Wallet className='stroke-primary' size={86} />
    }
]

interface SelectPorfolioTypeStepProps {
    nextStep: () => void
}


export default function SelectPorfolioTypeStep({ nextStep }: SelectPorfolioTypeStepProps) {
    const form = useFormContext()

    const onSelect = (value: string) => {
        form.setValue("portfolioType", value, { shouldValidate: true })
        nextStep()
    }

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex flex-col">
                <h2 className="text-xl font-semibold">Select Portfolio Type</h2>
                <p className="text-sm text-muted-foreground">Choose the type of portfolio you want to create</p>
            </div>
            <div className="flex gap-6 w-full h-full justify-center items-center flex-wrap mt-4">
                {portfolioTypes.map((portfolioType) => (
                    <Card key={portfolioType.value} className="hover:scale-105 transition-all cursor-pointer w-48 h-48" onClick={() => onSelect(portfolioType.value)}>
                        <CardContent className="flex flex-col items-center justify-center w-full h-full">
                            {portfolioType.icon}
                            <div className="flex flex-col mt-auto w-full items-center gap-y-2">
                                <Separator />
                                <h3 className="text-md font-medium">{portfolioType.label}</h3>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
} 