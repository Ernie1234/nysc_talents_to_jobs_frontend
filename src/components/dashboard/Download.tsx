import { useCallback, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { DownloadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StatusType } from "@/types/resume-type";
import { toast } from "sonner";
import { formatFileName } from "@/lib/helpers";

const Download = (props: {
  title: string;
  isLoading: boolean;
  status?: StatusType;
}) => {
  const { title, status, isLoading } = props;
  const [loading, setLoading] = useState(false);

  const handleDownload = useCallback(async () => {
    const resumeElement = document.getElementById("resume-preview-id");
    if (!resumeElement) {
      toast.error("Error", {
        description: "Resume element not found",
      });
      return;
    }

    setLoading(true);

    const fileName = formatFileName(title);

    try {
      // Apply safe styles before capturing
      applySafeStyles(resumeElement);

      const canvas = await html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgHeight / imgWidth;
      const pdfImgHeight = pdfWidth * ratio;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfImgHeight);
      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Download Failed", {
        description: "There was an error generating the PDF",
      });
    } finally {
      setLoading(false);
    }
  }, [title]);

  const applySafeStyles = (element: HTMLElement) => {
    // Store original styles
    const originalStyles = element.getAttribute("style") || "";

    // Apply safe styles that don't use oklch
    element.style.setProperty("background-color", "#ffffff", "important");
    element.style.setProperty("color", "#000000", "important");
    element.style.setProperty("border-color", "#d1d5db", "important");

    // Apply to all children
    element.querySelectorAll("*").forEach((child) => {
      const el = child as HTMLElement;
      const compStyles = window.getComputedStyle(el);

      // Only override if oklch is detected
      if (compStyles.backgroundColor.includes("oklch")) {
        el.style.setProperty("background-color", "#f8fafc", "important");
      }
      if (compStyles.color.includes("oklch")) {
        el.style.setProperty("color", "#1f2937", "important");
      }
    });

    // Return a function to restore original styles (optional)
    return () => {
      element.setAttribute("style", originalStyles);
    };
  };

  return (
    <Button
      disabled={isLoading || loading || status === "archived"}
      variant="secondary"
      className="bg-white border gap-1
                   dark:bg-gray-800 !p-2
                    min-w-9 lg:min-w-auto lg:p-4"
      onClick={handleDownload}
    >
      <div className="flex items-center gap-1">
        <DownloadCloud size="17px" />
        <span className="hidden lg:flex">
          {loading ? "Generating PDF..." : "Download Resume"}
        </span>
      </div>
    </Button>
  );
};

export default Download;
