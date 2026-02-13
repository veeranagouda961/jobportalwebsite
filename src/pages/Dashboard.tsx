import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ClipboardCheck, BarChart3, Trophy } from "lucide-react";

const stats = [
  { label: "Problems Solved", value: "0", icon: BookOpen },
  { label: "Assessments Taken", value: "0", icon: ClipboardCheck },
  { label: "Accuracy", value: "—", icon: BarChart3 },
  { label: "Readiness Score", value: "—", icon: Trophy },
];

const Dashboard = () => (
  <div>
    <h1 className="text-3xl font-serif text-foreground">Dashboard</h1>
    <p className="mt-space-1 text-muted-foreground">
      Your placement preparation overview.
    </p>

    <div className="mt-space-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-2">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardContent className="pt-6 flex items-center gap-space-2">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <s.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    <Card className="mt-space-3">
      <CardContent className="pt-6 text-center py-space-5">
        <p className="text-muted-foreground">Start practicing to see your progress here.</p>
      </CardContent>
    </Card>
  </div>
);

export default Dashboard;
