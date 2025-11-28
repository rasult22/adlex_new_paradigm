export interface ShareholderData {
    passportScan?: File;
    email: string;
    phone: string;
    numberOfShares: number;
    role: 'Shareholder' | 'General Manager' | 'Director' | 'Secretary';
    residentialAddress: string;
    isUAEResident: boolean;
    isPEP: boolean;
}

export interface FormData {
    // Step 1
    contactEmail: string;
    
    // Step 2
    businessActivities: string[]; // Activity IDs
    
    // Step 3
    companyNames: [string, string, string];
    
    // Step 4
    visaPackages: number;
    
    // Step 5
    numberOfShareholders: number;
    totalShares: number;
    
    // Step 6
    shareholders: ShareholderData[];
    
    // Step 7
    payment?: any; // TBD
    
    // Step 8
    kyc?: any; // TBD
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface BusinessActivity {
    id: string;
    label: string;
    description?: string;
}

export type FormStep = 
    | 'contact-email'
    | 'business-activities'
    | 'company-names'
    | 'visa-packages'
    | 'shareholders-info'
    | 'shareholder-details'
    | 'payment'
    | 'kyc';
