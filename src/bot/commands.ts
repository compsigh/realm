import type { SlashCommand } from './index.js'
import helpCommand from './commands/global/help.js'
import setupCommand from './commands/global/setup.js'
import pingCommand from './commands/global/ping.js'
import refreshCommand from './commands/global/refresh.js'

import rollupCommand from './commands/rollup/rollup.js'
import rollupContextCommand from './commands/rollup/rollup-context.js'
import addToQueueContextCommand from './commands/rollup/add-to-queue.js'
import sendFromQueueCommand from './commands/rollup/send-from-queue.js'
import purgeCommand from './commands/rollup/purge.js'

const commands: Map<string, SlashCommand> = new Map()

commands.set(helpCommand.data.name, helpCommand)
commands.set(setupCommand.data.name, setupCommand)
commands.set(pingCommand.data.name, pingCommand)
commands.set(refreshCommand.data.name, refreshCommand)

commands.set(rollupCommand.data.name, rollupCommand)
commands.set(rollupContextCommand.data.name, rollupContextCommand)
commands.set(addToQueueContextCommand.data.name, addToQueueContextCommand)
commands.set(sendFromQueueCommand.data.name, sendFromQueueCommand)
commands.set(purgeCommand.data.name, purgeCommand)

export { commands }
