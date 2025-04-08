
import React from "react";
import { Calendar, FileText, Phone, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface PatientProps {
  id: string;
  name: string;
  age: number;
  gender: string;
  regNo: string;
  phone: string;
  lastVisit: string;
  condition: "stable" | "followup" | "critical" | "new";
  className?: string;
}

export function PatientCard({
  id,
  name,
  age,
  gender,
  regNo,
  phone,
  lastVisit,
  condition,
  className,
}: PatientProps) {
  const statusClasses = {
    stable: "status-stable",
    followup: "status-warning",
    critical: "status-critical",
    new: "status-info",
  };

  const statusText = {
    stable: "Stable",
    followup: "Follow-up Required",
    critical: "Critical Attention",
    new: "New Patient",
  };

  return (
    <Link to={`/patients/${regNo}`} className={cn("block", className)}>
      <div className="health-card health-card-hover">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User className="h-6 w-6" />
            </div>
            
            <div>
              <h3 className="font-semibold text-lg">{name}</h3>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span>{age} yrs, {gender}</span>
                <span className="flex items-center">
                  <FileText className="h-3 w-3 mr-1" />
                  {regNo}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground flex items-center">
                <Phone className="h-3 w-3 mr-1" />
                {phone}
              </span>
              <span className="text-sm text-muted-foreground flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                Last Visit: {lastVisit}
              </span>
            </div>
            
            <div className={cn(
              "px-3 py-1 rounded-full text-xs font-medium",
              statusClasses[condition]
            )}>
              {statusText[condition]}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
