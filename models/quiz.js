const mongoose = require('mongoose')


const question = require('./question').schema

const quizSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    questions: [ question ]

}, {
    timestamps: true
})

quizSchema.pre('save', function (next) {

    var quiz = this
    quiz.subject = (quiz.subject).toLowerCase()
    next()

})

const Quiz = mongoose.model('Quiz', quizSchema)
module.exports = Quiz