import { BASE_URL } from "./client";
import { useAuthStore } from "@/stores/auth";

// Types based on OpenAPI schema
export interface CompanyNameInput {
  company_name: string;
}

export interface CompanyNameValidationResult {
  company_name: string;
  is_valid: boolean;
  confidence: number;
  issues: string[];
  suggestions: string[];
  reasoning: string;
  rag_context_used: boolean;
}

// Validate company name
export const validateCompanyName = async (companyName: string): Promise<CompanyNameValidationResult> => {
  const response = await fetch(`${BASE_URL}/api/v1/company/validate-name`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
    },
    body: JSON.stringify({ company_name: companyName } as CompanyNameInput),
  });

  if (!response.ok) {
    throw new Error(`Failed to validate company name: ${response.statusText}`);
  }

  return response.json();
};
