import Mail from '@ioc:Adonis/Addons/Mail'

import AppError from 'App/Exceptions/AppError'

interface EmailData {
  from: string
  to: string
  subject: string
  content: string
}

class EmailService {
  public async send(data: EmailData): Promise<boolean> {
    try {
      await Mail.send((message) => {
        message
          .from(data.from)
          .to(data.to)
          .subject(data.subject)
          .html(data.content)
      })

      return true
    } catch (err) {
      throw new AppError(err?.message)
    }
  }
}

export default new EmailService()
