// types.ts
export interface FileWithPreview extends File {
    id: string;
    name: string;
    size: number;
    type: string;
    lastModified: number;
    preview?: string;
    uploadProgress?: number;
    status?: "idle" | "uploading" | "success" | "error";
    googleDriveData?: GoogleDriveFile;
    source: "local" | "google-drive" | "dropbox" | "url";
    errorMessage?: string;
  }
  
  export interface GoogleDriveFile {
    id: string;
    name: string;
    mimeType: string;
    thumbnailUrl?: string;
    size?: number;
    source: "google-drive";
  }
  

  export type UploadStatus = "idle" | "success" | "error";
  
  export interface UploadDialogProps {
    open: boolean;
    onClose: () => void;
    onUpload: (formData: FormData) => Promise<void>;
    maxSizeMB?: number;
    allowedTypes?: string[];
    multiple?: boolean;
    maxFiles?: number;
  }
  
  export interface FileUploadAreaProps {
    isDragging: boolean;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave: () => void;
    onClick: () => void;
    allowedTypes: string[];
    maxSizeMB: number;
    multiple: boolean;
    maxFiles: number;
    inputRef: React.RefObject<HTMLInputElement>;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }