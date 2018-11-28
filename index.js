"use strict";



//  P A C K A G E S

const _ = require("lodash");
const pino = require("pino");

const logger = pino({
  base: {
    name: process.env.APP_NAME
  },
  level: process.env.NODE_ENV === "test" ? "silent" : "info",
  prettyPrint: process.env.NODE_ENV === "development",
  serializers: {
    e: pino.stdSerializers.err,
    err: pino.stdSerializers.err,
    error: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res
  }
});



//  P R O G R A M

function logWrapper(log, level, msg, ...args) {
  switch(true) {
    case (!args.length):
      log[level](msg);
      break;

    case (args.length > 1):
      log[level](msg, ...args);
      break;

    case (_.isPlainObject(args[0]) || args[0] instanceof Error):
      log[level](args[0], msg);
      break;

    case (_.isArray(args[0])):
      log[level]({ array: args[0] }, msg);
      break;

    default:
      log[level](msg, args[0]);
      break;
  }
}



//  E X P O R T

module.exports = exports = name => {
  const log = logger.child({ namespace: name });

  return {
    info(msg, ...args) {
      logWrapper(log, "info", msg, ...args);
    },

    warn(msg, ...args) {
      logWrapper(log, "warn", msg, ...args);
    },

    error(msg, ...args) {
      logWrapper(log, "error", msg, ...args);
    }
  };
};

