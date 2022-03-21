import test from 'japa'
import supertest from 'supertest'

import { BASE_URL } from '../utils/urls'
import { generateTestAuth } from '../utils/authentication'
import { defaultDeveloperUserTwo, defaultUser } from 'Database/seeders/02_User'
import { TRole } from 'App/Models/User'

/** TO DO: Implement more test cases... */
test.group('TenantUserController', (group) => {
  let headers: Object

  group.before(async () => {
    const response = await generateTestAuth(
      defaultDeveloperUserTwo.email,
      defaultDeveloperUserTwo.password
    )

    headers = {
      ...response.headers,
      tenant_id: defaultUser.tenant_id.toString(),
    }
  })

  test('should return status 200 (GET /tenant_user) when an admin user fetches all users', async () => {
    await supertest(BASE_URL).get('/tenant_user').set(headers).expect(200)
  })

  test('should return status 400 (GET /tenant_user) when an admin user fetches all users without provide the tenant_id', async () => {
    await supertest(BASE_URL)
      .get('/tenant_user')
      .set({ ...headers, tenant_id: null })
      .expect(400)
  })

  test('should return status 201 (POST /tenant_user) when an admin user try to create a user', async () => {
    const payload = {
      email: 'zack@test.com',
      password: 'zack123',
      password_confirmation: 'zack123',
      role: 'doctor' as TRole,
      crm_document: 'CRM122345',
      name: 'Zack Doe',
      phone: '124534384',
      cpf: '12985576231',
      is_admin: false,
      owner_tenant: false,
      tenant_id: defaultUser.tenant_id,
    }

    /** NOTE: A longer timeout is necessary here because this controller's method invokes an email service. */
    await supertest(BASE_URL)
      .post('/tenant_user')
      .timeout(50000)
      .set(headers)
      .send(payload)
      .expect(201)
  }).timeout(50000)

  test('should return status 404 (DELETE /tenant_user/:id) when an admin user tries to delete a non-existent user', async () => {
    await supertest(BASE_URL)
      .delete(`/tenant_user/${defaultUser.id * -15}`)
      .set(headers)
      .expect(404)
  })

  test('should return status 400 (GET /tenant_user) when an admin user try to delete a user without provide the tenant_id', async () => {
    await supertest(BASE_URL)
      .delete(`/tenant_user/${defaultUser.id}`)
      .set({ ...headers, tenant_id: null })
      .expect(400)
  })

  test('should return status 200 (DELETE /tenant_user/:id) when an admin user deletes a user', async () => {
    await supertest(BASE_URL)
      .delete(`/tenant_user/${defaultUser.id}`)
      .set(headers)
      .expect(200)
  })
})
