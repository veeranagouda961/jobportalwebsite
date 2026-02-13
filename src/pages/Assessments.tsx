import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { analyzeJD, saveAnalysis } from "@/lib/jdAnalyzer";
import { ArrowRight } from "lucide-react";

const Assessments = () => {
  const navigate = useNavigate();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jdText, setJdText] = useState("");
  const [error, setError] = useState("");

  const handleAnalyze = () => {
    if (!jdText.trim()) {
      setError("Please paste a job description to analyze.");
      return;
    }
    setError("");
    const result = analyzeJD(company.trim(), role.trim(), jdText.trim());
    saveAnalysis(result);
    navigate(`/results?id=${result.id}`);
  };

  return (
    <div>
      <h1 className="text-3xl font-serif text-foreground">JD Analyzer</h1>
      <p className="mt-space-1 text-muted-foreground max-w-prose">
        Paste a job description below. We'll extract skills, generate a preparation plan, and estimate your readiness — all offline.
      </p>

      <Card className="mt-space-3 max-w-3xl">
        <CardHeader>
          <CardTitle className="text-lg">New Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-space-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-2">
            <div className="space-y-1.5">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                placeholder="e.g. Google"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                placeholder="e.g. Software Engineer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="jd">Job Description</Label>
            <Textarea
              id="jd"
              placeholder="Paste the full job description here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              className="min-h-[200px] resize-y"
            />
            <p className="text-xs text-muted-foreground">
              {jdText.length} characters {jdText.length > 800 && "✓ Good length for accurate analysis"}
            </p>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button onClick={handleAnalyze} size="lg">
            Analyze JD <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Assessments;
