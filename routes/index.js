var express = require('express')
var router = express.Router()

const quizController=require('../controllers/quiz.controller')
const middleWare=require('../middleware/isLoggedin')



//Compose middleware package can be used here later on to compose multiple middlewares into a single array 
router.post('/api/v1/quizzes',middleWare.isLoggedIn,quizController.createQuiz)
router.get('/api/v1/quizzes/:qid',quizController.viewQuiz)

router.post('/api/v1/quizzes/:qid/questions',middleWare.isLoggedIn,quizController.addQuestion)
router.delete('/api/v1/quizzes/:qid/questions/:qqid',middleWare.isLoggedIn,quizController.deleteQuestion)

router.get('/api/v1/quizzes',quizController.viewAll)

module.exports = router
