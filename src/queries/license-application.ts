import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "./client";
import { useAuthStore } from "@/stores/auth";

// Types based on OpenAPI schema
export type LicenseApplicationStatus = "draft" | "submitted" | "in_progress" | "approved" | "rejected";

export type ShareholderRole = "Shareholder" | "General Manager" | "Director" | "Secretary";

export interface BusinessActivityInput {
  activity_id: number;
  is_main?: boolean;
}

export interface BusinessActivityResponse {
  activity_id: number;
  activity_code: string;
  name: string;
  is_main: boolean;
}

export interface ShareholderInput {
  email: string;
  phone: string;
  number_of_shares: number;
  roles: ShareholderRole[];
  residential_address?: string | null;
  is_uae_resident?: boolean;
  is_pep?: boolean;
}

export interface ShareholderResponse {
  id: string;
  email: string;
  phone: string;
  number_of_shares: number;
  roles: string[];
  residential_address: string | null;
  is_uae_resident: boolean;
  is_pep: boolean;
  passport_uploaded: boolean;
  passport_document_id: string | null;
}

export interface LicenseApplicationInput {
  business_activities?: BusinessActivityInput[] | null;
  company_name_1?: string | null;
  company_name_2?: string | null;
  company_name_3?: string | null;
  visa_package_quantity?: number | null;
  number_of_shareholders?: number | null;
  total_shares?: number | null;
  shareholders?: ShareholderInput[] | null;
}

export interface LicenseApplicationResponse {
  id: string;
  session_id: string;
  status: LicenseApplicationStatus;
  business_activities?: BusinessActivityResponse[] | null;
  company_name_1?: string | null;
  company_name_2?: string | null;
  company_name_3?: string | null;
  visa_package_quantity?: number | null;
  number_of_shareholders?: number | null;
  total_shares?: number | null;
  shareholders: ShareholderResponse[];
  completion_percentage: number;
  validation_errors: string[];
  is_ready_to_submit: boolean;
  ifza_draft_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PassportUrlResponse {
  shareholder_id: string;
  download_url: string;
  expires_in: number;
}

export interface PassportUploadResponse {
  success: boolean;
  shareholder_id: string;
  document_id: string;
  filename: string;
  file_size: number;
}

export interface ExtractPassportResponse {
  passport_number?: string;
  full_name?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  date_of_birth?: string;
  nationality?: string;
  issue_date?: string;
  expiry_date?: string;
}

export interface SubmitResponse {
  success: boolean;
  ifza_draft_id?: string | null;
  message: string;
  validation_errors: string[];
}

// List applications params and response
export interface LicenseApplicationListParams {
  limit?: number;
  offset?: number;
  status?: LicenseApplicationStatus;
}

export interface LicenseApplicationListResponse {
  items: LicenseApplicationResponse[];
  total: number;
  limit: number;
  offset: number;
}

// Query: Get License Applications List
export const useLicenseApplications = (params?: LicenseApplicationListParams) => {
  return useQuery({
    queryKey: ["license-applications", params],
    queryFn: async (): Promise<LicenseApplicationListResponse> => {
      const searchParams = new URLSearchParams();
      
      if (params?.limit !== undefined) searchParams.append("limit", params.limit.toString());
      if (params?.offset !== undefined) searchParams.append("offset", params.offset.toString());
      if (params?.status) searchParams.append("status", params.status);

      const url = `${BASE_URL}/api/v1/license-application/${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch license applications: ${response.statusText}`);
      }
      
      return response.json();
    },
  });
};

// Query: Get License Application
export const useGetLicenseApplication = (applicationId: string) => {
  return useQuery({
    queryKey: ["license-application", applicationId],
    queryFn: async (): Promise<LicenseApplicationResponse> => {
      const url = `${BASE_URL}/api/v1/license-application/${applicationId}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch license application: ${response.statusText}`);
      }
      
      return response.json();
    },
    enabled: !!applicationId,
  });
};

// Query: Get Passport Download URL
export const useGetPassportUrl = (
  applicationId: string,
  shareholderId: string,
  expiresIn: number = 3600
) => {
  return useQuery({
    queryKey: ["passport-url", applicationId, shareholderId, expiresIn],
    queryFn: async (): Promise<PassportUrlResponse> => {
      const searchParams = new URLSearchParams();
      searchParams.append("expires_in", expiresIn.toString());

      const url = `${BASE_URL}/api/v1/license-application/${applicationId}/shareholders/${shareholderId}/passport?${searchParams.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch passport URL: ${response.statusText}`);
      }
      
      return response.json();
    },
    enabled: !!applicationId && !!shareholderId,
  });
};

// Mutation function: Create License Application
export const createLicenseApplication = async (sessionId: string): Promise<LicenseApplicationResponse> => {
  const searchParams = new URLSearchParams();
  searchParams.append("session_id", sessionId);

  const url = `${BASE_URL}/api/v1/license-application/?${searchParams.toString()}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().accessToken}`
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create license application: ${response.statusText}`);
  }
  
  return response.json();
};

// Mutation function: Update License Application
export const updateLicenseApplication = async (
  applicationId: string,
  data: LicenseApplicationInput
): Promise<LicenseApplicationResponse> => {
  const url = `${BASE_URL}/api/v1/license-application/${applicationId}`;
  
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useAuthStore.getState().accessToken}`
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update license application: ${response.statusText}`);
  }
  
  return response.json();
};

// Mutation function: Delete License Application
export const deleteLicenseApplication = async (applicationId: string): Promise<void> => {
  const url = `${BASE_URL}/api/v1/license-application/${applicationId}`;
  
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().accessToken}`
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete license application: ${response.statusText}`);
  }
};

// Mutation function: Upload Passport
export const uploadPassport = async (
  applicationId: string,
  shareholderId: string,
  file: File
): Promise<PassportUploadResponse> => {
  const url = `${BASE_URL}/api/v1/license-application/${applicationId}/shareholders/${shareholderId}/passport`;
  
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().accessToken}`
    },
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error(`Failed to upload passport: ${response.statusText}`);
  }
  
  return response.json();
};

// Mutation function: Extract Passport Data (OCR)
export const extractPassportData = async (
  applicationId: string,
  shareholderId: string
): Promise<ExtractPassportResponse> => {
  const url = `${BASE_URL}/api/v1/license-application/${applicationId}/shareholders/${shareholderId}/passport/extract`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to extract passport data: ${response.statusText}`);
  }
  const json = await response.json();
  if (json && typeof json === "object" && "success" in json) {
    if (!json.success) {
      const errs = Array.isArray(json.errors) ? json.errors.join(" | ") : "Unknown extraction error";
      throw new Error(errs);
    }
    return (json.data || {}) as ExtractPassportResponse;
  }
  return json as ExtractPassportResponse;
};

// Mutation function: Update Shareholder Passport Details (PATCH)
export const updateShareholderPassport = async (
  applicationId: string,
  shareholderId: string,
  data: ExtractPassportResponse
): Promise<ShareholderResponse> => {
  const url = `${BASE_URL}/api/v1/license-application/${applicationId}/shareholders/${shareholderId}/passport-data`;

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useAuthStore.getState().accessToken}`
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update passport details: ${response.statusText}`);
  }

  return response.json();
};

// Mutation function: Submit to IFZA
export const submitToIfza = async (applicationId: string): Promise<SubmitResponse> => {
  const url = `${BASE_URL}/api/v1/license-application/${applicationId}/submit`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().accessToken}`
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to submit to IFZA: ${response.statusText}`);
  }
  
  return response.json();
};
