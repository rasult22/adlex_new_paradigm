import { Input } from '@/components/base/input/input';

interface StepCompanyNamesProps {
    names: [string, string, string];
    onChange: (index: 0 | 1 | 2, value: string) => void;
    errors?: [string?, string?, string?];
}

export const StepCompanyNames = ({ names, onChange, errors = [] }: StepCompanyNamesProps) => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-primary mb-2">Company Name Options</h2>
                <p className="text-md text-tertiary">
                    Please provide 3 different name options for your company. We'll check availability and help you choose the best one.
                </p>
            </div>

            <div className="space-y-4">
                <Input
                    label="First Choice"
                    value={names[0]}
                    onChange={(value) => onChange(0, value)}
                    placeholder="Enter your first company name choice"
                    isRequired
                    isInvalid={!!errors[0]}
                    hint={errors[0]}
                    size="md"
                />

                <Input
                    label="Second Choice"
                    value={names[1]}
                    onChange={(value) => onChange(1, value)}
                    placeholder="Enter your second company name choice"
                    isRequired
                    isInvalid={!!errors[1]}
                    hint={errors[1]}
                    size="md"
                />

                <Input
                    label="Third Choice"
                    value={names[2]}
                    onChange={(value) => onChange(2, value)}
                    placeholder="Enter your third company name choice"
                    isRequired
                    isInvalid={!!errors[2]}
                    hint={errors[2]}
                    size="md"
                />
            </div>
        </div>
    );
};
