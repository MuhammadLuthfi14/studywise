import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RecommendationResult } from "../types";

const COLORS = [
  "var(--sw-ai)",
  "var(--sw-primary)",
  "var(--sw-success)",
  "var(--chart-4)",
  "var(--chart-5)",
];

// Diagram batang persentase CF tiap rekomendasi.
export function ResultChart({ results }: { results: RecommendationResult[] }) {
  const data = results.map((r) => ({
    name: r.recommendation_code,
    label: r.recommendation,
    persentase: r.percentage,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          key={data.map((d) => d.name).join(",")}
          data={data}
          margin={{ top: 8, right: 8, left: -16, bottom: 8 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
            fontSize={12}
          />
          <YAxis
            domain={[0, 100]}
            tickLine={false}
            axisLine={false}
            fontSize={12}
            unit="%"
          />
          <Tooltip
            cursor={{ fill: "color-mix(in srgb, var(--sw-ai) 6%, transparent)" }}
            formatter={(value: number) => [`${value}%`, "Nilai CF"]}
            labelFormatter={(_, payload) =>
              payload?.[0]?.payload?.label ?? ""
            }
            contentStyle={{
              borderRadius: 12,
              border: "1px solid var(--border)",
              fontSize: 13,
            }}
          />
          <Bar dataKey="persentase" radius={[6, 6, 0, 0]} maxBarSize={56} isAnimationActive={false}>
            {data.map((entry, i) => (
              <Cell key={`cell-${entry.name}-${i}`} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
