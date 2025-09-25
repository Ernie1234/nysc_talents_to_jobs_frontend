import { v4 as uuidv4 } from "uuid";
import html2canvas from "html2canvas";

export const INITIAL_THEME_COLOR = "#7c3aed";

export const generateDocUUID = (): string => {
  const uuid = uuidv4().replace(/-/g, "");
  return `doc-${uuid.substring(0, 16)}`;
};

export const generateThumbnail = async () => {
  const resumeElement = document.getElementById(
    "resume-preview-id"
  ) as HTMLElement;
  if (!resumeElement) {
    console.error("Resume preview element not found");
    return;
  }

  try {
    const canvas = await html2canvas(resumeElement, { scale: 0.5 });
    const thumbnailImage = canvas.toDataURL("image/png");
    return thumbnailImage;
  } catch (error) {
    console.error("Thumbnail generation failed", error);
  }
};

export const formatFileName = (title: string, useHyphen: boolean = true) => {
  const delimiter = useHyphen ? "-" : "_";
  return title.trim().replace(/\s+/g, delimiter) + "pdf";
};

export function getCapitalizedInitials(
  name: string,
  maxInitials: number = 2
): string {
  if (!name || !name.trim()) {
    return "";
  }

  const words = name
    .trim()
    .split(" ")
    .filter((word) => word.length > 0);

  return words
    .slice(0, maxInitials) // Limit to max initials
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

export function getTimeBasedGreeting(firstName?: string): string {
  if (!firstName) {
    return "Good morning";
  }

  const hour = new Date().getHours();

  if (hour < 12) {
    return `Good morning, ${firstName}`;
  } else if (hour < 18) {
    return `Good afternoon, ${firstName}`;
  } else {
    return `Good evening, ${firstName}`;
  }
}
