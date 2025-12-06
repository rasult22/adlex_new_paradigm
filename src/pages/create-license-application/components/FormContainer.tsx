import { ArrowLeft, ArrowRight, Check, ChevronRight, HomeLine } from '@untitledui/icons';
import { Button } from '@/components/base/buttons/button';
import { AnimatePresence, motion } from 'motion/react';
import type { FormStep, FormData, FormHandlers } from './types';
import { StepContactEmail } from './steps/StepContactEmail';
import { StepBusinessActivities } from './steps/StepBusinessActivities';
import { StepCompanyNames } from './steps/StepCompanyNames';
import { StepVisaPackages } from './steps/StepVisaPackages';
import { StepShareholdersInfo } from './steps/StepShareholdersInfo';
import { StepShareholderDetails } from './steps/StepShareholderDetails';
import { StepPayment } from './steps/StepPayment';
import { StepKYC } from './steps/StepKYC';
import { StepPassportReview } from './steps/StepPassportReview';
import { ButtonUtility } from '@/components/base/buttons/button-utility';
import { useNavigate } from 'react-router';

interface FormContainerProps {
    currentStep: FormStep;
    formData: FormData;
    handlers: FormHandlers;
    onNext: () => void;
    onPrevious: () => void;
    canGoNext: boolean;
    canGoPrevious: boolean;
    isLastStep: boolean;
    isLoading?: boolean;
    error?: string | null;
    onDismissError?: () => void;
    onCompanyNamesValidationChange?: (isValid: boolean) => void;
}

const STEPS: { id: FormStep; title: string; number: number }[] = [
    { id: 'contact-email', title: 'Contact', number: 1 },
    { id: 'business-activities', title: 'Activities', number: 2 },
    { id: 'company-names', title: 'Company Names', number: 3 },
    { id: 'visa-packages', title: 'Visas', number: 4 },
    { id: 'shareholders-info', title: 'Shareholders', number: 5 },
    { id: 'shareholder-details', title: 'Details', number: 6 },
    { id: 'passport-review', title: 'Passport Review', number: 7 },
    { id: 'payment', title: 'Payment', number: 8 },
    { id: 'kyc', title: 'KYC', number: 9 },
];

export const FormContainer = ({
    currentStep,
    formData,
    handlers,
    onNext,
    onPrevious,
    canGoNext,
    canGoPrevious,
    isLastStep,
    isLoading = false,
    error = null,
    onDismissError,
    onCompanyNamesValidationChange,
}: FormContainerProps) => {
    const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);
    const currentStepInfo = STEPS[currentStepIndex];
    const navigate = useNavigate();

    const renderStep = () => {
        switch (currentStep) {
            case 'contact-email':
                return (
                    <StepContactEmail
                        value={formData.contact_email || ''}
                        onChange={handlers.onContactEmailChange}
                    />
                );

            case 'business-activities':
                return (
                    <StepBusinessActivities
                        selectedActivities={formData.business_activities || []}
                        onActivitiesChange={handlers.onBusinessActivitiesChange}
                    />
                );

            case 'company-names':
                return (
                    <StepCompanyNames
                        application_id={formData.application_id || ''}
                        names={[
                            formData.company_name_1 || '',
                            formData.company_name_2 || '',
                            formData.company_name_3 || ''
                        ]}
                        onChange={handlers.onCompanyNameChange}
                        onValidationChange={onCompanyNamesValidationChange}
                    />
                );

            case 'visa-packages':
                return (
                    <StepVisaPackages
                        value={formData.visa_package_quantity || 0}
                        onChange={handlers.onVisaPackageQuantityChange}
                    />
                );

            case 'shareholders-info':
                return (
                    <StepShareholdersInfo
                        numberOfShareholders={formData.number_of_shareholders || 0}
                        totalShares={formData.total_shares || 0}
                        onNumberOfShareholdersChange={(numShareholders) => {
                            handlers.onShareholdersInfoChange(
                                numShareholders,
                                formData.total_shares || 0
                            );
                        }}
                        onTotalSharesChange={(totalShares) => {
                            handlers.onShareholdersInfoChange(
                                formData.number_of_shareholders || 0,
                                totalShares
                            );
                        }}
                    />
                );

            case 'shareholder-details':
                return (
                    <StepShareholderDetails
                        shareholders={formData.shareholders || []}
                        totalShares={formData.total_shares || 0}
                        onShareholderChange={handlers.onShareholderDetailsChange}
                    />
                );

            case 'passport-review':
                return (
                    <StepPassportReview
                        shareholders={formData.shareholders || []}
                        applicationId={formData.application_id || ''}
                        onShareholderChange={handlers.onPassportReviewChange}
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
        <div className="flex flex-col h-full relative overflow-hidden">
            {/* Loading Overlay */}
            {isLoading && (
                <div className="absolute inset-0 bg-primary/50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="text-primary font-medium">Saving...</div>
                </div>
            )}
            
            {/* Error Banner */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="absolute top-0 left-0 right-0 z-40 bg-error-primary text-white px-6 py-3 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">{error}</span>
                        </div>
                        {onDismissError && (
                            <button
                                onClick={onDismissError}
                                className="text-white hover:text-white/80 transition-colors"
                                aria-label="Dismiss error"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className='px-6 pt-6'>
                {/* breadcrumbs */}
                <div className='flex items-center gap-2'>
                    <ButtonUtility onClick={() => navigate('/',{ replace: true })} color='tertiary' icon={HomeLine} />
                    <ChevronRight size={16} className='text-fg-quaternary'/>
                    <Button onClick={() => navigate('/',{ replace: true })} color='tertiary'>
                        <span className='font-semibold'>
                            Applications
                        </span>
                    </Button>
                    <ChevronRight size={16} className='text-fg-quaternary'/>
                    <Button color='tertiary'>
                        <span className='font-semibold text-text-tertiary_hover'>
                            Submit an application
                        </span>
                    </Button>
                </div>
                <div className='flex justify-between mt-4'>
                    <div className='text-[24px] leading-[32px] font-semibold'>New membership application for IFZA</div>
                    <Button color='secondary'>Save and exit</Button>
                </div>
            </div>


            {/* Progress Indicator */}
            <div className="border-b border-border-primary p-6">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <p className="font-semibold text-text-brand-secondary mb-2">Step {currentStepInfo.number} of {STEPS.length}</p>
                        <h1 className="text-xl font-semibold text-text-brand-secondary">{currentStepInfo.title}</h1>
                    </div>
                </div>
                
                {/* Progress Bar */}
                <div className="flex gap-1">
                    {STEPS.map((step, index) => (
                        <div
                            key={step.id}
                            className={`h-[4px] flex-1 rounded-full transition-colors ${
                                index <= currentStepIndex
                                    ? 'bg-brand-solid'
                                    : 'bg-secondary'
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <div className="flex-1 overflow-y-auto p-6 relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="h-full flex flex-col"
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
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
