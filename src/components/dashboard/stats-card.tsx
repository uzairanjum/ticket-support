"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color?: string;
  trend?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  color = "text-[#005430]",
}: StatsCardProps) {
  return (
    <Card className="relative overflow-hidden border border-gray-200 bg-card p-6 transition-all duration-300 hover:shadow-lg hover:shadow-[#005430]/5 hover:border-[#005430]/20 group">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 tracking-wide uppercase">
            {title}
          </p>
          <p className={`text-3xl font-bold tracking-tight ${color}`}>
            {value}
          </p>
        </div>
        <div className="rounded-xl bg-gray-100 p-3 transition-colors group-hover:bg-[#005430]/10">
          {icon}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#005430]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </Card>
  );
}

export function StatsCardSkeleton() {
  return (
    <Card className="p-6 border border-gray-200">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="h-12 w-12 rounded-xl" />
      </div>
    </Card>
  );
}
