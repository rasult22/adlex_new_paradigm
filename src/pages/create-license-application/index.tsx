import { useCopilotAction, useCopilotChatHeadless_c } from '@copilotkit/react-core';
import type { FormData, FormStep, FormHandlers, BusinessActivitySelection, ShareholderData, ShareholderRole } from './components/types';
import { useSearchParams, useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { AIChat, FormContainer } from './components';
import { BadgeWithIcon } from '@/components/base/badges/badges';
import { Dotpoints02 } from '@untitledui/icons';
import { useEffect, useState } from 'react';
import { useCopilotFormState } from '@/hooks/use-copilot-form-state';
import { useMutation } from '@tanstack/react-query';
import { 
    LicenseApplicationInput, 
    updateLicenseApplication, 
    updateShareholderPassport, 
    uploadPassport,
    useGetLicenseApplication,
    submitToIfza,
    type LicenseApplicationResponse,
} from '@/queries/license-application';
import { useStepsInfo } from '@/hooks/use-steps-info';

type BusinessActivityState = {
    activity_id: number
    activity_code: string
    name: string
    is_main: boolean
}
type ShareholderState = {
     id: string // UUID hex
    email: string
    phone: string
    number_of_shares: number
    roles: string[]
    residential_address?: string
    is_uae_resident: boolean
    is_pep: boolean
    passport_uploaded: boolean
    passport_document_id: boolean
    // Passport data if extracted
    first_name?: string 
    last_name?: string 
    nationality?: string 
    date_of_birth?: string 
}

export type AgentState = {
    // Identifiers
    application_id: string,
    // Business Activities (1-3)
    business_activities: BusinessActivityState[],
    // Company Names (3 options required)
    company_name_1: string,
    company_name_2: string,
    company_name_3: string,
    // Visa Package
    visa_package_quantity: number,
    // Shareholding Structure
    number_of_shareholders: number,
    total_shares: number,
    // Shareholders
    shareholders: ShareholderState[],
    // Progress tracking
    current_step: FormStep,
    completion_percentage: number,
    // Validation
    validation_errors: string[],
    is_ready_to_submit: boolean,
}

const STEP_ORDER: FormStep[] = [
    'contact-email',
    'business-activities',
    'company-names',
    'visa-packages',
    'shareholders-info',
    'shareholder-details',
    'passport-review',
    'data-processing',
    'payment',
    'kyc',
];

// Determine which step user should be on based on filled data
const determineCurrentStep = (data: LicenseApplicationResponse): FormStep => {
    // Check from the end to find the first completed step
    // Then return the next step (or the current if not complete)
    
    // If shareholders have passport data confirmed, go to payment
    if (data.shareholders?.length > 0 && data.shareholders.every(s => s.passport_data?.verified)) {
        return 'payment';
    }
    
    // If shareholders exist with passport uploaded, go to passport-review
    if (data.shareholders?.length > 0 && data.shareholders.every(s => s.passport_uploaded)) {
        return 'passport-review';
    }
    
    // If shareholders exist, go to shareholder-details or next
    if (data.shareholders?.length > 0 && data.number_of_shareholders) {
        // Check if all shareholders have required data
        const allShareholdersComplete = data.shareholders.every(s => 
            s.email && s.phone && s.number_of_shares > 0 && s.roles?.length > 0
        );
        if (allShareholdersComplete) {
            return 'passport-review';
        }
        return 'shareholder-details';
    }
    
    // If shareholding info exists, go to shareholder-details
    if (data.number_of_shareholders && data.total_shares) {
        return 'shareholder-details';
    }
    
    // If visa package exists (and is > 0), go to shareholders-info
    if (data.visa_package_quantity !== null && data.visa_package_quantity !== undefined && data.visa_package_quantity > 0) {
        return 'shareholders-info';
    }
    
    // If company names exist, go to visa-packages
    if (data.company_name_1 && data.company_name_2 && data.company_name_3) {
        return 'visa-packages';
    }
    
    // If business activities exist, go to company-names
    if (data.business_activities && data.business_activities.length > 0) {
        return 'company-names';
    }
    
    // Default to first step (contact-email) for new/empty applications
    return 'contact-email';
};

// Map API response to form data
const mapApiResponseToFormData = (data: LicenseApplicationResponse, session_id: string): Partial<FormData> => {
    return {
        application_id: data.id,
        session_id: session_id,
        contact_email: '', // Not stored in API
        business_activities: data.business_activities?.map(a => ({
            activity_id: a.activity_id,
            is_main: a.is_main,
            name: a.name,
        })) || [],
        company_name_1: data.company_name_1 || '',
        company_name_2: data.company_name_2 || '',
        company_name_3: data.company_name_3 || '',
        visa_package_quantity: data.visa_package_quantity || 0,
        number_of_shareholders: data.number_of_shareholders || 0,
        total_shares: data.total_shares || 0,
        shareholders: data.shareholders?.map(s => ({
            email: s.email,
            phone: s.phone,
            number_of_shares: s.number_of_shares,
            roles: s.roles as ShareholderRole[],
            residential_address: s.residential_address || '',
            is_uae_resident: s.is_uae_resident,
            is_pep: s.is_pep,
            backend_id: s.id,
            is_passport_confirmed: s.passport_data?.verified || false,
            extracted_passport: s.passport_data ? {
                passport_number: s.passport_data.passport_number,
                first_name: s.passport_data.first_name,
                last_name: s.passport_data.last_name,
                date_of_birth: s.passport_data.date_of_birth,
                nationality: s.passport_data.nationality,
                issue_date: s.passport_data.issue_date,
                expiry_date: s.passport_data.expiry_date,
            } : undefined,
        })) || [],
    };
};

export const CreateLicenseApplicationScreen = () => {
  const [searchParam] = useSearchParams()
  const navigate = useNavigate()
  const {sendMessage, reset} = useCopilotChatHeadless_c()
  const application_id: string = searchParam.get('application_id') as string;
  const session_id: string = searchParam.get('session_id') as string;
  const [currentStep, setCurrentStep] = useState<FormStep>('contact-email');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [companyNamesValid, setCompanyNamesValid] = useState(false);
  const [formData, setFormData] = useState<Partial<FormData>>({
        application_id,
        session_id,
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

    useEffect(() => {
        reset()
    }, [])

    // Fetch existing application data
    const { data: existingApplication, isLoading: isLoadingApplication } = useGetLicenseApplication(application_id);

    // Populate form data when application is loaded
    useEffect(() => {
        if (existingApplication && !isInitialized) {
            const mappedData = mapApiResponseToFormData(existingApplication, session_id);
            setFormData(mappedData);
            
            // Determine which step to show based on data
            const step = determineCurrentStep(existingApplication);
            setCurrentStep(step);
            
            setIsInitialized(true);
        }
    }, [existingApplication, session_id, isInitialized]);

   
//    const {setState, state} = useCoAgent<AgentState>({
//         'name': 'adlex',
//         initialState: {
//             // Identifiers
//             application_id: application_id,
//             // Business Activities (1-3)
//             business_activities: [],
//             // Company Names (3 options required)
//             company_name_1: '',
//             company_name_2: '',
//             company_name_3: '',
//             // Visa Package
//             visa_package_quantity: 0,
//             // Shareholding Structure
//             number_of_shareholders: 0,
//             total_shares: 0,
//             // Shareholders
//             shareholders: [],
//             // Progress tracking
//             current_step: 'contact-email',
//             completion_percentage: 0,
//             // Validation
//             validation_errors: [],
//             is_ready_to_submit: false,
//         }
//     })
//     console.log(setState, state)

//     useEffect(() => {
//         console.log("SHARED STATE CHANGED", state)
//     }, [state])
    useStepsInfo()
     // Action для отображения переходов между этапами
    useCopilotAction({
        name: "show_step_transition",
        description: "Display currentStep transition badge with currentStep name. example: currentStepKey: contact-email, currentStepName: Contact Email",
        parameters: [
        { name: "currentStepKey", type: "string" },
        { name: "currentStepName", type: "string" }
        ],
        handler: (args) => {
            return `${JSON.stringify(args)}`
        },
        render: ({ args }) => {
            return (
            <div id={args.currentStepKey} className="flex w-full justify-center">
                <BadgeWithIcon iconLeading={Dotpoints02} color="brand">
                    <h3>{args.currentStepName}</h3>
                </BadgeWithIcon>
            </div>
            )
        }
    });
    // Sync form state with CopilotKit
    useCopilotFormState(formData, currentStep);
    useEffect(() => {
        // if (currentStep !== 'contact-email') {
        setTimeout(() => {
            sendMessage({
                id: `${new Date().getTime()}`,
                content: `Покажи show_step_transition`,
                role: 'developer',
            })
        }, 500)
        // }
  }, [currentStep])

    // Form handlers
    const formHandlers: FormHandlers = {
        onContactEmailChange: (email: string) => {
            setFormData(prev => ({ ...prev, contact_email: email }));
        },

        onBusinessActivitiesChange: (activities: BusinessActivitySelection[]) => {
            setFormData(prev => ({ ...prev, business_activities: activities }));
        },

        onCompanyNameChange: (index: 0 | 1 | 2, value: string) => {
            setFormData(prev => {
                const fieldName = `company_name_${index + 1}` as 'company_name_1' | 'company_name_2' | 'company_name_3';
                return { ...prev, [fieldName]: value };
            });
        },

        onVisaPackageQuantityChange: (quantity: number) => {
            setFormData(prev => ({ ...prev, visa_package_quantity: quantity }));
        },

        onShareholdersInfoChange: (numberOfShareholders: number, totalShares: number) => {
            setFormData(prev => {
                // Initialize shareholders array when number changes
                const currentShareholders = prev.shareholders || [];
                const shareholders = Array(numberOfShareholders)
                    .fill(null)
                    .map((_, i) =>
                        currentShareholders[i] || {
                            email: '',
                            phone: '',
                            number_of_shares: 0,
                            roles: ['Shareholder'] as ShareholderRole[],
                            residential_address: '',
                            is_uae_resident: false,
                            is_pep: false,
                        }
                    );

                return {
                    ...prev,
                    number_of_shareholders: numberOfShareholders,
                    total_shares: totalShares,
                    shareholders,
                };
            });
        },

        onShareholderDetailsChange: (index: number, data: Partial<ShareholderData>) => {
            setFormData(prev => {
                const shareholders = [...(prev.shareholders || [])];
                shareholders[index] = { ...shareholders[index], ...data };
                return { ...prev, shareholders };
            });
        },

        onPassportReviewChange: (index: number, data: Partial<ShareholderData>) => {
            setFormData(prev => {
                const shareholders = [...(prev.shareholders || [])];
                shareholders[index] = { ...shareholders[index], ...data };
                return { ...prev, shareholders };
            });
        },
    }
    
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
            // Submit form to IFZA
            try {
                if (formData.application_id) {
                    await submitToIfza(formData.application_id);
                    // Navigate to home page with success message
                    navigate('/?submitted=true');
                }
            } catch (error) {
                console.error('Failed to submit to IFZA:', error);
                setSaveError('Failed to submit application. Please try again.');
            }
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
                return companyNamesValid;
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

    const isLoading = updateApplicationMutation.isPending || isLoadingApplication;

    return <div className="flex h-dvh flex-row bg-primary">
          {/* Main Form Area */}
          <AnimatePresence mode="popLayout">
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
                    formData={formData as FormData}
                    handlers={formHandlers}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    canGoNext={canGoNext()}
                    canGoPrevious={canGoPrevious()}
                    isLastStep={isLastStep()}
                    isLoading={isLoading}
                    error={saveError}
                    onDismissError={() => setSaveError(null)}
                    onCompanyNamesValidationChange={setCompanyNamesValid}
                />
            </motion.div>
          </AnimatePresence>
          {/* AI Chat Sidebar */}
          <motion.div 
              layout
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className={`border-l border-border-primary max-w-[30%]`}
          >
              <AIChat />
          </motion.div>
      </div>
}