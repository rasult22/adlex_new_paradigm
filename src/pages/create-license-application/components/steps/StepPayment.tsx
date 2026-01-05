import { useState } from 'react';
import { Check } from '@untitledui/icons';
import { BadgeWithDot } from '@/components/base/badges/badges';
import { Button } from '@/components/base/buttons/button';
import { LoadingIndicator } from '@/components/application/loading-indicator/loading-indicator';

type PaymentStatus = 'unpaid' | 'waiting' | 'paid';

interface PaymentItem {
    label: string;
    amount: number;
    children?: { label: string; amount: number }[];
}

const mockPaymentItems: PaymentItem[] = [
    {
        label: '4 Visas',
        amount: 3750,
        children: [
            { label: 'Azamat G.', amount: 1250 },
            { label: 'Rasulzhan T.', amount: 1250 },
            { label: 'Myrzageldi A.', amount: 1250 },
        ],
    },
    { label: 'Company registration', amount: 5000 },
    { label: 'Service fee', amount: 100 },
];

const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
};

const StatusBadge = ({ status }: { status: PaymentStatus }) => {
    if (status === 'unpaid') {
        return <BadgeWithDot color="gray">Unpaid</BadgeWithDot>;
    }
    if (status === 'waiting') {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-utility-blue-50 text-utility-blue-700 text-sm font-medium ring-1 ring-inset ring-utility-blue-200">
                <svg className="size-3 animate-spin" viewBox="0 0 16 16" fill="none">
                    <circle className="stroke-current opacity-30" cx="8" cy="8" r="6" strokeWidth="2" />
                    <circle
                        className="origin-center stroke-current"
                        cx="8"
                        cy="8"
                        r="6"
                        strokeWidth="2"
                        strokeDasharray="9.5 37.7"
                        strokeLinecap="round"
                    />
                </svg>
                Waiting for payment
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-utility-success-50 text-utility-success-700 text-sm font-medium ring-1 ring-inset ring-utility-success-200">
            <Check className="size-3" />
            Paid
        </span>
    );
};

export const StepPayment = () => {
    const [status, setStatus] = useState<PaymentStatus>('unpaid');

    const total = mockPaymentItems.reduce((acc, item) => acc + item.amount, 0);

    const handlePay = () => {
        setStatus('waiting');
        // Simulate payment processing
        setTimeout(() => {
            setStatus('paid');
        }, 3000);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold text-primary">Payment</h2>
                <StatusBadge status={status} />
            </div>
            <p className="text-md text-tertiary">
                Please make the payment for the company registration services and visa processing.
            </p>

            {status === 'waiting' ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <LoadingIndicator type="dot-circle" size="lg" label="Awaiting payment" />
                </div>
            ) : (
                <div className="flex gap-6">
                    {/* Payment breakdown */}
                    <div className="p-6 rounded-xl bg-secondary ring-1 ring-border-primary flex-1">
                        <div className="space-y-4">
                            {mockPaymentItems.map((item, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-primary">{item.label}</span>
                                        <span className="text-sm font-medium text-primary">{formatCurrency(item.amount)}</span>
                                    </div>
                                    {item.children && (
                                        <div className="ml-4 mt-2 space-y-2">
                                            {item.children.map((child, childIdx) => (
                                                <div key={childIdx} className="flex justify-between items-center">
                                                    <span className="text-sm text-tertiary">{child.label}</span>
                                                    <span className="text-sm text-tertiary">{formatCurrency(child.amount)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total and Pay button */}
                    <div className={`p-6 rounded-xl ring-1 flex flex-col justify-between min-w-[200px] ${status === 'paid' ? 'bg-utility-success-50 ring-utility-success-200' : 'bg-secondary ring-border-primary'}`}>
                        <div>
                            <p className="text-sm text-tertiary mb-1">Total</p>
                            <p className={`text-2xl font-semibold ${status === 'paid' ? 'text-utility-success-700' : 'text-primary'}`}>
                                {formatCurrency(total)}
                            </p>
                        </div>
                        {status === 'unpaid' && (
                            <Button color="primary" size="lg" className="w-full mt-4" onClick={handlePay}>
                                Pay
                            </Button>
                        )}
                        {status === 'paid' && (
                            <div className="flex items-center gap-2 mt-4 text-utility-success-600">
                                <Check className="size-5" />
                                <span className="font-medium">Paid</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
