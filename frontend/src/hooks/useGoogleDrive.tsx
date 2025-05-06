// hooks/useGoogleDrive.ts
import { FileWithPreview } from "@/components/UploadDialogComponents/types";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";


declare global {
  interface Window {
    google?: any;
    gapi?: any;
  }
}

export const useGoogleDrive = () => {
  const [isGoogleApiLoaded, setIsGoogleApiLoaded] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const loadGoogleAPI = () => {
      if (!window.google || !window.gapi) {
        const script = document.createElement("script");
        script.src = "https://apis.google.com/js/api.js";
        script.onload = () => {
          window.gapi.load("client:picker", () => {
            setIsGoogleApiLoaded(true);
          });
        };
        script.onerror = () => {
          toast.error("Failed to load Google API");
        };
        document.body.appendChild(script);
      } else {
        setIsGoogleApiLoaded(true);
      }
    };

    loadGoogleAPI();
  }, []);

  const authenticate = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      const scope = ["https://www.googleapis.com/auth/drive.readonly"];

      window.gapi.auth.authorize(
        {
          client_id: clientId,
          scope: scope,
          immediate: false,
        },
        (authResult: any) => {
          if (authResult && !authResult.error) {
            setAccessToken(authResult.access_token);
            resolve(authResult.access_token);
          } else {
            reject(authResult?.error || "Authentication failed");
          }
        }
      );
    });
  };

  const downloadFile = async (fileId: string, accessToken: string): Promise<Blob> => {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    return await response.blob();
  };

  const openPicker = async (callback: (file: FileWithPreview) => void) => {
    try {
      if (!isGoogleApiLoaded) {
        throw new Error("Google API not loaded yet");
      }

      const token = accessToken || (await authenticate());

      // Open picker
      const view = new window.google.picker.View(window.google.picker.ViewId.DOCS_IMAGES);
      const picker = new window.google.picker.PickerBuilder()
        .setOAuthToken(token)
        .addView(view)
        .setCallback(async (data: any) => {
          if (data.action === window.google.picker.Action.PICKED) {
            const file = data.docs[0];
            
            try {
              // Download the file as blob
              const blob = await downloadFile(file.id, token);
              
              // Convert to File object
              const downloadedFile = new File([blob], file.name, {
                type: blob.type,
                lastModified: Date.now(),
              });

              // Create preview
              const preview = file.thumbnailUrl || URL.createObjectURL(blob);

              callback({
                ...downloadedFile,
                id: `gd-${file.id}`,
                preview,
                uploadProgress: 0,
                status: "idle",
                source: "google-drive",
                googleDriveData: {
                  id: file.id,
                  name: file.name,
                  mimeType: file.mimeType,
                  thumbnailUrl: file.thumbnailUrl,
                  size: file.sizeBytes,
                  source: "google-drive",
                },
              });
            } catch (error) {
              toast.error(`Failed to download file: ${error instanceof Error ? error.message : String(error)}`);
            }
          }
        })
        .build();
      picker.setVisible(true);
    } catch (error) {
      toast.error(`Google Drive error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return { openPicker, isGoogleApiLoaded };
};