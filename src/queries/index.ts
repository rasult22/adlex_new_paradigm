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

// Company queries and mutations
export {
  validateCompanyName,
  type CompanyNameInput,
  type CompanyNameValidationResult,
} from "./company";

// License Application queries and mutations
export {
  useLicenseApplications,
  useGetLicenseApplication,
  useGetPassportUrl,
  createLicenseApplication,
  updateLicenseApplication,
  deleteLicenseApplication,
  uploadPassport,
  extractPassportData,
  updateShareholderPassport,
  submitToIfza,
  type LicenseApplicationStatus,
  type ShareholderRole,
  type BusinessActivityInput,
  type BusinessActivityResponse,
  type ShareholderInput,
  type ShareholderResponse,
  type PassportDataResponse,
  type LicenseApplicationInput,
  type LicenseApplicationResponse,
  type LicenseApplicationListParams,
  type LicenseApplicationListResponse,
  type PassportUrlResponse,
  type PassportUploadResponse,
  type ExtractPassportResponse,
  type SubmitResponse,
} from "./license-application";

// Query client
export { queryClient, BASE_URL } from "./client";

// Auth queries and mutations
export {
  registerUser,
  loginUser,
  refreshTokens,
  logoutUser,
  logoutAllDevices,
  getCurrentUser,
  changePassword,
  type UserRole,
  type UserResponse,
  type TokenResponse,
  type UserWithTokensResponse,
  type UserRegisterRequest,
  type UserLoginRequest,
  type RefreshTokenRequest,
  type ChangePasswordRequest,
  type MessageResponse,
} from "./auth";
