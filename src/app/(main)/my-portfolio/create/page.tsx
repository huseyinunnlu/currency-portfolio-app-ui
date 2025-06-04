"use client"
import { TooltipContent, TooltipProvider, TooltipTrigger, Tooltip } from '@/components/ui/tooltip'
import { Steps, Step } from '@/components/ui/steps'
import { ArrowLeft, Eye, Table, TextCursorInput, Wallet } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { FormProvider } from 'react-hook-form'
import { z } from 'zod'
import SelectPorfolioTypeStep from './_Components/SelectPortfolioTypeStep'
import { Separator } from '@/components/ui/separator'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import SelectAsset from './_Components/SelectAssetStep'
import useMultiStepForm from '@/hooks/useMultiStepForm'
import { zodResolver } from '@hookform/resolvers/zod'
import EnterPortfolioDetailsStep from './_Components/EnterPortfolioDetailsStep'
import PreviewStep from './_Components/PreviewStep'
import { PortfolioFormTypes, useCreatePortfolio } from '@/queries'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
interface StepItem {
    label: string;
    value: string;
    icon?: React.ReactNode;
}

const steps: StepItem[] = [
    {
        label: "Select Portfolio Type",
        value: "select-portfolio-type",
        icon: <Wallet size={16} />
    },
    {
        label: "Select Asset",
        value: "select-asset",
        icon: <Table size={16} />
    },
    {
        label: "Enter Portfolio Details",
        value: "enter-portfolio-details",
        icon: <TextCursorInput size={16} />
    },
    {
        label: "Preview",
        value: "preview-portfolio",
        icon: <Eye size={16} />
    },
]

const validationSchema = z.object({
    portfolioType: z.enum(['currency', 'gold', 'my-portfolio']),
    assetId: z.string().min(1, "You must select an asset"),
    assetPrice: z.number().min(0.01, "Price must be greater than 0"),
    amount: z.number().min(0.01, "Amount must be greater than 0"),
    date: z.date().max(new Date(), "Date must be in the past")
})

export default function CreatePortfolio() {
    const {
        stepCount,
        activeStep,
        nextStep,
        prevStep,
        form
    } = useMultiStepForm<PortfolioFormTypes>({
        formProps: {
            mode: "onTouched",
            shouldUnregister: false,
            defaultValues: {
                portfolioType: undefined,
                assetId: "",
                assetPrice: 0,
                amount: 1,
                date: new Date(),
            },
            resolver: zodResolver(validationSchema),
        },
        fieldsByStep: [
            ["portfolioType"],
            ["assetId", "assetPrice"],
            ["amount", "date"],
            ["portfolioType", "assetId", "assetPrice", "amount", "date"]
        ]
    })
    const { handleSubmit } = form
    const createPortfolioMutation = useCreatePortfolio()
    const router = useRouter()

    const renderForm = () => {
        switch (activeStep) {
            case 0:
                return <SelectPorfolioTypeStep nextStep={nextStep} />;
            case 1:
                return <SelectAsset nextStep={nextStep} />;
            case 2:
                return <EnterPortfolioDetailsStep nextStep={nextStep} />;
            case 3:
                return <PreviewStep />;
            default:
                return null;
        }
    }

    const onSubmit = async (data: PortfolioFormTypes) => {
        const response = await createPortfolioMutation.mutateAsync(data)
        if (response.success) {
            toast.success("Portfolio created successfully")
            router.push("/my-portfolio")
        } else {
            toast.error(response.message)
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-x-4">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href="/my-portfolio">
                                <ArrowLeft />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            Back
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <h3 className="text-2xl">Create Portfolio</h3>
            </div>

            <Steps current={activeStep}>
                {steps.map((step: StepItem) => (
                    <Step
                        key={step.value}
                        title={step.label}
                        icon={step.icon}
                    />
                ))}
            </Steps>
            <Separator />
            <Form {...form}>
                <FormProvider {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} id='portfolio-form'>
                        {renderForm()}
                    </form>
                </FormProvider>
            </Form>
            <div className="flex items-center gap-x-2 justify-end">
                {
                    activeStep > 0 ? <>
                        <Button size="sm" variant="secondary" disabled={activeStep === 0} onClick={() => {
                            prevStep()
                        }}>Prev</Button>
                        {
                            activeStep < stepCount - 1 && (
                                <Button size="sm" onClick={() => nextStep()}>Next</Button>
                            )
                        }
                        {
                            activeStep === stepCount - 1 && (
                                <Button size="sm" type="submit" form='portfolio-form'>Submit</Button>
                            )
                        }

                    </> : null
                }
            </div>
        </div>

    )
}
