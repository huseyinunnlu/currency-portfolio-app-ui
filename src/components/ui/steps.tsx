"use client"
import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

// Step status type
export type StepStatus = "wait" | "process" | "finish" | "error";

// Step props interface
export interface StepProps {
    status?: StepStatus;
    title: React.ReactNode;
    description?: React.ReactNode;
    icon?: React.ReactNode;
    stepNumber?: number;
    isLast?: boolean;
    className?: string;
}

// Steps context
interface StepsContextValue {
    current: number;
    status?: StepStatus;
    direction?: "horizontal" | "vertical";
    labelPlacement?: "horizontal" | "vertical";
}

const StepsContext = React.createContext<StepsContextValue>({
    current: 0,
    direction: "horizontal",
    labelPlacement: "horizontal",
});

// Step component
const Step = React.forwardRef<HTMLDivElement, StepProps & React.HTMLAttributes<HTMLDivElement>>(
    (
        {
            className,
            status: stepStatus,
            title,
            description,
            icon,
            stepNumber,
            isLast,
            ...props
        },
        ref
    ) => {
        const { current, direction, labelPlacement } = React.useContext(StepsContext);

        // Determine status based on current step and index
        const getStatus = (): StepStatus => {
            if (stepStatus) return stepStatus;
            if (stepNumber !== undefined) {
                if (stepNumber < current) return "finish";
                if (stepNumber === current) return "process";
                return "wait";
            }
            return "wait";
        };

        const currentStatus = getStatus();

        // Set colors based on status
        const getStepIconColor = () => {
            switch (currentStatus) {
                case "finish":
                    return "bg-primary text-primary-foreground";
                case "process":
                    return "bg-primary text-primary-foreground ring-2 ring-primary/30";
                case "error":
                    return "bg-destructive text-destructive-foreground";
                default:
                    return "bg-muted text-muted-foreground";
            }
        };

        const getStepTitleColor = () => {
            switch (currentStatus) {
                case "finish":
                    return "text-foreground";
                case "process":
                    return "text-foreground font-medium";
                case "error":
                    return "text-destructive";
                default:
                    return "text-muted-foreground";
            }
        };

        const getStepDescriptionColor = () => {
            switch (currentStatus) {
                case "error":
                    return "text-destructive/80";
                default:
                    return "text-muted-foreground";
            }
        };

        const getConnectorColor = () => {
            switch (currentStatus) {
                case "finish":
                    return "bg-primary";
                case "process":
                    return "bg-primary/50";
                default:
                    return "bg-muted";
            }
        };

        // Render step content
        return (
            <div
                ref={ref}
                className={cn(
                    direction === "horizontal" ? "flex-1" : "w-full",
                    "relative flex",
                    direction === "horizontal"
                        ? "flex-col items-center"
                        : "flex-row items-start gap-3",
                    className
                )}
                data-status={currentStatus}
                {...props}
            >
                {/* Step icon */}
                <div
                    className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full",
                        getStepIconColor()
                    )}
                >
                    {currentStatus === "finish" ? (
                        <Check className="h-5 w-5" />
                    ) : icon ? (
                        icon
                    ) : (
                        <span>{stepNumber !== undefined ? stepNumber + 1 : null}</span>
                    )}
                </div>

                {/* Connector line */}
                {!isLast && (
                    <div
                        className={cn(
                            direction === "horizontal"
                                ? "absolute left-[calc(50%+16px)] top-4 h-[2px] w-[calc(100%-32px)]"
                                : "absolute left-4 top-8 h-[calc(100%-32px)] w-[2px]",
                            getConnectorColor()
                        )}
                    />
                )}

                {/* Step content */}
                <div
                    className={cn(
                        "mt-2 flex w-full flex-col",
                        direction === "horizontal"
                            ? "items-center text-center"
                            : "items-start text-left",
                        labelPlacement === "vertical" && direction === "horizontal" && "items-start text-left pl-12"
                    )}
                >
                    <div className={cn("text-sm font-medium", getStepTitleColor())}>
                        {title}
                    </div>
                    {description && (
                        <div className={cn("text-xs", getStepDescriptionColor())}>
                            {description}
                        </div>
                    )}
                </div>
            </div>
        );
    }
);

Step.displayName = "Step";

// Steps props interface
export interface StepsProps extends React.HTMLAttributes<HTMLDivElement> {
    current?: number;
    status?: StepStatus;
    direction?: "horizontal" | "vertical";
    labelPlacement?: "horizontal" | "vertical";
    responsive?: boolean;
}

// Steps component
const Steps = React.forwardRef<HTMLDivElement, StepsProps>(
    (
        {
            children,
            className,
            current = 0,
            status,
            direction = "horizontal",
            labelPlacement = "horizontal",
            responsive = true,
            ...props
        },
        ref
    ) => {
        // Handle responsive direction
        const [actualDirection, setActualDirection] = React.useState(direction);

        React.useEffect(() => {
            const handleResize = () => {
                if (responsive && direction === "horizontal") {
                    setActualDirection(window.innerWidth < 640 ? "vertical" : "horizontal");
                } else {
                    setActualDirection(direction);
                }
            };

            handleResize();
            window.addEventListener("resize", handleResize);

            return () => {
                window.removeEventListener("resize", handleResize);
            };
        }, [direction, responsive]);

        // Add step numbers and isLast prop to children
        const stepsChildren = React.Children.map(children, (child, index) => {
            if (!React.isValidElement(child)) return child;

            return React.cloneElement(child, {
                stepNumber: index,
                isLast: index === React.Children.count(children) - 1,
            } as Partial<StepProps>);
        });

        return (
            <StepsContext.Provider
                value={{
                    current,
                    status,
                    direction: actualDirection,
                    labelPlacement,
                }}
            >
                <div
                    ref={ref}
                    className={cn(
                        "flex",
                        actualDirection === "horizontal" ? "flex-row" : "flex-col",
                        "w-full gap-1",
                        className
                    )}
                    {...props}
                >
                    {stepsChildren}
                </div>
            </StepsContext.Provider>
        );
    }
);

Steps.displayName = "Steps";

export { Steps, Step }; 