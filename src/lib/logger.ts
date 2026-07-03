/**
 * Structured Logger — production-grade logging utility for Operator.
 * Outputs structured JSON in production and formatted text in development.
 * Use correlation IDs from request headers or generated UUIDs for tracing.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  correlationId?: string;
  organizationId?: string;
  userId?: string;
  durationMs?: number;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  data?: Record<string, unknown>;
}

function formatLog(entry: LogEntry): string {
  if (process.env.NODE_ENV === "production") {
    return JSON.stringify(entry);
  }
  const levelColors: Record<LogLevel, string> = {
    debug: "\x1b[37m",  // white
    info: "\x1b[36m",   // cyan
    warn: "\x1b[33m",   // yellow
    error: "\x1b[31m",  // red
  };
  const reset = "\x1b[0m";
  const color = levelColors[entry.level];
  const contextStr = entry.context ? ` [${entry.context}]` : "";
  const corrStr = entry.correlationId ? ` {${entry.correlationId.slice(0, 8)}}` : "";
  return `${color}[${entry.level.toUpperCase()}]${reset}${contextStr}${corrStr} ${entry.message}${entry.data ? ` ${JSON.stringify(entry.data)}` : ""}`;
}

function buildEntry(
  level: LogLevel,
  message: string,
  options?: {
    context?: string;
    correlationId?: string;
    organizationId?: string;
    userId?: string;
    durationMs?: number;
    error?: Error | unknown;
    data?: Record<string, unknown>;
  }
): LogEntry {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    context: options?.context,
    correlationId: options?.correlationId,
    organizationId: options?.organizationId,
    userId: options?.userId,
    durationMs: options?.durationMs,
    data: options?.data,
  };

  if (options?.error) {
    const err = options.error instanceof Error ? options.error : new Error(String(options.error));
    entry.error = {
      name: err.name,
      message: err.message,
      stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
    };
  }

  return entry;
}

export const logger = {
  debug(message: string, options?: Parameters<typeof buildEntry>[2]) {
    if (process.env.NODE_ENV === "production") return; // skip debug in prod
    const entry = buildEntry("debug", message, options);
    console.debug(formatLog(entry));
  },

  info(message: string, options?: Parameters<typeof buildEntry>[2]) {
    const entry = buildEntry("info", message, options);
    console.log(formatLog(entry));
  },

  warn(message: string, options?: Parameters<typeof buildEntry>[2]) {
    const entry = buildEntry("warn", message, options);
    console.warn(formatLog(entry));
  },

  error(message: string, options?: Parameters<typeof buildEntry>[2]) {
    const entry = buildEntry("error", message, options);
    console.error(formatLog(entry));
    // TODO: Forward to Sentry when integrated
    // if (typeof Sentry !== 'undefined') Sentry.captureException(options?.error ?? new Error(message));
  },

  /**
   * Wraps an async function with timing and automatic error logging.
   * Returns the result or re-throws the error after logging.
   */
  async timed<T>(
    label: string,
    fn: () => Promise<T>,
    context?: string
  ): Promise<T> {
    const start = Date.now();
    try {
      const result = await fn();
      const durationMs = Date.now() - start;
      if (durationMs > 1000) {
        logger.warn(`Slow operation: ${label}`, { context, durationMs });
      } else {
        logger.debug(`${label} completed`, { context, durationMs });
      }
      return result;
    } catch (err) {
      const durationMs = Date.now() - start;
      logger.error(`${label} failed`, { context, durationMs, error: err });
      throw err;
    }
  },
};
