import express from 'express'
import UserController from '../controllers/UserController'
import authMiddleware from '../middlewares/authMiddleware'

const router = express.Router()

router.post('/users', UserController.store)
router.get('/users', authMiddleware, UserController.index)

export = router
