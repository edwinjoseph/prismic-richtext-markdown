const pino = require('pino');

const isDev = process.env.NODE_ENV !== 'production';
const logger = pino({ prettyPrint: isDev });

module.exports = logger;