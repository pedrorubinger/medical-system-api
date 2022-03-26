const DEFAULT_MESSAGE =
  'Sorry. An internal server error has occurred. Please try again later or get in touch.'
const DEFAULT_CODE = 'INTERNAL_SERVER_ERROR'
const DEFAULT_STATUS = 500

export default class AppError {
  public readonly message: string
  public readonly code: string
  public readonly status: number

  constructor(message?: string, code?: string, status?: number) {
    this.message =
      code?.toString() === '500' ? DEFAULT_MESSAGE : message || DEFAULT_MESSAGE
    this.code = code || DEFAULT_CODE
    this.status = status || DEFAULT_STATUS
  }
}
