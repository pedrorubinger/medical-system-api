import test from 'japa'
import supertest from 'supertest'

import { TRole } from 'App/Models/User'
import { rollbackMigrations, runMigrations, runSeeds } from '../../japaFile'
import { defaultUser } from '../../database/seeders/User'
import { BASE_URL } from '../utils/urls'

/** TO DO: Implement test to validate (PUT /user) with wrong password... */
test.group('UsersController', (group) => {
  let token = ''
  let headers: Object

  group.before(async () => {
    await rollbackMigrations()
    await runMigrations()
    await runSeeds()

    const response = await supertest(BASE_URL)
      .post('/session')
      .send({
        email: defaultUser.email,
        password: defaultUser.password,
      })
      .expect(200)

    token = response.body.token
    headers = {
      Authorization: `Bearer ${token}`,
      ContentType: 'application/json',
    }
  })

  test('should return status 200 (GET /user)', async () => {
    await supertest(BASE_URL).get('/user').set(headers).expect(200)
  })

  test('should return status 201 (POST /user)', async () => {
    const payload = {
      email: 'john@test.com',
      password: 'john123',
      password_confirmation: 'john123',
      role: 'doctor' as TRole,
      name: 'John Doe',
      phone: '124534384',
      cpf: '12345576231',
      is_admin: false,
    }

    /** NOTE: A longer timeout is necessary here because this controller's method invokes an email service. */
    await supertest(BASE_URL)
      .post('/user')
      .timeout(50000)
      .set(headers)
      .send(payload)
      .expect(201)
  }).timeout(50000)

  test('should return status 422 (POST /user)', async () => {
    const payload = {
      email: 'jane@test.com',
      password: 'jane123',
      password_confirmation: 'jane123',
      role: 'doctor' as TRole,
    }

    await supertest(BASE_URL)
      .post('/user')
      .set(headers)
      .send(payload)
      .expect(422)
  })

  test('should return status 200 (GET /user/:id)', async () => {
    await supertest(BASE_URL).get('/user/1').set(headers).expect(200)
  })

  test('should return status 200 (PUT /user/:id)', async () => {
    const payload = {
      name: 'John R. Doe',
      phone: '31 238344',
      password: defaultUser.password,
    }

    await supertest(BASE_URL)
      .put(`/user/${defaultUser.id}`)
      .set(headers)
      .send(payload)
      .expect(200)
  })

  test('should return status 200 (DELETE /user/:id)', async () => {
    await supertest(BASE_URL)
      .delete(`/user/${defaultUser.id}`)
      .set(headers)
      .expect(200)
  })
})
