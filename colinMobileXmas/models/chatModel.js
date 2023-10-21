const mongoose = requre('mongoose')
const chatSchema = new Schema({
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  messages: [
    { text: String, sender: { type: Schema.Types.ObjectId, ref: 'User' } },
  ],
  createdAt: { type: Date, default: Date.now },
})
