import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';
import { AIChat } from './components/AIChat';
import { FormContainer } from './components/FormContainer';
import type { FormData, FormStep } from './components/types';
import { 
    createLicenseApplication, 
    updateLicenseApplication,
    uploadPassport,
    updateShareholderPassport,
    type LicenseApplicationInput 
} from '@/queries';
import { useCopilotFormState } from '@/hooks/use-copilot-form-state';
import { useCopilotAction, useCopilotChatHeadless_c } from '@copilotkit/react-core';
import { Badge } from '@/components/base/badges/badges';

const STEP_ORDER: FormStep[] = [
    'contact-email',
    'business-activities',
    'company-names',
    'visa-packages',
    'shareholders-info',
    'shareholder-details',
    'passport-review',
    'payment',
    'kyc',
];

// Generate a unique session ID
const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

export const HomeScreen = () => {
    // Layout state
    const [isFormVisible, setIsFormVisible] = useState(false);

    // Form state
    const [currentStep, setCurrentStep] = useState<FormStep>('contact-email');
    const [formData, setFormData] = useState<Partial<FormData>>({
        contact_email: '',
        business_activities: [],
        company_name_1: '',
        company_name_2: '',
        company_name_3: '',
        visa_package_quantity: 0,
        number_of_shareholders: 0,
        total_shares: 0,
        shareholders: [],
    });
    const [saveError, setSaveError] = useState<string | null>(null);
    const {sendMessage} = useCopilotChatHeadless_c()
    // Action для отображения переходов между этапами
    useCopilotAction({
        name: "show_step_transition",
        description: "Display step transition badge with step name",

        parameters: [
        { name: "stepKey", type: "string" },
        { name: "stepName", type: "string" }
        ],
        // Generative UI - рендерится в чате!
        render: ({ args }) => (
        <div id={args.stepKey} className="flex w-full justify-center">
            <Badge color="brand">
                <h3>{args.stepName}</h3>
            </Badge>
        </div>
        ),
        // Handler просто возвращает подтверждение
        handler: async ({ stepName }) => {
        return `Displayed transition to step ${stepName}`;
        }
    });
    useEffect(() => {
        sendMessage({
            id: `${new Date().getTime()}`,
            content: 'run show_step_transition copilot action',
            role: 'system',
        })
    }, [currentStep])

    // Sync form state with CopilotKit
    useCopilotFormState(formData, currentStep);

    // Mutation for creating license application
    const createApplicationMutation = useMutation({
        mutationFn: createLicenseApplication,
        onSuccess: (data) => {
            setFormData(prev => ({
                ...prev,
                application_id: data.id,
                session_id: data.session_id,
            }));
            setSaveError(null);
        },
        onError: (error: Error) => {
            console.error('Failed to create license application:', error);
            setSaveError('Failed to create application. Please try again.');
        },
    });

    // Mutation for updating license application
    const updateApplicationMutation = useMutation({
        mutationFn: ({ applicationId, data }: { applicationId: string; data: LicenseApplicationInput }) =>
            updateLicenseApplication(applicationId, data),
        onSuccess: () => {
            setSaveError(null);
        },
        onError: (error: Error) => {
            console.error('Failed to update license application:', error);
            setSaveError('Failed to save your changes. Please try again.');
        },
    });

    // Chat handlers
    const handleStart = () => {
        setIsFormVisible(true);
        
        // Generate session ID and create license application
        const sessionId = generateSessionId();
        createApplicationMutation.mutate(sessionId);
    };

    // Form navigation handlers
    const handleNext = async () => {
        const currentIndex = STEP_ORDER.indexOf(currentStep);
        
        // Save current step data to backend before moving to next step
        if (formData.application_id) {
            const updateData: LicenseApplicationInput = {};
            
            // Map form data to API format based on current step
            switch (currentStep) {
                case 'business-activities':
                    updateData.business_activities = formData.business_activities;
                    break;
                case 'company-names':
                    updateData.company_name_1 = formData.company_name_1;
                    updateData.company_name_2 = formData.company_name_2;
                    updateData.company_name_3 = formData.company_name_3;
                    break;
                case 'visa-packages':
                    updateData.visa_package_quantity = formData.visa_package_quantity;
                    break;
                case 'shareholders-info':
                    updateData.number_of_shareholders = formData.number_of_shareholders;
                    updateData.total_shares = formData.total_shares;
                    break;
                case 'shareholder-details':
                    // Convert ShareholderData to ShareholderInput (remove passport_scan)
                    updateData.shareholders = formData.shareholders?.map(sh => ({
                        email: sh.email,
                        phone: sh.phone,
                        number_of_shares: sh.number_of_shares,
                        roles: sh.roles,
                        residential_address: sh.residential_address,
                        is_uae_resident: sh.is_uae_resident,
                        is_pep: sh.is_pep,
                    }));
                    break;
            }
            
            // Update if there's data to save
            if (Object.keys(updateData).length > 0) {
                try {
                    // Wait for the mutation to complete
                    const response = await updateApplicationMutation.mutateAsync({
                        applicationId: formData.application_id,
                        data: updateData,
                    });

                    // If we are on shareholder details step, handle passport uploads
                    if (currentStep === 'shareholder-details' && formData.shareholders) {
                        // Persist backend ids into local shareholders for later steps
                        const withIds = (formData.shareholders || []).map((sh) => {
                            const savedShareholder = response.shareholders.find(
                                s => s.email === sh.email
                            );
                            return { ...sh, backend_id: savedShareholder?.id };
                        });
                        setFormData(prev => ({ ...prev, shareholders: withIds }));

                        const uploadPromises = withIds.map(async (sh) => {
                            if (!sh.passport_scan || !sh.backend_id) return;

                            await uploadPassport(
                                formData.application_id!,
                                sh.backend_id,
                                sh.passport_scan
                            );
                        });

                        await Promise.all(uploadPromises);
                    }

                    // Clear error on success
                    setSaveError(null);
                } catch (error) {
                    console.error('Failed to save/upload:', error);
                    // If it's an upload error (update succeeded but upload failed), set error message
                    // If it's an update error, mutation.onError already set it, but we can ensure it's set
                    setSaveError(prev => prev || 'Failed to save changes or upload files. Please try again.');
                    return;
                }
            }
        }
        
        // After shareholder-details proceed to passport-review
        if (currentStep === 'shareholder-details') {
            setCurrentStep('passport-review');
            return;
        }

        // On passport-review, PATCH confirmed passport details then continue
        if (currentStep === 'passport-review') {
            try {
                const shareholders = formData.shareholders || [];
                const confirmPromises = shareholders.map(async (sh) => {
                    if (!sh.is_passport_confirmed || !sh.backend_id) return;
                    const payload = {
                        passport_number: sh.extracted_passport?.passport_number,
                        full_name: sh.extracted_passport?.full_name || [
                            sh.extracted_passport?.first_name,
                            sh.extracted_passport?.middle_name,
                            sh.extracted_passport?.last_name,
                        ].filter(Boolean).join(' ').trim() || undefined,
                        first_name: sh.extracted_passport?.first_name,
                        middle_name: sh.extracted_passport?.middle_name,
                        last_name: sh.extracted_passport?.last_name,
                        date_of_birth: sh.extracted_passport?.date_of_birth,
                        nationality: sh.extracted_passport?.nationality,
                        issue_date: sh.extracted_passport?.issue_date,
                        expiry_date: sh.extracted_passport?.expiry_date,
                    };
                    await updateShareholderPassport(formData.application_id!, sh.backend_id, payload);
                });
                await Promise.all(confirmPromises);
                setSaveError(null);
            } catch (error) {
                console.error('Failed to update passport details:', error);
                setSaveError('Failed to save passport details. Please try again.');
                return;
            }
        }

        if (currentIndex < STEP_ORDER.length - 1) {
            setCurrentStep(STEP_ORDER[currentIndex + 1]);
        } else {
            // Submit form
            console.log('Form submitted:', formData);
            // TODO: Handle form submission
        }
    };

    const handlePrevious = () => {
        const currentIndex = STEP_ORDER.indexOf(currentStep);
        if (currentIndex > 0) {
            setCurrentStep(STEP_ORDER[currentIndex - 1]);
        }
    };

    const canGoNext = () => {
        // Basic validation - can be enhanced
        switch (currentStep) {
            case 'contact-email':
                return !!formData.contact_email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email);
            case 'business-activities':
                return (formData.business_activities?.length || 0) >= 1 && (formData.business_activities?.length || 0) <= 3;
            case 'company-names':
                return !!(formData.company_name_1?.trim() && formData.company_name_2?.trim() && formData.company_name_3?.trim());
            case 'visa-packages':
                return (formData.visa_package_quantity || 0) > 0;
            case 'shareholders-info':
                return (formData.number_of_shareholders || 0) > 0 && (formData.total_shares || 0) > 0;
            case 'shareholder-details':
                // Check if all shareholders have required data
                const shareholders = formData.shareholders || [];
                if (shareholders.length !== formData.number_of_shareholders) return false;
                return shareholders.every(sh => 
                    sh.email && 
                    sh.phone && 
                    sh.number_of_shares > 0 && 
                    sh.roles && 
                    sh.residential_address &&
                    sh.is_uae_resident !== undefined &&
                    sh.is_pep !== undefined &&
                    sh.passport_scan // Require passport scan
                );
            case 'passport-review':
                // All shareholders must have confirmed passport data
                return (formData.shareholders || []).every(sh => sh.is_passport_confirmed);
            default:
                return true;
        }
    };

    const canGoPrevious = () => {
        return STEP_ORDER.indexOf(currentStep) > 0;
    };

    const isLastStep = () => {
        return currentStep === STEP_ORDER[STEP_ORDER.length - 1];
    };

    const isLoading = createApplicationMutation.isPending || updateApplicationMutation.isPending;

    return (
        <div className="flex h-dvh flex-row bg-primary">
            {/* Main Form Area */}
            <AnimatePresence mode="popLayout">
                {isFormVisible && (
                    <motion.div
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        className="flex-1"
                    >
                        <FormContainer
                            currentStep={currentStep}
                            formData={formData}
                            onFormDataChange={setFormData}
                            onNext={handleNext}
                            onPrevious={handlePrevious}
                            canGoNext={canGoNext()}
                            canGoPrevious={canGoPrevious()}
                            isLastStep={isLastStep()}
                            isLoading={isLoading}
                            error={saveError}
                            onDismissError={() => setSaveError(null)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* AI Chat Sidebar */}
            <motion.div 
                layout
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className={`border-l border-border-primary ${isFormVisible ? '' : 'flex-1'}`}
            >
                <AIChat
                    onStart={handleStart}
                    showStartButton={!isFormVisible}
                />
            </motion.div>
        </div>
    );
};
