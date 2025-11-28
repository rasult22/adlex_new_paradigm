// Activities queries and mutations
export {
  useListActivities,
  useSearchActivities,
  useGetActivity,
  syncActivitiesFromIfza,
  type BusinessActivity,
  type BusinessActivitiesListResponse,
  type ListActivitiesParams,
  type SearchActivitiesParams,
  type SyncResponse,
} from "./activities";

// License Application queries and mutations
export {
  useGetLicenseApplication,
  useGetPassportUrl,
  createLicenseApplication,
  updateLicenseApplication,
  deleteLicenseApplication,
  uploadPassport,
  submitToIfza,
  type LicenseApplicationStatus,
  type ShareholderRole,
  type BusinessActivityInput,
  type BusinessActivityResponse,
  type ShareholderInput,
  type ShareholderResponse,
  type LicenseApplicationInput,
  type LicenseApplicationResponse,
  type PassportUrlResponse,
  type PassportUploadResponse,
  type SubmitResponse,
} from "./license-application";

// Query client
export { queryClient, BASE_URL } from "./client";
