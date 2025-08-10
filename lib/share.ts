export type SharedFlussPayload<T> = {
  version: number
  state: T
}

// Simple URI-safe encoding using encodeURIComponent to avoid Unicode/base64 pitfalls
export const encodeSharedFluss = <T>(payload: SharedFlussPayload<T>): string => {
  const json = JSON.stringify(payload)
  return encodeURIComponent(json)
}

export const decodeSharedFluss = <T>(encoded: string): SharedFlussPayload<T> => {
  const json = decodeURIComponent(encoded)
  const parsed = JSON.parse(json)
  return parsed as SharedFlussPayload<T>
}
