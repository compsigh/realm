// Globals
import helpCommand from './commands/global/help.mjs'
import setupCommand from './commands/global/setup.mjs'
import refreshCommand from './commands/global/refresh.mjs'

// Rollup
import rollupCommand from './commands/rollup/rollup.mjs'
import rollupContextCommand from './commands/rollup/rollup-context.mjs'
import addToQueueContextCommand from './commands/rollup/add-to-queue.mjs'
import sendFromQueueCommand from './commands/rollup/send-from-queue.mjs'

// Recap
import pingCommand from './commands/recap/ping.mjs'

const commands = []

// Globals
commands.push(helpCommand)
commands.push(setupCommand)
commands.push(refreshCommand)

// Rollup
commands.push(rollupCommand)
commands.push(rollupContextCommand)
commands.push(addToQueueContextCommand)
commands.push(sendFromQueueCommand)

// Recap
commands.push(pingCommand)

export { commands }
