import { useState } from 'react';
import { Input } from '@/components/base/input/input';
import { Select } from '@/components/base/select/select';
import { RadioButton, RadioGroup } from '@/components/base/radio-buttons/radio-buttons';
import { FileUpload } from '@/components/application/file-upload/file-upload-base';
import type { ShareholderData } from '../types';

interface StepShareholderDetailsProps {
    shareholders: ShareholderData[];
    totalShares: number;
    onShareholderChange: (index: number, data: Partial<ShareholderData>) => void;
    errors?: Record<number, Partial<Record<keyof ShareholderData, string>>>;
}

const ROLES = [
    { id: 'Shareholder', label: 'Shareholder' },
    { id: 'General Manager', label: 'General Manager' },
    { id: 'Director', label: 'Director' },
    { id: 'Secretary', label: 'Secretary' },
];

export const StepShareholderDetails = ({
    shareholders,
    totalShares,
    onShareholderChange,
    errors = {},
}: StepShareholderDetailsProps) => {
    const [uploadingFiles, setUploadingFiles] = useState<Record<number, { name: string; size: number; progress: number }[]>>({});

    const handleFileUpload = (index: number, files: FileList) => {
        const file = files[0];
        if (file) {
            // Simulate upload progress
            setUploadingFiles(prev => ({
                ...prev,
                [index]: [{ name: file.name, size: file.size, progress: 0 }]
            }));

            // Simulate upload
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                setUploadingFiles(prev => ({
                    ...prev,
                    [index]: [{ name: file.name, size: file.size, progress }]
                }));

                if (progress >= 100) {
                    clearInterval(interval);
                    onShareholderChange(index, { passportScan: file });
                }
            }, 200);
        }
    };

    const handleDeleteFile = (index: number) => {
        setUploadingFiles(prev => {
            const updated = { ...prev };
            delete updated[index];
            return updated;
        });
        onShareholderChange(index, { passportScan: undefined });
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-primary mb-2">Shareholder Details</h2>
                <p className="text-md text-tertiary">
                    Please provide detailed information for each shareholder.
                </p>
            </div>

            <div className="space-y-8">
                {shareholders.map((shareholder, index) => {
                    const shareholderErrors = errors[index] || {};
                    const allocatedShares = shareholders.reduce((sum, sh, i) => 
                        i !== index ? sum + (sh.numberOfShares || 0) : sum, 0
                    );
                    const remainingShares = totalShares - allocatedShares;

                    return (
                        <div
                            key={index}
                            className="p-6 rounded-xl bg-secondary ring-1 ring-border-primary space-y-4"
                        >
                            <h3 className="text-lg font-semibold text-primary">
                                Shareholder {index + 1}
                            </h3>

                            {/* Passport Scan */}
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1.5">
                                    Passport Scan <span className="text-error-primary">*</span>
                                </label>
                                <FileUpload.Root>
                                    <FileUpload.DropZone
                                        hint="PDF or image files (max 10MB)"
                                        accept=".pdf,image/*"
                                        allowsMultiple={false}
                                        maxSize={10 * 1024 * 1024}
                                        onDropFiles={(files) => handleFileUpload(index, files)}
                                    />
                                    {uploadingFiles[index] && (
                                        <FileUpload.List>
                                            {uploadingFiles[index].map((file, fileIndex) => (
                                                <FileUpload.ListItemProgressBar
                                                    key={fileIndex}
                                                    name={file.name}
                                                    size={file.size}
                                                    progress={file.progress}
                                                    type="pdf"
                                                    onDelete={() => handleDeleteFile(index)}
                                                />
                                            ))}
                                        </FileUpload.List>
                                    )}
                                </FileUpload.Root>
                                {shareholderErrors.passportScan && (
                                    <p className="text-sm text-error-primary mt-1">{shareholderErrors.passportScan}</p>
                                )}
                            </div>

                            {/* Email */}
                            <Input
                                label="Email"
                                type="email"
                                value={shareholder.email || ''}
                                onChange={(value) => onShareholderChange(index, { email: value })}
                                placeholder="shareholder@example.com"
                                isRequired
                                isInvalid={!!shareholderErrors.email}
                                hint={shareholderErrors.email}
                                size="md"
                            />

                            {/* Phone */}
                            <Input
                                label="Phone Number"
                                type="tel"
                                value={shareholder.phone || ''}
                                onChange={(value) => onShareholderChange(index, { phone: value })}
                                placeholder="+971 XX XXX XXXX"
                                isRequired
                                isInvalid={!!shareholderErrors.phone}
                                hint={shareholderErrors.phone}
                                size="md"
                            />

                            {/* Number of Shares */}
                            <Input
                                label="Number of Shares"
                                type="number"
                                value={shareholder.numberOfShares?.toString() || ''}
                                onChange={(value) => onShareholderChange(index, { 
                                    numberOfShares: parseInt(value) || 0 
                                })}
                                placeholder="0"
                                isRequired
                                isInvalid={!!shareholderErrors.numberOfShares}
                                hint={shareholderErrors.numberOfShares || `Remaining shares: ${remainingShares}`}
                                size="md"
                            />

                            {/* Role */}
                            <Select
                                label="Role in Company"
                                placeholder="Select role"
                                size="md"
                                isRequired
                                selectedKey={shareholder.role}
                                onSelectionChange={(key) => onShareholderChange(index, { 
                                    role: key as ShareholderData['role']
                                })}
                                items={ROLES}
                                hint={shareholderErrors.role}
                            >
                                {(item) => <Select.Item key={item.id} id={item.id}>{item.label}</Select.Item>}
                            </Select>

                            {/* Residential Address */}
                            <Input
                                label="Residential Address"
                                value={shareholder.residentialAddress || ''}
                                onChange={(value) => onShareholderChange(index, { 
                                    residentialAddress: value 
                                })}
                                placeholder="Full residential address"
                                isRequired
                                isInvalid={!!shareholderErrors.residentialAddress}
                                hint={shareholderErrors.residentialAddress}
                                size="md"
                            />

                            {/* UAE Resident */}
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-3">
                                    UAE Resident <span className="text-error-primary">*</span>
                                </label>
                                <RadioGroup
                                    value={shareholder.isUAEResident?.toString()}
                                    onChange={(value) => onShareholderChange(index, { 
                                        isUAEResident: value === 'true' 
                                    })}
                                    size="md"
                                >
                                    <RadioButton value="true" label="Yes" />
                                    <RadioButton value="false" label="No" />
                                </RadioGroup>
                            </div>

                            {/* PEP Status */}
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1.5">
                                    Politically Exposed Person (PEP) <span className="text-error-primary">*</span>
                                </label>
                                <p className="text-sm text-tertiary mb-3">
                                    Is this person a politically exposed person or related to one?
                                </p>
                                <RadioGroup
                                    value={shareholder.isPEP?.toString()}
                                    onChange={(value) => onShareholderChange(index, { 
                                        isPEP: value === 'true' 
                                    })}
                                    size="md"
                                >
                                    <RadioButton value="true" label="Yes" />
                                    <RadioButton value="false" label="No" />
                                </RadioGroup>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
