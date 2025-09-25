// types/resume-type.ts
export type ExperienceType = {
  _id?: string;
  title: string | null;
  companyName: string | null;
  city: string | null;
  state: string | null;
  startDate: string | null;
  endDate?: string | null;
  currentlyWorking: boolean;
  workSummary: string | null;
};

export type EducationType = {
  _id?: string;
  universityName: string | null;
  startDate: string | null;
  endDate: string | null;
  degree: string | null;
  major: string | null;
  description: string | null;
};

export type SkillType = {
  _id?: string;
  name: string | null;
  rating?: number;
};

export type PersonalInfoType = {
  _id?: string;
  firstName?: string | null;
  lastName?: string | null;
  jobTitle?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
};

export type StatusType = "archived" | "private" | "public" | undefined;

export type ResumeDataType = {
  _id: string;
  documentId: string;
  title: string;
  status: StatusType;
  thumbnail?: string | null;
  personalInfo?: PersonalInfoType | null;
  themeColor?: string | null;
  currentPosition?: number | null;
  summary: string | null;
  experiences?: ExperienceType[] | null;
  educations?: EducationType[] | null;
  skills?: SkillType[] | null;
  updatedAt?: string;
};
