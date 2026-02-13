import { useResume } from "@/hooks/useResume";
import { ResumePreviewPanel } from "@/components/resume/ResumePreviewPanel";

const Preview = () => {
  return (
    <main className="flex-1 flex justify-center py-space-4 px-space-3 bg-secondary/30">
      <div className="w-full max-w-[800px] bg-white rounded-lg shadow-sm border border-border p-space-4">
        <ResumePreviewPanel />
      </div>
    </main>
  );
};

export default Preview;
