import { UserMessage as UserMessageType } from '@copilotkit/shared';

interface UserMessageProps {
    message?: UserMessageType;
}

export const UserMessage = ({ message }: UserMessageProps) => {
    return (
        <div className="flex items-start gap-3 justify-end mb-1">
            <div className="bg-brand-solid text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%] shadow-sm">
                <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
                    {message?.content}
                </p>
            </div>
            <div className="shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-medium text-tertiary border border-primary">
                U
            </div>
        </div>
    );
};
