import { SlashCommandBuilder } from 'discord.js'
import type { SlashCommand } from './../../index.js'

const pingCommand: SlashCommand = {
  type: 'global',
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('TEST FOR SELECTIVE DEPLOYS'),

  async execute (interaction) {
    return await interaction.reply({ content: 'Pong!', ephemeral: true })
  }
}

export default pingCommand
