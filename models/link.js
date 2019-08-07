const mongoose = require('mongoose')
const Schema = mongoose.Schema

const linkSchema = new Schema({
  shortUrl: {
    type: String,
    required: true,
  },
  longUrl: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('Link', linkSchema)