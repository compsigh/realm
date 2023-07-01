// Dependencies
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { config } from 'dotenv'

// Load environment variables
if (process.env.ENV !== 'PROD')
  config()

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN)

  try {
    console.log('Started refreshing application (/) commands.')

    // Production environment, deploy commands globally
    if (process.env.ENV === 'PROD') {
      await rest.put(
        Routes.applicationCommands(process.env.BOT_CLIENT_ID),
        { body: commands }
      )
      console.log('Deployed global commands.')

      // Clear guild commands
      await rest.put(
        Routes.applicationGuildCommands(process.env.BOT_CLIENT_ID, process.env.DEV_SERVER_ID),
        { body: [] }
      )
      console.log('Cleared guild commands.')
    }

    else if (process.env.ENV === 'DEV') {
      // Development environment, deploy commands locally
      await rest.put(
        Routes.applicationGuildCommands(process.env.BOT_CLIENT_ID, process.env.DEV_SERVER_ID),
        { body: commands }
      )
      console.log('Deployed commands to development server.')
    }
    console.log('Successfully reloaded application (/) commands.')
export async function deployCommands (commands) {
  }
  catch (error) {
    console.error(error)
  }
}
