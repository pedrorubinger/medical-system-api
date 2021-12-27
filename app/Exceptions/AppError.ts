export default class AppError {
  public readonly message: string
  public readonly status: number

  constructor(message?: string, status?: number) {
    this.message =
      message ||
      'Sorry. An internal server error has occurred. Please try again later or get in touch.'
    this.status = status || 500
  }
}
