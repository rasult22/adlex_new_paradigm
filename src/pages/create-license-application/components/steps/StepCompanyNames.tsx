import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { useCopilotAction } from '@copilotkit/react-core';
import { validateCompanyName, type CompanyNameValidationResult } from '@/queries';
import { Loading01 } from '@untitledui/icons';

interface ValidationState {
    isLoading: boolean;
    result: CompanyNameValidationResult | null;
    error: string | null;
}

interface StepCompanyNamesProps {
    names: [string, string, string];
    onChange: (index: 0 | 1 | 2, value: string) => void;
    errors?: [string?, string?, string?];
    onValidationChange?: (canProceed: boolean) => void;
}

export const StepCompanyNames = ({ names, onChange, errors = [], onValidationChange }: StepCompanyNamesProps) => {
    const [validationStates, setValidationStates] = useState<[ValidationState, ValidationState, ValidationState]>([
        { isLoading: false, result: null, error: null },
        { isLoading: false, result: null, error: null },
        { isLoading: false, result: null, error: null },
    ]);

    // Notify parent about validation state changes
    useEffect(() => {
        const hasAnyLoading = validationStates.some(state => state.isLoading);
        const hasAnyInvalid = validationStates.some(state => state.result && !state.result.is_valid);
        const allNamesFilled = names.every(name => name.trim().length > 0);

        const canProceed = allNamesFilled && !hasAnyLoading && !hasAnyInvalid;
        onValidationChange?.(canProceed);
    }, [validationStates, names, onValidationChange]);

    const handleValidate = useCallback(async (index: 0 | 1 | 2, value: string) => {
        // Don't validate empty or very short names
        if (!value || value.trim().length < 2) {
            setValidationStates(prev => {
                const newStates = [...prev] as [ValidationState, ValidationState, ValidationState];
                newStates[index] = { isLoading: false, result: null, error: null };
                return newStates;
            });
            return;
        }

        // Set loading state
        setValidationStates(prev => {
            const newStates = [...prev] as [ValidationState, ValidationState, ValidationState];
            newStates[index] = { isLoading: true, result: null, error: null };
            return newStates;
        });

        try {
            const result = await validateCompanyName(value.trim());
            setValidationStates(prev => {
                const newStates = [...prev] as [ValidationState, ValidationState, ValidationState];
                newStates[index] = { isLoading: false, result, error: null };
                return newStates;
            });
        } catch (err) {
            setValidationStates(prev => {
                const newStates = [...prev] as [ValidationState, ValidationState, ValidationState];
                newStates[index] = { isLoading: false, result: null, error: 'Failed to validate name' };
                return newStates;
            });
        }
    }, []);

    const handleBlur = useCallback((index: 0 | 1 | 2) => {
        handleValidate(index, names[index]);
    }, [names, handleValidate]);

    const handleChange = useCallback((index: 0 | 1 | 2, value: string) => {
        onChange(index, value);
        // Reset validation state when user types
        setValidationStates(prev => {
            const newStates = [...prev] as [ValidationState, ValidationState, ValidationState];
            newStates[index] = { isLoading: false, result: null, error: null };
            return newStates;
        });
    }, [onChange]);

    const renderValidationStatus = (index: 0 | 1 | 2) => {
        const state = validationStates[index];
        
        if (state.isLoading) {
            return (
                <div className="flex items-center gap-2 text-sm text-tertiary mt-1">
                    <Loading01 className='animate-spin h-4 w-4 text-bg-brand-section_subtle'/>
                    <span>Checking name</span>
                </div>
            );
        }

        if (state.result) {
            if (state.result.is_valid) {
                return (
                    <div className="flex items-center gap-2 text-sm text-text-tertiary mt-1">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z" fill="#EAF3FF"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M17.0965 7.39004L9.9365 14.3L8.0365 12.27C7.6865 11.94 7.1365 11.92 6.7365 12.2C6.3465 12.49 6.2365 13 6.4765 13.41L8.7265 17.07C8.9465 17.41 9.3265 17.62 9.7565 17.62C10.1665 17.62 10.5565 17.41 10.7765 17.07C11.1365 16.6 18.0065 8.41004 18.0065 8.41004C18.9065 7.49004 17.8165 6.68004 17.0965 7.38004V7.39004Z" fill="#084BBF"/>
                        </svg>
                        <span>The check was successful.</span>
                    </div>
                );
            } else {
                return (
                    <div className="flex items-center gap-2 text-sm text-error-primary mt-1">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z" fill="#FEE4E2"/>
                            <path d="M17.3486 7.3678L7.34863 17.3678M7.34863 7.3678L17.3486 17.3678" stroke="#F04438" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>

                        <span>The name is not suitable.</span>
                    </div>
                );
            }
        }

        return null;
    };

    const getInputError = (index: 0 | 1 | 2) => {
        const state = validationStates[index];
        if (state.result && !state.result.is_valid) {
            // Combine issues into error message
            return state.result.issues.join(' ') || state.result.reasoning;
        }
        return errors[index];
    };

    const isInputInvalid = (index: 0 | 1 | 2): boolean => {
        const state = validationStates[index];
        return !!errors[index] || !!(state.result && !state.result.is_valid);
    };

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
                                <Button onClick={() => handleChange(index, name)}>
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
                <div className='flex items-start gap-3'>
                    <Input
                        className="w-[50%]"
                        label="1. First name *"
                        value={names[0]}
                        onChange={(value) => handleChange(0, value)}
                        onBlur={() => handleBlur(0)}
                        placeholder="Enter your first company name choice"
                        isRequired
                        isInvalid={isInputInvalid(0)}
                        hint={getInputError(0)}
                        size="md"
                    />
                    <div className='mt-8'>
                        {renderValidationStatus(0)}
                    </div>
                </div>

                <div className='flex items-start gap-3'>
                    <Input
                        className="w-[50%]"
                        label="2. Second name *"
                        value={names[1]}
                        onChange={(value) => handleChange(1, value)}
                        onBlur={() => handleBlur(1)}
                        placeholder="Enter your second company name choice"
                        isRequired
                        isInvalid={isInputInvalid(1)}
                        hint={getInputError(1)}
                        size="md"
                    />
                    <div className='mt-8'>
                        {renderValidationStatus(1)}
                    </div>
                </div>

                <div className='flex items-start gap-3'>
                    <Input
                        className="w-[50%]"
                        label="3. Third name *"
                        value={names[2]}
                        onChange={(value) => handleChange(2, value)}
                        onBlur={() => handleBlur(2)}
                        placeholder="Enter your third company name choice"
                        isRequired
                        isInvalid={isInputInvalid(2)}
                        hint={getInputError(2)}
                        size="md"
                    />
                    <div className='mt-8'>
                        {renderValidationStatus(2)}
                    </div>
                </div>
            </div>
        </div>
    );
};

