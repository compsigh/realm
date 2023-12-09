// Dependencies
import { REST, Routes, Snowflake } from 'discord.js'
import { config } from 'dotenv'
import connect from '../functions/db-connect.mjs'
import Server from '../schemas/server-schema.mjs'
import type { SlashCommand } from './index.js'

// Load environment variables
if (process.env.ENV !== 'PROD')
  config()

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN)

export async function refresh (guildId: Snowflake, commands: Map<string, SlashCommand>) {
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
    const botAccess = server.botAccess
    const enabledCommands: SlashCommand[] = []
    commands.forEach(slashCommand => {
      if (botAccess[slashCommand.type] === true)
        enabledCommands.push(slashCommand)
    })

    await rest.put(
      Routes.applicationGuildCommands(process.env.BOT_CLIENT_ID, guildId), {
        body: enabledCommands
          .map(slashCommand => slashCommand.command.toJSON())
      })
    console.log(`[Realm] [${guildId}] Successfully deployed guild slash commands.`)
  }
  catch (error) {
    console.error(error)
  }
}

export async function deployCommands (commands: Map<string, SlashCommand>) {
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
          .map(slashCommand => slashCommand.command.toJSON())
      })
    console.log('[Realm] [GLOBAL] Successfully deployed global slash commands.')

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
