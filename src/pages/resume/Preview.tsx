import { useRef, useState } from "react";
import { ResumePreviewPanel } from "@/components/resume/ResumePreviewPanel";
import { TemplateSelector } from "@/components/resume/TemplateSelector";
import { useResume } from "@/hooks/useResume";
import { resumeToPlainText } from "@/lib/resumeToText";
import { Button } from "@/components/ui/button";
import { Printer, Copy, Check, AlertTriangle } from "lucide-react";

function useExportWarning(resume: ReturnType<typeof useResume>["resume"]) {
  const warnings: string[] = [];
  if (!resume.personal.name) warnings.push("Name is missing.");
  const hasContent = resume.experience.length > 0 || resume.projects.length > 0;
  if (!hasContent) warnings.push("Add at least one project or experience.");
  return warnings;
}

const Preview = () => {
  const { resume } = useResume();
  const printRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const warnings = useExportWarning(resume);

  const handlePrint = () => window.print();

  const handleCopy = async () => {
    const text = resumeToPlainText(resume);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="flex-1 flex flex-col items-center py-space-4 px-space-3 bg-secondary/30">
      <div className="mb-space-2 flex items-center gap-3 print:hidden">
        <TemplateSelector />
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="h-3.5 w-3.5 mr-1.5" />
          Print / Save as PDF
        </Button>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {copied ? <Check className="h-3.5 w-3.5 mr-1.5" /> : <Copy className="h-3.5 w-3.5 mr-1.5" />}
          {copied ? "Copied!" : "Copy as Text"}
        </Button>
      </div>

      {warnings.length > 0 && (
        <div className="mb-space-2 flex items-start gap-2 text-sm text-muted-foreground max-w-[800px] w-full print:hidden">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-warning" />
          <span>Your resume may look incomplete: {warnings.join(" ")}</span>
        </div>
      )}

      <div
        ref={printRef}
        id="resume-print-area"
        className="w-full max-w-[800px] bg-white rounded-lg shadow-sm border border-border p-space-4 print:shadow-none print:border-0 print:rounded-none print:max-w-none print:p-0"
      >
        <ResumePreviewPanel />
      </div>
    </main>
  );
};

export default Preview;
