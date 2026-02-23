'use client';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import dynamic from 'next/dynamic';
const SkillBreakdownChart = dynamic(() => import("@/components/dashboard/skill-breakdown-chart").then(mod => mod.SkillBreakdownChart), { ssr: false });
import { Clock } from "lucide-react";
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [readinessScore, setReadinessScore] = useState(0);
  const [circumference, setCircumference] = useState(0);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    // This will only run on the client
    const score = 72;
    const radius = 80;
    const strokeWidth = 16;
    const calculatedCircumference = 2 * Math.PI * radius;
    const calculatedOffset = calculatedCircumference - (score / 100) * calculatedCircumference;

    setReadinessScore(score);
    setCircumference(calculatedCircumference);
    setOffset(calculatedOffset);

  }, []);

  const weekActivity = [
    { day: 'Mon', active: true },
    { day: 'Tue', active: false },
    { day: 'Wed', active: true },
    { day: 'Thu', active: true },
    { day: 'Fri', active: false },
    { day: 'Sat', active: true },
    { day: 'Sun', active: false },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div className="lg:col-span-2 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Overall Readiness */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Overall Readiness</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-6">
            <div className="relative h-48 w-48">
              <svg className="h-full w-full" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="transparent"
                  stroke="hsl(var(--muted))"
                  strokeWidth="16"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="transparent"
                  stroke="hsl(var(--primary))"
                  strokeWidth="16"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {readinessScore > 0 ? (
                  <>
                    <span className="text-4xl font-bold">{readinessScore}<span className="text-2xl text-muted-foreground">/100</span></span>
                    <span className="mt-1 text-sm text-muted-foreground">Readiness Score</span>
                  </>
                ) : <span className="text-sm text-muted-foreground">Loading...</span>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Continue Practice */}
        <Card>
          <CardHeader>
            <CardTitle>Continue Practice</CardTitle>
            <CardDescription>Dynamic Programming</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={30} className="mb-1" />
            <p className="text-sm text-muted-foreground">3/10 problems completed</p>
          </CardContent>
          <CardFooter>
            <Button>Continue</Button>
          </CardFooter>
        </Card>

        {/* Weekly Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Problems Solved: <span className="font-bold text-foreground">12/20</span> this week</p>
            <Progress value={(12 / 20) * 100} className="my-3" />
            <div className="mt-4 flex justify-around">
              {weekActivity.map((day, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <span className="text-xs text-muted-foreground">{day.day}</span>
                  <div className={`h-7 w-7 rounded-full ${day.active ? 'bg-primary' : 'bg-muted'}`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1 flex flex-col gap-6">
        {/* Skill Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Skill Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <SkillBreakdownChart />
          </CardContent>
        </Card>

        {/* Upcoming Assessments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">DSA Mock Test</p>
                  <p className="text-sm text-muted-foreground">Tomorrow, 10:00 AM</p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">System Design Review</p>
                  <p className="text-sm text-muted-foreground">Wed, 2:00 PM</p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">HR Interview Prep</p>
                  <p className="text-sm text-muted-foreground">Friday, 11:00 AM</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
