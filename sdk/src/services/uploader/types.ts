export interface UploadOptions {
  public_id?: string;
  folder?: string;
  filename_override?: string;
  use_filename?: boolean;
  unique_filename?: boolean;
  overwrite?: boolean;
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
  type?: 'upload' | 'private' | 'authenticated';
  tags?: string[] | string;
  context?: Record<string, string>;
  transformation?: UploadTransformOptions[];
  format?: string;
  quality_analysis?: boolean;
  colors?: boolean;
  faces?: boolean;
  image_metadata?: boolean;
  phash?: boolean;
  moderation?: string;
  notification_url?: string;
  eager?: UploadTransformOptions[];
  eager_async?: boolean;
  eager_notification_url?: string;
  // ... additional MediaHub-specific options
}

export interface UploadTransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'limit' | 'thumb' | 'scale' | 'crop';
  gravity?: 'face' | 'auto' | string;
  quality?: number | 'auto';
  radius?: number | 'max';
  effect?: string;
  opacity?: number;
  border?: string;
  background?: string;
  overlay?: string;
  underlay?: string;
  // ... MediaHub-specific transformations
}

export interface ExplicitOptions extends Omit<UploadOptions, 'file'> {
  eager?: UploadTransformOptions[];
  eager_async?: boolean;
  type?: string;
}

export interface RenameOptions {
  overwrite?: boolean;
  invalidate?: boolean;
}

export interface DeleteOptions {
  invalidate?: boolean;
  resource_type?: string;
  type?: string;
}

export interface MultiOptions {
  async?: boolean;
  notification_url?: string;
  transformation?: UploadTransformOptions[];
}

export interface ArchiveOptions {
  tags?: string[];
  public_ids?: string[];
  prefix?: string;
  transform?: UploadTransformOptions;
  target_format?: string;
  async?: boolean;
  notification_url?: string;
}

export interface UploadResponse {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width?: number;
  height?: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  original_filename?: string;
  // ... MediaHub-specific response fields
}