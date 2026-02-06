import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function OverviviewDataCard({
  amount,
  label,
}: {
  label: string;
  amount: number | string;
}) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {amount}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
