
import React from "react";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  variant?: "default" | "primary" | "secondary" | "outline";
  className?: string;
}

export function DashboardCard({
  title,
  description,
  icon: Icon,
  to,
  variant = "default",
  className,
}: DashboardCardProps) {
  const variantClasses = {
    default: "health-card health-card-hover bg-card text-card-foreground",
    primary: "health-card health-card-hover bg-primary text-primary-foreground",
    secondary: "health-card health-card-hover bg-secondary text-secondary-foreground",
    outline: "health-card health-card-hover bg-background border-2 hover:bg-muted/20",
  };

  return (
    <Link
      to={to}
      className={cn(
        "block transition-all duration-300 relative",
        variantClasses[variant],
        className
      )}
    >
      <div className="flex flex-col items-center text-center md:items-start md:text-left md:flex-row gap-4">
        <div className={cn(
          "flex shrink-0 items-center justify-center rounded-full p-2",
          variant === "default" && "bg-primary/10 text-primary",
          variant === "primary" && "bg-primary-foreground/10 text-primary-foreground",
          variant === "secondary" && "bg-secondary-foreground/10 text-secondary-foreground",
          variant === "outline" && "bg-primary/10 text-primary",
        )}>
          <Icon className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-xl">{title}</h3>
          <p className={cn(
            "text-base",
            variant === "default" && "text-muted-foreground",
            variant === "primary" && "text-primary-foreground/80",
            variant === "secondary" && "text-secondary-foreground/80",
            variant === "outline" && "text-muted-foreground",
          )}>
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
