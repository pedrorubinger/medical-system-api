import test from 'japa'
import supertest from 'supertest'

import { TRole } from 'App/Models/User'
import { rollbackMigrations, runMigrations } from '../../japaFile'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`
const dummyUser = {
  email: 'pedro@test.com',
  password: 'pedro123',
  password_confirmation: 'pedro123',
  role: 'doctor' as TRole,
  name: 'Pedro Henrique',
  phone: '31 9126384',
  cpf: '12345678910',
  is_admin: false,
}

test.group('UsersController', (group) => {
  group.before(async () => {
    await rollbackMigrations()
    await runMigrations()
  })

  test('should authenticate the user', async () => {
    const credentials = { email: 'pedro@test.com', password: 'pedro123' }

    await supertest(BASE_URL).post('/user').send(dummyUser)
    await supertest(BASE_URL).post('/session').send(credentials).expect(200)
  })

  test('should deny the user access (incorrect credentials)', async () => {
    const credentials = { email: 'pedro@test.com.br', password: 'pedro1234' }

    await supertest(BASE_URL).post('/session').send(credentials).expect(400)
  })

  test("should approve the user's token", async () => {
    const credentials = { email: 'pedro@test.com', password: 'pedro123' }

    const response = await supertest(BASE_URL)
      .post('/session')
      .send(credentials)
    const token = response.body.token
    const headers = { Authorization: `Bearer ${token}` }

    await supertest(BASE_URL).get('/session/validate').set(headers).expect(200)
  })

  test("should not approve the user's token", async () => {
    const headers = { Authorization: 'Bearer Y2tvMDAwMGN3dXdncmEzN3BlZA' }

    await supertest(BASE_URL).get('/session/validate').set(headers).expect(401)
  })
})
