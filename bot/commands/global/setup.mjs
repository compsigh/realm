import { SlashCommandBuilder } from '@discordjs/builders'
import * as Discord from 'discord.js'
import connect from '../../../functions/db-connect.mjs'
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
      guildId: interaction.guildId
    })
    await newServer.save()

    // Reply to user
    await interaction.reply({ content: 'Realm has been set up in this server!', ephemeral: true })
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

export default setupCommand
