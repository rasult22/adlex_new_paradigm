import { Input } from '@/components/base/input/input';

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
                <p className="text-md text-tertiary">
                    How many visa packages do you need for your company? This will determine how many employees you can sponsor.
                </p>
            </div>

            <Input
                label="Number of Visa Packages"
                type="number"
                value={value.toString()}
                onChange={(value) => onChange(parseInt(value) || 0)}
                placeholder="0"
                isRequired
                isInvalid={!!error}
                hint={error || 'Enter the number of visa packages you need'}
                size="md"
            />

            <div className="p-4 rounded-lg bg-secondary ring-1 ring-border-primary">
                <p className="text-sm text-tertiary">
                    <strong className="text-primary">Note:</strong> Each visa package allows you to sponsor one employee. 
                    You can always add more visas later as your business grows.
                </p>
            </div>
        </div>
    );
};
