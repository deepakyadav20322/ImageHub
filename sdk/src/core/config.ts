export interface MediaHubConfig {
  /**
   * Your MediaHub cloud name
   */
  cloud_name: string;
  
  /**
   * API key for authentication
   */
  api_key: string;
  
  /**
   * API secret (optional for client-side)
   */
  api_secret?: string;
  
  /**
   * Use HTTPS (default: true)
   */
  secure?: boolean;
  
  /**
   * Timeout for requests in ms (default: 30000)
   */
  timeout?: number;
  
  /**
   * Custom CDN domain if needed
   */
  cdn_domain?: string;
  
  /**
   * API version to use
   */
  api_version?: string;
}

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';