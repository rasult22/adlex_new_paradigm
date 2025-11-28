import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AIChat } from './components/AIChat';
import { FormContainer } from './components/FormContainer';
import type { ChatMessage, FormData, FormStep } from './components/types';
import { 
    createLicenseApplication, 
    updateLicenseApplication,
    type LicenseApplicationInput 
} from '@/queries';

const STEP_ORDER: FormStep[] = [
    'contact-email',
    'business-activities',
    'company-names',
    'visa-packages',
    'shareholders-info',
    'shareholder-details',
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

    // Chat state
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState('');

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
        
        // Add welcome message from AI
        const welcomeMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'assistant',
            content: "Great! Let's start with your contact information. I'm here to help if you have any questions.",
            timestamp: new Date(),
        };
        setChatMessages([welcomeMessage]);
    };

    const handleSendMessage = () => {
        if (!chatInput.trim()) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: chatInput,
            timestamp: new Date(),
        };

        setChatMessages(prev => [...prev, userMessage]);
        setChatInput('');

        // TODO: Send to AI backend and receive response
        // For now, just add a placeholder response
        setTimeout(() => {
            const aiResponse: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'I received your message. This is where the AI response will appear.',
                timestamp: new Date(),
            };
            setChatMessages(prev => [...prev, aiResponse]);
        }, 500);
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
                    await updateApplicationMutation.mutateAsync({
                        applicationId: formData.application_id,
                        data: updateData,
                    });
                    // Clear error on success
                    setSaveError(null);
                } catch (error) {
                    // Error is already handled in mutation's onError
                    // Don't proceed to next step
                    return;
                }
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
                    sh.is_pep !== undefined
                );
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
            {isFormVisible &&(
                <div
                    className={`flex-1 transition-all duration-500 ease-in-out `}
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
                </div>
            )}

            {/* AI Chat Sidebar */}
            <div className={`border-l border-border-primary ${isFormVisible ? '' : 'flex-1'}`}>
                <AIChat
                    messages={chatMessages}
                    inputValue={chatInput}
                    isFullscreen={!isFormVisible}
                    onInputChange={setChatInput}
                    onSendMessage={handleSendMessage}
                    onStart={handleStart}
                    showStartButton={!isFormVisible}
                />
            </div>
        </div>
    );
};
