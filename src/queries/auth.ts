import { BASE_URL } from "./client";

// Types based on OpenAPI schema

export type UserRole = "admin" | "user" | "support";

export interface UserResponse {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  last_login_at: string | null;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface UserWithTokensResponse {
  user: UserResponse;
  tokens: TokenResponse;
}

export interface UserRegisterRequest {
  email: string;
  password: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  session_id?: string | null;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface MessageResponse {
  message: string;
  success: boolean;
}

// API Functions

/**
 * Register a new user account
 */
export const registerUser = async (
  data: UserRegisterRequest
): Promise<UserWithTokensResponse> => {
  const url = `${BASE_URL}/api/v1/auth/register`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.detail || `Registration failed: ${response.statusText}`
    );
  }

  return response.json();
};

/**
 * Authenticate user and get tokens
 */
export const loginUser = async (
  data: UserLoginRequest
): Promise<UserWithTokensResponse> => {
  const url = `${BASE_URL}/api/v1/auth/login`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Login failed: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Refresh access token using refresh token
 */
export const refreshTokens = async (
  refreshToken: string
): Promise<TokenResponse> => {
  const url = `${BASE_URL}/api/v1/auth/refresh`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    throw new Error(`Token refresh failed: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Logout (revoke refresh token)
 */
export const logoutUser = async (
  refreshToken: string
): Promise<MessageResponse> => {
  const url = `${BASE_URL}/api/v1/auth/logout`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    throw new Error(`Logout failed: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Logout from all devices (revoke all refresh tokens)
 */
export const logoutAllDevices = async (
  accessToken: string
): Promise<MessageResponse> => {
  const url = `${BASE_URL}/api/v1/auth/logout-all`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Logout from all devices failed: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Get current authenticated user profile
 */
export const getCurrentUser = async (
  accessToken: string
): Promise<UserResponse> => {
  const url = `${BASE_URL}/api/v1/auth/me`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get user: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Change current user's password
 */
export const changePassword = async (
  accessToken: string,
  data: ChangePasswordRequest
): Promise<MessageResponse> => {
  const url = `${BASE_URL}/api/v1/auth/change-password`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.detail || `Password change failed: ${response.statusText}`
    );
  }

  return response.json();
};
