export type Locale = 'en' | 'de'

type runFlussParams = {
  inputs: {
    locale: Locale
    baseNumber: number
  }
  stepFunctions: {
    squareNumber: (args: { baseNumber: number }) => number
    createString: (args: { locale: Locale; squaredNumber: number }) => string
  }
}

type RunFlussResult = {
  writtenEquation: string
}

export const runFluss = async (
  flussArgs: runFlussParams
): Promise<RunFlussResult> => {
  const { inputs, stepFunctions } = flussArgs
  const { baseNumber: baseNumber_start, locale: locale_start } = inputs

  const squaredNumber_TRqTC = await stepFunctions.squareNumber({
    baseNumber: baseNumber_start,
  })
  const writtenEquation_XyASV = await stepFunctions.createString({
    locale: locale_start,
    squaredNumber: squaredNumber_TRqTC,
  })

  return {
    writtenEquation: writtenEquation_XyASV,
  }
}
