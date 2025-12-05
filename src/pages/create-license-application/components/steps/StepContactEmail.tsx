import { Input } from '@/components/base/input/input';

interface StepContactEmailProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export const StepContactEmail = ({ value, onChange, error }: StepContactEmailProps) => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-primary mb-2">Contact Information</h2>
                <p className="text-md text-tertiary">
                    Please provide your email address for communication regarding your company formation.
                </p>
            </div>

            <Input
                label="Email Address"
                type="email"
                value={value}
                onChange={(value) => onChange(value)}
                placeholder="your.email@example.com"
                isRequired
                isInvalid={!!error}
                hint={error}
                size="md"
            />
        </div>
    );
};
