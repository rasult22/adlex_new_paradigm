import { AIMessage, Message } from '@copilotkit/shared';
import { Copy01, RefreshCcw05, ThumbsUp, ThumbsDown, Loading01 } from '@untitledui/icons';
import { useState } from 'react';

interface AssistantMessageProps {
    message?: AIMessage;
    isLoading?: boolean;
    isGenerating?: boolean;
    onRegenerate?: () => void;
    onCopy?: (content: string) => void;
    onThumbsUp?: (message: Message) => void;
    onThumbsDown?: (message: Message) => void;
    feedback?: 'thumbsUp' | 'thumbsDown' | null;
}

export const AssistantMessage = ({
    message,
    isLoading,
    isGenerating,
    onRegenerate,
    onCopy,
    onThumbsUp,
    onThumbsDown,
    feedback,
}: AssistantMessageProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const content = message?.content || '';
        if (content) {
            navigator.clipboard.writeText(content);
            setCopied(true);
            if (onCopy) {
                onCopy(content);
            }
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleRegenerate = () => {
        if (onRegenerate) onRegenerate();
    };

    const handleThumbsUp = () => {
        if (onThumbsUp && message) {
            onThumbsUp(message);
        }
    };

    const handleThumbsDown = () => {
        if (onThumbsDown && message) {
            onThumbsDown(message);
        }
    };

    const content = message?.content || '';

    if (isLoading || isGenerating) {
        return (
            <div className="flex items-start gap-3 mb-1">
                <div className="shrink-0 w-8 h-8 rounded-full bg-brand-solid flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-semibold">A</span>
                </div>
                <div className="bg-primary rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-primary">
                    <div className="flex items-center gap-2">
                        <Loading01 className="w-4 h-4 text-quaternary animate-spin" />
                        <span className="text-sm text-secondary">Thinking...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!content) return null;

    return (
        <div className="flex items-start gap-3">
            <div className="shrink-0 w-8 h-8 rounded-full bg-brand-solid flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-semibold">A</span>
            </div>
            <div className="flex-1 min-w-0">
                <div className="bg-primary rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%] shadow-sm border border-primary">
                    <div className="prose prose-sm max-w-none">
                        <p className="text-sm text-primary leading-relaxed whitespace-pre-wrap wrap-break-word m-0">
                            {content}
                        </p>
                    </div>
                </div>

                {!isLoading && !isGenerating && content && (
                    <div className="flex items-center gap-1 mt-2 ml-1">
                        <button
                            onClick={handleCopy}
                            className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-quaternary hover:text-secondary"
                            aria-label="Copy to clipboard"
                            title="Copy to clipboard"
                        >
                            {copied ? (
                                <span className="text-success text-xs font-semibold">✓</span>
                            ) : (
                                <Copy01 className="w-4 h-4" />
                            )}
                        </button>

                        {onRegenerate && (
                            <button
                                onClick={handleRegenerate}
                                className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-quaternary hover:text-secondary"
                                aria-label="Regenerate response"
                                title="Regenerate response"
                            >
                                <RefreshCcw05 className="w-4 h-4" />
                            </button>
                        )}

                        {onThumbsUp && (
                            <button
                                onClick={handleThumbsUp}
                                className={`p-1.5 rounded-lg transition-colors ${
                                    feedback === 'thumbsUp'
                                        ? 'bg-success-secondary text-success'
                                        : 'text-quaternary hover:text-secondary hover:bg-secondary'
                                }`}
                                aria-label="Thumbs up"
                                title="Thumbs up"
                            >
                                <ThumbsUp className="w-4 h-4" />
                            </button>
                        )}

                        {onThumbsDown && (
                            <button
                                onClick={handleThumbsDown}
                                className={`p-1.5 rounded-lg transition-colors ${
                                    feedback === 'thumbsDown'
                                        ? 'bg-error-secondary text-error'
                                        : 'text-quaternary hover:text-secondary hover:bg-secondary'
                                }`}
                                aria-label="Thumbs down"
                                title="Thumbs down"
                            >
                                <ThumbsDown className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
