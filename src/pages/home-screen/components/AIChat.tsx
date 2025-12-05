import { CopilotSidebar } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import { Button } from '@/components/base/buttons/button';
// import { UserMessage } from './UserMessage';
// import { AssistantMessage } from './AssistantMessage';
import { CornerDownLeft,  Plus,  StopCircle } from '@untitledui/icons';

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
                    <h3 className="text-xl font-semibold text-primary"> Готовы открыть свою компанию в IFZA?</h3>
                    <p className="text-md text-tertiary">
                       Заполните заявку прямо сейчас через Adlex AI
                    </p>
                    <Button iconLeading={Plus} size="lg" onClick={onStart}>
                        Submit an application
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full">
            <CopilotSidebar
                // AssistantMessage={AssistantMessage}
                // UserMessage={UserMessage}
                defaultOpen={true}
                icons={{
                    sendIcon: <CornerDownLeft />,
                    stopIcon: <StopCircle />,
                }}
                clickOutsideToClose={false}
                labels={{
                    title: "Adlex AI",
                }}
            />
        </div>
    );
};

