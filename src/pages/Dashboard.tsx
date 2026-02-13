import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

const radarData = [
  { subject: "DSA", score: 75 },
  { subject: "System Design", score: 60 },
  { subject: "Communication", score: 80 },
  { subject: "Resume", score: 85 },
  { subject: "Aptitude", score: 70 },
];

const assessments = [
  { title: "DSA Mock Test", date: "Tomorrow", time: "10:00 AM" },
  { title: "System Design Review", date: "Wed", time: "2:00 PM" },
  { title: "HR Interview Prep", date: "Friday", time: "11:00 AM" },
];

const weekDays = [
  { day: "M", active: true },
  { day: "T", active: true },
  { day: "W", active: false },
  { day: "T", active: true },
  { day: "F", active: true },
  { day: "S", active: false },
  { day: "S", active: false },
];

function ReadinessCircle() {
  const score = 72;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex items-center justify-center py-space-3">
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="hsl(var(--secondary))"
          strokeWidth="12"
        />
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 90 90)"
          style={{ transition: "stroke-dashoffset 0.6s ease-in-out" }}
        />
        <text
          x="90"
          y="82"
          textAnchor="middle"
          className="fill-foreground"
          style={{ fontSize: "36px", fontWeight: 700, fontFamily: "var(--font-sans)" }}
        >
          {score}
        </text>
        <text
          x="90"
          y="108"
          textAnchor="middle"
          className="fill-muted-foreground"
          style={{ fontSize: "12px", fontFamily: "var(--font-sans)" }}
        >
          Readiness Score
        </text>
      </svg>
    </div>
  );
}

const Dashboard = () => (
  <div>
    <h1 className="text-3xl font-serif text-foreground">Dashboard</h1>
    <p className="mt-space-1 text-muted-foreground">
      Your placement preparation overview.
    </p>

    <div className="mt-space-3 grid grid-cols-1 lg:grid-cols-2 gap-space-2">
      {/* Overall Readiness */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Overall Readiness</CardTitle>
        </CardHeader>
        <CardContent>
          <ReadinessCircle />
        </CardContent>
      </Card>

      {/* Skill Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Skill Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={false}
                axisLine={false}
              />
              <Radar
                dataKey="score"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Continue Practice */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Continue Practice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-space-2">
          <div>
            <p className="font-medium text-foreground">Dynamic Programming</p>
            <p className="text-sm text-muted-foreground">3 of 10 problems completed</p>
          </div>
          <Progress value={30} className="h-2" />
          <Button size="sm" className="mt-space-1">
            Continue <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Weekly Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Weekly Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-space-2">
          <div>
            <p className="text-sm text-muted-foreground">Problems Solved</p>
            <p className="font-medium text-foreground">12 / 20 this week</p>
          </div>
          <Progress value={60} className="h-2" />
          <div className="flex items-center gap-2 pt-space-1">
            {weekDays.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium ${
                    d.active
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {d.day}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Assessments — full width */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Assessments</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border">
            {assessments.map((a) => (
              <li key={a.title} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <span className="font-medium text-foreground">{a.title}</span>
                <span className="flex items-center gap-space-1 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" /> {a.date}
                  <Clock className="h-3.5 w-3.5 ml-2" /> {a.time}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default Dashboard;
