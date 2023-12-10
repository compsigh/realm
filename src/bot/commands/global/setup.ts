import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import connect from '../../../functions/db-connect.js'
import Server from '../../../schemas/server-schema.js'
import type { SlashCommand } from 'src/bot/index.js'

const setupCommand: SlashCommand = {
  type: 'global',
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Instantiate Realm in your server'),

  async execute (interaction) {
    // Check if server is already in database
    await connect()
    const server = await Server.findOne({ guildId: interaction.guildId })
    if (server)
      return await interaction.reply({ content: 'Realm is already set up in this server!\nFor a list of commands you can run, use `/help`.', ephemeral: true })

    // Create new server in database
    const newServer = new Server({
      guildId: interaction.guildId,
      lastRefresh: Date.now()
    })
    await newServer.save()

    const setupSuccessEmbed = new EmbedBuilder()
      .setColor('#FFFFFF')
      .setTitle('Realm setup complete')
      .setDescription('Realm has been successfully set up!\nPlease run `/refresh` to update the commands you have access to.')
      .setFooter({ text: 'Realm v0.1.0', iconURL: 'https://raw.githubusercontent.com/compsigh/realm/main/assets/realm-icon.png' })
    await interaction.reply({ embeds: [setupSuccessEmbed], ephemeral: true })
  }
}

export default setupCommand
