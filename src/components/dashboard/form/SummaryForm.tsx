import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useResumeContext } from "@/context/resume-info-provider";
import type { ResumeDataType } from "@/types/resume-type";
import { AIChatSession } from "@/lib/google-ai-model";
import { Loader, Sparkles } from "lucide-react";
import { useCallback, useState } from "react";
import { generateThumbnail } from "@/lib/helpers";
import useUpdateDocument from "@/hooks/use-update-document";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface GeneratesSummaryType {
  fresher: string;
  mid: string;
  experienced: string;
}

const prompt = `Job Title: {jobTitle}. Based on the job title, please generate concise 
and complete summaries for my resume in JSON format, incorporating the following experience
levels: fresher, mid, and experienced. Each summary should be limited to 3 to 4 lines,
reflecting a personal tone and showcasing specific relevant programming languages, technologies,
frameworks, and methodologies without any placeholders or gaps. Ensure that the summaries are
engaging and tailored to highlight unique strengths, aspirations, and contributions to collaborative
projects, demonstrating a clear understanding of the role and industry standards.

Return the response in valid JSON format only, like this:
{
  "fresher": "summary text here",
  "mid": "summary text here", 
  "experienced": "summary text here"
}`;

const SummaryForm = (props: { handleNext: () => void }) => {
  const { handleNext } = props;
  const { resumeInfo, onUpdate } = useResumeContext();

  const { mutateAsync, isLoading: isPending } = useUpdateDocument();

  const [loading, setLoading] = useState(false);
  const [aiGeneratedSummary, setAiGeneratedSummary] =
    useState<GeneratesSummaryType | null>(null);

  const handleChange = (e: { target: { value: string } }) => {
    const { value } = e.target;
    const resumeDataInfo = resumeInfo as ResumeDataType;
    const updatedInfo = {
      ...resumeDataInfo,
      summary: value,
    };
    onUpdate(updatedInfo);
  };

  const handleSubmit = useCallback(
    async (e: { preventDefault: () => void }) => {
      e.preventDefault();
      if (!resumeInfo) return;
      const thumbnail = await generateThumbnail();
      const currentNo = resumeInfo?.currentPosition
        ? resumeInfo?.currentPosition + 1
        : 1;

      await mutateAsync(
        {
          currentPosition: currentNo,
          thumbnail: thumbnail,
          summary: resumeInfo?.summary,
        },
        {
          onSuccess: () => {
            toast.success("Summary updated successfully");
            handleNext();
          },
          onError: () => {
            toast.error("Failed to update summary");
          },
        }
      );
    },
    [resumeInfo, mutateAsync, handleNext]
  );

  const GenerateSummaryFromAI = async () => {
    try {
      const jobTitle = resumeInfo?.personalInfo?.jobTitle;

      if (!jobTitle) {
        toast.error("Job title is required", {
          description: "Please set your job title first",
        });
        return;
      }

      if (!jobTitle.trim()) {
        toast.error("Job title is empty", {
          description: "Please enter a valid job title",
        });
        return;
      }

      setLoading(true);

      const PROMPT = prompt.replace("{jobTitle}", jobTitle);

      console.log("Sending request to Gemini API...");

      const result = await AIChatSession.sendMessage(PROMPT);

      if (!result || !result.response) {
        throw new Error("No response from AI service");
      }

      const responseText = await result.response.text();
      console.log("Raw AI response:", responseText);

      // Clean the response text
      const cleanedText = responseText.replace(/```json|```/g, "").trim();

      try {
        const parsedResponse = JSON.parse(cleanedText) as GeneratesSummaryType;

        // Validate the response structure
        if (
          parsedResponse.fresher &&
          parsedResponse.mid &&
          parsedResponse.experienced
        ) {
          setAiGeneratedSummary(parsedResponse);
          toast.success("AI summary generated successfully");
        } else {
          throw new Error("Invalid response format from AI");
        }
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        // Fallback: try to extract JSON from malformed response
        const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsedResponse = JSON.parse(
            jsonMatch[0]
          ) as GeneratesSummaryType;
          setAiGeneratedSummary(parsedResponse);
          toast.success("AI summary generated successfully");
        } else {
          throw new Error("Failed to parse AI response as JSON");
        }
      }
    } catch (error: any) {
      console.error("Error generating summary:", error);

      let errorMessage = "Failed to generate summary";

      if (error.message?.includes("API key")) {
        errorMessage =
          "Invalid API key. Please check your Gemini API configuration.";
      } else if (error.message?.includes("quota")) {
        errorMessage = "API quota exceeded. Please try again later.";
      } else if (
        error.message?.includes("network") ||
        error.message?.includes("fetch")
      ) {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (error.message?.includes("parse")) {
        errorMessage = "Failed to process AI response. Please try again.";
      }

      toast.error(errorMessage, {
        description: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = useCallback(
    (summary: string) => {
      if (!resumeInfo) return;
      const resumeDataInfo = resumeInfo as ResumeDataType;
      const updatedInfo = {
        ...resumeDataInfo,
        summary: summary,
      };
      onUpdate(updatedInfo);
      setAiGeneratedSummary(null);
      toast.success("Summary selected");
    },
    [onUpdate, resumeInfo]
  );

  return (
    <div>
      <div className="w-full">
        <h2 className="font-bold text-lg">Summary</h2>
        <p className="text-sm">Add summary for your resume</p>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="flex items-end justify-between">
            <Label>Add Summary</Label>
            <Button
              variant="outline"
              type="button"
              className="gap-1"
              disabled={
                loading || isPending || !resumeInfo?.personalInfo?.jobTitle
              }
              onClick={GenerateSummaryFromAI}
            >
              {loading ? (
                <Loader size="15px" className="animate-spin" />
              ) : (
                <Sparkles size="15px" className="text-purple-500" />
              )}
              {loading ? "Generating..." : "Generate with AI"}
            </Button>
          </div>

          {!resumeInfo?.personalInfo?.jobTitle && (
            <p className="text-sm text-amber-600 mt-2">
              Please set your job title first to generate AI summaries.
            </p>
          )}

          <Textarea
            className="mt-5 min-h-36"
            required
            value={resumeInfo?.summary || ""}
            onChange={handleChange}
            placeholder="Enter your professional summary or generate one with AI..."
          />

          {loading && (
            <div className="flex items-center justify-center p-4">
              <Loader className="animate-spin h-6 w-6 text-purple-500" />
              <span className="ml-2 text-sm">Generating AI summaries...</span>
            </div>
          )}

          {aiGeneratedSummary && (
            <div className="mt-6">
              <h5 className="font-semibold text-[15px] my-4">AI Suggestions</h5>
              {Object.entries(aiGeneratedSummary).map(
                ([experienceType, summary], index) => (
                  <Card
                    key={index}
                    className="my-4 bg-primary/5 shadow-none border-primary/30 cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => handleSelect(summary)}
                  >
                    <CardHeader className="py-3">
                      <CardTitle className="font-semibold text-md capitalize">
                        {experienceType} Level
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="whitespace-pre-line">{summary}</p>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          )}

          <Button
            className="mt-6 w-full"
            type="submit"
            disabled={isPending || loading || resumeInfo?.status === "archived"}
          >
            {isPending ? (
              <>
                <Loader size="15px" className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SummaryForm;
