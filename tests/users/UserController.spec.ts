import test from 'japa'
import supertest from 'supertest'

import { BASE_URL } from '../utils/urls'
import { generateTestAuth } from '../utils/authentication'
import { defaultUser } from '../../database/seeders/02_User'
import { TRole } from 'App/Models/User'
import { defaultTenant } from '../../database/seeders/01_Tenant'

test.group('UserController', (group) => {
  let headers: Object

  group.before(async () => {
    const response = await generateTestAuth()

    headers = response.headers
  })

  test('should return status 400 (PUT /user) when password is invalid on update profile (User) data', async () => {
    await supertest(BASE_URL)
      .put(`/user/${defaultUser.id}`)
      .set(headers)
      .send({ name: 'Pedro R', password: 'wrong-p#sswrd' })
      .expect(400)
  })

  test('should return status 200 (GET /user)', async () => {
    await supertest(BASE_URL)
      .get('/user?filterOwn=true')
      .set(headers)
      .expect(200)
  })

  test('should return status 201 (POST /user)', async () => {
    const payload = {
      email: 'john@test.com',
      password: 'john123',
      password_confirmation: 'john123',
      role: 'doctor' as TRole,
      crm_document: 'CRM12345',
      name: 'John Doe',
      phone: '124534384',
      cpf: '12345576231',
      is_admin: false,
      tenant_id: defaultUser.tenant_id,
    }

    /** NOTE: A longer timeout is necessary here because this controller's method invokes an email service. */
    await supertest(BASE_URL)
      .post('/user')
      .timeout(50000)
      .set(headers)
      .send(payload)
      .expect(201)
  }).timeout(50000)

  test('should return status 422 (PUT /user) when user try to update their CPF with one which already exists', async () => {
    const user = await supertest(BASE_URL)
      .get(`/user/${defaultUser.id}`)
      .set(headers)
      .expect(200)

    await supertest(BASE_URL)
      .put(`/user/${defaultUser.id}`)
      .set(headers)
      .send({
        name: 'John A. Doe',
        password: defaultUser.password,
        cpf: user.body.cpf,
      })
      .expect(422)
  })

  test('should return status 422 (PUT /user) when user try to update their email with one which already exists', async () => {
    const user = await supertest(BASE_URL)
      .get(`/user/${defaultUser.id}`)
      .set(headers)
      .expect(200)

    await supertest(BASE_URL)
      .put(`/user/${defaultUser.id}`)
      .set(headers)
      .send({
        name: 'John A. Doe',
        password: defaultUser.password,
        email: user.body.email,
      })
      .expect(422)
  })

  test('should return status 422 (POST /user)', async () => {
    const payload = {
      email: 'jane@test.com',
      password: 'jane123',
      password_confirmation: 'jane123',
      role: 'doctor' as TRole,
      tenant_id: defaultTenant.id,
    }

    await supertest(BASE_URL)
      .post('/user')
      .set(headers)
      .send(payload)
      .expect(422)
  })

  test('should return status 200 (GET /user/:id)', async () => {
    await supertest(BASE_URL)
      .get(`/user/${defaultUser.id}`)
      .set(headers)
      .expect(200)
  })

  test('should return status 200 (GET /user/password/validate/:token) when user opens the page to set a new password, the token must be validated', async () => {
    await supertest(BASE_URL)
      .get(`/user/password/validate/${defaultUser.reset_password_token}`)
      .expect(200)
  })

  test('should return status 200 (PUT /user/:id) when user updates their name and phone number', async () => {
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

  test('should return status 200 (PUT /user/:id) when user update their password', async () => {
    const payload = {
      password: defaultUser.password,
      new_password: 'random-new-password',
    }

    await supertest(BASE_URL)
      .put(`/user/${defaultUser.id}`)
      .set(headers)
      .send(payload)
      .expect(200)
  })

  test('should return status 200 (PUT /user/password/set_password/:id) when user send a new password', async () => {
    const payload = {
      reset_password_token: defaultUser.reset_password_token,
      password: 'my-new-password',
      password_confirmation: 'my-new-password',
    }

    await supertest(BASE_URL)
      .put(`/user/password/set_password/${defaultUser.id}`)
      .send(payload)
      .expect(200)
  })

  test('should return status 200 (PUT /user/password/change_password) when user request password recovery', async () => {
    const payload = { email: defaultUser.email }

    /** NOTE: A longer timeout is necessary here because this controller's method invokes an email service. */
    await supertest(BASE_URL)
      .put('/user/password/change_password')
      .timeout(50000)
      .send(payload)
      .expect(200)
  }).timeout(50000)

  test('should return status 404 (DELETE /user/:id) when an admin user tries to delete a non-existent user', async () => {
    await supertest(BASE_URL)
      .delete(`/user/${defaultUser.id + 25}`)
      .set(headers)
      .expect(404)
  })

  test('should return status 200 (DELETE /user/:id) when an admin user deletes a user', async () => {
    await supertest(BASE_URL)
      .delete(`/user/${defaultUser.id}`)
      .set(headers)
      .expect(200)
  })
})
