import mongoose from 'mongoose'
const { Schema, model } = mongoose

const eventSchema = new Schema({
  guildId: {
    type: String,
    required: true,
    immutable: true
  },
  eventName: {
    type: String,
    required: true
  },
  eventDate: {
    type: Date,
    required: true
  },
  eventEmoji: {
    type: String,
    required: true,
    immutable: true
  },
  eventMessageId: {
    type: String,
    required: true,
    immutable: true
  },
  eventRoleId: {
    type: String,
    required: true,
    immutable: true
  },
  createdOn: {
    type: Date,
    default: () => Date.now(),
    immutable: true
  }
}, { collection: 'events' })

const Event = mongoose.models.Event || model('Event', eventSchema)

export default Event
