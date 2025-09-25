import React, { useCallback, useEffect } from "react";
import { useResumeContext } from "@/context/resume-info-provider";
import { Button } from "@/components/ui/button";
import { Loader, Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useUpdateDocument from "@/hooks/use-update-document";
import { toast } from "sonner";
import { generateThumbnail } from "@/lib/helpers";
import type { EducationType } from "@/types/resume-type";

const initialState: EducationType = {
  _id: undefined,
  universityName: "",
  startDate: "",
  endDate: "",
  degree: "",
  major: "",
  description: "",
};

const EducationForm = (props: { handleNext: () => void }) => {
  const { handleNext } = props;
  const { resumeInfo, onUpdate } = useResumeContext();
  const { mutateAsync, isLoading: isPending } = useUpdateDocument();

  const [educationList, setEducationList] = React.useState<EducationType[]>(
    () => {
      return resumeInfo?.educations?.length
        ? resumeInfo.educations
        : [initialState];
    }
  );

  // Update the resume context when educationList changes
  useEffect(() => {
    if (!resumeInfo) return;
    onUpdate({
      ...resumeInfo,
      educations: educationList,
    });
  }, [educationList, resumeInfo, onUpdate]);

  const handleChange = (
    e: { target: { name: string; value: string } },
    index: number
  ) => {
    const { name, value } = e.target;

    setEducationList((prevState) => {
      const newEducationList = [...prevState];
      newEducationList[index] = {
        ...newEducationList[index],
        [name]: value,
      };
      return newEducationList;
    });
  };

  const addNewEducation = () => {
    if (educationList.length < 5) {
      setEducationList([...educationList, { ...initialState }]);
    }
  };

  const removeEducation = (index: number) => {
    if (educationList.length > 1) {
      const updatedEducation = [...educationList];
      updatedEducation.splice(index, 1);
      setEducationList(updatedEducation);
    }
  };

  const handleSubmit = useCallback(
    async (e: { preventDefault: () => void }) => {
      e.preventDefault();

      try {
        const thumbnail = await generateThumbnail();
        const currentNo = resumeInfo?.currentPosition
          ? resumeInfo.currentPosition + 1
          : 1;

        // ✅ FIX: Send educations as an array, not as an object with _id
        await mutateAsync(
          {
            currentPosition: currentNo,
            thumbnail: thumbnail,
            educations: educationList, // ✅ Correct field name and structure
          },
          {
            onSuccess: () => {
              toast.success("Success", {
                description: "Education updated successfully",
              });
              handleNext();
            },
            onError: (error) => {
              console.error("Education update error:", error);
              toast.error("Error", {
                description: "Failed to update education",
              });
            },
          }
        );
      } catch (error) {
        console.error("Submit error:", error);
        toast.error("Error", {
          description: "Failed to update education",
        });
      }
    },
    [resumeInfo, educationList, handleNext, mutateAsync]
  );

  return (
    <div>
      <div className="w-full">
        <h2 className="font-bold text-lg">Education</h2>
        <p className="text-sm">Add your education details</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="border w-full h-auto divide-y-[1px] rounded-md px-3 pb-4 my-5">
          {educationList?.map((item, index) => (
            <div key={index} className="relative">
              <div className="grid grid-cols-2 mb-5 pt-4 gap-3">
                {educationList.length > 1 && (
                  <Button
                    variant="secondary"
                    type="button"
                    disabled={isPending}
                    className="size-[20px] text-center rounded-full absolute top-1 right-0 !bg-black dark:!bg-gray-600 text-white"
                    size="icon"
                    onClick={() => removeEducation(index)}
                  >
                    <X size="13px" />
                  </Button>
                )}

                <div className="col-span-2">
                  <Label className="text-sm">University Name</Label>
                  <Input
                    name="universityName"
                    placeholder="University name"
                    required
                    value={item?.universityName || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div>
                  <Label className="text-sm">Degree</Label>
                  <Input
                    name="degree"
                    placeholder="e.g., Bachelor's"
                    required
                    value={item?.degree || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div>
                  <Label className="text-sm">Major</Label>
                  <Input
                    name="major"
                    placeholder="e.g., Computer Science"
                    required
                    value={item?.major || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div>
                  <Label className="text-sm">Start Date</Label>
                  <Input
                    name="startDate"
                    type="date"
                    required
                    value={item?.startDate || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div>
                  <Label className="text-sm">End Date</Label>
                  <Input
                    name="endDate"
                    type="date"
                    required
                    value={item?.endDate || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div className="col-span-2 mt-1">
                  <Label className="text-sm">Description</Label>
                  <Textarea
                    name="description"
                    placeholder="Describe your education, achievements, etc."
                    value={item?.description || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
              </div>

              {index === educationList.length - 1 &&
                educationList.length < 5 && (
                  <Button
                    className="gap-1 mt-3 text-primary border-primary/50"
                    variant="outline"
                    type="button"
                    disabled={isPending}
                    onClick={addNewEducation}
                  >
                    <Plus size="15px" />
                    Add More Education
                  </Button>
                )}
            </div>
          ))}
        </div>

        <Button
          className="mt-4"
          type="submit"
          disabled={isPending || resumeInfo?.status === "archived"}
        >
          {isPending && <Loader size="15px" className="animate-spin mr-2" />}
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default EducationForm;
