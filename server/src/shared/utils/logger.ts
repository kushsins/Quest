type LogMethod = (message: string, ...details: unknown[]) => void;

function write(
  level: "info" | "warn" | "error",
  message: string,
  details: unknown[],
): void {
  const prefix = "[Quest]";

  if (details.length > 0) {
    console[level](prefix, message, ...details);
    return;
  }

  console[level](prefix, message);
}

export const logger: Record<"info" | "warn" | "error", LogMethod> = {
  info: (message, ...details) => {
    write("info", message, details);
  },
  warn: (message, ...details) => {
    write("warn", message, details);
  },
  error: (message, ...details) => {
    write("error", message, details);
  },
};
