// Here we define all usefull types which is used in application (zod infer types or not define here)

 type LoginResponse = {
    data:{
    welcome: boolean;
    user:any,
    permissions:any,
    token:string
    }
 
};


// export type ResourceOriginType = "bucket" | "folder" | "file";
// export type VisibilityType = "private" | "public" | "restricted";
// export type ResourceStatus = "active" | "archived" | "deleted";

export interface Resource {
  tags: any;
  resourceId: string;
  accountId: string;
  parentResourceId?: string;
  type: string    //ResourceOriginType;
  name: string;
  displayName?: string; // Only for buckets
  path: string;
  visibility:string //VisibilityType;
  inheritPermissions: boolean;
  overridePermissions?: boolean;
  metadata?: Record<string, any>; // Flexible JSON metadata
  resourceTypeDetails?: Record<string, any>; // Additional resource-specific details
  versionId?: string ;
  expiresAt?: string ; // ISO date format
  status: string //ResourceStatus;
  isSelected?: boolean;
  createdAt: string; // ISO date format
  updatedAt: string; // ISO date format
  deletedAt?: string ;
}




export type {LoginResponse}