import { SlashCommandBuilder } from '@discordjs/builders'
import connect from '../../../functions/db-connect.mjs'
import Server from '../../../schemas/server-schema.mjs'

const sendFromQueueCommand = {
  type: 'rollup',
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Move the messages in your queue to a new thread')
    .addStringOption(threadTitle =>
        threadTitle
          .setName('thread')
          .setDescription('The name of the thread created')
          .setRequired(true)),

  async execute (interaction) {
    await interaction.deferReply({ ephemeral: true });

    // Fetch messages
    await connect()
    const server = await Server.findOne({ guildId: interaction.guild.id })
    if (!server)
      return await interaction.editReply('Realm is not yet set up in this server!\nPlease run `/setup`.')
    const queue = server.config.rollup.queues[interaction.user.id]
    if (!queue)
      return await interaction.editReply('You don\'t have any messages in your queue!')

    const messages = []
    for (const messageId of queue.messageIds)
      messages.push(await interaction.channel.messages.fetch(messageId))

    // Search for existing Rollup webhook
    let rollupWebhook = {};
    const webhooks = await interaction.member.guild.fetchWebhooks()
    for (const webhook of webhooks.values())
      if (webhook.owner.id === process.env.BOT_CLIENT_ID)
        rollupWebhook = await webhook.edit({ channel: interaction.channel })

    if (Object.keys(rollupWebhook).length === 0)
      rollupWebhook = await interaction.channel.createWebhook({ name: 'Rollup', avatar: 'https://app.realm.build/rollup-icon.png' })

    // Create and join thread
    const thread = await interaction.channel.threads.create({
      name: interaction.options.getString('thread'),
      autoArchiveDuration: 60,
      reason: 'Thread created by ' + interaction.user.tag + ' using Rollup'
    })
    if (thread.joinable) await thread.join()

    // Sort messages by timestamp
    messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp)

    // Send messages to thread
    for (const message of messages) {
      const author = await interaction.guild.members.fetch(message.author.id) // TODO: replicate this for /rollup and context command — or abstract to its own function
      rollupWebhook.send({
        username: author.nickname || author.user.username,
        avatarURL: author.displayAvatarURL(),
        content: message.content?.length > 0 ? message.content : '',
        files: message.attachments.map(attachment => attachment),
        threadId: thread.id
      })

      // Add all users who authored the messages forwarded to the thread, and delete the original messages
      thread.members.add(author.user.id)
      message.delete()
    }

    // Clear queue by removing the property
    await Server.updateOne({ guildId: interaction.guild.id }, { $unset: { [`config.rollup.queues.${interaction.user.id}`]: '' } })

    return await interaction.editReply('New thread created from ' + messages.length + ' messages!')
  }
}

export default sendFromQueueCommand
