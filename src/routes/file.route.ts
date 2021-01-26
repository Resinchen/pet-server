import express from 'express'
import FileController from '../controllers/FileController'
import authMiddleware from '../middlewares/authMiddleware'
import upload from '../middlewares/upload'

const router = express.Router()

router.post(
  '/upload',
  authMiddleware,
  upload.single('file'),
  FileController.uploadFile
)

export = router
