import mongoose from 'mongoose'
const { Schema, model } = mongoose

const serverSchema = new Schema({
  guildId: {
    type: String,
    required: true,
    immutable: true
  },
  enabledBots: {
    type: Object,
    required: true,
    default: {
      register: false,
      rollup: false,
      receipt: false,
      recap: false,
      router: false
    }
  },
  config: {
    type: Object,
    required: true,
    default: {
      register: {
        type: Object,
        required: true,
        default: {
          allowPurging: false,
          events: [{
            guildId: String,
            eventName: String,
            eventDate: String,
            eventEmoji: String,
            eventMessageId: String,
            eventRoleId: String
          }] // TODO: abstract this into a separate schema
        }
      }
      // TODO: add the other bots' configs
    }
  },
  createdOn: {
    type: Date,
    required: true,
    immutable: true,
    default: () => Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles' }).format(new Date())
  }
}, { collection: 'servers' })

const Server = mongoose.models.Server || model('Server', serverSchema)

export default Server
