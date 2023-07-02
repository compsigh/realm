import { SlashCommandBuilder } from '@discordjs/builders'
import * as Discord from 'discord.js'
import connect from '../../../functions/db-connect.mjs'
import Server from '../../../schemas/server-schema.mjs'
import { commands } from '../../commands.mjs'

const helpCommand = {
  type: 'global',
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('List commands and features your server has access to'),

  async execute (interaction) {
    const globalCommands = []
    for (const command of commands)
      if (command.type === 'global')
        globalCommands.push({
          name: `\`/${command.data.name}\``,
          value: command.data.description
        })

    const globalsEmbed = new Discord.EmbedBuilder()
      .setColor('#FFFFFF')
      .setAuthor({ name: 'Realm', iconURL: 'https://app.realm.build/realm-icon.png' })
      .setFields(...globalCommands)

    // Fetch commands the server has access to
    // TODO: abstract this, this is atrocious and may almost certainly need to be reused
    await connect()
    const server = await Server.findOne({ guildId: interaction.guildId })
    if (!server)
      return await interaction.reply({ content: 'Realm is not yet set up in this server!\nPlease run `/setup`.', ephemeral: true })

    const enabledBotsConfig = server.enabledBots
    const commandGroupEmbeds = []
    const commandGroupEmbed = new Discord.EmbedBuilder()
      .setColor('#FFFFFF')

    for (const [bot, enabled] of Object.entries(enabledBotsConfig)) {
      if (enabled === true) {
        const botCommands = []
        for (const command of commands)
        if (command.type === bot)
        botCommands.push({
          name: `\`/${command.data.name}\``,
          value: command.data.description
        })

        const botSentenceCase = bot.charAt(0).toUpperCase() + bot.slice(1)
        commandGroupEmbed.setAuthor({ name: botSentenceCase, iconURL: `https://app.realm.build/${bot}-icon.png` })
        commandGroupEmbed.setFields(...botCommands)
        commandGroupEmbeds.push(commandGroupEmbed)
      }
    }

    const helpEmbed = new Discord.EmbedBuilder()
      .setColor('#FFFFFF')
      .setDescription('Below are the commands and features your server has access to.\n**Realm** commands are always accessible.')
    await interaction.reply({ embeds: [helpEmbed, globalsEmbed, ...commandGroupEmbeds], ephemeral: true })
  }
}

export default helpCommand
