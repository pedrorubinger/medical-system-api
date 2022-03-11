import test from 'japa'
import supertest from 'supertest'
import { defaultUser } from 'Database/seeders/02_User'

import { rollbackMigrations, runMigrations, runSeeds } from '../../japaFile'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`
const credentials = {
  email: defaultUser.email,
  password: defaultUser.password,
}

test.group('UserController', (group) => {
  group.before(async () => {
    await rollbackMigrations()
    await runMigrations()
    await runSeeds()
  })

  test('should authenticate the user', async () => {
    await supertest(BASE_URL).post('/session').send(credentials).expect(200)
  })

  test('should deny the user access (incorrect credentials)', async () => {
    const wrongCredentials = {
      email: 'pedro@test.com.br',
      password: 'pedro1234',
    }

    await supertest(BASE_URL)
      .post('/session')
      .send(wrongCredentials)
      .expect(400)
  })

  test("should approve the user's token", async () => {
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
