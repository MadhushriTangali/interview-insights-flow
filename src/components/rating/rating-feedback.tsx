
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InterviewRating } from "@/types";
import { AlertCircle, CheckCircle, TrendingUp, TrendingDown } from "lucide-react";

interface RatingFeedbackProps {
  rating: InterviewRating;
}

export function RatingFeedback({ rating }: RatingFeedbackProps) {
  const getScoreColor = (score: number) => {
    if (score >= 4) return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
    if (score >= 3) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
    return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 4) return "Strong";
    if (score >= 3) return "Good";
    return "Needs Improvement";
  };

  const getFeedbackForCategory = (category: string, score: number) => {
    const improvements = {
      technical: score < 3 ? "Practice coding problems daily, review fundamental concepts, and work on system design." : "",
      managerial: score < 3 ? "Develop leadership stories using STAR method, practice delegation scenarios." : "",
      projects: score < 3 ? "Prepare detailed project explanations, focus on your specific contributions and impact." : "",
      selfIntroduction: score < 3 ? "Practice a concise 2-minute introduction highlighting your key achievements." : "",
      hrRound: score < 3 ? "Research the company culture, prepare questions about the role and growth opportunities." : "",
      dressup: score < 3 ? "Dress appropriately for the company culture, ensure professional appearance." : "",
      communication: score < 3 ? "Practice clear articulation, active listening, and asking clarifying questions." : "",
      bodyLanguage: score < 3 ? "Maintain eye contact, sit up straight, use appropriate hand gestures." : "",
      punctuality: score < 3 ? "Always arrive 10-15 minutes early, test technology beforehand for virtual interviews." : ""
    };
    return improvements[category as keyof typeof improvements] || "";
  };

  const categories = [
    { key: 'technical' as keyof InterviewRating, label: 'Technical Skills', score: rating.technical },
    { key: 'managerial' as keyof InterviewRating, label: 'Managerial Skills', score: rating.managerial },
    { key: 'projects' as keyof InterviewRating, label: 'Project Discussion', score: rating.projects },
    { key: 'selfIntroduction' as keyof InterviewRating, label: 'Self Introduction', score: rating.selfIntroduction },
    { key: 'hrRound' as keyof InterviewRating, label: 'HR Round', score: rating.hrRound },
    { key: 'dressup' as keyof InterviewRating, label: 'Professional Appearance', score: rating.dressup },
    { key: 'communication' as keyof InterviewRating, label: 'Communication', score: rating.communication },
    { key: 'bodyLanguage' as keyof InterviewRating, label: 'Body Language', score: rating.bodyLanguage },
    { key: 'punctuality' as keyof InterviewRating, label: 'Punctuality', score: rating.punctuality }
  ];

  const weakAreas = categories.filter(cat => cat.score < 3);
  const strongAreas = categories.filter(cat => cat.score >= 4);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Overall Performance Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-primary">{rating.overallRating.toFixed(1)}/5</div>
            <Badge className={getScoreColor(rating.overallRating)}>
              {getScoreLabel(rating.overallRating)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {strongAreas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Your Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {strongAreas.map((area) => (
                <div key={area.key} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="font-medium">{area.label}</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                    {area.score}/5
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {weakAreas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="h-5 w-5" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weakAreas.map((area) => (
                <div key={area.key} className="p-4 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{area.label}</span>
                    <Badge className={getScoreColor(area.score)}>
                      {area.score}/5
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {getFeedbackForCategory(area.key, area.score)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm">Focus on your weak areas by dedicating 30 minutes daily to practice</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm">Schedule mock interviews to practice in a realistic setting</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm">Keep track of your progress by rating future interviews</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
