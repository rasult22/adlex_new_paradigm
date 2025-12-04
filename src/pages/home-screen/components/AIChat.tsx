import { CopilotSidebar } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import { Button } from '@/components/base/buttons/button';

interface AIChatProps {
    onStart: () => void;
    showStartButton?: boolean;
}

export const AIChat = ({
    onStart,
    showStartButton = true,
}: AIChatProps) => {
    if (showStartButton) {
        return (
            <div className="flex flex-col bg-primary h-full items-center justify-center p-8">
                <div className="text-center space-y-4 max-w-md">
                    <h3 className="text-xl font-semibold text-primary">Welcome to Adlex.ai</h3>
                    <p className="text-md text-tertiary">
                        👋 Welcome to Adlex.ai! I'll be your personal AI assistant to guide you through opening your UAE company fully online.
                    </p>
                    <Button size="lg" onClick={onStart}>
                        Start Application
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full">
            <CopilotSidebar
                defaultOpen={true}
                clickOutsideToClose={false}
                labels={{
                    title: "Adlex AI",
                }}
            />
        </div>
    );
};

