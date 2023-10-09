function getCurrentLocale () {
  return navigator?.language || 'en-US'
}

module.exports = {
  getCurrentLocale
}
