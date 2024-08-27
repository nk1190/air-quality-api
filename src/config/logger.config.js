const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;
require('winston-daily-rotate-file');

// Define the log format
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

// Create the logger instance
const logger = createLogger({
    format: combine(
        timestamp(),
        colorize(), 
        logFormat
    ),
    transports: [
        new transports.Console(), // Log to the console
        new transports.DailyRotateFile({
            filename: 'logs/all-logs-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '1d'
        }),
        new transports.DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '1d',
            level: 'error' // Log only errors to this file
        })
    ]
});

module.exports = logger;
