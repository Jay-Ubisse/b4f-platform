"use client";

import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";

export function ApplicationsEvolutionChart({
  data,
}: {
  data: { period: string; total: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <XAxis dataKey="period" />
        <Tooltip />
        <Line type="monotone" dataKey="total" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
