import { Client, Events, Partials } from 'discord.js'
import { config } from 'dotenv'
import connect from '../functions/db-connect.js'
import { commands } from './commands.js'
import { deployGlobalCommands } from './deploy-commands.js'
import type {
  CommandInteraction,
  GatewayIntentsString,
  InteractionResponse,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder
} from 'discord.js'

export type SlashCommand = {
  type: 'global' | 'rollup',
  data: SlashCommandBuilder | SlashCommandSubcommandBuilder,
  execute: (interaction: CommandInteraction) => Promise<InteractionResponse>
}

if (process.env.ENV !== 'PROD')
  config()

await connect()

const intents: GatewayIntentsString[] = [
  'Guilds',
  'GuildMessages',
  'GuildMessageReactions',
  'GuildMembers'
]

const partials = [
  Partials.GuildMember,
  Partials.Message,
  Partials.Reaction,
  Partials.User
]

const client = new Client({ intents, partials })

deployGlobalCommands(commands)

client.once(Events.ClientReady, () => {
  console.log('[Realm] [GLOBAL] Online!')
})

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isCommand())
    return
  const command = commands.get(interaction.commandName)
  if (!command)
    return

  try {
    await command.execute(interaction)
  }
  catch (error) {
    console.error(error)
    if (interaction.replied || interaction.deferred)
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true })
    else
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
  }
})

client.login(process.env.BOT_TOKEN)
