/**
 * Turn function names into camelCase identifiers.
 * Starts with a lowercase letter, every word after that starts with an uppercase letter.
 */
export const stringToCamelCase = (name: string): string =>
  name
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    })
    .replace(/\s+/g, '')

/**
 * Turn function names into PascalCase identifiers.
 * Every word starts with an uppercase letter.
 */
export const stringToPascalCase = (name: string): string =>
  name
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word) {
      return word.toUpperCase()
    })
    .replace(/\s+/g, '')
