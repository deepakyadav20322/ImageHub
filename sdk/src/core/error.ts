export class MediaHubError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: Record<string, unknown>,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'MediaHubError';
  }

  toString(): string {
    return `[MediaHubError ${this.code}] ${this.message}`;
  }
}

// Specific error types
export class UploadError extends MediaHubError {
  constructor(message: string, public publicId?: string) {
    super('UPLOAD_ERROR', message, { publicId });
  }
}

export class ConfigurationError extends MediaHubError {
  constructor(message: string) {
    super('CONFIG_ERROR', message);
  }
}

export class TransformationError extends MediaHubError {
  constructor(message: string, public transformation: string) {
    super('TRANSFORM_ERROR', message, { transformation });
  }
}