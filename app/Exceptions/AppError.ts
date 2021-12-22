const INTERNAL_SERVER_ERROR =
  'Sorry. An internal server error has occurred. Please try again later or contact us.'

class AppError {
  public readonly status: number
  public readonly message: string
  public readonly body: any
  public readonly error: any

  constructor(error: any) {
    this.error = error
    this.status = error?.response?.status || 500
    this.message = error?.response?.data?.message || INTERNAL_SERVER_ERROR
    this.body = error?.response?.data || null
  }
}

export default AppError
