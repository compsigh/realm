// Dependencies
import { Client, GatewayIntentBits, Partials, Collection, ActivityType } from 'discord.js'
import { config } from 'dotenv'
import connect from '../functions/db-connect.mjs'
import { commands } from './commands.mjs'
import { deployCommands } from './deploy-commands.mjs'

deployCommands(commands)

// Load environment variables
if (process.env.ENV !== 'PROD')
  config()

// Connect to MongoDB
await connect()

// Launch instance of Discord
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMembers],
  partials: [Partials.Message, Partials.GuildMember, Partials.Reaction, Partials.User]
})

// Create collection of commands
client.commands = new Collection()
for (const command of commands)
  client.commands.set(command.data.name, command)

client.once('ready', () => {
  console.log('[Realm] [GLOBAL] Online!')
})

// Listens for new servers, might do something with this later
client.on('guildCreate', (guild) => {
  console.log(`Joined a new server: ${guild.id}`)
})

// Interaction listener for slash commands
client.on('interactionCreate', async interaction => {
  const command = client.commands.get(interaction.commandName)
  if (!command)
    return

  try {
    await command.execute(interaction)
  }
  catch (error) {
    console.error(error)
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true
    })
  }
})

client.login(process.env.BOT_TOKEN)
