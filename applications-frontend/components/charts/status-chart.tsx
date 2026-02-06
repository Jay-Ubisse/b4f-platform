// components/charts/status-chart.tsx
"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function StatusChart({
  admitted,
  notAdmitted,
  notInterviewed,
}: {
  admitted: number;
  notAdmitted: number;
  notInterviewed: number;
}) {
  const data = [
    { status: "Admitidos", total: admitted },
    { status: "Não Admitidos", total: notAdmitted },
    { status: "Não Entrevistados", total: notInterviewed },
  ];

  return (
    <ChartContainer
      config={{
        total: {
          label: "Candidatos",
          color: "#6c757d",
        },
      }}
      className="h-[300px]"
    >
      <BarChart data={data}>
        <XAxis dataKey="status" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="total" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
