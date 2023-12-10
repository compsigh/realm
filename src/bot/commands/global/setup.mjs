import { SlashCommandBuilder } from '@discordjs/builders'
import * as Discord from 'discord.js'
import { commands } from '../../commands.js'
import connect from '../../../functions/db-connect.js'
import { refresh } from '../../deploy-commands.js'
import Server from '../../../schemas/server-schema.js'

const setupCommand = {
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

    // Deploy commands the server has access to
    // TODO: in order for this to make sense, the server entry will have had to be added to the db prior to running this command; otherwise, it makes more sense to ask for /refresh
    // await refresh(interaction.guildId, commands)

    const setupSuccessEmbed = new Discord.EmbedBuilder()
      .setColor('#FFFFFF')
      .setTitle('Realm setup complete')
      // .setDescription('Realm has been successfully set up!\nThe commands you have access to have been added to the server and `/help`.')
      .setDescription('Realm has been successfully set up!\nPlease run `/refresh` to update the commands you have access to.')
      .setFooter({ text: 'Realm v0.1.0', iconURL: 'https://app.realm.build/realm-icon.png' })
    await interaction.reply({ embeds: [setupSuccessEmbed], ephemeral: true })
  }
}

export default setupCommand
