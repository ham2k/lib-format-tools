const CAMEL_CASE_EDGES_REGEXP = /([A-Z](?=[A-Z][a-z])|[^A-Z](?=[A-Z])|[a-zA-Z](?=[^a-zA-Z]))/g
/* From https://stackoverflow.com/a/34680912 */

function camelCaseToTitleCase (str) {
  const spaced = str.replace(CAMEL_CASE_EDGES_REGEXP, ' $1')
  return capitalizeFirstLetter(spaced)
}

function capitalizeFirstLetter (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

module.exports = {
  camelCaseToTitleCase,
  capitalizeFirstLetter
}
