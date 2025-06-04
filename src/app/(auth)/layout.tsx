import { Check, CheckCheck } from 'lucide-react';
import { ReactNode } from 'react';

const featureTexts = [
    "Real-time currency exchange rates from global markets",
    "Advanced portfolio management tools",
    "Personalized market alerts and notifications"
]

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen w-full overflow-hidden">
            <div className="w-full lg:w-2/5 p-10 flex flex-col justify-center relative">
                <div className="max-w-md mx-auto w-full mt-8">
                    {children}
                </div>
                <div className="absolute bottom-6 left-10 right-10">
                    <div className="text-xs text-gray-400 flex justify-between items-center">
                        <span>© {new Date().getFullYear()} CurrencyPortfolio</span>
                        <div className="flex space-x-4">
                            <span>Privacy</span>
                            <span>Terms</span>
                            <span>Help</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right panel - Promotional content */}
            <div className="hidden lg:flex items-center justify-center lg:w-3/5 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden">
                <div className="flex-grow flex flex-col justify-center max-w-xl">
                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">CURRENCY</span>
                        <span className="text-white">PORTFOLIO</span>
                        <span className="block text-lg font-normal text-cyan-100 mt-2">Real-time currency tracking platform</span>
                    </h1>
                    <div className="mt-6 space-y-5">
                        {
                            featureTexts.map((text, index) => (
                                <div className="flex items-center" key={index}>
                                    <div className="flex-shrink-0 h-6 w-6 bg-cyan-400/20 rounded-full flex items-center justify-center">
                                        <Check className="size-3.5 text-cyan-300 stroke-3" />
                                    </div>
                                    <p className="ml-3 text-gray-300">{text}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
