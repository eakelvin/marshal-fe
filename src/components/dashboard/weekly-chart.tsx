"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function WeeklyChart({
  data,
}: {
  data: { day: string; items: number; reviews: number }[];
}) {
  return (
    <div className="h-44 w-full" role="img" aria-label="Weekly saves and reviews chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.5 0.02 265 / 0.2)" />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "oklch(0.65 0.03 265)", fontSize: 11 }}
          />
          <YAxis hide />
          <Tooltip
            cursor={{ fill: "oklch(0.5 0.05 265 / 0.08)" }}
            contentStyle={{
              background: "oklch(0.19 0.022 265)",
              border: "1px solid oklch(1 0 0 / 10%)",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Bar dataKey="items" name="Saved" fill="oklch(0.68 0.17 265)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="reviews" name="Reviews" fill="oklch(0.7 0.12 200)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
