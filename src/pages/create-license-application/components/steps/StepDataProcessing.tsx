import { CheckCircle, XClose, Loading02, AlertCircle } from '@untitledui/icons';
import type { ShareholderData } from '../types';

type ProcessingStatus = 'pending' | 'processing' | 'success' | 'error';

interface ShareholderProcessingStatus {
  shareholderId: string;
  status: ProcessingStatus;
  errorReason?: string;
}

interface StepDataProcessingProps {
  shareholders: ShareholderData[];
  // For now, we'll use mock data. Later this will come from backend
}

// Mock processing statuses for demo - random statuses
const getMockStatuses = (shareholders: ShareholderData[]): ShareholderProcessingStatus[] => {
  const statuses: ProcessingStatus[] = ['success', 'error', 'processing'];
  
  return shareholders.map((sh, index) => {
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    return {
      shareholderId: sh.backend_id || `temp-${index}`,
      status: randomStatus,
      errorReason: randomStatus === 'error' 
        ? 'The application was denied due to insufficient documentation provided for the visa sponsorship. Please ensure all required documents are submitted for review.'
        : undefined,
    };
  });
};

const StatusBadge = ({ status }: { status: ProcessingStatus }) => {
  switch (status) {
    case 'pending':
    case 'processing':
      return (
        <div className="flex items-center gap-2 text-tertiary">
          <Loading02 className="size-5 animate-spin text-brand-secondary" />
          <span>Checking data</span>
        </div>
      );
    case 'success':
      return (
        <div className="flex items-center gap-2 text-success-primary">
          <CheckCircle className="size-5" />
          <span>Success</span>
        </div>
      );
    case 'error':
      return (
        <div className="flex items-center gap-2 text-error-primary">
          <XClose className="size-5" />
          <span>Cancelled</span>
        </div>
      );
    default:
      return null;
  }
};

const ShareholderRow = ({ 
  index, 
  name, 
  status, 
  errorReason 
}: { 
  index: number; 
  name: string; 
  status: ProcessingStatus;
  errorReason?: string;
}) => {
  return (
    <div className="space-y-3">
      <div className="p-4 rounded-lg ring-1 ring-border-secondary flex items-center justify-between">
        <span className="text-primary font-medium">
          {index + 1}. {name || 'Unnamed Shareholder'}
        </span>
        <StatusBadge status={status} />
      </div>
      
      {status === 'error' && errorReason && (
        <div className="ml-4 p-4 rounded-lg bg-error-secondary ring-1 ring-error-primary/20">
          <div className="flex items-start gap-2">
            <AlertCircle className="size-5 text-error-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-error-primary">Reason for refusal</p>
              <p className="text-sm text-tertiary mt-1">{errorReason}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const StepDataProcessing = ({ shareholders }: StepDataProcessingProps) => {
  // Mock data for demo - will be replaced with real backend data
  const statuses: ShareholderProcessingStatus[] = getMockStatuses(shareholders);
  
  const allSuccess = statuses.every(s => s.status === 'success');
  const hasErrors = statuses.some(s => s.status === 'error');
  const isProcessing = statuses.some(s => s.status === 'processing' || s.status === 'pending');

  const getOverallStatus = () => {
    if (isProcessing) return 'processing';
    if (hasErrors) return 'error';
    if (allSuccess) return 'success';
    return 'processing';
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-primary mb-2">Data Processing</h2>
        {overallStatus === 'processing' && (<>
          <p className="text-md text-tertiary">
            Please wait while the data is being processed. We will notify you of any changes via email, or you can keep track in the application list.
          </p>
          <p className="text-md text-tertiary">You may exit the application</p></>
        )}
        {overallStatus === 'success' && (
          <p className="text-md text-success-primary font-medium">
            Профили были успешно обновлены
          </p>
        )}
        {overallStatus === 'error' && (
          <p className="text-md text-error-primary font-medium">
            Профиль (-и) были отклонены
          </p>
        )}
      </div>

    
      {/* Shareholders list */}
      <div className="space-y-3">
        {shareholders.map((sh, index) => {
          const statusInfo = statuses[index];
          const displayName = sh.extracted_passport 
            ? `${sh.extracted_passport.first_name || ''} ${sh.extracted_passport.last_name || ''}`.trim()
            : `Shareholder ${index + 1}`;
          
          return (
            <ShareholderRow
              key={sh.backend_id || index}
              index={index}
              name={displayName}
              status={statusInfo?.status || 'processing'}
              errorReason={statusInfo?.errorReason}
            />
          );
        })}
      </div>

      {/* Status banner */}
      {overallStatus === 'success' && (
        <div className="p-4 rounded-lg bg-success-secondary ring-1 ring-success-primary/20 flex items-center gap-2">
          <CheckCircle className="size-5 text-success-primary" />
          <span className="text-sm text-primary">
            <strong>Profiles have been successfully updated.</strong>{' '}
            <span className="text-tertiary">You can continue filling out the application</span>
          </span>
        </div>
      )}

      {overallStatus === 'error' && (
        <div className="p-4 rounded-lg bg-error-secondary ring-1 ring-error-primary/20 flex items-center gap-2">
          <AlertCircle className="size-5 text-error-primary" />
          <span className="text-sm text-primary">
            <strong>Profile(s) have been rejected.</strong>{' '}
            <span className="text-tertiary">Please check the details again and correct the error</span>
          </span>
        </div>
      )}
    </div>
  );
};
