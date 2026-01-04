const CAMEL_CASE_EDGES_REGEXP = /([A-Z](?=[A-Z][a-z])|[^A-Z](?=[A-Z])|[a-zA-Z](?=[^a-zA-Z]))/g
/* From https://stackoverflow.com/a/34680912 */

export function camelCaseToTitleCase (str: string): string {
  const spaced = str.replace(CAMEL_CASE_EDGES_REGEXP, ' $1')
  return capitalizeFirstLetter(spaced)
}

export function capitalizeFirstLetter (str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

