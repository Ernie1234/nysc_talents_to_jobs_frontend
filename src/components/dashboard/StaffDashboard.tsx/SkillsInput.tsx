// components/skills-input.tsx
import { useState, useRef } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface SkillsInputProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function SkillsInput({ value, onChange }: SkillsInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !value.includes(trimmedSkill) && value.length < 10) {
      onChange([...value, trimmedSkill]);
      setInputValue("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(value.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      removeSkill(value[value.length - 1]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <FormItem>
      <FormLabel>Skills</FormLabel>
      <FormControl>
        <div className="space-y-3">
          <div
            className="flex flex-wrap gap-2 p-2 border border-input rounded-md bg-background hover:border-primary focus-within:border-primary min-h-[42px]"
            onClick={() => inputRef.current?.focus()}
          >
            {value.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="px-2 py-1 text-sm"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={value.length === 0 ? "Add skills..." : ""}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 min-w-[120px]"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addSkill(inputValue)}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Skill
          </Button>
        </div>
      </FormControl>
      <FormDescription>
        Add relevant skills. Press Enter or comma to add. Maximum 10 skills
        allowed.
      </FormDescription>
      <FormMessage />
    </FormItem>
  );
}
