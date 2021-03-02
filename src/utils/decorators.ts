import { Request, Response } from 'express'
import { Logger } from './logging'
import ResponseError from './ResponseError'

export function catchable(logger: Logger) {
  return function (
    target: Object,
    propertyName: string,
    propertyDesciptor: PropertyDescriptor
  ): PropertyDescriptor {
    const method = propertyDesciptor.value
    propertyDesciptor.value = async function (req: Request, res: Response) {
      try {
        const result = await method(req, res)
        return result
      } catch (e) {
        if (e instanceof ResponseError) {
          logger.error(e.message)
          return res.status(e.statusCode).json(e.message)
        }
      }
    }
    return propertyDesciptor
  }
}
