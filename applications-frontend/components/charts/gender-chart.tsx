// components/charts/gender-chart.tsx
"use client";

import { Pie, PieChart, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function GenderChart({
  female,
  male,
}: {
  female: number;
  male: number;
}) {
  const data = [
    { name: "Feminino", value: female },
    { name: "Masculino", value: male },
  ];

  const total = female + male;

  return (
    <ChartContainer
      config={{
        Feminino: { label: "Feminino", color: "#212529" },
        Masculino: { label: "Masculino", color: "#6c757d" },
      }}
      className="h-[300px]"
    >
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent />} />

        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          labelLine={false}
          label={({ value }) => {
            if (!value || total === 0) return "";
            const percent = ((value / total) * 100).toFixed(0);
            return `${percent}%`;
          }}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={`var(--color-${entry.name})`} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
