
import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: number;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: StatCardProps) {
  const variantClasses = {
    default: "bg-card text-card-foreground",
    success: "status-stable",
    warning: "status-warning",
    danger: "status-critical",
    info: "status-info",
  };

  const iconClasses = {
    default: "text-primary",
    success: "text-health-success",
    warning: "text-health-warning",
    danger: "text-health-danger",
    info: "text-health-info",
  };

  return (
    <div
      className={cn(
        "health-card",
        variantClasses[variant],
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-base">{title}</h3>
        <div className={cn(
          "p-2 rounded-full",
          variant === "default" && "bg-primary/10",
          variant === "success" && "bg-health-success/10",
          variant === "warning" && "bg-health-warning/10",
          variant === "danger" && "bg-health-danger/10",
          variant === "info" && "bg-health-info/10",
        )}>
          <Icon className={cn("h-5 w-5", iconClasses[variant])} />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-semibold">{value}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {trend !== undefined && (
          <div className="flex items-center mt-2">
            <span
              className={cn(
                "text-sm font-medium",
                trend > 0 && "text-health-success",
                trend < 0 && "text-health-danger",
                trend === 0 && "text-muted-foreground"
              )}
            >
              {trend > 0 && "+"}
              {trend}%
            </span>
            <span className="text-sm text-muted-foreground ml-1">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
}
