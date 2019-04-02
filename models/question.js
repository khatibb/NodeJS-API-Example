let mongoose = require('mongoose')

let questionSchema = new mongoose.Schema({

    question: String,
    category: {
        type: String,
        enum: ['shortAnswer', 'singleChoice', 'multipleChoices']
    },
    answers: [{
        answer: String
    }]


}, {
    timestamps: true
})
module.exports = mongoose.model('questionSchema',questionSchema)