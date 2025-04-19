
import { Badge } from "@/components/ui/badge";

interface ExpertiseSectionProps {
  expertise: string[];
}

export const ExpertiseSection = ({ expertise }: ExpertiseSectionProps) => (
  <div>
    <p className="font-semibold">Expertise:</p>
    <div className="flex flex-wrap gap-2 mt-1">
      {expertise.map((skill: string) => (
        <Badge key={skill} variant="secondary">
          {skill}
        </Badge>
      ))}
    </div>
  </div>
);
