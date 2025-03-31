// Here we define all usefull types which is used in application (zod infer types or not define here)

 type LoginResponse = {
    data:{
    user:any,
    permissions:any,
    token:string
    }
 
};


export type ResourceOriginType = "bucket" | "folder" | "file";
export type VisibilityType = "private" | "public" | "restricted";
export type ResourceStatus = "active" | "archived" | "deleted";

export interface Resource {
  resourceId: string;
  accountId: string;
  parentResourceId?: string | null;
  type: ResourceOriginType;
  name: string;
  displayName?: string; // Only for buckets
  path: string;
  visibility: VisibilityType;
  inheritPermissions: boolean;
  overridePermissions?: boolean;
  metadata?: Record<string, any>; // Flexible JSON metadata
  resourceTypeDetails?: Record<string, any>; // Additional resource-specific details
  versionId?: string | null;
  expiresAt?: string | null; // ISO date format
  status: ResourceStatus;
  isSelected?: boolean;
  createdAt: string; // ISO date format
  updatedAt: string; // ISO date format
}




export type {LoginResponse}