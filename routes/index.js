var express = require('express');
var router = express.Router();

const quizController=require('../controllers/quiz.controller')
const middleWare=require('../middleware/isLoggedin')



//Compose middleware package can be used here later on to compose multiple middlewares into a single array 
router.post('/api/v1/quiz',middleWare.isLoggedIn,quizController.createQuiz)
router.get('/api/v1/quiz/:qid',quizController.viewQuiz)

router.post('/api/v1/quiz/:qid/question',middleWare.isLoggedIn,quizController.addQuestion)
router.delete('/api/v1/quiz/:qid/question/:qqid',middleWare.isLoggedIn,quizController.deleteQuestion)

router.get('/api/v1/quiz',quizController.viewAll)

module.exports = router;
