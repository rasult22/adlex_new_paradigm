import '@copilotkit/react-ui/styles.css';
import { useFrontendTool } from "@copilotkit/react-core";

import { Button } from '@/components/base/buttons/button';
import { useCopilotChatHeadless_c } from '@copilotkit/react-core';
import { useState, useRef, useEffect } from 'react';
import { Send01, RefreshCw01, XClose, User01, Zap } from '@untitledui/icons';
import type { Message as CopilotMessage } from '@copilotkit/shared';
interface AIChatProps {
    onStart: () => void;
    showStartButton?: boolean;
}

const MessageBubble = ({ message }: { message: CopilotMessage }) => {
    const role = 'role' in message ? message.role : 'assistant';
    const content = 'content' in message && message.content
        ? (typeof message.content === 'string'
            ? message.content
            : Array.isArray(message.content)
                ? (message.content as any[])
                    .filter((part: any) => part.type === 'text')
                    .map((part: any) => part.text)
                    .join(' ')
                : '')
        : '';

    const isUser = role === 'user';
    const isAssistant = role === 'assistant';
    const isTool = role === 'tool';
    const isSystem = role === 'system' || role === 'developer';

    // Проверка на кастомный тип (если есть дополнительные поля)
    const customType = (message as any).type;

    // Стили для разных типов сообщений
    if (isUser) {
        return (
            <div id="user" className="flex justify-end mb-4">
                <div className="flex items-start gap-2 max-w-[80%]">
                    <div className="bg-brand-solid text-white rounded-lg px-4 py-3 shadow-xs">
                        <p className="text-sm leading-5">{content}</p>
                    </div>
                    <div className="flex size-8 items-center justify-center rounded-full bg-brand-primary ring-1 ring-brand_alt shrink-0">
                        <User01 className="size-4 text-white" />
                    </div>
                </div>
            </div>
        );
    }

    if (isAssistant && content !== '') {
        return (
            <div id="assistant" className="flex justify-start mb-4">
                <div className="flex items-start gap-2 max-w-[80%]">
                    <div className="flex size-8 items-center justify-center rounded-full bg-brand-primary ring-1 ring-brand_alt shrink-0">
                        <Zap className="size-4 text-white" />
                    </div>
                    <div className="bg-secondary text-primary rounded-lg px-4 py-3 shadow-xs ring-1 ring-secondary rasul">
                        <p className="text-sm leading-5">{content}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (isTool) {
        console.log(message)
        return (
            <div id="tool" className="flex justify-start mb-4">
                <div className="flex items-start gap-2 max-w-[80%]">
                    <div className="bg-tertiary text-secondary rounded-lg px-4 py-3 shadow-xs ring-1 ring-secondary">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center rounded-md bg-utility-blue-50 px-2 py-1 text-xs font-medium text-utility-blue-700 ring-1 ring-inset ring-utility-blue-600/20">
                                Tool - {message.toolName}
                            </span>
                        </div>
                        <p className="text-sm leading-5">{content}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (isSystem) {
        return (
            <div id="system" className="flex justify-center mb-4">
                <div className="bg-quaternary text-tertiary rounded-lg px-3 py-2 shadow-xs max-w-[70%]">
                    <p className="text-xs leading-4 text-center">{content}</p>
                </div>
            </div>
        );
    }

    // Кастомный тип сообщения
    if (customType) {
        return (
            <div className="flex justify-start mb-4">
                <div className="flex items-start gap-2 max-w-[80%]">
                    <div className="bg-utility-purple-50 text-utility-purple-700 rounded-lg px-4 py-3 shadow-xs ring-1 ring-utility-purple-600/20">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center rounded-md bg-utility-purple-100 px-2 py-1 text-xs font-medium text-utility-purple-700 ring-1 ring-inset ring-utility-purple-600/30">
                                {customType}
                            </span>
                        </div>
                        <p className="text-sm leading-5">{content}</p>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export const AIChat = ({
    onStart,
    showStartButton = true,
}: AIChatProps) => {
    const {
        messages,
        sendMessage,
        isLoading,
        stopGeneration,
        reset,
        suggestions,
        generateSuggestions,
    } = useCopilotChatHeadless_c();

    const [inputValue, setInputValue] = useState('');
    const [showSystemMessages, setShowSystemMessages] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    useFrontendTool({
        name: "sayHello",
        description: "Say hello to someone.",
        parameters: [
            {
            name: "name",
            type: "string",
            description: "name of the person to greet",
            required: true,
            },
        ],
        handler: async ({ name }) => {
            alert(`Hello, ${name}!`);
        },
    });

    // Автоматический скролл к последнему сообщению
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        if (!inputValue.trim() || isLoading) return;

        sendMessage({
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
        });

        setInputValue('');
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const filteredMessages = showSystemMessages
        ? messages
        : messages.filter((msg: CopilotMessage) => {
            const role = 'role' in msg ? msg.role : 'assistant';
            return role !== 'system' && role !== 'developer';
        });

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
        <div className="flex flex-col h-full bg-primary">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-secondary">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-brand-solid">
                        <Zap className="size-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-md font-semibold text-primary">Adlex AI</h3>
                        <p className="text-xs text-tertiary">
                            {isLoading ? 'Typing...' : 'Online'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        color="tertiary"
                        onClick={() => setShowSystemMessages(!showSystemMessages)}
                        className="text-xs"
                    >
                        {showSystemMessages ? 'Hide System' : 'Show System'}
                    </Button>
                    {isLoading && (
                        <Button
                            size="sm"
                            color="secondary"
                            iconLeading={XClose}
                            onClick={stopGeneration}
                        >
                            Stop
                        </Button>
                    )}
                    <Button
                        size="sm"
                        color="secondary"
                        iconLeading={RefreshCw01}
                        onClick={reset}
                    >
                        Reset
                    </Button>
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
                {filteredMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center max-w-md">
                            <div className="flex size-16 items-center justify-center rounded-full bg-brand-primary mx-auto mb-4">
                                <Zap className="size-8 text-brand-primary" />
                            </div>
                            <h4 className="text-lg font-semibold text-primary mb-2">
                                Start a conversation
                            </h4>
                            <p className="text-sm text-tertiary">
                                I'm here to help you with your UAE company application. Ask me anything!
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {filteredMessages.map((msg: CopilotMessage) => (
                            <MessageBubble key={'id' in msg ? msg.id : Math.random().toString()} message={msg} />
                        ))}
                        {isLoading && (
                            <div className="flex justify-start mb-4">
                                <div className="flex items-start gap-2">
                                    <div className="flex size-8 items-center justify-center rounded-full bg-brand-primary ring-1 ring-brand_alt shrink-0">
                                        <Zap className="size-4 text-white" />
                                    </div>
                                    <div className="bg-secondary text-primary rounded-lg px-4 py-3 shadow-xs ring-1 ring-secondary">
                                        <div className="flex gap-1">
                                            <span className="size-2 rounded-full bg-quaternary animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="size-2 rounded-full bg-quaternary animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="size-2 rounded-full bg-quaternary animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Suggestions */}
            {suggestions && suggestions.length > 0 && (
                <div className="px-6 py-2 border-t border-secondary bg-secondary_subtle">
                    <div className="flex items-center gap-2 overflow-x-auto">
                        <span className="text-xs text-tertiary shrink-0">Suggestions:</span>
                        {suggestions.map((suggestion: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setInputValue(suggestion.message || suggestion);
                                    inputRef.current?.focus();
                                }}
                                className="shrink-0 px-3 py-1.5 text-xs font-medium text-brand-secondary bg-brand-primary rounded-lg hover:bg-brand-secondary transition-colors ring-1 ring-brand_alt"
                            >
                                {suggestion.message || suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input Area */}
            <div className="px-6 py-4 border-t border-secondary bg-primary">
                <div className="flex items-end gap-2">
                    <div className="flex-1 relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                            disabled={isLoading}
                            className="w-full px-4 py-3 text-sm bg-secondary text-primary rounded-lg border border-secondary focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent placeholder:text-placeholder disabled:bg-disabled disabled:text-disabled resize-none"
                        />
                    </div>
                    <Button
                        size="md"
                        color="primary"
                        iconLeading={Send01}
                        onClick={handleSendMessage}
                        isDisabled={!inputValue.trim() || isLoading}
                        data-icon-only
                    />
                </div>
                <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-tertiary">
                        Press Enter to send, Shift + Enter for new line
                    </p>
                    {suggestions && (
                        <Button
                            size="sm"
                            color="link-gray"
                            onClick={generateSuggestions}
                            className="text-xs"
                        >
                            Generate suggestions
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
