import { FlussStep } from './fluss'

/**
 * Turn function names into camelCase identifiers.
 * Starts with a lowercase letter, every word after that starts with an uppercase letter.
 */
const stringToCamelCase = (name: string): string =>
  name
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    })
    .replace(/-/g, '')
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
    .replace(/-/g, '')
    .replace(/\s+/g, '')

/**
 * Turns a string into a valid TypeScript identifier.
 * Replaces all characters that are not valid in an identifier with an underscore.
 * If the string starts with a number, it prepends an underscore.
 * @param name string to turn into a valid TypeScript identifier.
 * @returns a valid TypeScript identifier.
 */
export const stringToValidIdentifier = (name: string): string => {
  return stringToCamelCase(name)
    .replace(/[^a-zA-Z0-9_]/g, '')
    .replace(/^(\d)/, '_$1')
}

/**
 * Converts a step into a valid TypeScript identifier.
 * Scopes the name of this step to it's ID to preven collisions.
 * @param step The step to convert.
 * @returns A valid TypeScript identifier.
 * @example
 * ```ts
 * const step = {
 *  id: '123',
 *  name: 'My Step',
 * }
 * const identifier = stepToValidIdentifier(step)
 * // identifier = 'myStep_123'
 * ```
 * @see stringToValidIdentifier
 */
export const stepToValidIdentifier = (
  step: Pick<FlussStep, 'name'>
): string => {
  return stringToValidIdentifier(step.name)
}
