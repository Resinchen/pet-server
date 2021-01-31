import express from 'express'
import FileController from '../controllers/FileController'
import upload from '../middlewares/upload'

const router = express.Router()

router.post(
  '/upload',
  // authMiddleware,
  upload.single('file'),
  FileController.uploadFile
)

router.put(
  '/upload/:id',
  // authMiddleware,
  upload.single('file'),
  FileController.updateFile
)

export = router
