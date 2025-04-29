import { runFluss, SquareNumberStepFunction } from './squaredNumber.fluss'

const squareNumber: SquareNumberStepFunction = ({ baseNumber }) =>
  Math.pow(baseNumber, 2)

runFluss({
  inputs: {
    baseNumber: 2,
  },
  stepFunctions: {
    squareNumber,
  },
})
