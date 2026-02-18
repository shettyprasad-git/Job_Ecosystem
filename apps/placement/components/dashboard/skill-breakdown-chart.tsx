'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  PolarRadiusAxis,
} from 'recharts';

const data = [
  { subject: 'DSA', score: 75 },
  { subject: 'System Design', score: 60 },
  { subject: 'Communication', score: 80 },
  { subject: 'Resume', score: 85 },
  { subject: 'Aptitude', score: 70 },
];

export function SkillBreakdownChart() {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar 
            name="Skills" 
            dataKey="score" 
            stroke="hsl(var(--primary))" 
            fill="hsl(var(--primary))" 
            fillOpacity={0.6} 
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
