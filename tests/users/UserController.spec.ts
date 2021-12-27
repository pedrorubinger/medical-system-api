import test from 'japa'
import supertest from 'supertest'

import { TRole } from 'App/Models/User'
import { rollbackMigrations, runMigrations } from '../../japaFile'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('UsersController', (group) => {
  group.before(async () => {
    await rollbackMigrations()
    await runMigrations()
  })

  test('should return status 200 (GET /user)', async () => {
    await supertest(BASE_URL).get('/user').expect(200)
  })

  test('should return status 201 (POST /user)', async () => {
    const payload = {
      email: 'pedro@test.com',
      password: 'pedro123',
      password_confirmation: 'pedro123',
      role: 'doctor' as TRole,
      name: 'Pedro Henrique',
      phone: '31 9126384',
      cpf: '12345678910',
      is_admin: false,
    }

    await supertest(BASE_URL).post('/user').send(payload).expect(201)
  })

  test('should return status 422 (POST /user)', async () => {
    const payload = {
      email: 'pedro@test.com',
      password: 'pedro123',
      password_confirmation: 'pedro123',
      role: 'doctor' as TRole,
    }

    await supertest(BASE_URL).post('/user').send(payload).expect(422)
  })

  test('should return status 200 (GET /user/:id)', async () => {
    await supertest(BASE_URL).get('/user/1').expect(200)
  })

  test('should return status 200 (PUT /user/:id)', async () => {
    const payload = { name: 'Pedro Rubinger', phone: '31 9126382344' }

    await supertest(BASE_URL).put('/user/1').send(payload).expect(200)
  })

  test('should return status 200 (DELETE /user/:id)', async () => {
    await supertest(BASE_URL).delete('/user/1').expect(200)
  })
})
