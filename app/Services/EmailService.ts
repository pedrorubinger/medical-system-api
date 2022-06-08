import Mail from '@ioc:Adonis/Addons/Mail'

import AppError from 'App/Exceptions/AppError'

interface EmailData {
  path: string
  from: string
  to: string
  subject: string
  content: any
}

class EmailService {
  public async send({
    path,
    to,
    from,
    subject,
    content,
  }: EmailData): Promise<boolean> {
    try {
      await Mail.sendLater((message) => {
        message.htmlView(path, { ...content })
        message.to(to)
        message.from(from)
        message.subject(subject)
      })

      return true
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }
}

export default new EmailService()
