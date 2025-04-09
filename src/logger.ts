import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
const { combine, timestamp, json, errors, simple } = winston.format;

const logDirectory = '/tmp';
const logFile = path.join(logDirectory, 'swaywm-mcp.log');

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info', // Use environment variable for log level
    format: combine(
        timestamp(),
        errors({ stack: true }),
        json()
    ),
    defaultMeta: { service: 'my-app' },
    transports: [
        new winston.transports.File({ filename: logFile }),
        new DailyRotateFile({
            filename: path.join(logDirectory, 'myapp-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        }),
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: path.join(logDirectory, 'exceptions.log') })
    ],
    rejectionHandlers: [
        new winston.transports.File({ filename: path.join(logDirectory, 'rejections.log') })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: combine(
            timestamp(),
            simple()
        )
    }));
}

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Consider exiting the process, depending on your application's needs.
    // process.exit(1);
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    // Consider exiting the process.
    process.exit(1);
});


export default logger; // Export the logger

