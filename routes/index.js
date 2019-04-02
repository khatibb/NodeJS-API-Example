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
router.get('/api/v1/quiz/:qid',quizController.viewQuiz)

router.post('/api/v1/quiz/:qid/question',quizController.addQuestion)
router.delete('/api/v1/quiz/:qid/question/:qqid',quizController.deleteQuestion)


module.exports = router;
