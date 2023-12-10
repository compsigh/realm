import type { SlashCommand } from './index.js'
import helpCommand from './commands/global/help.js'
import setupCommand from './commands/global/setup.js'
import pingCommand from './commands/global/ping.js'
import refreshCommand from './commands/global/refresh.js'

// import rollupCommand from './commands/rollup/rollup.mjs'
// import rollupContextCommand from './commands/rollup/rollup-context.mjs'
// import addToQueueContextCommand from './commands/rollup/add-to-queue.mjs'
// import sendFromQueueCommand from './commands/rollup/send-from-queue.mjs'

const commands: Map<string, SlashCommand> = new Map()

commands.set(helpCommand.data.name, helpCommand)
commands.set(setupCommand.data.name, setupCommand)
commands.set(pingCommand.data.name, pingCommand)
commands.set(refreshCommand.data.name, refreshCommand)

// commands.push(rollupCommand)
// commands.push(rollupContextCommand)
// commands.push(addToQueueContextCommand)
// commands.push(sendFromQueueCommand)

export { commands }
