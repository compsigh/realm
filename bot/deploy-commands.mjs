// Dependencies
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { config } from 'dotenv'
import connect from '../functions/db-connect.mjs'
import Server from '../schemas/server-schema.mjs'

// Load environment variables
if (process.env.ENV !== 'PROD')
  config()

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN)

export async function refresh (guildId, commands) {
  try {
    console.log(`[Realm] [${guildId}] Refreshing guild slash commands...`)

    // Clear guild commands
    await rest.put(
      Routes.applicationGuildCommands(process.env.BOT_CLIENT_ID, guildId),
      { body: [] }
    )
    console.log(`[Realm] [${guildId}] Cleared guild slash commands...`)

    // Identify guild commands to deploy based on the server's enabled bots
    await connect()
    const server = await Server.findOne({ guildId })
    const enabledBots = server.enabledBots
    const guildCommands = commands.filter(command => command.type !== 'global')
    const enabledCommands = guildCommands.filter(command => enabledBots[command.type] === true)

    // Deploy guild commands
    const enabledCommandsJson = []
    for (const command of enabledCommands)
      enabledCommandsJson.push(command.data.toJSON())
    await rest.put(
      Routes.applicationGuildCommands(process.env.BOT_CLIENT_ID, guildId),
      { body: enabledCommandsJson }
    )
    console.log(`[Realm] [${guildId}] Successfully deployed guild slash commands.`)
  }
  catch (error) {
    console.error(error)
  }
}

export async function deployCommands (commands) {
  try {
    console.log('[Realm] [GLOBAL] Deploying global slash commands...')

    // Deploy global commands globally
    const commandsJson = []
    for (const command of commands.globals)
      commandsJson.push(command.data.toJSON())
    await rest.put(
      Routes.applicationCommands(process.env.BOT_CLIENT_ID),
      { body: commandsJson }
    )
    console.log('[Realm] [GLOBAL] Successfully deployed global slash commands.')

    // Deploy slash commands for all servers
    console.log('[Realm] [GLOBAL] Deploying guild slash commands...')
    await connect()
    const servers = await Server.find({})
    for (const server of servers)
      await refresh(server.guildId, commands)

    console.log('[Realm] [GLOBAL] Successfully deployed guild slash commands.')
  }
  catch (error) {
    console.error(error)
  }
}
