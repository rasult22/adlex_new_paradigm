import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { extractPassportData, type ExtractPassportResponse } from '@/queries';
import type { ShareholderData } from '../types';
import { Passport, Edit05, Trash01, CheckCircle } from '@untitledui/icons';
import { FeaturedIcon } from '@/components/foundations/featured-icon/featured-icon';

interface StepPassportReviewProps {
  shareholders: ShareholderData[];
  applicationId: string;
  onShareholderChange: (index: number, data: Partial<ShareholderData>) => void;
}

// Passport details table row component
const PassportDetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex py-1.5">
    <span className="text-sm text-tertiary w-32 shrink-0">{label}</span>
    <span className="text-sm text-primary font-medium">{value || '—'}</span>
  </div>
);

const PassportCard = ({ sh, index, applicationId, onShareholderChange }: { sh: ShareholderData; index: number; applicationId: string; onShareholderChange: (idx: number, data: Partial<ShareholderData>) => void }) => {
  const mutation = useMutation({
    mutationFn: async () => {
      if (!applicationId || !sh.backend_id) throw new Error('Missing applicationId or shareholder backend_id');
      return extractPassportData(applicationId, sh.backend_id);
    },
    onSuccess: (data: ExtractPassportResponse) => {
      onShareholderChange(index, { extracted_passport: data });
    },
  });

  const data = sh.extracted_passport || {};
  const isConfirmed = sh.is_passport_confirmed;

  const handleClearAll = () => {
    onShareholderChange(index, { 
      extracted_passport: {
        first_name: '',
        last_name: '',
        middle_name: '',
        date_of_birth: '',
        passport_number: '',
        nationality: '',
        issue_date: '',
        expiry_date: '',
      },
      is_passport_confirmed: false 
    });
  };

  const handleConfirm = () => {
    onShareholderChange(index, { is_passport_confirmed: true });
  };

  return (
    <div className="p-6 rounded-xl ring-1 ring-border-secondary space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className='flex gap-2 items-center'>
          <FeaturedIcon icon={Passport} size='md' color='gray' theme='modern' />
          <h3 className="text-lg font-semibold text-primary">Shareholder {index + 1}</h3>
        </div>
        <div className="flex gap-2">
          <Button size="md" onClick={() => mutation.mutate()} isDisabled={mutation.isPending || !sh.backend_id}>
            {mutation.isPending ? 'Extracting…' : 'Extract'}
          </Button>
          <Button size="md" color="secondary" onClick={() => mutation.mutate()} isDisabled={mutation.isPending || !sh.backend_id}>
            Re-extract
          </Button>
        </div>
      </div>

      {mutation.isError && (
        <div className="text-sm text-error-primary">
          { (mutation.error as Error)?.message || 'Failed to extract passport data. Please try again.' }
        </div>
      )}

      {/* Two-column layout: Table + Editing form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column: Passport Details Table */}
        <div className="p-5 rounded-lg ring-1 ring-border-secondary bg-bg-secondary self-start">
          <h4 className="text-md font-semibold text-brand-secondary mb-4">Passport Details</h4>
          
          <div className="space-y-0.5">
            <PassportDetailRow label="First Name" value={data.first_name || ''} />
            <PassportDetailRow label="Last Name" value={data.last_name || ''} />
            <PassportDetailRow label="Middle Name" value={data.middle_name || ''} />
            <PassportDetailRow label="Date of Birth" value={data.date_of_birth || ''} />
          </div>
          
          <div className="my-3 bg-border-secondary h-[1px]" />
          
          <div className="space-y-0.5">
            <PassportDetailRow label="Nationality" value={data.nationality || ''} />
            <PassportDetailRow label="Passport Number" value={data.passport_number || ''} />
            <PassportDetailRow label="Issue Date" value={data.issue_date || ''} />
            <PassportDetailRow label="Expiry Date" value={data.expiry_date || ''} />
          </div>
        </div>

        {/* Right column: Data Editing Form */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-brand-secondary">
            <Edit05 className="size-5" />
            <h4 className="text-md font-semibold">Data editing column</h4>
          </div>

          <div className="space-y-3">
            <Input label='First Name' value={data.first_name || ''} onChange={(val) => onShareholderChange(index, { extracted_passport: { ...data, first_name: val } })} size="md" isRequired />
            <Input label='Last Name' value={data.last_name || ''} onChange={(val) => onShareholderChange(index, { extracted_passport: { ...data, last_name: val } })} size="md" isRequired />
            <Input label='Middle Name' value={data.middle_name || ''} onChange={(val) => onShareholderChange(index, { extracted_passport: { ...data, middle_name: val } })} size="md" isRequired />
            <Input label='Date of Birth' value={data.date_of_birth || ''} onChange={(val) => onShareholderChange(index, { extracted_passport: { ...data, date_of_birth: val } })} size="md" isRequired />
            <Input label='Nationality' value={data.nationality || ''} onChange={(val) => onShareholderChange(index, { extracted_passport: { ...data, nationality: val } })} size="md" isRequired />
            <Input label='Passport Number' value={data.passport_number || ''} onChange={(val) => onShareholderChange(index, { extracted_passport: { ...data, passport_number: val } })} size="md" isRequired />
            <Input label='Issue Date' value={data.issue_date || ''} onChange={(val) => onShareholderChange(index, { extracted_passport: { ...data, issue_date: val } })} size="md" isRequired />
            <Input label='Expiry Date' value={data.expiry_date || ''} onChange={(val) => onShareholderChange(index, { extracted_passport: { ...data, expiry_date: val } })} size="md" isRequired />
          </div>
        </div>
      </div>

      {/* Footer buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button size="md" color="secondary" iconLeading={Trash01} onClick={handleClearAll}>
          Clear all
        </Button>
        {isConfirmed ? (
          <div className="flex items-center gap-1.5 text-brand-secondary px-4 py-2">
            <CheckCircle className="size-5" />
            <span className="font-semibold">Confirmed</span>
          </div>
        ) : (
          <Button size="md" onClick={handleConfirm} isDisabled={!sh.extracted_passport}>
            Confirm
          </Button>
        )}
      </div>
    </div>
  );
};

export const StepPassportReview = ({ shareholders, applicationId, onShareholderChange }: StepPassportReviewProps) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-primary mb-2">Passport Review</h2>
        <p className="text-md text-tertiary">Extract, review, and confirm passport details for each shareholder.</p>
      </div>

      {shareholders.map((sh, index) => (
        <PassportCard key={index} sh={sh} index={index} applicationId={applicationId} onShareholderChange={onShareholderChange} />
      ))}
    </div>
  );
};
