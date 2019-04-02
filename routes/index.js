var express = require('express');
var router = express.Router();

const quizController=require('../controllers/quiz.controller')

// Listing all quizzes
//  Show the quiz & associated questions
//  Create a new quiz
//  Add a question to an existing quiz
//  Remove a question from an existing quiz

//subject name + questions
router.post('/api/v1/quiz',quizController.createQuiz)
router.get('/api/v1/quiz',quizController.viewAll)

router.post('api/v1/quiz/:id/question',quizController.addQuestion)
router.delete('api/v1/quiz/:id/question/:id',quizController.deleteQuestion)


module.exports = router;
