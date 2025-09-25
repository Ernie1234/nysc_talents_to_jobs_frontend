/* eslint-disable @typescript-eslint/no-explicit-any */
import { useUpdateDocumentMutation } from "@/features/documents/documentsAPI";
import { useParams } from "react-router-dom";

export const useUpdateDocument = () => {
  const params = useParams();
  const documentId = params.documentId as string;

  const [updateDocument, { isLoading, error }] = useUpdateDocumentMutation();

  const mutateAsync = async (
    updates: any,
    options?: {
      onSuccess?: () => void;
      onError?: (error: any) => void;
    }
  ) => {
    try {
      const result = await updateDocument({ documentId, updates }).unwrap();

      if (options?.onSuccess) {
        options.onSuccess();
      }

      return result;
    } catch (error) {
      if (options?.onError) {
        options.onError(error);
      }
      throw error;
    }
  };

  return {
    mutateAsync,
    isLoading,
    error,
  };
};

export default useUpdateDocument;
