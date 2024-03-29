import Env from '@ioc:Adonis/Core/Env'
import test from 'japa'
import { Assert } from 'japa/build/src/Assert'

import EmailService from 'App/Services/EmailService'

test.group('EmailService', () => {
  const payload = {
    path: 'emails/set_password',
    from: Env.get('SMTP_USERNAME'),
    to: 'dummy@test.com',
    subject: 'Email Test',
    content: {
      url: 'https://localhost.com.br',
      name: 'Sr. John Doe',
      tenant_name: 'Medical Clinic Ltda.',
    },
  }

  test('should send a new email to the specified destinatary', async (assert: Assert) => {
    const hasSent = await EmailService.send(payload)

    assert.equal(hasSent, true)
    /** NOTE: A longer timeout is necessary here because this service's method sends an email. */
  }).timeout(50000)
})
