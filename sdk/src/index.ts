import { MediaHubConfig } from './core/config';
import { MediaHubClient } from './core/MediaHubClient';

/**
 * Creates a new MediaHub client instance
 */
function createClient(config: MediaHubConfig): MediaHubClient {
  return new MediaHubClient(config);
}

// Named exports
export { MediaHubClient, createClient };
export * from './services/uploader/types';
export * from './core/error';

// Default export for backward compatibility
export default createClient;