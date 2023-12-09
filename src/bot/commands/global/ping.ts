import { SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from 'src/bot'

const pingCommand: SlashCommand = {
  type: 'global',
  command: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('TEST FOR SELECTIVE DEPLOYS'),

  async execute (interaction) {
    await interaction.reply({ content: 'Pong!', ephemeral: true })
  }
}

export default pingCommand
