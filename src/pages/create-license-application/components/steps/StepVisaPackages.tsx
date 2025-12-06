import { Input } from '@/components/base/input/input';
import * as Alerts from "@/components/application/alerts/alerts";

interface StepVisaPackagesProps {
    value: number;
    onChange: (value: number) => void;
    error?: string;
}

export const StepVisaPackages = ({ value, onChange, error }: StepVisaPackagesProps) => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-primary mb-2">Visa Packages</h2>
                <p className="text-md text-tertiary max-w-[600px]">
                    How many visa packages do you need for your company? This will determine how many employees you can sponsor.
                </p>
                <div className='bg-gradient-to-l from-[#FCB69F] to-[#FFECD2] p-4 rounded-[16px] flex gap-4 justify-center mt-6'>
                    <div className='max-w-[450px] wrap-normal'>
                        <div className='text-text-warning-primary font-semibold'>50% off visas</div>
                        <div className='text-[14px] leading-[20px] text-text-tertiary mt-[6px]'>If your team has two or more people, you can get a discount on the second and subsequent visas.</div>
                    </div>
                    <img width={110} src="/discount.png" alt="" />
                </div>
            </div>

            <Input
                label="Number of Visa Packages"
                type="number"
                className="max-w-[400px]"
                value={value.toString()}
                onChange={(value) => onChange(parseInt(value) || 0)}
                placeholder="0"
                isRequired
                isInvalid={!!error}
                hint={error || 'Enter the number of visa packages you need'}
                size="md"
            />

            <Alerts.AlertFloating
                color="default"
                title="Note:"
                description="Each visa package allows you to sponsor one employee. You can always add more visas later as your business grows."
                confirmLabel="View changes"
            />
        </div>
    );
};
