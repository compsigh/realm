import { ApplicationCommandType, ChannelType, ContextMenuCommandBuilder } from 'discord.js'
import type { SlashCommand } from 'src/bot/index.js'
import type { ContextMenuCommandInteraction, Webhook } from 'discord.js'

const CONTEXT_TYPE: ApplicationCommandType = ApplicationCommandType.Message

const rollupContextCommand: SlashCommand = {
  type: 'rollup',
  data: new ContextMenuCommandBuilder()
    .setName('Start thread from here')
    .setType(CONTEXT_TYPE),

  async execute (interaction: ContextMenuCommandInteraction) {
    if (interaction.channel.type !== ChannelType.GuildText)
      return await interaction.reply({ content: 'Sorry, this command only works in text channels!', ephemeral: true })

    await interaction.deferReply()
    const reply = await interaction.fetchReply()
    const messages = await interaction.channel.messages.fetch({ before: reply.id, limit: 100 })
    if (!messages.has(interaction.targetId))
      return await interaction.reply({ content: 'Sorry, that message isn\'t within the 100-message limit! Try something more recent.', ephemeral: true })

    // Search for existing Rollup webhook
    let rollupWebhook: Webhook
    const webhooks = await interaction.guild.fetchWebhooks()
    for (const webhook of webhooks.values())
      if (webhook.owner.id === process.env.BOT_CLIENT_ID)
        rollupWebhook = await webhook.edit({ channel: interaction.channel })

    if (Object.keys(rollupWebhook).length === 0)
      rollupWebhook = await interaction.channel.createWebhook({ name: 'Rollup', avatar: 'https://raw.githubusercontent.com/compsigh/realm/main/assets/rollup-icon.png' })

    // Create and join thread
    const threadMessage = await interaction.channel.messages.fetch(interaction.targetId)
    const threadName = threadMessage.content.length > 50 ? threadMessage.content.slice(0, 50) + '...' : threadMessage.content
    const thread = await interaction.channel.threads.create({
      name: threadName || 'New thread',
      autoArchiveDuration: 60,
      reason: 'Thread created by ' + interaction.user.tag + ' using Rollup'
    })
    if (thread.joinable) await thread.join()

    // Convert the messages collection to an array, and reverse them so they can be sent in the right order
    const messageKeysArray = [...messages.keys()]
    const messageValuesArray = [...messages.values()]
    messageKeysArray.reverse()
    messageValuesArray.reverse()
    const sliceStart = messageKeysArray.indexOf(interaction.targetId)
    const targetValues = messageValuesArray.slice(sliceStart)

    targetValues.forEach(message => {
      rollupWebhook.send({
        username: message.member.nickname || message.author.displayName,
        avatarURL: message.author.displayAvatarURL(),
        content: message.content?.length > 0 ? message.content : '',
        files: message.attachments.map(attachment => attachment),
        threadId: thread.id
      })

      // Add all users who authored the messages forwarded to the thread, and delete the original messages
      thread.members.add(message.author.id)
      message.delete()
    })

    await interaction.editReply('New thread created from ' + targetValues.length + ' messages!')
  }
}

export default rollupContextCommand
