import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { allLocations, allExperiences } from "@/data/jobs";
import { usePreferences, type Preferences, defaultPreferences } from "@/hooks/usePreferences";
import { toast } from "sonner";
import { X } from "lucide-react";

const modes = ["Remote", "Hybrid", "Onsite"] as const;

const Settings = () => {
  const { prefs, save, hasPreferences } = usePreferences();
  const [form, setForm] = useState<Preferences>(prefs);

  useEffect(() => {
    setForm(prefs);
  }, []);

  const set = <K extends keyof Preferences>(key: K, value: Preferences[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleMode = (mode: string) => {
    const next = form.preferredMode.includes(mode)
      ? form.preferredMode.filter((m) => m !== mode)
      : [...form.preferredMode, mode];
    set("preferredMode", next);
  };

  const toggleLocation = (loc: string) => {
    const next = form.preferredLocations.includes(loc)
      ? form.preferredLocations.filter((l) => l !== loc)
      : [...form.preferredLocations, loc];
    set("preferredLocations", next);
  };

  const handleSave = () => {
    save(form);
    toast.success("Preferences saved successfully.");
  };

  return (
    <main className="flex-1 px-space-3 py-space-4 max-w-[720px] mx-auto w-full">
      <h1 className="text-3xl md:text-4xl font-serif text-foreground">Preferences</h1>
      <p className="mt-space-1 text-base text-muted-foreground">
        Configure your job tracking criteria to activate intelligent matching.
      </p>

      <Card className="mt-space-4">
        <CardHeader>
          <CardTitle className="text-lg font-sans">Tracking Criteria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-space-3">
          {/* Role Keywords */}
          <div className="space-y-2">
            <Label htmlFor="keywords">Role Keywords</Label>
            <Input
              id="keywords"
              placeholder="e.g. Frontend, React, SDE Intern"
              value={form.roleKeywords}
              onChange={(e) => set("roleKeywords", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Comma-separated. Matched against job title &amp; description.</p>
          </div>

          {/* Preferred Locations */}
          <div className="space-y-2">
            <Label>Preferred Locations</Label>
            <div className="flex flex-wrap gap-2">
              {allLocations.map((loc) => (
                <Badge
                  key={loc}
                  variant={form.preferredLocations.includes(loc) ? "default" : "outline"}
                  className="cursor-pointer select-none"
                  onClick={() => toggleLocation(loc)}
                >
                  {loc}
                  {form.preferredLocations.includes(loc) && <X className="ml-1 h-3 w-3" />}
                </Badge>
              ))}
            </div>
          </div>

          {/* Work Mode */}
          <div className="space-y-2">
            <Label>Work Mode</Label>
            <div className="flex gap-space-3">
              {modes.map((mode) => (
                <label key={mode} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={form.preferredMode.includes(mode)}
                    onCheckedChange={() => toggleMode(mode)}
                  />
                  <span className="text-sm font-normal">{mode}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div className="space-y-2">
            <Label>Experience Level</Label>
            <Select value={form.experienceLevel} onValueChange={(v) => set("experienceLevel", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {allExperiences.map((exp) => (
                  <SelectItem key={exp} value={exp}>{exp}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label htmlFor="skills">Skills</Label>
            <Input
              id="skills"
              placeholder="e.g. React, TypeScript, Python"
              value={form.skills}
              onChange={(e) => set("skills", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Comma-separated. Matched against job skill tags.</p>
          </div>

          {/* Min Match Score */}
          <div className="space-y-2">
            <Label>Minimum Match Score: {form.minMatchScore}%</Label>
            <Slider
              value={[form.minMatchScore]}
              onValueChange={([v]) => set("minMatchScore", v)}
              min={0}
              max={100}
              step={5}
            />
            <p className="text-xs text-muted-foreground">
              Jobs below this score can be hidden on the dashboard.
            </p>
          </div>

          <Button className="mt-space-2" onClick={handleSave}>
            Save Preferences
          </Button>
        </CardContent>
      </Card>
    </main>
  );
};

export default Settings;
