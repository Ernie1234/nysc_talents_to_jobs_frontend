import { useId } from "react";
import { useSliderInput } from "@/hooks/use-slider-input";
import { Loader2, Save, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider, SliderThumb } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { nigerianStates } from "@/types/job";
import { SkillsInput } from "@/components/dashboard/employerDashboard/SkillsInput";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useJobForm } from "@/hooks/useJobForm";

const items = [
  { id: 1, price: 80 },
  { id: 2, price: 95 },
  { id: 3, price: 110 },
  { id: 100, price: 9999999 },
];

const EmployerJobCreatePage = () => {
  const id = useId();
  const id1 = useId();
  const id2 = useId();
  const minValue = Math.min(...items.map((item) => item.price));
  const maxValue = Math.max(...items.map((item) => item.price));

  const {
    sliderValues,
    inputValues,
    handleSliderChange,
    handleInputChange,
    validateAndUpdateValue,
  } = useSliderInput({
    minValue,
    maxValue,
    initialValue: [200000, 8000000],
  });

  const { form, onSaveDraft, onPublish, isLoading, error } = useJobForm();
  const hiringLocationType = form.watch("hiringLocation.type");

  // Update form values when slider changes
  const handleSliderChangeWithForm = (values: [number, number]) => {
    handleSliderChange(values);
    form.setValue("salaryRange.min", values[0]);
    form.setValue("salaryRange.max", values[1]);
  };

  const handleInputChangeWithForm = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: 0 | 1
  ) => {
    handleInputChange(e, index);
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      if (index === 0) {
        form.setValue("salaryRange.min", value);
      } else {
        form.setValue("salaryRange.max", value);
      }
    }
  };

  const onSubmitPublish = form.handleSubmit((data) => onPublish(data));
  const onSubmitDraft = form.handleSubmit((data) => onSaveDraft(data));

  return (
    <Form {...form}>
      <form className="flex flex-col space-y-4 w-full p-5 md:p-0 mt-8">
        <div className="flex justify-between items-start gap-8 flex-wrap w-full">
          <div className="flex flex-col">
            <h4 className="scroll-m-20 text-xl font-semibold text-green-800 tracking-tight">
              New Job Creation
            </h4>
            <p className="">
              Create job opportunities that reach millions of capable hands
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onSubmitDraft}
              disabled={isLoading}
              className="bg-green-100 hover:bg-green-300 text-black"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save />
              )}
              Save as Draft
            </Button>
            <Button
              type="button"
              onClick={onSubmitPublish}
              disabled={isLoading}
              className="hover:bg-green-800"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send />
              )}
              Post Job
            </Button>
          </div>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Separator />
        {/* Job Title */}
        <div className="flex flex-col md:flex-row items-start gap-5 md:gap-24 w-full mb-6">
          <div className="flex flex-col">
            <h4 className="text-lg font-semibold text-green-900">
              Job Title<span className="text-rose-500">*</span>
            </h4>
            <p className="text-muted-foreground text-sm">
              Job titles must describe one position.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="e.g. Lead Product Manager"
                      className="w-md bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>40 characters</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Separator /> {/* Job Type */}
        <div className="flex flex-col md:flex-row items-start gap-5 md:gap-24 w-full mb-6">
          <div className="flex flex-col">
            <h4 className="text-lg font-semibold text-green-900">
              Job Type<span className="text-rose-500">*</span>
            </h4>
            <p className="text-muted-foreground text-sm">
              You can select job types.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <FormField
              control={form.control}
              name="jobType"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[250px] bg-white">
                        <SelectValue placeholder="Select Job Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Job types</SelectLabel>
                        <SelectItem value="fulltime">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                        <SelectItem value="intern">Intern</SelectItem>
                        <SelectItem value="co-founder">Co-founder</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Separator />
        {/* Experience Level */}
        <div className="flex flex-col md:flex-row items-start gap-5 md:gap-24 w-full mb-6">
          <div className="flex flex-col">
            <h4 className="text-lg font-semibold text-green-900">
              Experience Level<span className="text-rose-500">*</span>
            </h4>
            <p className="text-muted-foreground text-sm">
              Select the required experience level for this position.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <FormField
              control={form.control}
              name="experienceLevel"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[250px] bg-white">
                        <SelectValue placeholder="Select Experience Level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Experience Levels</SelectLabel>
                        <SelectItem value="intern">Intern</SelectItem>
                        <SelectItem value="entry-level">Entry Level</SelectItem>
                        <SelectItem value="mid-level">Mid Level</SelectItem>
                        <SelectItem value="senior-level">
                          Senior Level
                        </SelectItem>
                        <SelectItem value="executive">Executive</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Separator />
        {/* Work Location */}
        <div className="flex flex-col md:flex-row items-start gap-5 md:gap-24 w-full mb-6">
          <div className="flex flex-col">
            <h4 className="text-lg font-semibold text-green-900">
              Work Location<span className="text-rose-500">*</span>
            </h4>
            <p className="text-muted-foreground text-sm">
              Specify where the work will be performed.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <FormField
              control={form.control}
              name="workLocation"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[250px] bg-white">
                        <SelectValue placeholder="Select Work Location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Work Locations</SelectLabel>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="on-site">On-site</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Separator />
        {/* Job Period */}
        <div className="flex flex-col md:flex-row items-start gap-5 md:gap-24 w-full mb-6">
          <div className="flex flex-col">
            <h4 className="text-lg font-semibold text-green-900">
              Job Period<span className="text-rose-500">*</span>
            </h4>
            <p className="text-muted-foreground text-sm">
              Expected duration of the employment.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <FormField
              control={form.control}
              name="jobPeriod"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[250px] bg-white">
                        <SelectValue placeholder="Select Job Period" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Job Periods</SelectLabel>
                        <SelectItem value="1-3 months">1-3 months</SelectItem>
                        <SelectItem value="3-6 months">3-6 months</SelectItem>
                        <SelectItem value="6-12 months">6-12 months</SelectItem>
                        <SelectItem value="more than 12 months">
                          More than 12 months
                        </SelectItem>
                        <SelectItem value="permanent">Permanent</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Separator />
        {/* Skills */}
        <div className="flex flex-col md:flex-row items-start gap-5 md:gap-24 w-full mb-6">
          <div className="flex flex-col">
            <h4 className="text-lg font-semibold text-green-900">
              Required Skills<span className="text-rose-500">*</span>
            </h4>
            <p className="text-muted-foreground text-sm">
              Add the key skills required for this position.
            </p>
          </div>
          <div className="flex-1 max-w-md">
            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <SkillsInput value={field.value} onChange={field.onChange} />
              )}
            />
          </div>
        </div>
        <Separator />
        {/* About the Job */}
        <div className="flex flex-col md:flex-row items-start gap-5 md:gap-24 w-full mb-6">
          <div className="flex flex-col">
            <h4 className="text-lg font-semibold text-green-900">
              About the Job<span className="text-rose-500">*</span>
            </h4>
            <p className="text-muted-foreground text-sm">
              Describe the role, responsibilities, and what makes this position
              exciting.
            </p>
          </div>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="aboutJob"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the job role, responsibilities, team culture, and what makes this position exciting..."
                      className="min-h-[120px] bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value.length}/2000 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Separator />
        {/* Job Requirements */}
        <div className="flex flex-col md:flex-row items-start gap-5 md:gap-24 w-full mb-6">
          <div className="flex flex-col">
            <h4 className="text-lg font-semibold text-green-900">
              Job Requirements<span className="text-rose-500">*</span>
            </h4>
            <p className="text-muted-foreground text-sm">
              List the specific requirements and qualifications needed.
            </p>
          </div>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="jobRequirements"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="List the specific requirements, qualifications, education, and experience needed..."
                      className="min-h-[120px] bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value.length}/1000 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Separator />
        {/* Salary Range - Updated to sync with form */}
        <div className="flex flex-col md:flex-row items-start gap-5 md:gap-24 w-full mb-6">
          <div className="flex flex-col">
            <h4 className="text-lg font-semibold text-green-900">Salary</h4>
            <p className="text-muted-foreground text-sm max-w-xs">
              Please specify the estimated salary range for the role.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col gap-2.5">
              <Label>Salary Range (NGN)</Label>
              <Slider
                value={sliderValues}
                onValueChange={handleSliderChangeWithForm}
                min={minValue}
                max={maxValue}
                step={10}
                aria-label="Salary Range Slider"
              >
                <SliderThumb />
                <SliderThumb />
              </Slider>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-2.5">
                <Label htmlFor={`${id}-min`}>Min Salary</Label>
                <Input
                  id={`${id}-min`}
                  type="number"
                  value={inputValues[0]}
                  onChange={(e) => handleInputChangeWithForm(e, 0)}
                  onBlur={() => validateAndUpdateValue(inputValues[0], 0)}
                  placeholder={`₦${minValue}`}
                />
              </div>
              <div className="space-y-2.5">
                <Label htmlFor={`${id}-max`}>Max Salary</Label>
                <Input
                  id={`${id}-max`}
                  type="number"
                  value={inputValues[1]}
                  onChange={(e) => handleInputChangeWithForm(e, 1)}
                  onBlur={() => validateAndUpdateValue(inputValues[1], 1)}
                  placeholder={`₦${maxValue}`}
                />
              </div>
            </div>
          </div>
        </div>
        <Separator />
        {/* Hiring Location */}
        <div className="flex flex-col md:flex-row items-start gap-5 md:gap-24 w-full mb-6">
          <div className="flex flex-col">
            <h4 className="text-lg font-semibold text-green-900">
              Hiring Location
            </h4>
            <p className="text-muted-foreground text-sm max-w-xs">
              The location will be set to national-wide by default, but you can
              specify state.
            </p>
          </div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="hiringLocation.type"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nation-wide" id={id1} />
                        <Label htmlFor={id1}>Nation Wide</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="state" id={id2} />
                        <Label htmlFor={id2}>Select State</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {hiringLocationType === "state" && (
              <FormField
                control={form.control}
                name="hiringLocation.state"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Select State</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[250px] bg-white">
                          <SelectValue placeholder="Choose a state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Nigerian States</SelectLabel>
                          {nigerianStates.map((state) => (
                            <SelectItem key={state.value} value={state.value}>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {state.label}
                                </span>
                                <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                                  {state.abbreviation}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>
      </form>
    </Form>
  );
};

export default EmployerJobCreatePage;
