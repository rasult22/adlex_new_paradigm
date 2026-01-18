import { CheckCircle, XClose, Loading02, AlertCircle } from '@untitledui/icons';
import type { ShareholderData } from '../types';
import { AlertFloating } from '@/components/application/alerts/alerts';

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
        <div className="flex items-center gap-2 text-error-primary ">
          <div className='bg-bg-error-secondary p-1 rounded-full flex items-center justify-center'>
            <XClose className="size-5" />
          </div>
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
      <div className="p-6 rounded-lg ring-1 ring-border-secondary flex items-center justify-between">
        <span className="text-primary font-medium">
          {index + 1}. {name || 'Unnamed Shareholder'}
        </span>
        <StatusBadge status={status} />
      </div>
      
      {status === 'error' && errorReason && (
        <AlertFloating title="Reason for refusal" description={errorReason} color = "error" confirmLabel='' />
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
        <AlertFloating color='success' confirmLabel='' title="Profiles have been successfully updated." description="You can continue filling out the application" />
      )}

      {overallStatus === 'error' && (<AlertFloating title="Profile(s) have been rejected." description="Please check the details again and correct the error" color = "error" confirmLabel='' /> )}
    </div>
  );
};
