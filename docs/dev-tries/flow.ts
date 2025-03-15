const locale = inputs.locale

// continue resolving what we can....

// Now I can resolve the next one that still has dependencies.
const createString_id = stepFunctions.createString({
  number: await squareNumber_id
  locale
})

// Whcih oen can I resolve first?
const another_id = stepFunctions.another({
  stringRepsentation: await createString_id
})

return {
  squaredNumber: await squareNumber_id,
  stringRepsentation: await createString_id
  someOutput: await another_id
}