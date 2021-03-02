class ResponseError extends Error {
  constructor(readonly statusCode: number, message: string) {
    super(message)
  }
}

export default ResponseError
