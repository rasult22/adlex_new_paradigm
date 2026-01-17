import { useState } from 'react';
import { Check, LinkExternal02, File06 } from '@untitledui/icons';
import { BadgeWithDot } from '@/components/base/badges/badges';
import { Button } from '@/components/base/buttons/button';

type ESignStatus = 'not_passed' | 'receiving_data' | 'passed';
type DocumentStatus = 'pending' | 'signing' | 'receiving' | 'signed';

interface Document {
    id: number;
    title: string;
    description: string;
    status: DocumentStatus;
}

const initialDocuments: Document[] = [
    {
        id: 1,
        title: 'E-Agreement',
        description: 'Main agreement with IFZA for company formation',
        status: 'pending'
    },
    {
        id: 2,
        title: 'MOA/AOA',
        description: 'Digital versions of the articles of association and bylaws, detailing shareholder rights and management rules',
        status: 'pending'
    },
    {
        id: 3,
        title: 'Share Capital Letter',
        description: 'Document confirming the distribution of shares and the',
        status: 'pending'
    },
];

const StatusBadge = ({ status }: { status: ESignStatus }) => {
    if (status === 'not_passed') {
        return <BadgeWithDot color="gray">Not passed</BadgeWithDot>;
    }
    if (status === 'receiving_data') {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-utility-blue-50 text-utility-blue-700 text-sm font-medium ring-1 ring-inset ring-utility-blue-200">
                <svg className="size-3 animate-spin" viewBox="0 0 16 16" fill="none">
                    <circle className="stroke-current opacity-30" cx="8" cy="8" r="6" strokeWidth="2" />
                    <circle
                        className="origin-center stroke-current"
                        cx="8"
                        cy="8"
                        r="6"
                        strokeWidth="2"
                        strokeDasharray="9.5 37.7"
                        strokeLinecap="round"
                    />
                </svg>
                Receiving data
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-utility-success-50 text-utility-success-700 text-sm font-medium ring-1 ring-inset ring-utility-success-200">
            <Check className="size-3" />
            Passed
        </span>
    );
};

const DocumentStatusIndicator = ({ status, onSign }: { status: DocumentStatus; onSign: () => void }) => {
    if (status === 'pending') {
        return (
            <Button size="sm" color="primary" iconLeading={LinkExternal02} onClick={onSign}>
                Sign
            </Button>
        );
    }
    if (status === 'signing' || status === 'receiving') {
        return (
            <span className="inline-flex items-center gap-2 text-sm text-utility-blue-600">
                <svg className="size-5 animate-spin" viewBox="0 0 20 20" fill="none">
                    <circle className="stroke-utility-blue-200" cx="10" cy="10" r="8" strokeWidth="2" />
                    <circle
                        className="origin-center stroke-utility-blue-600"
                        cx="10"
                        cy="10"
                        r="8"
                        strokeWidth="2"
                        strokeDasharray="12.5 50"
                        strokeLinecap="round"
                    />
                </svg>
                Receiving data
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-2 text-sm text-utility-success-600">
            <Check className="size-5" />
            Signed
        </span>
    );
};

export const StepESign = () => {
    const [status, setStatus] = useState<ESignStatus>('not_passed');
    const [documents, setDocuments] = useState<Document[]>(initialDocuments);

    const handleSign = (documentId: number) => {
        // Set document to signing
        setDocuments(prev => prev.map(doc =>
            doc.id === documentId ? { ...doc, status: 'signing' as DocumentStatus } : doc
        ));
        setStatus('receiving_data');

        // Simulate signing process
        setTimeout(() => {
            setDocuments(prev => {
                const updated = prev.map(doc =>
                    doc.id === documentId ? { ...doc, status: 'signed' as DocumentStatus } : doc
                );

                // Check if all documents are signed
                const allSigned = updated.every(doc => doc.status === 'signed');
                if (allSigned) {
                    setStatus('passed');
                } else {
                    setStatus('not_passed');
                }

                return updated;
            });
        }, 2000);
    };

    const handleSignAll = () => {
        setDocuments(prev => prev.map(doc => ({ ...doc, status: 'signing' as DocumentStatus })));
        setStatus('receiving_data');

        setTimeout(() => {
            setDocuments(prev => prev.map(doc => ({ ...doc, status: 'signed' as DocumentStatus })));
            setStatus('passed');
        }, 3000);
    };

    const hasPendingDocuments = documents.some(doc => doc.status === 'pending');

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold text-primary">E-sign</h2>
                <StatusBadge status={status} />
            </div>
            <p className="text-md text-tertiary">
                Sign the necessary documents to submit your application for opening a business in IFZA. This will help verify your identity and ensure compliance with all requirements
            </p>

            {/* Demo: Sign All button */}
            {hasPendingDocuments && (
                <div className="flex items-center gap-4 p-3 rounded-lg bg-utility-gray-50 ring-1 ring-utility-gray-200">
                    <span className="text-sm font-medium text-tertiary">Demo mode:</span>
                    <Button size="sm" color="primary" onClick={handleSignAll} className="ml-auto">
                        Sign All Documents
                    </Button>
                </div>
            )}

            {/* Documents list */}
            <div className="space-y-3">
                {documents.map((document) => (
                    <div
                        key={document.id}
                        className="p-4 rounded-xl bg-secondary ring-1 ring-border-primary"
                    >
                        <div className="flex items-center gap-4">
                            {/* PDF Icon */}
                            <div className="shrink-0 w-10 h-12 bg-utility-error-50 rounded flex items-center justify-center">
                                <File06 className="size-5 text-utility-error-600" />
                            </div>

                            {/* Document info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-primary">{document.title}</p>
                                <p className="text-sm text-tertiary mt-0.5 line-clamp-2">{document.description}</p>
                            </div>

                            {/* Status/Action */}
                            <div className="shrink-0">
                                <DocumentStatusIndicator
                                    status={document.status}
                                    onSign={() => handleSign(document.id)}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Success message */}
            {status === 'passed' && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-utility-success-50 ring-1 ring-utility-success-200">
                    <Check className="size-5 text-utility-success-600" />
                    <p className="text-sm text-utility-success-700">
                        <span className="font-semibold">All documents have been signed.</span>{' '}
                        You can continue filling out the application
                    </p>
                </div>
            )}
        </div>
    );
};
