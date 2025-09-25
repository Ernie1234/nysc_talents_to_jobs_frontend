import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Dot, FileText, Undo, Loader, Search, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom"; // Changed from next/navigation
import {
  useGetAllUserDocumentQuery,
  useRestoreDocumentMutation,
} from "@/features/documents/documentsAPI";

const TrashListBox = () => {
  const navigate = useNavigate(); // Equivalent to useRouter()
  const { data, isLoading } = useGetAllUserDocumentQuery();
  const [restoreDocument, { isLoading: isRestoring }] =
    useRestoreDocumentMutation();

  const resumes = data?.data ?? [];
  const [search, setSearch] = useState("");

  const filteredDocuments = resumes?.filter((doc) => {
    return doc.title?.toLowerCase()?.includes(search?.toLowerCase());
  });

  const onClick = (docId: string) => {
    // React Router equivalent - different syntax
    navigate(`/dashboard/document/${docId}/edit`);
    // Alternatively, you could use:
    // window.location.href = `/dashboard/document/${docId}/edit`;
  };

  const onRestore = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: string
  ) => {
    event.stopPropagation();

    try {
      await restoreDocument({
        documentId: documentId,
        status: "archived", // This is the current status, we're restoring FROM archive
      }).unwrap(); // unwrap() gives us the actual response data

      toast.success("Success", {
        description: "Document restored successfully",
      });

      // The invalidatesTags in the mutation will automatically refetch the documents
      // But you can also manually refetch if needed:
      // refetch();
    } catch (error) {
      console.error("Failed to restore document:", error);
      toast.error("Error", {
        description: "Failed to restore document",
      });
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          className="text-[15px] gap-[2px] items-center"
          variant="outline"
        >
          <Trash2 size="15px" />
          <span>All Trash</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="bg-background w-[22rem] !px-2"
        align="end"
        alignOffset={0}
        forceMount
      >
        {isLoading ? (
          <div className="w-full flex flex-col gap-2 pt-3">
            <Skeleton className="h-6" />
            <Skeleton className="h-6" />
            <Skeleton className="h-6" />
          </div>
        ) : (
          <div className="text-sm">
            <div className="flex items-center gap-x-1 p-2">
              <Search className="w-4 h-4" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-7 px-2 bg-secondary"
                placeholder="Filter by resume title"
              />
            </div>
            <div className="mt-2 px-1 pb-1">
              <p className="hidden last:block text-xs text-center text-muted-foreground">
                No documents found
              </p>

              {filteredDocuments?.map((doc) => (
                <div
                  key={doc._id}
                  role="button"
                  onClick={() => onClick(doc.documentId)}
                  className="text-sm rounded-s w-full hover:bg-primary/5 flex items-center justify-between py-1 px-1"
                >
                  <div className="flex items-start gap-1">
                    <FileText size="15px" className="mt-[3px]" />
                    <div className="flex flex-col">
                      <h5 className="font-semibold text-sm truncate block w-[200px]">
                        {doc.title}
                      </h5>
                      <div className="flex items-center !text-[12px]">
                        <span className="flex items-center capitalize gap-[2px]">
                          {doc.status}
                        </span>
                        <Dot size="15px" />
                        <span className="items-center">
                          {doc.updatedAt &&
                            format(doc.updatedAt, "MMM dd, yyyy")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div
                      role="button"
                      onClick={(e) => onRestore(e, doc.documentId)}
                      className="rounded-sm hover:bg-neutral-200 w-6 h-6 flex items-center justify-center dark:hover:bg-gray-700"
                    >
                      {isRestoring ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        <Undo className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default TrashListBox;
