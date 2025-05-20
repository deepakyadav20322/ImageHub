import { MediaHubConfig } from './config';
import { Uploader } from '../services/uploader/uploader';
import { MediaHubError } from './error';

export class MediaHubClient {
  public config: MediaHubConfig;
  public uploader: Uploader;
  // Future services: public assets, public transformations, etc.

  constructor(config: MediaHubConfig) {
    if (!config.cloud_name) {
      throw new MediaHubError('CONFIG_ERROR', 'cloud_name is required');
    }
    if (!config.api_key) {
      throw new MediaHubError('CONFIG_ERROR', 'api_key is required');
    }

    this.config = {
      secure: true,
      timeout: 30000,
      api_version: 'v1',
      ...config,
    };

    // Initialize services
    this.uploader = new Uploader(this);
  }

  /**
   * Updates configuration dynamically
   */
  updateConfig(updates: Partial<MediaHubConfig>): void {
    this.config = { ...this.config, ...updates };
  }
}