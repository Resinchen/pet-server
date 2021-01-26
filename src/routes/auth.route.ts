import express from 'express'
import AuthController from '../controllers/AuthController'

const router = express.Router()

router.post('/singin', AuthController.authenticate)
router.post('/singup', AuthController.registrate)

export = router
