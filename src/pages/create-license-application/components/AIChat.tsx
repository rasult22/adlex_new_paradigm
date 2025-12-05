import { CopilotSidebar } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
// import { UserMessage } from './UserMessage';
// import { AssistantMessage } from './AssistantMessage';
import { CornerDownLeft, StopCircle } from '@untitledui/icons';

export const AIChat = () => {
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

