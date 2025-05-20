
import { MediaHubClient } from '../../core/MediaHubClient';
import {
  UploadOptions,
  UploadResponse,
  UploadTransformOptions,
  ExplicitOptions,
  RenameOptions,
  DeleteOptions,
  MultiOptions,
  ArchiveOptions
} from './types';
import { UploadStream } from './uploadStream';
import { MediaHubError } from '../../core/error';

export class Uploader {
  constructor(private client: MediaHubClient) {}

  /**
   * Upload a file to MediaHub
   */
  async upload(
    file: string | File | Blob | Buffer,
    options?: UploadOptions
  ): Promise<UploadResponse> {
    this.validateFileInput(file);
    return this.executeUpload('upload', { file, ...options });
  }

  /**
   * Unsigned upload using an upload preset
   */
  async unsignedUpload(
    file: string | File | Blob | Buffer,
    uploadPreset: string,
    options?: Omit<UploadOptions, 'signature' | 'timestamp'>
  ): Promise<UploadResponse> {
    this.validateFileInput(file);
    return this.executeUpload('unsigned_upload', {
      file,
      upload_preset: uploadPreset,
      ...options,
    });
  }

  /**
   * Create a stream-based upload
   */

//   uploadStream(
//     options?: UploadOptions,
//     callback?: (error: Error | null, result?: UploadResponse) => void
//   ): UploadStream {
//     return new UploadStream(this.client, options, callback);
//   }


  /**
   * Explicitly apply transformations to existing asset
   */
  async explicit(
    publicId: string,
    options: ExplicitOptions
  ): Promise<UploadResponse> {
    return this.executeUpload('explicit', { public_id: publicId, ...options });
  }

  /**
   * Rename an asset
   */
  async rename(
    fromPublicId: string,
    toPublicId: string,
    options?: RenameOptions
  ): Promise<UploadResponse> {
    return this.executeUpload('rename', {
      from_public_id: fromPublicId,
      to_public_id: toPublicId,
      ...options,
    });
  }

  /**
   * Delete an asset
   */
  async delete(
    publicId: string,
    options?: DeleteOptions
  ): Promise<UploadResponse> {
    return this.executeUpload('delete', { public_id: publicId, ...options });
  }

  /**
   * Create a sprite from tagged assets
   */
  async multi(tag: string, options?: MultiOptions): Promise<UploadResponse> {
    return this.executeUpload('multi', { tag, ...options });
  }

//   ---------------------------------------------
  /**
   * Generate archive of assets
   */
//   async generateArchive(
//     options: ArchiveOptions
//   ): Promise<UploadResponse> {
//     return this.executeUpload('generate_archive', options);
//   }

  private validateFileInput(file: unknown): void {
    if (typeof file === 'string' || file instanceof Blob || file instanceof File || Buffer.isBuffer(file)) {
      return;
    }
    throw new MediaHubError('INVALID_INPUT', 'Invalid file input type');
  }

  private async executeUpload(
    action: string,
    params: Record<string, unknown>
  ): Promise<UploadResponse> {
    // Implementation would:
    // 1. Prepare request
    // 2. Add authentication if needed
    // 3. Make API call
    // 4. Process response
    throw new Error('Not implemented - actual API call logic goes here');
  }
}