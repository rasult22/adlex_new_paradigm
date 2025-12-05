// Import API types
import type { 
    BusinessActivity,
    BusinessActivityInput,
    ShareholderInput,
    ShareholderRole 
} from '@/queries';

// Extended business activity type with name (for display purposes)
export interface BusinessActivitySelection extends BusinessActivityInput {
    name?: string; // Activity name for display
}

// Extended shareholder type with passport file (not sent to API directly)
export interface ShareholderData extends Omit<ShareholderInput, 'roles'> {
    passport_scan?: File;
    roles: ShareholderRole[];
    backend_id?: string;
    extracted_passport?: PassportData;
    is_passport_confirmed?: boolean;
}

export interface PassportData {
    passport_number?: string;
    full_name?: string;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    date_of_birth?: string; // ISO date string
    nationality?: string;
    issue_date?: string; // ISO date string
    expiry_date?: string; // ISO date string
}

export interface FormData {
    // Application metadata
    application_id?: string;
    session_id?: string;

    // Step 1
    contact_email: string;

    // Step 2
    business_activities: BusinessActivitySelection[];

    // Step 3
    company_name_1: string;
    company_name_2: string;
    company_name_3: string;

    // Step 4
    visa_package_quantity: number;

    // Step 5
    number_of_shareholders: number;
    total_shares: number;

    // Step 6
    shareholders: ShareholderData[];

    // Step 7
    payment?: any; // TBD

    // Step 8
    kyc?: any; // TBD
}

export interface FormHandlers {
    onContactEmailChange: (email: string) => void;
    onBusinessActivitiesChange: (activities: BusinessActivitySelection[]) => void;
    onCompanyNameChange: (index: 0 | 1 | 2, value: string) => void;
    onVisaPackageQuantityChange: (quantity: number) => void;
    onShareholdersInfoChange: (numberOfShareholders: number, totalShares: number) => void;
    onShareholderDetailsChange: (index: number, data: Partial<ShareholderData>) => void;
    onPassportReviewChange: (index: number, data: Partial<ShareholderData>) => void;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

// Re-export API types for convenience
export type { BusinessActivity, BusinessActivityInput, ShareholderRole };

export type FormStep = 
    | 'contact-email'
    | 'business-activities'
    | 'company-names'
    | 'visa-packages'
    | 'shareholders-info'
    | 'shareholder-details'
    | 'passport-review'
    | 'payment'
    | 'kyc';
