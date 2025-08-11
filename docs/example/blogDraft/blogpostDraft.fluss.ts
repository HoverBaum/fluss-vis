// State for a single step.
type FlussRunStatus = 'waiting' | 'running' | 'done' | 'error'

// FLUSS_GEN: CustomTypes - dynamic
export type OptionalAudio = Blob | undefined
export type OptionalString = string | undefined
export type ExamplePost = {
  id: string
  title: string
  content: string
}
export type ExampleArray = ExamplePost[]

// FLUSS_GEN: FlussInputs - dynamic

export type FlussInputs = {
  postVoiceNote: OptionalAudio
  examplePosts: ExampleArray
  blogNotes: OptionalString
}

// FLUSS_GEN: StepFunctionTypes - dynamic

export type EndStepFunction = (args: {
  postDraft: string
}) => Promise<{ postDraft: string }> | { postDraft: string }

export type VoiceNoteToStringStepFunction = (args: {
  postVoiceNote: OptionalAudio
}) => Promise<OptionalString> | OptionalString

export type StructureDescriptionStepFunction = (args: {
  postDescription: OptionalString
  blogNotes: OptionalString
}) => Promise<string> | string

export type WriteDraftStepFunction = (args: {
  usersIdeas: string
  examplePosts: ExampleArray
}) => Promise<string> | string

// FLUSS_GEN: StepIO - dynamic

type StepIO = {
  start: {
    input: FlussInputs
    output: FlussInputs
  }
  end: {
    input: Parameters<EndStepFunction>[0]
    output: ReturnType<EndStepFunction>
  }
  voiceNoteToString: {
    input: Parameters<VoiceNoteToStringStepFunction>[0]
    output: ReturnType<VoiceNoteToStringStepFunction>
  }
  structureDescription: {
    input: Parameters<StructureDescriptionStepFunction>[0]
    output: ReturnType<StructureDescriptionStepFunction>
  }
  writeDraft: {
    input: Parameters<WriteDraftStepFunction>[0]
    output: ReturnType<WriteDraftStepFunction>
  }
}

// Step IDs type
// FIXED
type FlussStepId = keyof StepIO

// Step function types mapped from StepIO
// FIXED - assumign start and end identifiers do not change.
type StepFunctions = {
  [K in Exclude<FlussStepId, 'start' | 'end'>]: (
    args: StepIO[K]['input']
  ) => Promise<StepIO[K]['output']> | StepIO[K]['output']
}

// Step definition with result based on status
// FIXED
type Step<ID extends FlussStepId> = {
  id: ID
  status: FlussRunStatus
  execute: (
    args: StepIO[ID]['input']
  ) => Promise<StepIO[ID]['output']> | StepIO[ID]['output']
  arguments: Array<{
    sourceStepId: FlussStepId
    argumentName: keyof StepIO[ID]['input']
    sourceProperty?: string
  }>
  result?: StepIO[ID]['output']
  error?: Error
}

// Flow state containing all steps
// FIXED
type FlowState = {
  [K in FlussStepId]: Step<K>
}

/**
 * Execute a single step with proper typing
 * // FIXED
 */
async function executeStep<ID extends FlussStepId>(
  step: Step<ID>,
  flowState: FlowState
): Promise<void> {
  try {
    // Build input object from dependencies
    const input = {} as StepIO[ID]['input']

    step.arguments.forEach((arg) => {
      const sourceStep = flowState[arg.sourceStepId]
      if (sourceStep.status !== 'done' || sourceStep.result === undefined) {
        throw new Error(
          'Source step ' +
            arg.sourceStepId +
            ' not complete for ' +
            String(arg.argumentName)
        )
      }

      // If sourceProperty is undefined, use the entire result
      // Otherwise, extract the specified property
      if (arg.sourceProperty === undefined) {
        input[arg.argumentName as keyof StepIO[ID]['input']] =
          sourceStep.result as StepIO[ID]['input'][keyof StepIO[ID]['input']]
      } else {
        input[arg.argumentName as keyof StepIO[ID]['input']] =
          sourceStep.result[
            arg.sourceProperty as keyof typeof sourceStep.result
          ]
      }
    })

    // Rest of the function remains the same
    console.log('Executing with Input:', input)
    const result = await step.execute(input)
    console.log('Result:', result)
    step.status = 'done'
    step.result = result
  } catch (err) {
    step.status = 'error'
    step.error = err instanceof Error ? err : new Error(String(err))
    throw step.error
  }
}

/**
 * Check if a step can be run based on its dependencies
 * // FIXED
 */
function canStepRun<ID extends FlussStepId>(
  step: Step<ID>,
  flowState: FlowState
): boolean {
  return step.arguments.every((arg) => {
    const sourceStep = flowState[arg.sourceStepId]
    return sourceStep.status === 'done' && sourceStep.result !== undefined
  })
}

/**
 * Main function to run the flow
 */
export async function runFluss(params: {
  inputs: FlussInputs
  stepFunctions: StepFunctions
}): Promise<StepIO['end']['output']> {
  const { inputs, stepFunctions } = params

  // Initialize the flow state with typed steps
  // This is generated new for each flow.
  const flowState: FlowState = {
    start: {
      id: 'start',
      status: 'done',
      execute: (args) => args,
      arguments: [],
      result: inputs,
    },
    end: {
      id: 'end',
      status: 'waiting',
      execute: (args) => args,
      arguments: [
        {
          sourceStepId: 'writeDraft',
          argumentName: 'postDraft',
        },
      ],
    },
    voiceNoteToString: {
      id: 'voiceNoteToString',
      status: 'waiting',
      execute: stepFunctions.voiceNoteToString,
      arguments: [
        {
          sourceStepId: 'start',
          argumentName: 'postVoiceNote',
          sourceProperty: 'postVoiceNote',
        },
      ],
    },
    structureDescription: {
      id: 'structureDescription',
      status: 'waiting',
      execute: stepFunctions.structureDescription,
      arguments: [
        {
          sourceStepId: 'voiceNoteToString',
          argumentName: 'postDescription',
        },
        {
          sourceStepId: 'start',
          argumentName: 'blogNotes',
          sourceProperty: 'blogNotes',
        },
      ],
    },
    writeDraft: {
      id: 'writeDraft',
      status: 'waiting',
      execute: stepFunctions.writeDraft,
      arguments: [
        {
          sourceStepId: 'structureDescription',
          argumentName: 'usersIdeas',
        },
        {
          sourceStepId: 'start',
          argumentName: 'examplePosts',
          sourceProperty: 'examplePosts',
        },
      ],
    },
  }

  return new Promise<StepIO['end']['output']>((resolve, reject) => {
    // Process runnable steps
    const processSteps = async () => {
      // Find all steps that can run now
      const runnableSteps = Object.values(flowState)
        .filter((step) => step.status === 'waiting')
        .filter((step) => canStepRun(step as Step<FlussStepId>, flowState))

      console.log(
        'Currently runnable:',
        runnableSteps.map((s) => s.id)
      )

      // Check if we're done or stuck
      if (runnableSteps.length === 0) {
        if (Object.values(flowState).every((step) => step.status === 'done')) {
          console.log('All steps done!')
          if (!flowState.end.result) {
            return reject(new Error('End step has no result'))
          }
          return resolve(flowState.end.result)
        } else {
          return reject(
            new Error('No steps can be run and not all steps are done')
          )
        }
      }

      // Execute all runnable steps
      try {
        await Promise.all(
          runnableSteps.map((step) => {
            step.status = 'running'
            return executeStep(step as Step<FlussStepId>, flowState)
          })
        )

        // Continue processing
        await processSteps()
      } catch (error) {
        reject(error)
      }
    }

    // Start the flow
    processSteps().catch(reject)
  })
}

/**
 * STATE_JSON_START{"name":"Blogpost draft","edges":[{"source":"start","sourceHandle":"out-2H3ZJmKTWsx6teMBCXFpQ","target":"dAtn7","targetHandle":"in-Bj9KQMbPWzS6wGIdc3A7P","data":{"state":"entered"},"id":"xy-edge__startout-2H3ZJmKTWsx6teMBCXFpQ-dAtn7in-Bj9KQMbPWzS6wGIdc3A7P"},{"source":"dAtn7","sourceHandle":"out-_Ln7nCi3GM07GG2oyeH4u","target":"kVY6O","targetHandle":"in-mGl4DbHlst7W3ZFotv6jV","data":{"state":"entered"},"id":"xy-edge__dAtn7out-_Ln7nCi3GM07GG2oyeH4u-kVY6Oin-mGl4DbHlst7W3ZFotv6jV"},{"source":"kVY6O","sourceHandle":"out-Twxmg0HyI0NM9ceAioeId","target":"nadG-","targetHandle":"in-hMdbvJ7HIPYXBrw8IHb8s","data":{"state":"entered"},"id":"xy-edge__kVY6Oout-Twxmg0HyI0NM9ceAioeId-nadG-in-hMdbvJ7HIPYXBrw8IHb8s"},{"source":"start","sourceHandle":"out-RcuK1Ipi4tDGn3OHsilpC","target":"nadG-","targetHandle":"in-kP7x_jdCgRenAXS41x8UE","data":{"state":"entered"},"id":"xy-edge__startout-RcuK1Ipi4tDGn3OHsilpC-nadG-in-kP7x_jdCgRenAXS41x8UE","selected":false},{"source":"nadG-","sourceHandle":"out-1rbw7UCHrf7jS8ggMxI5U","target":"end","targetHandle":"in-QNo1SZdWw0PEKTItS0lrb","data":{"state":"entered"},"id":"xy-edge__nadG-out-1rbw7UCHrf7jS8ggMxI5U-endin-QNo1SZdWw0PEKTItS0lrb"},{"source":"start","sourceHandle":"out--JXHVQ2fVeyZZwapdVJXO","target":"kVY6O","targetHandle":"in-hd9XLWgxLWBpcQAnODX8m","data":{"state":"entered"},"id":"xy-edge__startout--JXHVQ2fVeyZZwapdVJXO-kVY6Oin-hd9XLWgxLWBpcQAnODX8m"}],"nodes":[{"id":"start","position":{"x":9.15848648912727,"y":239.3015027177035},"type":"startNode","deletable":false,"data":{"type":"start","id":"start","outputs":[{"id":"out-2H3ZJmKTWsx6teMBCXFpQ","name":"Post Voice note","type":"f_DU5JfSq-qxMAVX6LfZj"},{"id":"out-RcuK1Ipi4tDGn3OHsilpC","name":"Example Posts","type":"enwEdnGKvMZmWDdp2uEqi"},{"id":"out--JXHVQ2fVeyZZwapdVJXO","name":"Blog Notes","type":"Rmvz3dF1qzxxZfTS7UfbL"}],"name":"Start","description":"Start node of the Fluss.","state":"entered"},"measured":{"width":275,"height":494},"selected":false,"dragging":false},{"id":"end","position":{"x":1608.446237930668,"y":459.5147385534135},"type":"endNode","deletable":false,"data":{"type":"end","id":"end","inputs":[{"id":"in-QNo1SZdWw0PEKTItS0lrb","state":"entered"}],"name":"End 📄","description":"End node of the Fluss.","state":"entered","outputs":[]},"measured":{"width":275,"height":160},"selected":false,"dragging":false},{"id":"dAtn7","position":{"x":433.22269492234034,"y":53.04710383584563},"type":"flussNode","data":{"type":"step","id":"dAtn7","description":"Turn Voice note to string.","name":"Voice note to string","inputs":[{"id":"in-Bj9KQMbPWzS6wGIdc3A7P","state":"entered"}],"outputs":[{"id":"out-_Ln7nCi3GM07GG2oyeH4u","name":"Post Description","type":"Rmvz3dF1qzxxZfTS7UfbL"}],"state":"entered"},"sourcePosition":"right","measured":{"width":275,"height":329},"selected":false,"dragging":false},{"id":"kVY6O","position":{"x":845.6155624597641,"y":226.33111341227698},"type":"flussNode","data":{"type":"step","id":"kVY6O","description":"Structures the users input.\nAssumes that either audio or text input was provided.","name":"Structure Description","inputs":[{"id":"in-mGl4DbHlst7W3ZFotv6jV","state":"entered"},{"id":"in-hd9XLWgxLWBpcQAnODX8m","state":"entered"}],"outputs":[{"id":"out-Twxmg0HyI0NM9ceAioeId","name":"Users Ideas","type":"string"}],"state":"entered"},"sourcePosition":"right","measured":{"width":275,"height":409},"selected":false,"dragging":false},{"id":"nadG-","position":{"x":1224.1674505826866,"y":416.56053961003585},"type":"flussNode","data":{"type":"step","id":"nadG-","description":"Writes a draft based on the users idea and example posts.","name":"Write Draft","inputs":[{"id":"in-hMdbvJ7HIPYXBrw8IHb8s","state":"entered"},{"id":"in-kP7x_jdCgRenAXS41x8UE","state":"entered"}],"outputs":[{"id":"out-1rbw7UCHrf7jS8ggMxI5U","name":"Post draft","type":"string"}],"state":"entered"},"sourcePosition":"right","measured":{"width":275,"height":389},"selected":false,"dragging":false}],"outputTypes":[{"id":"void","displayName":"Void","typeName":"void","content":"void","isPrimitive":true,"icon":"slash"},{"id":"string","displayName":"String","typeName":"string","content":"string","isPrimitive":true,"icon":"signature"},{"id":"number","displayName":"Number","typeName":"number","content":"number","isPrimitive":true,"icon":"calculator"},{"id":"boolean","displayName":"Boolean","typeName":"boolean","content":"boolean","isPrimitive":true,"icon":"toggle-right"},{"id":"f_DU5JfSq-qxMAVX6LfZj","typeName":"OptionalAudio","displayName":"Audio?","content":"Blob | undefined","icon":"speaker"},{"id":"Rmvz3dF1qzxxZfTS7UfbL","typeName":"OptionalString","displayName":"String?","content":"string | undefined","icon":"letter-text"},{"id":"JDGj_0kJfFKIarMEek7qj","typeName":"ExamplePost","displayName":"Example Post","content":"{\n  id: string\n  title: string\n  content: string\n}","icon":"book-copy"},{"id":"enwEdnGKvMZmWDdp2uEqi","typeName":"ExampleArray","displayName":"Example Array","content":"ExamplePost[]","icon":"book-copy"}]}STATE_JSON_END
 */
