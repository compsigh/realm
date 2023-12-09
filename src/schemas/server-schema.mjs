import mongoose from 'mongoose'
const { Schema, SchemaTypes, model } = mongoose

const serverSchema = new Schema({
  guildId: {
    type: String,
    required: true,
    immutable: true
  },
  botAccess: {
    type: Object,
    default: {
      rally: false,
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
      rally: {
        allowPurging: false,
        events: [{
          type: SchemaTypes.ObjectId,
          ref: 'Event',
        }]
      },
      rollup: {
        type: Object,
        queues: {
          type: Object
        }
      }
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
