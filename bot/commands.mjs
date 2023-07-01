// Globals
import helpCommand from './commands/global/help.mjs'

// Recap
import pingCommand from './commands/recap/ping.mjs'

const globals = []
globals.push(helpCommand)

const recapCommands = []
recapCommands.push(pingCommand)

const commands = {
  globals,
  recapCommands
}

export { commands }
