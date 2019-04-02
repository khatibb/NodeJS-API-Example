const _ = require('lodash')


const quiz = require('../models/quiz')
const quizController = {

    // To-ADD : JOI VALIDATION
    createQuiz: (req, res) => {

        const {
            subject,
            questions
        } = req.body

        let tempQuiz = new quiz({
            subject: _.toString(subject),
        })
        if (questions) tempQuiz.questions = _.castArray(questions)



        tempQuiz.save()
            .then((done) => {

                if (!done) return res.status(500).json({
                    message: 'couldnt create quiz'

                })
                return res.status(200).json({
                    message: 'added quiz',
                    quiz: tempQuiz

                })

            })
            .catch((error) => {
                return res.status(400).json({
                    message: error.errors.subject.message

                })
            })



    },
    viewQuiz: (req, res) => {

        const quizId = req.params.qid
        // TO-DO : add JOI Validation

        quiz.findOne({
                _id: quizId
            }).lean()
            .then((fetchedQuiz) => {
                return res.status(200).json({
                    quiz: fetchedQuiz
                })
            })
            .catch((__) => {
                return res.status(400).json({
                    message: "couldnt find a quiz with the specified id"
                })
            })




    },
    addQuestion: (req, res) => {
        const quizId = req.params.qid
        const questions = req.body.questions
        // TO-DO : add JOI Validation
        quiz.updateOne({
                _id: quizId
            }, {
                $push: {
                    questions: {
                        $each: _.castArray(questions)
                    }
                }
            }).then((updated) => {

                const success = updated.ok === 1 && updated.nModified === 1
                if (success) {
                    return res.status(200).json({
                        message: 'added questions to the specified quiz successfully',

                    })
                } else {
                    return res.status(500).json({
                        message: 'couldnt add questions to the specified quiz ',

                    })
                }
            })
            .catch((error) => {

                let message
                if (error.path === '_id') message = "couldn't find a quiz for the specified ID"
                else message = "no {questions} attribute found in the incoming body payload" // TO-DO : HANDLE IN JOI

                return res.status(500).json({
                    message: message

                })

            })




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

        quiz.updateOne({
                _id: quizId
            }, {
                $pull: {
                    questions: {
                        _id: questionId
                    }
                }
            }, {

            }).lean()
            .then((updated) => {
                console.log(updated)

                const success = updated.ok === 1 && updated.nModified === 1

                if (success) {

                    return res.status(200).json({
                        message: 'Deleted question with the specified ID @ the specified quiz ID',

                    })
                } else {
                    return res.status(500).json({
                        message: 'couldnt delete question'

                    })
                }
            })
            .catch((error) => {
                return res.status(500).json({
                    message: error

                })

            })




    },

    viewAll: (__, res) => {
        quiz.find({}).lean()
            .then((fetchedQuizzes) => {
                return res.status(200).json({
                    quizzes: fetchedQuizzes
                })
            })
            .catch((__) => {
                return res.status(500).json({
                    message: "coudlnt fetch quizzes"
                })
            })
    }
}

module.exports = quizController