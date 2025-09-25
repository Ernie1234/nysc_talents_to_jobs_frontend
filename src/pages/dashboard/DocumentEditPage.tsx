import ResumeForm from "@/components/dashboard/resume/ResumeForm";
import ResumePreview from "@/components/dashboard/resume/ResumePreview";
import TopSection from "@/components/dashboard/TopSection";
import { ResumeInfoProvider } from "@/context/resume-info-provider";

const DocumentEditPage = () => {
  return (
    <ResumeInfoProvider>
      <div className="relative w-full">
        <div
          className="w-full mx-auto max-w-7xl
        py-4 px-5"
        >
          <TopSection />
          <div className="w-full mt-1">
            <div
              className="flex flex-col lg:flex-row
            items-start w-full py-3 gap-6
                  
            "
            >
              {/* {Form Section} */}
              <ResumeForm />
              {/* {Preview Section} */}
              <ResumePreview />
            </div>
          </div>
        </div>
      </div>
    </ResumeInfoProvider>
  );
};

export default DocumentEditPage;
