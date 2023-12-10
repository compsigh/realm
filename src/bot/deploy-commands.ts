// Dependencies
import { REST, Routes, Snowflake } from 'discord.js'
import { config } from 'dotenv'
import connect from '../functions/db-connect.js'
import Server from '../schemas/server-schema.mjs'
import type { SlashCommand } from './index.js'

// Load environment variables
if (process.env.ENV !== 'PROD')
  config()

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN)

export async function deployGuildCommands (
  guildId: Snowflake,
  commands: Map<string, SlashCommand>
) {
  try {
    // Clear guild commands
    await rest.put(
      Routes.applicationGuildCommands(process.env.BOT_CLIENT_ID, guildId),
      { body: [] }
    )
    console.log(`[Realm] [${guildId}] Cleared guild slash commands...`)

    // Identify guild commands to deploy based on the server's enabled bots
    await connect()
    const server = await Server.findOne({ guildId })
    const botAccess = server.botAccess
    const enabledCommands: SlashCommand[] = []
    commands.forEach(slashCommand => {
      if (botAccess[slashCommand.type] === true)
        enabledCommands.push(slashCommand)
    })

    // Deploy guild commands
    await rest.put(
      Routes.applicationGuildCommands(process.env.BOT_CLIENT_ID, guildId), {
        body: enabledCommands
          .map(slashCommand => slashCommand.data.toJSON())
      })
    console.log(`[Realm] [${guildId}] Deployed guild slash commands.`)
  }
  catch (error) {
    console.error(error)
  }
}

export async function deployGlobalCommands (commands: Map<string, SlashCommand>) {
  try {
    console.log('[Realm] [GLOBAL] Deploying global slash commands...')

    const globalSlashCommands: SlashCommand[] = []
    commands.forEach(slashCommand => {
      if (slashCommand.type === 'global')
        globalSlashCommands.push(slashCommand)
    })

    await rest.put(
      Routes.applicationCommands(process.env.BOT_CLIENT_ID), {
        body: globalSlashCommands
          .map(slashCommand => slashCommand.data.toJSON())
      })
    console.log('[Realm] [GLOBAL] Deployed global slash commands.')
  }
  catch (error) {
    console.error(error)
  }
}
