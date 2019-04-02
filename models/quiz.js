  let mongoose = require('mongoose')
 
//IMPORTANT:linting views questionSchema as a not used variable but it's used by mongoose.model('questionSchema')
const questionSchema=require('./question')
const question = mongoose.model('questionSchema').schema



  let quizSchema = new mongoose.Schema({
      subject:{type:String ,required:true},
      questions: [question]

  }, {
      timestamps: true
  })

  quizSchema.pre('save', function(next) {
    var quiz = this
    quiz.subject = (quiz.subject).toLowerCase()
    next()
})

  let Quiz = mongoose.model('Quiz', quizSchema)
  module.exports = Quiz