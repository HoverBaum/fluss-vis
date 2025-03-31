// State for a single step.
// FIXED
type FlussRunStatus = "waiting" | "running" | "done" | "error"

// CUSTOM type provided by user

// Input type for the flow
type FlussInputs = {
  prompt: string
}

// Step Input/Output types - simplified with mapped types
// While start is static, end and other steps are dynamic
type StepIO = {
  start: {
    input: FlussInputs
    output: FlussInputs
  }
  end: {
    input: { draft: string; draft: string }
    output: { draft: string }
  }
  writeDraft: {
    input: { prompt: string }
    output: string
  }
  writeDraft: {
    input: { prompt: string }
    output: string
  }
}

// Step IDs type
// FIXED
type FlussStepId = keyof StepIO

// Step function types mapped from StepIO
// FIXED - assumign start and end identifiers do not change.
type StepFunctions = {
  [K in Exclude<FlussStepId, "start" | "end">]: (
    args: StepIO[K]["input"],
  ) => Promise<StepIO[K]["output"]> | StepIO[K]["output"]
}

// Step definition with result based on status
// FIXED
type Step<ID extends FlussStepId> = {
  id: ID
  status: FlussRunStatus
  execute: (
    args: StepIO[ID]["input"],
  ) => Promise<StepIO[ID]["output"]> | StepIO[ID]["output"]
  arguments: Array<{
    sourceStepId: FlussStepId
    argumentName: keyof StepIO[ID]["input"]
    sourceProperty?: string
  }>
  result?: StepIO[ID]["output"]
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
  flowState: FlowState,
): Promise<void> {
  try {
    // Build input object from dependencies
    const input = {} as StepIO[ID]["input"]

    step.arguments.forEach((arg) => {
      const sourceStep = flowState[arg.sourceStepId]
      if (sourceStep.status !== "done" || sourceStep.result === undefined) {
        throw new Error(
          "Source step " +
            arg.sourceStepId +
            " not complete for " +
            String(arg.argumentName),
        )
      }

      // If sourceProperty is undefined, use the entire result
      // Otherwise, extract the specified property
      if (arg.sourceProperty === undefined) {
        input[arg.argumentName as keyof StepIO[ID]["input"]] =
          sourceStep.result as StepIO[ID]["input"][keyof StepIO[ID]["input"]]
      } else {
        input[arg.argumentName as keyof StepIO[ID]["input"]] =
          sourceStep.result[
            arg.sourceProperty as keyof typeof sourceStep.result
          ]
      }
    })

    // Rest of the function remains the same
    console.log("Executing with Input:", input)
    const result = await step.execute(input)
    console.log("Result:", result)
    step.status = "done"
    step.result = result
  } catch (err) {
    step.status = "error"
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
  flowState: FlowState,
): boolean {
  return step.arguments.every((arg) => {
    const sourceStep = flowState[arg.sourceStepId]
    return sourceStep.status === "done" && sourceStep.result !== undefined
  })
}

/**
 * Main function to run the flow
 */
export async function runFluss(params: {
  inputs: FlussInputs
  stepFunctions: StepFunctions
}): Promise<StepIO["end"]["output"]> {
  const { inputs, stepFunctions } = params

  // Initialize the flow state with typed steps
  // This is generated new for each flow.
  const flowState: FlowState = {
    start: {
      id: "start",
      status: "done",
      execute: (args) => args,
      arguments: [],
      result: inputs,
    },
    end: {
      id: "end",
      status: "waiting",
      execute: (args) => args,
      arguments: [
        {
          sourceStepId: "writeDraft",
          argumentName: "draft",
        },
        {
          sourceStepId: "writeDraft",
          argumentName: "draft",
        },
      ],
    },
    writeDraft: {
      id: "writeDraft",
      status: "waiting",
      execute: stepFunctions.writeDraft,
      arguments: [
        {
          sourceStepId: "start",
          argumentName: "prompt",
        },
      ],
    },
    writeDraft: {
      id: "writeDraft",
      status: "waiting",
      execute: stepFunctions.writeDraft,
      arguments: [
        {
          sourceStepId: "start",
          argumentName: "prompt",
        },
      ],
    },
  }

  return new Promise<StepIO["end"]["output"]>((resolve, reject) => {
    // Process runnable steps
    const processSteps = async () => {
      // Find all steps that can run now
      const runnableSteps = Object.values(flowState)
        .filter((step) => step.status === "waiting")
        .filter((step) => canStepRun(step as Step<FlussStepId>, flowState))

      console.log(
        "Currently runnable:",
        runnableSteps.map((s) => s.id),
      )

      // Check if we're done or stuck
      if (runnableSteps.length === 0) {
        if (Object.values(flowState).every((step) => step.status === "done")) {
          console.log("All steps done!")
          if (!flowState.end.result) {
            return reject(new Error("End step has no result"))
          }
          return resolve(flowState.end.result)
        } else {
          return reject(
            new Error("No steps can be run and not all steps are done"),
          )
        }
      }

      // Execute all runnable steps
      try {
        await Promise.all(
          runnableSteps.map((step) => {
            step.status = "running"
            return executeStep(step as Step<FlussStepId>, flowState)
          }),
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
 * STATE_JSON_START{"name":"Fluss 🌊","edges":[{"source":"start","sourceHandle":"FUVPUB2geBuitZ2i0k9cG","target":"RGNGI","targetHandle":"IesCtN_SM-ABAiOKqAuWu","data":{"state":"entered"},"id":"xy-edge__startFUVPUB2geBuitZ2i0k9cG-RGNGIIesCtN_SM-ABAiOKqAuWu"},{"source":"start","sourceHandle":"FUVPUB2geBuitZ2i0k9cG","target":"lTKMB","targetHandle":"pU_wOqe1n7m8x06b2e2vw","data":{"state":"entered"},"id":"xy-edge__startFUVPUB2geBuitZ2i0k9cG-lTKMBpU_wOqe1n7m8x06b2e2vw"},{"source":"lTKMB","sourceHandle":"B9fg8cRtX2_M2Qmf24fHI","target":"end","targetHandle":"uBJVaXpMuUhBTb7K9cjmM","data":{"state":"entered"},"id":"xy-edge__lTKMBB9fg8cRtX2_M2Qmf24fHI-enduBJVaXpMuUhBTb7K9cjmM"},{"source":"RGNGI","sourceHandle":"rJ719UlizE6uBaWnzlxQ2","target":"end","targetHandle":"Ovkl7J_yMt0ibU7F8aLIB","data":{"state":"entered"},"id":"xy-edge__RGNGIrJ719UlizE6uBaWnzlxQ2-endOvkl7J_yMt0ibU7F8aLIB"}],"nodes":[{"id":"start","position":{"x":50,"y":200},"type":"startNode","deletable":false,"data":{"type":"start","id":"start","outputs":[{"id":"FUVPUB2geBuitZ2i0k9cG","name":"Prompt","type":"string"}],"name":"Start 🦛","description":"Start node of the Fluss.","state":"entered"},"measured":{"width":275,"height":268},"selected":false},{"id":"end","position":{"x":899,"y":203},"type":"endNode","deletable":false,"data":{"type":"end","id":"end","inputs":[{"id":"uBJVaXpMuUhBTb7K9cjmM","state":"entered"},{"id":"Ovkl7J_yMt0ibU7F8aLIB","state":"entered"}],"name":"End 🏁","description":"End node of the Fluss.","state":"entered","outputs":[]},"measured":{"width":275,"height":200},"selected":false,"dragging":false},{"id":"RGNGI","position":{"x":430,"y":79},"type":"flussNode","data":{"type":"step","id":"RGNGI","description":"","name":"Write Draft","inputs":[{"id":"IesCtN_SM-ABAiOKqAuWu","state":"entered"}],"outputs":[{"id":"rJ719UlizE6uBaWnzlxQ2","name":"Draft","type":"string"}],"state":"entered"},"sourcePosition":"right","measured":{"width":275,"height":313},"selected":false,"dragging":false},{"id":"lTKMB","position":{"x":415,"y":434},"type":"flussNode","data":{"type":"step","id":"lTKMB","description":"","name":"Write Draft","inputs":[{"id":"pU_wOqe1n7m8x06b2e2vw","state":"entered"}],"outputs":[{"id":"B9fg8cRtX2_M2Qmf24fHI","name":"Draft","type":"string"}],"state":"entered"},"sourcePosition":"right","measured":{"width":275,"height":313},"selected":false,"dragging":false}],"outputTypes":[{"id":"void","displayName":"Void","typeName":"void","content":"void","isPrimitive":true,"icon":"slash"},{"id":"string","displayName":"String","typeName":"string","content":"string","isPrimitive":true,"icon":"signature"},{"id":"number","displayName":"Number","typeName":"number","content":"number","isPrimitive":true,"icon":"calculator"},{"id":"boolean","displayName":"Boolean","typeName":"boolean","content":"boolean","isPrimitive":true,"icon":"toggle-right"}]}STATE_JSON_END
 */
