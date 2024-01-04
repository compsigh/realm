import { ChannelType, SlashCommandSubcommandBuilder } from 'discord.js'
import type { ChatInputCommandInteraction } from 'discord.js'
import type { SlashCommand } from '../../index.js'

const purgeCommand: SlashCommand = {
  type: 'rollup',
  data: new SlashCommandSubcommandBuilder()
    .setName('purge')
    .setDescription('Delete messages instead of creating a thread')
    .addIntegerOption(messageCount =>
      messageCount
        .setName('messages')
        .setDescription('How many messages; counts backwards from the most recent in this channel')
        .setRequired(true)),

  async execute (interaction: ChatInputCommandInteraction) {
    if (interaction.channel.type !== ChannelType.GuildText)
      return await interaction.reply({ content: 'Sorry, this command only works in text channels!', ephemeral: true })
    if (interaction.options.getInteger('messages') > 100)
      return await interaction.reply({ content: 'Sorry, that isn\'t within the 100-message limit! Try something more recent.', ephemeral: true })

    await interaction.deferReply()
    const reply = await interaction.fetchReply()
    const messages = await interaction.channel.messages.fetch({ before: reply.id, limit: interaction.options.getInteger('messages') })

    // Convert the messages collection to an array and purge messages
    const messagesArray = [...messages.values()]
    messagesArray.slice().forEach(message => message.delete())

    await interaction.editReply('Purged ' + messagesArray.length + ' messages!')
  }
}

export default purgeCommand
