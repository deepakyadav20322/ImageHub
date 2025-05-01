import { Progress } from "@/components/ui/progress";

interface ProgressIndicatorProps {
  progress: number;
  label: string;
}

export const ProgressIndicator = ({ progress, label }: ProgressIndicatorProps) => {
  return (
    <div className="space-y-2 overflow-hidden">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          {label}
        </span>
        <span className="text-sm font-medium text-gray-700">
          {Math.round(progress)}%
        </span>
      </div>
      <Progress value={progress} className="h-2 w-full" />
    </div>
  );
};