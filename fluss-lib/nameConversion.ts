/**
 * Turn function names into camelCase identifiers.
 */
export const stringToCamelCase = (name: string): string =>
  name
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    })
    .replace(/\s+/g, '')
