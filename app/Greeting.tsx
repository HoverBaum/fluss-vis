'use client'

import { ExamplesDropdown } from './_flussSidebar/ExamplesDropdown'
import { LoadButton } from './_flussSidebar/LoadButton'
import { AnimatePresence, motion } from 'motion/react'

type GreetingProps = {
  showGreeting: boolean
}

export const Greeting = ({ showGreeting }: GreetingProps) => {
  return (
    <AnimatePresence>
      {showGreeting && (
        <motion.div
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="cursor-default p-4"
        >
          <h1 className="text-center text-5xl">Fluss-Vis</h1>
          <div className="flex justify-center p-4">
            <div className="grid grid-cols-2 gap-8">
              <div className="grid place-items-center">
                <span className="block text-9xl">🌊</span>
              </div>
              <div className="flex flex-col justify-around gap-4">
                <div>
                  <p className="mb-1">Start with an example</p>
                  <ExamplesDropdown />
                </div>
                <div>
                  <p className="mb-1">Open an exiting Fluss</p>
                  <LoadButton variant="outline" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
