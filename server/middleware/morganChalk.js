const morgan = require('morgan');
const moment = require('moment');
const chalk = require('chalk');

morgan.token('date', () => moment().format('DD-MM-YYYY HH:mm:ss:sss'));

morgan.token('status', (req, res) => {
  const status = (typeof res.headersSent !== 'boolean' ? Boolean(res.header) : res.headersSent)
    ? res.statusCode
    : undefined;

  function getColor() {
    if (status >= 500) return 31;
    if (status >= 400) return 33;
    if (status >= 300) return 36;
    if (status >= 200) return 32;
    return 0;
  }

  const color = getColor();

  return `\x1b[${color}m${status}\x1b[0m`;
});

const morganChalk = morgan((tokens, req, res) => [
  chalk.white(tokens.date(req, res)),
  chalk.green.bold(tokens.method(req, res)),
  chalk.bold(tokens.status(req, res)),
  chalk.white(tokens.url(req, res)),
  chalk.yellow(`${tokens['response-time'](req, res)} ms`),
].join(' '));

module.exports = morganChalk;