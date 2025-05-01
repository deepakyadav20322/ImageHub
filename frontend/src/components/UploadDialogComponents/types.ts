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
    errorMessage?: string;
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