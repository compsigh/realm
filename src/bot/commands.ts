import { SlashCommand } from './index.js'
// Globals
// import helpCommand from './commands/global/help.mjs'
// import setupCommand from './commands/global/setup.mjs'
// import refreshCommand from './commands/global/refresh.mjs'

// Rollup
// import rollupCommand from './commands/rollup/rollup.mjs'
// import rollupContextCommand from './commands/rollup/rollup-context.mjs'
// import addToQueueContextCommand from './commands/rollup/add-to-queue.mjs'
// import sendFromQueueCommand from './commands/rollup/send-from-queue.mjs'

// Recap
import pingCommand from './commands/global/ping.js'

const commands: Map<string, SlashCommand> = new Map()

// Globals
// commands.push(helpCommand)
// commands.push(setupCommand)
// commands.push(refreshCommand)
commands.set(pingCommand.command.name, pingCommand)

// Rollup
// commands.push(rollupCommand)
// commands.push(rollupContextCommand)
// commands.push(addToQueueContextCommand)
// commands.push(sendFromQueueCommand)

export { commands }
