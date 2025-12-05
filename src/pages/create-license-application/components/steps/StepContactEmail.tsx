import { Input } from '@/components/base/input/input';
import { Mail01 } from '@untitledui/icons';

interface StepContactEmailProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export const StepContactEmail = ({ value, onChange, error }: StepContactEmailProps) => {
    return (
        <div className="space-y-6 flex flex-col flex-1">
            <div>
                <h2 className="text-2xl font-semibold text-primary mb-2">Contact Information</h2>
                <p className="text-md text-tertiary">
                    Please provide your email address for communication regarding your company formation.
                </p>
            </div>
            <div className='flex flex-1 flex-col justify-center items-center'>
                <Input
                    className="max-w-[296px]"
                    label="Email Address"
                    type="email"
                    icon={Mail01}
                    value={value}
                    onChange={(value) => onChange(value)}
                    placeholder="your.email@example.com"
                    isRequired
                    isInvalid={!!error}
                    tooltip="Please enter a valid email address"
                    hint={error}
                    size="md"
                />
            </div>
        </div>
    );
};
