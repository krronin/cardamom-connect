import winston from "winston";
const { format, createLogger, transports } = winston;
const { printf, combine, timestamp, colorize, uncolorize } = format;
const nodeEnv = process.env.NODE_ENV || "development";
const winstonFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp}: ${level}: ${stack || message}`;
});
export const logger = createLogger({
  level: nodeEnv === "development" ? "debug" : "info",
  format: combine(
    timestamp(),
    winstonFormat,
    nodeEnv === "development" ? colorize() : uncolorize()
  ),
  transports: [new transports.Console()],
});
