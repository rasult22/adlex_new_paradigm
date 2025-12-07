import { Input } from '@/components/base/input/input';
import * as Alerts from "@/components/application/alerts/alerts";

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
                    className="max-w-[400px]"
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
                    className="max-w-[400px]"
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
                <Input
                    className="max-w-[400px]"
                    label="Share value"
                    type="number"
                    placeholder="0 AED"
                    isRequired
                    hint="Please note the minimum share value per share is AED 10"
                    size="md"
                />
                <div className='max-w-[880px]'>
                    <Alerts.AlertFloating
                        color="default"
                        title="Note:"
                        description={<>
                            <ul className='list-disc list-inside text-wrap max-w-[800px]'>
                                <li>
                                    Maximum Share Capital without paid share capital letter is AED 150,000, Any amount above AED 150,000 will need a Share Capital letter from the bank.
                                </li>
                                <li>
                                    Recommended Share capital per shareholder is AED 48,000/- for any IFZA company if you intend to apply for Partner or investor visa.
                                </li>
                                <li>
                                    Up to 10 shareholders are allowed for the application. If you are looking to have more than 10 shareholders, please get in touch with your Client Engagement Manager​
                                </li>
                            </ul>
                        </>}
                        confirmLabel="View changes"
                    />
                </div>
            </div>
        </div>
    );
};
