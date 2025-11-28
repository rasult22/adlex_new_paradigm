import { Input } from '@/components/base/input/input';

interface StepShareholdersInfoProps {
    numberOfShareholders: number;
    totalShares: number;
    onNumberOfShareholdersChange: (value: number) => void;
    onTotalSharesChange: (value: number) => void;
    errors?: {
        numberOfShareholders?: string;
        totalShares?: string;
    };
}

export const StepShareholdersInfo = ({
    numberOfShareholders,
    totalShares,
    onNumberOfShareholdersChange,
    onTotalSharesChange,
    errors = {},
}: StepShareholdersInfoProps) => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-primary mb-2">Shareholders Information</h2>
                <p className="text-md text-tertiary">
                    Provide information about the company's ownership structure.
                </p>
            </div>

            <div className="space-y-4">
                <Input
                    label="Number of Shareholders"
                    type="number"
                    value={numberOfShareholders.toString()}
                    onChange={(value) => onNumberOfShareholdersChange(parseInt(value) || 0)}
                    placeholder="0"
                    isRequired
                    isInvalid={!!errors.numberOfShareholders}
                    hint={errors.numberOfShareholders || 'How many shareholders will the company have?'}
                    size="md"
                />

                <Input
                    label="Total Number of Shares"
                    type="number"
                    value={totalShares.toString()}
                    onChange={(value) => onTotalSharesChange(parseInt(value) || 0)}
                    placeholder="0"
                    isRequired
                    isInvalid={!!errors.totalShares}
                    hint={errors.totalShares || 'Total shares to be distributed among shareholders'}
                    size="md"
                />
            </div>

            <div className="p-4 rounded-lg bg-secondary ring-1 ring-border-primary">
                <p className="text-sm text-tertiary">
                    <strong className="text-primary">Next Step:</strong> You'll provide detailed information for each of the {numberOfShareholders || 0} shareholder(s).
                </p>
            </div>
        </div>
    );
};
