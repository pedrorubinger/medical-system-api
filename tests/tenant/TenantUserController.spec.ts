import test from 'japa'
import supertest from 'supertest'

import { BASE_URL } from '../utils/urls'
import { generateTestAuth } from '../utils/authentication'
import {
  defaultDeveloperUser,
  defaultDeveloperUserTwo,
  defaultUser,
} from 'Database/seeders/02_User'
import { Role } from 'App/Models/User'

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

  test('should return status 200 (GET /tenant_user) when a master user (developer) fetches all users passing prop owner_tenant', async () => {
    const response = await generateTestAuth(
      defaultDeveloperUser.email,
      defaultDeveloperUser.password
    )

    await supertest(BASE_URL)
      .get('/tenant_user')
      .set({ ...response.headers, owner_tenant: true })
      .expect(200)
      .timeout(50000)
  }).timeout(50000)

  test('should return status 201 (POST /tenant_user) when an admin user try to create a user', async () => {
    const payload = {
      email: 'zac222222125k@test.com',
      password: 'zack123',
      password_confirmation: 'zack123',
      role: 'doctor' as Role,
      crm_document: 'CRM1299998992345',
      name: 'Zack Doe',
      phone: '12324534384',
      cpf: '1294456685576231',
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

  test('should return status 201 (POST /tenant_user) when a master user (developer) try to create a user', async () => {
    const response = await generateTestAuth(
      defaultDeveloperUser.email,
      defaultDeveloperUser.password
    )

    const payload = {
      email: 'z1293ack@test.com',
      password: 'zack123',
      password_confirmation: 'zack123',
      role: 'doctor' as Role,
      crm_document: 'CRM22122345',
      name: 'Zack Doe Two',
      phone: '1245343849291',
      cpf: '1298552221',
      is_admin: false,
      owner_tenant: false,
      tenant_id: defaultUser.tenant_id,
    }

    /** NOTE: A longer timeout is necessary here because this controller's method invokes an email service. */
    await supertest(BASE_URL)
      .post('/tenant_user')
      .timeout(50000)
      .set(response.headers)
      .send(payload)
      .expect(201)
  }).timeout(50000)

  test('should return status 404 (DELETE /tenant_user/:id) when an admin user tries to delete a non-existent user', async () => {
    await supertest(BASE_URL)
      .delete(`/tenant_user/${defaultUser.id * -15}`)
      .set(headers)
      .expect(404)
  })

  test('should return status 400 (DELETE /tenant_user) when an admin user try to delete a user without provide the tenant_id', async () => {
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

  test('should return status 201 (POST /tenant_user) when a master user (developer) try to create a user (owner tenant)', async () => {
    const response = await generateTestAuth(
      defaultDeveloperUser.email,
      defaultDeveloperUser.password
    )

    const payload = {
      email: 'mkd8f798@test.com',
      password: 'mm1k2k123',
      password_confirmation: 'mm1k2k123',
      role: 'doctor' as Role,
      crm_document: 'CRM22100091',
      name: 'Zack Doe Three',
      phone: '12451972879091',
      cpf: '12901812673',
      is_admin: false,
      owner_tenant: true,
      tenant_id: defaultUser.tenant_id,
    }

    /** NOTE: A longer timeout is necessary here because this controller's method invokes an email service. */
    await supertest(BASE_URL)
      .post('/tenant_user')
      .timeout(50000)
      .set(response.headers)
      .send(payload)
      .expect(201)
  }).timeout(50000)

  test('should return status 400 (DELETE /tenant_user/:id) when a master user (developer) try to delete a user providing no tenant_id', async () => {
    const response = await generateTestAuth(
      defaultDeveloperUser.email,
      defaultDeveloperUser.password
    )

    await supertest(BASE_URL)
      .delete(`/tenant_user/${defaultUser.id}`)
      .set(response.headers)
      .expect(400)
      .timeout(50000)
  }).timeout(50000)

  test('should return status 200 (DELETE /tenant_user/:id) when a master user (developer) deletes a user providing owner_tenant', async () => {
    const response = await generateTestAuth(
      defaultDeveloperUser.email,
      defaultDeveloperUser.password
    )

    await supertest(BASE_URL)
      .delete(`/tenant_user/${defaultDeveloperUserTwo.id}`)
      .set({ ...response.headers, owner_tenant: true })
      .expect(200)
      .timeout(50000)
  }).timeout(50000)
})
