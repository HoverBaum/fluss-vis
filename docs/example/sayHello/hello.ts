import { HelloNameStepFunction, runFluss } from './hello.fluss'

// Implement the required function for the helloName step, using the provided type.
const helloNameImplementation: HelloNameStepFunction = ({ name }) => {
  return `Hello, ${name}!`
}

// Run the Fluss.
const result = runFluss({
  inputs: {
    name: 'World',
  },
  stepFunctions: {
    helloName: helloNameImplementation,
  },
})

console.log(result)
// "Hello, World!"
