import pino from 'pino';

const isDev = process.env.NODE_ENV !== 'production';
const logger = pino({ prettyPrint: isDev });

export default logger;