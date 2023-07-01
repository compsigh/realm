// Globals
import helpCommand from './commands/global/help.mjs'
import setupCommand from './commands/global/setup.mjs'

// Recap
import pingCommand from './commands/recap/ping.mjs'

const commands = []
commands.push(helpCommand)
commands.push(setupCommand)
commands.push(pingCommand)

export { commands }
