// components/ui/password-strength.tsx
import { useEffect, useState } from "react";

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({
  password,
}) => {
  const [strength, setStrength] = useState(0);
  const [feedback, setFeedback] = useState<string[]>([]);

  useEffect(() => {
    const checks = [
      { regex: /.{8,}/, message: "At least 8 characters" },
      { regex: /[a-z]/, message: "Lowercase letter" },
      { regex: /[A-Z]/, message: "Uppercase letter" },
      { regex: /[0-9]/, message: "Number" },
      { regex: /[@$!%*?&]/, message: "Special character (@$!%*?&)" },
    ];

    const passedChecks = checks.filter((check) => check.regex.test(password));
    const failedChecks = checks.filter((check) => !check.regex.test(password));

    setStrength((passedChecks.length / checks.length) * 100);
    setFeedback(failedChecks.map((check) => check.message));
  }, [password]);

  const getStrengthColor = () => {
    if (strength < 40) return "bg-red-500";
    if (strength < 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
          style={{ width: `${strength}%` }}
        ></div>
      </div>
      {feedback.length > 0 && (
        <div className="text-xs text-muted-foreground">
          <p>Missing: {feedback.join(", ")}</p>
        </div>
      )}
    </div>
  );
};
