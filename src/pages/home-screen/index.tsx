import { useState } from 'react';
import { AIChat } from './components/AIChat';
import { FormContainer } from './components/FormContainer';
import type { ChatMessage, FormData, FormStep } from './components/types';

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

export const HomeScreen = () => {
    // Layout state
    const [isFormVisible, setIsFormVisible] = useState(false);

    // Chat state
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState('');

    // Form state
    const [currentStep, setCurrentStep] = useState<FormStep>('contact-email');
    const [formData, setFormData] = useState<Partial<FormData>>({
        contactEmail: '',
        businessActivities: [],
        companyNames: ['', '', ''],
        visaPackages: 0,
        numberOfShareholders: 0,
        totalShares: 0,
        shareholders: [],
    });

    // Chat handlers
    const handleStart = () => {
        setIsFormVisible(true);
        
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
    const handleNext = () => {
        const currentIndex = STEP_ORDER.indexOf(currentStep);
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
                return !!formData.contactEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail);
            case 'business-activities':
                return (formData.businessActivities?.length || 0) >= 1 && (formData.businessActivities?.length || 0) <= 3;
            case 'company-names':
                return formData.companyNames?.every(name => name.trim().length > 0) || false;
            case 'visa-packages':
                return (formData.visaPackages || 0) > 0;
            case 'shareholders-info':
                return (formData.numberOfShareholders || 0) > 0 && (formData.totalShares || 0) > 0;
            case 'shareholder-details':
                // Check if all shareholders have required data
                const shareholders = formData.shareholders || [];
                if (shareholders.length !== formData.numberOfShareholders) return false;
                return shareholders.every(sh => 
                    sh.email && 
                    sh.phone && 
                    sh.numberOfShares > 0 && 
                    sh.role && 
                    sh.residentialAddress &&
                    sh.isUAEResident !== undefined &&
                    sh.isPEP !== undefined
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
