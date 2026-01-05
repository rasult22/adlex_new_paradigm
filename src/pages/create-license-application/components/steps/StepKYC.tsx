import { useState } from 'react';
import { Check, XClose, Copy01, LinkExternal02, AlertCircle, CheckCircle } from '@untitledui/icons';
import { BadgeWithDot } from '@/components/base/badges/badges';
import { Button } from '@/components/base/buttons/button';

type KYCStatus = 'not_passed' | 'receiving_data' | 'passed' | 'cancelled';
type ApplicantStatus = 'pending' | 'loading' | 'success' | 'cancelled';

interface Applicant {
    id: number;
    name: string;
    status: ApplicantStatus;
    rejectionReason?: string;
}

const initialApplicants: Applicant[] = [
    { id: 1, name: 'Alkhabay Myrzageldi', status: 'pending' },
    { id: 2, name: 'Zackary Humphrey', status: 'pending' },
    { id: 3, name: 'Aaliyah Espinoza', status: 'pending' },
];

const StatusBadge = ({ status }: { status: KYCStatus }) => {
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
    if (status === 'passed') {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-utility-success-50 text-utility-success-700 text-sm font-medium ring-1 ring-inset ring-utility-success-200">
                <Check className="size-3" />
                Passed
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-utility-error-50 text-utility-error-700 text-sm font-medium ring-1 ring-inset ring-utility-error-200">
            <XClose className="size-3" />
            Cancelled
        </span>
    );
};

const ApplicantStatusIndicator = ({ status }: { status: ApplicantStatus }) => {
    if (status === 'loading') {
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
                Receiving data from Zoho
            </span>
        );
    }
    if (status === 'success') {
        return (
            <span className="inline-flex items-center gap-2 text-sm text-utility-success-600">
                <Check className="size-5" />
                Success
            </span>
        );
    }
    if (status === 'cancelled') {
        return (
            <span className="inline-flex items-center gap-2 text-sm text-utility-error-600">
                <XClose className="size-5" />
                Cancelled
            </span>
        );
    }
    return null;
};

export const StepKYC = () => {
    const [status, setStatus] = useState<KYCStatus>('not_passed');
    const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);
    const [demoMode, setDemoMode] = useState<'success' | 'cancelled'>('success');

    const handleCompleteVerification = (applicantId: number) => {
        // Set individual applicant to loading
        setApplicants(prev => prev.map(a => 
            a.id === applicantId ? { ...a, status: 'loading' as ApplicantStatus } : a
        ));
        setStatus('receiving_data');

        // Simulate verification
        setTimeout(() => {
            setApplicants(prev => {
                const updated = prev.map(a => {
                    if (a.id === applicantId) {
                        if (demoMode === 'cancelled' && applicantId === 1) {
                            return { 
                                ...a, 
                                status: 'cancelled' as ApplicantStatus,
                                rejectionReason: 'The KYC verification was rejected because the documentation submitted was incomplete. Make sure to provide all necessary documents for a successful review.'
                            };
                        }
                        return { ...a, status: 'success' as ApplicantStatus };
                    }
                    return a;
                });
                
                // Update overall status
                const allCompleted = updated.every(a => a.status === 'success' || a.status === 'cancelled');
                const hasCancelled = updated.some(a => a.status === 'cancelled');
                const allSuccess = updated.every(a => a.status === 'success');
                
                if (allCompleted) {
                    if (allSuccess) {
                        setStatus('passed');
                    } else if (hasCancelled) {
                        setStatus('cancelled');
                    }
                } else {
                    setStatus('not_passed');
                }
                
                return updated;
            });
        }, 2000);
    };

    const handleCompleteAll = () => {
        setApplicants(prev => prev.map(a => ({ ...a, status: 'loading' as ApplicantStatus })));
        setStatus('receiving_data');

        setTimeout(() => {
            if (demoMode === 'success') {
                setApplicants(prev => prev.map(a => ({ ...a, status: 'success' as ApplicantStatus })));
                setStatus('passed');
            } else {
                setApplicants(prev => prev.map((a, idx) => {
                    if (idx === 0) {
                        return { 
                            ...a, 
                            status: 'cancelled' as ApplicantStatus,
                            rejectionReason: 'The KYC verification was rejected because the documentation submitted was incomplete. Make sure to provide all necessary documents for a successful review.'
                        };
                    }
                    return { ...a, status: 'success' as ApplicantStatus };
                }));
                setStatus('cancelled');
            }
        }, 3000);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText('https://zoho.com/kyc-verification-link');
    };

    const hasPendingApplicants = applicants.some(a => a.status === 'pending');
    const hasRejection = applicants.some(a => a.status === 'cancelled');

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold text-primary">KYC</h2>
                <StatusBadge status={status} />
            </div>
            <p className="text-md text-tertiary">
                Complete the KYC (Know Your Customer) process. This step verifies your identity and ensures compliance with regulations, helping to create a secure business environment
            </p>
            <p className="text-sm text-tertiary">
                The check is carried out at Zoho – the official partner service of IFZA
            </p>

            {/* Demo mode toggle */}
            <div className="flex items-center gap-4 p-3 rounded-lg bg-utility-gray-50 ring-1 ring-utility-gray-200">
                <span className="text-sm font-medium text-tertiary">Demo mode:</span>
                <button
                    onClick={() => setDemoMode('success')}
                    className={`px-3 py-1 text-sm rounded-md transition ${demoMode === 'success' ? 'bg-utility-success-100 text-utility-success-700' : 'text-tertiary hover:bg-secondary'}`}
                >
                    All Pass
                </button>
                <button
                    onClick={() => setDemoMode('cancelled')}
                    className={`px-3 py-1 text-sm rounded-md transition ${demoMode === 'cancelled' ? 'bg-utility-error-100 text-utility-error-700' : 'text-tertiary hover:bg-secondary'}`}
                >
                    With Rejection
                </button>
                {hasPendingApplicants && (
                    <Button size="sm" color="primary" onClick={handleCompleteAll} className="ml-auto">
                        Complete All
                    </Button>
                )}
            </div>

            {/* Applicants list */}
            <div className="space-y-3">
                {applicants.map((applicant, idx) => (
                    <div key={applicant.id}>
                        <div className="p-4 rounded-xl bg-secondary ring-1 ring-border-primary">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-primary">
                                    {idx + 1}. {applicant.name}
                                </span>
                                
                                {applicant.status === 'pending' ? (
                                    <div className="flex items-center gap-2">
                                        <Button size="sm" color="secondary" iconLeading={Copy01} onClick={handleCopyLink}>
                                            Copy the link for KYC
                                        </Button>
                                        <Button size="sm" color="primary" iconLeading={LinkExternal02} onClick={() => handleCompleteVerification(applicant.id)}>
                                            Complete the verification
                                        </Button>
                                    </div>
                                ) : (
                                    <ApplicantStatusIndicator status={applicant.status} />
                                )}
                            </div>
                            
                            {applicant.status === 'cancelled' && applicant.rejectionReason && (
                                <div className="mt-4 p-4 rounded-lg bg-utility-error-50 ring-1 ring-utility-error-200">
                                    <div className="flex gap-3">
                                        <AlertCircle className="size-5 text-utility-error-600 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-semibold text-utility-error-700">Reason for refusal</p>
                                            <p className="text-sm text-utility-error-600 mt-1">{applicant.rejectionReason}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Status messages */}
            {status === 'passed' && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-utility-success-50 ring-1 ring-utility-success-200">
                    <CheckCircle className="size-5 text-utility-success-600" />
                    <p className="text-sm text-utility-success-700">
                        <span className="font-semibold">All applicants have successfully passed KYC.</span>{' '}
                        You can continue filling out the application
                    </p>
                </div>
            )}

            {status === 'cancelled' && hasRejection && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-utility-error-50 ring-1 ring-utility-error-200">
                    <AlertCircle className="size-5 text-utility-error-600" />
                    <p className="text-sm text-utility-error-700">
                        <span className="font-semibold">Profile(s) have been rejected.</span>{' '}
                        Please check the details again and correct the error
                    </p>
                </div>
            )}
        </div>
    );
};
