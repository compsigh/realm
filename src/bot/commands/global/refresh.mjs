import { SlashCommandBuilder } from '@discordjs/builders'
import * as Discord from 'discord.js'
import connect from '../../../functions/db-connect.mjs'
import Server from '../../../schemas/server-schema.mjs'
import { commands } from '../../commands.js'
import { refresh } from '../../deploy-commands.js'

const refreshCommand = {
  type: 'global',
  data: new SlashCommandBuilder()
    .setName('refresh')
    .setDescription('Check for access to new commands and features'),

  async execute (interaction) {
    // Check if server is already in database
    await connect()
    const server = await Server.findOne({ guildId: interaction.guildId })
    if (!server)
      return await interaction.reply({ content: 'Realm is not yet set up in this server!\nPlease run `/setup`.', ephemeral: true })

    // Make sure it's been at least five minutes since last refresh
    const lastRefresh = server.lastRefresh
    if (lastRefresh) {
      const timeSinceLastRefresh = Date.now() - lastRefresh
      if (timeSinceLastRefresh < 300000)
        return await interaction.reply({ content: 'Please wait at least five minutes between refreshes.', ephemeral: true })
    }

    server.lastRefresh = Date.now()
    await server.save()
    await refresh(interaction.guildId, commands)

    const refreshedEmbed = new Discord.EmbedBuilder()
      .setColor('#FFFFFF')
      .setTitle('Realm refreshed')
      .setDescription('Successfully refreshed Realm!\nRun `/help` to see any new commands you have access to.')
    await interaction.reply({ embeds: [refreshedEmbed], ephemeral: true })
  }
}

export default refreshCommand
