import { ContextMenuCommandBuilder, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import connect from '../../../functions/db-connect.js'
import Server from '../../../schemas/server-schema.js'
import { commands } from '../../commands.js'
import type { APIEmbedField } from 'discord.js'
import type { SlashCommand } from '../../index.js'

const helpCommand: SlashCommand = {
  type: 'global',
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('List commands and features your server has access to'),

  async execute (interaction) {
    const globalCommands: APIEmbedField[] = []
    for (const command of commands.values()) {
      if (command.type !== 'global')
        continue
      let description: string
      if (command.data instanceof ContextMenuCommandBuilder)
        description = 'Right click a message to use this command!'
      else
        description = command.data.description
      globalCommands.push({
        name: `\`/${command.data.name}\``,
        value: description
      })
    }

    const globalsEmbed = new EmbedBuilder()
      .setColor('#FFFFFF')
      .setAuthor({ name: 'Realm', iconURL: 'https://raw.githubusercontent.com/compsigh/realm/main/assets/realm-icon.png' })
      .setFields(...globalCommands)

    // Fetch commands the server has access to
    await connect()
    const server = await Server.findOne({ guildId: interaction.guildId })
    if (!server)
      return await interaction.reply({ content: 'Realm is not yet set up in this server!\nPlease run `/setup`.', ephemeral: true })

    const botAccessConfig = server.botAccess
    const commandGroupEmbeds = []

    for (const [bot, enabled] of Object.entries(botAccessConfig)) {
      if (!enabled)
        continue
      const botCommands = []
      commands.forEach(command => {
        let description: string
        if (command.data instanceof ContextMenuCommandBuilder)
          description = 'Right click a message to use this command!'
        else
          description = command.data.description
        if (command.type === bot)
          botCommands.push({
            name: `\`/${command.data.name}\``,
            value: description
          })
      })

      const botSentenceCase = bot.charAt(0).toUpperCase() + bot.slice(1)
      const commandGroupEmbed = new EmbedBuilder()
        .setColor('#FFFFFF')
        .setAuthor({ name: botSentenceCase, iconURL: `https://raw.githubusercontent.com/compsigh/realm/main/assets/${bot}-icon.png` })
        .setFields(...botCommands)
      commandGroupEmbeds.push(commandGroupEmbed)
    }

    const helpEmbed = new EmbedBuilder()
      .setColor('#FFFFFF')
      .setDescription('Below are the commands and features your server has access to.\n**Realm** commands are always accessible.')
    await interaction.reply({ embeds: [helpEmbed, globalsEmbed, ...commandGroupEmbeds], ephemeral: true })
  }
}

export default helpCommand
