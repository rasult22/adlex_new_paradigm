import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { useCopilotAction } from '@copilotkit/react-core';

interface StepCompanyNamesProps {
    names: [string, string, string];
    onChange: (index: 0 | 1 | 2, value: string) => void;
    errors?: [string?, string?, string?];
}

export const StepCompanyNames = ({ names, onChange, errors = [] }: StepCompanyNamesProps) => {

    useCopilotAction({
        name: 'suggestCompanyNames',
        parameters: [
            {
                name: "name1",
                type: "string",
                description: "Suggest company name 1",
                required: true,
            },
            {
                name: "name2",
                type: "string",
                description: "Suggest company name 2",
                required: true,
            },
            {
                name: "name3",
                type: "string",
                description: "Suggest company name 3",
                required: true,
            },
        ],
        handler: ({ name1, name2, name3 }) => {
            return {
                name1,
                name2,
                name3,
            }
        },
        render: ({ args, status }) => {
            if (status === "inProgress") {
                return (
                    <div className="flex items-center gap-2 text-sm text-tertiary py-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                        <span>Generating name suggestions...</span>
                    </div>
                );
            }
            if (status === "complete") {
                const suggestions = [
                    { name: args.name1, index: 0 as const },
                    { name: args.name2, index: 1 as const },
                    { name: args.name3, index: 2 as const },
                ];
    
                return (
                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-sm font-medium text-gray-700 mb-2">
                            💡 AI Suggestions - Click to apply
                        </div>
                        {suggestions.map(({ name, index }) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200 hover:border-primary transition-colors"
                            >
                                <div className="text-base font-medium text-text-primary">{name}</div>
                                <Button onClick={() => onChange(index, name)}>
                                    Apply
                                </Button>
                            </div>
                        ))}
                    </div>
                );
            }
            return '';
        },

    })
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
                    onChange={(value) => {
                        onChange(0, value);
                    }}
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
