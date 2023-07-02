// Globals
import helpCommand from './commands/global/help.mjs'
import setupCommand from './commands/global/setup.mjs'
import refreshCommand from './commands/global/refresh.mjs'

// Rollup
import rollupCommand from './commands/rollup/rollup.mjs'
import rollupContextCommand from './commands/rollup/rollup-context.mjs'

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

// Recap
commands.push(pingCommand)

export { commands }
