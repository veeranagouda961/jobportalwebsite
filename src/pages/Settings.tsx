import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Settings = () => (
  <main className="flex-1 px-space-3 py-space-4 max-w-[720px] mx-auto w-full">
    <h1 className="text-3xl md:text-4xl font-serif text-foreground">Preferences</h1>
    <p className="mt-space-1 text-base text-muted-foreground">
      Configure your job tracking criteria. Logic will be connected in the next step.
    </p>

    <Card className="mt-space-4">
      <CardHeader>
        <CardTitle className="text-lg font-sans">Tracking Criteria</CardTitle>
      </CardHeader>
      <CardContent className="space-y-space-3">
        <div className="space-y-2">
          <Label htmlFor="keywords">Role Keywords</Label>
          <Input id="keywords" placeholder="e.g. Frontend Engineer, React Developer" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="locations">Preferred Locations</Label>
          <Input id="locations" placeholder="e.g. Bangalore, Mumbai, Remote" />
        </div>

        <div className="space-y-2">
          <Label>Work Mode</Label>
          <RadioGroup defaultValue="remote" className="flex gap-space-3">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="remote" id="remote" />
              <Label htmlFor="remote" className="font-normal">Remote</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="hybrid" id="hybrid" />
              <Label htmlFor="hybrid" className="font-normal">Hybrid</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="onsite" id="onsite" />
              <Label htmlFor="onsite" className="font-normal">Onsite</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Experience Level</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="entry">Entry Level (0–2 yrs)</SelectItem>
              <SelectItem value="mid">Mid Level (2–5 yrs)</SelectItem>
              <SelectItem value="senior">Senior (5–10 yrs)</SelectItem>
              <SelectItem value="lead">Lead / Staff (10+ yrs)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="mt-space-2" disabled>
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  </main>
);

export default Settings;
