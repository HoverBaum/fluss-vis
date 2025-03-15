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
  squaredNumber: number
}

export const runFluss = async (
  flussArgs: runFlussParams
): Promise<RunFlussResult> => {
  const { inputs, stepFunctions } = flussArgs
  const { baseNumber: baseNumber_start, locale: locale_start } = inputs

  const TRqTC_Ki3pb_baseNumber = stepFunctions.squareNumber({
    baseNumber: baseNumber_start,
  })
  const XyASV_VQJps_writtenEquation = stepFunctions.createString({
    locale: locale_start,
    squaredNumber: await TRqTC_Ki3pb_baseNumber,
  })

  return {
    writtenEquation: await XyASV_VQJps_writtenEquation,
    squaredNumber: await TRqTC_Ki3pb_baseNumber,
  }
}
