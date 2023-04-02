const dateTime = require('./lib/dateTime')
const locale = require('./lib/locale')
const number = require('./lib/number')
const string = require('./lib/string')

module.exports = {
  ...dateTime,
  ...locale,
  ...number,
  ...string
}
