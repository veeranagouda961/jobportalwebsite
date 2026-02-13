import { ResumePreviewPanel } from "@/components/resume/ResumePreviewPanel";
import { TemplateSelector } from "@/components/resume/TemplateSelector";

const Preview = () => {
  return (
    <main className="flex-1 flex flex-col items-center py-space-4 px-space-3 bg-secondary/30">
      <div className="mb-space-2">
        <TemplateSelector />
      </div>
      <div className="w-full max-w-[800px] bg-white rounded-lg shadow-sm border border-border p-space-4">
        <ResumePreviewPanel />
      </div>
    </main>
  );
};

export default Preview;
