const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const { combine, timestamp, printf } = format;

const moment = require('moment');
const fs = require('fs');

const myFormat = printf(log => {
  return `[${moment().format('YYYY-MM-DD HH:mm:ss')}][${log.level.toUpperCase()}][${log.message}]`;
});


let log_level = 'info';

//log_level = 'debug';


let common_transport = {
  console: new (transports.Console)({ level: log_level }),
  dailyRotateFile: new (transports.DailyRotateFile)({
    level: log_level,
    filename: `log`,
    dirname: `./log/common/`,
    datePattern: 'YYYYMMDD',
    maxSize: '5m',
    maxFiles: 10
  })
};

const logger = createLogger({
  level: log_level,
  format: myFormat,
  transports: [
    common_transport.console,
    common_transport.dailyRotateFile
  ]
});

let debug_transport = {
  console: new (transports.Console)({ level: log_level }),
  dailyRotateFile: new (transports.DailyRotateFile)({
    level: log_level,
    filename: `log`,
    dirname: `./log/debug/`,
    datePattern: 'YYYYMMDD',
    maxSize: '5m',
    maxFiles: 10
  })
};

const debug_logger = createLogger({
  level: log_level,
  format: myFormat,
  transports: [
    debug_transport.console,
    debug_transport.dailyRotateFile
  ]
});

module.exports = {
  debug_transport: debug_transport,
  write(level, data) {
    switch (level) {
      case "DEBUG":
        debug_logger.debug(data);
        break;
      case "INFO":
        logger.info(data);
        break;
      case "WARN":
        logger.warn(data);
        break;
      case "ERROR":
        logger.error(data);
        break;
    }
  }
}
