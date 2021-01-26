import express from 'express'
import UserController from '../controllers/UserController'
import authMiddleware from '../middlewares/authMiddleware'

const router = express.Router()

router.put('/users/:id', authMiddleware, UserController.updateUser)

export = router
