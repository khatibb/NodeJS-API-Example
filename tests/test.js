const request = require('supertest')
const app = require('../config/app')

const mongoose = require('mongoose')

const connectToMongo = require('../config/mongo')
const quiz = require('../models/quiz')

const fakeToken = process.env.FAKE_TOKEN

beforeAll(async () => {

    await connectToMongo(process.env.MONGOTESTURL || 'mongodb://localhost:27017/coligo-test')

})


afterAll(async () => {

    await quiz.deleteMany({})
    await mongoose.disconnect()

})


const savedQuizDetails = {}
describe('POST /quiz', () => {

    test('It responds with a the newly created quiz ', async () => {

        const response = await request(app)
            .post('/api/v1/quizzes')
            .set('x-fake-token', fakeToken)
            .send({
                'subject': 'ENGLISH',
                'questions': [ {
                    'question': 'what is love ',
                    'category': 'multipleChoices',
                    'answers': [ {
                        'answer': 'baby dont hurt me'
                    },
                    {
                        'answer': ' baby dont hit me'
                    }
                    ]
                },
                {
                    'question': 'how dare you ',
                    'category': 'shortAnswer',
                    'answers': [ {
                        'answer': 'hit me'
                    } ]
                }
                ]
            })
        expect(response.statusCode).toBe(200)
        expect(response.body.quiz).toHaveProperty('_id')
        expect(response.body.quiz).toHaveProperty('subject')
        expect(response.body.quiz).toHaveProperty('questions')
        expect(response.body.quiz.questions.length).toBe(2)
        expect(response.body.quiz.questions[0]).toHaveProperty('_id')
        expect(response.body.quiz.questions[0]).toHaveProperty('category')
        expect(response.body.quiz.questions[0]).toHaveProperty('answers')
        expect(response.body.quiz.questions[0].answers.length).toBe(2)
        expect(response.body.quiz.questions[0].answers[0]).toHaveProperty('_id')
        expect(response.body.quiz.questions[0].answers[0]).toHaveProperty('answer')

        //set a quizID as a class variable for further tests
        savedQuizDetails._id = response.body.quiz._id



    })
    test('It shouldnt be to create a quiz without a valid fake auth token ', async () => {

        const response = await request(app)
            .post('/api/v1/quizzes')
            .send()
        expect(response.statusCode).toBe(401)
    
    })

})



describe('POST /quiz/:qid/question', () => {

    test('It should add new question(s) to a specified quiz', async () => {

        const response = await request(app)
            .post('/api/v1/quizzes/' + savedQuizDetails._id + '/questions')
            .set('x-fake-token', fakeToken)
            .send({
                'questions': [ {
                    'question': 'newly added question 1 ',
                    'category': 'multipleChoices',
                    'answers': [ {
                        'answer': 'newly added question 1 answer 1'
                    },
                    {
                        'answer': 'newly added question 1 answer 2'
                    }
                    ]
                },
                {
                    'question': 'newly added question 2 ',
                    'category': 'shortAnswer',
                    'answers': [ {
                        'answer': 'newly added question 2 answer 1'
                    } ]
                }
                ]
            })

        expect(response.statusCode).toBe(200)
        expect(response.body.updatedQuiz).toHaveProperty('_id')
        expect(response.body.updatedQuiz._id).toBe(savedQuizDetails._id)
        expect(response.body.updatedQuiz).toHaveProperty('subject')
        expect(response.body.updatedQuiz).toHaveProperty('questions')
        expect(response.body.updatedQuiz.questions.length).toBe(4)
        expect(response.body.updatedQuiz.questions[3]).toHaveProperty('_id')
        expect(response.body.updatedQuiz.questions[3]).toHaveProperty('category')
        expect(response.body.updatedQuiz.questions[3]).toHaveProperty('answers')
        expect(response.body.updatedQuiz.questions[3].answers.length).toBe(1)
        expect(response.body.updatedQuiz.questions[3].answers[0]).toHaveProperty('_id')
        expect(response.body.updatedQuiz.questions[3].answers[0]).toHaveProperty('answer')

        //save a question id for later on deleteing it
        savedQuizDetails.questionID = response.body.updatedQuiz.questions[0]._id

    })


    test('it shouldnt be able to add questions to a quiz without a vallid fake auth token', async () => {

        const response = await request(app)
            .post('/api/v1/quizzes/' + savedQuizDetails._id + '/questions')
            .send()

        expect(response.statusCode).toBe(401)


    })

})
describe('GET /quiz/:qid', () => {

    test('it should return the specified quiz', async () => {

        const response = await request(app)
            .get('/api/v1/quizzes/' + savedQuizDetails._id)
        expect(response.statusCode).toBe(200)
        expect(response.body.quiz).toHaveProperty('_id')
        expect(response.body.quiz._id).toBe(savedQuizDetails._id)
        expect(response.body.quiz).toHaveProperty('subject')
        expect(response.body.quiz).toHaveProperty('questions')
        expect(response.body.quiz.questions[0]).toHaveProperty('_id')
        expect(response.body.quiz.questions[0]).toHaveProperty('category')
        expect(response.body.quiz.questions[0]).toHaveProperty('answers')
        expect(response.body.quiz.questions[0].answers[0]).toHaveProperty('_id')
        expect(response.body.quiz.questions[0].answers[0]).toHaveProperty('answer')

    })

})

describe('GET /quiz', () => {

    test('it should return a list of all quizzes', async () => {

        //Create a 2nd fake quiz
        await request(app)
            .post('/api/v1/quizzes')
            .set('x-fake-token', fakeToken)
            .send({
                subject: 'Fake quiz'
            })
        const response = await request(app)
            .get('/api/v1/quizzes')
        expect(response.statusCode).toBe(200)
        expect(response.body.quizzes.length).toBe(2)
    
    })

})


describe('Delete /api/v1/quizzes/:qid/questions/:qqid', () => {

    test('it should delete a specific qqid@question from a specific id@quiz', async () => {

        const response = await request(app)
            .delete('/api/v1/quizzes/' + savedQuizDetails._id + '/questions/' + savedQuizDetails.questionID)
            .set('x-fake-token', fakeToken)

        expect(response.statusCode).toBe(200)
        expect(response.body.questionId).toBe(savedQuizDetails.questionID)
    
    })
    test('it shouldnt be able to delete the same question after it being deleted', async () => {

        const response = await request(app)
            .delete('/api/v1/quizzes/' + savedQuizDetails._id + '/questions/' + savedQuizDetails.questionID)
            .set('x-fake-token', fakeToken)

        expect(response.statusCode).toBe(500)
    
    })
    test('it shouldnt be able to delete a question with a valid fake auth token', async () => {

        const response = await request(app)
            .delete('/api/v1/quizzes/' + savedQuizDetails._id + '/questions/' + savedQuizDetails.questionID)


        expect(response.statusCode).toBe(401)

    })

})