import React, { useState } from "react";
import {
  EditorProvider,
  Editor,
  Toolbar,
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnStrikeThrough,
  Separator,
  BtnNumberedList,
  BtnBulletList,
  BtnLink,
  type ContentEditableEvent,
} from "react-simple-wysiwyg";
import { Loader, Sparkles } from "lucide-react";
import { AIChatSession } from "@/lib/google-ai-model";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const PROMPT = `Given the job title "{jobTitle}",
 create 6-7 concise and personal bullet points in
  HTML stringify format that highlight my key
  skills, relevant technologies, and significant
   contributions in that role. Do not include
    the job title itself in the output. Provide
     only the bullet points inside an unordered
     list.`;

interface RichTextEditorProps {
  jobTitle: string | null;
  initialValue: string;
  onEditorChange: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = (props) => {
  const { jobTitle, initialValue, onEditorChange } = props;

  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(initialValue || "");

  const GenerateSummaryFromAI = async () => {
    try {
      if (!jobTitle) {
        toast.error("Must provide Job Position"); // Changed from success to error
        return;
      }
      setLoading(true);
      const prompt = PROMPT.replace("{jobTitle}", jobTitle);
      const result = await AIChatSession.sendMessage(prompt);
      const responseText = await result.response.text();
      const validJsonArray = JSON.parse(`[${responseText}]`);

      setValue(validJsonArray?.[0] || "");
      onEditorChange(validJsonArray?.[0] || "");
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between my-2">
        <Label>Work Summary</Label>
        <Button
          variant="outline"
          type="button"
          className="gap-1"
          disabled={loading}
          onClick={GenerateSummaryFromAI} // Simplified onClick
        >
          <Sparkles size="15px" className="text-purple-500" />
          Generate with AI
          {loading && <Loader size="13px" className="animate-spin" />}
        </Button>
      </div>

      <EditorProvider>
        <Editor
          value={value}
          containerProps={{
            style: {
              resize: "vertical",
              lineHeight: 1.2,
              fontSize: "13.5px",
            },
          }}
          onChange={(e: ContentEditableEvent) => {
            const newValue = e.target.value;
            setValue(newValue);
            onEditorChange(newValue);
          }}
        >
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
};

export default RichTextEditor;
