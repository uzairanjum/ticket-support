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
  color = "text-emerald-600",
}: StatsCardProps) {
  return (
    <Card className="relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/5">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-400 tracking-wider uppercase">
            {title}
          </p>
          <p className={`text-3xl font-bold tracking-tight ${color}`}>
            {value}
          </p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-3.5 transition-all duration-300 group-hover:scale-110">
          {icon}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Card>
  );
}

export function StatsCardSkeleton() {
  return (
    <Card className="p-5 border-0 bg-white/80 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-8 w-12" />
        </div>
        <Skeleton className="h-12 w-12 rounded-2xl" />
      </div>
    </Card>
  );
}
