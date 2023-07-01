import { SlashCommandBuilder } from '@discordjs/builders'
import * as Discord from 'discord.js'

const helpCommand = {
  data: new SlashCommandBuilder()

    // Help command
    .setName('help')
    .setDescription('List Recap commands'),

  async execute (interaction) {
    // On /help, display help embed
    const helpEmbed = new Discord.EmbedBuilder()
      .setColor('#75FB92')
      .setTitle('Recap')
      .setDescription('Summarize Discord messages, powered by AI')
      .setFields([
        { name: '`/tab`', value: 'Creates a temporary role with the people mentioned. Can be deleted when all debts are marked as paid.\n`/tab help` for more info', inline: false },
        { name: '`/roadmap`', value: 'View planned features for Receipt', inline: false }
      ])
    await interaction.reply({ embeds: [helpEmbed], ephemeral: true })
  }
}

export default helpCommand
