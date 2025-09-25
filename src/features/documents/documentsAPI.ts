import { apiClient } from "@/app/api-client";
import type {
  ICreateDocumentApiResponse,
  IDocument,
  IGetAllDocumentApiResponse,
  IRestoreDocumentRequest,
  IRestoreDocumentResponse,
  IUpdateDocumentResponse,
} from "./documentsType";

export const documentApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getAllUserDocument: builder.query<IGetAllDocumentApiResponse, void>({
      query: () => ({
        url: "/documents",
        method: "GET",
      }),
      providesTags: ["documents"],
    }),
    getDocumentById: builder.query<IDocument, string>({
      query: (id) => ({
        url: `/documents/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        success: boolean;
        data: IDocument;
        message: string;
      }) => response.data,
      providesTags: (result, error, id) => [{ type: "documents", id }],
    }),

    createDocument: builder.mutation<
      ICreateDocumentApiResponse,
      Partial<IDocument>
    >({
      query: (newDocument) => ({
        url: "/documents/create",
        method: "POST",
        body: newDocument,
      }),
      invalidatesTags: ["documents"],
    }),

    // Add the update document mutation
    updateDocument: builder.mutation<
      IUpdateDocumentResponse,
      { documentId: string; updates: Partial<IDocument> }
    >({
      query: ({ documentId, updates }) => ({
        url: `/documents/update/${documentId}`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: (result, error, { documentId }) => [
        { type: "documents", id: documentId },
        "documents",
      ],
    }),
    // Add the restore document mutation
    restoreDocument: builder.mutation<
      IRestoreDocumentResponse,
      IRestoreDocumentRequest
    >({
      query: (body) => ({
        url: "/documents/restore/archive",
        method: "PATCH", // or POST depending on your API
        body: body,
      }),
      invalidatesTags: ["documents"], // This will refetch all documents after restore
    }),
  }),
});

export const {
  useGetAllUserDocumentQuery,
  useGetDocumentByIdQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useRestoreDocumentMutation,
} = documentApi;
