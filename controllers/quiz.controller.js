const _ = require('lodash')


const quiz = require('../models/quiz')
const quizController = {

    // To-ADD : JOI VALIDATION
    createQuiz: async (req, res) => {

        const {
            subject,
            questions
        } = req.body

        let tempQuiz = new quiz({
            subject: _.toString(subject),
        })
        if (questions) tempQuiz.questions = _.castArray(questions)


        try {
            let saved = await tempQuiz.save()

            if (!saved) {
                return res.status(500).json({
                    message: 'couldnt create quiz'

                })
            }
            return res.status(200).json({
                message: 'added quiz',
                quiz: tempQuiz

            })
        } catch (error) {
            return res.status(400).json({
                message: error.errors.subject.message

            })
        }

    },
    viewQuiz: async (req, res) => {

        const quizId = req.params.qid
        // TO-DO : add JOI Validation
        try {
            let foundQuiz = await quiz.findOne({
                _id: quizId
            }).lean()

            if (!foundQuiz) {
                return res.status(400).json({
                    message: "couldnt find a quiz with the specified id"
                })

            }
            return res.status(200).json({
                quiz: foundQuiz
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: "request params doesnt include a valid quiz id"
            })
        }





    },
    addQuestion: async (req, res) => {
        const quizId = req.params.qid
        const questions = req.body.questions
        // TO-DO : add JOI Validation

        try {
            let updated = await quiz.updateOne({
                _id: quizId
            }, {
                $push: {
                    questions: {
                        $each: _.castArray(questions)
                    }
                }
            }).lean()
            console.log(updated)
            const success = updated.ok === 1 && updated.nModified === 1
            if (!success) {

                return res.status(500).json({
                    message: 'couldnt add questions to the specified quiz ',

                })
            }
            return res.status(200).json({
                message: 'added questions to the specified quiz successfully',

            })

        } catch (error) {
            return res.status(500).json({
                message: error

            })
        }





    },

    deleteQuestion: async (req, res) => {
        const quizId = req.params.qid
        const questionId = req.params.qqid


        /*UpdateOne has an internal library problem that returns 1 always whenver the search query 
         is matched not when it actually does the update function (like push and pull) , so it isnt suitaable 
        for deleting purposes 
         I used a combination of FindOne to check  if the deleted object is available Then removed it, 
         using FindOne as a open/closed gate for the update function
         
               */


        try {
            //Search if the questions exists in the specified quiz
            let questionExists = await quiz.findOne({
                $and: [{
                    _id: quizId
                }, {
                    'questions._id': questionId
                }]

            })

            if (!questionExists) {
                return res.status(500).json({
                    message: "couldn't find the specified question id @ the specified quiz ID"

                })
            }

            // If exists -> delete it
            let updated = await quiz.updateOne({
                _id: quizId
            }, {
                $pull: {
                    questions: {
                        _id: questionId
                    }
                }
            }, {

            }).lean()

            const success = updated.ok === 1 && updated.nModified === 1

            if (!success) {

                return res.status(500).json({
                    message: 'couldnt delete question'

                })
            }

            return res.status(200).json({
                message: 'Deleted question with the specified ID @ the specified quiz ID',

            })

        } catch (error) {
            return res.status(500).json({
                message: error

            })
        }





    },

    viewAll: async (__, res) => {
        try {
            let quizzes = await quiz.find({}).lean()

            return res.status(200).json({
                quizzes: fetchedQuizzes
            })

        } catch (error) {
            return res.status(500).json({
                message: "No quizzes exist to return"
            })
        }

    }
}
module.exports = quizController