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
        // Log to the console
        new transports.Console(),
        
        // Log all the logs (error, info, warn) to 'all-log' file dated with the current date 
        new transports.DailyRotateFile({
            filename: 'logs/all-logs-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '1d'
        }),

        // Log all the errors to a seprated file 'error-' file dated with the current date 
        new transports.DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '1d',
            level: 'error' 
        })
    ]
});

module.exports = logger;
