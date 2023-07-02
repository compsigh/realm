// Globals
import helpCommand from './commands/global/help.mjs'
import setupCommand from './commands/global/setup.mjs'
import refreshCommand from './commands/global/refresh.mjs'

// Rollup
import rollupCommand from './commands/rollup/rollup.mjs'

// Recap
import pingCommand from './commands/recap/ping.mjs'

const commands = []
commands.push(helpCommand)
commands.push(setupCommand)
commands.push(refreshCommand)
commands.push(rollupCommand)
commands.push(pingCommand)

export { commands }
