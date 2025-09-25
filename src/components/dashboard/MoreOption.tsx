import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useResumeContext } from "@/context/resume-info-provider";

import { Loader, MoreHorizontal, Redo, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import useUpdateDocument from "@/hooks/use-update-document";
import type { StatusType } from "@/types/resume-type";

const MoreOption = () => {
  const navigate = useNavigate();
  const { resumeInfo, onUpdate } = useResumeContext();

  const { mutateAsync, isLoading: isPending } = useUpdateDocument();

  const handleClick = useCallback(
    async (status: StatusType) => {
      if (!resumeInfo) return;
      await mutateAsync(
        {
          status: status,
        },
        {
          onSuccess: () => {
            onUpdate({
              ...resumeInfo,
              status: status,
            });
            navigate(`/dashboard/`);
            toast.success("Success", {
              description: `Moved to trash successfully`,
            });
          },
          onError() {
            toast.error("Error", {
              description: "Failed to update status",
            });
          },
        }
      );
    },
    [mutateAsync, onUpdate, resumeInfo, navigate]
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="bg-white border
             dark:bg-gray-800"
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            {resumeInfo?.status === "archived" ? (
              <Button
                variant="ghost"
                className="gap-1 !py-2 !cursor-pointer"
                disabled={isPending}
                onClick={() => handleClick("private")}
              >
                <Redo size="15px" />
                Retore resume
                {isPending && <Loader size="15px" className="animate-spin" />}
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="gap-1  !py-2 !cursor-pointer"
                disabled={isPending}
                onClick={() => handleClick("archived")}
              >
                <Trash2 size="15px" />
                Move to Trash
                {isPending && <Loader size="15px" className="animate-spin" />}
              </Button>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default MoreOption;
