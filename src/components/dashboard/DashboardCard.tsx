
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

export function DashboardCard({
  title,
  value,
  icon,
  description,
  trend,
  trendValue,
  className
}: DashboardCardProps) {
  return (
    <Card className={cn("scale-in-center", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="opacity-70">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trendValue) && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center">
            {description}
            {trendValue && (
              <span className={cn("ml-1", {
                "text-green-500": trend === "up",
                "text-red-500": trend === "down",
                "text-gray-500": trend === "neutral"
              })}>
                {trend === "up" && "↑"}
                {trend === "down" && "↓"}
                {trendValue}
              </span>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
