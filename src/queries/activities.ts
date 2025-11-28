import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "./client";

// Types based on OpenAPI schema
export interface BusinessActivity {
  id: string;
  code: string;
  name: string;
  description?: string;
  is_regulated?: boolean;
  license_type?: string;
  activity_type?: string;
  status?: string;
  category?: string;
}

export interface BusinessActivitiesListResponse {
  total: number;
  items: BusinessActivity[];
}

export interface ListActivitiesParams {
  activity_type?: string;
  license_type?: string;
  offset?: number;
  limit?: number;
}

export interface SearchActivitiesParams {
  q: string;
  limit?: number;
}

// Query: List Activities
export const useListActivities = (params?: ListActivitiesParams) => {
  return useQuery({
    queryKey: ["activities", "list", params],
    queryFn: async (): Promise<BusinessActivitiesListResponse> => {
      const searchParams = new URLSearchParams();
      
      if (params?.activity_type) searchParams.append("activity_type", params.activity_type);
      if (params?.license_type) searchParams.append("license_type", params.license_type);
      if (params?.offset !== undefined) searchParams.append("offset", params.offset.toString());
      if (params?.limit !== undefined) searchParams.append("limit", params.limit.toString());

      const url = `${BASE_URL}/api/v1/activities${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch activities: ${response.statusText}`);
      }
      
      return response.json();
    },
  });
};

// Query: Search Activities
export const useSearchActivities = (params: SearchActivitiesParams) => {
  return useQuery({
    queryKey: ["activities", "search", params],
    queryFn: async (): Promise<BusinessActivity[]> => {
      const searchParams = new URLSearchParams();
      searchParams.append("q", params.q);
      if (params.limit !== undefined) searchParams.append("limit", params.limit.toString());

      const url = `${BASE_URL}/api/v1/activities/search?${searchParams.toString()}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to search activities: ${response.statusText}`);
      }
      
      return response.json();
    },
    enabled: params.q.length >= 2, // Only run query if search query is at least 2 characters
  });
};

// Query: Get Activity by ID
export const useGetActivity = (activityId: string) => {
  return useQuery({
    queryKey: ["activities", "detail", activityId],
    queryFn: async (): Promise<BusinessActivity> => {
      const url = `${BASE_URL}/api/v1/activities/${activityId}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch activity: ${response.statusText}`);
      }
      
      return response.json();
    },
    enabled: !!activityId,
  });
};

// Mutation function: Sync From IFZA
export interface SyncResponse {
  total_fetched: number;
  non_regulated_count: number;
  new_count: number;
  updated_count: number;
  errors?: string[];
}

export const syncActivitiesFromIfza = async (): Promise<SyncResponse> => {
  const url = `${BASE_URL}/api/v1/activities/sync`;
  
  const response = await fetch(url, {
    method: "POST",
  });
  
  if (!response.ok) {
    throw new Error(`Failed to sync activities: ${response.statusText}`);
  }
  
  return response.json();
};
