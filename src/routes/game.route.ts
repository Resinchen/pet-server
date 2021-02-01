import express from 'express'
import GameController from '../controllers/GameController'
import authMiddleware from '../middlewares/authMiddleware'

const router = express.Router()

router.get('/games', authMiddleware, GameController.getAllGamesByUserId)
router.get('/games/:id', authMiddleware, GameController.getGameInfoById)
router.get('/download/:id', authMiddleware, GameController.downloadGame)
router.post('/games', authMiddleware, GameController.createGame)
router.put('/games/:id', authMiddleware, GameController.updateGame)
router.delete('/games/:id', authMiddleware, GameController.deleteGame)
router.post('/compile/:id', authMiddleware, GameController.compileGame)

export = router
