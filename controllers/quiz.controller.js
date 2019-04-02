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
                    message:error.errors.subject.message

                })
            })
        //If an error occured while saving to the DB



        // const {
        //     subject,
        //     questions
        // } = req.body

        // let tempQuiz = new quiz({
        //     subject: _.toString(subject)
        // })


        // let saved = tempQuiz.save()
        // //If an error occured while saving to the DB
        // if (!saved) return res.status(SERVICE_UNAVAILABLE).json({
        //     message: 'Couldnt create quiz'
        // })
        // //If the incoming payload didnt have a questions attribute end here , Otherwise continue
        // if (!questions) return res.status(OK).json({
        //     message: 'Created Quiz Successfully',
        //     quiz: tempQuiz
        // })

        // //Add questions to quiz
        // const updated = await quiz.updateOne({
        //     '_id': tempQuiz._id
        // }, {
        //     $push: {
        //         questions: {
        //             $each: _.castArray(questions)
        //         }
        //     }
        // }, {
        //     new: true
        // })

        // const success = updated.ok === 1 && updated.nModified === 1


        // //Fetch Added quiz with it's questions from DB
        // let addedQuiz= await quiz.findOne({'_id':tempQuiz._id})

        // if (success&&addedQuiz) {
        //     return res.status(OK).json({
        //         message: 'added Quiz with Questions',
        //         quiz: addedQuiz
        //     })
        // }


        // return res.status(500).json({
        //     message:'Coudnt add questions to the specified quiz'

        // })








    },
    viewAll: async (req, res) => {

    },
    addQuestion: async (req, res) => {

    },

    deleteQuestion: async (req, res) => {

    }





}

module.exports = quizController