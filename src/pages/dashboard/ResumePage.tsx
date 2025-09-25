import AddResume from "@/components/dashboard/resume/AddResume";
import ResumeList from "@/components/dashboard/resume/ResumeList";
import UploadResume from "@/components/dashboard/resume/UploadResume";
import TrashListBox from "@/components/dashboard/TrashListBox";
import { Separator } from "@/components/ui/separator";

export const ResumePage = () => {
  return (
    <div className="w-full">
      <div className="w-full py-5 px-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Resume Builder</h1>
            <p className="text-base dark:text-inherit">
              Create your own custom resume with AI & Subscribe to the channel
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-3">
            {/* {Trash List} */}
            <TrashListBox />
          </div>
        </div>

        <div className="w-full pt-11">
          <h5
            className="text-xl font-semibold dark:text-inherit
            mb-3
            "
          >
            Create New Resume
          </h5>
          <div className="flex flex-wrap w-full gap-5">
            <AddResume />
            <ResumeList />
          </div>
        </div>
        <Separator className="mt-8" />
        {/* Upload Section */}
        <div className="w-full pt-8">
          <h5 className="text-xl font-semibold dark:text-inherit mb-4">
            Upload Your Resume
          </h5>
          <UploadResume />
        </div>
      </div>
    </div>
  );
};
