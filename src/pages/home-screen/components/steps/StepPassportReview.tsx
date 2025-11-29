import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { extractPassportData, type ExtractPassportResponse } from '@/queries';
import type { ShareholderData } from '../types';

interface StepPassportReviewProps {
  shareholders: ShareholderData[];
  applicationId: string;
  onShareholderChange: (index: number, data: Partial<ShareholderData>) => void;
}

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

  return (
    <div className="p-6 rounded-xl bg-secondary ring-1 ring-border-primary space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-primary">Shareholder {index + 1}</h3>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label='Passport Number' value={data.passport_number || ''} onChange={(val) => onShareholderChange(index, { extracted_passport: { ...data, passport_number: val } })} size="md" />
        <Input label='Full Name' value={data.full_name || ''} onChange={(val) => onShareholderChange(index, { extracted_passport: { ...data, full_name: val } })} size="md" />
        <Input label='Date of Birth' value={data.date_of_birth || ''} onChange={(val) => onShareholderChange(index, { extracted_passport: { ...data, date_of_birth: val } })} size="md" />
        <Input label='Nationality' value={data.nationality || ''} onChange={(val) => onShareholderChange(index, { extracted_passport: { ...data, nationality: val } })} size="md" />
        <Input label='Issue Date' value={data.issue_date || ''} onChange={(val) => onShareholderChange(index, { extracted_passport: { ...data, issue_date: val } })} size="md" />
        <Input label='Expiry Date' value={data.expiry_date || ''} onChange={(val) => onShareholderChange(index, { extracted_passport: { ...data, expiry_date: val } })} size="md" />
      </div>

      <div className="flex items-center justify-end">
        <Button size="md" onClick={() => onShareholderChange(index, { is_passport_confirmed: true })} isDisabled={!sh.extracted_passport}>
          Confirm
        </Button>
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
