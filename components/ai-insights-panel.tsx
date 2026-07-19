'use client';

import { motion } from 'framer-motion';
import {
  Brain,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  ArrowRight,
  Sparkles,
  Target,
  Users,
  GraduationCap,
} from 'lucide-react';
import { aiInsights } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const riskColors: Record<string, string> = {
  High: 'bg-destructive/10 text-destructive border-destructive/20',
  Medium: 'bg-accent/10 text-accent border-accent/20',
};

const priorityColors: Record<string, string> = {
  high: 'bg-destructive/10 text-destructive',
  medium: 'bg-accent/10 text-accent',
  low: 'bg-success/10 text-success',
};

export function AiInsightsPanel() {
  const { studentsAtRisk, attendancePrediction, feeForecast, topClasses, teacherSummary, recommendations } = aiInsights;

  return (
    <div className="space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/5 via-card to-chart-4/5 p-6 shadow-premium"
      >
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-chart-2 shadow-lg">
            <Brain className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">AI Insights</h2>
              <Badge className="gap-1 bg-primary/10 text-primary hover:bg-primary/15">
                <Sparkles className="h-3 w-3" />
                Live
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Powered by Yovial AI · Updated 5 min ago</p>
          </div>
        </div>
      </motion.div>

      {/* Students at Risk */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border bg-card p-5 shadow-premium"
      >
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </div>
          <h3 className="text-sm font-semibold">Students at Risk</h3>
          <Badge variant="secondary" className="ml-auto text-xs">{studentsAtRisk.length} flagged</Badge>
        </div>
        <div className="space-y-2">
          {studentsAtRisk.map((student, i) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/30"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold">
                {student.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{student.name}</p>
                  <span className="text-xs text-muted-foreground">Grade {student.grade}</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{student.reason}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={cn('rounded-full border px-2 py-0.5 text-xs font-medium', riskColors[student.risk])}>
                  {student.risk}
                </span>
                <span className="flex items-center gap-0.5 text-xs text-destructive">
                  <TrendingDown className="h-3 w-3" />
                  {student.trend}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Predictions row */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Attendance Prediction */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border bg-card p-5 shadow-premium"
        >
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-2/10">
              <Target className="h-4 w-4 text-chart-2" />
            </div>
            <h3 className="text-sm font-semibold">Attendance Prediction</h3>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold">{attendancePrediction.nextWeek}%</p>
            <p className="mb-1 text-xs text-muted-foreground">next week</p>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${attendancePrediction.confidence}%` }}
                transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full bg-chart-2"
              />
            </div>
            <span className="text-xs text-muted-foreground">{attendancePrediction.confidence}% confidence</span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{attendancePrediction.note}</p>
        </motion.div>

        {/* Fee Collection Forecast */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border bg-card p-5 shadow-premium"
        >
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-1/10">
              <TrendingUp className="h-4 w-4 text-chart-1" />
            </div>
            <h3 className="text-sm font-semibold">Fee Collection Forecast</h3>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold">₹{(feeForecast.nextMonth / 1000).toFixed(0)}K</p>
            <p className="mb-1 text-xs text-muted-foreground">next month</p>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${feeForecast.confidence}%` }}
                transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full bg-chart-1"
              />
            </div>
            <span className="text-xs text-muted-foreground">{feeForecast.confidence}% confidence</span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{feeForecast.note}</p>
        </motion.div>
      </div>

      {/* Top Performing Classes */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border bg-card p-5 shadow-premium"
      >
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
            <GraduationCap className="h-4 w-4 text-success" />
          </div>
          <h3 className="text-sm font-semibold">Top Performing Classes</h3>
        </div>
        <div className="space-y-2">
          {topClasses.map((cls, i) => (
            <motion.div
              key={cls.class}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.05 }}
              className="flex items-center gap-3"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-success/10 text-xs font-bold text-success">
                {i + 1}
              </span>
              <span className="text-sm font-medium">Grade {cls.class}</span>
              <div className="flex flex-1 items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cls.avg}%` }}
                    transition={{ delay: 0.3 + i * 0.05, duration: 0.6 }}
                    className="h-full rounded-full bg-success"
                  />
                </div>
                <span className="text-xs text-muted-foreground">{cls.avg}%</span>
              </div>
              <span className="text-xs font-medium text-success">{cls.improvement}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Teacher Performance Summary */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border bg-card p-5 shadow-premium"
      >
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-4/10">
            <Users className="h-4 w-4 text-chart-4" />
          </div>
          <h3 className="text-sm font-semibold">Teacher Performance Summary</h3>
          <Badge variant="secondary" className="ml-auto text-xs">Avg: {teacherSummary.avgScore}%</Badge>
        </div>
        <div className="space-y-3">
          <div className="rounded-lg border border-success/20 bg-success/5 p-3">
            <p className="text-xs font-medium text-success">Top Performer</p>
            <p className="mt-0.5 text-sm">{teacherSummary.top}</p>
          </div>
          <div className="rounded-lg border border-accent/20 bg-accent/5 p-3">
            <p className="text-xs font-medium text-accent">Needs Improvement</p>
            <p className="mt-0.5 text-sm">{teacherSummary.improvement}</p>
          </div>
        </div>
      </motion.div>

      {/* AI Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border bg-gradient-to-br from-primary/5 to-chart-4/5 p-5 shadow-premium"
      >
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Lightbulb className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-sm font-semibold">AI Recommendations</h3>
        </div>
        <div className="space-y-2">
          {recommendations.map((rec, i) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.05 }}
              className="flex items-start gap-3 rounded-lg border bg-card/50 p-3 transition-colors hover:bg-card"
            >
              <span className={cn('mt-0.5 rounded-md px-2 py-0.5 text-xs font-medium capitalize', priorityColors[rec.priority])}>
                {rec.priority}
              </span>
              <p className="flex-1 text-sm">{rec.text}</p>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
