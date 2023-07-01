import { SlashCommandBuilder } from '@discordjs/builders'
import * as Discord from 'discord.js'
import { commands } from '../../commands.mjs'
import connect from '../../../functions/db-connect.mjs'
import { refresh } from '../../deploy-commands.mjs'
import Server from '../../../schemas/server-schema.mjs'

const setupCommand = {
  type: 'global',
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Instantiates Realm in your server'),

  async execute (interaction) {
    // Check if server is already in database
    await connect()
    const server = await Server.findOne({ guildId: interaction.guildId })
    if (server)
      return await interaction.reply({ content: 'Realm is already set up in this server!', ephemeral: true })

    // Create new server in database
    const newServer = new Server({
      guildId: interaction.guildId,
      lastRefresh: Date.now()
    })
    await newServer.save()

    // Fetch commands the server has access to
    await refresh(interaction.guildId, commands)

    const setupSuccessEmbed = new Discord.EmbedBuilder()
      .setColor('#FFFFFF')
      .setTitle('Realm setup complete')
      .setDescription('Realm has been successfully set up! The commands you have access to have been added to the server.')
    await interaction.reply({ embeds: [setupSuccessEmbed], ephemeral: true })
  }
}

export default setupCommand
