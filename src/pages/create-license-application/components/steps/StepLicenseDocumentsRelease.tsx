import { useState } from 'react';
import { Check, Download01, File06, CheckCircle } from '@untitledui/icons';
import { Button } from '@/components/base/buttons/button';
import { LoadingIndicator } from '@/components/application/loading-indicator/loading-indicator';

type ReleaseStatus = 'waiting' | 'approved';

interface LicenseDocument {
    id: number;
    title: string;
    description: string;
    downloadUrl?: string;
}

const licenseDocuments: LicenseDocument[] = [
    {
        id: 1,
        title: 'E-License',
        description: 'This is the main legal document of the company, containing its name, type, permitted activities, validity period, and a unique QR code for verification by banks and government authorities',
        downloadUrl: '#'
    },
    {
        id: 2,
        title: 'Certificate of Formation',
        description: "A document confirming the company's registration in the IFZA free zone registry. It records the registration date and the company's registration number",
        downloadUrl: '#'
    },
    {
        id: 3,
        title: 'Share Certificate',
        description: 'An official document stating who the shareholders of the company are, how many shares each participant owns, and their nominal value',
        downloadUrl: '#'
    },
    {
        id: 4,
        title: 'Memorandum of Association (MOA) & Articles of Association (AOA)',
        description: "This is the company's charter. It outlines the internal management rules, shareholder rights, director responsibilities, and profit distribution procedures. These documents are issued with the IFZA digital seal",
        downloadUrl: '#'
    },
    {
        id: 5,
        title: 'Lease Agreement / Office Confirmation',
        description: 'Even if you have chosen the minimum package (for example, Flexi-Desk or virtual office), you will receive confirmation of the legal address. This document is mandatory for opening a bank account and obtaining visas',
        downloadUrl: '#'
    },
];

const StatusBadge = ({ status }: { status: ReleaseStatus }) => {
    if (status === 'waiting') {
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
                Waiting
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-utility-success-50 text-utility-success-700 text-sm font-medium ring-1 ring-inset ring-utility-success-200">
            <Check className="size-3" />
            Approved
        </span>
    );
};

export const StepLicenseDocumentsRelease = () => {
    const [status, setStatus] = useState<ReleaseStatus>('waiting');

    const handleSimulateApproval = () => {
        setStatus('approved');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold text-primary">License Documents Release</h2>
                <StatusBadge status={status} />
            </div>
            <p className="text-md text-tertiary">
                The free zone issues licensing documents (Trade License, Certificate of Incorporation, etc.)
            </p>

            {status === 'waiting' ? (
                <>
                    {/* Demo button */}
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-utility-gray-50 ring-1 ring-utility-gray-200">
                        <span className="text-sm font-medium text-tertiary">Demo mode:</span>
                        <Button size="sm" color="primary" onClick={handleSimulateApproval} className="ml-auto">
                            Simulate Approval
                        </Button>
                    </div>

                    {/* Waiting state */}
                    <div className="flex flex-col items-center justify-center py-16">
                        <LoadingIndicator type="dot-circle" size="lg" />
                        <p className="text-sm text-tertiary mt-4 text-center max-w-md">
                            We are receiving a payment link. This may take up to a few days. We will notify you by email
                        </p>
                    </div>
                </>
            ) : (
                <>
                    {/* Congratulations message */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-utility-success-600">Поздравляем!</h3>
                        <p className="text-md text-tertiary">
                            Congratulations! Your application to IFZA has been fully approved, and all official documents have been received. This is an important milestone — your company is now legally active, and you can proceed with the next steps: applying for residency visas and opening a bank account.
                        </p>
                        <p className="text-md text-tertiary">
                            We wish you a successful start and rapid growth for your business in Dubai!
                        </p>
                    </div>

                    {/* Documents section */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-primary">Документы</h4>

                        <div className="space-y-3">
                            {licenseDocuments.map((document) => (
                                <div
                                    key={document.id}
                                    className="p-4 rounded-xl bg-secondary ring-1 ring-border-primary"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* PDF Icon */}
                                        <div className="shrink-0 w-10 h-12 bg-utility-error-50 rounded flex items-center justify-center mt-1">
                                            <File06 className="size-5 text-utility-error-600" />
                                        </div>

                                        {/* Document info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-primary">{document.title}</p>
                                            <p className="text-sm text-tertiary mt-1">{document.description}</p>
                                        </div>

                                        {/* Download button */}
                                        <div className="shrink-0">
                                            <Button
                                                size="sm"
                                                color="primary-destructive"
                                                iconLeading={Download01}
                                                onClick={() => {
                                                    // Mock download
                                                    console.log(`Downloading: ${document.title}`);
                                                }}
                                            >
                                                Download
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Success message */}
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-utility-success-50 ring-1 ring-utility-success-200">
                        <CheckCircle className="size-5 text-utility-success-600" />
                        <p className="text-sm text-utility-success-700">
                            <span className="font-semibold">Profiles have been successfully updated.</span>{' '}
                            You can continue filling out the application
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};
