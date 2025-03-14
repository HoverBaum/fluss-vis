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

// Define the regex with global and unicode flags
// Source: https://thekevinscott.com/emojis-in-javascript/#writing-a-regular-expression
const emojiRegex =
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c\ude32-\ude3a]|[\ud83c\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/gu

/**
 * Replaces emojis in the input text using the provided regex.
 *
 * @param text - The input string that may contain emojis.
 * @param replacement - The string to replace each found emoji. Defaults to an empty string.
 * @returns The processed string with emojis replaced.
 */
export const replaceEmojis = (
  text: string,
  replacement: string = ''
): string => {
  return text.replace(emojiRegex, replacement)
}

export const stringToValidIdentifier = (name: string): string => {
  return stringToCamelCase(
    name.replace(/[^a-zA-Z0-9_]/g, '_').replace(/^(\d)/, '_$1')
  )
}
