import { ArrowLeft, ArrowRight, Check } from '@untitledui/icons';
import { Button } from '@/components/base/buttons/button';
import type { FormStep } from './types';
import { StepContactEmail } from './steps/StepContactEmail';
import { StepBusinessActivities } from './steps/StepBusinessActivities';
import { StepCompanyNames } from './steps/StepCompanyNames';
import { StepVisaPackages } from './steps/StepVisaPackages';
import { StepShareholdersInfo } from './steps/StepShareholdersInfo';
import { StepShareholderDetails } from './steps/StepShareholderDetails';
import { StepPayment } from './steps/StepPayment';
import { StepKYC } from './steps/StepKYC';

interface FormContainerProps {
    currentStep: FormStep;
    formData: any;
    onFormDataChange: (data: any) => void;
    onNext: () => void;
    onPrevious: () => void;
    canGoNext: boolean;
    canGoPrevious: boolean;
    isLastStep: boolean;
    isLoading?: boolean;
}

const STEPS: { id: FormStep; title: string; number: number }[] = [
    { id: 'contact-email', title: 'Contact', number: 1 },
    { id: 'business-activities', title: 'Activities', number: 2 },
    { id: 'company-names', title: 'Company Names', number: 3 },
    { id: 'visa-packages', title: 'Visas', number: 4 },
    { id: 'shareholders-info', title: 'Shareholders', number: 5 },
    { id: 'shareholder-details', title: 'Details', number: 6 },
    { id: 'payment', title: 'Payment', number: 7 },
    { id: 'kyc', title: 'KYC', number: 8 },
];

export const FormContainer = ({
    currentStep,
    formData,
    onFormDataChange,
    onNext,
    onPrevious,
    canGoNext,
    canGoPrevious,
    isLastStep,
    isLoading = false,
}: FormContainerProps) => {
    const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);
    const currentStepInfo = STEPS[currentStepIndex];

    const renderStep = () => {
        switch (currentStep) {
            case 'contact-email':
                return (
                    <StepContactEmail
                        value={formData.contact_email || ''}
                        onChange={(value) => onFormDataChange({ ...formData, contact_email: value })}
                    />
                );
            
            case 'business-activities':
                return (
                    <StepBusinessActivities
                        selectedActivities={formData.business_activities || []}
                        onActivitiesChange={(activities) => 
                            onFormDataChange({ ...formData, business_activities: activities })
                        }
                    />
                );
            
            case 'company-names':
                return (
                    <StepCompanyNames
                        names={[
                            formData.company_name_1 || '',
                            formData.company_name_2 || '',
                            formData.company_name_3 || ''
                        ]}
                        onChange={(index, value) => {
                            if (index === 0) onFormDataChange({ ...formData, company_name_1: value });
                            if (index === 1) onFormDataChange({ ...formData, company_name_2: value });
                            if (index === 2) onFormDataChange({ ...formData, company_name_3: value });
                        }}
                    />
                );
            
            case 'visa-packages':
                return (
                    <StepVisaPackages
                        value={formData.visa_package_quantity || 0}
                        onChange={(value) => onFormDataChange({ ...formData, visa_package_quantity: value })}
                    />
                );
            
            case 'shareholders-info':
                return (
                    <StepShareholdersInfo
                        numberOfShareholders={formData.number_of_shareholders || 0}
                        totalShares={formData.total_shares || 0}
                        onNumberOfShareholdersChange={(value) => {
                            const shareholders = Array(value).fill(null).map((_, i) => 
                                formData.shareholders?.[i] || {
                                    email: '',
                                    phone: '',
                                    number_of_shares: 0,
                                    roles: ['Shareholder'],
                                    residential_address: '',
                                    is_uae_resident: false,
                                    is_pep: false,
                                }
                            );
                            onFormDataChange({ 
                                ...formData, 
                                number_of_shareholders: value,
                                shareholders 
                            });
                        }}
                        onTotalSharesChange={(value) => 
                            onFormDataChange({ ...formData, total_shares: value })
                        }
                    />
                );
            
            case 'shareholder-details':
                return (
                    <StepShareholderDetails
                        shareholders={formData.shareholders || []}
                        totalShares={formData.total_shares || 0}
                        onShareholderChange={(index, data) => {
                            const shareholders = [...(formData.shareholders || [])];
                            shareholders[index] = { ...shareholders[index], ...data };
                            onFormDataChange({ ...formData, shareholders });
                        }}
                    />
                );
            
            case 'payment':
                return <StepPayment />;
            
            case 'kyc':
                return <StepKYC />;
            
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col h-full relative">
            {/* Loading Overlay */}
            {isLoading && (
                <div className="absolute inset-0 bg-primary/50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="text-primary font-medium">Saving...</div>
                </div>
            )}
            {/* Progress Indicator */}
            <div className="border-b border-border-primary p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-sm text-tertiary">Step {currentStepInfo.number} of {STEPS.length}</p>
                        <h1 className="text-xl font-semibold text-primary">{currentStepInfo.title}</h1>
                    </div>
                </div>
                
                {/* Progress Bar */}
                <div className="flex gap-1">
                    {STEPS.map((step, index) => (
                        <div
                            key={step.id}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                                index <= currentStepIndex
                                    ? 'bg-brand-solid'
                                    : 'bg-secondary'
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {renderStep()}
            </div>

            {/* Navigation */}
            <div className="border-t border-border-primary p-6">
                <div className="flex justify-between">
                    <Button
                        size="lg"
                        color="secondary"
                        iconLeading={ArrowLeft}
                        onClick={onPrevious}
                        isDisabled={!canGoPrevious}
                    >
                        Previous
                    </Button>
                    
                    <Button
                        size="lg"
                        iconTrailing={isLastStep ? Check : ArrowRight}
                        onClick={onNext}
                        isDisabled={!canGoNext}
                    >
                        {isLastStep ? 'Submit' : 'Next'}
                    </Button>
                </div>
            </div>
        </div>
    );
};
