'use client';

import { motion } from 'framer-motion';
import {
  Brain,
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Target,
  Activity,
  Gauge,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { PageHeader } from '@/components/page-header';
import { SectionCard } from '@/components/section-card';
import { ChartCard } from '@/components/chart-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { aiAnalyticsData } from '@/lib/erp-data';
import { toast } from 'sonner';

const tooltipStyle = {
  backgroundColor: 'hsl(var(--popover))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '12px',
  fontSize: '12px',
};

// School Health Score sub-scores
const healthSubScores = [
  { label: 'Academic', value: 89, color: 'hsl(var(--chart-1))' },
  { label: 'Attendance', value: 94, color: 'hsl(var(--chart-2))' },
  { label: 'Financial', value: 82, color: 'hsl(var(--chart-4))' },
  { label: 'Infrastructure', value: 85, color: 'hsl(var(--chart-3))' },
];

// Radar chart class colors
const radarClasses = [
  { key: '6-A', stroke: 'hsl(var(--chart-1))', fill: 'hsl(var(--chart-1))' },
  { key: '8-A', stroke: 'hsl(var(--chart-2))', fill: 'hsl(var(--chart-2))' },
  { key: '10-A', stroke: 'hsl(var(--chart-4))', fill: 'hsl(var(--chart-4))' },
];

// Priority badge styling (Badge only ships default/secondary/destructive/outline variants)
const priorityStyles: Record<
  string,
  { badge: string; label: string }
> = {
  high: {
    badge:
      'border-transparent bg-destructive/10 text-destructive hover:bg-destructive/15',
    label: 'High Priority',
  },
  medium: {
    badge:
      'border-transparent bg-warning/15 text-warning hover:bg-warning/20',
    label: 'Medium Priority',
  },
  low: {
    badge:
      'border-transparent bg-success/15 text-success hover:bg-success/20',
    label: 'Low Priority',
  },
};

// Impact indicator styling
const impactStyles: Record<string, string> = {
  High: 'text-destructive',
  Medium: 'text-warning',
  Low: 'text-success',
};

// AI Insight trend rendering
const insightTrendConfig: Record<
  string,
  { icon: typeof TrendingUp; className: string; label: string }
> = {
  positive: {
    icon: ArrowUpRight,
    className: 'text-success bg-success/10',
    label: 'Positive',
  },
  negative: {
    icon: ArrowDownRight,
    className: 'text-destructive bg-destructive/10',
    label: 'Negative',
  },
  neutral: {
    icon: Minus,
    className: 'text-muted-foreground bg-muted',
    label: 'Neutral',
  },
  mixed: {
    icon: Activity,
    className: 'text-warning bg-warning/10',
    label: 'Mixed',
  },
};

export default function AiAnalyticsPage() {
  const {
    schoolHealthScore,
    healthTrend,
    riskDistribution,
    attendancePrediction,
    feeForecast,
    classPerformanceRadar,
    aiSuggestions,
    aiInsights,
  } = aiAnalyticsData;

  // Radial ring geometry for the School Health Score
  const ringRadius = 88;
  const ringStroke = 14;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - schoolHealthScore / 100);

  const totalRisk = riskDistribution.reduce((sum, r) => sum + r.count, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Analytics"
        description="AI-powered insights and predictions for your school"
      >
        <Button variant="outline" size="sm" className="gap-2">
          <Sparkles className="h-4 w-4" />
          Regenerate Insights
        </Button>
        <Button size="sm" className="gap-2">
          <Brain className="h-4 w-4" />
          Ask AI
        </Button>
      </PageHeader>

      {/* ────────────────────────────────────────────────────────────
          School Health Score — full-width premium hero card
         ──────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/5 via-card to-chart-4/5 p-6 shadow-premium sm:p-8"
      >
        {/* Decorative glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-chart-4/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative grid items-center gap-8 lg:grid-cols-[auto_1fr]">
          {/* Radial progress ring */}
          <div className="relative mx-auto flex h-[220px] w-[220px] items-center justify-center">
            <svg
              viewBox="0 0 200 200"
              className="h-full w-full -rotate-90"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="healthRing" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--chart-2))" />
                  <stop offset="100%" stopColor="hsl(var(--chart-4))" />
                </linearGradient>
              </defs>
              <circle
                cx="100"
                cy="100"
                r={ringRadius}
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth={ringStroke}
              />
              <motion.circle
                cx="100"
                cy="100"
                r={ringRadius}
                fill="none"
                stroke="url(#healthRing)"
                strokeWidth={ringStroke}
                strokeLinecap="round"
                strokeDasharray={ringCircumference}
                initial={{ strokeDashoffset: ringCircumference }}
                animate={{ strokeDashoffset: ringOffset }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <div className="flex items-end gap-0.5">
                <span className="text-6xl font-bold leading-none tracking-tight tabular-nums">
                  {schoolHealthScore}
                </span>
                <span className="mb-1.5 text-xl font-semibold text-muted-foreground">
                  /100
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
                <TrendingUp className="h-3.5 w-3.5" />
                {healthTrend} from last month
              </div>
            </div>
          </div>

          {/* Score context + sub-scores */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Gauge className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">School Health Score</h2>
                <p className="text-sm text-muted-foreground">
                  Composite index across academic, attendance, financial &amp; infrastructure metrics
                </p>
              </div>
              <Badge className="ml-auto gap-1.5 border-transparent bg-success/15 text-success">
                <Sparkles className="h-3 w-3" />
                Excellent
              </Badge>
            </div>

            {/* Sub-score bars */}
            <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {healthSubScores.map((sub, i) => (
                <motion.div
                  key={sub.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="space-y-1.5"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-muted-foreground">
                      {sub.label}
                    </span>
                    <span className="font-semibold tabular-nums">{sub.value}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${sub.value}%` }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.4 + i * 0.08 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: sub.color }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ────────────────────────────────────────────────────────────
          Charts — 2-column grid
         ──────────────────────────────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Risk Distribution */}
        <ChartCard
          title="Student Risk Distribution"
          description="AI-classified risk levels across the student body"
          delay={0.1}
        >
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={riskDistribution}
                dataKey="count"
                nameKey="level"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                stroke="hsl(var(--card))"
                strokeWidth={2}
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={`risk-cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value: number, name: string) => [
                  `${value} students (${((value / totalRisk) * 100).toFixed(1)}%)`,
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {riskDistribution.map((r) => (
              <div
                key={r.level}
                className="flex flex-col items-center gap-1 rounded-xl border bg-card/50 p-3 text-center"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: r.fill }}
                />
                <span className="text-sm font-semibold tabular-nums">{r.count}</span>
                <span className="text-xs text-muted-foreground">{r.level}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Attendance Prediction */}
        <ChartCard
          title="Attendance Prediction"
          description="AI-predicted vs actual attendance this week (%)"
          delay={0.15}
        >
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={attendancePrediction}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="day"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[80, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value: number) => [`${value}%`, '']}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="hsl(var(--chart-4))"
                strokeWidth={2.5}
                dot={{ r: 4, fill: 'hsl(var(--chart-4))' }}
                name="Predicted"
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2.5}
                strokeDasharray="6 4"
                dot={{ r: 4, fill: 'hsl(var(--chart-1))' }}
                connectNulls
                name="Actual"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Fee Collection Forecast */}
        <ChartCard
          title="Fee Collection Forecast"
          description="Actual vs AI-predicted fee collection (₹)"
          delay={0.1}
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={feeForecast} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, '']}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
              <Bar
                dataKey="actual"
                fill="hsl(var(--chart-1))"
                radius={[6, 6, 0, 0]}
                name="Actual"
              />
              <Bar
                dataKey="predicted"
                fill="hsl(var(--chart-4))"
                radius={[6, 6, 0, 0]}
                name="Predicted"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Class Performance Radar */}
        <ChartCard
          title="Class Performance Radar"
          description="Comparative subject performance across classes"
          delay={0.15}
        >
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={classPerformanceRadar} outerRadius="75%">
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="subject"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <PolarRadiusAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                angle={90}
                domain={[60, 100]}
                tick={false}
              />
              {radarClasses.map((cls) => (
                <Radar
                  key={cls.key}
                  name={cls.key}
                  dataKey={cls.key}
                  stroke={cls.stroke}
                  fill={cls.fill}
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              ))}
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
              <Tooltip contentStyle={tooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ────────────────────────────────────────────────────────────
          AI Suggestions + AI Insights — 2-column grid
         ──────────────────────────────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* AI Suggestions */}
        <SectionCard
          title="AI Suggestions"
          description="Recommended actions generated by the AI engine"
          delay={0.1}
        >
          <div className="space-y-3">
            {aiSuggestions.map((s, i) => {
              const style = priorityStyles[s.priority] ?? priorityStyles.medium;
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className="group rounded-xl border bg-card/60 p-4 transition-colors hover:border-primary/30 hover:bg-card"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={style.badge}>
                      {style.label}
                    </Badge>
                    <Badge variant="outline" className="gap-1 font-medium">
                      <Target className="h-3 w-3" />
                      {s.category}
                    </Badge>
                    <span
                      className={`ml-auto flex items-center gap-1 text-xs font-semibold ${impactStyles[s.impact] ?? 'text-muted-foreground'}`}
                    >
                      <Activity className="h-3.5 w-3.5" />
                      {s.impact} impact
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                    {s.text}
                  </p>
                  <div className="mt-3 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 transition-colors group-hover:border-primary/40 group-hover:bg-primary/5"
                      onClick={() =>
                        toast.success('Suggestion applied', {
                          description: s.text,
                        })
                      }
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Apply
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </SectionCard>

        {/* AI Insights */}
        <SectionCard
          title="AI Insights"
          description="Trend-based observations across the school"
          delay={0.15}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {aiInsights.map((insight, i) => {
              const trend = insightTrendConfig[insight.trend] ?? insightTrendConfig.neutral;
              const TrendIcon = trend.icon;
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className="flex flex-col gap-3 rounded-xl border bg-card/60 p-4 transition-colors hover:border-primary/30 hover:bg-card"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Lightbulb className="h-4 w-4" />
                      </div>
                      <h3 className="text-sm font-semibold">{insight.title}</h3>
                    </div>
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${trend.className}`}
                      title={trend.label}
                    >
                      <TrendIcon className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {insight.insight}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
