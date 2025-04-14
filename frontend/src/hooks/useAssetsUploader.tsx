// hooks/useAssetUploader.ts
import { useUploadAssetsMutation } from "@/redux/apiSlice/itemsApi";

interface UploadParams {
  formdata: FormData;
  userAccountId: string;
  token: string;
  folderId: string;
  refetch?: () => void;
}

export const useAssetUploader = () => {
  const [uploadAssets, { isError, isLoading }] = useUploadAssetsMutation();

  const handleUpload = async ({
    formdata,
    userAccountId,
    token,
    folderId,
    refetch,
  }: UploadParams): Promise<any> => {
    console.log("Files to upload:", formdata);
    console.log("Uploading to folder:", folderId);

    try {
      const response = await uploadAssets({
        bucketName: `${userAccountId}-original`,
        resourceType: "image",
        files: formdata,
        token,
        folderId,
      }).unwrap();

      console.log("Upload success:", response);
      if (refetch) refetch();
      return response;
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  };

  return {
    handleUpload,
    isError,
    isLoading,
  };
};
