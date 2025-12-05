import { useMutation } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { AppLayout } from '../../components/app-layout';
import { 
    createLicenseApplication, 
} from '@/queries';
import { Button } from '@/components/base/buttons/button';
import { Plus } from '@untitledui/icons';
import { useNavigate } from 'react-router';

// Generate a unique session ID
const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

export const HomeScreen = () => {
     const navigate = useNavigate()
     // Mutation for creating license application
    const createApplicationMutation = useMutation({
        mutationFn: createLicenseApplication,
        onSuccess: (data) => {
            // Navigate to the next step with session ID
            navigate(`/create-license-application?application_id=${data.id}&session_id=${data.session_id}`);
        },
        onError: (error: Error) => {
            console.error('Failed to create license application:', error);
        },
    });

    // Chat handlers
    const handleStart = () => {
        // Generate session ID and create license application
        const sessionId = generateSessionId();
        createApplicationMutation.mutate(sessionId);
    };
    return (
        <AppLayout>
            <div className="flex h-dvh flex-row bg-primary">
                {/* AI Chat Sidebar */}
                <motion.div 
                    layout
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className={`border-l border-border-primary w-full py-8`}
                >
                {/* header */}
                <div className='px-8 flex justify-between items-center'>
                    <div className='font-semibold text-[24px] leading-[32px]'>
                        Applications
                    </div>
                    <Button isLoading={createApplicationMutation.isPending} iconLeading={Plus} size="lg" onClick={handleStart}>Submit an application</Button>
                </div>
                  <div className="flex flex-col w-full bg-primary h-full items-center justify-center p-8">
                        <div className="text-center space-y-4">
                            <h3 className="text-xl font-semibold text-primary"> Готовы открыть свою компанию в IFZA?</h3>
                            <p className="text-md text-tertiary">
                            Заполните заявку прямо сейчас через Adlex AI
                            </p>
                            <Button isLoading={createApplicationMutation.isPending} iconLeading={Plus} size="lg" onClick={handleStart}>
                                Submit an application
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AppLayout>
    );
};
