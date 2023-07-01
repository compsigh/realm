import { SlashCommandBuilder } from '@discordjs/builders'

const pingCommand = {
  type: 'recap',
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('TEST FOR SELECTIVE DEPLOYS'),

  async execute (interaction) {
    await interaction.reply({ content: 'Pong!', ephemeral: true })
  }
}

export default pingCommand
