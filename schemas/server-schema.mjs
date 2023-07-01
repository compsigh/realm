import mongoose from 'mongoose'
const { Schema, SchemaTypes, model } = mongoose

const serverSchema = new Schema({
  guildId: {
    type: String,
    required: true,
    immutable: true
  },
  enabledBots: {
    type: Object,
    default: {
      register: false,
      rollup: false,
      receipt: false,
      recap: false,
      router: false
    }
  },
  lastRefresh: {
    type: Date,
    required: true
  },
  config: {
    type: Object,
    required: true,
    default: {
      register: {
        allowPurging: false,
        events: [{
          type: SchemaTypes.ObjectId,
          ref: 'Event',
        }]
      }
      // TODO: add the other bots' configs
    }
  },
  createdOn: {
    type: Date,
    default: () => Date.now(),
    immutable: true
  }
}, { collection: 'servers' })

const Server = mongoose.models.Server || model('Server', serverSchema)

export default Server
