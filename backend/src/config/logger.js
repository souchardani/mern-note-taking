import winston from "winston";

const isDevelopment = process.env.NODE_ENV !== "production";

const logger = winston.createLogger({
  level: isDevelopment ? "debug" : "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // En desarrollo: consola con colores
    // En producción: consola sin colores (Render captura stdout)
    new winston.transports.Console({
      format: isDevelopment
        ? winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        : winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          ),
    }),
  ],
});

export default logger;
