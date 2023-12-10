import mongoose from 'mongoose'

export default async function connect () {
  await mongoose.connect(process.env.DB_CONNECTION)
}
