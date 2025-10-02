/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/onboarding/steps/SkillsStep.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Star } from "lucide-react";

interface Skill {
  name: string;
  level: number;
}

interface SkillsStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  userRole?: string;
  isLastStep: boolean;
}

export const SkillsStep: React.FC<SkillsStepProps> = ({
  data,
  onNext,
  onBack,
}) => {
  const [skills, setSkills] = useState<Skill[]>(data.skills || []);
  const [newSkill, setNewSkill] = useState("");

  const commonSkills = [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "TypeScript",
    "HTML/CSS",
    "Git",
    "SQL",
    "Communication",
    "Problem Solving",
    "Teamwork",
    "Leadership",
    "Project Management",
  ];

  const levelLabels = {
    1: "Beginner",
    2: "Basic",
    3: "Intermediate",
    4: "Advanced",
    5: "Expert",
  };

  const addSkill = (skillName?: string) => {
    const skillToAdd = skillName || newSkill.trim();
    if (
      skillToAdd &&
      !skills.find((s) => s.name.toLowerCase() === skillToAdd.toLowerCase())
    ) {
      setSkills((prev) => [
        ...prev,
        {
          name: skillToAdd,
          level: 3, // Default to intermediate
        },
      ]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillName: string) => {
    setSkills((prev) => prev.filter((s) => s.name !== skillName));
  };

  const updateSkillLevel = (skillName: string, level: number) => {
    setSkills((prev) =>
      prev.map((s) => (s.name === skillName ? { ...s, level } : s))
    );
  };

  const handleSubmit = () => {
    onNext({ skills });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Add Your Skills</h3>
        <p className="text-sm text-muted-foreground">
          Rate your proficiency level for each skill (1-5 stars)
        </p>
      </div>

      {/* Add New Skill */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="skill">Skill Name</Label>
          <div className="flex space-x-2">
            <Input
              id="skill"
              placeholder="Enter a skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addSkill()}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={() => addSkill()}
              disabled={!newSkill.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Common Skills */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Common Skills</Label>
        <div className="flex flex-wrap gap-2">
          {commonSkills.map((skill) => (
            <Button
              key={skill}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addSkill(skill)}
              disabled={skills.some((s) => s.name === skill)}
            >
              {skill}
            </Button>
          ))}
        </div>
      </div>

      {/* Skills List */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">Your Skills</Label>
        {skills.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No skills added yet. Add some skills to continue.
          </p>
        ) : (
          <div className="space-y-3">
            {skills.map((skill) => (
              <div
                key={skill.name}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium">{skill.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {levelLabels[skill.level as keyof typeof levelLabels]}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Skill Level Stars */}
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => updateSkillLevel(skill.name, star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-5 w-5 ${
                            star <= skill.level
                              ? "text-yellow-500 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkill(skill.name)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={skills.length === 0}
          className="bg-green-600 hover:bg-green-700"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
