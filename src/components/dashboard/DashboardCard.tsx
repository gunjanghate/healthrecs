
import React from "react";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "../../assets/image.png"
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

  return (
    <Link
      to={to}
      className={cn(
        "block transition-all bg-primary/10 duration-300 relative hover:bg-primary/60 py-5 px-3 rounded-2xl hover:rounded-none hover:drop-shadow-xl hover:scale-105",
        
        className
      )}
    >
      <div className="flex flex-col items-center text-center md:items-start md:text-left md:flex-row gap-4">
        <div className={cn(
          "flex shrink-0 items-center justify-center rounded-full p-2",
          variant === "default" && "bg-primary/10 text-black",
          variant === "primary" && "bg-primary-foreground/10 text-black",
          variant === "secondary" && "bg-secondary-foreground/10 text-black",
          variant === "outline" && "bg-primary/10 text-black",
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
