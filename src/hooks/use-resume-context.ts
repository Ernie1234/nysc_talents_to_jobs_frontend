import { ResumeInfoContext } from "@/context/resume-info-provider";
import { useContext } from "react";

export const useResumeContext = () => {
  const context = useContext(ResumeInfoContext);
  if (!context) {
    throw new Error(
      "useResumeContext must be used within a ResumeInfoProvider"
    );
  }
  return context;
};
