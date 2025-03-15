const locale = inputs.locale
const number = inputs.number

// How do we detect a branch ????

const branch = new Promise((resolve, reject) => {
  const branch1_id = stepFunctions.branch1({
    number
  })

  const branch2_id = stepFunctions.branch2({
    input: await branch1_id
  })

  resolve(branch2_id)
})

const squareNumber_id = stepFunctions.squareNumber({
  number
})

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
  branchResult: await branch_id
}