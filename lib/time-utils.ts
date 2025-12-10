/**
 * Time utility functions for timestamp formatting and timezone conversion
 */

/**
 * Get relative time string (e.g., "2 minutes ago", "1 s ago")
 */
export function getRelativeTime(
  timestamp: Date | number | null | undefined,
): string {
  if (!timestamp) {
    return "No data";
  }

  const now = Date.now();
  const then = typeof timestamp === "number" ? timestamp : timestamp.getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 10) {
    return "just now";
  } else if (diffSec < 60) {
    return `${diffSec} s ago`;
  } else if (diffMin < 60) {
    return `${diffMin} min ago`;
  } else if (diffHour < 24) {
    return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
  } else if (diffDay < 7) {
    return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
  } else {
    const date = new Date(then);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
}

/**
 * Convert timestamp to UTC-7 timezone
 * Returns formatted time string with timezone
 */
export function toIndonesiaTime(timestamp: Date | number | null | undefined): {
  time: string;
  date: string;
  timezone: string;
  delta: string;
} {
  if (!timestamp) {
    return {
      time: "No data",
      date: "No data",
      timezone: "UTC-7",
      delta: "Unknown",
    };
  }

  const date = typeof timestamp === "number" ? new Date(timestamp) : timestamp;

  // Convert to UTC-7 timezone (Mountain Standard Time / Pacific Daylight Time)
  const utcMinus7Time = new Date(
    date.toLocaleString("en-US", {
      timeZone: "America/Phoenix",
    }),
  );

  // Calculate timezone delta from local
  const localOffset = date.getTimezoneOffset(); // in minutes
  const utcMinus7Offset = 420; // UTC-7 is 7 hours behind UTC (7 * 60 = 420 minutes behind UTC)
  const deltaMinutes = localOffset - utcMinus7Offset;
  const deltaHours = Math.abs(deltaMinutes) / 60;
  const deltaSign = deltaMinutes > 0 ? "+" : "-";

  return {
    time: utcMinus7Time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }),
    date: utcMinus7Time.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    timezone: "UTC-7",
    delta:
      deltaHours !== 0
        ? `${deltaSign}${deltaHours}h from your time`
        : "Same as your timezone",
  };
}

/**
 * Format timestamp for display with both relative and absolute time
 */
export function formatTimestamp(timestamp: Date | number): {
  relative: string;
  absolute: string;
  indonesia: ReturnType<typeof toIndonesiaTime>;
} {
  return {
    relative: getRelativeTime(timestamp),
    absolute: new Date(
      typeof timestamp === "number" ? timestamp : timestamp.getTime(),
    ).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    indonesia: toIndonesiaTime(timestamp),
  };
}
