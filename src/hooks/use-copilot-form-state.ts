import { useCopilotReadable } from "@copilotkit/react-core";
import type { FormData, FormStep, ShareholderData } from "@/pages/create-license-application/components/types";

/**
 * Custom hook to sync form data with CopilotKit's shared state
 * This allows the AI agent to access the current application state
 */
export const useCopilotFormState = (
    formData: Partial<FormData>,
    currentStep: FormStep
) => {
    // Make form data readable by the agent
    useCopilotReadable({
        description: "Current step of the license application form",
        value: `currentStep step is: ${currentStep}`
    })
    useCopilotReadable({
        description: "Current license application form data and progress",
        value: {
            currentStep,
            applicationId: formData.application_id,
            contactEmail: formData.contact_email,
            businessActivities: formData.business_activities?.map((activity: any) => ({
                activityId: activity.activity_id,
                isMain: activity.is_main,
                name: activity.name,
            })),
            companyNames: {
                option1: formData.company_name_1,
                option2: formData.company_name_2,
                option3: formData.company_name_3,
            },
            visaPackageQuantity: formData.visa_package_quantity,
            shareholderInfo: {
                numberOfShareholders: formData.number_of_shareholders,
                totalShares: formData.total_shares,
            },
            shareholders: formData.shareholders?.map((sh: ShareholderData)=> ({
                email: sh.email,
                phone: sh.phone,
                numberOfShares: sh.number_of_shares,
                roles: sh.roles,
                residentialAddress: sh.residential_address,
                isUaeResident: sh.is_uae_resident,
                isPep: sh.is_pep,
                hasPassportScan: !!sh.passport_scan,
                passportConfirmed: sh.is_passport_confirmed,
                extractedPassport: sh.extracted_passport,
            })),
        },
    });

    // // Make step progress readable
    // useCopilotReadable({
    //     description: "Application completion status",
    //     value: {
    //         currentStep,
    //         stepsCompleted: getCompletedSteps(formData, currentStep),
    //         isContactEmailComplete: !!formData.contact_email,
    //         isBusinessActivitiesComplete: (formData.business_activities?.length || 0) >= 1,
    //         isCompanyNamesComplete: !!(formData.company_name_1 && formData.company_name_2 && formData.company_name_3),
    //         isVisaPackagesComplete: (formData.visa_package_quantity || 0) > 0,
    //         isShareholderInfoComplete: (formData.number_of_shareholders || 0) > 0 && (formData.total_shares || 0) > 0,
    //         isShareholderDetailsComplete: formData.shareholders?.length === formData.number_of_shareholders,
    //         isPassportReviewComplete: formData.shareholders?.every((sh: ShareholderData) => sh.is_passport_confirmed),
    //     },
    // });
};

/**
 * Helper function to determine which steps have been completed
 */
function getCompletedSteps(formData: Partial<FormData>, currentStep: FormStep): string[] {
    const completed: string[] = [];
    if (formData.contact_email) completed.push('contact-email');
    if ((formData.business_activities?.length || 0) >= 1) completed.push('business-activities');
    if (formData.company_name_1 && formData.company_name_2 && formData.company_name_3) completed.push('company-names');
    if ((formData.visa_package_quantity || 0) > 0) completed.push('visa-packages');
    if ((formData.number_of_shareholders || 0) > 0 && (formData.total_shares || 0) > 0) completed.push('shareholders-info');
    if (formData.shareholders?.length === formData.number_of_shareholders) completed.push('shareholder-details');
    if (formData.shareholders?.every((sh:any) => sh.is_passport_confirmed)) completed.push('passport-review');
    
    return completed;
}
