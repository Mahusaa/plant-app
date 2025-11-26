// app/plants/[id]/plant-stats-client.tsx
"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, ResponsiveContainer, Area, AreaChart } from "recharts";

// Types (you can also move these to a separate types file)
export type PlantStat = {
  key: string;
  icon: string;
  value: string;
  subtitle?: string;
  unit: string;
  color: string;
};

export type ThresholdRange = {
  optimal: { min: number; max: number };
  warning: { min: number; max: number };
  critical: { min: number; max: number };
};

export type TimeSeriesData = {
  timestamp: Date;
  value: number;
}[];

type TimeRange = "day" | "week" | "month";

interface PlantStatsClientProps {
  stats: PlantStat[];
  thresholds: Record<string, ThresholdRange>;
  timeSeriesData: Record<string, TimeSeriesData>;
}

export function PlantStatsClient({ stats, thresholds, timeSeriesData }: PlantStatsClientProps) {
  const [selectedStat, setSelectedStat] = useState<PlantStat | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("day");

  // Filter time series data based on selected range
  const filteredData = useMemo(() => {
    if (!selectedStat) return [];

    const data = timeSeriesData[selectedStat.key];
    if (!data) return [];

    const now = new Date();
    let cutoffTime: number;

    switch (timeRange) {
      case "day":
        cutoffTime = now.getTime() - 24 * 60 * 60 * 1000;
        break;
      case "week":
        cutoffTime = now.getTime() - 7 * 24 * 60 * 60 * 1000;
        break;
      case "month":
        cutoffTime = now.getTime() - 30 * 24 * 60 * 60 * 1000;
        break;
    }

    return data
      .filter(point => point.timestamp.getTime() >= cutoffTime)
      .map(point => ({
        timestamp: point.timestamp,
        value: Math.round(point.value * 100) / 100,
        formattedTime: point.timestamp.toISOString(),
      }));
  }, [selectedStat, timeRange, timeSeriesData]);

  const getStatusColor = (stat: PlantStat) => {
    const threshold = thresholds[stat.key];
    if (!threshold) return "text-gray-600";

    const value = parseFloat(stat.value);

    if (value >= threshold.optimal.min && value <= threshold.optimal.max) {
      return "text-green-600";
    } else if (value >= threshold.warning.min && value <= threshold.warning.max) {
      return "text-yellow-600";
    } else {
      return "text-red-600";
    }
  };

  const getStatusIcon = (stat: PlantStat) => {
    const threshold = thresholds[stat.key];
    if (!threshold) return "●";

    const value = parseFloat(stat.value);

    if (value >= threshold.optimal.min && value <= threshold.optimal.max) {
      return "●"; // Green dot
    } else if (value >= threshold.warning.min && value <= threshold.warning.max) {
      return "⚠"; // Warning
    } else {
      return "⚠"; // Critical
    }
  };

  const chartConfig = {
    value: {
      label: selectedStat?.key || "Value",
      color: "hsl(142, 76%, 36%)", // Green color
    },
  };

  return (
    <>
      {/* Enhanced Stats Grid (mobile-first) */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.key}
            onClick={() => setSelectedStat(stat)}
            className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 ${stat.color}`}
          >
            <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xl sm:text-2xl" aria-hidden>{stat.icon}</span>
                <span className={`text-xs sm:text-sm font-bold ${getStatusColor(stat)}`}>
                  {getStatusIcon(stat)}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] sm:text-xs font-medium text-gray-600 uppercase tracking-wide">
                  {stat.key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">
                    {stat.value}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-600 font-medium">
                    {stat.unit}
                  </span>
                </div>
                {stat.subtitle && (
                  <p className={`text-[10px] sm:text-xs font-medium ${getStatusColor(stat)}`}>
                    {stat.subtitle}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Enhanced Chart Modal */}
      {selectedStat && (
        <Dialog open={!!selectedStat} onOpenChange={() => setSelectedStat(null)}>
          <DialogContent className="w-[95vw] max-w-2xl p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
            <DialogHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedStat.icon}</span>
                <div>
                  <DialogTitle className="text-lg sm:text-xl font-bold">
                    {selectedStat.key.replace(/([A-Z])/g, ' $1').trim()}
                  </DialogTitle>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Current: {selectedStat.value}{selectedStat.unit}
                  </p>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-5 sm:space-y-6">
              {/* Time Range Selector */}
              <div className="flex justify-center">
                <div className="inline-flex rounded-lg bg-gray-100 p-1">
                  {(["day", "week", "month"] as TimeRange[]).map((range) => (
                    <Button
                      key={range}
                      variant={timeRange === range ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setTimeRange(range)}
                      className={`capitalize ${timeRange === range ? 'bg-white shadow-sm' : ''}`}
                    >
                      {range}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Threshold Info (mobile-first) */}
              {thresholds[selectedStat.key] && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="text-[10px] sm:text-xs font-medium text-green-800">Optimal Range</div>
                    <div className="text-sm font-bold text-green-900">
                      {thresholds[selectedStat.key].optimal.min} - {thresholds[selectedStat.key].optimal.max}
                      <span className="text-xs ml-1">{selectedStat.unit}</span>
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="text-[10px] sm:text-xs font-medium text-yellow-800">Warning Range</div>
                    <div className="text-sm font-bold text-yellow-900">
                      {thresholds[selectedStat.key].warning.min} - {thresholds[selectedStat.key].warning.max}
                      <span className="text-xs ml-1">{selectedStat.unit}</span>
                    </div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="text-[10px] sm:text-xs font-medium text-red-800">Critical Range</div>
                    <div className="text-sm font-bold text-red-900">
                      {"<"}{thresholds[selectedStat.key].critical.min} {"or"} {">"}{thresholds[selectedStat.key].critical.max}
                      <span className="text-xs ml-1">{selectedStat.unit}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Chart */}
              <div className="h-64 sm:h-80">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={filteredData} margin={{ top: 12, right: 12, bottom: 12, left: 12 }}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>

                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

                      <XAxis
                        dataKey="formattedTime"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        fontSize={10}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          // Add 7 hours for Indonesian timezone (WIB - UTC+7)
                          const wibDate = new Date(date.getTime() + (7 * 60 * 60 * 1000));
                          switch (timeRange) {
                            case "day":
                              return wibDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
                            case "week":
                              return wibDate.toLocaleDateString([], { weekday: "short", day: "numeric" });
                            case "month":
                              return wibDate.toLocaleDateString([], { day: "numeric", month: "short" });
                          }
                        }}
                      />

                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        fontSize={10}
                        domain={['dataMin - 5', 'dataMax + 5']}
                      />

                      <ChartTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const date = new Date(label);
                            // Add 7 hours for Indonesian timezone (WIB - UTC+7)
                            const wibDate = new Date(date.getTime() + (7 * 60 * 60 * 1000));
                            return (
                              <div className="bg-white p-3 border rounded-lg shadow-lg">
                                <p className="text-xs sm:text-sm font-medium">
                                  {wibDate.toLocaleString()} WIB
                                </p>
                                <p className="text-base sm:text-lg font-bold text-green-600">
                                  {payload[0].value}{selectedStat.unit}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />

                      {/* Threshold Lines */}
                      {thresholds[selectedStat.key] && (
                        <>
                          <ReferenceLine
                            y={thresholds[selectedStat.key].optimal.min}
                            stroke="#10b981"
                            strokeDasharray="4 4"
                            strokeWidth={2}
                          />
                          <ReferenceLine
                            y={thresholds[selectedStat.key].optimal.max}
                            stroke="#10b981"
                            strokeDasharray="4 4"
                            strokeWidth={2}
                          />
                          <ReferenceLine
                            y={thresholds[selectedStat.key].warning.min}
                            stroke="#f59e0b"
                            strokeDasharray="2 2"
                            strokeWidth={1}
                          />
                          <ReferenceLine
                            y={thresholds[selectedStat.key].warning.max}
                            stroke="#f59e0b"
                            strokeDasharray="2 2"
                            strokeWidth={1}
                          />
                        </>
                      )}

                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(142, 76%, 36%)"
                        strokeWidth={3}
                        fill="url(#colorValue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              {/* Chart Legend */}
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-[11px] sm:text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-green-500"></div>
                  <span>Optimal Range</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-yellow-500 border-dashed"></div>
                  <span>Warning Range</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-1 bg-green-500 rounded"></div>
                  <span>Current Value</span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
