// documentsType.ts
export interface IExperience {
  _id?: string;
  title: string | null;
  companyName: string | null;
  city: string | null;
  state: string | null;
  startDate: string | null;
  endDate?: string | null;
  currentlyWorking: boolean;
  workSummary: string | null;
}

export interface IEducation {
  _id?: string;
  universityName: string | null;
  startDate: string | null;
  endDate: string | null;
  degree: string | null;
  major: string | null;
  description: string | null;
}

export interface ISkill {
  _id?: string;
  name: string | null;
  rating?: number;
}

export interface IPersonalInfo {
  _id?: string;
  firstName?: string | null;
  lastName?: string | null;
  jobTitle?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
}

export interface IDocument {
  _id: string;
  userId: string;
  documentId: string;
  title: string;
  summary: string | null;
  themeColor?: string | null;
  currentPosition?: number | null;
  status: "private" | "public" | "archived";
  authorName?: string | null;
  authorEmail?: string | null;
  thumbnail?: string | null;
  experiences: IExperience[];
  educations: IEducation[];
  skills: ISkill[];
  personalInfo?: IPersonalInfo | null;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// Interface for the restore request body
export interface IRestoreDocumentRequest {
  documentId: string;
  status: "archived";
}
export interface IRestoreDocumentResponse {
  success: boolean;
  message: string;
  data: IDocument;
}
/**
 * Interface for the overall API response structure.
 */
export interface IGetAllDocumentApiResponse {
  success: boolean;
  message: string;
  data: IDocument[];
}

export type ICreateDocumentApiResponse = {
  success: boolean;
  message: string;
  data: IDocument;
};

export interface IUpdateDocumentRequest {
  themeColor?: string | null;
  thumbnail?: string;
  personalInfo?: IPersonalInfo;
  experiences?: IExperience[];
  educations?: IEducation[];
  skills?: ISkill[];
  // Add other fields that can be updated
}

export interface IUpdateDocumentResponse {
  success: boolean;
  message: string;
  data: IDocument;
}
