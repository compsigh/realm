import { SlashCommandBuilder } from '@discordjs/builders'
import * as Discord from 'discord.js'
import connect from '../../../functions/db-connect.mjs'
import Server from '../../../schemas/server-schema.mjs'
import { commands } from '../../commands.mjs'
import { refresh } from '../../deploy-commands.mjs'

const refreshCommand = {
  type: 'global',
  data: new SlashCommandBuilder()
    .setName('refresh')
    .setDescription('Refreshes Realm to check for access to new bots'),

  async execute (interaction) {
    // Check if server is already in database
    await connect()
    const server = await Server.findOne({ guildId: interaction.guildId })
    if (!server)
      return await interaction.reply({ content: 'Realm is not set up in this server!', ephemeral: true })

    // Make sure it's been at least five minutes since last refresh
    const lastRefresh = server.lastRefresh
    if (lastRefresh) {
      const timeSinceLastRefresh = Date.now() - lastRefresh
      if (timeSinceLastRefresh < 300000)
        return await interaction.reply({ content: 'Please wait at least five minutes between refreshes.', ephemeral: true })
    }

    // Update last refresh time
    server.lastRefresh = Date.now()
    await server.save()

    // Refresh commands
    await refresh(interaction.guildId, commands)

    // Reply to user
    await interaction.reply({ content: 'Refreshed Realm!', ephemeral: true })
    // const helpEmbed = new Discord.EmbedBuilder()
    //   .setColor('#75FB92')
    //   .setTitle('Recap')
    //   .setDescription('Summarize Discord messages, powered by AI')
    //   .setFields([
    //     { name: '`/tab`', value: 'Creates a temporary role with the people mentioned. Can be deleted when all debts are marked as paid.\n`/tab help` for more info', inline: false },
    //     { name: '`/roadmap`', value: 'View planned features for Receipt', inline: false }
    //   ])
    // await interaction.reply({ embeds: [helpEmbed], ephemeral: true })
  }
}

export default refreshCommand
