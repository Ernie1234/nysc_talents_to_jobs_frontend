import { ResumeInfoProvider } from "@/context/resume-info-provider";
import SkillChart from "./SkillChart";

const SkillWrapper = () => {
  return (
    <ResumeInfoProvider>
      <SkillChart />
    </ResumeInfoProvider>
  );
};

export default SkillWrapper;
