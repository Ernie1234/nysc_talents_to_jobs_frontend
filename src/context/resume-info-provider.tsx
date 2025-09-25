/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
// import useGetDocument from "@/features/document/use-get-document-by-id";

import { type ResumeDataType } from "@/types/resume-type";
import { useParams } from "react-router-dom";
import { createContext, useState, type FC, useEffect, useContext } from "react";
import { useGetDocumentByIdQuery } from "@/features/documents/documentsAPI";
import type { IDocument } from "@/features/documents/documentsType";

type ResumeContextType = {
  resumeInfo: ResumeDataType | undefined;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  refetch: () => void;
  onUpdate: (data: ResumeDataType) => void;
  documentId: string | null;
};

export const ResumeInfoContext = createContext<ResumeContextType | undefined>(
  undefined
);

export const ResumeInfoProvider: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const param = useParams();
  const documentId = param.documentId as string;

  const { data, isSuccess, isLoading, isError, refetch } =
    useGetDocumentByIdQuery(documentId);

  const [resumeInfo, setResumeInfo] = useState<ResumeDataType>();

  useEffect(() => {
    if (isSuccess && data) {
      console.log("API Response", data);

      // Handle both response structures
      let documentData: IDocument;

      if (data && "data" in data) {
        // API returns { success, message, data }
        documentData = (data as any).data;
      } else {
        // API returns the document directly
        documentData = data as IDocument;
      }

      setResumeInfo(documentData as ResumeDataType);
    }
  }, [isSuccess, data]);

  const onUpdate = (data: ResumeDataType) => {
    setResumeInfo(data);
  };

  return (
    <ResumeInfoContext.Provider
      value={{
        resumeInfo,
        isSuccess,
        isLoading,
        isError,
        refetch,
        onUpdate,
        documentId,
      }}
    >
      {children}
    </ResumeInfoContext.Provider>
  );
};

export const useResumeContext = () => {
  const context = useContext(ResumeInfoContext);
  if (!context) {
    throw new Error(
      "useResumeContext must be used within a ResumeInfoProvider"
    );
  }
  return context;
};
