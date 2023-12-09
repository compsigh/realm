import { SlashCommandBuilder } from '@discordjs/builders'

const rollupCommand = {
  type: 'rollup',
  data: new SlashCommandBuilder()
    .setName('rollup')
    .setDescription('Move the last x messages to a new thread')
    .addIntegerOption(messageCount =>
      messageCount
        .setName('messages')
        .setDescription('How many messages; counts backwards from the most recent in this channel')
        .setRequired(true))
    .addStringOption(threadTitle =>
        threadTitle
          .setName('thread')
          .setDescription('The name of the thread created')
          .setRequired(true)),

  async execute (interaction) {
    if (interaction.options.getInteger('messages') > 100)
      return await interaction.reply({ content: 'Sorry, that isn\'t within the 100-message limit! Try something more recent.', ephemeral: true });

    await interaction.deferReply();
    const reply = await interaction.fetchReply();
    const messages = await interaction.channel.messages.fetch({ before: reply.id, limit: interaction.options.getInteger('messages') })

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

    // Convert the messages collection to an array, and reverse them so they can be sent in the right order
    const messagesArray = [...messages.values()]

    messagesArray.slice().reverse().forEach(message => {
      const attachmentLinks = message.attachments.map(attachment => attachment.proxyURL).join(' ')
      rollupWebhook.send({
        username: message.member.displayName,
        avatarURL: message.author.displayAvatarURL(),
        content: message.content?.length > 0 ? message.content : attachmentLinks,
        threadId: thread.id
      })

      // Add all users who authored the messages forwarded to the thread, and delete the original messages
      thread.members.add(message.author.id)
      message.delete()
    })

    await interaction.editReply('New thread created from ' + messagesArray.length + ' messages!')
  }
}

export default rollupCommand
