import { ContextMenuCommandBuilder } from '@discordjs/builders'
import connect from '../../../functions/db-connect.mjs'
import Server from '../../../schemas/server-schema.mjs'

const addToQueueContextCommand = {
  type: 'rollup',
  data: new ContextMenuCommandBuilder()
    .setName('Add to queue')
    .setType(3), // TODO: magic number bad

  async execute (interaction) {
    await connect()
    const server = await Server.findOne({ guildId: interaction.guild.id })
    if (!server)
      return await interaction.reply({ content: 'Realm is not yet set up in this server!\nPlease run `/setup`.', ephemeral: true })

    const messageId = interaction.targetId
    const message = await interaction.channel.messages.fetch(messageId)

    const queue = server.config.rollup.queues[interaction.user.id]
    if (!queue) {
      const queueTemplate = {
        channelId: message.channelId,
        messageIds: []
      }
      queueTemplate.messageIds.push(messageId)
      await Server.updateOne({ guildId: interaction.guild.id }, { $set: { [`config.rollup.queues.${interaction.user.id}`]: queueTemplate } })
    }
    else {
      if (queue.channelId !== message.channelId)
        return await interaction.reply({ content: 'You can only add messages from the same channel to your queue.', ephemeral: true })
      if (queue.messageIds.includes(messageId))
        return await interaction.reply({ content: 'That message is already in your queue.', ephemeral: true })
      // TODO: make sure messages will be parsed chronologically regardless of order added to queue
      await Server.updateOne({ guildId: interaction.guild.id }, { $push: { [`config.rollup.queues.${interaction.user.id}.messageIds`]: messageId } })
    }

    return await interaction.reply({ content: 'Added to queue!', ephemeral: true })
  }
}

export default addToQueueContextCommand
