import { Send01 } from '@untitledui/icons';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import type { ChatMessage } from './types';

interface AIChatProps {
    messages: ChatMessage[];
    inputValue: string;
    isFullscreen: boolean;
    onInputChange: (value: string) => void;
    onSendMessage: () => void;
    onStart: () => void;
    showStartButton?: boolean;
}

export const AIChat = ({
    messages,
    inputValue,
    isFullscreen,
    onInputChange,
    onSendMessage,
    onStart,
    showStartButton = true,
}: AIChatProps) => {
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSendMessage();
        }
    };

    return (
        <div
            className={`flex flex-col bg-primary transition-all duration-500 ease-in-out ${
                isFullscreen ? 'w-full' : 'w-96'
            }`}
        >
            {/* Header */}
            <div className="border-b border-border-primary p-4">
                <h2 className="text-lg font-semibold text-primary">AI Assistant</h2>
                <p className="text-sm text-tertiary">Ask me anything about the company formation process</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && showStartButton && (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-semibold text-primary">Welcome to UAE Company Formation</h3>
                            <p className="text-md text-tertiary max-w-md">
                                I'll guide you through the process of forming your company in the UAE. 
                                Click the button below to get started.
                            </p>
                        </div>
                        <Button size="lg" onClick={onStart}>
                            Start Application
                        </Button>
                    </div>
                )}

                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                message.role === 'user'
                                    ? 'bg-brand-solid text-white'
                                    : 'bg-secondary text-primary'
                            }`}
                        >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <span className="text-xs opacity-70 mt-1 block">
                                {message.timestamp.toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                })}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            {!showStartButton && (
                <div className="border-t border-border-primary p-4">
                    <div className="flex gap-2">
                        <Input
                            value={inputValue}
                            onChange={(e) => onInputChange(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            className="flex-1"
                        />
                        <Button
                            size="md"
                            onClick={onSendMessage}
                            iconLeading={Send01}
                            isDisabled={!inputValue.trim()}
                        >
                            Send
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
