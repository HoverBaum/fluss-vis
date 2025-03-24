import { nanoid } from 'nanoid'

export const shortId = () => {
  return nanoid(5)
}

export const newId = () => {
  return nanoid()
}
